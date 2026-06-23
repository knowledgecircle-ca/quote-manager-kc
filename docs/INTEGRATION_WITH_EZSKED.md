# Integration With Ezsked

## Integration Goal

The MVP is deployed independently, but its business logic and primary interface must be ready to become an Ezsked module. Integration should replace adapters, not rewrite the domain model or React workflows.

## Boundary Strategy

The application depends on ports. MVP adapters implement those ports with local browser storage. Ezsked adapters can later implement the same ports with Ezsked services.

The most important boundary is:

```text
React UI -> application use cases -> ports -> adapters
```

React must not know whether data comes from IndexedDB or Ezsked.

## MVP Implementations

- `ProposalRepository`: IndexedDB
- `ClientRepository`: IndexedDB
- `LearnerRepository`: IndexedDB
- `TrainingTypeRepository`: IndexedDB
- `RateRepository`: IndexedDB
- `SettingsRepository`: IndexedDB
- `AttachmentRepository`: IndexedDB or documented local attachment store
- `CurrentUserProvider`: local Kevin user
- `PdfGenerator`: browser-side generator
- `BackupService`: JSON export/import service

## Future Ezsked Implementations

- repositories using Ezsked APIs or data-access services;
- Ezsked authentication and current-user context;
- Ezsked authorization, roles, and permissions;
- Ezsked database-backed settings and rates;
- Ezsked attachment handling;
- Ezsked audit trail;
- possible Ezsked notification or email workflows, only if explicitly approved later.

## Current User

The MVP uses a local current user representing Kevin. The user object should be minimal:

- `id`
- `displayName`
- `email`
- `role`

Do not build fake authentication. Future authentication belongs to Ezsked.

## Permissions

The MVP does not enforce complex permissions. It should still keep use-case names and boundaries that can accept permission checks later.

Future examples:

- who can approve internally;
- who can send;
- who can accept;
- who can edit settings;
- who can view or restore backups.

## Data Migration Considerations

IndexedDB schema versions and JSON export versions should be designed so MVP data can later be migrated into Ezsked if needed.

Avoid MVP-only assumptions in entity identifiers, money representation, status history, revision history, and template language handling.

## Non-Goals for the MVP

- no Ezsked database access;
- no Ezsked authentication;
- no OnePageCRM integration;
- no email sending;
- no fake backend;
- no synchronization service;
- no server-side PDF rendering.

## Integration Risks

- Rates and standing-offer rules may require stronger modeling once official documents are provided.
- Ezsked permissions may add approval constraints not present in the MVP.
- Attachment storage may need migration planning if local files become centralized Ezsked records.
- Proposal numbering may need alignment with Ezsked conventions.
- Audit requirements may require more detailed event capture than the MVP initially needs.
