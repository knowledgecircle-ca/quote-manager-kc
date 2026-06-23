# Assumptions

## Confirmed From The Brief

- The MVP is standalone and browser-only.
- The required stack is React, strict TypeScript, and Vite.
- There is no backend, server database, authentication, OpenAI API, email sending, or OnePageCRM integration in the MVP.
- PDFs are generated in the browser.
- Local persistence uses IndexedDB.
- Full JSON export and import are required.
- Kevin is the MVP current user.
- Future Ezsked integration must replace adapters rather than rewrite business logic and UI.
- Sent and accepted proposal versions are immutable.
- Later edits after sent or accepted status create a new revision.
- Status changes are manual in the MVP.
- Rates must not be invented.
- The following working service catalog and rates were confirmed by Kevin on 2026-06-22 for MVP modelling, pending final wording and source labels:
  - Second language training can be full-time or part-time, group or individual, and delivered online by MS Teams, in person, or hybrid.
  - Hybrid training may itself be full-time or part-time.
  - Individual language training may be SOA or non-SOA.
  - Non-SOA language training uses CAD 43.00/hour for individual classes and CAD 45.00/hour for group classes.
  - Diagnostic assessment is non-SOA and uses CAD 55.00 per candidate per selected competency: Reading, Writing, Oral, or any combination of one, two, or three competencies.
  - NMSO placement test is part of the NMSO SOA, uses CAD 75.00 per candidate, and always includes all three competencies.
  - NMSO placement tests can be added to a language-training proposal; a client may request one or more placement tests and language training in the same proposal.
  - `NMSO placement test` is a specific NMSO product label and must not be used as a generic service type for other SOA placement, diagnostic, assessment, or evaluation lines.
  - OSO Stream 4 is full-time individual virtual training in English or French at CAD 40.00/hour for 2024/25 through 2028/29.
  - OSO Stream 5 is part-time virtual individual training in English or French at CAD 40.00/hour for 2024/25 through 2028/29.
  - OSO Stream 6 is part-time individual training in English or French in a federal institution at CAD 40.00/hour for 2024/25 through 2028/29.
  - OSO Stream 8 is placement tests for language learning at CAD 75.00/candidate for 2024/25 through 2028/29.
  - CCC is Canadian Commercial Corporation SOA 106974.136; its active dates are January 20, 2026 to March 31, 2028.
  - CCC training rates are hourly: CAD 46.00/hour for one group training up to 15 participants, CAD 44.00/hour for one semi-private training up to 2 participants, and CAD 42.00/hour for one private training.
  - CCC assessment rates are CAD 75.00 per candidate for Reading, Writing, and Oral assessment.
  - CCC cancellation policy is 48 business hours.
  - NMSO identifier `CW2379765` and OSO identifier `EN578-202723/006/ZF` are confirmed.
  - The 25 active SOA extracted rate rows are confirmed usable in proposals.
  - Proposal service type choices are dictated by the selected Price Book source. If a selected SOA has no placement, diagnostic, assessment, or evaluation line, only second language training should be offered for that SOA.
  - The app must not ask for an expected client acceptance date during draft creation.
  - The applicable rate is validated later, when the real acceptance date or contract-received date is entered during a status change.
  - Standard offer-validity wording belongs in proposal templates; Knowledge Circle offers are valid for 30 days.
  - Clients may request a quote revision that switches from non-SOA rates to SOA rates, or from SOA rates to non-SOA rates; the service workflow must keep that change straightforward and traceable.
  - Federal-government clients require training start and end dates to be clear on proposals.
  - Group training starts at 2 participants.
  - For groups outside CCC, the active SOA source does not indicate a maximum; no general maximum applies unless a source explicitly states one.

## Architectural Assumptions

- `Client` can represent a ministry, department, organization, or similar customer.
- Contacts and learners are separate entities because a contact may not be a learner.
- Proposal versions are the safest way to enforce immutability.
- Financial totals should be calculated from line items, not stored as independent truth.
- Settings are initialized from code defaults and copied to IndexedDB on first use.
- English and French document templates are separate editable settings.
- Attachments can be stored locally for the MVP but may need a different Ezsked adapter later.

## Open Decisions

- Final source names and price codes for the confirmed working service catalog.
- Remaining source-specific SOA applicability rules beyond the confirmed active rows.
- Whether taxes apply, and if so which tax rules and rounding rules are required.
- Proposal numbering format.
- Whether clients, contacts, and learners should be reusable across proposals in the MVP.
- Which PDF library to use.
- Which IndexedDB helper library to use.
- Which runtime validation library to use for imports.
- Whether attachments are exported inline as base64 or as a separate backup bundle.
- Whether standing offers require structured rules or editable text only in the first MVP.
- Exact approval authority once Ezsked permissions are introduced.
- Exact visual design for letterhead, footer, logo, and signature.
- Whether the MVP needs bilingual UI or only bilingual proposal documents.

## Risks

- If final source codes, source documents, or effective dates arrive late, approval and PDF flows may need placeholder states without allowing untraceable amounts.
- If standing offers are complex, the data model may need additional rule entities.
- If browser storage quotas are exceeded by attachments, backup and attachment handling may need redesign.
- If Ezsked permissions are strict, current use cases may need additional authorization checks.
- If proposal numbering must be centralized, local-only numbering may need replacement during integration.
- If import validation is too loose, corrupt local data could break proposal generation.
- If PDF layout is chosen before templates stabilize, document-generation work may be reworked.

## Decisions Not To Make Yet

- Do not choose additional official rates beyond the working catalog rules confirmed on 2026-06-22.
- Do not finalize paper graphic design.
- Do not add authentication.
- Do not add backend infrastructure.
- Do not add OnePageCRM or email behavior.
- Do not create production seed data.
