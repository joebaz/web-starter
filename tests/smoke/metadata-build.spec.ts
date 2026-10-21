import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import { expect, test, type Page } from "@playwright/test";

const execFileAsync = promisify(execFile);
const outDirs: string[] = [];

// Builds share Astro's cache, so run them one at a time and in one browser;
// the browser only parses the generated HTML.
test.describe.configure({ mode: "default" });
test.skip(
  ({ browserName }) => browserName !== "chromium",
  "Build output does not depend on the browser.",
);
test.slow();

test.afterAll(async () => {
  await Promise.all(
    outDirs.map((dir) => rm(dir, { recursive: true, force: true })),
  );
});

async function build(args: string[] = []) {
  const outDir = await mkdtemp(path.join(tmpdir(), "web-starter-build-"));
  outDirs.push(outDir);
  const { stdout, stderr } = await execFileAsync("npx", [
    "astro",
    "build",
    "--outDir",
    outDir,
    ...args,
  ]);
  return { outDir, output: stdout + stderr };
}

async function openBuiltPage(page: Page, outDir: string, file: string) {
  await page.setContent(await readFile(path.join(outDir, file), "utf8"));
}

test("build without a production URL or site name warns and omits dependent tags", async ({
  page,
}) => {
  const { outDir, output } = await build();

  expect(output).toContain("Production URL is not set");
  expect(output).toContain("Site name is not set");

  await openBuiltPage(page, outDir, "index.html");
  await expect(page).toHaveTitle("Astro Web Starter");
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    "content",
    "Astro Web Starter",
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  await expect(page.locator('meta[property="og:url"]')).toHaveCount(0);
  await expect(page.locator('meta[property="og:site_name"]')).toHaveCount(0);
});

// The fixture config builds the homepage and the fixture pages with a
// site name.
test("pages render their metadata with a site name, non-root path, and image", async ({
  page,
}) => {
  const { outDir } = await build([
    "--config",
    "tests/fixtures/named-site/astro.config.mjs",
    "--site",
    "https://example.com",
  ]);

  await openBuiltPage(page, outDir, "index.html");
  await expect(page).toHaveTitle("Astro Web Starter | Example Site");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://example.com/",
  );
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
    "content",
    "https://example.com/",
  );

  await openBuiltPage(page, outDir, "about.html");
  await expect(page).toHaveTitle("About | Example Site");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    "About page description.",
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://example.com/about",
  );
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
    "content",
    "https://example.com/about",
  );
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    "content",
    "About",
  );
  await expect(page.locator('meta[property="og:description"]')).toHaveAttribute(
    "content",
    "About page description.",
  );
  await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute(
    "content",
    "Example Site",
  );
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    "content",
    "https://example.com/images/about.png",
  );
  await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute(
    "content",
    "About image description.",
  );
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
    "content",
    "summary_large_image",
  );

  await openBuiltPage(page, outDir, "articles/index.html");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://example.com/articles/index",
  );
});
