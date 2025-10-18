module.exports = {
  extends: ['../../.eslintrc.js'],
  rules: {
    // Desktop specific rules
    'no-console': 'off', // Allow console in Electron main process
    '@typescript-eslint/no-explicit-any': 'warn', // More lenient for Electron APIs
  },
};
