// vite.config.js
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

// Robust __dirname for ESM config files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default ({ mode }) => {
  // Allow overriding the proxy target via env (e.g., VITE_DEV_API_TARGET=http://localhost:5001)
  const env = loadEnv(mode, process.cwd(), '');
  const devApiTarget = (env.VITE_DEV_API_TARGET || 'http://localhost:5001').replace(/\/+$/, '');

  return defineConfig({
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: devApiTarget,   // dev-only; can be overridden via VITE_DEV_API_TARGET
          changeOrigin: true,
        },
      },
    },
  });
};
