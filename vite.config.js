import { defineConfig } from "vite";

export default defineConfig({
  build: {
    sourcemap: false,
    emptyOutDir: false,
    rollupOptions: {
      input: {
        "bt-overrides.mizz.v1": "src/theme/bt-overrides.mizz.v1.css"
      },
      output: {
        assetFileNames: "[name].[hash][extname]"
      }
    },
    outDir: "dist"
  }
});
