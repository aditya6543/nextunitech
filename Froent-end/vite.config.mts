import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: true,
    open: true,
    host: true,
    proxy: {
      '/api/auth': {
        target: 'http://127.0.0.1:8000', // <-- This is the fix
        changeOrigin: true,
        secure: false,
      },
      '/api/chat': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
      },
      '/api/users': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
      },
      '/api/messages': {
    target: 'http://127.0.0.1:8000', // Point to your FastAPI backend
    changeOrigin: true,
    secure: false,
    }
  }
},
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          forms: ['react-hook-form', '@hookform/resolvers', 'zod']
        }
      }
    }
  },
define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version) // <-- No comma needed here
  }
})