import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import eslintPluginReactHooks from "eslint-plugin-react-hooks";
import eslintPluginPrettier from "eslint-plugin-prettier";
import eslintPluginImport from "eslint-plugin-import";

/** @type {import('eslint').Linter.Config[]} */
export default [
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
  pluginReact.configs.flat["jsx-runtime"],
  {
    ignores: ["dist/", "node_modules/", "build/"],
    files: ["**/*.{js,mjs,jsx}"],
    languageOptions: {
      globals: {...globals.browser, ...globals.node},
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    plugins: {
      "react-hooks": eslintPluginReactHooks,
      prettier: eslintPluginPrettier,
      import: eslintPluginImport,
    },
    rules: {
      ...eslintPluginReactHooks.configs.recommended.rules,
      ...eslintPluginImport.configs.recommended.rules,
      semi: "error",
      "no-unused-vars": "warn",
      "import/no-unresolved": "off",
      "prettier/prettier": "error",
      "react/prop-types": "off",
      "react/no-unknown-property": "off",
    },
  },
];
