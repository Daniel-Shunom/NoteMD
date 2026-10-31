import { useCallback, useEffect, useRef, useState } from "react";
import {
  CalendarDays,
  FileText,
  House,
  Plus,
  RefreshCw,
  Search,
  Settings as SettingsIcon,
  Users,
  X,
} from "lucide-react";
import type { Workspace } from "./types";
import { Avatar, Link } from "./shared";
import { PatientForm, Settings } from "./forms";
import {
  NotFound,
  NotesPage,
  PatientsPage,
  SchedulePage,
  TodayPage,
} from "./pages";
import PatientPage from "./PatientPage";
import NoteEditor from "./NoteEditor";
const readRoute = () => {
  try {
    return decodeURIComponent(location.hash.slice(1) || "today");
  } catch {
    return "not-found";
  }
};
async function api(path: string, method = "GET", body?: unknown) {
  const response = await fetch("/api" + path, {
    method,
    headers:
      body === undefined ? undefined : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!response.ok) {
    let message =
      "The workspace could not be reached. Check the server and try again.";
    try {
      message = (await response.json()).message || message;
    } catch {
      /* retain recovery message */
    }
    throw new Error(message);
  }
  return response.json();
}
export default function App() {
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [error, setError] = useState("");
  const [route, setRoute] = useState(readRoute);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const dirty = useRef(false);
  const currentRoute = useRef(route);
  const mainRef = useRef<HTMLElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const onDirty = useCallback((value: boolean) => {
    dirty.current = value;
  }, []);
  const refresh = useCallback(async () => {
    const data = await api("/workspace");
    setWorkspace(data);
    setError("");
  }, []);
  useEffect(() => {
    refresh()
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [refresh]);
  useEffect(() => {
    const hash = () => {
      const next = readRoute();
      if (next === currentRoute.current) return;
      if (
        dirty.current &&
        !window.confirm(
          "You have unsaved changes. Leave this note without saving?",
        )
      ) {
        history.replaceState(null, "", `#${currentRoute.current}`);
        return;
      }
      dirty.current = false;
      currentRoute.current = next;
      setRoute(next);
    };
    const leave = (e: BeforeUnloadEvent) => {
      if (dirty.current) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    const pointer = () => {
      document.documentElement.dataset.inputModality = "pointer";
    };
    const shortcut = (e: KeyboardEvent) => {
      document.documentElement.dataset.inputModality = "keyboard";
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("pointerdown", pointer);
    window.addEventListener("hashchange", hash);
    window.addEventListener("beforeunload", leave);
    window.addEventListener("keydown", shortcut);
    return () => {
      window.removeEventListener("pointerdown", pointer);
      window.removeEventListener("hashchange", hash);
      window.removeEventListener("beforeunload", leave);
      window.removeEventListener("keydown", shortcut);
    };
  }, []);
  useEffect(() => {
    mainRef.current?.focus({ preventScroll: true });
    window.scrollTo(0, 0);
    document.title = `${route.startsWith("patients") ? "Patients" : route.startsWith("notes") ? "Clinical notes" : route === "schedule" ? "Schedule" : route === "settings" ? "Settings" : "Today"} ? NoteMD`;
  }, [route]);
  const navigate = useCallback((next: string) => {
    if (next !== currentRoute.current) location.hash = next;
  }, []);
  async function mutate(path: string, method: string, body?: unknown) {
    const record = await api(path, method, body);
    try {
      await refresh();
    } catch {
      setError(
        "Your change was saved, but the workspace could not refresh. Use Retry to load the latest records.",
      );
    }
    return record;
  }
  async function retry() {
    setRefreshing(true);
    try {
      await refresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }
  const section = route.split("/")[0];
  const active = section === "today" ? "today" : section;
  const [kind, id] = route.split("/");
  const patient = workspace?.patients.find((p) => p.id === id);
  const note = workspace?.notes.find((n) => n.id === id);
  let page;
  if (loading)
    page = (
      <div className="loading-state" role="status">
        <div className="skeleton skeleton-title" />
        <div className="skeleton skeleton-subtitle" />
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="skeleton skeleton-row" />
        ))}
        <span className="sr-only">Loading workspace</span>
      </div>
    );
  else if (!workspace)
    page = (
      <div className="connection-error">
        <h1>Let's reconnect your workspace</h1>
        <p>{error}</p>
        <button className="button" disabled={refreshing} onClick={retry}>
          <RefreshCw size={16} />
          {refreshing ? "Connecting..." : "Try again"}
        </button>
        <p className="muted">
          Start the app with npm run dev, or build it and run npm start.
        </p>
      </div>
    );
  else if (kind === "today")
    page = (
      <TodayPage workspace={workspace} navigate={navigate} mutate={mutate} />
    );
  else if (kind === "patients" && id === "new")
    page = <PatientForm mutate={mutate} navigate={navigate} />;
  else if (kind === "patients" && id && patient)
    page = (
      <PatientPage
        key={id}
        patient={patient}
        workspace={workspace}
        mutate={mutate}
        navigate={navigate}
      />
    );
  else if (kind === "patients" && !id)
    page = (
      <PatientsPage
        workspace={workspace}
        navigate={navigate}
        query={query}
        setQuery={setQuery}
      />
    );
  else if (kind === "notes" && id && note) {
    const p = workspace.patients.find((p) => p.id === note.patientId)!;
    page = (
      <NoteEditor
        key={note.id}
        note={note}
        patient={p}
        mutate={mutate}
        navigate={navigate}
        onDirty={onDirty}
      />
    );
  } else if (kind === "notes" && !id)
    page = (
      <NotesPage workspace={workspace} navigate={navigate} mutate={mutate} />
    );
  else if (kind === "schedule")
    page = (
      <SchedulePage workspace={workspace} navigate={navigate} mutate={mutate} />
    );
  else if (kind === "settings")
    page = <Settings workspace={workspace} mutate={mutate} />;
  else page = <NotFound navigate={navigate} />;
  const drafts =
    workspace?.notes.filter((n) => n.status === "draft").length ?? 0;
  return (
    <div className="app-shell">
      <a
        className="skip-link"
        href="#main-content"
        onClick={(e) => {
          e.preventDefault();
          mainRef.current?.focus();
        }}
      >
        Skip to content
      </a>
      <aside className="sidebar">
        <Link to="today" navigate={navigate} className="brand">
          <span className="brand-mark">N</span>
          <span>
            Note<span className="brand-md">MD</span>
          </span>
        </Link>
        <div className="practice-label">
          {workspace?.settings.practiceName || "Clinician workspace"}
        </div>
        <nav aria-label="Main navigation">
          {[
            { id: "today", label: "Today", icon: House },
            { id: "patients", label: "Patients", icon: Users },
            { id: "notes", label: "Notes", icon: FileText },
            { id: "schedule", label: "Schedule", icon: CalendarDays },
          ].map((item) => (
            <Link
              key={item.id}
              to={item.id}
              navigate={navigate}
              className={`nav-link ${active === item.id ? "active" : ""}`}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
              {item.id === "notes" && drafts > 0 && (
                <span className="nav-count">{drafts}</span>
              )}
            </Link>
          ))}
        </nav>
        <Link className="sidebar-add" to="patients/new" navigate={navigate}>
          <Plus size={16} />
          Add patient
        </Link>
        <div className="sidebar-bottom">
          <Link
            to="settings"
            navigate={navigate}
            ariaLabel="Settings"
            className={`nav-link ${active === "settings" ? "active" : ""}`}
          >
            <SettingsIcon size={18} />
            <span>Settings</span>
          </Link>
          <div className="clinician">
            <Avatar name={workspace?.settings.clinicianName || "Alex Morgan"} />
            <div>
              <strong>
                {workspace?.settings.clinicianName || "Clinician"}
              </strong>
              <small>Clinician workspace</small>
            </div>
          </div>
        </div>
      </aside>
      <div className="app-main">
        <header className="topbar">
          <div className="breadcrumb">
            Workspace<span>/</span>
            <strong>
              {section === "patients"
                ? "Patients"
                : section === "notes"
                  ? "Clinical notes"
                  : section === "schedule"
                    ? "Schedule"
                    : section === "settings"
                      ? "Settings"
                      : "Today"}
            </strong>
          </div>
          <form
            className="global-search"
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              navigate("patients");
            }}
          >
            <Search size={16} />
            <input
              ref={searchRef}
              aria-label="Find a patient"
              placeholder="Find a patient..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <kbd>Ctrl K</kbd>
          </form>
          <Link to="settings" navigate={navigate} className="local-status">
            <span />
            Local workspace
          </Link>
        </header>
        <main id="main-content" ref={mainRef} tabIndex={-1}>
          {workspace && error && (
            <div className="global-error" role="alert">
              <span>{error}</span>
              <button
                disabled={refreshing}
                onClick={retry}
                className="text-button"
              >
                Retry
              </button>
              <button
                aria-label="Dismiss error"
                onClick={() => setError("")}
                className="icon-button"
              >
                <X size={16} />
              </button>
            </div>
          )}
          {page}
        </main>
      </div>
    </div>
  );
}
