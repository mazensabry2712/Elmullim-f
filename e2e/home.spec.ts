import { expect, test } from "@playwright/test";

test("home page loads successfully", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/Elmullim \| Home/i);
  await expect(page.locator("#root")).toBeVisible();
});
