import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://api.ecowshala.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
  preview: {
    host: true,
    port: process.env.PORT || 4173,
    allowedHosts: [
      'www.ecowshala.com',
      'localhost',
      '127.0.0.1',
      'mymoo-admin-production.up.railway.app',
    ],
    proxy: {
      '/api': {
        target: 'https://api.ecowshala.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})