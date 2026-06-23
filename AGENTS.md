# Quote Manager KC - Agent Instructions

## Project Purpose

This repository contains the standalone MVP for Knowledge Circle Learning Services Inc. proposal management. The MVP must let Kevin, Account Manager, create, manage, preview, export, import, and download language-training proposals without a backend.

The application must remain architecturally ready for a future Ezsked integration. Business rules and primary UI flows must not be coupled to MVP-only persistence or browser APIs.

## Permanent Constraints

- Use React, strict TypeScript, and Vite.
- Keep the MVP frontend-only.
- Generate PDFs entirely in the browser.
- Persist MVP data in IndexedDB behind repository interfaces.
- Support complete JSON export and import of local data.
- Keep English and French proposal templates independent and editable.
- Store money in a safe integer representation, such as minor currency units.
- Keep business functions testable without React.
- Keep React components accessible and free of direct persistence calls.

## Required Architectural Boundaries

React components must call use cases or view-model hooks only. They must never call IndexedDB, `localStorage`, browser file storage, future APIs, or PDF libraries directly.

The codebase must separate:

- domain models and business rules;
- application use cases;
- React components and screens;
- persistence adapters;
- PDF generation adapters;
- text templates;
- current-user handling;
- backup, import, and export;
- future Ezsked communication adapters.

At minimum, define ports for:

- `ProposalRepository`
- `ClientRepository`
- `LearnerRepository`
- `TrainingTypeRepository`
- `RateRepository`
- `SettingsRepository`
- `AttachmentRepository`
- `CurrentUserProvider`
- `PdfGenerator`
- `BackupService`

MVP implementations may use IndexedDB and a local Kevin user. Future Ezsked implementations must be swappable behind the same ports.

## Forbidden Actions

- Do not add a backend to the MVP.
- Do not add authentication to the MVP.
- Do not call OpenAI or any other AI API.
- Do not invent rates or reuse old production rates as official defaults.
- Do not silently modify a proposal version that has been sent or accepted.
- Do not access IndexedDB directly from React components.
- Do not add OnePageCRM integration.
- Do not send email from the MVP.
- Do not store real client data, confidential data, secrets, or production attachments in Git.
- Do not create a fake microservice or mock backend.

## Status and Revision Rules

Supported proposal statuses are:

- `Draft`
- `Approved internally`
- `Sent`
- `Viewed`
- `Change requested`
- `Revised`
- `Accepted`
- `Expired`
- `Cancelled`

In the MVP, status changes are manual.

Any version marked `Sent` or `Accepted` is immutable. Later edits must create a new revision with a traceable link to the previous version.

A proposal cannot be approved internally if required rates are missing. Totals must always be reproducible from financial lines.

## Development Commands

The repository currently contains documentation only. After the Vite app is scaffolded, use these commands as the expected project contract:

```powershell
npm install
npm run dev
npm run build
npm run typecheck
npm run lint
npm run test
npm run test:watch
npm run preview
```

Before adding or changing commands, update this file and `docs/IMPLEMENTATION_PLAN.md`.

## Testing Rules

Add tests alongside implementation work:

- unit tests for money calculations and validation rules;
- unit tests for proposal status transitions and revision immutability;
- unit tests for import/export validation;
- component tests for the main forms;
- critical-path tests for proposal creation, approval validation, PDF preview/download, backup, and restore.

Do not rely on AI or generated text for financial calculations. Calculations must be deterministic, typed, and covered by tests.

## Data Handling

Initial settings may be defined in code, then copied to IndexedDB on first use. Seed data must be clearly marked as fictitious.

Import must validate the full JSON payload before replacing existing data. If import fails, the previous local state must remain restorable.

Attachments are stored locally for the MVP. Do not commit real attachments.

## Documentation

Keep these documents current:

- `docs/MVP_ARCHITECTURE.md`
- `docs/DATA_MODEL.md`
- `docs/INTEGRATION_WITH_EZSKED.md`
- `docs/SECURITY_AND_LIMITATIONS.md`
- `docs/IMPLEMENTATION_PLAN.md`
- `docs/ASSUMPTIONS.md`
