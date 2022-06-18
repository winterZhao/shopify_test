module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    'import/extensions': [2, 'never'],
    'import/no-unresolved': [0],
    '@typescript-eslint/no-var-requires': [0],
    'no-plusplus': [0],
    'max-len': ['error', {code: 150, comments:200}],
    'class-methods-use-this': [0]
  },
};
