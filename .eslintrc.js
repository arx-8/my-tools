module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:jest/recommended",
    "react-app",
  ],
  plugins: [],
  rules: {
    "import/no-default-export": "error",
    "no-console": "off",
    "react/no-array-index-key": "error",
    "react/prop-types": "off",

    // constructor のショートハンド（メンバーの省略記法）を使いたいため
    "@typescript-eslint/explicit-member-accessibility": "off",
    "@typescript-eslint/no-parameter-properties": "off",

    // React Component の書き心地がとても悪くなるため
    "@typescript-eslint/explicit-function-return-type": [
      "error",
      {
        allowExpressions: true,
        allowTypedFunctionExpressions: true,
      },
    ],
    "@typescript-eslint/prefer-interface": "off",

    // ホイスティングの許可
    "@typescript-eslint/no-use-before-define": "off",
    "no-use-before-define": "off",

    // for Widening Literal Types
    "@typescript-eslint/no-object-literal-type-assertion": "off",

    // しょうがない
    "@typescript-eslint/camelcase": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
  },
}
