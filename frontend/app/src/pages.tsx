import { useState } from "react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  FileText,
  Plus,
  CalendarDays,
} from "lucide-react";
import type { Appointment, Mutate, Navigate, Workspace } from "./types";
import {
  Badge,
  Empty,
  ErrorMessage,
  formatDate,
  Link,
  PatientLink,
  SearchField,
  SectionHeading,
  today,
  ViewLink,
} from "./shared";
import { AppointmentForm, NewNoteForm } from "./forms";

export function AppointmentList({
  appointments,
  workspace,
  navigate,
  mutate,
  onEdit,
}: {
  appointments: Appointment[];
  workspace: Workspace;
  navigate: Navigate;
  mutate: Mutate;
  onEdit?: (a: Appointment) => void;
}) {
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  async function update(a: Appointment, status: string) {
    setBusy(a.id);
    setError("");
    try {
      await mutate(`/appointments/${a.id}`, "PATCH", { status });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy("");
    }
  }
  return (
    <>
      <ErrorMessage message={error} />
      <div className="appointment-list">
        {appointments.map((a) => {
          const patient = workspace.patients.find((p) => p.id === a.patientId);
          return patient ? (
            <article
              key={a.id}
              className={`appointment-row ${a.status === "completed" || a.status === "cancelled" ? "appointment-past" : ""}`}
            >
              <div className="appointment-time">
                <strong>{a.time}</strong>
                <small>{a.duration} min</small>
              </div>
              <div className="appointment-person">
                <PatientLink patient={patient} navigate={navigate} />
                <p>{a.reason}</p>
              </div>
              <div className="appointment-state">
                <Badge value={a.status} />
                <div className="row-actions">
                  {a.status === "scheduled" && (
                    <button
                      className="text-button"
                      disabled={busy === a.id}
                      onClick={() => update(a, "checked-in")}
                    >
                      {busy === a.id ? "Updating..." : "Check in"}
                    </button>
                  )}
                  {a.status === "checked-in" && (
                    <button
                      className="text-button"
                      disabled={busy === a.id}
                      onClick={() => update(a, "completed")}
                    >
                      {busy === a.id ? "Updating..." : "Complete"}
                    </button>
                  )}
                  {onEdit && a.status === "scheduled" && (
                    <button
                      className="text-button muted"
                      onClick={() => onEdit(a)}
                    >
                      Reschedule
                    </button>
                  )}
                  {["scheduled", "checked-in"].includes(a.status) && (
                    <button
                      className="text-button muted"
                      disabled={busy === a.id}
                      onClick={() => update(a, "cancelled")}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </article>
          ) : null;
        })}
      </div>
    </>
  );
}

export function TodayPage({
  workspace,
  navigate,
  mutate,
}: {
  workspace: Workspace;
  navigate: Navigate;
  mutate: Mutate;
}) {
  const [modal, setModal] = useState<"appointment" | "note" | null>(null);
  const appointments = workspace.appointments
    .filter((a) => a.date === today())
    .sort((a, b) => a.time.localeCompare(b.time));
  const drafts = workspace.notes
    .filter((n) => n.status === "draft")
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  const recent = [...workspace.notes]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 4);
  const completed = appointments.filter((a) => a.status === "completed").length;
  return (
    <>
      <div className="page-heading">
        <div>
          <h1>Today</h1>
          <p>
            {formatDate(today(), {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
        <div className="heading-actions">
          <button
            className="button secondary"
            onClick={() => setModal("appointment")}
          >
            <CalendarDays size={16} />
            Schedule appointment
          </button>
          <button className="button" onClick={() => setModal("note")}>
            <Plus size={17} />
            New note
          </button>
        </div>
      </div>
      <div className="day-summary">
        <span>
          <strong>
            {appointments.filter((a) => a.status !== "cancelled").length}
          </strong>{" "}
          appointments today
        </span>
        <span>
          <strong>{completed}</strong> completed
        </span>
        <span>
          <strong>{drafts.length}</strong>{" "}
          {drafts.length === 1 ? "note" : "notes"} to finish
        </span>
      </div>
      <div className="today-layout">
        <section>
          <SectionHeading title="Today's appointments">
            <ViewLink to="schedule" navigate={navigate}>
              View schedule
            </ViewLink>
          </SectionHeading>
          {appointments.length ? (
            <AppointmentList
              appointments={appointments}
              workspace={workspace}
              navigate={navigate}
              mutate={mutate}
            />
          ) : (
            <Empty
              title="A clear day ahead"
              description="Schedule an appointment to add it to your day."
              action="Schedule appointment"
              onAction={() => setModal("appointment")}
            />
          )}
          <div className="section-gap">
            <SectionHeading title="Recently updated notes">
              <ViewLink to="notes" navigate={navigate}>
                All notes
              </ViewLink>
            </SectionHeading>
            {recent.length ? (
              <div className="recent-notes">
                {recent.map((n) => {
                  const p = workspace.patients.find(
                    (p) => p.id === n.patientId,
                  );
                  return (
                    <Link
                      key={n.id}
                      to={`notes/${n.id}`}
                      navigate={navigate}
                      className="recent-note"
                    >
                      <FileText size={18} />
                      <span>
                        <strong>{n.title}</strong>
                        <small>
                          {p?.name} ·{" "}
                          {formatDate(n.updatedAt, {
                            month: "short",
                            day: "numeric",
                          })}
                        </small>
                      </span>
                      <Badge value={n.status} />
                      <ChevronRight size={16} />
                    </Link>
                  );
                })}
              </div>
            ) : (
              <Empty
                title="Your notes start here"
                description="Create a note from any patient record."
              />
            )}
          </div>
        </section>
        <aside className="today-aside">
          <SectionHeading title="To finish">
            <span className="count">{drafts.length}</span>
          </SectionHeading>
          {drafts.length ? (
            <div className="draft-list">
              {drafts.slice(0, 5).map((n) => (
                <Link
                  key={n.id}
                  to={`notes/${n.id}`}
                  navigate={navigate}
                  className="draft-item"
                >
                  <span className="draft-dot" />
                  <div>
                    <strong>{n.title}</strong>
                    <p>
                      {
                        workspace.patients.find((p) => p.id === n.patientId)
                          ?.name
                      }
                    </p>
                    <span className="text-link">
                      Continue note
                      <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="aside-empty">
              <p>You're all caught up.</p>
              <small>Draft notes will appear here.</small>
            </div>
          )}
          <div className="quick-patients">
            <SectionHeading title="Patients">
              <ViewLink to="patients" navigate={navigate}>
                View all
              </ViewLink>
            </SectionHeading>
            {workspace.patients
              .filter((p) => !p.archived)
              .slice(0, 4)
              .map((p) => (
                <div className="quick-patient" key={p.id}>
                  <PatientLink patient={p} navigate={navigate} />
                  <ChevronRight size={15} />
                </div>
              ))}
          </div>
        </aside>
      </div>
      <div className="sample-notice">
        <span className="sample-dot" />
        Local workspace ·{" "}
        {workspace.settings.seeded
          ? "Includes synthetic sample records."
          : "Use synthetic records only."}
        <Link to="settings" navigate={navigate}>
          Workspace settings
        </Link>
      </div>
      {modal === "appointment" && (
        <AppointmentForm
          workspace={workspace}
          mutate={mutate}
          onClose={() => setModal(null)}
        />
      )}{" "}
      {modal === "note" && (
        <NewNoteForm
          workspace={workspace}
          mutate={mutate}
          navigate={navigate}
          onClose={() => setModal(null)}
        />
      )}
    </>
  );
}

export function PatientsPage({
  workspace,
  navigate,
  query,
  setQuery,
}: {
  workspace: Workspace;
  navigate: Navigate;
  query: string;
  setQuery: (s: string) => void;
}) {
  const [filter, setFilter] = useState("active");
  const [sort, setSort] = useState("name");
  const patients = workspace.patients
    .filter(
      (p) =>
        (filter === "archived" ? p.archived : !p.archived) &&
        `${p.name} ${p.email} ${p.conditions}`
          .toLowerCase()
          .includes(query.toLowerCase()),
    )
    .sort((a, b) =>
      sort === "name"
        ? a.name.localeCompare(b.name)
        : b.createdAt.localeCompare(a.createdAt),
    );
  return (
    <>
      <div className="page-heading">
        <div>
          <h1>Patients</h1>
          <p>A clear view of everyone in your care.</p>
        </div>
        <Link to="patients/new" navigate={navigate} className="button">
          <Plus size={17} />
          Add patient
        </Link>
      </div>
      <div className="list-toolbar">
        <SearchField
          value={query}
          onChange={setQuery}
          placeholder="Search by name, email, or condition"
        />
        <div className="toolbar-options">
          <select
            aria-label="Patient status"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="active">Active patients</option>
            <option value="archived">Archived patients</option>
          </select>
          <select
            aria-label="Sort patients"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="name">Name A-Z</option>
            <option value="recent">Recently added</option>
          </select>
        </div>
      </div>
      <div className="result-count">
        {patients.length} {patients.length === 1 ? "patient" : "patients"}
      </div>
      {patients.length ? (
        <div className="table-scroll">
          <table className="patients-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Conditions</th>
                <th>Last note</th>
                <th>Next appointment</th>
                <th>
                  <span className="sr-only">Open record</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p) => {
                const note = workspace.notes
                  .filter((n) => n.patientId === p.id)
                  .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0];
                const next = workspace.appointments
                  .filter(
                    (a) =>
                      a.patientId === p.id &&
                      a.date >= today() &&
                      ["scheduled", "checked-in"].includes(a.status),
                  )
                  .sort((a, b) =>
                    (a.date + a.time).localeCompare(b.date + b.time),
                  )[0];
                return (
                  <tr key={p.id}>
                    <td>
                      <PatientLink patient={p} navigate={navigate} />
                    </td>
                    <td>
                      <span className="condition-cell">
                        {p.conditions || "None recorded"}
                      </span>
                    </td>
                    <td>
                      {note ? (
                        <Link
                          to={`notes/${note.id}`}
                          navigate={navigate}
                          className="table-link"
                        >
                          {formatDate(note.updatedAt, {
                            month: "short",
                            day: "numeric",
                          })}
                          <small>
                            {note.status === "draft" ? "Draft" : "Signed note"}
                          </small>
                        </Link>
                      ) : (
                        <span className="muted">No notes yet</span>
                      )}
                    </td>
                    <td>
                      {next ? (
                        <span>
                          {formatDate(next.date, {
                            month: "short",
                            day: "numeric",
                          })}
                          <small>{next.time}</small>
                        </span>
                      ) : (
                        <span className="muted">Not scheduled</span>
                      )}
                    </td>
                    <td>
                      <Link
                        to={`patients/${p.id}`}
                        navigate={navigate}
                        className="icon-button"
                      >
                        <span className="sr-only">Open {p.name}</span>
                        <ChevronRight size={18} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <Empty
          title={
            query
              ? "No patients match your search"
              : filter === "archived"
                ? "No archived patients"
                : "Add your first patient"
          }
          description={
            query
              ? "Try a different name, email, or condition."
              : filter === "archived"
                ? "Archived records will stay available here."
                : "Create a patient record to start adding notes and appointments."
          }
          action={
            query
              ? "Clear search"
              : filter === "active"
                ? "Add patient"
                : undefined
          }
          onAction={() => (query ? setQuery("") : navigate("patients/new"))}
        />
      )}
    </>
  );
}

export function NotesPage({
  workspace,
  navigate,
  mutate,
}: {
  workspace: Workspace;
  navigate: Navigate;
  mutate: Mutate;
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [newNote, setNewNote] = useState(false);
  const notes = workspace.notes
    .filter(
      (n) =>
        (filter === "all" || n.status === filter) &&
        `${n.title} ${workspace.patients.find((p) => p.id === n.patientId)?.name} ${n.subjective}`
          .toLowerCase()
          .includes(query.toLowerCase()),
    )
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  return (
    <>
      <div className="page-heading">
        <div>
          <h1>Clinical notes</h1>
          <p>Every consultation, with the context you need.</p>
        </div>
        <button className="button" onClick={() => setNewNote(true)}>
          <Plus size={17} />
          New note
        </button>
      </div>
      <div className="list-toolbar">
        <div className="segmented" aria-label="Filter notes">
          {["all", "draft", "signed"].map((s) => (
            <button
              key={s}
              aria-pressed={filter === s}
              className={filter === s ? "selected" : ""}
              onClick={() => setFilter(s)}
            >
              {s === "all" ? "All notes" : s === "draft" ? "Drafts" : "Signed"}
              <span>
                {
                  workspace.notes.filter((n) => s === "all" || n.status === s)
                    .length
                }
              </span>
            </button>
          ))}
        </div>
        <SearchField
          value={query}
          onChange={setQuery}
          placeholder="Search notes or patients"
          label="Search notes"
        />
      </div>
      {notes.length ? (
        <div className="note-list">
          {notes.map((n) => {
            const p = workspace.patients.find((p) => p.id === n.patientId);
            return (
              <Link
                key={n.id}
                to={`notes/${n.id}`}
                navigate={navigate}
                className="note-list-row"
              >
                <div className="note-file-icon">
                  <FileText size={21} />
                </div>
                <div className="note-list-main">
                  <h3>{n.title}</h3>
                  <p>
                    {p?.name}
                    <span className="separator">·</span>
                    {n.type}
                  </p>
                  <small className="note-preview">
                    {n.subjective ||
                      "No content yet. Continue writing this note."}
                  </small>
                </div>
                <div className="note-list-meta">
                  <Badge value={n.status} />
                  <small>
                    {formatDate(n.updatedAt, {
                      month: "short",
                      day: "numeric",
                    })}
                  </small>
                </div>
                <ChevronRight size={17} />
              </Link>
            );
          })}
        </div>
      ) : (
        <Empty
          title={
            query
              ? "No matching notes"
              : filter === "draft"
                ? "No unfinished notes"
                : "No notes here yet"
          }
          description={
            query
              ? "Try another patient name or note title."
              : "Create a clinical note to record a consultation."
          }
          action={query ? "Clear search" : "New note"}
          onAction={() => (query ? setQuery("") : setNewNote(true))}
        />
      )}
      {newNote && (
        <NewNoteForm
          workspace={workspace}
          mutate={mutate}
          navigate={navigate}
          onClose={() => setNewNote(false)}
        />
      )}
    </>
  );
}

export function SchedulePage({
  workspace,
  navigate,
  mutate,
}: {
  workspace: Workspace;
  navigate: Navigate;
  mutate: Mutate;
}) {
  const [day, setDay] = useState(today);
  const [status, setStatus] = useState("all");
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Appointment | undefined>();
  const appointments = workspace.appointments
    .filter((a) => a.date === day && (status === "all" || a.status === status))
    .sort((a, b) => a.time.localeCompare(b.time));
  function changeDay(offset: number) {
    const d = new Date(day + "T12:00:00");
    d.setDate(d.getDate() + offset);
    setDay(
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`,
    );
  }
  return (
    <>
      <div className="page-heading">
        <div>
          <h1>Schedule</h1>
          <p>Make room for the people in your care.</p>
        </div>
        <button className="button" onClick={() => setModal(true)}>
          <Plus size={17} />
          Schedule appointment
        </button>
      </div>
      <div className="schedule-toolbar">
        <div className="date-navigation">
          <button
            className="icon-button"
            aria-label="Previous day"
            onClick={() => changeDay(-1)}
          >
            <ChevronLeft size={18} />
          </button>
          <label className="sr-only" htmlFor="schedule-date">
            Schedule date
          </label>
          <input
            id="schedule-date"
            type="date"
            required
            value={day}
            onChange={(e) => {
              if (e.target.value) setDay(e.target.value);
            }}
          />
          <button
            className="icon-button"
            aria-label="Next day"
            onClick={() => changeDay(1)}
          >
            <ChevronRight size={18} />
          </button>
          <button
            className="button secondary small"
            onClick={() => setDay(today())}
          >
            Today
          </button>
        </div>
        <select
          aria-label="Filter appointments"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="all">All statuses</option>
          <option value="scheduled">Scheduled</option>
          <option value="checked-in">Checked in</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      <SectionHeading
        title={formatDate(day, {
          weekday: "long",
          month: "long",
          day: "numeric",
        })}
      >
        <span className="muted">
          {appointments.length}{" "}
          {appointments.length === 1 ? "appointment" : "appointments"}
        </span>
      </SectionHeading>
      {appointments.length ? (
        <AppointmentList
          appointments={appointments}
          workspace={workspace}
          navigate={navigate}
          mutate={mutate}
          onEdit={(a) => {
            setEditing(a);
            setModal(true);
          }}
        />
      ) : (
        <Empty
          title="No appointments for this day"
          description={
            status === "all"
              ? "Schedule a visit or choose another date."
              : "Try a different status filter or choose another date."
          }
          action="Schedule appointment"
          onAction={() => setModal(true)}
        />
      )}
      {modal && (
        <AppointmentForm
          workspace={workspace}
          appointment={editing}
          defaultDate={day}
          mutate={mutate}
          onClose={() => {
            setModal(false);
            setEditing(undefined);
          }}
        />
      )}
    </>
  );
}

export function NotFound({ navigate }: { navigate: Navigate }) {
  return (
    <Empty
      title="This record isn't available"
      description="It may have been removed. Return to your patient list to continue."
      action="View patients"
      onAction={() => navigate("patients")}
    />
  );
}
