import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  preview: {
    host: true,
    port: process.env.PORT || 5173,
    allowedHosts: [
      'mymoo-admin-production.up.railway.app'
    ]
  }
})