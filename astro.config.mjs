// @ts-check
import { URL } from "node:url";
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import react from "@astrojs/react";

import sitemap from "@astrojs/sitemap";

import { siteConfig } from "./src/site-config.ts";

// Pages to leave out of the sitemap, as canonical paths such as "/thank-you".
// Every other static page is included.
/** @type {string[]} */
export const sitemapExclusions = [];

// https://astro.build/config
export default defineConfig({
  // Set `site` to the production URL during project setup. Canonical and
  // `og:url` tags, the sitemap, and its robots.txt reference are omitted until
  // it is set.

  // Page URLs have no trailing slash (#40). File output (`about.html`) keeps
  // development and build URLs consistent.
  trailingSlash: "never",
  build: {
    format: "file",
  },

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [
    react(),
    sitemap({
      filter: (page) => !sitemapExclusions.includes(new URL(page).pathname),
    }),
    warnAboutUnsetSiteValues(),
  ],
});

/**
 * Warns during builds, without failing them, while values used by page
 * metadata or the sitemap are unset.
 * @returns {import("astro").AstroIntegration}
 */
function warnAboutUnsetSiteValues() {
  return {
    name: "site-values",
    hooks: {
      "astro:config:setup": ({ command, config, logger }) => {
        if (command !== "build") return;
        if (!config.site) {
          logger.warn(
            "Production URL is not set. Set `site` in astro.config.mjs; canonical and og:url tags, the sitemap, and its robots.txt reference are omitted until then.",
          );
        }
        if (!siteConfig.name) {
          logger.warn(
            "Site name is not set. Set `name` in src/site-config.ts; titles and og:site_name omit it until then.",
          );
        }
      },
    },
  };
}
