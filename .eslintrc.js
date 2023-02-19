/* eslint-disable */
module.exports = {
  plugins: ['prettier'],
  extends: ['taro', 'plugin:react/jsx-runtime', 'plugin:prettier/recommended'],
  rules: {
    'react-hooks/exhaustive-deps': 0,
    'prettier/prettier': 2,
    '@typescript-eslint/no-unused-vars': 2,
    'import/no-commonjs': 0,
    'react/no-unescaped-entities': 0,
  },
}
