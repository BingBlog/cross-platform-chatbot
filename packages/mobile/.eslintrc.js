module.exports = {
  extends: ['../../.eslintrc.js', '@react-native'],
  rules: {
    // React Native specific rules
    'react-native/no-unused-styles': 'error',
    'react-native/split-platform-components': 'error',
    'react-native/no-inline-styles': 'warn',
    'react-native/no-color-literals': 'warn',
    'no-console': 'warn', // Allow console for debugging
  },
};
