import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },

  build: {
    // increase this number from the default 500 kB
    chunkSizeWarningLimit: 1000,
  },
  base: './',
})
