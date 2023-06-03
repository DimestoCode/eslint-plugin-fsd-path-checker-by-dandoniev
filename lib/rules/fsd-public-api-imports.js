
"use strict";
const { isPathRelative } = require("../helpers");
/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: "problem", // `problem`, `suggestion`, or `layout`
    docs: {
      description: " ",
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: null, // Or `code` or `whitespace`
    schema: [{ 
      type: "object",
      properties: {
          alias: {
              type: "string"
          }
      }
    }],
    messages: {
      absolute_imports: "Absolute imports are allowed only from Public APIs"
    } // Add a schema if the rule has options// Add a schema if the rule has options
  },

  create(context) {
    const { alias = "" } = context.options[0] || {}

    const layersToCheck = {
      entities: "entities",
      features: "features",
      pages: "pages",
      widgets: "widgets"
    };
    return {
      ImportDeclaration(node) {
            // example = app/entities/Article;

        const { value: valueFrom } = node.source;
        const importFrom = alias ? valueFrom.replace(`${alias}/`, "") : valueFrom;

        if (isPathRelative(importFrom)) {
            return
        }
          
        
          
        const segments = importFrom.split("/");
        const layer = segments[0];
        const isImportNotFromPublicApi = segments.length > 2;
        
        if (!layersToCheck[layer]) {
          return
        }

        if (isImportNotFromPublicApi) {
          context.report({ node, messageId: "absolute_imports" })
        }
      }
    };
  }
};
