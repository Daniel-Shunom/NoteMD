import { defineConfig } from "vite";
const apiOrigin = `http://127.0.0.1:${process.env.PORT || 4000}`;
export default defineConfig({
  server: {
    port: Number(process.env.DEV_PORT || 5173),
    host: "127.0.0.1",
    // Retain the browser's host/origin pair so API same-origin checks also
    // work when Vite chooses a different available development port.
    proxy: { "/api": { target: apiOrigin, changeOrigin: false } },
  },
});
