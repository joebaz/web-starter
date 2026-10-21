import { expect, test } from "@playwright/test";
import { expectAccessible } from "../support/accessibility";

const missingUrl = "/this-page-does-not-exist";

test("missing URL returns HTTP 404 with the custom page", async ({ page }) => {
  const response = await page.goto(missingUrl);

  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { name: "Page not found", level: 1 }),
  ).toBeVisible();
  await expect(
    page.getByText(
      "Sorry, we can't find that page. It may have moved or no longer exists.",
    ),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Go to the homepage" }),
  ).toHaveAttribute("href", "/");
});

test("homepage link opens the homepage", async ({ page }) => {
  await page.goto(missingUrl);

  const homepageResponse = page.waitForResponse((response) =>
    response.request().isNavigationRequest(),
  );
  await page.getByRole("link", { name: "Go to the homepage" }).click();

  expect((await homepageResponse).status()).toBe(200);
  await expect(page).toHaveURL("/");
  await expect(
    page.getByRole("heading", { name: "Astro Web Starter", level: 1 }),
  ).toBeVisible();
});

test("missing URL page has no detected accessibility violations", async ({
  page,
}) => {
  const response = await page.goto(missingUrl);

  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { name: "Page not found", level: 1 }),
  ).toBeVisible();

  await expectAccessible(page);
});
