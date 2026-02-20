import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Proxy for local development only
    // In production, use VITE_API_URL environment variable instead
    proxy: {
      '/api': {
        target: 'http://localhost:5001', // Backend runs on port 5001 locally
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
});
