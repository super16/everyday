import { VitePWA } from "vite-plugin-pwa"
import { defineConfig } from "vite"

export default defineConfig({
  base: process.env.NODE_ENV === "production" ? "/everyday/" : "/",
  plugins: [VitePWA({
    registerType: "autoUpdate",
    injectRegister: false,

    pwaAssets: {
      disabled: false,
      config: true,
    },

    manifest: {
      name: "Everyday",
      short_name: "Everyday",
      description: "Todo app for daily tasks",
      theme_color: "#242424",
    },

    workbox: {
      globPatterns: ["**/*.{js,css,html,svg,png,ico}"],
      cleanupOutdatedCaches: true,
      clientsClaim: true,
    },

    devOptions: {
      enabled: false,
      navigateFallback: "index.html",
      suppressWarnings: true,
      type: "module",
    },
  })],
})
