import { execFile } from "node:child_process";
import { mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import { expect, test, type Page } from "@playwright/test";

const execFileAsync = promisify(execFile);
const outDirs: string[] = [];
const builds = new Map<string, ReturnType<typeof runBuild>>();

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

// Tests with the same build arguments share one build.
function build(args: string[] = []) {
  const key = args.join(" ");
  let result = builds.get(key);
  if (!result) {
    result = runBuild(args);
    builds.set(key, result);
  }
  return result;
}

async function runBuild(args: string[]) {
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

function readBuiltFile(outDir: string, file: string) {
  return readFile(path.join(outDir, file), "utf8");
}

async function openBuiltPage(page: Page, outDir: string, file: string) {
  await page.setContent(await readBuiltFile(outDir, file));
}

// Parses a generated XML file and returns the text of the elements matching
// `selector`.
async function xmlValues(
  page: Page,
  outDir: string,
  file: string,
  selector: string,
) {
  const xml = await readBuiltFile(outDir, file);
  return page.evaluate(
    ([xml, selector]) => {
      const document = new DOMParser().parseFromString(xml, "application/xml");
      if (document.querySelector("parsererror")) {
        throw new Error("The file is not well-formed XML.");
      }
      return Array.from(
        document.querySelectorAll(selector),
        (element) => element.textContent,
      );
    },
    [xml, selector],
  );
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

test("build without a production URL allows crawling and omits the sitemap", async () => {
  const { outDir } = await build();

  const files = await readdir(outDir);
  expect(files.filter((file) => file.startsWith("sitemap"))).toEqual([]);
  expect(await readBuiltFile(outDir, "robots.txt")).toBe(
    "User-agent: *\nAllow: /\n",
  );
});

test("template build includes the custom 404 page", async ({ page }) => {
  const { outDir } = await build();

  await openBuiltPage(page, outDir, "404.html");
  await expect(
    page.getByRole("heading", { name: "Page not found", level: 1 }),
  ).toBeVisible();
});

const configuredBuildArgs = [
  "--config",
  "tests/fixtures/named-site/astro.config.mjs",
  "--site",
  "https://example.com",
];

// The fixture config builds the homepage and the fixture pages with a
// site name.
test("pages render their metadata with a site name, non-root path, and image", async ({
  page,
}) => {
  const { outDir } = await build(configuredBuildArgs);

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

// The fixture config excludes `/excluded` from the sitemap. Sitemap URLs follow
// the canonical URL form, and endpoints such as robots.txt are not pages.
test("sitemap lists built pages at their production URLs, except excluded pages", async ({
  page,
}) => {
  const { outDir } = await build(configuredBuildArgs);

  expect(
    await xmlValues(
      page,
      outDir,
      "sitemap-index.xml",
      "sitemapindex > sitemap > loc",
    ),
  ).toEqual(["https://example.com/sitemap-0.xml"]);
  expect(
    await xmlValues(page, outDir, "sitemap-0.xml", "urlset > url > loc"),
  ).toEqual([
    "https://example.com/",
    "https://example.com/about",
    "https://example.com/articles/index",
  ]);

  // Exclusion removes the page from the sitemap only.
  await openBuiltPage(page, outDir, "excluded.html");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://example.com/excluded",
  );
});

test("robots.txt allows crawling and references the sitemap's production URL", async () => {
  const { outDir } = await build(configuredBuildArgs);

  expect(await readBuiltFile(outDir, "robots.txt")).toBe(
    "User-agent: *\nAllow: /\n\nSitemap: https://example.com/sitemap-index.xml\n",
  );
});
