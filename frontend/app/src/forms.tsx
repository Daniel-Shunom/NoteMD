import { useState, type FormEvent } from "react";
import { ArrowLeft, Download } from "lucide-react";
import type {
  Appointment,
  Mutate,
  Navigate,
  Patient,
  Workspace,
} from "./types";
import { Empty, ErrorMessage, Link, Modal, today } from "./shared";

export function PatientForm({
  patient,
  mutate,
  navigate,
  onClose,
}: {
  patient?: Patient;
  mutate: Mutate;
  navigate: Navigate;
  onClose?: () => void;
}) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    setBusy(true);
    setError("");
    try {
      const record = await mutate(
        patient ? `/patients/${patient.id}` : "/patients",
        patient ? "PATCH" : "POST",
        data,
      );
      if (onClose) onClose();
      else navigate(`patients/${record.id}`);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  const form = (
    <form onSubmit={submit} className="record-form">
      <div className="form-grid">
        <label className="span-2">
          Full name
          <input
            name="name"
            required
            maxLength={100}
            autoComplete="name"
            defaultValue={patient?.name}
          />
        </label>
        <label>
          Date of birth
          <input
            type="date"
            name="dob"
            required
            min="1900-01-01"
            max={today()}
            defaultValue={patient?.dob}
          />
        </label>
        <label>
          Sex
          <select name="sex" defaultValue={patient?.sex ?? "Not specified"}>
            {["Not specified", "Female", "Male", "Other"].map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </label>
        <label>
          Email <span className="optional">(optional)</span>
          <input
            type="email"
            name="email"
            autoComplete="email"
            maxLength={254}
            defaultValue={patient?.email}
          />
        </label>
        <label>
          Phone <span className="optional">(optional)</span>
          <input
            name="phone"
            type="tel"
            autoComplete="tel"
            maxLength={50}
            defaultValue={patient?.phone}
          />
        </label>
        <label className="span-2">
          Allergies
          <input
            name="allergies"
            maxLength={1000}
            placeholder="e.g. Penicillin, or none reported"
            defaultValue={patient?.allergies}
          />
        </label>
        <label className="span-2">
          Conditions
          <textarea
            name="conditions"
            maxLength={2000}
            rows={3}
            placeholder="Relevant medical history"
            defaultValue={patient?.conditions}
          />
        </label>
      </div>
      <ErrorMessage message={error} />
      <footer className="form-footer">
        <button
          type="button"
          className="button secondary"
          disabled={busy}
          onClick={() => (onClose ? onClose() : navigate("patients"))}
        >
          Cancel
        </button>
        <button className="button" disabled={busy}>
          {busy ? "Saving..." : patient ? "Save changes" : "Add patient"}
        </button>
      </footer>
    </form>
  );
  if (onClose)
    return (
      <Modal title="Edit patient details" onClose={onClose}>
        {form}
      </Modal>
    );
  return (
    <div className="narrow-page">
      <Link to="patients" navigate={navigate} className="back-link">
        <ArrowLeft size={16} />
        All patients
      </Link>
      <div className="page-heading">
        <div>
          <h1>Add patient</h1>
          <p>Start with the essentials. Add clinical records as you go.</p>
        </div>
      </div>
      {form}
    </div>
  );
}

export function AppointmentForm({
  workspace,
  patientId,
  appointment,
  defaultDate,
  mutate,
  onClose,
}: {
  workspace: Workspace;
  patientId?: string;
  appointment?: Appointment;
  defaultDate?: string;
  mutate: Mutate;
  onClose: () => void;
}) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const input = Object.fromEntries(new FormData(e.currentTarget));
    try {
      await mutate(
        appointment ? `/appointments/${appointment.id}` : "/appointments",
        appointment ? "PATCH" : "POST",
        { ...input, duration: Number(input.duration) },
      );
      onClose();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  if (!workspace.patients.some((p) => !p.archived))
    return (
      <Modal title="Schedule appointment" onClose={onClose}>
        <Empty
          title="Add a patient first"
          description="Appointments need a patient record."
          action="Add patient"
          onAction={() => {
            onClose();
            window.location.hash = "patients/new";
          }}
        />
      </Modal>
    );
  return (
    <Modal
      title={appointment ? "Reschedule appointment" : "Schedule appointment"}
      onClose={onClose}
    >
      <form className="record-form" onSubmit={submit}>
        <div className="form-grid">
          <label className="span-2">
            Patient
            <select
              name="patientId"
              required
              defaultValue={appointment?.patientId ?? patientId ?? ""}
            >
              <option value="" disabled>
                Select a patient
              </option>
              {workspace.patients
                .filter((p) => !p.archived)
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
            </select>
          </label>
          <label>
            Date
            <input
              name="date"
              type="date"
              min={today()}
              required
              defaultValue={appointment?.date ?? defaultDate ?? today()}
            />
          </label>
          <label>
            Time
            <input
              name="time"
              type="time"
              required
              defaultValue={appointment?.time ?? "09:00"}
            />
          </label>
          <label>
            Duration
            <select name="duration" defaultValue={appointment?.duration ?? 30}>
              {[15, 30, 45, 60].map((n) => (
                <option key={n} value={n}>
                  {n} minutes
                </option>
              ))}
            </select>
          </label>
          <label>
            Reason for visit
            <input
              name="reason"
              required
              maxLength={200}
              defaultValue={appointment?.reason}
              placeholder="e.g. Follow-up consultation"
            />
          </label>
        </div>
        <ErrorMessage message={error} />
        <footer className="form-footer">
          <button
            type="button"
            className="button secondary"
            disabled={busy}
            onClick={onClose}
          >
            Cancel
          </button>
          <button className="button" disabled={busy}>
            {busy
              ? "Saving..."
              : appointment
                ? "Save appointment"
                : "Schedule appointment"}
          </button>
        </footer>
      </form>
    </Modal>
  );
}

export function MedicationForm({
  patientId,
  mutate,
  onClose,
}: {
  patientId: string;
  mutate: Mutate;
  onClose: () => void;
}) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      await mutate("/medications", "POST", { ...data, patientId });
      onClose();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Modal title="Add medication record" onClose={onClose}>
      <form className="record-form" onSubmit={submit}>
        <p className="form-description">
          Record an existing medication and its instructions.
        </p>
        <div className="form-grid">
          <label className="span-2">
            Medication name
            <input name="name" required maxLength={150} />
          </label>
          <label>
            Dosage
            <input
              name="dosage"
              required
              maxLength={150}
              placeholder="As prescribed"
            />
          </label>
          <label>
            Frequency
            <input
              name="frequency"
              required
              maxLength={150}
              placeholder="As prescribed"
            />
          </label>
          <label className="span-2">
            Instructions <span className="optional">(optional)</span>
            <textarea name="instructions" maxLength={2000} rows={3} />
          </label>
        </div>
        <ErrorMessage message={error} />
        <footer className="form-footer">
          <button
            className="button secondary"
            type="button"
            disabled={busy}
            onClick={onClose}
          >
            Cancel
          </button>
          <button className="button" disabled={busy}>
            {busy ? "Saving..." : "Add medication"}
          </button>
        </footer>
      </form>
    </Modal>
  );
}

export function NewNoteForm({
  workspace,
  patientId,
  mutate,
  navigate,
  onClose,
}: {
  workspace: Workspace;
  patientId?: string;
  mutate: Mutate;
  navigate: Navigate;
  onClose: () => void;
}) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const record = await mutate(
        "/notes",
        "POST",
        Object.fromEntries(new FormData(e.currentTarget)),
      );
      onClose();
      navigate(`notes/${record.id}`);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  if (!workspace.patients.some((p) => !p.archived))
    return (
      <Modal title="New clinical note" onClose={onClose}>
        <Empty
          title="Add a patient first"
          description="Clinical notes belong to a patient record."
          action="Add patient"
          onAction={() => {
            onClose();
            navigate("patients/new");
          }}
        />
      </Modal>
    );
  return (
    <Modal title="New clinical note" onClose={onClose}>
      <form onSubmit={submit} className="record-form">
        <div className="form-grid">
          <label className="span-2">
            Patient
            <select name="patientId" required defaultValue={patientId ?? ""}>
              <option value="" disabled>
                Select a patient
              </option>
              {workspace.patients
                .filter((p) => !p.archived)
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
            </select>
          </label>
          <label className="span-2">
            Title
            <input
              name="title"
              required
              maxLength={160}
              placeholder="e.g. Follow-up consultation"
            />
          </label>
          <label className="span-2">
            Note type
            <select name="type">
              {[
                "Follow-up",
                "Initial consultation",
                "Progress note",
                "Lab review",
              ].map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
        </div>
        <ErrorMessage message={error} />
        <footer className="form-footer">
          <button
            type="button"
            className="button secondary"
            disabled={busy}
            onClick={onClose}
          >
            Cancel
          </button>
          <button className="button" disabled={busy}>
            {busy ? "Creating..." : "Create note"}
          </button>
        </footer>
      </form>
    </Modal>
  );
}

export function Settings({
  workspace,
  mutate,
}: {
  workspace: Workspace;
  mutate: Mutate;
}) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setSaved(false);
    try {
      await mutate(
        "/settings",
        "PATCH",
        Object.fromEntries(new FormData(e.currentTarget)),
      );
      setSaved(true);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="narrow-page">
      <div className="page-heading">
        <div>
          <h1>Settings</h1>
          <p>Your practice and local workspace.</p>
        </div>
      </div>
      <section className="settings-section">
        <h2>Practice details</h2>
        <form onSubmit={submit} className="record-form">
          <label>
            Clinician name
            <input
              name="clinicianName"
              required
              maxLength={100}
              defaultValue={workspace.settings.clinicianName}
            />
          </label>
          <label>
            Practice name
            <input
              name="practiceName"
              required
              maxLength={100}
              defaultValue={workspace.settings.practiceName}
            />
          </label>
          <ErrorMessage message={error} />
          <div className="inline-actions">
            <button className="button" disabled={busy}>
              {busy ? "Saving..." : "Save changes"}
            </button>
            {saved && (
              <span className="save-success" role="status">
                Changes saved
              </span>
            )}
          </div>
        </form>
      </section>
      <section className="settings-section">
        <h2>Your data</h2>
        <p>
          Records are saved in a local SQLite database on this computer. Export
          a copy of all records, including documents, as JSON.
        </p>
        <a className="button secondary" href="/api/export" download>
          <Download size={16} />
          Export workspace
        </a>
        <div className="local-notice">
          <strong>Local development workspace</strong>
          <p>
            This version has no user authentication. Use synthetic data only.
            Shared hosting and real patient records need authentication, access
            controls, and a reviewed deployment.
          </p>
        </div>
      </section>
    </div>
  );
}
