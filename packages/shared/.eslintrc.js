module.exports = {
  extends: ['../../.eslintrc.js'],
  rules: {
    // Shared package specific rules
    '@typescript-eslint/no-explicit-any': 'error', // Stricter for shared code
    '@typescript-eslint/explicit-function-return-type': 'warn',
    'no-console': 'error', // No console in shared code
  },
};
