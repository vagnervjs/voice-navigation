import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Enable DOM testing with jsdom
    environment: 'jsdom',
    
    // Test file patterns
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    
    // Global setup
    globals: true,
    
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.js'],
      exclude: ['src/**/*.test.js', 'src/**/*.spec.js'],
      thresholds: {
        global: {
          branches: 70,
          functions: 70,
          lines: 70,
          statements: 70,
        },
      },
    },
    
    // Setup files
    setupFiles: ['./test/env-setup.js', './test/setup.js'],
  },
}); 