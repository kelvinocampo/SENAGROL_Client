import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

const ROOT_PATH = path.resolve(__dirname, 'src');
const CREATE_ALIAS = (targetPath: string) => path.resolve(ROOT_PATH, targetPath);

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  resolve: {
    alias: {
      '@': ROOT_PATH,
      '@assets': CREATE_ALIAS('assets'),
      '@components': CREATE_ALIAS('components'),
      '@context': CREATE_ALIAS('contexts'),
      '@hooks': CREATE_ALIAS('hooks'),
      '@pages': CREATE_ALIAS('pages'),
      '@services': CREATE_ALIAS('services'),
      '@types': CREATE_ALIAS('types'),
      '@utils': CREATE_ALIAS('utils'),
    }
  },
  server: {
    proxy: {
      '/usuario/login': {
        target: 'http://localhost:10101',
        changeOrigin: true,
        secure: false,
      }
    }
  }
});
