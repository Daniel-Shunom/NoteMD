import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { createApp } from "../app.js";
let server, base, db;
before(async () => {
  const app = createApp({ databasePath: ":memory:", seed: false });
  db = app.locals.db;
  server = await new Promise((resolve) => {
    const s = app.listen(0, "127.0.0.1", () => resolve(s));
  });
  base = `http://127.0.0.1:${server.address().port}`;
});
after(async () => {
  await new Promise((resolve) => server.close(resolve));
  db.close();
});
async function request(path, method = "GET", body) {
  const response = await fetch(base + "/api" + path, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  return { status: response.status, data: await response.json() };
}
const patientInput = {
  name: "Test Patient",
  dob: "1990-04-12",
  sex: "Female",
  email: "test@example.com",
  phone: "",
  allergies: "None recorded",
  conditions: "Test only",
};
test("health and persistent patient CRUD are available without external services", async () => {
  assert.equal((await request("/health")).status, 200);
  const created = await request("/patients", "POST", patientInput);
  assert.equal(created.status, 201);
  assert.equal((await request("/patients")).data[0].name, "Test Patient");
  const updated = await request(`/patients/${created.data.id}`, "PATCH", {
    ...patientInput,
    name: "Updated Patient",
  });
  assert.equal(updated.data.name, "Updated Patient");
});
test("invalid dates, missing names, and unknown patient references fail clearly", async () => {
  assert.equal(
    (await request("/patients", "POST", { ...patientInput, dob: "2023-02-30" }))
      .status,
    400,
  );
  assert.equal(
    (await request("/patients", "POST", { ...patientInput, name: "" })).status,
    400,
  );
  assert.equal(
    (await request("/notes", "POST", { patientId: "missing", title: "Test" }))
      .status,
    404,
  );
});
test("notes save, reject stale versions, and become immutable after signing", async () => {
  const patient = (await request("/patients", "POST", patientInput)).data;
  const note = (
    await request("/notes", "POST", {
      patientId: patient.id,
      title: "Follow-up",
      type: "Follow-up",
    })
  ).data;
  assert.equal(note.status, "draft");
  const saved = await request(`/notes/${note.id}`, "PATCH", {
    version: note.version,
    subjective: "Test content",
  });
  assert.equal(saved.data.subjective, "Test content");
  assert.equal(
    (
      await request(`/notes/${note.id}`, "PATCH", {
        version: note.version,
        title: "Stale",
      })
    ).status,
    409,
  );
  const signed = await request(`/notes/${note.id}`, "PATCH", {
    version: saved.data.version,
    status: "signed",
  });
  assert.equal(signed.data.status, "signed");
  assert.equal(
    (
      await request(`/notes/${note.id}`, "PATCH", {
        version: signed.data.version,
        title: "Overwrite signed record",
      })
    ).status,
    409,
  );
});
test("medications, appointments, and documents are stored under their patient", async () => {
  const p = (await request("/patients", "POST", patientInput)).data;
  const med = await request("/medications", "POST", {
    patientId: p.id,
    name: "Example medication",
    dosage: "Recorded dosage",
    frequency: "As recorded",
    instructions: "",
  });
  assert.equal(med.status, 201);
  assert.equal(
    (
      await request(`/medications/${med.data.id}`, "PATCH", {
        status: "discontinued",
      })
    ).data.status,
    "discontinued",
  );
  const appt = await request("/appointments", "POST", {
    patientId: p.id,
    date: "2030-06-10",
    time: "09:30",
    duration: 30,
    reason: "Follow-up",
  });
  assert.equal(appt.status, 201);
  assert.equal(
    (
      await request("/appointments", "POST", {
        patientId: p.id,
        date: "2030-06-10",
        time: "09:45",
        duration: 30,
        reason: "Overlapping",
      })
    ).status,
    409,
  );
  assert.equal(
    (
      await request(`/appointments/${appt.data.id}`, "PATCH", {
        status: "completed",
      })
    ).data.status,
    "completed",
  );
  const doc = await request("/documents", "POST", {
    patientId: p.id,
    name: "test.txt",
    mime: "text/plain",
    content: Buffer.from("Test document").toString("base64"),
  });
  assert.equal(doc.status, 201);
  assert.equal(
    await (await fetch(base + `/api/documents/${doc.data.id}/download`)).text(),
    "Test document",
  );
  assert.equal(
    (
      await request("/documents", "POST", {
        patientId: p.id,
        name: "bad.html",
        mime: "text/html",
        content: "eA==",
      })
    ).status,
    400,
  );
  assert.equal(
    (await request(`/documents/${doc.data.id}`, "DELETE")).status,
    200,
  );
});
test("API errors are JSON and cross-origin mutations are refused", async () => {
  assert.equal((await request("/not-found")).status, 404);
  const response = await fetch(base + "/api/patients", {
    method: "POST",
    headers: {
      Origin: "https://example.com",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(patientInput),
  });
  assert.equal(response.status, 403);
});
