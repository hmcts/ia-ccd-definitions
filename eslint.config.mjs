import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import json from "@eslint/json";
import { defineConfig, globalIgnores } from "eslint/config";


export default defineConfig([
  globalIgnores([
      "ccd-definition-processor/",
      "bin/",
      "tests/documents/",
      "tests/reports/",
      "codecept.conf.ts",
      ".eslintrc.js",
      "steps.d.ts",
      "steps.ts"
      "playwright.config.ts",
  ]),
    {
        files: ["**/*.ts"],
        plugins: {
            "@typescript-eslint": tseslint.plugin,
        },
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                project: "./tsconfig.json",
            },
        },
        rules: {
            "@typescript-eslint/no-floating-promises": "error",
        },
    },
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts}"], plugins: { js }, extends: ["js/recommended"] },
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts}"], languageOptions: { globals: globals.browser } },
  tseslint.configs.recommended,
  { files: ["**/*.json"], plugins: { json }, language: "json/json", extends: ["json/recommended"] },
  { files: ["**/*.json5"], plugins: { json }, language: "json/json5", extends: ["json/recommended"] },
]);

//, "!/definitions", "!/tests/e2e"