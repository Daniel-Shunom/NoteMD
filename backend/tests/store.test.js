import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readdirSync, unlinkSync, rmdirSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { openStore } from "../store.js";

test("patient records survive closing and reopening the database; demo seed runs only once", () => {
  const folder = mkdtempSync(path.join(tmpdir(), "notemd-store-"));
  const filename = path.join(folder, "records.sqlite");
  let store;
  try {
    store = openStore(filename, true);
    const initial = store.all("patients").length;
    assert.equal(initial, 6);
    const p = store.create("patients", {
      name: "Persistent Patient",
      dob: "1990-04-12",
      sex: "Other",
      email: "",
      phone: "",
      allergies: "",
      conditions: "",
      archived: false,
    });
    const n = store.create("notes", {
      patientId: p.id,
      title: "Persistent note",
      status: "draft",
      subjective: "Saved to disk",
    });
    store.db.close();
    store = openStore(filename, true);
    assert.equal(store.get("patients", p.id).name, "Persistent Patient");
    assert.equal(store.get("notes", n.id).subjective, "Saved to disk");
    assert.equal(store.all("patients").length, initial + 1);
  } finally {
    store?.db.close();
    for (const name of readdirSync(folder)) unlinkSync(path.join(folder, name));
    rmdirSync(folder);
  }
});
