import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowLeft, Check, LockKeyhole, Save, Trash2 } from "lucide-react";
import type { ClinicalNote, Mutate, Navigate, Patient } from "./types";
import { Avatar, Badge, ErrorMessage, formatDate, Link } from "./shared";

export default function NoteEditor({
  note,
  patient,
  mutate,
  navigate,
  onDirty,
}: {
  note: ClinicalNote;
  patient: Patient;
  mutate: Mutate;
  navigate: Navigate;
  onDirty: (dirty: boolean) => void;
}) {
  const [fields, setFields] = useState({
    title: note.title,
    type: note.type,
    subjective: note.subjective,
    objective: note.objective,
    assessment: note.assessment,
    plan: note.plan,
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [confirm, setConfirm] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const original = JSON.stringify({
    title: note.title,
    type: note.type,
    subjective: note.subjective,
    objective: note.objective,
    assessment: note.assessment,
    plan: note.plan,
  });
  const dirty = JSON.stringify(fields) !== original;
  useEffect(() => {
    onDirty(dirty);
    return () => onDirty(false);
  }, [dirty, onDirty]);
  useEffect(() => {
    function shortcut(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        formRef.current?.requestSubmit();
      }
    }
    window.addEventListener("keydown", shortcut);
    return () => window.removeEventListener("keydown", shortcut);
  }, []);
  const signed = note.status === "signed";
  async function save(sign = false) {
    if (busy || signed) return;
    setBusy(true);
    setError("");
    try {
      const updated = await mutate(`/notes/${note.id}`, "PATCH", {
        ...fields,
        version: note.version,
        status: sign ? "signed" : "draft",
      });
      setFields({
        title: updated.title,
        type: updated.type,
        subjective: updated.subjective,
        objective: updated.objective,
        assessment: updated.assessment,
        plan: updated.plan,
      });
      onDirty(false);
      setConfirm("");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function remove() {
    setBusy(true);
    setError("");
    try {
      await mutate(`/notes/${note.id}`, "DELETE");
      onDirty(false);
      navigate("notes");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  function submit(e: FormEvent) {
    e.preventDefault();
    void save();
  }
  return (
    <div className="note-editor-page">
      <Link to="notes" navigate={navigate} className="back-link">
        <ArrowLeft size={16} />
        All notes
      </Link>
      <div className="editor-heading">
        <div>
          <h1>{signed ? note.title : "Clinical note"}</h1>
          <p>
            {formatDate(note.createdAt)}
            <span className="separator">·</span>
            <Badge value={note.status} />
          </p>
        </div>
        <div className="heading-actions">
          {!signed && (
            <>
              <span className="save-state" role="status">
                {busy
                  ? "Saving..."
                  : dirty
                    ? "Unsaved changes"
                    : "All changes saved"}
              </span>
              <button
                form="note-form"
                className="button secondary"
                disabled={busy}
              >
                <Save size={16} />
                Save draft
              </button>
              <button
                className="button"
                disabled={busy}
                onClick={() => setConfirm("sign")}
              >
                <Check size={16} />
                Sign note
              </button>
            </>
          )}
        </div>
      </div>
      <div className="mobile-patient-context">
        <Link to={`patients/${patient.id}`} navigate={navigate}>
          {patient.name}
        </Link>
        <span>
          Allergies:{" "}
          <strong
            className={
              patient.allergies && !/none/i.test(patient.allergies)
                ? "allergy-text"
                : ""
            }
          >
            {patient.allergies || "Not recorded"}
          </strong>
        </span>
        <span>
          Conditions: <strong>{patient.conditions || "Not recorded"}</strong>
        </span>
      </div>
      <div className="editor-layout">
        <form
          id="note-form"
          ref={formRef}
          className="note-form"
          onSubmit={submit}
        >
          <ErrorMessage message={error} />
          {confirm === "sign" && (
            <div
              className="sign-confirm"
              role="region"
              aria-label="Confirm signing"
            >
              <strong>Sign and lock this note?</strong>
              <p>
                Signed notes become read-only. Review the content before
                confirming.
              </p>
              <div className="inline-actions">
                <button
                  type="button"
                  className="button"
                  disabled={busy}
                  onClick={() => {
                    if (formRef.current?.reportValidity()) void save(true);
                  }}
                >
                  Confirm and sign
                </button>
                <button
                  type="button"
                  className="button secondary"
                  disabled={busy}
                  onClick={() => setConfirm("")}
                >
                  Keep editing
                </button>
              </div>
            </div>
          )}
          {signed ? (
            <div className="signed-notice">
              <LockKeyhole size={17} />
              <span>
                Signed {note.signedAt ? formatDate(note.signedAt) : ""}
                {note.signedBy ? ` by ${note.signedBy}` : ""}. This note is
                read-only.
              </span>
            </div>
          ) : (
            <div className="note-properties">
              <label>
                Title
                <input
                  name="title"
                  required
                  maxLength={160}
                  value={fields.title}
                  onChange={(e) =>
                    setFields({ ...fields, title: e.target.value })
                  }
                />
              </label>
              <label>
                Note type
                <select
                  value={fields.type}
                  onChange={(e) =>
                    setFields({ ...fields, type: e.target.value })
                  }
                >
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
          )}
          {(
            [
              [
                "subjective",
                "Subjective",
                "Patient-reported concerns and history.",
              ],
              [
                "objective",
                "Objective",
                "Observations, examination, and findings.",
              ],
              [
                "assessment",
                "Assessment",
                "Clinical assessment and impression.",
              ],
              ["plan", "Plan", "Next steps and follow-up."],
            ] as const
          ).map(([key, title, hint]) => (
            <section className="soap-section" key={key}>
              <label htmlFor={`note-${key}`}>
                <span className="soap-letter">{title[0]}</span>
                <span>{title}</span>
              </label>
              {signed ? (
                <p className="signed-content">
                  {fields[key] || "Not recorded."}
                </p>
              ) : (
                <textarea
                  id={`note-${key}`}
                  value={fields[key]}
                  maxLength={20000}
                  placeholder={hint}
                  rows={4}
                  onChange={(e) => {
                    setFields({ ...fields, [key]: e.target.value });
                  }}
                />
              )}
            </section>
          ))}
          {!signed && (
            <footer className="editor-footer">
              <span>Save draft with Ctrl + S</span>
              {confirm === "delete" ? (
                <div className="inline-actions">
                  <span>Delete this draft?</span>
                  <button
                    type="button"
                    className="text-button danger"
                    disabled={busy}
                    onClick={remove}
                  >
                    Delete draft
                  </button>
                  <button
                    type="button"
                    className="text-button"
                    onClick={() => setConfirm("")}
                  >
                    Keep
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="text-button muted"
                  onClick={() => setConfirm("delete")}
                >
                  <Trash2 size={14} />
                  Delete draft
                </button>
              )}
            </footer>
          )}
        </form>
        <aside className="editor-patient">
          <h2>Patient</h2>
          <Link
            to={`patients/${patient.id}`}
            navigate={navigate}
            className="editor-patient-link"
          >
            <Avatar name={patient.name} />
            <strong>{patient.name}</strong>
          </Link>
          <dl>
            <div>
              <dt>Date of birth</dt>
              <dd>{formatDate(patient.dob)}</dd>
            </div>
            <div>
              <dt>Allergies</dt>
              <dd
                className={
                  patient.allergies && !/none/i.test(patient.allergies)
                    ? "allergy-text"
                    : ""
                }
              >
                {patient.allergies || "Not recorded"}
              </dd>
            </div>
            <div>
              <dt>Conditions</dt>
              <dd>{patient.conditions || "Not recorded"}</dd>
            </div>
          </dl>
          <Link
            to={`patients/${patient.id}`}
            navigate={navigate}
            className="text-link"
          >
            View patient record
          </Link>
        </aside>
      </div>
    </div>
  );
}
