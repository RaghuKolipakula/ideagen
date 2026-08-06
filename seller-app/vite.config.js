import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/seller/',
  build: {
    outDir: '../pages/seller',
    emptyOutDir: true,
  }
})
