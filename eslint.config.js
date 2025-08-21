export default [
  {
    ignores: ["lib/**/*"]
  },
  {
    languageOptions: {
      ecmaVersion: 2017,
      globals: {
        window: "readonly",
        chrome: "readonly",
        document: "readonly",
        moment: "readonly",
        Date: "readonly",
        Intl: "readonly"
      }
    },
    rules: {
      "indent": ["error", 2],
      "space-before-function-paren": [
        "error",
        {
          "anonymous": "ignore",
          "named": "ignore",
          "asyncArrow": "ignore"
        }
      ],
      "comma-dangle": "off"
    }
  }
];