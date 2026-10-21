// Site-wide values used by the shared layout. The production URL is Astro's
// `site` setting in astro.config.mjs.
export interface SiteConfig {
  /** Appended to page titles and used for `og:site_name`; omitted while unset. */
  name?: string;
  /** Language tag for the document's `lang` attribute, such as `en`. */
  language: string;
}

export const siteConfig: SiteConfig = {
  language: "en",
};
