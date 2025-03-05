import react from 'eslint-plugin-react';
import jest from 'eslint-plugin-jest';
import globals from 'globals';
import babelParser from '@babel/eslint-parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  ...compat.extends('eslint:recommended', 'plugin:react/recommended'),
  {
    plugins: {
      react,
      jest,
    },
    settings: {
        react: {
            version: "detect",
        }
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.commonjs,
        ...globals.node,
        ...jest.environments.globals.globals,
      },

      parser: babelParser,
      ecmaVersion: 2018,
      sourceType: 'module',

      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        requireConfigFile: false,
        babelOptions: {
          parserOpts: {
            plugins: ['jsx'],
          },
        },
      },
    },

    rules: {
      quotes: ['error', 'single'],
      'no-const-assign': 'warn',
      'no-this-before-super': 'error',
      'no-undef': 'warn',
      'no-unreachable': 'error',
      'no-unused-vars': 'warn',
      'constructor-super': 'warn',
      'require-await': 'error',
      'valid-typeof': 'warn',
      semi: ['error', 'always'],
      'no-trailing-spaces': 'error',
    },
  },
];
