window.schemas = [
    // Definition
    {
        name: "Definition",
        fields: [
            {
                name: "Title",
                type: "text",
                required: true,
            },
            {
                name: "Definition",
                type: "block",
                required: true,
            },
        ]
    },
    //ICS
    {
        name: "Industry Credit Standard",
        fields: [
            {
                name: "Title",
                type: "text",
                required: true,
            },
            {
                name: "Industry",
                type: "select",
                values: [
                    "Manufacturing",
                    "Retail",
                    "Wholesale",
                    "Agriculture",
                    "Construction",
                ],
                required: true,
            },
            {
                name: "Client Type",
                type: "select",
                values: ["Business Banking", "Institutional"],
                required: true,
            },
            {
                name: "Anzics",
                type: "multiselect",
                values: [
                    "011 — Nursery and Floriculture Production",
                    "012 — Mushroom and Vegetable Growing",
                    "013 — Fruit Tree and Nut Growing",
                    "014 — Sheep, Beef Cattle and Grain Farming",
                    "015 — Other Crop Growing",
                    "016 — Dairy Cattle Farming",
                    "017 — Poultry Farming",
                    "018 — Deer Farming",
                    "019 — Other Livestock Farming",
                ],
                required: true,
            },
            {
                name: "Security",
                type: "select",
                values: ["Unsecured", "Secured", "N/A"],
                required: true,
            },
            {
                name: "Metrics",
                type: "block",
                required: true,
            }
        ],
    },

    // Process
    {
        name: "Process",
        fields: [
            {
                name: "Title",
                type: "text",
                required: true,
            },
            {
                name: "Category",
                type: "select",
                values: ["Origination", "Maintenance"],
                required: true,
            },
            {
                name: "Steps",
                type: "blocks",
                required: true,
            }
        ],
    },

    //URL
    {
        name: "URL",
        fields: [
            {
                name: "URL",
                type: "text",
                required: true,
            }
        ]
    },

    //Product
    {
        name: "Product",
        fields: [
            {
                name: "Title",
                type: "text",
                required: true,
            },
            {
                name: "Product Family",
                type: "select",
                values: ["Cash Management", "Commercial Lending"],
                required: true,
            },
            {
                name: "Overview",
                type: "block",
                required: true,
            },
            {
                name: "Pricing",
                type: "block",
                required: true,
            },
            {
                name: "Technical",
                type: "block",
                required: true,
            },
            {
                name: "Processes",
                type: "block",
                required: true,
            },
        ]
    },

    //Guidance
    {
        name: "Guidance",
        fields: [
            {
                name: "Title",
                type: "text",
                required: true,
            },
            {
                name: "Industry",
                type: "select",
                values: ["Manufacturing", "Retail"],
                required: true,
            },
            {
                name: "At a Glance",
                type: "block",
                required: true,
            },
            {
                name: "Banking",
                type: "block",
                required: true,
            },
        ],
    },

    // Credit standards
    {
        name: "Credit Standard",
        fields: [
            {
                name: "Title",
                type: "text",
                required: true,
            },
            {
                name: "Standards",
                type: "data",
                required: true,
            },
            {
                name: "Pathways",
                type: "data",
                required: true,
            },
            {
                name: "Restrictions",
                type: "data",
                required: true,
            },
        ]
    },

    // Policy
    {
        name: "Policy",
        fields: [
            {
                name: "Title",
                type: "text",
                required: true,
            },
            {
                name: "Purpose",
                type: "blocks",
            },
            {
                name: "Accountabilities",
                type: "blocks",
            },
            {
                name: "Compliance Statement",
                type: "blocks",
            },
            {
                name: "Breach of Policy",
                type: "blocks",
            },
            {
                name: "Definitions",
                type: "multiselect",
                values: ["Def1", "Def2"]
            },

        ]
    }
];



/*

Field = {
    name: String
    type: blocks | block | data | text | select | multiselect,
    values: Array | String // only for select, multiselect, data - either literal values or a table name
    required: Boolean,

}


Schema = {
    name: String,
    fields: [Field+]
}

*/