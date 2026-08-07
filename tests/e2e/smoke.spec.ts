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
    page.getByRole("link", { name: /Try a practice plan/ }).first(),
  ).toBeVisible();
});

test("dashboard exposes the four required plan facts", async ({ page }) => {
  await page.goto("/app");
  await expect(page.getByText("Practice plan active").first()).toBeVisible();
  await expect(page.getByText("We will ask if you are okay in")).toBeVisible();
  await expect(page.getByText("3 of 3 ready")).toBeVisible();
  await expect(page.getByText("Passed 18 Jul")).toBeVisible();
});

test("test package is encrypted and exported locally", async ({ page }) => {
  await page.goto("/app/plans/new");
  await page.getByLabel("Practice password").fill("harmless-test-passphrase");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: /Lock my practice package/ }).click();
  await expect(
    page.getByText("Your practice package is locked."),
  ).toBeVisible();
  await page.getByText("Technical details").click();
  await expect(page.getByText(/SHA-256/)).toBeVisible();
});

test("onboarding explains every safety choice", async ({ page }) => {
  await page.goto("/app/onboarding");
  await page.getByRole("button", { name: /My business/ }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: /Every 2 weeks/ }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(
    page.getByRole("button", { name: /Three out of five people must agree/ }),
  ).toContainText("If answers conflict, sharing stops.");
  await expect(
    page.getByRole("button", { name: /Wait, then ask two people/ }),
  ).toContainText("This gives you the most time to return.");
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
