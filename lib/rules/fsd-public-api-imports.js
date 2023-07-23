
"use strict";
const { isPathRelative } = require("../helpers");
const micromatch = require("micromatch");

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: "problem", // `problem`, `suggestion`, or `layout`
    docs: {
      description: " ",
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: "code", // Or `code` or `whitespace`
    schema: [{ 
      type: "object",
      properties: {
        alias: {
          type: "string"
        },
        testFilesPatterns: {
          type: "array"
        }
      }
    }],
    messages: {
      absolute_imports: "Absolute imports are allowed only from Public APIs",
      testing_absolute_imports: "Testing data needs to be imported from testing public api"
    }
  },

  create(context) {
    const { alias = "", testFilesPatterns = [] } = context.options[0] || {}

    const layersToCheck = {
      entities: "entities",
      features: "features",
      pages: "pages",
      widgets: "widgets"
    };
    return {
      ImportDeclaration(node) {

        const { value: valueFrom } = node.source;
        const importFrom = alias ? valueFrom.replace(`${alias}/`, "") : valueFrom;

        if (isPathRelative(importFrom)) {
            return
        }
        
        const segments = importFrom.split("/");
        const layer = segments[0];
        const slice = segments[1];
        const isImportNotFromPublicApi = segments.length > 2;

        const isTestingPublicApi = segments[2] === "testing" && segments.length < 4;

        const currentFilePath = context.getFilename().replaceAll("\\", "/");
        const isCurrentFileTesting = testFilesPatterns.some((pattern) => {
          return micromatch.isMatch(currentFilePath, pattern)
        });
        
        if (!layersToCheck[layer]) {
          return
        }

        if (isImportNotFromPublicApi && !isTestingPublicApi && !isCurrentFileTesting) {
          context.report({
            node, messageId: "absolute_imports", fix: (fixer) => {
              return fixer.replaceText(node.source, `"${alias}/${layer}/${slice}"`);
          } })
        }

        if ((!isTestingPublicApi && isCurrentFileTesting )) {
          context.report({
            node, messageId: "testing_absolute_imports", fix: (fixer) => {
              return fixer.replaceText(node.source, `"${alias}/${layer}/${slice}/testing"`);
            }
          })
        } else if (isTestingPublicApi && !isCurrentFileTesting) {
          context.report({
            node, messageId: "testing_absolute_imports", fix: (fixer) => {
              return fixer.replaceText(node.source, `"${alias}/${layer}/${slice}"`);
            }
          })
        }
      }
    };
  }
};
