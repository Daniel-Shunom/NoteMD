import { useEffect, useRef, type ReactNode } from "react";
import { X, ArrowUpRight, Search, Plus } from "lucide-react";
import type { Navigate, Patient } from "./types";
export function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
export function formatDate(
  value: string,
  options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  },
) {
  return new Date(
    value.length === 10 ? value + "T12:00:00" : value,
  ).toLocaleDateString(undefined, options);
}
export function age(dob: string) {
  const now = new Date();
  const d = new Date(dob + "T12:00:00");
  let years = now.getFullYear() - d.getFullYear();
  if (
    now.getMonth() < d.getMonth() ||
    (now.getMonth() === d.getMonth() && now.getDate() < d.getDate())
  )
    years--;
  return years;
}
export function initials(name: string) {
  return name
    .replace(/^Dr\.\s*/i, "")
    .split(/\s+/)
    .map((n) => n[0])
    .slice(0, 2)
    .join("");
}
export function Avatar({
  name,
  large = false,
}: {
  name: string;
  large?: boolean;
}) {
  const color = name.charCodeAt(0) % 4;
  return (
    <span
      aria-hidden="true"
      className={`avatar tone-${color} ${large ? "avatar-large" : ""}`}
    >
      {initials(name)}
    </span>
  );
}
export function Badge({ value }: { value: string }) {
  return (
    <span className={`badge badge-${value}`}>
      {(
        {
          "checked-in": "Checked in",
          scheduled: "Scheduled",
          completed: "Completed",
          cancelled: "Cancelled",
          draft: "Draft",
          signed: "Signed",
          active: "Active",
          discontinued: "Discontinued",
        } as Record<string, string>
      )[value] ?? value}
    </span>
  );
}
export function Link({
  to,
  navigate,
  children,
  className = "",
  ariaLabel,
}: {
  to: string;
  navigate: Navigate;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <a
      aria-label={ariaLabel}
      className={className}
      href={`#${to}`}
      onClick={(e) => {
        if (!e.metaKey && !e.ctrlKey) {
          e.preventDefault();
          navigate(to);
        }
      }}
    >
      {children}
    </a>
  );
}
export function PatientLink({
  patient,
  navigate,
}: {
  patient: Patient;
  navigate: Navigate;
}) {
  return (
    <Link
      className="patient-link"
      to={`patients/${patient.id}`}
      navigate={navigate}
    >
      <Avatar name={patient.name} />
      <span>
        <strong>{patient.name}</strong>
        <small>
          {age(patient.dob)} years · {patient.sex}
        </small>
      </span>
    </Link>
  );
}
export function Empty({
  title,
  description,
  action,
  onAction,
}: {
  title: string;
  description: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="empty">
      <h3>{title}</h3>
      <p>{description}</p>
      {action && (
        <button className="button" onClick={onAction}>
          <Plus size={16} />
          {action}
        </button>
      )}
    </div>
  );
}
export function SearchField({
  value,
  onChange,
  placeholder = "Search patients",
  label = "Search patients",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  label?: string;
}) {
  return (
    <div className="search-field">
      <Search size={17} />
      <input
        aria-label={label}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button
          className="icon-button"
          aria-label="Clear search"
          onClick={() => onChange("")}
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
}
export function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const trigger = document.activeElement as HTMLElement | null;
    dialog.showModal();
    let arrival: Animation | undefined;
    if (document.documentElement.dataset.inputModality === "pointer") {
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      arrival = dialog.animate(
        reduce
          ? [{ opacity: 0 }, { opacity: 1 }]
          : [
              { opacity: 0, transform: "scale(0.97)" },
              { opacity: 1, transform: "scale(1)" },
            ],
        {
          duration: reduce ? 100 : 200,
          easing: "cubic-bezier(0.23, 1, 0.32, 1)",
        },
      );
    }
    return () => {
      arrival?.cancel();
      dialog.close();
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    };
  }, []);
  return (
    <dialog
      ref={ref}
      aria-labelledby="dialog-title"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
    >
      <header className="dialog-header">
        <h2 id="dialog-title">{title}</h2>
        <button
          className="icon-button"
          aria-label="Close dialog"
          onClick={onClose}
        >
          <X size={20} />
        </button>
      </header>
      {children}
    </dialog>
  );
}
export function ErrorMessage({ message }: { message: string }) {
  return message ? (
    <p className="form-error" role="alert">
      {message}
    </p>
  ) : null;
}
export function SectionHeading({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="section-heading">
      <h2>{title}</h2>
      {children}
    </div>
  );
}
export function ViewLink({
  to,
  navigate,
  children,
}: {
  to: string;
  navigate: Navigate;
  children: ReactNode;
}) {
  return (
    <Link className="text-link" to={to} navigate={navigate}>
      {children}
      <ArrowUpRight size={14} />
    </Link>
  );
}
