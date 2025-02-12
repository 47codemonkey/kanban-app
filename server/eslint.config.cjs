const tsPlugin = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const importPlugin = require('eslint-plugin-import');

module.exports = [
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
      },
      globals: {
        process: 'readonly',
        console: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      import: importPlugin,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'import/prefer-default-export': 'off',
      'import/no-unresolved': 'off',
      'import/extensions': 'off',
      'max-len': [
        'error',
        {
          code: 120,
          ignoreTemplateLiterals: true,
          ignoreStrings: true,
          ignoreComments: true,
          ignoreRegExpLiterals: true,
        },
      ],
      'no-duplicate-imports': 'error',
      'no-console': 'warn',
    },
    settings: {
      'import/resolver': {
        node: {
          paths: ['src'],
          extensions: ['.ts', '.tsx'],
        },
      },
    },
  },
];
