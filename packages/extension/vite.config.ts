import { resolve } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteCompression from 'vite-plugin-compression'
import { viteImgCompress } from 'unplugin-img-compress'
import UnoCSS from 'unocss/vite'

export default defineConfig({
  plugins: [
    react(),
    UnoCSS(),
    viteCompression(),
    viteImgCompress({
      APIKey: 'kZgn8pxfdjQjKFmf2StLq7CY4TqMgs0T',
      dir: '',
      runtime: 'build',
      mode: 'once',
    }),
  ],
  build: {
    outDir: '../../dist/extension/ui',
    minify: false,
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
