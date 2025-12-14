/**
 * Main Export Index
 * Centralized exports for all TypeScript modules
 */

// Re-export types
export * from './types';

// Re-export configuration
export { default as CONFIG } from './config';
export type { AppConfig } from './config';

// Re-export API client
export * as ApiClient from './api-client';

// Re-export validation utilities
export * as Validation from './validation';

// Re-export utility functions
export * as Utils from './utils';

// Re-export advanced features
export * as AdvancedFeatures from './advanced-features';

// Default exports for convenience
import * as ApiClient from './api-client';
import * as Validation from './validation';
import * as Utils from './utils';
import * as AdvancedFeatures from './advanced-features';
import CONFIG from './config';

export default {
  ApiClient,
  Validation,
  Utils,
  AdvancedFeatures,
  CONFIG
};
