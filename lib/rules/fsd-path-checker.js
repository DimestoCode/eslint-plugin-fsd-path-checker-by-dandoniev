"use strict";
const path = require("path");

module.exports = {
    meta: {
        type: "problem", // `problem`, `suggestion`, or `layout`
        docs: {
            description: "validation of imports for fsd methodology",
            recommended: false,
            url: null // URL to the documentation page for this rule
        },
        fixable: null, // Or `code` or `whitespace`
        schema: [
            { 
                type: "object",
                properties: {
                    alias: {
                        type: "string"
                    }
                }
            }
        ],
        messages: {
            same_slice: "Imports should be relative in scope of one slice"
        } // Add a schema if the rule has options
    },

    create(context) {
        const { alias = "" } = context.options[0] || {}
        return {
            ImportDeclaration(node) {
                // example = app/entities/Article;

                const { value: valueFrom } = node.source;
                const importFrom = alias ? valueFrom.replace(`${alias}/`, "") : valueFrom;
                const importTo =  context.getFilename();

                if (shouldBeRelative(importFrom, importTo)) {
                    context.report({ node, messageId: "same_slice" });
                }
            }
        };
    }
};

function isPathRelative(path) {
  return path=== "." || path.startsWith("./") || path.startsWith("./");
}

const layers = {
    entities: "entities",
    features: "features",
    shared: "shared",
    pages: "pages",
    widgets: "widgets"
};

function shouldBeRelative(from, to) {
    if (isPathRelative(from)) {
        return false;
    }

    const pathDivider = new RegExp(/\\|\//);

    // example: entities/Articles

    const fromArray = from.split(pathDivider);

    const fromLayer = fromArray[0]; // entities
    const fromSlice = fromArray[1]; // Articles

    if (!fromLayer || !fromSlice || !layers[fromLayer]) {
        return false;
    }

    // C:\Users\dando\Desktop\Pet_Project\src\entities\Articles
    const normalizedPath = path.toNamespacedPath(to);
    const projectFrom = normalizedPath.split("src")[1];
    const toArray = projectFrom.split(pathDivider);

    const toLayer = toArray[1];
    const toSlice = toArray[2];

    if (!toLayer || !toSlice || !layers[toLayer]) {
        return false;
    }

    return fromSlice === toSlice && toLayer === fromLayer;
}
