/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'betterGov_Favicon.svg'],
      manifest: {
        name: 'AyudaDex',
        short_name: 'AyudaDex',
        description: 'Philippine Government Social Benefits Navigator',
        theme_color: '#1e3a8a',
        background_color: '#f8fafc',
        icons: [
          {
            src: 'betterGov_Favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml'
          }
        ]
      }
    })
  ],
  test: {
    environment: 'jsdom',
    globals: true
  }
})
