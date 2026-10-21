// @ts-check
import { URL, fileURLToPath } from "node:url";
import { mergeConfig } from "astro/config";

import config from "../astro.config.mjs";

const templateSiteConfig = fileURLToPath(
  new URL("../../../src/site-config.ts", import.meta.url),
);
const namedSiteConfig = fileURLToPath(
  new URL("./site-config.ts", import.meta.url),
);

// The test configuration with the template's site values replaced by a
// configured site name.
export default mergeConfig(config, {
  vite: {
    plugins: [
      {
        name: "named-site-config",
        enforce: "pre",
        async resolveId(source, importer, options) {
          const resolved = await this.resolve(source, importer, options);
          return resolved?.id === templateSiteConfig ? namedSiteConfig : null;
        },
      },
    ],
  },
});
