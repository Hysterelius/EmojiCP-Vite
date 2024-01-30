// FILE: vite.config.js

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { quasar, transformAssetUrls } from "@quasar/vite-plugin";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls },
    }),

    quasar(),
  ],

  server: {
    headers: {
      "Strict-Transport-Security": "max-age=86400; includeSubDomains",
      "X-Frame-Options": "DENY",
      "X-XSS-Protection": "1; mode=block",
      'Content-Security-Policy': "script-src 'self' 'sha256-mmaBgWlsOVoMkqC5s+vKzLFJ/t/iy7w8P7jX0WUe4Uw='; style-src 'self' 'sha256-GtjAc689pnmCaBh6Imq7HOm1IcOefnSBYaUEjmTCIvI=' 'sha256-bESg7MVKSOA3sl63nMw2+gOqAUTpYZRTpzhDbxjeBjU=' 'sha256-2FpZhhgM+U+GSxs8WvrjoWXyJ3J0/1V8k7cuBvYvVNc='",
    },
  },
});
