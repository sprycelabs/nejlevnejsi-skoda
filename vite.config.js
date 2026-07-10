import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: parseInt(process.env.PORT) || 5173,
    strictPort: false,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react'
          }
          if (id.includes('node_modules/framer-motion')) {
            return 'framer-motion'
          }
          if (id.includes('node_modules/@supabase')) {
            return 'supabase'
          }
          if (id.includes('node_modules/lucide-react')) {
            return 'lucide'
          }
          if (id.includes('node_modules')) {
            return 'vendor'
          }
          if (id.includes('/src/data/cars')) {
            return 'cars-data'
          }
        },
      },
    },
  },
})
