import {
  PRICE_BOOK_COLUMNS,
  parsePriceBookCsv,
  validatePriceBookCsv,
  validatePriceBookRows,
  type RawPriceBookRow,
} from "@/domain/price-book";

describe("Price Book validation", () => {
  it("parses and validates a confirmed SOA row", () => {
    const csv = [
      PRICE_BOOK_COLUMNS.join(","),
      [
        "SOA-CW2379765-1",
        "Confirmed SOA rate",
        "SOA",
        "SOA",
        "CW2379765",
        "National Master Standing Offer",
        "Second language training",
        "French",
        "Individual",
        "Part-time",
        "1",
        "1",
        "B",
        "TO_CONFIRM",
        "HOURLY",
        "PER_INSTRUCTOR_HOUR",
        "42.50",
        "CONFIRMED",
        "CAD",
        "2026-01-01",
        "2026-12-31",
        "48 hours",
        "SOA Catalog",
        "SOA_RATE",
        "18",
        "1",
        "true",
        "Show every compatible SOA rate; do not auto-select",
        "Test fixture only",
      ].join(","),
    ].join("\n");

    const parsed = parsePriceBookCsv(csv);
    const result = validatePriceBookRows(parsed);

    expect(parsed).toHaveLength(1);
    expect(result.issues).toEqual([]);
    expect(result.entries).toHaveLength(1);
  });

  it("validates the public price book template", async () => {
    const template = await readFixture("../../../data/price-book/price_book_template.csv");
    const result = validatePriceBookCsv(template);

    expect(result.issues).toEqual([]);
    expect(result.entries).toHaveLength(14);
    expect(result.entries.map((entry) => entry.price_code)).not.toEqual(
      expect.arrayContaining(["KC-SOA-LANG-IND", "KC-SOA-LANG-GROUP"]),
    );
    expect(result.entries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          price_code: "KC-NONSOA-LANG-IND",
          rate_amount: "43.00",
          rate_unit: "PER_TRAINING_HOUR",
          rate_status: "CONFIRMED",
        }),
        expect.objectContaining({
          price_code: "KC-NONSOA-LANG-GROUP",
          min_learners: "2",
          max_learners: "",
          rate_amount: "45.00",
          rate_unit: "PER_TRAINING_HOUR",
        }),
        expect.objectContaining({
          price_code: "KC-DIAG-ASSESSMENT",
          class_type: "Per candidate",
          rhythm: "Not applicable",
          rate_amount: "55.00",
          rate_unit: "PER_COMPETENCY",
        }),
        expect.objectContaining({
          price_code: "KC-NMSO-PLACEMENT",
          soa_number: "CW2379765",
          class_type: "Per candidate",
          rhythm: "Not applicable",
          rate_amount: "75.00",
          rate_unit: "PER_LEARNER",
          service_type: "NMSO placement test",
        }),
        expect.objectContaining({
          price_code: "KC-CCC-LANG-GROUP",
          soa_number: "106974.136",
          min_learners: "2",
          max_learners: "15",
          rate_amount: "46.00",
          rate_unit: "PER_TRAINING_HOUR",
          cancellation_policy: "48 business hours",
        }),
        expect.objectContaining({
          price_code: "KC-CCC-ASSESS-ORAL",
          soa_number: "106974.136",
          class_type: "Per candidate",
          rhythm: "Not applicable",
          rate_amount: "75.00",
          rate_unit: "PER_COMPETENCY",
          cancellation_policy: "48 business hours",
        }),
        expect.objectContaining({
          price_code: "KC-OSO-STREAM-4",
          rate_amount: "40.00",
          rate_unit: "PER_TRAINING_HOUR",
          price_source: "OSO SOA",
        }),
        expect.objectContaining({
          price_code: "KC-OSO-STREAM-8",
          class_type: "Per candidate",
          rhythm: "Not applicable",
          rate_amount: "75.00",
          rate_unit: "PER_LEARNER",
          price_source: "OSO SOA",
        }),
      ]),
    );
  });

  it("rejects duplicate price codes", () => {
    const first = validRow({ price_code: "DUPLICATE-CODE" });
    const second = validRow({ price_code: "DUPLICATE-CODE" });

    const result = validatePriceBookRows([first, second]);

    expect(result.issues).toContainEqual(
      expect.objectContaining({
        column: "price_code",
        message: "Duplicate price_code 'DUPLICATE-CODE'.",
      }),
    );
  });

  it("requires numeric rate_amount for confirmed rows", () => {
    const result = validatePriceBookRows([
      validRow({ rate_status: "CONFIRMED", rate_amount: "" }),
    ]);

    expect(result.issues).toContainEqual(
      expect.objectContaining({
        column: "rate_amount",
        message: "CONFIRMED rows must include a numeric rate_amount.",
      }),
    );
  });

  it("requires blank rate_amount for non-confirmed rows", () => {
    const result = validatePriceBookRows([
      validRow({ rate_status: "TO_CONFIRM", rate_amount: "42.50" }),
    ]);

    expect(result.issues).toContainEqual(
      expect.objectContaining({
        column: "rate_amount",
        message: "rate_amount must be empty unless rate_status is CONFIRMED.",
      }),
    );
  });

  it("rejects invalid dates and reversed date ranges", () => {
    const result = validatePriceBookRows([
      validRow({ effective_from: "2026-12-31", effective_to: "2026-01-01" }),
      validRow({ price_code: "INVALID-DATE", effective_from: "06/22/2026" }),
    ]);

    expect(result.issues).toContainEqual(
      expect.objectContaining({
        column: "effective_from",
        message: "effective_from must be on or before effective_to.",
      }),
    );
    expect(result.issues).toContainEqual(
      expect.objectContaining({
        column: "effective_from",
        message: "effective_from must use YYYY-MM-DD.",
      }),
    );
  });

  it("requires SOA rows to include a SOA number", () => {
    const result = validatePriceBookRows([validRow({ soa_number: "" })]);

    expect(result.issues).toContainEqual(
      expect.objectContaining({
        column: "soa_number",
        message: "SOA rows must include soa_number.",
      }),
    );
  });

  it("requires extracted rows to include a source record id", () => {
    const result = validatePriceBookRows([validRow({ source_record_id: "" })]);

    expect(result.issues).toContainEqual(
      expect.objectContaining({
        column: "source_record_id",
        message: "Extracted rows must include source_record_id.",
      }),
    );
  });
});

function validRow(overrides: Partial<RawPriceBookRow> = {}): RawPriceBookRow {
  return {
    price_code: "SOA-CW2379765-1",
    price_label: "Confirmed SOA rate",
    client_type: "SOA",
    contract_vehicle_type: "SOA",
    soa_number: "CW2379765",
    agency_name: "National Master Standing Offer",
    service_type: "Second language training",
    language: "French",
    class_type: "Individual",
    rhythm: "Part-time",
    min_learners: "1",
    max_learners: "1",
    level_band: "B",
    training_objective: "TO_CONFIRM",
    rate_type: "HOURLY",
    rate_unit: "PER_INSTRUCTOR_HOUR",
    rate_amount: "42.50",
    rate_status: "CONFIRMED",
    currency: "CAD",
    effective_from: "2026-01-01",
    effective_to: "2026-12-31",
    cancellation_policy: "48 hours",
    price_source: "SOA Catalog",
    source_record_type: "SOA_RATE",
    source_record_id: "18",
    source_rate_id: "1",
    requires_manual_selection: "true",
    quote_rule: "Show every compatible SOA rate; do not auto-select",
    internal_notes: "Test fixture only",
    ...overrides,
  };
}

async function readFixture(relativePath: string): Promise<string> {
  const { readFile } = await import("node:fs/promises");
  const { fileURLToPath } = await import("node:url");
  const { dirname, resolve } = await import("node:path");
  const currentDirectory = dirname(fileURLToPath(import.meta.url));

  return readFile(resolve(currentDirectory, relativePath), "utf-8");
}
