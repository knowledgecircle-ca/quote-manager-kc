# Proposal Creation Workflow

Reference date: 2026-06-22

## Direction

Proposal creation should behave as a service-based quote builder, not as a free-form proposal document editor.

The Price Book now clarifies that a proposal may combine:

- second language training;
- diagnostic assessments;
- placement tests;
- NMSO placement tests;
- CCC assessments.

Each requested service must be configured so the application can derive a compatible Price Book line, rate, quantity, and estimated amount before approval.

## Workflow Shape

1. Basics & Client
   - quote date;
   - proposal title;
   - organization name as temporary free text;
   - contact name as temporary free text.

   Rule: the proposal title is the public document title. During the local-only MVP phase, the Quote ID is entered manually from Kevin's external quote register using the working format `KC-YYYY-MMDD-XX`, for example `KC-2026-0623-01`. PDF generation is blocked until a valid Quote ID is entered. Once Quote Manager runs on the company server with the correct database, the Quote ID sequence can be generated centrally by the application.

   Rule: until the client database is implemented, Kevin can paste the ministry, department, organization, and contact names manually. Later, these fields should become structured client/contact records without changing the proposal workflow.

2. Services & Training
   - start with no requested service blocks in a new proposal;
   - add one or more requested service blocks explicitly;
   - move focus to a newly added service block so the user immediately sees and edits what was added;
   - show quick service shortcuts when a proposal contains more than one service block;
   - choose the pricing path first: SOA or Non-SOA;
   - if SOA, choose the specific active SOA before choosing the service;
   - choose the service type from the compatible Price Book lines for that pricing path and source;
   - configure participant quantity, candidate quantity by language, competencies, delivery mode, format, weekly rhythm, and total estimated hours where applicable;
   - let the application select the compatible Price Book rate automatically from the configured source and service shape;
   - when the selected service is second language training, capture the schedule rhythm, total estimated hours, and structured schedule preferences inside that service block.
   - for part-time group programs, capture one or more group sets. Each group set has a number of groups, language, expected participants, session, program start date, teaching weeks, buffer weeks, classes per week, class duration, and delivery mode.
   - show the maximum participants per group as a calculated capacity rule, not as a prefilled client value. Use explicit SOA limits when available; otherwise use a default maximum of 6 per group.
   - show recommended groups from `expected participants / maximum participants per group`, while keeping the configured number of groups editable.
   - default expected participants total to `number of groups x maximum participants per group`. If the user edits expected participants manually, preserve that manual value until the user changes it again.
   - for full-time or individual training, capture the training start date and training end date directly.

   Rule: SOA versus Non-SOA must remain easy to change because clients often ask for a revised quote using SOA rates after a non-SOA draft, or the reverse.

   Rule: a new proposal must not auto-populate a training service on refresh or first load. The Quote Summary should show zero services until Kevin explicitly selects `Add service`.

   Rule: `NMSO placement test` is only available for NMSO SOA. Other SOA placement, diagnostic, assessment, or evaluation lines must use source-appropriate generic service labels. If a selected SOA has only language-training lines, the service type selector must show only `Second language training`.

   Rule: training start and end dates are required proposal information for federal-government clients. Date changes should be handled inside the affected language-training service block and remain visible in the proposal content and review.

   Rule: full-time training uses a five-day-per-week rhythm and must show either hours per day or hours per week. Part-time training must show classes per week and class duration, with supported class durations of 1h, 1.5h, 2h, 3h, 3.5h, and 4h. Estimated quote hours are calculated from the training date range and weekly rhythm. One training week is a calendar week from Monday to Sunday; any touched Monday-Sunday week counts as one week.

   Rule: individual language-training quotes may include additional reserve hours when a client wants funding coverage in case an learner needs extra time after a failed test or similar risk. Reserve hours do not apply to group or semi-private training.

   Rule: individual language-training service blocks default to 1 individual learner, but may represent multiple individual learners when they share the same language, schedule, delivery mode, and duration. Billable hours equal `individual learners x hours per learner`, including any reserve hours per learner.

   Rule: language-training availability and scheduling preferences are structured, not a single loose notes field. They may include unavailable weekdays, preferred weekdays, AM or PM preference, time zone, location or delivery context, statutory-holiday handling, and a short additional availability note. Saturday, Sunday, and statutory holidays are excluded by default for internal planning, but default exclusions should not be repeated in the client proposal unless Kevin customizes them. Preferences apply to the whole service by default. If an individual service has multiple learners, Kevin may switch preferences to each individual learner. If a part-time group service has multiple group sets, Kevin may switch preferences to each group set. Time zone is retained for operational scheduling after the contract is received because scheduling is coordinated from Ottawa/Eastern time.

   Rule: the proposal must include a standard scheduling-preferences disclaimer. It must state that preferences are considered for planning only and do not guarantee the final schedule, instructor availability, delivery location, start date, class time, or reserved capacity. It must also state that all times indicated in the proposal are Ottawa, Ontario time (Eastern Time), unless expressly stated otherwise. Preferred days and AM/PM preferences are indicative only, especially for part-time training where many clients request the same high-demand windows such as Tuesday and Thursday mornings. Because Knowledge Circle is based in Ottawa, schedules use Ontario statutory holidays by default. If the client requires other provincial, territorial, organizational, or location-specific holidays to be observed, the client must identify them in writing before the schedule is confirmed.

   Rule: a group set may represent several identical groups. Billable hours for a group set equal `number of groups x teaching weeks x classes per week x class duration`.

   Rule: expected participants describe the client request. Maximum participants per group describe the applicable capacity rule. These concepts must remain visually separate so proposals do not imply that Knowledge Circle is imposing a participant count when the client has not confirmed one.

   Rule: if a requested group changes pricing source, service type, class type, or training format, it must be created as another service so the Price Book rate remains clear. Differences in language, participants, session, start date, delivery mode, frequency, class duration, teaching weeks, or buffer weeks may be handled as another group set inside the same service when the rate is still compatible.

   Rule: part-time group quotes use teaching weeks for billable hours. Buffer weeks extend the calendar planning span for statutory holidays or scheduling risk, but they do not increase the billable hour estimate unless the user increases teaching weeks, rhythm, class duration, or number of groups.

3. Pricing
   - show one row per requested service;
   - display the automatically selected compatible Price Book line;
   - display source, active dates, rate, unit, quantity, and estimated amount;
   - display an estimated subtotal before taxes;
   - do not calculate final invoice totals until tax and rounding rules are confirmed.

   Rule: Non-SOA rates may be overridden inside a proposal when Kevin needs a proposal-specific adjustment. The adjusted rate must not update the Price Book and must include an adjustment note before approval. SOA rates remain locked to the selected active SOA price line.

4. Proposal document
   - choose the proposal document language for the draft PDF;
   - review the sections that will appear in the proposal PDF;
   - generate service wording from the configured service blocks, schedules, rates, and quantities;
   - apply standard administrative clauses from editable English/French templates;
   - include the standard offer-validity wording: all offers are valid for 30 days;
   - include a MyLearningMyWay access clause when virtual, hybrid, or supported language-training services require class links, calendars, pedagogical material, attendance sheets, homework, progress reports, class reports, or other program information;
   - flag cancellation, absence, tax, security, and contract-precedence wording for review until the final business rules are approved.

   Rule: this step must not become a free-form word processor. It should behave as a PDF section and clause review step. Generated service text comes from structured proposal data; reusable legal and administrative wording comes from templates.

5. Preview and browser PDF generation
   - block approval when required price lines or required service fields are missing;
   - show issues before PDF generation;
   - generate a Letter-size PDF through the browser print dialog;
   - include the standard Knowledge Circle footer on every printed page;
   - show controlled page numbering in the proposal preview and printed PDF;
   - present client-facing quotation lines as item, description, rate, quantity, and total.

   Rule: the old prototype `Review` step is not part of the active proposal workflow. The visible workflow ends at `Proposal document`, and the top `Preview` action or Quote Summary preview opens the same draft Letter-size proposal.

   Rule: proposal preview should use North American Letter size by default. `A4` should not be shown as the default format. Legal size can be considered later only if a client or contract requires it.

   Rule: the PDF footer should read `Knowledge Circle Language Services Inc. ©2026 1 Rideau Street, 7th Floor, Ottawa K1N 8S7, Canada`, with `Page X of Y` shown from the controlled proposal preview pagination.

   Rule: the top `Preview` action and the `Proposal preview` control in the Quote Summary should open the same draft preview. In this phase, PDF output uses the browser print dialog and the user chooses `Save as PDF`. A silent PDF blob generator remains a later enhancement if needed.

   Rule: Price Book source codes and rate-source review data are internal audit details. They may appear in the Pricing step, but not as primary columns in the client-facing proposal preview.

6. Status change after sending
   - when the proposal is accepted or the contract is received, capture the real acceptance or contract-received date;
   - validate selected Price Book lines against that real date;
   - require a revised selection or proposal revision if a selected rate is not valid on that date.

## Guardrails

- Do not ask for an expected client acceptance date during proposal creation.
- Rate applicability is validated later, when the real acceptance or contract-received date is known.
- Offer validity is standard proposal wording: all offers are valid for 30 days.
- Assessment and placement services use candidates and competencies, not class type or rhythm.
- Assessment and placement services capture quantities as assessment groups. Each group has one language, one candidate count, and one competency mix, so mixed requests can be priced accurately.
- NMSO placement tests always include Reading, Writing, and Oral.
- Group training starts at 2 participants.
- No general maximum participant count is assumed unless the selected source states one.
- Price Book rate selection is automatic in this phase, based on the configured pricing path, SOA source, service type, class type, quantity, and competencies.
- Automatic rate selection must remain reviewable and must not silently approve a proposal.
- Quote ID must not replace the public proposal title in the PDF.
- Local-only phase decision: Quote IDs are manually assigned from Kevin's external register, using `KC-YYYY-MMDD-XX`, to avoid relying on a browser-local counter before server persistence exists.
- No backend, authentication, CRM, email, OpenAI, silent server PDF rendering, or automatic approval is introduced by this workflow refinement.
