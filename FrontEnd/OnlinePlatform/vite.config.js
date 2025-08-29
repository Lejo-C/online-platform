import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
        tailwindcss(),],
        server: {
    proxy: {
      '/create-exam': 'http://localhost:3000',
      '/exams': 'http://localhost:3000',
      // Add more endpoints as needed
    }
  }
})
