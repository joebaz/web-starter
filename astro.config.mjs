// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import react from "@astrojs/react";

import { siteConfig } from "./src/site-config.ts";

// https://astro.build/config
export default defineConfig({
  // Set `site` to the production URL during project setup. Canonical and
  // `og:url` tags are omitted until it is set.

  // Page URLs have no trailing slash (#40). File output (`about.html`) keeps
  // development and build URLs consistent.
  trailingSlash: "never",
  build: {
    format: "file",
  },

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [react(), warnAboutUnsetSiteValues()],
});

/**
 * Warns during builds, without failing them, while values used by page
 * metadata are unset.
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
            "Production URL is not set. Set `site` in astro.config.mjs; canonical and og:url tags are omitted until then.",
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
