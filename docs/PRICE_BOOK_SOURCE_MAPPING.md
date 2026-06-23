# Price Book Source Mapping

Reference date: 2026-06-22  
Timezone: America/Montreal

## Source Access

The brief listed `EZSKED_SOURCE_PATH = TO_CONFIRM`. A readable local Ezsked V3 checkout was found at `C:\Users\One\Documents\Ezsked-3.0-KC`.

Inspected sources:

- `backend/ezsked_shadow/db.py`: SQLite schema for SOA, contracts, programs, and rates.
- `backend/ezsked_shadow/soa_updates.py`: SOA update and rate normalization logic.
- `backend/ezsked_shadow/contract_updates.py`: contract/program update logic and SOA compatibility behavior.
- `backend/ezsked_shadow/queries.py`: SOA catalog and contracts/programs query behavior.
- `sample_data/private/ezsked_shadow.sqlite`: local private SQLite data source used for read-only extraction.

No Laravel migrations, MySQL schema, remote database, or backend migration was used.

## Mapping Table

| Target column | Source table or file | Source column | Transformation rule | Fallback when absent | Confidence |
|---|---|---|---|---|---|
| price_code | `soa_offer_rates` / `contract_program_instances` | stable source ids | `SOA-{SOA_NUMBER}-{SOURCE_RATE_ID}` or `CONTRACT-{CONTRACT_ID}-{SOURCE_RATE_ID}` sanitized to uppercase | No random id; row blocked if no source id | High |
| price_label | rate/program source | `source_label`, `service_type`, `program_code` | Use source label first, then service/program label | Source service or program code | Medium |
| client_type | source context | SOA or contract context | SOA rows use `SOA`; contract program rows use `Government non-SOA` pending confirmation | `TO_CONFIRM` if future source is unclear | Medium |
| contract_vehicle_type | source context | SOA relation / contract source | SOA rows use `SOA`; contract program rows remain `TO_CONFIRM` without awarded RFP evidence | `TO_CONFIRM` | Medium |
| soa_number | `soa_offers`, `contracts` | `standing_offer_number`, `soa_number` | Copy exact source value | blank for non-SOA template rows | High |
| agency_name | `soa_offers`, `contracts` | `department_agency`, `company_name` | Copy exact source value | blank or `TO_CONFIRM` | High |
| service_type | rate/program label | `service_type`, `program_code` | Assessment/evaluation/placement labels map to `Assessment / placement`; other SOA training labels map to `Second language training` | `Custom training` or manual review in future | Medium |
| language | rate/program label | `service_type`, `course_language` | Use explicit French/English only | `TO_CONFIRM` | Medium |
| class_type | rate/program label | `service_type`, `program_kind` | Use explicit Individual/Group for training; use `Per candidate` for assessment and placement rows | `TO_CONFIRM` | Medium |
| rhythm | rate label | `service_type` | Use explicit Full-time or Part-time for training; use `Not applicable` for assessment and placement rows | `TO_CONFIRM` | Medium |
| min_learners | class type | derived from explicit class | Individual = 1; Group = 2 | blank | Medium |
| max_learners | class type and explicit source limit | derived only when source states a limit | Individual = 1; CCC group = 15; other group rows stay blank because no general maximum applies | blank | Medium |
| level_band | program source | `level_targeted`, `program_code` | Copy explicit level when present | `TBD` | Medium |
| training_objective | none reliable | none | Not inferred from source labels | `TO_CONFIRM` | Low |
| rate_type | contract program source | `rate_type` | Copy explicit source value for contract program audit rows; SOA rows remain `TO_CONFIRM` because unit is not explicit | `TO_CONFIRM` | Low |
| rate_unit | source context and Kevin confirmation | none | Confirmed language training rows use `PER_TRAINING_HOUR`; candidate-based assessments and placements use candidate/competency units | `TO_CONFIRM` | Medium |
| rate_amount | rate source | `rate_amount` | Decimal string with two decimals when source amount exists | blank when amount unknown | High |
| rate_status | dates and amount | source dates, `rate_amount` | CONFIRMED only when active and numeric; EXPIRED/FUTURE from effective dates; MISSING when active amount absent; AMBIGUOUS when source is not executable | `AMBIGUOUS` | High |
| currency | project rule | none | Always CAD | CAD | High |
| effective_from | rate or parent dates | `period_start`, `start_date` | Rate period first; parent SOA/contract date when rate period absent and parent applies | blank if absent | Medium |
| effective_to | rate or parent dates | `period_end`, `end_date` | Rate period first; parent SOA/contract date when rate period absent and parent applies | blank if absent | Medium |
| cancellation_policy | parent source | `cancellation_policy` | Copy exact source text | blank; do not invent | High |
| price_source | source context | source table | `SOA Catalog` for SOA rows; `Awarded Contract` only in private audit rows pending proof | `Placeholder` for template | Medium |
| source_record_type | extraction source | source table | `SOA_RATE`, `CONTRACT_PROGRAM_INSTANCE`, or `TEMPLATE` | required for extracted rows | High |
| source_record_id | extraction source | parent id | SOA offer id or contract id | required for extracted rows | High |
| source_rate_id | extraction source | child id | SOA rate id or contract program instance id | required for extracted rows | High |
| requires_manual_selection | project rule | none | Always true for extracted/template rows | true | High |
| quote_rule | project rule | source context | SOA rows show every compatible rate; contract rows require KC confirmation | rate to confirm | Medium |
| internal_notes | extraction context | multiple | Record reference date, timezone, source labels, and ambiguity | manual note | High |

## Mapping Boundaries

- No rate unit was inferred from a monetary amount.
- No cancellation policy was invented.
- No SOA rate was replaced by a KC default.
- No contract program rate was promoted to active awarded RFP pricing because the inspected rows did not prove award status, executable RFP source, and KC supplier evidence.
- Public docs do not include real rate amounts. Real extracted amounts are stored only under `private-data/`.

## Working Catalog Rules Confirmed By Kevin

Date confirmed: 2026-06-22

These rules were provided directly by Kevin during MVP design. They should guide the next price book modelling pass, but they still need stable price codes, effective dates, source labels, and final quote wording before being treated as a complete importable price book.

| Service | Contract vehicle | Amount | Selection rule | Proposal description rule |
|---|---|---:|---|---|
| Second language training - individual | Non-SOA confirmed; SOA rows must be distinct by active SOA | Non-SOA CAD 43.00/hour | Training may be full-time or part-time, online, in person, or hybrid | Description must show class type, delivery mode, format, language, hours, and whether the source is non-SOA or a named SOA |
| Second language training - group | Non-SOA confirmed; SOA rows must be distinct by active SOA when applicable | Non-SOA CAD 45.00/hour | Training may be full-time or part-time, online, in person, or hybrid | Description must show group class type, delivery mode, format, language, learner count, and hours |
| Diagnostic assessment | Non-SOA | CAD 55.00 per candidate per selected competency | User may select Reading, Writing, Oral, or any combination of one, two, or three competencies | Description must explicitly list the selected competencies |
| NMSO placement test | NMSO SOA | CAD 75.00 per candidate | Service requires all three competencies; one or more placement tests may be added to a language-training proposal | Description must state that the NMSO placement test includes Reading, Writing, and Oral |
| OSO Stream 4 | OSO SOA | CAD 40.00/hour | Full-time individual virtual training in English or French for fiscal years 2024/25 through 2028/29 | Description must show OSO Stream 4, language, full-time individual virtual training, hours, and fiscal year rate |
| OSO Stream 5 | OSO SOA | CAD 40.00/hour | Part-time virtual individual training in English or French for fiscal years 2024/25 through 2028/29 | Description must show OSO Stream 5, language, part-time virtual individual training, hours, and fiscal year rate |
| OSO Stream 6 | OSO SOA | CAD 40.00/hour | Part-time individual training in English or French in a federal institution for fiscal years 2024/25 through 2028/29 | Description must show OSO Stream 6, language, part-time individual training in a federal institution, hours, and fiscal year rate |
| OSO Stream 8 | OSO SOA | CAD 75.00/candidate | Placement tests for language learning for fiscal years 2024/25 through 2028/29 | Description must show OSO Stream 8, placement tests for language learning, candidate count, and fiscal year rate |
| CCC group training | CCC SOA 106974.136 | CAD 46.00/hour | Group training for 2 to 15 participants | Description must show CCC SOA source, group training, participant count, delivery mode, and hours |
| CCC semi-private training | CCC SOA 106974.136 | CAD 44.00/hour | One semi-private training up to 2 participants | Description must show CCC SOA source, semi-private training, participant count, delivery mode, and hours |
| CCC private training | CCC SOA 106974.136 | CAD 42.00/hour | One private training | Description must show CCC SOA source, private training, delivery mode, and hours |
| CCC reading assessment | CCC SOA | CAD 75.00 per candidate | Reading assessment | Description must explicitly list Reading assessment and CCC SOA source |
| CCC writing assessment | CCC SOA | CAD 75.00 per candidate | Writing assessment | Description must explicitly list Writing assessment and CCC SOA source |
| CCC oral assessment | CCC SOA | CAD 75.00 per candidate | Oral assessment | Description must explicitly list Oral assessment and CCC SOA source |

Applicability rule:

- The applicable rate is validated later, when the real acceptance date or contract-received date is entered during a status change. It is not based on the draft creation date and should not use an expected acceptance date captured during proposal creation.
- Group service lines start at 2 participants.
- No general maximum participant count applies outside a source-specific rule; CCC group training is explicitly capped at 15 participants.
- `NMSO placement test` is reserved for NMSO SOA rows. Other SOA placement, diagnostic, assessment, or evaluation lines use source-appropriate generic labels such as `Placement test` or `Assessment / evaluation / placement`.
- Proposal service type choices are dictated by the selected Price Book source. If a selected SOA has no placement, diagnostic, assessment, or evaluation line, the editor should show only `Second language training` for that SOA.

Open mapping questions:

- Replace any remaining generic SOA wording with distinct lines per active SOA, while keeping source-specific participant constraints only where the source states them.
- Confirm exact OSO effective date boundaries for each fiscal year before date-based automatic rate selection.

## Active SOA Sources

Active SOA sources are stored separately from price lines in `data/price-book/active_standing_offers.csv`.

In the application UI, this table is the contract/source register. Selecting an SOA source drills into the unified `Price lines` view and shows only the selectable or reviewable lines attached to that SOA.

The Ezsked source contained 7 active SOA offers on 2026-06-22:

- `100018367.0` - Employment and Social Development Canada;
- `20230676.0` - Financial Consumer Agency of Canada;
- `2L165-21-0335` - Communications Security Establishment;
- `37132-23-0001` - Public Safety and Emergency Preparedness Canada / PEPSI;
- `4600002737.0` - Indigenous Services Canada;
- `CW2379765` - National Master Standing Offer / NMSO, confirmed by Kevin;
- `EN578-202723/006/ZF` - Online Standing Offer / OSO, confirmed by Kevin, with Stream 4, 5, 6, and 8 rates confirmed manually from Kevin's 2026-06-22 details.

CCC `106974.136` was added manually from Kevin's details. Its active dates are confirmed as 2026-01-20 to 2028-03-31.

## Unified Price Lines And Sanitized SOA Review

The prototype Price Book now shows the 25 distinct active SOA source-rate lines inside the main `Price lines` view instead of a separate `SOA rate review` tab. The unified list contains:

- confirmed working catalog rows such as non-SOA, CCC, NMSO, and OSO manual rows;
- extracted SOA source-rate rows confirmed by Kevin as usable in proposals.

The extracted SOA rows are usable proposal price lines:

- it shows the SOA number, agency, service, source selection, service basis, schedule, active dates, and proposal-selection notes;
- assessment and placement review rows use `Per candidate` as the service basis and `Not applicable` as the schedule;
- group rows start at 2 participants, and no maximum is assumed unless the source states one;
- it displays extracted rates for Kevin's local validation on this workstation;
- it keeps the source extraction trace in `private-data/price-book/active_contract_rates_2026-06-22.csv`.
