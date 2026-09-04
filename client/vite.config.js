import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // In dev, the client runs on :5173 and the API server (server/index.js)
    // runs on :5000. This proxy lets the frontend call relative /api/...
    // paths exactly like it will in production, without a VITE_API_URL.
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
});
