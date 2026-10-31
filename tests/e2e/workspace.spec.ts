import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdirSync } from "node:fs";
const review = ".impeccable/review";

const accessibilityIssues: string[] = [];
async function noAccessibilityViolations(page: any) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  accessibilityIssues.push(
    ...results.violations.map(
      (v) =>
        `${page.url()} at ${page.viewportSize()?.width}: ${v.id}: ${v.nodes.map((n) => n.target).join(", ")}`,
    ),
  );
}
async function noPageOverflow(page: any) {
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
}

test("desktop and mobile screens are readable, accessible, and fit their viewport", async ({
  page,
}) => {
  mkdirSync(review, { recursive: true });
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Today", exact: true }),
  ).toBeVisible();
  await page.evaluate(() => {
    (document.activeElement as HTMLElement)?.blur();
    window.scrollTo(0, 0);
  });
  await page.screenshot({ path: `${review}/desktop.png`, fullPage: true });
  await noPageOverflow(page);
  await noAccessibilityViolations(page);
  await page.getByRole("link", { name: "Patients", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Patients", exact: true }),
  ).toBeVisible();
  await page.evaluate(() => {
    (document.activeElement as HTMLElement)?.blur();
    window.scrollTo(0, 0);
  });
  await page.screenshot({
    path: `${review}/patients-desktop.png`,
    fullPage: true,
  });
  await noAccessibilityViolations(page);
  await page
    .getByRole("link", { name: "Olivia Bennett", exact: false })
    .first()
    .click();
  await expect(
    page.getByRole("heading", { name: "Olivia Bennett" }),
  ).toBeVisible();
  await page.evaluate(() => {
    (document.activeElement as HTMLElement)?.blur();
    window.scrollTo(0, 0);
  });
  await page.screenshot({
    path: `${review}/patient-desktop.png`,
    fullPage: true,
  });
  await page
    .getByRole("link", { name: /Follow-up consultation/ })
    .first()
    .click();
  await expect(
    page.getByRole("heading", { name: "Clinical note", exact: true }),
  ).toBeVisible();
  await page.evaluate(() => {
    (document.activeElement as HTMLElement)?.blur();
    window.scrollTo(0, 0);
  });
  await page.screenshot({
    path: `${review}/editor-desktop.png`,
    fullPage: true,
  });
  await noAccessibilityViolations(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator("main").focus();
  await expect(page.locator(".mobile-patient-context")).toContainText(
    "Seasonal allergies",
  );
  await page.evaluate(() => {
    (document.activeElement as HTMLElement)?.blur();
    window.scrollTo(0, 0);
  });
  await page.screenshot({
    path: `${review}/editor-mobile.png`,
    fullPage: true,
  });
  await noPageOverflow(page);
  await noAccessibilityViolations(page);
  await page.getByRole("link", { name: "Today", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Today", exact: true }),
  ).toBeVisible();
  await page.evaluate(() => {
    (document.activeElement as HTMLElement)?.blur();
    window.scrollTo(0, 0);
  });
  await page.screenshot({ path: `${review}/mobile.png`, fullPage: true });
  await noPageOverflow(page);
  await noAccessibilityViolations(page);
  await page.getByRole("link", { name: "Patients", exact: true }).click();
  await page.evaluate(() => {
    (document.activeElement as HTMLElement)?.blur();
    window.scrollTo(0, 0);
  });
  await page.screenshot({
    path: `${review}/patients-mobile.png`,
    fullPage: true,
  });
  await noPageOverflow(page);
  await page.getByRole("link", { name: "Schedule", exact: true }).click();
  await page.evaluate(() => {
    (document.activeElement as HTMLElement)?.blur();
    window.scrollTo(0, 0);
  });
  await page.screenshot({
    path: `${review}/schedule-mobile.png`,
    fullPage: true,
  });
  await noPageOverflow(page);
  await noAccessibilityViolations(page);
  expect(errors).toEqual([]);
  expect(accessibilityIssues).toEqual([]);
});

test("clinician can manage a patient, save and sign notes, record medications, upload files, and schedule", async ({
  page,
}) => {
  await page.goto("/#patients/new");
  await page.getByLabel("Full name").fill("Taylor Test");
  await page.getByLabel("Date of birth").fill("1990-04-12");
  await page
    .getByRole("combobox", { name: "Sex", exact: true })
    .selectOption("Other");
  await page.getByLabel("Email").fill("taylor@example.com");
  await page.getByLabel("Allergies").fill("None reported");
  await page.getByLabel("Conditions").fill("Test record");
  await page.getByRole("button", { name: "Add patient", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Taylor Test", exact: true }),
  ).toBeVisible();
  const patientUrl = page.url();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Taylor Test", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Edit details" }).click();
  await page.getByLabel("Phone").fill("202-555-0199");
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  await expect(page.getByRole("link", { name: "202-555-0199" })).toBeVisible();
  await page
    .getByRole("button", { name: "New note", exact: true })
    .first()
    .click();
  await page.getByLabel("Title", { exact: true }).fill("Test consultation");
  await page.getByRole("button", { name: "Create note", exact: true }).click();
  await page
    .getByPlaceholder("Patient-reported concerns and history.")
    .fill("Patient reported concerns recorded for test.");
  await page
    .getByPlaceholder("Next steps and follow-up.")
    .fill("Follow-up recorded for test.");
  await expect(
    page.getByText("Unsaved changes", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Save draft", exact: true }).click();
  await expect(
    page.getByText("All changes saved", { exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByPlaceholder("Patient-reported concerns and history."),
  ).toHaveValue("Patient reported concerns recorded for test.");
  await page.getByRole("button", { name: "Sign note", exact: true }).click();
  await page.getByRole("button", { name: "Confirm and sign" }).click();
  await expect(page.getByText(/This note is read-only/)).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Save draft", exact: true }),
  ).toHaveCount(0);
  await page.goto(patientUrl);
  await page.getByRole("button", { name: /Medications/ }).click();
  await page
    .getByRole("button", { name: "Add medication", exact: true })
    .first()
    .click();
  await page.getByLabel("Medication name").fill("Recorded example");
  await page.getByLabel("Dosage").fill("Recorded dosage");
  await page.getByLabel("Frequency").fill("As recorded");
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Add medication", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Recorded example Active" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Discontinue", exact: true }).click();
  await page.getByRole("button", { name: "Confirm", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Recorded example Discontinued" }),
  ).toBeVisible();
  await page.getByRole("button", { name: /Documents/ }).click();
  await page.getByLabel("Upload patient document").setInputFiles({
    name: "test-record.txt",
    mimeType: "text/plain",
    buffer: Buffer.from("Synthetic test record"),
  });
  await expect(
    page.getByText("test-record.txt", { exact: true }),
  ).toBeVisible();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("link", { name: "Download test-record.txt" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("test-record.txt");
  await page.getByRole("link", { name: "Schedule", exact: true }).click();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const visitDate = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, "0")}-${String(tomorrow.getDate()).padStart(2, "0")}`;
  await page.getByLabel("Schedule date").fill(visitDate);
  await page
    .getByRole("button", { name: "Schedule appointment", exact: true })
    .first()
    .click();
  await expect(
    page.getByRole("dialog").getByLabel("Date", { exact: true }),
  ).toHaveValue(visitDate);
  await page
    .getByRole("combobox", { name: "Patient", exact: true })
    .selectOption({ label: "Taylor Test" });
  await page.getByLabel("Time", { exact: true }).fill("16:30");
  await page.getByLabel("Reason for visit").fill("Test follow-up");
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Schedule appointment", exact: true })
    .first()
    .click();
  await expect(page.getByText("Test follow-up", { exact: true })).toBeVisible();
  const row = page
    .locator(".appointment-row")
    .filter({ hasText: "Taylor Test" });
  await row.getByRole("button", { name: "Check in", exact: true }).click();
  await expect(row.getByText("Checked in", { exact: true })).toBeVisible();
  await row.getByRole("button", { name: "Complete", exact: true }).click();
  await expect(row.getByText("Completed", { exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Settings", exact: true }).click();
  await page.getByLabel("Practice name").fill("Test practice");
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  await expect(page.getByText("Changes saved", { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByLabel("Practice name")).toHaveValue("Test practice");
});

test("search, empty states, unsaved-note protection, and keyboard access work", async ({
  page,
}) => {
  await page.goto("/#patients");
  await page
    .getByRole("textbox", { name: "Search patients", exact: true })
    .fill("no-match-xyz");
  await expect(
    page.getByRole("heading", { name: "No patients match your search" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Clear search", exact: true })
    .first()
    .click();
  await expect(
    page.getByRole("link", { name: /Olivia Bennett/ }).first(),
  ).toBeVisible();
  await page
    .getByRole("link", { name: /Olivia Bennett/ })
    .first()
    .click();
  await page
    .getByRole("link", { name: /Follow-up consultation/ })
    .first()
    .click();
  await page
    .getByPlaceholder("Patient-reported concerns and history.")
    .fill("Unsaved test content");
  page.once("dialog", (dialog) => dialog.dismiss());
  await page.getByRole("link", { name: "Today", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Clinical note", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Save draft", exact: true }).click();
  await expect(
    page.getByText("All changes saved", { exact: true }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Today", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Today", exact: true }),
  ).toBeVisible();
  await page.keyboard.press("Control+k");
  await expect(
    page.getByRole("textbox", { name: "Find a patient" }),
  ).toBeFocused();
  await page.keyboard.type("James");
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("heading", { name: "Patients", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /James Wilson/ }).first(),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: /Olivia Bennett/ })).toHaveCount(
    0,
  );
});

test("dialogs provide quiet pointer feedback, reduced-motion support, and instant keyboard access", async ({
  page,
}) => {
  await page.addInitScript(() => {
    (window as any).__motionCalls = [];
    const original = Element.prototype.animate;
    Element.prototype.animate = function (frames, options) {
      (window as any).__motionCalls.push({ frames, options });
      return original.call(this, frames, options);
    };
  });
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "New note", exact: true });
  await trigger.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  const pointerMotion = await page.evaluate(() =>
    (window as any).__motionCalls.at(-1),
  );
  expect(pointerMotion.options.duration).toBe(200);
  expect(pointerMotion.frames[0].transform).toBe("scale(0.97)");
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  const count = await page.evaluate(() => (window as any).__motionCalls.length);
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog")).toBeVisible();
  expect(await page.evaluate(() => (window as any).__motionCalls.length)).toBe(
    count,
  );
  await page.keyboard.press("Escape");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await trigger.click();
  const reduced = await page.evaluate(() =>
    (window as any).__motionCalls.at(-1),
  );
  expect(reduced.options.duration).toBe(100);
  expect(reduced.frames.every((frame: any) => !frame.transform)).toBe(true);
  await page.keyboard.press("Escape");
  await page.setViewportSize({ width: 390, height: 844 });
  await trigger.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.evaluate(async () => {
    await Promise.all(
      document
        .querySelector("dialog")!
        .getAnimations()
        .map((a) => a.finished),
    );
    window.scrollTo(0, 0);
  });
  await page.screenshot({
    path: `${review}/dialog-mobile.png`,
    fullPage: true,
  });
  await noPageOverflow(page);
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});
