"use strict";

const { getCurrentFileLayer, isPathRelative } = require("../helpers/index");
const micromatch = require("micromatch")

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: "problem", // `problem`, `suggestion`, or `layout`
    docs: {
      description: "validation fsd methodology layers' imports to forbid usage higher-level module in lower-level one",
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
          },
          ignoreImportPatterns: {
            type: "array"
          }
        }
      }
    ],
    messages: {
      HIGH_LEVEL_IMPORT: "Low level module cannot import high level modules"
    },
  },

  create(context) {
    const layers = {
      "app": ["pages", "widgets", "features", "entities", "shared"],
      "pages": ["widgets", "features", "entities", "shared"],
      "widgets": ["features", "entities", "shared"],
      "features": ["entities", "shared"],
      "entities": ["entities", "shared"],
      "shared": ["shared"]
    }

    const layersEnum = {
      "app": "app",
      "entities": "entities",
      "features": "features",
      "shared": "shared",
      "pages": "pages",
      "widgets": "widgets"
    }


    const { alias = "", ignoreImportPatterns = [] } = context.options[0] ?? {};

    const getImportLayer = (value) => {
      const importPath = alias ? value?.replace(`${alias}/`, "") : value;
      const segments = importPath?.split("/");

      return segments?.[0];
    }

    return {
      ImportDeclaration(node) {
        const importPath = node.source.value;
        const currentFileLayer = getCurrentFileLayer(context.getFilename());
        const importLayer = getImportLayer(importPath);

        if (isPathRelative(importPath)) {
          return;
        }

        if (!layersEnum[importLayer] || !layersEnum[currentFileLayer]) {
          return;
        }

        const isIgnored = ignoreImportPatterns.some((pattern) => {
          return micromatch.isMatch(importPath, pattern);
        });

        if (isIgnored) {
          return;
        }

        if (!layers[currentFileLayer]?.includes(importLayer)) {
          context.report({ node, messageId: "HIGH_LEVEL_IMPORT" })
        }
      }
    };
  }

}
