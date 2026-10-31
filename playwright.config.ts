import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: false,
  workers: 1,
  timeout: 45000,
  use: { baseURL: "http://127.0.0.1:4001", trace: "retain-on-failure" },
  globalSetup: "./tools/e2e-setup.mjs",
  reporter: "list",
});
