module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
  },
  extends: [
    "standard",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:jest/recommended",
    /** @see https://github.com/prettier/eslint-config-prettier#installation */
    "prettier/standard",
    "prettier/@typescript-eslint",
    "prettier/react",
    "plugin:prettier/recommended",
    "react-app",
  ],
  plugins: ["typescript-sort-keys", "sort-keys-fix"],
  rules: {
    "import/no-default-export": "error",
    "no-restricted-syntax": [
      "error",
      {
        selector: "TSEnumDeclaration",
        message:
          "Do not declare enums. Use `Plain Object` or `Literal Types` instead.",
      },
    ],
    "react/jsx-boolean-value": "error",
    // jsx pragma に @emotion/core#jsx を使っている場合、Short Syntax 使えないため
    "react/jsx-fragments": ["error", "element"],
    "react/no-access-state-in-setstate": "error",
    "react/no-array-index-key": "error",
    "react/no-did-mount-set-state": "error",
    "react/no-unsafe": ["error", { checkAliases: true }],
    "react/prefer-stateless-function": "error",
    "react/prop-types": "off",
    "react/self-closing-comp": [
      "error",
      {
        // empty な html が必要なケースはほとんどないため
        html: false,
      },
    ],
    "react/void-dom-elements-no-children": "error",
    "sort-keys-fix/sort-keys-fix": "error",

    // prettier
    "prettier/prettier": [
      "error",
      {
        arrowParens: "always",
        semi: false,
        trailingComma: "es5",
      },
    ],

    "typescript-sort-keys/interface": "error",
    "typescript-sort-keys/string-enum": "error",

    // constructor のショートハンド（メンバーの省略記法）を許可
    "@typescript-eslint/explicit-member-accessibility": "off",
    "@typescript-eslint/no-parameter-properties": "off",

    // React Component のボイラープレートコードを減らすため
    "@typescript-eslint/explicit-function-return-type": [
      "error",
      {
        allowExpressions: true,
        allowTypedFunctionExpressions: true,
      },
    ],
    "@typescript-eslint/consistent-type-definitions": ["error", "type"],

    // バグの温床になりやすいコードを防ぐため
    "@typescript-eslint/no-unused-expressions": [
      "error",
      {
        allowShortCircuit: false,
        allowTernary: false,
        allowTaggedTemplates: false,
      },
    ],

    // 有用なケースがあるため
    "@typescript-eslint/camelcase": "off",
    "@typescript-eslint/no-non-null-assertion": "off",

    // Other
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-misused-promises": "error",
    "@typescript-eslint/prefer-readonly": "error",

    // note you must disable the base rule as it can report incorrect errors
    "require-await": "off",
    "@typescript-eslint/require-await": "error",
  },
}
