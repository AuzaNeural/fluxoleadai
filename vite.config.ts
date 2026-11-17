import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const FLUX_COOKIE = 'flux_session=fciCzJCbWxwb_NUpvTCMWBSQ5HDmyCIkY7qpCDgdqNo';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['maplibre-gl'],
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
    open: false,
    watch: {
      usePolling: true,
      interval: 1000,
    },
    proxy: {
      '/api/locais': {
        target: 'https://fluxoleadai.com.br',
        changeOrigin: true,
        secure: false,
        headers: {
          Cookie: FLUX_COOKIE,
          Referer: 'https://fluxoleadai.com.br/app/buscar',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        },
      },
    },
  },
});
