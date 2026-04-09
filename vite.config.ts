import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { youtubeApiPlugin } from "./server/youtubePlugin";

export default defineConfig({
  plugins: [tailwindcss(), react(), youtubeApiPlugin()],
  optimizeDeps: {
    include: ["@excalidraw/excalidraw"],
  },
});
