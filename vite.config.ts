import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    // Mitiga CVE-2025-30208 / CVE-2025-31125 — restringe acesso ao filesystem
    fs: {
      strict: true,
      deny: ['.env', '.env.*', '*.{pem,crt,key}'],
    },
    proxy: {
      // Proxy para todas as chamadas API para o backend
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
