import { createServer, Model, Factory } from "miragejs"

export function makeServer({ environment = "development" } = {}) {
    let server = createServer({
        environment,

        models: {
            content: Model,
            block_type: Model,
            link: Model,
            searchTerms: Model,
        },

        factories: {
            content: Factory.extend({
                id(i) { return i },
                content() { return {} },
                version() { return 1 },
                created_at() { return new Date().getTime() },
                published_at() { return "0001-01-01T00:00:00Z" }
            })
        },

        seeds(server) {
            content.forEach(e => {
                server.create("content", e);
            });

            block_types.forEach(e => {
                server.create("block_type", e);
            });

            baselineLinks.forEach(e => {
                server.create("link", e)
            });

        },

        routes() {
            this.namespace = "api";

            // get docs
            this.get("http://localhost:5000/docs", (schema, request) => {
                let q = request.queryParams["block_type"];
                var m = 0;
                for (var i = 0; i < block_types.length; i++) {
                    if (block_types[i].name.toLowerCase().replaceAll(' ', "_") == q) {
                        m = block_types[i].id;
                        break;
                    }
                }

                let c = schema.contents.where(c => c.content_type == m && c.published_at !== "0001-01-01T00:00:00Z").models;

                let curr = c.reduce((a, e) => {
                    if (!a[e._id] || e.version > a[e._id]) {
                        a[e._id] = e;
                    }
                    console.log(a);
                    return a;
                }, []).filter(e => e !== undefined)
                return curr.map(e => { e.id = e._id; e._id = undefined; return e })
            });

            // get a document
            this.get("http://localhost:5000/doc/:id", (schema, request) => {
                let id = Number(request.params.id);

                let docs = schema.contents.where((c) => c._id == id && c.published_at !== "0001-01-01T00:00:00Z").models;
                console.log(docs)
                let current = docs.reduce((a, e) => {
                    if (!a || e.version > a.version) return e
                    return a
                });
                /*let maxv = docs.reduce((a, e) => e.version > a ? e.version : a, 1);
                let c = schema.contents.findBy({ _id: id, version: maxv });*/
                current.id = current._id;
                current._id = undefined;
                return current.attrs;
            });

            // publish draft
            this.put("http://localhost:5000/doc/:id", (schema, request) => {
                // create doc
                let id = Number(request.params.id);
                let body = JSON.parse(request.requestBody)
                let now = new Date().toISOString();

                links
                let links = parseOutLinks(body);
                let linksAdd = [];
                let max = schema.contents.all().models.reduce((a, e) => {
                    if (e._id > a) {
                        return e._id;
                    }
                    return a;
                }, 0);

                links?.forEach(e => {
                    if (e) {
                        if (e.startsWith("/#/doc")) {
                            // internal link                        
                            let ch = e.split("/");
                            let id = Number(ch[ch.length - 1]);
                            linksAdd.push(id);
                        } else {
                            // external link
                            // does it exist?
                            let exists = schema.contents.findBy(c => c.content.URL === e);
                            if (exists) {
                                // exists
                                linksAdd.push(exists._id);
                            } else {
                                // it doesnt
                                max++;
                                let newc = schema.contents.create(
                                    {
                                        _id: max, content: { URL: e },
                                        version: 1,
                                        published_at: new Date().toISOString(),
                                        content_type: 4,
                                        owner_id: 0
                                    });
                                linksAdd.push(newc._id);
                            }
                        }
                    }
                });

                // delete links
                schema.links.where({ outcontent: id }).models.forEach(m => m.destroy());

                // create links
                linksAdd.forEach(l => {
                    schema.links.create({ outcontent: id, incontent: l, created_at: new Date().toISOString() })
                });


                let c = schema.contents.findBy(c => c._id === Number(id) && c.version === body.version)
                c.update('published_at', now);
                c.update('content', body.content);
                c.update('content_type', body.content_type)
                c.update(body);
                return c.attrs
            });

            // create draft
            this.post("http://localhost:5000/doc/:id", (schema, request) => {
                // create drafts
                let id = Number(request.params.id);

                // check if there is a draft
                let draft = schema.contents.findBy({ _id: id, published_at: "0001-01-01T00:00:00Z" })
                if (draft) {
                    draft.id = draft._id;
                    draft._id = undefined;
                    return draft.attrs
                }

                let cont = schema.contents.where((c) => c._id === id).models/*.reduce((a, e) => {
                    if (!a || e.version > a.version) return e;
                    return a;
                });*/

                let maxv = cont.reduce((a, e) => {
                    if (e.version > a) {
                        return e.version;
                    }
                    return a;
                }, 1);

                //here
                let currentVersion = schema.contents.findBy(c => c._id === id && c.version === maxv)
                currentVersion.published_at = "0001-01-01T00:00:00Z"
                currentVersion.created_at = new Date().toISOString();
                currentVersion.version = maxv + 1;

                currentVersion.id = undefined;
                currentVersion._id = id;

                let newVersion = schema.contents.create(currentVersion.attrs);
                newVersion.id = newVersion._id;
                newVersion._id = undefined
                return newVersion.attrs;
            });

            // create document
            this.post("http://localhost:5000/doc", (schema) => {
                let max = schema.contents.all().models.reduce((a, e) => {
                    if (e._id > a) {
                        return e._id;
                    }
                    return a;
                }, 0);
                let newc = schema.contents.create({ _id: max + 1, content: {}, version: 1, published_at: "0001-01-01T00:00:00Z", content_type: 1 });
                newc.id = newc._id;
                newc._id = undefined;
                return newc.attrs
            });

            this.get("http://localhost:5000/drafts", (schema) => {
                let drafts = [schema.contents.where({ published_at: "0001-01-01T00:00:00Z", content_type: 1 }).models,
                schema.contents.where({ published_at: "0001-01-01T00:00:00Z", content_type: 2 }).models,
                schema.contents.where({ published_at: "0001-01-01T00:00:00Z", content_type: 3 }).models,
                schema.contents.where({ published_at: "0001-01-01T00:00:00Z", content_type: 4 }).models,
                schema.contents.where({ published_at: "0001-01-01T00:00:00Z", content_type: 5 }).models,
                schema.contents.where({ published_at: "0001-01-01T00:00:00Z", content_type: 6 }).models,
                schema.contents.where({ published_at: "0001-01-01T00:00:00Z", content_type: 7 }).models];
                var map = {};
                for (var i = 0; i < drafts.length; i++) {
                    if (drafts[i].length > 0) {
                        let content = blidx[i + 1]
                        map[`${content}`] = drafts[i].map(e => { e.id = e._id; e._id = undefined; return e });
                    }
                }

                return map
            });

            this.get("http://localhost:5000/doc/:id/draft", (schema, request) => {
                let id = request.params.id;
                let c = schema.contents.findBy(c => c._id == Number(id) && c.published_at === "0001-01-01T00:00:00Z");
                c.id = c._id;
                c._id = undefined;
                return c?.attrs;
            });

            // save draft
            this.put("http://localhost:5000/doc/:id/draft", (schema, request) => {
                let id = request.params.id;
                let body = JSON.parse(request.requestBody)
                let c = schema.contents.findBy(c => c._id === id && c.published_at === "0001-01-01T00:00:00Z")
                c.update(body);
                return {};
            });

            this.get("http://localhost:5000/links/:id", (schema, request) => {
                let id = Number(request.params.id);
                let set = new Set();
                schema.links.where({ incontent: id }).models.forEach(e => {
                    set.add(e.outcontent);
                });
                let c = schema.contents.where(e => set.has(e._id)).models.reduce((a, e) => {
                    if (!a[e._id] || e.version > a[e._id]) {
                        a[e._id] = e;
                    }
                    return a
                }, []).filter(e => e !== undefined);

                return c.map(e => {
                    e.id = e._id;
                    e._id = undefined;
                    return e;
                })
            });

            this.get("http://localhost:5000/titles", (schema) => {
                let c = schema.contents.where(c => c.content_type == 1 && c.published_at !== "0001-01-01T00:00:00Z").models;

                let defs = c.reduce((a, e) => {
                    if (!a[e._id] || e.version > a[e._id]) {
                        a[e._id] = e;
                    }
                    return a;
                }, []).filter(e => e !== undefined)

                let out = {};
                defs.forEach(e => {
                    out[e.content.Title.toLowerCase()] = e._id;
                })
                return out;

            });

            this.get("http://localhost:5000/search", (schema, request) => {
                let query = request.queryParams.q;
                console.log(query)
                let reg = new RegExp(query.split(" ").reduce((a, e) => {
                    if (e.length === 0) return a;
                    return a + "|" + e
                }), "gi");
                return schema.contents.where(e => JSON.stringify(e).search(reg) > -1).models.map(e => {
                    e.id = e._id;
                    e._id = undefined;
                    return e;
                });
            });

            this.get("http://localhost:5000/doc/:id/versions", (schema, request) => {
                let id = Number(request.params.id)
                return schema.contents.where({ _id: id }).models.map(e => {
                    e.id = e._id;
                    e._id = undefined;
                    return e;
                });
            });

            this.get("http://localhost:5000/doc/:id/versions/:version", (schema, request) => {
                let id = Number(request.params.id);
                let version = Number(request.params.version);
                let c = schema.contents.findBy({ _id: id, version: version });
                c.id = c._id;
                c._id = undefined;
                return c.attrs;
            });

            this.passthrough("https://kit.fontawesome.com/*");
            this.passthrough("https://ka-f.fontawesome.com/*")
        }
    })
    return server
}

let block_types = window.schemas.map((e, i) => ({
    id: i + 1,
    name: e.name,
    description: "",
}));

let blidx = [];
block_types.forEach(e => blidx[e.id] = e.name.toLowerCase());


let content = window.baselineContent;

let baselineLinks = window.baselineLinks;

function parseOutLinks(document) {
    let content = document.content;
    let links = new Set();
    if (content) {
        let keys = Object.keys(content).filter(e => e.search(/title/gi) < 0);
        keys.forEach(key => {
            let root = content[key];
            if (root instanceof Array) {
                root.forEach(e => {
                    links.add(...extractLinks(e))
                })
            } else {
                links.add(...extractLinks(root))
            }
        })
    }
    return links;
}

function extractLinks(node) {
    let links = [];
    let marks = node.marks;
    if (marks) {
        marks.forEach(m => {
            console.log(m);
            if (m.type == "link") {
                links.push(m.attrs.href);
            }
        });
    }

    let children = node.content;
    if (children) {
        children.forEach(c => {
            links.push(...extractLinks(c));
        });
    }

    return links
}


