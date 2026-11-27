import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Writes /version.json so the admin page can tell when a publish is live.
// Cloudflare Pages sets CF_PAGES_COMMIT_SHA during its builds.
const versionFile = () => ({
  name: 'version-file',
  generateBundle() {
    this.emitFile({
      type: 'asset',
      fileName: 'version.json',
      source: JSON.stringify({
        commit: process.env.CF_PAGES_COMMIT_SHA || 'dev',
        builtAt: new Date().toISOString(),
      }),
    })
  },
})

export default defineConfig({
  // BASE_PATH is set by the GitHub Pages workflow (e.g. "/repo-name/");
  // local dev and root-domain hosts (Cloudflare Pages) use "/"
  base: process.env.BASE_PATH || '/',
  plugins: [react(), tailwindcss(), versionFile()],
  build: {
    rollupOptions: {
      // the admin is its own page so its code never loads for visitors
      input: { main: resolve(import.meta.dirname, 'index.html'), admin: resolve(import.meta.dirname, 'admin/index.html') },
    },
  },
  server: {
    // `npm run dev:api` serves the Functions on :8788
    proxy: { '/api': 'http://localhost:8788', '/lead': 'http://localhost:8788' },
  },
})
