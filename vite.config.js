import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // base: '/chello-js/'

  // vite.config.js
  server: {
    port: 8001,  // You can change this to any port you want for development
  },
  preview: {
    port: 5001,  // Set this to your desired port for preview
  },
});
