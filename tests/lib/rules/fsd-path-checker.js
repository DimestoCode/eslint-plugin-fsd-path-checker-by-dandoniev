/**
 * @fileoverview validation of imports for fsd methodology
 * @author Dima
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/fsd-path-checker"),
  RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 6, sourceType: "module" },
});

ruleTester.run("fsd-path-checker", rule, {
  valid: [
    {
      filename: "C:\\Users\\dando\\Desktop\\Pet_Project\\src\\entities\\Article\\ui\\Article.tsx",
      code: "import { addCommentFormActions } from \"../../model/slices/addCommentForm\";",
      errors: [{ message: "Imports should be relative in scope of one slice"}],
    },
  ],

  invalid: [
    {
      filename: "C:\\Users\\dando\\Desktop\\Pet_Project\\src\\entities\\Article\\ui\\Article.tsx",
      code: "import { addCommentFormActions } from \"@/entities/Article/model/slices/addCommentForm\";",
      errors: [{ message: "Imports should be relative in scope of one slice" }],
      options: [{ alias: "@" }],
      output: "import { addCommentFormActions } from \"../model/slices/addCommentForm\";"
    },
  ],
});
