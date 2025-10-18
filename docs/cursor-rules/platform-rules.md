# Platform-Specific Rules

## Overview

This document defines platform-specific rules and considerations for the Cross-Platform AI Chatbot project, focusing on how to handle differences between desktop, mobile, and web platforms.

## Platform Architecture

### Desktop (Electron)

- **Main Process**: Node.js backend, system integration
- **Renderer Process**: React frontend, UI rendering
- **IPC Communication**: Secure message passing between processes

### Mobile (React Native)

- **JavaScript Thread**: React components, business logic
- **Native Thread**: Platform-specific UI, system APIs
- **Bridge**: Communication between JavaScript and native code

### Web (React)

- **Browser Environment**: DOM manipulation, web APIs
- **Service Workers**: Background processing, caching
- **Progressive Web App**: Offline capabilities, app-like experience

## Platform Adapter Pattern

### Core Principle

Use adapter pattern to abstract platform differences while maintaining shared business logic.

### Implementation Strategy

```typescript
// Example: Storage Adapter
interface StorageAdapter {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  remove(key: string): Promise<void>;
}

// Desktop implementation
class ElectronStorageAdapter implements StorageAdapter {
  // Uses Electron's storage APIs
}

// Mobile implementation
class ReactNativeStorageAdapter implements StorageAdapter {
  // Uses AsyncStorage
}

// Web implementation
class WebStorageAdapter implements StorageAdapter {
  // Uses localStorage/sessionStorage
}
```

## Platform-Specific Considerations

### Desktop (Electron)

#### System Integration

- **File System**: Direct file access, drag & drop
- **System Tray**: Background operation, notifications
- **Window Management**: Multi-window support, window state
- **Auto-updater**: Automatic application updates
- **Native Menus**: Context menus, keyboard shortcuts

#### Security Considerations

- **Node Integration**: Disabled in renderer by default
- **Context Isolation**: Enabled for security
- **Content Security Policy**: Strict CSP headers
- **Certificate Validation**: Proper SSL/TLS handling

#### Performance Optimization

- **Memory Management**: Efficient resource cleanup
- **Process Separation**: Isolate heavy operations
- **Lazy Loading**: Load modules on demand
- **Caching Strategy**: Persistent cache for large data

### Mobile (React Native)

#### Platform Differences

- **iOS vs Android**: Use `.ios.ts` and `.android.ts` extensions
- **Navigation**: Platform-specific navigation patterns
- **UI Components**: Native look and feel
- **Permissions**: Platform-specific permission handling

#### Performance Considerations

- **Bundle Size**: Optimize for mobile constraints
- **Memory Usage**: Efficient memory management
- **Battery Life**: Minimize background processing
- **Network Usage**: Optimize data consumption

#### Native Integration

- **Device APIs**: Camera, GPS, sensors
- **Push Notifications**: Platform-specific implementation
- **Deep Linking**: URL scheme handling
- **Biometric Auth**: Touch ID, Face ID, fingerprint

### Web (React)

#### Browser Compatibility

- **Cross-browser Support**: Chrome, Firefox, Safari, Edge
- **Progressive Enhancement**: Graceful degradation
- **Responsive Design**: Mobile-first approach
- **Accessibility**: WCAG 2.1 AA compliance

#### Web-Specific Features

- **Service Workers**: Offline functionality, caching
- **Web APIs**: Geolocation, notifications, camera
- **PWA Features**: Install prompts, app-like experience
- **SEO Optimization**: Meta tags, structured data

#### Security Considerations

- **Content Security Policy**: XSS protection
- **HTTPS Only**: Secure connections required
- **Input Validation**: Client and server-side validation
- **Authentication**: Secure token handling

## Shared Code Strategy

### Maximum Reuse (80%+)

- **Business Logic**: Completely platform-agnostic
- **Data Models**: Shared across all platforms
- **API Client**: Unified HTTP client
- **State Management**: Shared state logic
- **Utilities**: Common helper functions

### Platform-Specific Code

- **UI Components**: Platform-specific rendering
- **System Integration**: Platform-specific APIs
- **Navigation**: Platform-specific routing
- **Storage**: Platform-specific persistence

## File Organization

### Platform Extensions

```
components/
├── MessageBubble.tsx          # Shared component
├── MessageBubble.ios.tsx      # iOS-specific
├── MessageBubble.android.tsx  # Android-specific
└── MessageBubble.web.tsx      # Web-specific
```

### Platform Adapters

```
adapters/
├── StorageAdapter.ts          # Interface
├── ElectronStorageAdapter.ts  # Desktop implementation
├── ReactNativeStorageAdapter.ts # Mobile implementation
└── WebStorageAdapter.ts       # Web implementation
```

## Development Workflow

### Platform-Specific Development

- **Desktop**: Electron development tools, Chrome DevTools
- **Mobile**: React Native debugger, device testing
- **Web**: Browser dev tools, Lighthouse audits

### Testing Strategy

- **Unit Tests**: Shared business logic
- **Integration Tests**: Platform-specific features
- **E2E Tests**: Complete user workflows per platform
- **Device Testing**: Real device testing for mobile

### Build and Deployment

- **Desktop**: Electron builder, code signing
- **Mobile**: App store deployment, over-the-air updates
- **Web**: Static hosting, CDN distribution

## Performance Optimization

### Platform-Specific Optimizations

- **Desktop**: Multi-process architecture, efficient memory usage
- **Mobile**: Bundle optimization, lazy loading, image optimization
- **Web**: Code splitting, service worker caching, CDN usage

### Monitoring and Analytics

- **Desktop**: Crash reporting, performance metrics
- **Mobile**: App store analytics, crash reporting
- **Web**: Web analytics, performance monitoring

## Security Considerations

### Platform-Specific Security

- **Desktop**: Code signing, auto-updater security
- **Mobile**: App store security, certificate pinning
- **Web**: HTTPS, CSP, secure headers

### Data Protection

- **Encryption**: Platform-appropriate encryption
- **Storage**: Secure storage mechanisms
- **Transmission**: Secure communication protocols

## Accessibility

### Platform-Specific Accessibility

- **Desktop**: Keyboard navigation, screen readers
- **Mobile**: Voice control, accessibility services
- **Web**: ARIA labels, semantic HTML, keyboard navigation

### Universal Design

- **Consistent UX**: Similar experience across platforms
- **Responsive Design**: Adapt to different screen sizes
- **Inclusive Design**: Support for users with disabilities

## Maintenance and Updates

### Platform-Specific Maintenance

- **Desktop**: Auto-updater, version management
- **Mobile**: App store updates, over-the-air updates
- **Web**: Continuous deployment, feature flags

### Cross-Platform Synchronization

- **Feature Parity**: Maintain feature consistency
- **Version Alignment**: Coordinate releases across platforms
- **Bug Fixes**: Apply fixes across all platforms

Remember: The goal is to maximize code reuse while providing the best possible experience on each platform. Always consider how changes affect all platforms and maintain consistency in user experience.
