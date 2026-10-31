import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";
import { openStore } from "./store.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const fail = (status, message) => {
  const error = new Error(message);
  error.status = status;
  throw error;
};
function text(value, label, max = 200, required = false) {
  if (
    typeof value !== "string" ||
    value.length > max ||
    (required && !value.trim())
  )
    fail(
      400,
      `${label} ${required ? "is required and " : ""}must be at most ${max} characters.`,
    );
  return value.trim();
}
function choice(value, values, label) {
  if (!values.includes(value)) fail(400, `Choose a valid ${label}.`);
  return value;
}
function date(value, label = "Date") {
  if (
    typeof value !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(value) ||
    !Number.isFinite(Date.parse(value)) ||
    new Date(value).toISOString().slice(0, 10) !== value
  )
    fail(400, `${label} must be a valid date.`);
  return value;
}
const localDate = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
function validatePatient(input) {
  const dob = date(input.dob, "Date of birth");
  if (dob > localDate() || dob < "1900-01-01")
    fail(400, "Date of birth must be between 1900 and today.");
  const email = text(input.email ?? "", "Email", 254);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    fail(400, "Enter a valid email address.");
  return {
    name: text(input.name, "Patient name", 100, true),
    dob,
    sex: choice(input.sex, ["Female", "Male", "Other", "Not specified"], "sex"),
    email,
    phone: text(input.phone ?? "", "Phone", 50),
    allergies: text(input.allergies ?? "", "Allergies", 1000),
    conditions: text(input.conditions ?? "", "Conditions", 2000),
    archived: Boolean(input.archived),
  };
}

export function createApp({
  databasePath = process.env.DATABASE_PATH ||
    path.join(here, "data", "notemd.sqlite"),
  seed = process.env.SEED_DEMO !== "false",
} = {}) {
  const app = express();
  const store = openStore(databasePath, seed);
  app.locals.db = store.db;
  app.disable("x-powered-by");
  app.use((req, res, next) => {
    res.set({
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "same-origin",
      "X-Frame-Options": "DENY",
      "Cache-Control": "no-store",
    });
    const host = req.headers.host?.split(":")[0];
    if (!["127.0.0.1", "localhost", "[::1]"].includes(host))
      return res
        .status(403)
        .json({ message: "This workspace is available on localhost only." });
    if (!["GET", "HEAD", "OPTIONS"].includes(req.method)) {
      const origin = req.headers.origin;
      const allowed = [
        `http://${req.headers.host}`,
        "http://127.0.0.1:5173",
        "http://localhost:5173",
      ];
      if (origin && !allowed.includes(origin))
        return res
          .status(403)
          .json({ message: "Cross-origin changes are not allowed." });
      if (req.method !== "DELETE" && !req.is("application/json"))
        return res.status(415).json({ message: "Send request data as JSON." });
    }
    next();
  });
  app.use(express.json({ limit: "8mb", strict: true }));
  const find = (table, id) =>
    store.get(table, id) ||
    fail(
      404,
      `${table === "patients" ? "Patient" : "Record"} not found. Refresh and try again.`,
    );
  const touch = (record, changes) => ({
    ...record,
    ...changes,
    updatedAt: new Date().toISOString(),
    version: record.version + 1,
  });
  app.get("/api/health", (_req, res) =>
    res.json({ status: "ok", mode: "local", database: "sqlite" }),
  );
  app.get("/api/workspace", (_req, res) => {
    res.json({
      patients: store.all("patients"),
      notes: store.all("notes"),
      medications: store.all("medications"),
      appointments: store.all("appointments"),
      documents: store.all("documents").map(({ content, ...doc }) => doc),
      settings: store.get("settings", "workspace"),
    });
  });
  app.get("/api/patients", (_req, res) => res.json(store.all("patients")));
  app.post("/api/patients", (req, res) =>
    res.status(201).json(store.create("patients", validatePatient(req.body))),
  );
  app.patch("/api/patients/:id", (req, res) => {
    const record = find("patients", req.params.id);
    res.json(
      store.put(
        "patients",
        touch(record, validatePatient({ ...record, ...req.body })),
      ),
    );
  });
  app.post("/api/notes", (req, res) => {
    const patient = find("patients", req.body.patientId);
    if (patient.archived)
      fail(400, "Restore this patient before creating a note.");
    res
      .status(201)
      .json(
        store.create("notes", {
          patientId: patient.id,
          title: text(
            req.body.title ?? "Untitled consultation",
            "Title",
            160,
            true,
          ),
          type: choice(
            req.body.type ?? "Follow-up",
            [
              "Follow-up",
              "Initial consultation",
              "Progress note",
              "Lab review",
            ],
            "note type",
          ),
          status: "draft",
          subjective: "",
          objective: "",
          assessment: "",
          plan: "",
          signedAt: null,
        }),
      );
  });
  app.patch("/api/notes/:id", (req, res) => {
    const record = find("notes", req.params.id);
    if (record.status === "signed")
      fail(
        409,
        "Signed notes are read-only. Create a new note to add information.",
      );
    if (req.body.version !== record.version)
      fail(
        409,
        "This note changed in another window. Copy your changes, then reload the note.",
      );
    const fields = {};
    for (const field of [
      "title",
      "subjective",
      "objective",
      "assessment",
      "plan",
    ])
      if (req.body[field] !== undefined)
        fields[field] = text(
          req.body[field],
          field === "title" ? "Title" : field,
          field === "title" ? 160 : 20000,
          field === "title",
        );
    if (req.body.type !== undefined)
      fields.type = choice(
        req.body.type,
        ["Follow-up", "Initial consultation", "Progress note", "Lab review"],
        "note type",
      );
    if (req.body.status !== undefined)
      fields.status = choice(
        req.body.status,
        ["draft", "signed"],
        "note status",
      );
    if (fields.status === "signed") {
      if (
        !["subjective", "objective", "assessment", "plan"].some((key) =>
          (fields[key] ?? record[key]).trim(),
        )
      )
        fail(400, "Add note content before signing.");
      fields.signedAt = new Date().toISOString();
      fields.signedBy = store.get("settings", "workspace").clinicianName;
    }
    res.json(store.put("notes", touch(record, fields)));
  });
  app.delete("/api/notes/:id", (req, res) => {
    const record = find("notes", req.params.id);
    if (record.status === "signed")
      fail(409, "Signed notes cannot be deleted.");
    store.remove("notes", record.id);
    res.json({ ok: true });
  });
  app.post("/api/medications", (req, res) => {
    const patient = find("patients", req.body.patientId);
    if (patient.archived)
      fail(400, "Restore this patient before adding a medication.");
    res
      .status(201)
      .json(
        store.create("medications", {
          patientId: patient.id,
          name: text(req.body.name, "Medication name", 150, true),
          dosage: text(req.body.dosage, "Dosage", 150, true),
          frequency: text(req.body.frequency, "Frequency", 150, true),
          instructions: text(req.body.instructions ?? "", "Instructions", 2000),
          status: "active",
        }),
      );
  });
  app.patch("/api/medications/:id", (req, res) => {
    const record = find("medications", req.params.id);
    res.json(
      store.put(
        "medications",
        touch(record, {
          status: choice(
            req.body.status,
            ["active", "discontinued"],
            "medication status",
          ),
        }),
      ),
    );
  });
  function validateAppointment(input, currentId) {
    const patient = find("patients", input.patientId);
    if (patient.archived) fail(400, "Restore this patient before scheduling.");
    const appointmentDate = date(input.date);
    if (
      typeof input.time !== "string" ||
      !/^([01]\d|2[0-3]):[0-5]\d$/.test(input.time)
    )
      fail(400, "Enter a valid appointment time.");
    const duration = Number(input.duration);
    if (![15, 30, 45, 60].includes(duration))
      fail(400, "Choose a duration of 15, 30, 45, or 60 minutes.");
    const status = choice(
      input.status ?? "scheduled",
      ["scheduled", "checked-in", "completed", "cancelled"],
      "appointment status",
    );
    const minutes = (t) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3));
    const start = minutes(input.time);
    if (start + duration > 1440)
      fail(400, "Appointments must end on the same day.");
    if (
      !["completed", "cancelled"].includes(status) &&
      store
        .all("appointments")
        .some(
          (a) =>
            a.id !== currentId &&
            a.date === appointmentDate &&
            !["completed", "cancelled"].includes(a.status) &&
            start < minutes(a.time) + a.duration &&
            start + duration > minutes(a.time),
        )
    )
      fail(
        409,
        "That time overlaps another appointment. Choose a different time.",
      );
    return {
      patientId: patient.id,
      date: appointmentDate,
      time: input.time,
      duration,
      status,
      reason: text(input.reason, "Reason for visit", 200, true),
    };
  }
  app.post("/api/appointments", (req, res) =>
    res
      .status(201)
      .json(store.create("appointments", validateAppointment(req.body))),
  );
  app.patch("/api/appointments/:id", (req, res) => {
    const record = find("appointments", req.params.id);
    res.json(
      store.put(
        "appointments",
        touch(
          record,
          validateAppointment({ ...record, ...req.body }, record.id),
        ),
      ),
    );
  });
  app.post("/api/documents", (req, res) => {
    const patient = find("patients", req.body.patientId);
    const mime = choice(
      req.body.mime,
      ["application/pdf", "text/plain", "image/png", "image/jpeg"],
      "file type (PDF, TXT, PNG, or JPEG)",
    );
    const name = text(req.body.name, "File name", 200, true).replace(
      /[\\/\r\n"]/g,
      "_",
    );
    if (
      typeof req.body.content !== "string" ||
      req.body.content.length % 4 !== 0 ||
      !/^[A-Za-z0-9+/]*={0,2}$/.test(req.body.content)
    )
      fail(400, "The file could not be read. Select it again.");
    const bytes = Buffer.from(req.body.content, "base64");
    if (!bytes.length || bytes.length > 5 * 1024 * 1024)
      fail(400, "Choose a non-empty file smaller than 5 MB.");
    const doc = store.create("documents", {
      patientId: patient.id,
      name,
      mime,
      content: req.body.content,
      size: bytes.length,
    });
    const { content, ...metadata } = doc;
    res.status(201).json(metadata);
  });
  app.get("/api/documents/:id/download", (req, res) => {
    const doc = find("documents", req.params.id);
    res.set({
      "Content-Type": doc.mime,
      "Content-Disposition": `attachment; filename="document"; filename*=UTF-8''${encodeURIComponent(doc.name)}`,
    });
    res.send(Buffer.from(doc.content, "base64"));
  });
  app.delete("/api/documents/:id", (req, res) => {
    find("documents", req.params.id);
    store.remove("documents", req.params.id);
    res.json({ ok: true });
  });
  app.patch("/api/settings", (req, res) =>
    res.json(
      store.put("settings", {
        ...store.get("settings", "workspace"),
        clinicianName: text(
          req.body.clinicianName,
          "Clinician name",
          100,
          true,
        ),
        practiceName: text(req.body.practiceName, "Practice name", 100, true),
      }),
    ),
  );
  app.get("/api/export", (_req, res) => {
    const collections = {};
    for (const table of [
      "patients",
      "notes",
      "medications",
      "appointments",
      "documents",
      "settings",
    ])
      collections[table] = store.all(table);
    res
      .set("Content-Disposition", 'attachment; filename="notemd-export.json"')
      .json({
        schemaVersion: 1,
        exportedAt: new Date().toISOString(),
        ...collections,
      });
  });
  app.use("/api", (_req, res) =>
    res.status(404).json({ message: "API endpoint not found." }),
  );
  const dist = path.join(here, "..", "frontend", "app", "dist");
  if (existsSync(path.join(dist, "index.html"))) {
    app.use((_req, res, next) => {
      res.set(
        "Content-Security-Policy",
        "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'",
      );
      next();
    });
    app.use(express.static(dist));
    app.get("/{*path}", (_req, res) =>
      res.sendFile(path.join(dist, "index.html")),
    );
  } else
    app.get("/", (_req, res) =>
      res
        .status(503)
        .type("text")
        .send(
          "Run npm run build, then npm start. For development, run npm run dev.",
        ),
    );
  app.use((error, _req, res, _next) => {
    const status =
      error.type === "entity.too.large" ? 413 : error.status || 500;
    res
      .status(status)
      .json({
        message:
          status === 413
            ? "The upload is too large. Choose a file smaller than 5 MB."
            : status === 500
              ? "The record could not be saved. Try again."
              : error.message,
      });
  });
  return app;
}
