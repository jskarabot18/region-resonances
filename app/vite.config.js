import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Base path for GitHub Pages deployment.
  // Repo will live at github.com/jskarabot18/region-resonances
  // → site at jskarabot18.github.io/region-resonances/
  base: '/region-resonances/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    open: true, // open browser on dev start
  },
});
