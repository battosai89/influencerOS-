import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import nextPlugin from "@next/eslint-plugin-next";

export default [
  {
    // Global ignores for the entire project
    ignores: [".next/"],
  },
  {languageOptions: {globals: {...globals.browser, ...globals.node}}},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    settings: {
      react: {
        version: "detect",
      },
    },
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      ...nextPlugin.configs["core-web-vitals"].rules,
      "@typescript-eslint/no-unused-vars": "warn",
      "@next/next/no-img-element": "warn",
      "react/react-in-jsx-scope": "off", // Disable for modern React
      "react/prop-types": "off", // Disable prop-types for TypeScript projects
    },
  },
  {
    files: ["*.css"],
    rules: {
      "at-rule-no-unknown": [
        "error",
        {
          ignoreAtRules: ["tailwind", "apply", "variants", "responsive", "screen", "layer"],
        },
      ],
    },
  },
];