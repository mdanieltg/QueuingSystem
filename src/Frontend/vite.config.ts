import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Suggested by the Bootstrap documentation at https://getbootstrap.com/docs/5.3/getting-started/vite/
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: [
          "import",
          "if-function",
          "mixed-decls",
          "color-functions",
          "global-builtin"
        ]
      }
    }
  }
});
