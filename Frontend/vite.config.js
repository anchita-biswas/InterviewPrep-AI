import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  /* served from the root of the Render domain, not a GitHub Pages subpath */
  base: "/",
  server: {
    /* keeps API calls same-origin in development, mirroring production */
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
})
