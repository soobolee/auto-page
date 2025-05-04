import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import eslintPluginPrettier from "eslint-plugin-prettier";
import * as eslintPluginImport from "eslint-plugin-import";
import tseslint from "typescript-eslint";
import globals from "globals";

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  tseslint.configs.recommended,
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
  pluginReact.configs.flat["jsx-runtime"],
  {
    files: ["**/*.{ts,tsx,js,jsx,mts,mtsx}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: process.cwd(),
      },
      globals: {...globals.browser, ...globals.node},
    },
    settings: {
      react: {version: "detect"},
    },
    plugins: {
      "react-hooks": pluginReactHooks,
      prettier: eslintPluginPrettier,
      import: eslintPluginImport,
    },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
      ...eslintPluginImport.configs.recommended.rules,
      "prettier/prettier": "error",
      "no-unused-vars": "warn",
      "import/no-unresolved": "off",
      semi: "error",
      "react/prop-types": "off",
      "react/no-unknown-property": "off",
    },
  },
];
