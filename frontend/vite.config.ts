import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

// Proxy target + HMR port are overridable so the same config works both
// natively (localhost:8000) and inside Docker (http://backend:8000, published
// on a different host port).
const proxyTarget = process.env.VITE_PROXY_TARGET ?? 'http://localhost:8000'
const hmrClientPort = process.env.VITE_HMR_CLIENT_PORT
  ? Number(process.env.VITE_HMR_CLIENT_PORT)
  : undefined

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target: proxyTarget,
        changeOrigin: true,
      },
    },
    ...(hmrClientPort ? { hmr: { clientPort: hmrClientPort } } : {}),
    // Bind-mounted source on Windows needs polling for HMR to detect changes.
    ...(process.env.VITE_POLL ? { watch: { usePolling: true } } : {}),
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
  },
})
