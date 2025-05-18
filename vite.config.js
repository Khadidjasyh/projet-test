import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [
        tailwindcss(),
        autoprefixer()
      ],
    },
  },
  server: {
    port: 5176,
    proxy: {
      '/api': {
        target: 'http://localhost:5178',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      "/situation-globale": {
        target: "http://localhost:5178",
        changeOrigin: true,
        secure: false,
        ws: true,
        rewrite: (path) => path
      },
      "/roaming-partners": {
        target: "http://localhost:5178",
        changeOrigin: true,
        secure: false,
        ws: true,
        rewrite: (path) => path
      },
      "/huawei/mobile-networks": {
        target: "http://localhost:5178",
        changeOrigin: true,
        secure: false,
        ws: true,
        rewrite: (path) => path
      }
    }
  }
});