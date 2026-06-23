# MVP Architecture

## Goal

Build a standalone proposal-management MVP for Knowledge Circle Learning Services Inc. that can later become an Ezsked module without rewriting business rules or the main user experience.

The MVP has no backend, no authentication, no external CRM, no email sending, and no AI calls. It uses React, strict TypeScript, Vite, IndexedDB, browser-side PDF generation, and full JSON backup/restore.

## Current Repository State

Initial inspection found no existing `package.json`, `tsconfig`, Vite configuration, README, or `AGENTS.md`. This first mission therefore adds architecture documentation only and does not scaffold the application.

## Layered Design

### Domain Layer

Owns stable business concepts and rules:

- proposals, versions, phases, contacts, learners, rates, financial lines, attachments, templates, and settings;
- money representation and arithmetic;
- date, hour, quantity, and required-rate validation;
- status transitions;
- revision immutability for sent and accepted versions;
- deterministic total calculation from financial lines.

The domain layer must not import React, IndexedDB, PDF libraries, browser storage APIs, routing, or Ezsked-specific code.

### Application Layer

Owns use cases and orchestration:

- create proposal;
- edit draft proposal;
- duplicate proposal;
- create revision;
- approve internally;
- change status manually;
- generate preview data;
- generate and download PDF;
- import backup;
- export backup;
- restore defaults;
- manage local settings.

Use cases depend on ports, not concrete adapters.

### Ports

Define interfaces for:

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

These ports are the replacement boundary for future Ezsked integration.

### Adapters

MVP adapters:

- IndexedDB repositories;
- local Kevin current-user provider;
- browser PDF generator;
- JSON backup service;
- attachment storage in IndexedDB or a documented browser-local store.

Future adapters:

- Ezsked API repositories;
- Ezsked current-user and permission provider;
- Ezsked database-backed attachment service;
- Ezsked audit and communication services, if approved later.

### React Layer

React components and screens render state, collect input, and call application-layer use cases. Components must not call persistence or PDF APIs directly.

Recommended UI areas:

- dashboard;
- proposal list with search and filters;
- guided creation flow;
- proposal editor;
- phase editor;
- learner/contact management;
- financial line editor;
- PDF preview;
- status history;
- settings and defaults;
- backup and restore.

### Composition Root

A single app composition area wires ports to MVP adapters. Future Ezsked integration should replace this wiring, not the domain or UI contracts.

## Document Generation Boundary

`PdfGenerator` receives a prepared document model, not raw React state. English and French templates remain independent. No automatic translation service is used.

The paper design is intentionally not final in the MVP. Keep documented extension points for:

- logo;
- letterhead image or template;
- colors;
- footer;
- signature.

## Target Source Tree

```text
src/
  app/
    composition/
    routes/
  domain/
    money/
    proposals/
    clients/
    learners/
    training/
    settings/
    attachments/
  application/
    ports/
    use-cases/
    validation/
  infrastructure/
    indexeddb/
    pdf/
    backup/
    current-user/
    ezsked/
  ui/
    components/
    screens/
    forms/
    hooks/
  templates/
    en/
    fr/
  test/
    fixtures/
```

## Architectural Rules

- Domain code must be deterministic and independently testable.
- Use cases must receive dependencies through ports.
- MVP storage details must stay in infrastructure adapters.
- UI state must be separate from persisted domain entities where it improves validation and accessibility.
- Sent and accepted versions must be treated as read-only snapshots.
- Imports must validate before replacing local data.
- No production client data belongs in source control.
