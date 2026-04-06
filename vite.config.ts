import { defineConfig } from 'vite';
import { VitePWA } from '@vite-pwa/vite-plugin';

export default defineConfig({
  server: {
    port: 5173,
    https: true,
    host: '0.0.0.0'
  },
  build: {
    target: 'ES2020',
    minify: 'terser',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          firebase: ['firebase/app', 'firebase/firestore', 'firebase/auth', 'firebase/storage']
        }
      }
    }
  },
  plugins: [
    VitePWA({
      manifest: {
        name: 'FutManager',
        short_name: 'FutManager',
        description: 'Gerencie torneios e amistosos com seus amigos',
        start_url: './',
        scope: './',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#08080F',
        theme_color: '#8B5CF6',
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,json}'],
        navigateFallback: 'index.html',
        navigateFallbackDenylist: [/^\/api\//, /\?v=\d+$/],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/(firebase|google|flagcdn).*/,
            handler: 'NetworkOnly'
          }
        ]
      }
    })
  ]
});
