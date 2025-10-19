module.exports = {
  extends: ['../../.eslintrc.js'],
  rules: {
    // Web specific rules
    'react/react-in-jsx-scope': 'off', // Not needed with React 17+
    'react/prop-types': 'off', // Using TypeScript for prop validation
    'jsx-a11y/anchor-is-valid': 'off', // React Router Link components
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
  },
};
