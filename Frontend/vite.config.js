import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test.js'],
    testMatch: ['./src/**/*.test.jsx'],
    css: true,
    globals: true
  },
  
})
