module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'standard',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    'comma-dangle': ['error', 'always-multiline'],
    'import/imports-first': ['error', 'absolute-first'],
    'import/order': ['error', {
      pathGroups: [
        {
          pattern: '@app/**',
          group: 'external',
          position: 'after',
        },
      ],
      pathGroupsExcludedImportTypes: ['builtin'],
    }],
  },
}
