import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? '/Buck-Converter/' : '/',
  build: {
    target: 'es2020',
    assetsInlineLimit: 0,
  },
}))
