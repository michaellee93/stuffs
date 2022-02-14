window.schemas = [
    // Definition
    {
        Title: { type: "input" },
        Definition: { type: "block" },
    },
    //ICS
    {
        //ics
        Title: { type: "input" },
        Industry: {
            type: "drop",
            values: [
                "Manufacturing",
                "Retail",
                "Wholesale",
                "Agriculture",
                "Construction",
            ],
        },
        "Client Type": {
            type: "drop",
            values: ["Business Banking", "Institutional"],
        },
        Anzics: {
            type: "tag",
        },
        Security: {
            type: "drop",
            values: ["Unsecured", "Secured", "N/A"],
        },
        Metrics: { type: "block" },
    },

    // Process
    {
        Title: { type: "input" },
        Category: { type: "drop", values: ["Origination", "Maintenance"] },
        Steps: { type: "blocks" },
    },
    //URL
    { URL: { type: "input" } },
    //Product
    {
        Title: { type: "input" },
        "Product Family": {
            type: "drop",
            values: ["Cash Management", "Commercial Lending"],
        },
        Overview: { type: "block" },
        Pricing: { type: "block" },
        Technical: { type: "block" },
        Processes: { type: "block" },
    },
    //Guidance
    {
        Title: { type: "input" },
        Industry: {
            type: "drop",
            values: ["Manufacturing", "Retail"],
        },
        "At a Glance": { type: "block" },
        Banking: { type: "block" },
    },

    // Credit standards
    {
        Title: { type: "input" },
        Standards: { type: "resource" },
        Pathways: { type: "resource" },
        Restrictions: { type: "resource" },
    },
];