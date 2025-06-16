import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/static/', // 🔥 Vite generará rutas relativas a /static/
  plugins: [react(), tailwindcss()],
  build: {
    outDir: '../django_api/frontend/static', // 🔥 Copia los archivos donde Django pueda servirlos
    emptyOutDir: true,
  },
  base: '/static/', // 👈 Esto es clave
  build: {
    outDir: '../django_api/frontend', // o como lo estás usando
    emptyOutDir: true
  }
})

