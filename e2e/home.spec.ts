import { expect, test } from "@playwright/test";

test("home page loads and its primary calls to action navigate correctly", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("elmullim-language", "en");
  });

  await page.goto("/");

  await expect(page).toHaveTitle(/Elmullim \| Home/i);
  await expect(page.locator("#root")).toBeVisible();

  const lessonsLink = page.getByRole("link", { name: "Explore Lessons" });
  await expect(lessonsLink).toBeVisible();
  await expect(lessonsLink).toHaveAttribute("href", "/lessons");

  const teachersLink = page.getByRole("link", { name: "Discover Teachers" });
  await expect(teachersLink).toBeVisible();
  await expect(teachersLink).toHaveAttribute("href", "/teachers");
});
