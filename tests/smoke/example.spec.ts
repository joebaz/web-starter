import { expect, test } from "@playwright/test";
import { expectAccessible } from "../support/accessibility";

test("homepage renders", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("Astro Web Starter");
  await expect(
    page.getByRole("heading", { name: "Astro Web Starter", level: 1 }),
  ).toBeVisible();
});

test("homepage has no detected accessibility violations", async ({ page }) => {
  const response = await page.goto("/");

  expect(response?.status()).toBe(200);
  await expect(
    page.getByRole("heading", { name: "Astro Web Starter", level: 1 }),
  ).toBeVisible();

  await expectAccessible(page);
});
