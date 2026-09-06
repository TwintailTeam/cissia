import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { resolve } from "node:path";

export default defineConfig({
    plugins: [react(), dts({ include: ["src"], tsconfigPath: "./tsconfig.build.json" })],
    build: {
        lib: {
            entry: resolve(import.meta.dirname, "src/index.ts"),
            name: "Cissia",
            fileName: (format) => (format === "es" ? "cissia.js" : "cissia.cjs"),
            formats: ["es", "cjs"],
            cssFileName: "cissia",
        },
        sourcemap: true,
        // Consumers bring their own React and dedupe our deps themselves.
        rollupOptions: { external: ["react", "react-dom", "react/jsx-runtime", "@floating-ui/react", "framer-motion"] },
    },
});
