# Rebuild notes

## Baseline

The repository contained three independent Next.js frontends and an Express backend, without a root launcher. `npm start` in the backend failed with "Missing script: start"; `npm test` was a placeholder that exited with failure. Startup required MongoDB configuration, and frontend origins and authentication depended on several environment variables. Some screens mixed fixture notes with API-backed data. Legacy authentication logged tokens, and the old upload path required AI embeddings for basic document storage.

## Replacement

One React/TypeScript application and one Express API now serve the confirmed clinician workflow. A root npm workspace provides installation, development, build, testing, and production launch commands. The production server serves the frontend and API from the same origin. SQLite is built into the supported Node runtime, eliminating external services and native database-driver installation for local startup.

Records reference patient IDs through database foreign keys. The API validates input, rejects unknown records, handles JSON errors, and enforces note version checks and signed-note immutability. Writes are synchronous SQLite operations, so each version-check/update operation completes before another request can intervene in this single-process local runtime. Parameterized statements are used for record data; table identifiers are allowlisted.

The app binds to loopback, checks Host headers, restricts mutation origins, and never mounts the old API. Uploads are bounded, stored as attachment data, and downloaded with attachment and nosniff headers. No AI-generated medical advice or clinical recommendations are produced.

## Deliberate limits

This rebuild is a local clinician development workspace. There is no authentication, multi-clinician assignment, patient portal, e-prescribing, AI chat, transcription, or MongoDB migration in the new runtime. No real-patient deployment or compliance claim is made. Signed-note immutability here is an application rule, not a regulated electronic-signature or full audit-trail system. These limits are visible in settings and the README.

## Legacy source

Original source and dependency manifests remain under `legacy/` for reference. Its frameworks and dependencies are excluded from the root npm workspace and are not supported entry points. Active dependencies and scripts live in the root, `backend/package.json`, and `frontend/app/package.json`.
