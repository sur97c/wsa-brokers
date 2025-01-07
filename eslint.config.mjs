import { FlatCompat } from '@eslint/eslintrc'
import * as path from 'path'
import pluginReact from 'eslint-plugin-react'
import pluginReactHooks from 'eslint-plugin-react-hooks'
import pluginTypeScript from '@typescript-eslint/eslint-plugin'
import parserTypeScript from '@typescript-eslint/parser'
import pluginPrettier from 'eslint-plugin-prettier'
import pluginImport from 'eslint-plugin-import'

const compat = new FlatCompat({
  baseDirectory: path.resolve('./'), // Asegura que las rutas sean correctas.
})

export default [
  {
    files: ['**/*.{js,jsx,ts,tsx}'], // Define los archivos que deben ser validados.
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      parser: parserTypeScript,
    },
    plugins: {
      react: pluginReact,
      'react-hooks': pluginReactHooks,
      '@typescript-eslint': pluginTypeScript,
      prettier: pluginPrettier,
      import: pluginImport,
    },
    rules: {
      'prettier/prettier': 'error',
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/no-explicit-any': 'error',
      'react/prop-types': 'off',
      // Reglas para imports
      // 'import/no-relative-parent-imports': 'error',
      'import/no-relative-packages': 'error',
      'import/no-unresolved': 'error',
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          pathGroups: [
            {
              pattern: '@/**',
              group: 'internal',
              position: 'before',
            },
          ],
          // 'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },
    },
  },
  ...compat.config({
    extends: [
      'plugin:react/recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:prettier/recommended',
      'plugin:import/recommended',
      'plugin:import/typescript',
      'next',
      'next/core-web-vitals',
    ],
  }),
]
