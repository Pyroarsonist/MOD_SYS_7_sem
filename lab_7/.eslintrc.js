module.exports = {
  parser: "@babel/eslint-parser",
  plugins: ["prettier", "@babel"],
  extends: ["prettier"],
  parserOptions: {
    ecmaVersion: 2020,
  },
  root: true,
  env: {
    node: true,
    es6: true,
  },
  rules: {
    "prettier/prettier": 2,
    'no-var': 2,
    'prefer-const': 2,
    'brace-style': 2,
    'no-console': [
      2,
      {
        allow: ['warn', 'error', 'info'],
      },
    ],
    'object-shorthand': 2,
    'arrow-body-style': [2, 'as-needed'],
    eqeqeq: 2,
  },
};
