import { expect, test } from "@playwright/test";

// The Playwright web server passes `--site https://example.com`; the template
// leaves the site name unset.
test("homepage renders shared document metadata", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("meta[charset]")).toHaveAttribute(
    "charset",
    "UTF-8",
  );
  await expect(page.locator('meta[name="viewport"]')).toHaveAttribute(
    "content",
    "width=device-width, initial-scale=1",
  );
  await expect(page).toHaveTitle("Astro Web Starter");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    "A template for informational websites for small and medium-sized businesses.",
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://example.com/",
  );
  await expect(
    page.locator('link[rel="icon"][href="/favicon.ico"]'),
  ).toHaveCount(1);
  await expect(
    page.locator('link[rel="icon"][href="/favicon.svg"]'),
  ).toHaveCount(1);

  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute(
    "content",
    "website",
  );
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    "content",
    "Astro Web Starter",
  );
  await expect(page.locator('meta[property="og:description"]')).toHaveAttribute(
    "content",
    "A template for informational websites for small and medium-sized businesses.",
  );
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
    "content",
    "https://example.com/",
  );
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
    "content",
    "summary",
  );
  await expect(page.locator('meta[property="og:site_name"]')).toHaveCount(0);
  await expect(page.locator('meta[property="og:image"]')).toHaveCount(0);
});

// The Playwright test config adds the fixture page at /about.
test("non-root page canonical URLs have no trailing slash", async ({
  page,
}) => {
  await page.goto("/about");

  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://example.com/about",
  );
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
    "content",
    "https://example.com/about",
  );
});
