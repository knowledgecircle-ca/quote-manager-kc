# Implementation Plan

## Scope of This First Mission

This first mission creates documentation and an implementation plan only. It does not scaffold React, implement business features, add dependencies, or create a backend.

## Phase 0 - Repository Baseline

Status: documentation started.

Tasks:

- confirm existing files and configuration;
- document permanent constraints in `AGENTS.md`;
- define architecture, data model, Ezsked integration boundary, security limits, assumptions, and implementation plan.

Finding:

- no existing `package.json`, `tsconfig`, Vite config, README, or previous `AGENTS.md` was present during inspection.

## Phase 1 - App Scaffold

Status: scaffold completed.

Tasks:

- create Vite React TypeScript project structure;
- enable strict TypeScript;
- add ESLint and formatter configuration;
- add unit-test setup;
- add component-test setup;
- add path aliases that reflect the architecture;
- create empty architecture folders without business-heavy implementation.

Verification commands:

```powershell
npm install
npm run typecheck
npm run lint
npm run test
npm run build
npm run preview
```

## Phase 2 - Domain Foundations

Tasks:

- define core entity types;
- define the service catalog model for language training, diagnostic assessment, NMSO placement tests, and CCC assessment;
- model selected competencies separately from free-text descriptions;
- model delivery mode, training format, class type, contract vehicle, and billing unit separately so descriptions and pricing remain clear;
- define money type using integer minor units;
- define status enum or union;
- define proposal version immutability rules;
- define approval validation;
- define deterministic total calculation;
- add unit tests for money, totals, validation, status transitions, and revision creation.

Do not add additional official rates beyond the working catalog rules confirmed on 2026-06-22 until an approved source is provided.

## Phase 3 - Ports and Use Cases

Tasks:

- define required repository and service ports;
- implement use cases for creating, editing, duplicating, revising, approving, and status changes;
- ensure use cases depend on ports only;
- add test doubles for ports;
- test business flows without React.

Required ports:

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

## Phase 4 - Local Persistence

Tasks:

- choose IndexedDB helper library or implement a small adapter;
- define schema version;
- add migrations;
- seed default settings on first use;
- mark sample data as fictitious;
- implement repository adapters;
- implement attachment storage;
- test migrations and repository behavior.

## Phase 5 - Backup and Restore

Tasks:

- define export format version;
- export all local data to JSON;
- validate import payloads before applying;
- keep previous state restorable after failed import;
- implement full reset;
- test invalid and valid import paths.

## Phase 6 - UI Shell and Core Screens

Tasks:

- create application shell and navigation;
- add dashboard;
- add proposal list with search and filters;
- add guided creation flow;
- add proposal editor;
- add phase, learner, contact, and financial-line editors;
- add status history;
- add settings;
- add backup and restore.

React components must call use cases or hooks only. They must not access IndexedDB directly.

## Phase 7 - PDF Preview and Download

Tasks:

- define document view model;
- keep English and French templates independent;
- implement `PdfGenerator`;
- add preview before download;
- document letterhead extension points;
- test that PDF generation works in-browser.

## Phase 8 - Quality Gates

Tasks:

- add component tests for main forms;
- add critical-path tests;
- run build, lint, unit tests, and component tests;
- verify no unintended network calls;
- verify no secrets or production data are committed.

## Candidate Dependencies to Validate Later

No dependency is added in this mission. Later candidates:

- `idb` or Dexie for IndexedDB access;
- Zod or Valibot for runtime import validation;
- pdf-lib or react-pdf for browser PDF generation;
- Vitest for unit tests;
- Testing Library for React component tests;
- Playwright for critical-path tests;
- ESLint TypeScript tooling and Prettier for quality consistency.

Each dependency must be justified before installation.
