import { expect, test } from "@playwright/test";

test("homepage renders", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("Astro Web Starter");
  await expect(
    page.getByRole("heading", { name: "Astro Web Starter", level: 1 }),
  ).toBeVisible();
});
