/**
 * @fileoverview  
 * @author Dima
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/fsd-public-api-imports"),
  RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 6, sourceType: "module" },
});
ruleTester.run("fsd-public-api-imports", rule, {
  valid: [{
    code: "import Item from \"@/entities/Article\"",
    options: [{ alias: "@" }]
  }, {
    code: "import AddArticle from \"@/features/AddArticle\"",
    options: [{ alias: "@" }]
    },
    {
      code: "import AddArticle from \"@/widgets/AddArticle\"",
      options: [{ alias: "@" }]
    },
    {
      filename: "C:\\Users\\dando\\Desktop\\Pet_Project\\src\\entities\\Article\\ui\\Article.test.tsx",
      code: "import { addCommentFormActions } from \"@/entities/Article/testing\";",
      options: [
        { testFilesPatterns: [ "**/*.test.{ts,tsx}", "**/StoreDecorator.tsx" ], alias: "@"}
      ]
    },
    {
      filename: "C:\\Users\\dando\\Desktop\\Pet_Project\\src\\entities\\Article\\ui\\StoreDecorator.tsx",
      code: "import { addCommentFormActions } from \"@/entities/Article/testing\";",
      options: [
        { testFilesPatterns: [ "**/*.test.ts", "**/*.test.tsx", "**/StoreDecorator.tsx" ], alias: "@"}
      ]
    }
  ],

  invalid: [
    {
      code: "import AddArticle from \"@/widgets/AddArticle/ui/Component\"",
      options: [{ alias: "@" }],
      errors: [{ messageId: "absolute_imports"}]
    },
    {
      filename: "C:\\Users\\dando\\Desktop\\Pet_Project\\src\\entities\\Article\\ui\\St.tsx",
      code: "import { addCommentFormActions } from \"@/entities/Article/testing\";",
      errors: [{ messageId: "testing_absolute_imports" }],
      options: [
        { testFilesPatterns: [ "**/*.test.{ts,tsx}", "**/StoreDecorator.tsx" ], alias: "@"}
      ]
    }
  ],
});
