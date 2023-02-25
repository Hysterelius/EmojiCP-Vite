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
      'Content-Security-Policy': "script-src 'self' 'sha256-mmaBgWlsOVoMkqC5s+vKzLFJ/t/iy7w8P7jX0WUe4Uw='; style-src 'self' 'sha256-xQU2JFaFDXi4FCb1ytEGKWxhTPxvVs20Qzw7cMmTGBI=' 'sha256-9wekLdNYkqDuT3Z6/y2jedOEGaJo10K8OM+nbjwARD0=' 'sha256-a6n8BhVV0lFqCoOJ+NcvaksZvjwpNFYBVKoM4Adr55Y=' 'sha256-OZ+0sGyazgOzwxhk9mK5LpqTUORAkPP3fBM0pN/bobE='",
    },
  },
});
