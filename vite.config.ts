import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  build: {
    rollupOptions: {
      // Silence harmless "#__PURE__ comment ignored" annotation warnings emitted by
      // prebuilt third-party deps (e.g. @vueuse/core); they're cosmetic and not from our code.
      onwarn(warning, defaultHandler) {
        if (warning.code === 'INVALID_ANNOTATION' && /node_modules/.test(warning.message)) return
        defaultHandler(warning)
      },
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) return 'vendor'
          if (id.includes('/src/data/technologies/')) {
            const name = id.split('/src/data/technologies/')[1].split('.')[0]
            return `tech-${name}`
          }
          if (id.includes('/src/data/knowledge/js-concepts-')) {
            return 'knowledge-javascript'
          }
          if (id.includes('/src/data/knowledge/vue-concepts-')) {
            return 'knowledge-vue'
          }
        },
      },
    },
  },
})
