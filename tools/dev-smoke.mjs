import { mkdtempSync, readdirSync, unlinkSync, rmdirSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import assert from "node:assert/strict";
import { createServer as createViteServer } from "vite";
import { createApp } from "../backend/app.js";
const folder = mkdtempSync(path.join(tmpdir(), "notemd-dev-"));
const app = createApp({
  databasePath: path.join(folder, "dev.sqlite"),
  seed: false,
});
const backend = await new Promise((resolve) => {
  const s = app.listen(0, "127.0.0.1", () => resolve(s));
});
const originalPort = process.env.PORT;
process.env.PORT = String(backend.address().port);
let vite;
try {
  vite = await createViteServer({
    configFile: path.resolve("frontend/app/vite.config.ts"),
    root: path.resolve("frontend/app"),
    optimizeDeps: { noDiscovery: true, entries: [] },
    server: { port: 0, host: "127.0.0.1", strictPort: true },
  });
  await vite.listen();
  const origin = vite.resolvedUrls.local[0].replace(/\/$/, "");
  const front = await fetch(origin);
  assert.equal(front.status, 200);
  const response = await fetch(origin + "/api/patients", {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: origin },
    body: JSON.stringify({
      name: "Dev smoke patient",
      dob: "1990-04-12",
      sex: "Other",
    }),
  });
  assert.equal(response.status, 201, await response.text());
  const rejected = await fetch(origin + "/api/patients", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: "https://example.com",
    },
    body: JSON.stringify({ name: "Rejected", dob: "1990-04-12", sex: "Other" }),
  });
  assert.equal(rejected.status, 403);
  console.log(
    "Development frontend, API proxy, same-origin writes, and foreign-origin rejection passed.",
  );
} finally {
  await vite?.close();
  backend.closeAllConnections();
  await new Promise((resolve) => backend.close(resolve));
  app.locals.db.close();
  if (originalPort === undefined) delete process.env.PORT;
  else process.env.PORT = originalPort;
  for (const name of readdirSync(folder)) unlinkSync(path.join(folder, name));
  rmdirSync(folder);
}
