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


            this.get("http://localhost:5000/doc/:id", (schema, request) => {
                let id = request.params.id;
                let docs = schema.contents.where({ _id: id }).models;
                let maxv = docs.reduce((a, e) => e.version > a ? e.version : a, 1);
                let c = schema.contents.findBy({ _id: id, version: maxv });
                c.id = c._id;
                c._id = undefined;
                return c.attrs;
            });
            //publish draft
            this.put("http://localhost:5000/doc/:id", (schema, request) => {
                // create doc
                let id = request.params.id;
                let body = JSON.parse(request.requestBody)
                //j                body._id = Number(id);
                body.published_at = new Date().toISOString();
                let c = schema.contents.findBy(c => c._id === Number(id) && c.published_at === "0001-01-01T00:00:00Z")
                console.log(body, c);
                c.update(body);
                return c.attrs
            });
            // create draft
            this.post("http://localhost:5000/doc/:id", (schema, request) => {
                // create drafts
                let id = request.params.id;

                // check if there is a draft
                let draft = schema.contents.findBy({ _id: id, published_at: "0001-01-01T00:00:00Z" })
                if (draft) {
                    draft.id = draft._id;
                    draft._id = undefined;
                    console.log("DRAFT")
                    return draft.attrs
                }

                let cont = schema.contents.where((c) => c._id === id || c._id === `${id}`).models;
                let maxv = cont.reduce((a, e) => {
                    if (e.version > a) {
                        return e.version;
                    }
                    return a;
                }, 1);
                //here
                let currentVersion = schema.contents.findBy(c => c._id === Number(id) && c.version === maxv)
                currentVersion.attrs['published_at'] = "0001-01-01T00:00:00Z"
                currentVersion.attrs['created_at'] = new Date().toISOString();
                currentVersion.version = maxv + 1;

                currentVersion.id = undefined;
                currentVersion._id = Number(id);

                let newVersion = schema.contents.create(currentVersion.attrs);
                newVersion.id = newVersion._id;
                newVersion._id = undefined
                return newVersion.attrs;
            });
            // create document
            this.post("http://localhost:5000/doc", (schema) => {
                let len = schema.contents.all().models.length;
                let newc = schema.contents.create({ _id: len, content: {}, version: 1, published_at: "0001-01-01T00:00:00Z", content_type: 1 });
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
                console.log(c);
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
                console.log(set);
                let c = schema.contents.where(e => set.has(e._id)).models/*.map(e => {
                    return {
                        title: e.content.title,
                        id: e._id,
                    }
                });*/
                console.log(c);
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
                    out[e.content.title] = e._id;
                })
                return out;

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