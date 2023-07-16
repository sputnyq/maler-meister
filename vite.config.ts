import react from '@vitejs/plugin-react';

import { defineConfig } from 'vite';
import loadVersion from 'vite-plugin-package-version';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      manifest: {
        id: '/',
        icons: [
          {
            src: 'icon40.png',
            sizes: '40x40',
          },
          {
            src: 'icon180.png',
            sizes: '48x48 72x72 96x96 128x128 180x180',
          },
          {
            src: 'icon1024.png',
            sizes: 'any',
          },
        ],
        description: 'Maler Meister Applikation',
        name: 'Maler Meister',
        short_name: 'Maler Meister',
      },
    }),
    //@ts-ignore
    loadVersion.default(),
  ],
});
