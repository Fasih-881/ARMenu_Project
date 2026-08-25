import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  server: {
    host: "0.0.0.0",

    proxy: {
      "/get": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },

      "/ARModels": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});