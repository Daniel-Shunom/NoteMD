import { mkdtempSync, readdirSync, unlinkSync, rmdirSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { createApp } from "../backend/app.js";
export default async function setup() {
  const folder = mkdtempSync(path.join(tmpdir(), "notemd-e2e-"));
  const app = createApp({
    databasePath: path.join(folder, "test.sqlite"),
    seed: true,
  });
  const server = await new Promise((resolve, reject) => {
    const listener = app.listen(4001, "127.0.0.1", () => resolve(listener));
    listener.once("error", reject);
  });
  return async () => {
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
    app.locals.db.close();
    for (const name of readdirSync(folder)) unlinkSync(path.join(folder, name));
    rmdirSync(folder);
  };
}
