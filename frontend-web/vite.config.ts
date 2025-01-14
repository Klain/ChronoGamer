import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
  },
  build: {
    outDir: 'dist', 
  },
  resolve: {
    alias: {
      '@': '/src', 
    },
  },

  preview: {
    headers: {
      'Cache-Control': 'no-cache',
    },
  },
});
