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
  ],

  invalid: [
    {
      code: "import AddArticle from \"@/widgets/AddArticle/ui/Component\"",
      options: [{ alias: "@" }],
      errors: [{ messageId: "absolute_imports"}]
    },
  ],
});
