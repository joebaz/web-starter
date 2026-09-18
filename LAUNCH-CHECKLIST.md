# Site Launch Checklist

Use this checklist for the external, human-operated work surrounding a site launch, redesign, or migration. It deliberately excludes source-controlled validation; use the repository's documented development workflow for formatting, testing, builds, and CI.

This file is the canonical, version-controlled checklist for the template. For a project that needs live progress tracking and durable operating notes, copy it to that project's GitHub Wiki homepage and link individual items to project-specific Wiki pages. Do not store secrets in this checklist or its linked pages; keep credentials in 1Password.

## Before launch

- [ ] Classify the work as a same-URL redesign, host or platform move, URL change, or domain or subdomain move.
- [ ] Create a third-party-account inventory that records each service, its purpose, its accountable person, its 1Password vault-item reference, and any MFA or recovery ownership.
- [ ] Record the current public page and asset inventory, including each URL.
- [ ] Capture the current Google Search Console performance and indexing baseline.
- [ ] Capture the current Bing Webmaster Tools performance and indexing baseline.
- [ ] Capture ownership and access details for the domain registrar and DNS provider.
- [ ] Capture ownership and access details for the hosting platform.
- [ ] Capture ownership and access details for the required webmaster tools.
- [ ] Confirm that a rollback-capable previous deployment or build artifact is retained.
- [ ] Document the purpose of analytics when analytics is needed.
- [ ] Create a direct permanent redirect mapping for every changed public URL or asset.
- [ ] Submit the production sitemap to each configured webmaster tool.

## Launch

- [ ] Confirm that the expected domain serves over HTTPS.
- [ ] Confirm that intended hostname redirects behave consistently.
- [ ] Apply the DNS changes that switch hosting providers when changing hosting providers.
- [ ] Verify that each key page returns the expected production content and loads its public assets successfully.
- [ ] Run a production URL audit that verifies direct permanent redirects and canonical URLs.
- [ ] Verify production crawlability.
- [ ] Inspect the production sitemap in Google Search Console.
- [ ] Inspect the production sitemap in Bing Webmaster Tools.
- [ ] Verify analytics if included.
- [ ] Audit production performance for the homepage and every materially distinct page type.
- [ ] Resolve each material performance regression identified by the audit, including oversized images or videos.
- [ ] Complete an AEO content review that confirms each priority page provides a unique, helpful, people-first answer to its intended user question in crawlable visible text.
- [ ] Decommission the previous hosting provider after completing launch verification when replacing a provider.

## First 30 days after launch

- [ ] Recheck availability within 1–2 days.
- [ ] Recheck HTTPS within 1–2 days.
- [ ] Recheck redirects within 1–2 days.
- [ ] Recheck crawlability within 1–2 days.
- [ ] Recheck sitemap processing within 1–2 days.
- [ ] Recheck production performance for the homepage and every materially distinct page type within 1–2 days.
- [ ] Review indexing during the first week.
- [ ] Review redirect and 404 errors during the first week.
- [ ] Review key landing pages during the first week.
- [ ] Compare search performance with the captured baseline during weeks two through four.
- [ ] Compare important landing pages with the captured baseline during weeks two through four.
- [ ] Correct each missing redirect or broken internal link when identified.
- [ ] Retest affected production behavior after each correction.
- [ ] Keep redirects active while the old domain remains owned.

## References

- [Google Search Central: Site Moves and Migrations](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes)
- [Google Search Central: Redirects and Google Search](https://developers.google.com/search/docs/crawling-indexing/301-redirects)
- [Google Search Central: Build and Submit a Sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Google Search Central: Optimizing your website for generative AI features on Google Search](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
- [PageSpeed Insights](https://pagespeed.web.dev/)
