import js from "@eslint/js";
import globals from "globals";

export default [
  // 1. Apply recommended rules to all JS files
  js.configs.recommended,

  {
    // 2. Define which files this configuration applies to
    files: ["**/*.js", "**/*.mjs"],

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser, // Adds browser variables like 'window'
        ...globals.node,    // Adds Node.js variables like 'process'
      },
    },

    // 3. Custom rules (override defaults here)
    rules: {
      "no-unused-vars": "warn",
      "no-console": "off",
      "semi": ["error", "always"],
      "quotes": ["error", "double"]
    },
  },
];
