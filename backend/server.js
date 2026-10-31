import { createApp } from "./app.js";
const port = Number(process.env.PORT || 4000);
const app = createApp();
const server = app.listen(port, "127.0.0.1", () =>
  console.log(`NoteMD local workspace: http://127.0.0.1:${port}`),
);
server.on("error", (error) => {
  console.error(`Unable to start NoteMD: ${error.message}`);
  app.locals.db.close();
  process.exitCode = 1;
});
for (const signal of ["SIGINT", "SIGTERM"])
  process.on(signal, () =>
    server.close(() => {
      app.locals.db.close();
      process.exit(0);
    }),
  );
