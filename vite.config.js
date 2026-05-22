import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// portfolio-v2: standalone Vite app, isolated from the legacy site in ../src
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
  },
});
