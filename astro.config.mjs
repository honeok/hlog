import sitemap from "@astrojs/sitemap";
import { satteri } from "@astrojs/markdown-satteri";
import { defineConfig, fontProviders } from "astro/config";
import { SITE } from "./src/config.ts";
import copyCodeBlocks from "./src/plugins/copy-code.mjs";
import readingTime from "./src/plugins/reading-time.mjs";
import video from "./src/plugins/video.mjs";

export default defineConfig({
  site: SITE.url,
  trailingSlash: "never",
  output: "static",
  fonts: [
    {
      provider: fontProviders.google(),
      name: "Noto Serif SC",
      cssVariable: "--font-serif",
      weights: ["200 900"],
      styles: ["normal"],
      subsets: ["latin"],
      fallbacks: ["ui-serif", "Georgia", "Times New Roman", "serif"],
      display: "swap",
    },
    {
      provider: fontProviders.fontsource(),
      name: "JetBrains Mono",
      cssVariable: "--font-mono",
      weights: ["100 800"],
      styles: ["normal"],
      subsets: ["cyrillic-ext", "cyrillic", "greek", "vietnamese", "latin-ext", "latin"],
      fallbacks: ["monospace"],
      display: "swap",
    },
  ],
  build: {
    format: "preserve",
  },
  integrations: [
    sitemap({
      serialize(item) {
        const url = new URL(item.url);

        if (/^\/[1-9]\d*$/.test(url.pathname)) {
          url.pathname += ".html";
          item.url = url.href;
        }

        return item;
      },
    }),
  ],
  markdown: {
    processor: satteri({
      features: {
        directive: true,
        smartPunctuation: {
          quotes: false,
          dashes: true,
          ellipses: true,
        },
      },
      mdastPlugins: [video, readingTime],
      hastPlugins: [copyCodeBlocks],
    }),
    shikiConfig: {
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
    },
  },
});
