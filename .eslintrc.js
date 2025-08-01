module.exports = {
  "extends": "eslint:recommended",
  "env": {
    "es6": true,
    "node": true
  },
  "parserOptions": {
    "ecmaVersion": 2022
  },
  "rules": {
    "indent": [
      "error",
      2
    ],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "quotes": [
      "error",
      "single"
    ],
    "semi": [
      "error",
      "always"
    ],
    "no-var": "error",
    "no-console": [
      "error",
      {
        allow: ["log", "warn", "error"]
      }
    ],
    "space-before-function-paren": [
      "error", {
        "anonymous": "always",
        "named": "always",
        "asyncArrow": "always"
      }
    ],
    "arrow-spacing": [
      "error", {
        "before": true,
        "after": true
      }
    ],
    "comma-spacing": "error",
    "space-in-parens": [
      "error",
      "never"
    ],
    "camelcase": "error",
    "no-multi-spaces": "error",
    "no-multiple-empty-lines": [
      "error", {
        "max": 1,
        "maxEOF": 0
      }
    ]
  }
}; 