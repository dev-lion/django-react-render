import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/static/', // 👈 Esto es clave
  build: {
    outDir: '../django_api/frontend', // o como lo estás usando
    emptyOutDir: true
  }
})

