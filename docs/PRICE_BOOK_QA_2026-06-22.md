# Price Book QA - 2026-06-22

## QA Scope

This pass reviews whether the current Price Book is ready to support the next proposal-creation phase.

It covers:

- active SOA source visibility;
- SOA-to-price-line navigation;
- confirmed working catalog lines;
- extracted active SOA rows;
- remaining limitations that must not be hidden during proposal creation.

## QA Result

The Price Book is ready to support the next proposal-creation prototype, with first-pass automatic compatible rate selection.

It is not yet ready for automatic approval, final tax calculation, or final date-based contract validation.

## Passed Checks

- Active SOA sources remain distinct from selectable price lines.
- A user can select an SOA source and view its matching price lines in the unified `Price lines` view.
- The 25 extracted active SOA rate rows are present as confirmed usable proposal lines.
- Assessment and placement rows use `Per candidate` and `Not applicable` schedule/rhythm.
- Language-training rows use `Per hour`.
- Non-SOA individual and group rows use confirmed hourly units.
- CCC number, dates, cancellation policy, training rates, and assessment rates are confirmed.
- NMSO and OSO identifiers are confirmed.
- Group training starts at 2 participants.
- No general group maximum is assumed unless a source explicitly states one.
- The applicable rate rule is documented as a later status-change validation using the real acceptance or contract-received date.
- Real extracted rate amounts remain local to this workstation and are not repeated in public docs.

## Proposal-Creation Readiness

Proposal creation may proceed if the next phase keeps these guardrails:

- rate selection is automatic but must remain visible and reviewable;
- selected line source, SOA, service basis, schedule, participant count, quantity, and active dates remain visible;
- proposal creation does not ask for an expected client acceptance date;
- no approval is allowed when a required price line is missing;
- no automatic tax or rounding rules are introduced until confirmed;
- no PDF finalization depends on unconfirmed cancellation-policy precedence;
- no backend, CRM, email, authentication, or external API is added.

## Remaining Non-Blocking Questions

These do not block creating the proposal workflow, but they should block final approval automation:

- tax applicability and rounding rules;
- cancellation-policy precedence when multiple terms could apply;
- exact OSO fiscal-year effective date boundaries for automatic date-based selection;
- whether semi-private should exist outside CCC;
- evidence required before contract-program rates can be used as quote pricing;
- final proposal numbering format.

## Decision

Proceed to the proposal-creation phase.

Recommended next step: build the proposal creation flow around service selection, learner count, delivery mode, schedule, automatic Price Book rate display, and estimated pre-tax totals before implementing approval automation.
