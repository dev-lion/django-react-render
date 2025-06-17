import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './', // 🔥 Vite generará rutas relativas a /static/
  plugins: [react(), tailwindcss()],
  build: {
    outDir: '../django_api/frontend/vite_dist', // 🔥 Copia los archivos donde Django pueda servirlos
    emptyOutDir: true,
  },
})

