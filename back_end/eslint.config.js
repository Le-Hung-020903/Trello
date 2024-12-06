// eslint.config.js

module.exports = [
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        console: "readonly",
        process: "readonly"
      },
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        requireConfigFile: false,
        allowImportExportEverywhere: true
      }
    },
    rules: {
      "no-console": 1,
      "no-extra-boolean-cast": 0,
      "no-lonely-if": 1,
      "no-unused-vars": 1,
      "no-trailing-spaces": 1,
      "no-multi-spaces": 1,
      "no-multiple-empty-lines": 1,
      "space-before-blocks": ["error", "always"],
      "object-curly-spacing": [1, "always"],
      // indent: ["warn", 2],
      semi: [1, "never"],
      // quotes: ["error", "single"],
      "array-bracket-spacing": 1,
      "linebreak-style": 0,
      "no-unexpected-multiline": "warn",
      "keyword-spacing": 1,
      "comma-dangle": 1,
      "comma-spacing": 1,
      "arrow-spacing": 1,
      "function-call-argument-newline": ["off"], // Tắt quy tắc kiểm tra xuống dòng
      "no-unexpected-multiline": "off"
    }
  }
]
