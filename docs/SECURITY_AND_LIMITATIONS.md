# Security and Limitations

## MVP Security Scope

The MVP is a local, browser-based tool. It has no backend, no authentication, no authorization system, no email sending, no CRM integration, and no external AI calls.

This makes the MVP simpler to test, but it also means local browser data must not be treated as enterprise-secure storage.

## Data Protection Rules

- Do not commit real client data.
- Do not commit confidential proposals.
- Do not commit real attachments.
- Do not commit secrets, API keys, credentials, or tokens.
- Use clearly fictitious seed data only.
- Keep import/export files out of Git unless they are sanitized fixtures.

## Local Storage Limitations

IndexedDB data is local to the browser profile and device. It can be lost if the browser profile is cleared or corrupted.

The MVP must therefore provide:

- complete JSON export;
- complete JSON import;
- import validation;
- rollback or restoration after failed import;
- full reset;
- clear messaging when data is local only.

## Privacy Limitations

The MVP should not be used as the authoritative long-term record for sensitive production data unless the organization explicitly accepts local-browser storage risk.

Future Ezsked integration should move authoritative records to Ezsked-controlled storage and permissions.

## No External Calls

The MVP must not make network calls unless they are required by Vite development tooling or explicitly approved future work.

Forbidden integrations in the MVP:

- OpenAI or other AI APIs;
- OnePageCRM;
- email services;
- server PDF generation;
- analytics that transmit client data.

## PDF Limitations

PDFs are generated in the browser. The MVP will reserve documented extension points for letterhead, logo, colors, footer, and signature, but final paper design is not part of this first mission.

## Calculation Limitations

The application must not infer or invent rates. Missing rates should block approval when a rate is required.

Money calculations must avoid floating-point errors by using integer minor units and deterministic rounding rules.

## Operational Risks

- Local backups may contain sensitive data once real usage begins.
- Multiple browser profiles will not share data.
- Concurrent editing across devices is out of scope.
- Browser storage quotas may affect large attachments.
- Manual status changes can be incorrect without future Ezsked permissions and audit controls.

## Recommended Mitigations

- Add a visible local-data warning in the MVP.
- Provide backup reminders.
- Validate imports before applying them.
- Keep immutable sent and accepted versions.
- Keep status history explicit.
- Keep real production data out of Git.
- Add future Ezsked migration notes when data structures change.
