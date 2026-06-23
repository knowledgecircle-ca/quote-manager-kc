# Price Book Audit - 2026-06-22

Reference date: 2026-06-22  
Timezone: America/Montreal

## Extraction Summary

Read-only audit source:

- `C:\Users\One\Documents\Ezsked-3.0-KC\sample_data\private\ezsked_shadow.sqlite`

Inspected implementation sources:

- `backend/ezsked_shadow/db.py`
- `backend/ezsked_shadow/soa_updates.py`
- `backend/ezsked_shadow/contract_updates.py`
- `backend/ezsked_shadow/queries.py`

Generated files:

- Public placeholder template: `data/price-book/price_book_template.csv`
- Private active extracted rates: `private-data/price-book/active_contract_rates_2026-06-22.csv`
- Private full extraction audit: `private-data/price-book/all_contract_rates_audit_2026-06-22.csv`

Private outputs are excluded from Git by `.gitignore` and must not be included in the Vite public bundle.

Summary counts:

| Metric | Count |
|---|---:|
| SOA offers inspected | 9 |
| Active SOA offers | 7 |
| Expired SOA offers | 2 |
| Future SOA offers | 0 |
| SOA rate rows inspected | 180 |
| Confirmed active SOA rate rows extracted privately | 25 |
| Contract program instance rate rows inspected | 4 |
| Active awarded contract rates included | 0 |
| Full private audit rows | 184 |
| Duplicate price codes | 0 |
| Validation errors | 0 |

## Active SOA Rates Included

25 active SOA rate rows were written to the private active rates CSV. Amounts are intentionally not repeated in this public document.

The application prototype exposes these 25 rows inside the unified `Price lines` view with status `CONFIRMED`. Kevin confirmed that all 25 extracted active SOA rows may be used in proposals.

For assessment and placement rows, the prototype displays the service basis as `Per candidate` and schedule as `Not applicable`, rather than treating those rows as course class type / rhythm combinations. For language-training rows, the current working unit is per hour.

The applicable rate is validated when the real acceptance date or contract-received date is entered during a status change. Draft creation date is not the rate applicability trigger, and proposal creation should not ask for an expected acceptance date.

Group rows start at 2 participants. There is no general maximum participant count unless a source explicitly states one; CCC group training is explicitly capped at 15 participants.

Selection rules:

- parent SOA `start_date <= 2026-06-22 <= end_date`;
- rate period active when explicit;
- parent SOA dates used only when the rate period is absent and the parent SOA applies clearly;
- numeric source amount present;
- one row per source rate id;
- proposal review must keep the automatically selected rate visible and auditable.

## Active Awarded Contract Rates Included

0 active awarded contract rates were promoted into the private active rates CSV.

Reason: the inspected contract program instance rows contained rate amounts, but did not prove all required conditions:

- awarded RFP source;
- executable contract source;
- Knowledge Circle as confirmed supplier;
- confirmed rate unit suitable for quoting.

Those rows are retained in the private full audit CSV as `AMBIGUOUS`.

## Missing or Ambiguous Rates

Private audit status counts:

| rate_status | Count |
|---|---:|
| CONFIRMED | 25 |
| MISSING | 2 |
| AMBIGUOUS | 4 |
| EXPIRED | 119 |
| FUTURE | 34 |

Ambiguity drivers:

- language not explicit in some SOA rate labels;
- class type not explicit in some SOA language-training rate labels;
- rhythm not explicit or mixed in some SOA language-training rate labels;
- contract program rates lack explicit awarded RFP / KC supplier evidence;
- source rate unit is not reliably present for historical audit rows, but Kevin has approved the 25 active rows for proposal use.

## Duplicate Rates

No duplicate `price_code` values were found in either generated private CSV.

This does not mean no business-level duplicate exists. Compatible rates must remain visible and auditable until Knowledge Circle defines final precedence rules.

## Expired Rates

119 private audit rows are marked `EXPIRED`.

Expired rows remain in the private audit CSV for traceability only. They must not be used as active quote rates.

## Future Rates

34 private audit rows are marked `FUTURE`.

Future rows remain in the private audit CSV for traceability only. The future quote engine must use a Knowledge Circle approved applicability date, not necessarily the extraction reference date.

## Unmapped Fields

The following fields require Knowledge Circle confirmation before automated quoting:

- `rate_type` for SOA catalog rates
- `training_objective`
- language for rate labels that do not explicitly say French or English
- class type for language-training labels that do not explicitly say Individual or Group
- rhythm for language-training labels that do not explicitly say Full-time or Part-time
- source-specific maximum learner counts where a source explicitly states a cap
- cancellation-policy precedence when multiple policies appear applicable

## Validation Results

Automated validation completed with 0 errors.

Checks performed:

- unique `price_code`;
- `YYYY-MM-DD` dates;
- `effective_from <= effective_to`;
- numeric `rate_amount` for confirmed rows;
- numeric `rate_amount` when present;
- `min_learners <= max_learners` when both are present;
- `currency = CAD`;
- SOA rows include `soa_number`;
- extracted rows include `source_record_id`;
- private files are under `private-data/`, which is ignored by Git.

## Decisions Required from Knowledge Circle

- Confirm remaining non-price business rules for the official KC default price book.
- Confirm if contract program rates can ever be used for quote pricing, and what evidence marks an awarded RFP executable.
- Confirm whether Semi-private exists as a separate confirmed category outside CCC.
- Confirm cancellation-policy precedence when SOA, contract, and custom terms conflict.
- Confirm whether public template rows should remain in Git or move to an admin-managed default seed later.
