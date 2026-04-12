import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/api': {
          // reads VITE_API_PROXY_TARGET from client/.env, falls back to 5000
          target: env.VITE_API_PROXY_TARGET || 'http://localhost:5000',
          changeOrigin: true,
        },
      },
    },
  };
});
