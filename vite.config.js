import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  root: 'D:/BikeSummerFest2026',
  build: {
    rollupOptions: {
      input: 'index.html',
    },
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
})
