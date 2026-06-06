/// <reference types="vite-plus/test" />
import { defineConfig } from "vite-plus";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

import { cloudflare } from "@cloudflare/vite-plugin";

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  const plugins = [
    vue(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "betterGov_Favicon.svg"],
      manifest: {
        name: "Ayuda",
        short_name: "Ayuda",
        description: "Philippine Government Social Benefits Navigator",
        theme_color: "#1e3a8a",
        background_color: "#f8fafc",
        icons: [
          {
            src: "betterGov_Favicon.svg",
            sizes: "any",
            type: "image/svg+xml",
          },
        ],
      },
    }),
    cloudflare(),
  ];

  if (command === "build") {
    plugins.push({
      name: "force-exit",
      closeBundle() {
        const bun = (globalThis as any).Bun;
        if (bun) {
          bun.exit(0);
        } else {
          process.exit(0);
        }
      },
    });
  }

  return {
    staged: {
      "*": "vp check --fix",
    },
    fmt: {},
    lint: {
      jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
      rules: { "vite-plus/prefer-vite-plus-imports": "error" },
      options: { typeAware: true, typeCheck: true },
    },
    plugins,
    test: {
      environment: "jsdom",
      globals: true,
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              if (
                id.includes("vue") ||
                id.includes("@vue") ||
                id.includes("pinia") ||
                id.includes("vue-router")
              ) {
                return "vue-vendor";
              }
              if (id.includes("lucide-vue-next")) {
                return "icons";
              }
              if (id.includes("motion")) {
                return "motion";
              }
              return "vendor";
            }
          },
        },
      },
    },
  };
});
