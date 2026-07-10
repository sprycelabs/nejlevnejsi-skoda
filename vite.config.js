import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

function fontPreloadPlugin() {
  return {
    name: 'font-preload',
    transformIndexHtml(html, ctx) {
      if (!ctx.bundle) return html
      const fontFile = Object.keys(ctx.bundle).find(f => f.includes('inter-latin-wght-normal') && f.endsWith('.woff2'))
      if (!fontFile) return html
      const tag = `<link rel="preload" href="/${fontFile}" as="font" type="font/woff2" crossorigin />`
      return html.replace('</head>', `  ${tag}\n  </head>`)
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), fontPreloadPlugin()],
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
