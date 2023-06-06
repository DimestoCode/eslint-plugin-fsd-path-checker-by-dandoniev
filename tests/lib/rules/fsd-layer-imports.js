/**
 * @fileoverview  
 * @author Dima
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/fsd-layer-imports"),
  RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 6, sourceType: "module" }
});

const aliasOptions = [
  {
    alias: '@'
  }
];

ruleTester.run("fsd-layer-imports", rule, {
  valid: [
      {
        filename: "C:\\Users\\dando\\Desktop\\javascript\\src\\features\\Article",
        code: "import { addCommentFormActions, addCommentFormReducer } from \"@/shared/Button\";",
        options: aliasOptions,
      },
      {
        filename: 'C:\\Users\\dando\\Desktop\\javascript\\src\\features\\Article',
        code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article'",
        errors: [],
        options: aliasOptions,
      },
      {
        filename: 'C:\\Users\\dando\\Desktop\\javascript\\src\\app\\providers',
        code: "import { addCommentFormActions, addCommentFormReducer } from '@/widgets/Articl'",
        errors: [],
        options: aliasOptions,
      },
      {
        filename: "C:\\Users\\dando\\Desktop\\javascript\\src\\widgets\\pages",
        code: "import { useLocation } from 'react-router-dom'",
        errors: [],
        options: aliasOptions,
      },
      {
        filename: 'C:\\Users\\dando\\Desktop\\javascript\\src\\app\\providers',
        code: "import { addCommentFormActions, addCommentFormReducer } from 'redux'",
        errors: [],
        options: aliasOptions,
      },
      {
        filename: 'C:\\Users\\dando\\Desktop\\javascript\\src\\index.tsx',
        code: "import { StoreProvider } from '@/app/providers/StoreProvider';",
        errors: [],
        options: aliasOptions,
      },
      {
        filename: 'C:\\Users\\dando\\Desktop\\javascript\\src\\entities\\Article.tsx',
        code: "import { StateSchema } from '@/app/providers/StoreProvider'",
        errors: [],
        options: [
          {
            alias: '@',
            ignoreImportPatterns: ['**/StoreProvider']
          }
        ],
      }
  ],

  invalid: [
      {
        filename: 'C:\\Users\\dando\\Desktop\\javascript\\src\\entities\\providers',
        code: "import { addCommentFormActions, addCommentFormReducer } from '@/features/Articl'",
        errors: [{ messageId: "HIGH_LEVEL_IMPORT"}],
        options: aliasOptions,
      },
      {
        filename: 'C:\\Users\\dando\\Desktop\\javascript\\src\\features\\providers',
        code: "import { addCommentFormActions, addCommentFormReducer } from '@/widgets/Articl'",
        errors: [{ messageId: "HIGH_LEVEL_IMPORT"}],
        options: aliasOptions,
      },
      {
        filename: 'C:\\Users\\dando\\Desktop\\javascript\\src\\entities\\providers',
        code: "import { addCommentFormActions, addCommentFormReducer } from '@/widgets/Articl'",
        errors: [{ messageId: "HIGH_LEVEL_IMPORT"}],
        options: aliasOptions,
      }
  ],
});
