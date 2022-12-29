// FILE: vite.config.js

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls }
    }),

    quasar()
  ],

  server: {
    headers: {
      'Strict-Transport-Security': 'max-age=86400; includeSubDomains',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block'
    }
  }
})