import tsEslintPlugin from '@typescript-eslint/eslint-plugin'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
// import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ['**/*.ts'], // Focus only on TypeScript files
    ignores: ['dist/**/*'], // Ignore generated JS files
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json', // Point to your TypeScript configuration
      },
      parser: '@typescript-eslint/parser', // Use the TypeScript ESLint parser
      globals: {
        process: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tsEslintPlugin, // Use the plugin
    },
    rules: {
      // Add your custom ESLint rules here
      'no-unused-vars': 'off', // Example rule adjustment
      '@typescript-eslint/no-unused-vars': ['error'], // TypeScript-specific rule
      'no-unused-expressions': 'error',
      'prefer-const': 'error',
      'no-console': 'warn',
      'no-undef': 'error',
    }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
]
