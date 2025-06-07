import { defineConfig } from 'vite';

export default defineConfig({
  base: '/voice-navigation/',
  server: {
    host: 'localhost',
    port: 3000,
    open: true,
  },
});
