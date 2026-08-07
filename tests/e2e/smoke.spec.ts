import { expect, test } from "@playwright/test";

test("public product communicates the security boundary", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Your plan, kept in motion." }),
  ).toBeVisible();
  await expect(
    page.getByText("We coordinate the process. We cannot read the package."),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Build a test plan/ }).first(),
  ).toBeVisible();
});

test("dashboard exposes the four required plan facts", async ({ page }) => {
  await page.goto("/app");
  await expect(page.getByText("Armed simulation").first()).toBeVisible();
  await expect(page.getByText("Next secure check-in")).toBeVisible();
  await expect(page.getByText("3 of 3 ready")).toBeVisible();
  await expect(page.getByText("Passed 18 Jul")).toBeVisible();
});

test("test package is encrypted and exported locally", async ({ page }) => {
  await page.goto("/app/plans/new");
  await page
    .getByLabel("Local test recovery passphrase")
    .fill("harmless-test-passphrase");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: /Create local test package/ }).click();
  await expect(page.getByText("Local encryption complete")).toBeVisible();
  await expect(page.getByText(/SHA-256/)).toBeVisible();
});

test("mobile landing page does not overflow", async ({ page }) => {
  await page.goto("/");
  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth,
  );
  expect(overflow).toBe(false);
});
