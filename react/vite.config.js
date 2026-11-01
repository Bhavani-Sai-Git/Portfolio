import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  // Absolute site URL for the social-share tags in index.html (no trailing slash).
  const siteUrl = (env.VITE_SITE_URL || "").replace(/\/+$/, "");
  return {
    plugins: [
      react(),
      {
        name: "site-url",
        transformIndexHtml: (html) => html.replaceAll("__SITE_URL__", siteUrl),
      },
    ],
  };
});
