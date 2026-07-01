import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The `base` must match the GitHub repository name so that assets resolve
// correctly when served from https://<user>.github.io/<repo>/.
// Override at build time with VITE_BASE if the repo name differs.
const base = process.env.VITE_BASE ?? '/uipath-experiential-learning/'

export default defineConfig({
  base,
  plugins: [react()],
})
