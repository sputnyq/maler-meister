import react from '@vitejs/plugin-react';

import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      manifest: {
        name: 'Maler Meister',
        short_name: 'Maler Meister',
      },
    }),
  ],
});
