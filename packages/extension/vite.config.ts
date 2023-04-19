import { resolve } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import UnoCSS from 'unocss/vite'

export default defineConfig({
  plugins: [
    react(),
    UnoCSS(),
  ],
  build: {
    outDir: '../../dist/extension',
    minify: true,
    cssCodeSplit: true,
    commonjsOptions: {
      ignoreTryCatch: false,
    },
    rollupOptions: {
      // http://localhost:5173/chrome-popup/popup.html
      input: {
        option: resolve(__dirname, 'chrome-option/option.html'),
        popup: resolve(__dirname, 'chrome-popup/popup.html'),
      },
    },
  },
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
  },
})
