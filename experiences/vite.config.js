import { defineConfig } from 'vite'
import { resolve } from 'node:path'

// Builds every experience into ../public/experiences so the Next.js site serves them as static files.
export default defineConfig({
  base: './',
  build: {
    outDir: '../public/experiences',
    emptyOutDir: true,
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      input: {
        launcher: resolve(import.meta.dirname, 'index.html'),
        'solar-system': resolve(import.meta.dirname, 'solar-system/index.html'),
        'kelp-forest': resolve(import.meta.dirname, 'kelp-forest/index.html'),
      },
    },
  },
})
