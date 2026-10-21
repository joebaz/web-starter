// @ts-check
import { URL } from "node:url";
import { mergeConfig } from "astro/config";

import config, { sitemapExclusions } from "../../astro.config.mjs";

const fixturePage = new URL("./about.astro", import.meta.url);

// The site's configuration plus non-root fixture pages. A nested `index`
// segment is its own page, unlike the root index. `/excluded` is left out of
// the sitemap through the exclusion list projects edit.
sitemapExclusions.push("/excluded");

export default mergeConfig(config, {
  integrations: [
    {
      name: "fixture-routes",
      hooks: {
        "astro:config:setup": ({ injectRoute }) => {
          injectRoute({ pattern: "/about", entrypoint: fixturePage });
          injectRoute({ pattern: "/articles/index", entrypoint: fixturePage });
          injectRoute({ pattern: "/excluded", entrypoint: fixturePage });
        },
      },
    },
  ],
});
