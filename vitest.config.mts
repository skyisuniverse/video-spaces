// vitest.config.mts
import { defineConfig, configDefaults } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // =====================================================================
  // NATIVE TSCONFIG PATHS SUPPORT (Vite 5.1+ / Vitest 1.6+)
  // =====================================================================
  // Vite now resolves `paths` from tsconfig.json natively.
  // We no longer need the "vite-tsconfig-paths" plugin.
  resolve: {
    tsconfigPaths: true,
  },

  // =====================================================================
  // PLUGINS
  // =====================================================================
  plugins: [react()],

  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    reporters: ['html'],

    // =====================================================================
    // EXCLUDE E2E TESTS + PRESERVE DEFAULTS
    // =====================================================================
    exclude: [
      ...configDefaults.exclude,   // preserves all default Vitest exclusions
      'e2e/**',                    // everything in e2e/ folder
      '**/*.e2e.{ts,tsx}',         // any .e2e test files
      '**/*.e2e.spec.{ts,tsx}',    // any .e2e.spec files
      '**/playwright/**',          // common Playwright folder
      '**/cypress/**',             // in case you ever add Cypress
    ],

    coverage: {
      provider: 'v8',
      enabled: true,
      reporter: ['text', 'html'],
    },

    alias: {
      // Keep this if you still need a mock for server-only
      'server-only': './__mocks__/server-only.ts',
    },
  },
});