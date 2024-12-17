import { FlatCompat } from '@eslint/eslintrc'
import * as path from 'path'
import pluginReact from 'eslint-plugin-react'
import pluginReactHooks from 'eslint-plugin-react-hooks'
import pluginTypeScript from '@typescript-eslint/eslint-plugin'
import parserTypeScript from '@typescript-eslint/parser'
import pluginPrettier from 'eslint-plugin-prettier'

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
    },
    rules: {
      'prettier/prettier': 'error',
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/no-explicit-any': 'error',
      'react/prop-types': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  ...compat.config({
    extends: [
      'plugin:react/recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:prettier/recommended',
      'next',
      'next/core-web-vitals',
    ],
  }),
]
