import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  plugins: [react(), cloudflare()],
  preview: {
    host: true,
    port: process.env.PORT || 5173,
    allowedHosts: [
      'mymoo-admin-production.up.railway.app'
    ]
  }
})