import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "node:path";

// Runs the gallery straight against src/, so edits hot-reload without a build.
export default defineConfig({
    root: resolve(import.meta.dirname, "playground"),
    plugins: [react(), tailwindcss()],
    resolve: { alias: { cissia: resolve(import.meta.dirname, "src/index.ts") } },
    server: { port: 5174, strictPort: true },
    preview: { port: 5174, strictPort: true },
    build: { outDir: resolve(import.meta.dirname, "playground-dist"), emptyOutDir: true },
});
