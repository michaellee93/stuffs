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

            server.create("link", { outcontent: 8, incontent: 2 });
            server.create("link", { outcontent: 3, incontent: 2 });
            server.create("link", { outcontent: 3, incontent: 1 });
        },

        routes() {
            this.namespace = "api";

            // get docs
            this.get("http://localhost:5000/docs", (schema, request) => {
                let q = request.queryParams["block_type"];
                var m = 0;
                for (var i = 0; i < block_types.length; i++) {
                    if (block_types[i].name.toLowerCase() == q) {
                        m = block_types[i].id;
                        break;
                    }
                }

                let c = schema.contents.where(c => c.content_type == m && c.published_at !== "0001-01-01T00:00:00Z").models;
                console.log(c);
                var maxVersion = {};
                c.forEach(e => {
                    if (!maxVersion[e.attrs._id]) { maxVersion[e.attrs._id] = e.attrs.version; }
                    if (e.attrs.version > maxVersion[e.attrs._id]) { maxVersion[e.attrs._id] = e.attrs.version }
                })
                console.log(maxVersion);
                let curr = schema.contents.where(c => c.content_type == m && c.version == maxVersion[c._id]).models;
                console.log(curr);
                return curr.map(e => { e.id = e._id; e._id = undefined; return e })
            });

            // get a document
            this.get("http://localhost:5000/doc/:id", (schema, request) => {
                let id = request.params.id;
                let docs = schema.contents.where({ _id: id }).models;
                let maxv = docs.reduce((a, e) => e.version > a ? e.version : a, 1);
                let c = schema.contents.findBy({ _id: id, version: maxv });
                c.id = c._id;
                c._id = undefined;
                return c.attrs;
            });

            // publish draft
            this.put("http://localhost:5000/doc/:id", (schema, request) => {
                // create doc
                let id = Number(request.params.id);
                let body = JSON.parse(request.requestBody)
                body.published_at = new Date().toISOString();

                // links
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
                            let exists = schema.contents.findBy(c => c.content.title === e);
                            if (exists) {
                                // exists
                                linksAdd.push(exists._id);
                            } else {
                                // it doesnt
                                max++;
                                let newc = schema.contents.create({ _id: max, content: { title: e }, version: 1, published_at: new Date().toISOString(), content_type: 4, owner_id: 0 });
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

                let c = schema.contents.findBy(c => c._id === Number(id) && c.published_at === "0001-01-01T00:00:00Z")
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

                let cont = schema.contents.where((c) => c._id === id).models;
                let maxv = cont.reduce((a, e) => {
                    if (e.version > a) {
                        return e.version;
                    }
                    return a;
                }, 1);
                //here
                let currentVersion = schema.contents.findBy(c => c._id === id && c.version === maxv)
                currentVersion.attrs['published_at'] = "0001-01-01T00:00:00Z"
                currentVersion.attrs['created_at'] = new Date().toISOString();
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
                let c = schema.contents.where(e => set.has(e._id)).models.map(e => {
                    e.id = e._id;
                    e._id = undefined;
                    return e;
                })
                return c;
            });

            this.get("http://localhost:5000/titles", (schema) => {
                let c = schema.contents.where(c => c.content_type == 1 && c.published_at !== "0001-01-01T00:00:00Z").models;
                var maxVersion = {};
                c.forEach(e => {
                    if (!maxVersion[e.attrs._id]) { maxVersion[e.attrs._id] = e.attrs.version; }
                    if (e.attrs.version > maxVersion[e.attrs._id]) { maxVersion[e.attrs._id] = e.attrs.version }
                })
                let defs = schema.contents.where(c => c.content_type == 1 && c.version == maxVersion[c._id]).models
                let out = {};
                defs.forEach(e => {
                    out[e.content.title.toLowerCase()] = e._id;
                })
                return out;

            })

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
            })

            this.passthrough("https://kit.fontawesome.com/*");
            this.passthrough("https://ka-f.fontawesome.com/*")
        }
    })
    return server
}

let block_types = [
    {
        "id": 1,
        "name": "Definition",
        "description": ""
    },
    {
        "id": 2,
        "name": "ICS",
        "description": ""
    },
    {
        "id": 3,
        "name": "Process",
        "description": ""
    },
    {
        "id": 4,
        "name": "URL",
        "description": "url identifier"
    },
    {
        "id": 5,
        "name": "Product",
        "description": ""
    },
    {
        "id": 6,
        "name": "Guidance",
        "description": ""
    },
    {
        "id": 7,
        "name": "Standard",
        "description": ""
    }
];

let blidx = [];
block_types.forEach(e => blidx[e.id] = e.name.toLowerCase());

let content = [
    { "_id": 1, "version": 1, "owner_id": 0, "content_type": 1, "created_at": "2022-02-07T12:14:07.700969Z", "published_at": "2022-02-07T12:14:07.700969Z", "draft": true, "content": { "Definition": { "type": "doc", "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Approval from the wife required" }] }] }, "title": "Level 2" } },
    { "_id": 2, "version": 1, "owner_id": 0, "content_type": 1, "created_at": "2022-02-07T12:14:07.700969Z", "published_at": "2022-02-07T12:14:07.700969Z", "draft": true, "content": { "Definition": { "type": "doc", "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Any relation through blood or law" }] }] }, "title": "Family" } },
    { "_id": 3, "version": 1, "owner_id": 0, "content_type": 7, "created_at": "2022-02-07T12:14:07.700969Z", "published_at": "2022-02-07T12:14:07.700969Z", "draft": true, "content": { "name": "", "title": "Baking a Cake", "Standards": [{ "type": "doc", "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Rise must be 8cm from top to bottom" }] }] }, { "type": "doc", "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Temperature inside the cake must have reached 150C" }] }] }, { "type": "doc", "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Circular Tin only" }] }] }, { "type": "doc", "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Plastic (Microwave only) or Aluminium" }] }] }], "Pathways": [{ "type": "doc", "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Size: \u003c10cm" }] }] }, { "type": "doc", "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Audience: " }, { "type": "text", "marks": [{ "type": "link", "attrs": { "href": "https://work-math-demo.herokuapp.com/#/doc/2", "target": "_blank" } }], "text": "Family" }] }] }, { "type": "doc", "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Ingredients: Any" }] }] }, { "type": "doc", "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Total Cost: \u003c$50" }] }] }], "Restrictions": [{ "type": "doc", "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Microwave: Level 1" }] }] }, { "type": "doc", "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Oven: " }, { "type": "text", "marks": [{ "type": "link", "attrs": { "href": "https://work-math-demo.herokuapp.com/#/doc/2", "target": "_blank" } }], "text": "Level 2" }] }] }] } },
    { "_id": 6, "version": 1, "owner_id": 0, "content_type": 3, "created_at": "2022-02-07T12:14:07.700969Z", "published_at": "2022-02-07T12:14:07.700969Z", "draft": true, "content": { "Category": "Origination", "Steps": [{ "type": "doc", "content": [{ "type": "heading", "attrs": { "level": 3 }, "content": [{ "type": "text", "text": "Set the timer" }] }, { "type": "paragraph", "content": [{ "type": "text", "text": "Begin by setting the timer to 10 minutes" }] }] }, { "type": "doc", "content": [{ "type": "heading", "attrs": { "level": 3 }, "content": [{ "type": "text", "text": "Set the power" }] }, { "type": "paragraph", "content": [{ "type": "text", "text": "Ensure power on the microwave is set to 500W to avoid burning" }] }] }], "title": "Heat in microwave" } },
    { "_id": 7, "version": 1, "owner_id": 0, "content_type": 5, "created_at": "2022-02-07T12:14:07.700969Z", "published_at": "2022-02-07T12:14:07.700969Z", "draft": true, "content": { "Product Family": "Commercial Lending", "Overview": { "type": "doc", "content": [{ "type": "heading", "attrs": { "level": 4 }, "content": [{ "type": "text", "text": "Product overview" }] }, { "type": "paragraph", "content": [{ "type": "text", "text": "Packet cake mix helps speed up the process of baking the cake." }] }, { "type": "paragraph" }, { "type": "heading", "attrs": { "level": 4 }, "content": [{ "type": "text", "text": "Eligibility" }] }, { "type": "paragraph", "content": [{ "type": "text", "text": "Can be used by people baking in the home." }] }, { "type": "paragraph", "content": [{ "type": "text", "text": "Not permitted for restaurants." }] }, { "type": "paragraph" }, { "type": "heading", "attrs": { "level": 4 }, "content": [{ "type": "text", "text": "Varying options" }] }, { "type": "bulletList", "content": [{ "type": "listItem", "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Betty Crocker" }] }] }, { "type": "listItem", "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Nestle" }] }] }, { "type": "listItem", "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Greens" }] }] }] }] }, "Pricing": { "type": "doc", "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Packet Pricing" }] }, { "type": "table", "content": [{ "type": "tableRow", "content": [{ "type": "tableHeader", "attrs": { "colspan": 1, "rowspan": 1, "colwidth": null }, "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Brand" }] }] }, { "type": "tableHeader", "attrs": { "colspan": 1, "rowspan": 1, "colwidth": null }, "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Cost" }] }] }] }, { "type": "tableRow", "content": [{ "type": "tableCell", "attrs": { "colspan": 1, "rowspan": 1, "colwidth": null }, "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Betty Crocker" }] }] }, { "type": "tableCell", "attrs": { "colspan": 1, "rowspan": 1, "colwidth": null }, "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "$4.99" }] }] }] }, { "type": "tableRow", "content": [{ "type": "tableCell", "attrs": { "colspan": 1, "rowspan": 1, "colwidth": null }, "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Nestle" }] }] }, { "type": "tableCell", "attrs": { "colspan": 1, "rowspan": 1, "colwidth": null }, "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "$7.00" }] }] }] }] }] }, "Technical": { "type": "doc", "content": [{ "type": "heading", "attrs": { "level": 4 }, "content": [{ "type": "text", "text": "Instructions" }] }, { "type": "paragraph", "content": [{ "type": "text", "text": "Instructions included on the box" }] }] }, "title": "Cake Mix" } },
    { "_id": 8, "version": 1, "owner_id": 0, "content_type": 6, "created_at": "2022-02-07T12:14:07.700969Z", "published_at": "2022-02-07T12:14:07.700969Z", "draft": true, "content": { "Industry": "Manufacturing", "At a Glance": { "type": "doc", "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Picnics in the park are usually completed together with friends and " }, { "type": "text", "marks": [{ "type": "link", "attrs": { "href": "https://work-math-demo.herokuapp.com/#/docs/2", "target": "_blank" } }], "text": "family" }] }] }, "Banking": { "type": "doc", "content": [{ "type": "heading", "attrs": { "level": 4 }, "content": [{ "type": "text", "text": "Key considerations" }] }, { "type": "table", "content": [{ "type": "tableRow", "content": [{ "type": "tableHeader", "attrs": { "colspan": 1, "rowspan": 1, "colwidth": null }, "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Risk" }] }] }, { "type": "tableHeader", "attrs": { "colspan": 1, "rowspan": 1, "colwidth": null }, "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Consideration" }] }] }] }, { "type": "tableRow", "content": [{ "type": "tableCell", "attrs": { "colspan": 1, "rowspan": 1, "colwidth": null }, "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Heat" }] }] }, { "type": "tableCell", "attrs": { "colspan": 1, "rowspan": 1, "colwidth": null }, "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Can impact the food and spoil if not appropriately cooled." }] }] }] }, { "type": "tableRow", "content": [{ "type": "tableCell", "attrs": { "colspan": 1, "rowspan": 1, "colwidth": null }, "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Weather" }] }] }, { "type": "tableCell", "attrs": { "colspan": 1, "rowspan": 1, "colwidth": null }, "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Cities with weather that can rapidly change can pose a risk to picnics as it can impact the enjoyment of the outing. " }] }] }] }] }] }, "title": "Picnic" } },
    { "_id": 9, "version": 1, "owner_id": 0, "content_type": 2, "created_at": "2022-02-07T12:14:07.700969Z", "published_at": "2022-02-07T12:14:07.700969Z", "draft": true, "content": { "Industry": "Manufacturing", "Client Type": "Business Banking", "Security": "N/A", "Metrics": { "type": "doc", "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "PD D2" }] }, { "type": "paragraph", "content": [{ "type": "text", "text": "LGD N" }] }] }, "title": "Picnics" } }
]

/*

let schemas = [

]
/*
{
    name: String,
    version: 0,
    fields: {
        fieldName: {
            type: block | blocks | resource | input | select | multipleSelect,

        }
    }
}


{

}


*/





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


