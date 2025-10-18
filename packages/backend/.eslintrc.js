module.exports = {
  extends: ['../../.eslintrc.js'],
  env: {
    node: true,
    browser: false,
  },
  rules: {
    // Backend specific rules
    'no-console': 'off', // Allow console in backend
    '@typescript-eslint/no-explicit-any': 'warn', // More lenient for external APIs
    '@typescript-eslint/explicit-function-return-type': 'warn',
  },
};
