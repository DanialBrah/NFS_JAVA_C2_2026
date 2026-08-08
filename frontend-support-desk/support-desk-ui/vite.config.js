import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true
      }
    }
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
    css: true,
    // Playwright specs live under e2e/ and run through `playwright test`,
    // not Vitest — without this they'd match Vitest's default *.spec.js glob.
    exclude: ['**/node_modules/**', 'e2e/**']
  }
})
