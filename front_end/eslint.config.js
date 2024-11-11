import eslintPluginReact from "eslint-plugin-react";
import eslintPluginReactHooks from "eslint-plugin-react-hooks";
import eslintPluginReactRefresh from "eslint-plugin-react-refresh";
import babelParser from "@babel/eslint-parser";

export default [
  {
    files: ["**/*.js", "**/*.jsx"],
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
        babelOptions: {
          presets: ["@babel/preset-react"],
        },
      },
      globals: {
        browser: true,
        es2020: true,
        node: true,
      },
    },
    plugins: {
      react: eslintPluginReact,
      "react-hooks": eslintPluginReactHooks,
      "react-refresh": eslintPluginReactRefresh,
    },
    rules: {
      "react-refresh/only-export-components": "warn",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "react/prop-types": "off",
      "react/display-name": "off",

      "no-console": "warn",
      "no-lonely-if": "warn",
      "no-unused-vars": "warn",
      "no-trailing-spaces": "warn",
      "no-multi-spaces": "warn",
      "no-multiple-empty-lines": "warn",
      "space-before-blocks": ["error", "always"],
      "object-curly-spacing": ["warn", "always"],
      indent: ["warn", 2],
      semi: ["warn", "never"],
      quotes: ["error", "single"],
      "array-bracket-spacing": "warn",
      "linebreak-style": "off",
      "no-unexpected-multiline": "warn",
      "keyword-spacing": "warn",
      "comma-dangle": "warn",
      "comma-spacing": "warn",
      "arrow-spacing": "warn",
    },
    settings: {
      react: {
        version: "18.2",
      },
    },
  },
];
