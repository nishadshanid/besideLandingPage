import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // BASE_PATH is set by the GitHub Pages workflow (e.g. "/repo-name/");
  // local dev and root-domain hosts (Vercel/Netlify) use "/"
  base: process.env.BASE_PATH || '/',
  plugins: [react(), tailwindcss()],
})
