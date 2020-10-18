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
    "prettier",
    "prettier/standard",
    "prettier/@typescript-eslint",
    "prettier/react",
    "react-app",
  ],
  plugins: [
    // CI で warn も検知可能にするため、全て error にする
    "only-error",
    "sort-destructure-keys",
    "sort-keys-fix",
    "typescript-sort-keys",
  ],
  rules: {
    "import/no-default-export": "error",
    "no-restricted-imports": [
      "error",
      {
        name: "lodash",
        message: "Use lodash/* instead.",
      },
    ],
    "no-restricted-syntax": [
      "error",
      {
        selector: "TSEnumDeclaration",
        message:
          "Do not declare enums. Use `Plain Object` or `Literal Types` instead.",
      },
    ],
    "prefer-template": "error",
    "react/jsx-boolean-value": "error",
    // jsx pragma に @emotion/core#jsx を使っている場合、Short Syntax 使えないため
    "react/jsx-fragments": ["error", "element"],
    "react/jsx-sort-props": "error",
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
    "sort-destructure-keys/sort-destructure-keys": "error",
    "sort-keys-fix/sort-keys-fix": "error",

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
