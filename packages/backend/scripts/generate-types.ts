#!/usr/bin/env ts-node

import { execSync } from 'child_process';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { swaggerSpec } from '../src/config/swagger-complete.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Generate TypeScript types from OpenAPI specification
 */
async function generateTypes() {
  try {
    console.log('🚀 Generating TypeScript types from OpenAPI specification...');

    // Create output directory
    const outputDir = join(__dirname, '../src/types/generated');
    mkdirSync(outputDir, { recursive: true });

    // Write OpenAPI spec to file
    const specPath = join(outputDir, 'openapi.json');
    writeFileSync(specPath, JSON.stringify(swaggerSpec, null, 2));
    console.log(`📝 OpenAPI spec written to: ${specPath}`);

    // Generate TypeScript types
    const typesPath = join(outputDir, 'api.types.ts');
    const command = `npx openapi-typescript ${specPath} -o ${typesPath}`;

    console.log('🔧 Running openapi-typescript...');
    execSync(command, { stdio: 'inherit' });

    console.log(`✅ TypeScript types generated: ${typesPath}`);

    // Generate client code for shared package
    const sharedTypesPath = join(__dirname, '../../shared/src/types/generated');
    mkdirSync(sharedTypesPath, { recursive: true });

    const sharedCommand = `npx openapi-typescript ${specPath} -o ${join(sharedTypesPath, 'api.types.ts')}`;
    execSync(sharedCommand, { stdio: 'inherit' });

    console.log(
      `✅ Shared TypeScript types generated: ${join(sharedTypesPath, 'api.types.ts')}`
    );

    // Create index file for easy imports
    const indexContent = `// Auto-generated API types
export * from './api.types';

// Re-export commonly used types
export type {
  ApiResponse,
  PaginatedResponse,
  User,
  ChatSession,
  Message,
  CreateUserRequest,
  LoginRequest,
  LoginResponse,
  CreateSessionRequest,
  UpdateSessionRequest,
  CreateMessageRequest,
  AIResponse,
  UserSettings,
  UpdateUserSettingsRequest,
} from './api.types';
`;

    writeFileSync(join(outputDir, 'index.ts'), indexContent);
    writeFileSync(join(sharedTypesPath, 'index.ts'), indexContent);

    console.log('🎉 Type generation completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Review generated types in src/types/generated/');
    console.log('2. Update your API clients to use the new types');
    console.log('3. Run tests to ensure everything works correctly');
  } catch (error) {
    console.error('❌ Error generating types:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateTypes();
}

export { generateTypes };
