import { defineConfig } from "vite";
import { moonbit } from "vite-plugin-moonbit";

export default defineConfig(({ command }) => ({
  build: {
    assetsInlineLimit: 0,
  },
  plugins: [
    moonbit({
      mode: command === "serve" ? "debug" : "release",
      watch: true,
      showLogs: true,
    }),
  ],
}));
