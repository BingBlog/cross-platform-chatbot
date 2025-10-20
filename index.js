// Root entry point for the cross-platform chatbot project
// This is a monorepo with multiple packages
// Use the appropriate package scripts to start individual applications:
// - pnpm dev:mobile-expo:web (for Expo web)
// - pnpm dev:web (for React web)
// - pnpm dev:desktop (for Electron)
// - pnpm dev:backend (for backend services)

console.log('Cross-Platform AI Chatbot');
console.log('Available commands:');
console.log('- pnpm dev:mobile-expo:web - Start Expo web app');
console.log('- pnpm dev:web - Start React web app');
console.log('- pnpm dev:desktop - Start Electron desktop app');
console.log('- pnpm dev:backend - Start backend services');
console.log('- pnpm dev:all - Start all services');

module.exports = {
  name: 'cross-platform-chatbot',
  version: '1.0.0'
};
