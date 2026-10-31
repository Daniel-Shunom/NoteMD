# NoteMD

A minimal clinician workspace for patient records, clinical notes, medication history, documents, and appointments.

## Run it

Requires **Node.js 22.16+** (Node 24 LTS or newer recommended) and npm.

```sh
npm install
npm run build
npm start
```

Open **http://127.0.0.1:4000**. No MongoDB account, AI key, or environment file is needed.

For development, run `npm run dev` and open **http://127.0.0.1:5173**. This starts the API on port 4000 and the Vite frontend on port 5173 (or the next free port). Both bind to localhost. The terminal prints the actual URL.

## What works

- **Today:** appointment agenda, unfinished drafts, recent notes, and patient shortcuts.
- **Patients:** search by name, email, or condition; add and edit details; archive and restore records.
- **Clinical notes:** structured SOAP editor, draft saving, Ctrl/Cmd+S, unsaved-change protection, and explicit signing. Signed notes are read-only. Version checks prevent overwriting a note changed in another window.
- **Medications:** record an existing medication, dosage, frequency, and instructions; discontinue or reactivate it. This does not issue prescriptions.
- **Schedule:** date navigation, status filters, appointment creation, rescheduling, check-in, completion, and cancellation. Overlapping appointments are rejected.
- **Documents:** upload and download PDF, TXT, PNG, and JPEG files up to 5 MB; remove attachments with confirmation.
- **Settings:** edit clinician and practice names; export all workspace records and attachments as JSON.

The interface supports keyboard navigation, visible focus states, reduced motion, and mobile layouts. Ctrl/Cmd+K focuses patient search.

## Local data

The app creates `backend/data/notemd.sqlite` on first launch. Changes are stored in SQLite, not browser storage, and survive browser and server restarts. Six synthetic patients and demonstration records are added once to a new workspace.

To start with an empty database, set `SEED_DEMO=false` before the first launch. Set `DATABASE_PATH` to choose a different SQLite file. `PORT` defaults to 4000. `DEV_PORT` sets the preferred development frontend port; the API proxy follows `PORT`.

Export is a portable JSON copy, including base64 attachments. It is not an automatic backup or a restore workflow. For a database backup, stop the server and copy the SQLite file before restarting it.

**This is a local development workspace, with synthetic data and no user authentication.** It is not ready to store real patient information or serve multiple users. Authentication, role-based access, encryption, audit history, operational backups, and a reviewed deployment are required before that use. The server intentionally accepts localhost hosts only.

## Project structure

```text
backend/          Express API and persistent SQLite store
frontend/app/     React + TypeScript + Vite clinician interface
tests/e2e/        Browser workflow and accessibility checks
tools/            Development and isolated test-server launchers
legacy/           Original MongoDB, doctor, patient, and landing-page source
PRODUCT.md        Confirmed product scope
DESIGN.md         UI design system
```

The new app does not connect to or migrate an existing MongoDB database. The patient portal and AI integrations in `legacy/` are retained as reference source and are not mounted in the new runtime.

## Validate

```sh
npm run check
npm test
npm run test:dev
npm run build
npx playwright install chromium
npm run test:e2e
```

API tests exercise validation, persistence across database restarts, immutable signed notes, stale-note conflicts, medication and document actions, scheduling conflicts, and origin protection. Browser tests use an isolated temporary database on port 4001; they do not change your workspace. They cover clinician workflows, search, keyboard shortcuts, unsaved edits, desktop/mobile layouts, and automated WCAG accessibility checks.

UI and interaction findings are documented in [docs/UI-REVIEW.md](docs/UI-REVIEW.md).
