module.exports = {
  // Backend TypeScript files
  'packages/backend/**/*.{ts,tsx}': [
    'cd packages/backend && eslint --fix',
    'prettier --write'
  ],

  // Shared TypeScript files
  'packages/shared/**/*.{ts,tsx}': [
    'cd packages/shared && eslint --fix',
    'prettier --write'
  ],

  // Web TypeScript files
  'packages/web/**/*.{ts,tsx}': [
    'cd packages/web && eslint --fix',
    'prettier --write'
  ],

  // Mobile TypeScript files
  'packages/mobile/**/*.{ts,tsx}': [
    'cd packages/mobile && eslint --fix',
    'prettier --write'
  ],

  // Desktop TypeScript files
  'packages/desktop/**/*.{ts,tsx}': [
    'cd packages/desktop && eslint --fix',
    'prettier --write'
  ],

  // JSON files
  '**/*.json': ['prettier --write'],

  // CSS and style files
  '**/*.{css,scss,sass,less}': ['prettier --write'],

  // Markdown files
  '**/*.md': ['prettier --write'],

  // HTML files
  '**/*.html': ['prettier --write'],

  // YAML files
  '**/*.{yml,yaml}': ['prettier --write'],

  // Package.json files
  '**/package.json': ['prettier --write'],
};
