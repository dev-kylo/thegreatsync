/* eslint-disable prettier/prettier */
module.exports = {
  extends: [
    'next/core-web-vitals',
    'wesbos/typescript'
  ],
  parserOptions: {
    project: 'tsconfig.eslint.json',
    'tsconfigRootDir': __dirname, // <-- this did the trick for me
    sourceType: 'module',
  },
  ignorePatterns: [
    'frontend/tsconfig.json'
  ],
  rules: {
    'react/destructuring-assignment': 1,
    'react/jsx-pascal-case': 0,
    'react/prop-types': 0,
    'arrow-body-style': 0,
    'no-console': 0,
    'no-nested-ternary': 0,
    'no-plusplus': 0,
    'no-use-before-define': 0,
    'no-return-assign': 0,
    'camelcase': 0,
    'no-unused-vars': [
      2,
      {
        'argsIgnorePattern': '^_*|/res|next|^err/u'
      }
    ],
    '@typescript-eslint/no-unused-vars': [
      1,
      {
        'argsIgnorePattern': '^_'
      }
    ],
    '@typescript-eslint/restrict-template-expressions': 0,
    '@typescript-eslint/naming-convention': 0,
    '@typescript-eslint/no-non-null-assertion': 0,
    '@typescript-eslint/no-unsafe-assignment': 1,
    '@typescript-eslint/no-use-before-define': 1,
    'prettier/prettier': [
      1,
      {
        'trailingComma': 'es5',
        'singleQuote': true,
        'printWidth': 120,
        'tabWidth': 4
      }
    ]
  }
}