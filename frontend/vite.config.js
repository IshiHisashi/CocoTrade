import eslint from "vite-plugin-eslint";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), eslint()],
  optimizeDeps: {
    include: ["chart.js", "moment", "chartjs-adapter-moment"],
  },
});
