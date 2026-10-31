import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { randomUUID } from "node:crypto";

export function openStore(filename, seed = true) {
  if (filename !== ":memory:")
    mkdirSync(dirname(filename), { recursive: true });
  const db = new DatabaseSync(filename);
  db.exec(
    "PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL; PRAGMA busy_timeout = 5000;",
  );
  db.exec(`CREATE TABLE IF NOT EXISTS patients (id TEXT PRIMARY KEY, data TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS settings (id TEXT PRIMARY KEY, data TEXT NOT NULL);`);
  for (const table of ["notes", "medications", "appointments", "documents"]) {
    db.exec(`CREATE TABLE IF NOT EXISTS ${table} (id TEXT PRIMARY KEY, patientId TEXT NOT NULL REFERENCES patients(id), data TEXT NOT NULL);
      CREATE INDEX IF NOT EXISTS ${table}_patient ON ${table}(patientId);`);
  }
  const allowed = new Set([
    "patients",
    "notes",
    "medications",
    "appointments",
    "documents",
    "settings",
  ]);
  function table(name) {
    if (!allowed.has(name)) throw new Error("Unknown collection");
    return name;
  }
  const store = {
    db,
    all(name) {
      return db
        .prepare(`SELECT data FROM ${table(name)}`)
        .all()
        .map((row) => JSON.parse(row.data));
    },
    get(name, id) {
      const row = db
        .prepare(`SELECT data FROM ${table(name)} WHERE id = ?`)
        .get(id);
      return row ? JSON.parse(row.data) : null;
    },
    put(name, record) {
      if (["patients", "settings"].includes(name))
        db.prepare(
          `INSERT OR REPLACE INTO ${table(name)} (id, data) VALUES (?, ?)`,
        ).run(record.id, JSON.stringify(record));
      else
        db.prepare(
          `INSERT OR REPLACE INTO ${table(name)} (id, patientId, data) VALUES (?, ?, ?)`,
        ).run(record.id, record.patientId, JSON.stringify(record));
      return record;
    },
    remove(name, id) {
      return db.prepare(`DELETE FROM ${table(name)} WHERE id = ?`).run(id);
    },
    create(name, data) {
      const now = new Date().toISOString();
      return store.put(name, {
        ...data,
        id: randomUUID(),
        createdAt: now,
        updatedAt: now,
        version: 1,
      });
    },
  };
  if (!store.get("settings", "workspace"))
    store.put("settings", {
      id: "workspace",
      clinicianName: "Dr. Alex Morgan",
      practiceName: "My practice",
      seeded: false,
    });
  if (
    seed &&
    !store.get("settings", "workspace").seeded &&
    !store.all("patients").length
  )
    seedStore(store);
  return store;
}

function seedStore(store) {
  const patients = [
    [
      "Olivia Bennett",
      "1988-03-14",
      "Female",
      "Seasonal allergies",
      "Penicillin",
    ],
    ["James Wilson", "1965-08-22", "Male", "Hypertension", "None reported"],
    ["Amelia Brooks", "1997-11-09", "Female", "Asthma", "None reported"],
    ["Noah Williams", "1982-01-30", "Male", "Type 2 diabetes", "Sulfonamides"],
    [
      "Isabella Chen",
      "1974-06-18",
      "Female",
      "Hypothyroidism",
      "None reported",
    ],
    [
      "Ethan Davis",
      "1991-09-05",
      "Male",
      "No conditions recorded",
      "None reported",
    ],
  ].map(([name, dob, sex, conditions, allergies], i) =>
    store.create("patients", {
      name,
      dob,
      sex,
      conditions,
      allergies,
      email: name.toLowerCase().replace(" ", ".") + "@example.com",
      phone: `202-555-010${i}`,
      archived: false,
    }),
  );
  const today = new Date();
  const date = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  ["09:00", "10:00", "11:30", "14:00"].forEach((time, i) =>
    store.create("appointments", {
      patientId: patients[i].id,
      date,
      time,
      duration: 30,
      reason: [
        "Follow-up consultation",
        "Blood pressure review",
        "Routine check-in",
        "Follow-up consultation",
      ][i],
      status: i === 0 ? "completed" : "scheduled",
    }),
  );
  patients
    .slice(0, 4)
    .forEach((p, i) =>
      store.create("notes", {
        patientId: p.id,
        title: [
          "Follow-up consultation",
          "Blood pressure review",
          "Routine check-in",
          "Initial consultation",
        ][i],
        type: i === 3 ? "Initial consultation" : "Follow-up",
        status: i === 0 ? "draft" : "signed",
        subjective:
          i === 0
            ? "Patient attended a scheduled follow-up. No new concerns reported."
            : "Routine review. Patient reports no change since the previous visit.",
        objective: "Observations recorded in the consultation.",
        assessment: "Review of existing history and patient concerns.",
        plan: i === 0 ? "" : "Follow-up appointment to be arranged.",
        signedAt: i === 0 ? null : new Date().toISOString(),
      }),
    );
  store.create("medications", {
    patientId: patients[1].id,
    name: "Example medication",
    dosage: "See original prescription",
    frequency: "As recorded",
    instructions: "Synthetic record for interface demonstration only.",
    status: "active",
  });
  store.put("settings", {
    ...store.get("settings", "workspace"),
    seeded: true,
  });
}
