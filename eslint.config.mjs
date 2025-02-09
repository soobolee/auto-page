import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import eslintPluginReactHooks from "eslint-plugin-react-hooks";
import eslintPluginJsxA11y from "eslint-plugin-jsx-a11y";
import eslintPluginPrettier from "eslint-plugin-prettier";
import eslintPluginImport from "eslint-plugin-import";

/** @type {import('eslint').Linter.Config[]} */
export default [
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
      "jsx-a11y": eslintPluginJsxA11y,
      prettier: eslintPluginPrettier,
      import: eslintPluginImport,
    },
    rules: {
      ...eslintPluginReactHooks.configs.recommended.rules,
      ...eslintPluginJsxA11y.configs.recommended.rules,
      ...eslintPluginImport.configs.recommended.rules,
      semi: "error",
      "no-unused-vars": "warn",
      "import/no-unresolved": "off",
      "prettier/prettier": "error",
    },
  },
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
  pluginReact.configs.flat["jsx-runtime"],
];
