import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    open: true,
    host: "127.0.0.1",
  },
  build: {
    outDir: "dist",
    chunkSizeWarningLimit: 900,
  },
  optimizeDeps: {
    include: ["three", "@react-three/fiber"],
  },
});