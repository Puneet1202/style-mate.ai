import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa' // 👈 PWA Import kiya

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // 👈 Tumhara existing Tailwind plugin
    
    // 👇 Naya PWA Plugin
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'StyleMate AI - Personal Stylist',
        short_name: 'StyleMate',
        description: 'Your AI-powered fashion assistant',
        theme_color: '#9333ea', // Purple color
        background_color: '#ffffff',
        display: 'standalone', // Browser ka URL bar chhupayega
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})