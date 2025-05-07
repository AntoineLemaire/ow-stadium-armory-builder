import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { configDefaults } from "vitest/config";

export default defineConfig({
  base: "/ow-stadium-armory-builder/",
  plugins: [react()],
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx"],
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/setupTests.ts",
    exclude: [...configDefaults.exclude, "e2e/**"],
  },
});
