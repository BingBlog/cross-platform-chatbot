module.exports = {
  // TypeScript and JavaScript files
  '**/*.{ts,tsx,js,jsx}': ['eslint --fix', 'prettier --write'],

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
