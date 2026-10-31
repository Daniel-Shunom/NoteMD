import { useRef, useState, type ChangeEvent } from "react";
import {
  ArrowLeft,
  CalendarDays,
  ChevronRight,
  Download,
  FileText,
  Pencil,
  Plus,
  Upload,
  ArchiveRestore,
} from "lucide-react";
import type { Mutate, Navigate, Patient, Workspace } from "./types";
import {
  age,
  Avatar,
  Badge,
  Empty,
  ErrorMessage,
  formatDate,
  Link,
  SectionHeading,
  today,
} from "./shared";
import {
  AppointmentForm,
  MedicationForm,
  NewNoteForm,
  PatientForm,
} from "./forms";

export default function PatientPage({
  patient,
  workspace,
  mutate,
  navigate,
  initialTab = "overview",
}: {
  patient: Patient;
  workspace: Workspace;
  mutate: Mutate;
  navigate: Navigate;
  initialTab?: string;
}) {
  const [tab, setTab] = useState(initialTab);
  const [modal, setModal] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [confirm, setConfirm] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const notes = workspace.notes
    .filter((n) => n.patientId === patient.id)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  const meds = workspace.medications.filter((m) => m.patientId === patient.id);
  const docs = workspace.documents
    .filter((d) => d.patientId === patient.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const upcoming = workspace.appointments
    .filter(
      (a) =>
        a.patientId === patient.id &&
        a.date >= today() &&
        ["scheduled", "checked-in"].includes(a.status),
    )
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  async function action(path: string, method: string, body?: unknown) {
    setBusy(true);
    setError("");
    try {
      await mutate(path, method, body);
      setConfirm("");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function upload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    if (file.size > 5 * 1024 * 1024 || !file.size) {
      setError(
        "Choose a non-empty PDF, TXT, PNG, or JPEG file smaller than 5 MB.",
      );
      e.target.value = "";
      return;
    }
    setBusy(true);
    try {
      const content = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result).split(",")[1]);
        reader.onerror = () =>
          reject(new Error("The file could not be read. Select it again."));
        reader.readAsDataURL(file);
      });
      await mutate("/documents", "POST", {
        patientId: patient.id,
        name: file.name,
        mime: file.type || "text/plain",
        content,
      });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  }
  const noteRows = (
    <div className="patient-notes">
      {notes.map((n) => (
        <Link
          key={n.id}
          to={`notes/${n.id}`}
          navigate={navigate}
          className="patient-note"
        >
          <FileText size={18} />
          <span>
            <strong>{n.title}</strong>
            <small>
              {formatDate(n.updatedAt)} · {n.type}
            </small>
          </span>
          <Badge value={n.status} />
          <ChevronRight size={16} />
        </Link>
      ))}
    </div>
  );
  return (
    <>
      <Link to="patients" navigate={navigate} className="back-link">
        <ArrowLeft size={16} />
        All patients
      </Link>
      <div className="patient-heading">
        <div className="patient-heading-person">
          <Avatar name={patient.name} large />
          <div>
            <h1>{patient.name}</h1>
            <p>
              {age(patient.dob)} years · {patient.sex} · Born{" "}
              {formatDate(patient.dob)}
              {patient.archived && <span className="badge">Archived</span>}
            </p>
          </div>
        </div>
        <div className="heading-actions">
          <button className="button secondary" onClick={() => setModal("edit")}>
            <Pencil size={15} />
            Edit details
          </button>
          <button
            className="button"
            disabled={patient.archived}
            onClick={() => setModal("note")}
          >
            <Plus size={17} />
            New note
          </button>
        </div>
      </div>
      <div className="patient-facts">
        <div>
          <span>Allergies</span>
          <strong
            className={
              patient.allergies && !/none/i.test(patient.allergies)
                ? "allergy-text"
                : ""
            }
          >
            {patient.allergies || "Not recorded"}
          </strong>
        </div>
        <div>
          <span>Conditions</span>
          <strong>{patient.conditions || "Not recorded"}</strong>
        </div>
      </div>
      <div className="tabs" aria-label="Patient sections">
        {[
          ["overview", "Overview"],
          ["notes", "Notes"],
          ["medications", "Medications"],
          ["documents", "Documents"],
        ].map(([id, label]) => (
          <button
            key={id}
            className={tab === id ? "active" : ""}
            aria-pressed={tab === id}
            onClick={() => {
              setTab(id);
              setError("");
              setConfirm("");
            }}
          >
            {label}
            {id !== "overview" && (
              <span>
                {id === "notes"
                  ? notes.length
                  : id === "medications"
                    ? meds.filter((m) => m.status === "active").length
                    : docs.length}
              </span>
            )}
          </button>
        ))}
      </div>
      <ErrorMessage message={error} />
      {tab === "overview" && (
        <div className="patient-overview">
          <div>
            <SectionHeading title="Clinical notes">
              <button
                className="text-button"
                disabled={patient.archived}
                onClick={() => setModal("note")}
              >
                New note
                <Plus size={14} />
              </button>
            </SectionHeading>
            {notes.length ? (
              noteRows
            ) : (
              <Empty
                title="No clinical notes yet"
                description="Record the first consultation for this patient."
                action={patient.archived ? undefined : "New note"}
                onAction={() => setModal("note")}
              />
            )}
            <div className="section-gap">
              <SectionHeading title="Upcoming appointments">
                <button
                  className="text-button"
                  disabled={patient.archived}
                  onClick={() => setModal("appointment")}
                >
                  Schedule
                  <Plus size={14} />
                </button>
              </SectionHeading>
              {upcoming.length ? (
                <div className="upcoming-list">
                  {upcoming.map((a) => (
                    <article key={a.id}>
                      <CalendarDays size={19} />
                      <div>
                        <strong>
                          {formatDate(a.date)} at {a.time}
                        </strong>
                        <p>
                          {a.reason} · {a.duration} minutes
                        </p>
                      </div>
                      <Badge value={a.status} />
                    </article>
                  ))}
                </div>
              ) : (
                <p className="quiet-empty">No upcoming appointments.</p>
              )}
            </div>
          </div>
          <aside className="record-details">
            <h2>Patient details</h2>
            <dl>
              <div>
                <dt>Email</dt>
                <dd>
                  {patient.email ? (
                    <a href={`mailto:${patient.email}`}>{patient.email}</a>
                  ) : (
                    "Not recorded"
                  )}
                </dd>
              </div>
              <div>
                <dt>Phone</dt>
                <dd>
                  {patient.phone ? (
                    <a href={`tel:${patient.phone}`}>{patient.phone}</a>
                  ) : (
                    "Not recorded"
                  )}
                </dd>
              </div>
              <div>
                <dt>Date of birth</dt>
                <dd>{formatDate(patient.dob)}</dd>
              </div>
              <div>
                <dt>Patient since</dt>
                <dd>{formatDate(patient.createdAt)}</dd>
              </div>
            </dl>
            <div className="archive-control">
              {patient.archived ? (
                <button
                  className="button secondary small"
                  disabled={busy}
                  onClick={() =>
                    action(`/patients/${patient.id}`, "PATCH", {
                      archived: false,
                    })
                  }
                >
                  <ArchiveRestore size={15} />
                  Restore patient
                </button>
              ) : confirm === "archive" ? (
                <div className="inline-confirm">
                  <p>
                    Archive this patient? Their records will remain available.
                  </p>
                  <button
                    className="button secondary small"
                    disabled={busy}
                    onClick={() => setConfirm("")}
                  >
                    Keep active
                  </button>
                  <button
                    className="button secondary small"
                    disabled={busy}
                    onClick={() =>
                      action(`/patients/${patient.id}`, "PATCH", {
                        archived: true,
                      })
                    }
                  >
                    Archive patient
                  </button>
                </div>
              ) : (
                <button
                  className="text-button muted"
                  onClick={() => setConfirm("archive")}
                >
                  Archive patient
                </button>
              )}
            </div>
          </aside>
        </div>
      )}
      {tab === "notes" && (
        <>
          <SectionHeading title="Clinical notes">
            <button
              className="button small"
              disabled={patient.archived}
              onClick={() => setModal("note")}
            >
              <Plus size={15} />
              New note
            </button>
          </SectionHeading>
          {notes.length ? (
            noteRows
          ) : (
            <Empty
              title="No notes yet"
              description="Create a note to document a consultation."
              action={patient.archived ? undefined : "New note"}
              onAction={() => setModal("note")}
            />
          )}
        </>
      )}
      {tab === "medications" && (
        <>
          <SectionHeading title="Medication records">
            <button
              className="button small"
              disabled={patient.archived}
              onClick={() => setModal("medication")}
            >
              <Plus size={15} />
              Add medication
            </button>
          </SectionHeading>
          <p className="section-description">
            Recorded medication history. This workspace does not issue
            prescriptions.
          </p>
          {meds.length ? (
            <div className="medication-list">
              {meds.map((m) => (
                <article
                  key={m.id}
                  className={m.status === "discontinued" ? "discontinued" : ""}
                >
                  <div>
                    <h3>
                      {m.name}
                      <Badge value={m.status} />
                    </h3>
                    <p>
                      {m.dosage} · {m.frequency}
                    </p>
                    {m.instructions && (
                      <p className="med-instructions">{m.instructions}</p>
                    )}
                  </div>
                  {confirm === m.id ? (
                    <div className="inline-confirm">
                      <p>Mark this medication as discontinued?</p>
                      <button
                        className="button secondary small"
                        disabled={busy}
                        onClick={() => setConfirm("")}
                      >
                        Keep active
                      </button>
                      <button
                        className="button secondary small"
                        disabled={busy}
                        onClick={() =>
                          action(`/medications/${m.id}`, "PATCH", {
                            status: "discontinued",
                          })
                        }
                      >
                        Confirm
                      </button>
                    </div>
                  ) : (
                    <button
                      className="text-button muted"
                      disabled={busy}
                      onClick={() =>
                        m.status === "active"
                          ? setConfirm(m.id)
                          : action(`/medications/${m.id}`, "PATCH", {
                              status: "active",
                            })
                      }
                    >
                      {m.status === "active" ? "Discontinue" : "Mark active"}
                    </button>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <Empty
              title="No medications recorded"
              description="Add a medication from this patient's existing treatment record."
              action={patient.archived ? undefined : "Add medication"}
              onAction={() => setModal("medication")}
            />
          )}
        </>
      )}
      {tab === "documents" && (
        <>
          <SectionHeading title="Documents">
            <button
              className="button small"
              disabled={busy}
              onClick={() => fileRef.current?.click()}
            >
              <Upload size={15} />
              {busy ? "Uploading..." : "Upload document"}
            </button>
          </SectionHeading>
          <p className="section-description">
            PDF, TXT, PNG, or JPEG. Up to 5 MB per file.
          </p>
          <input
            className="sr-only"
            ref={fileRef}
            type="file"
            aria-label="Upload patient document"
            accept=".pdf,.txt,.png,.jpg,.jpeg"
            onChange={upload}
          />
          {docs.length ? (
            <div className="document-list">
              {docs.map((d) => (
                <article key={d.id}>
                  <FileText size={20} />
                  <div>
                    <strong>{d.name}</strong>
                    <small>
                      {formatDate(d.createdAt)} ·{" "}
                      {d.size < 1024
                        ? `${d.size} B`
                        : `${Math.ceil(d.size / 1024)} KB`}
                    </small>
                  </div>
                  <a
                    className="icon-button"
                    aria-label={`Download ${d.name}`}
                    href={`/api/documents/${d.id}/download`}
                    download
                  >
                    <Download size={17} />
                  </a>
                  {confirm === d.id ? (
                    <div className="inline-actions">
                      <button
                        className="text-button danger"
                        disabled={busy}
                        onClick={() => action(`/documents/${d.id}`, "DELETE")}
                      >
                        Confirm removal
                      </button>
                      <button
                        className="text-button muted"
                        onClick={() => setConfirm("")}
                      >
                        Keep
                      </button>
                    </div>
                  ) : (
                    <button
                      className="text-button muted"
                      onClick={() => setConfirm(d.id)}
                    >
                      Remove
                    </button>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <Empty
              title="Keep supporting records together"
              description="Upload a document to attach it to this patient."
              action="Upload document"
              onAction={() => fileRef.current?.click()}
            />
          )}
        </>
      )}
      {modal === "edit" && (
        <PatientForm
          patient={patient}
          mutate={mutate}
          navigate={navigate}
          onClose={() => setModal("")}
        />
      )}{" "}
      {modal === "note" && (
        <NewNoteForm
          workspace={workspace}
          patientId={patient.id}
          mutate={mutate}
          navigate={navigate}
          onClose={() => setModal("")}
        />
      )}{" "}
      {modal === "appointment" && (
        <AppointmentForm
          workspace={workspace}
          patientId={patient.id}
          mutate={mutate}
          onClose={() => setModal("")}
        />
      )}{" "}
      {modal === "medication" && (
        <MedicationForm
          patientId={patient.id}
          mutate={mutate}
          onClose={() => setModal("")}
        />
      )}
    </>
  );
}
