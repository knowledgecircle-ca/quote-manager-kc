import { PRICE_BOOK_COLUMNS } from "@/domain/price-book";
import { preparePriceBookImport } from "@/application/use-cases/price-book";

describe("preparePriceBookImport", () => {
  it("prepares an import preview for the public price book template", async () => {
    const csvText = await readFixture("../../../../data/price-book/price_book_template.csv");

    const preview = preparePriceBookImport({
      csvText,
      sourceName: "price_book_template.csv",
    });

    expect(preview.canImport).toBe(true);
    expect(preview.sourceName).toBe("price_book_template.csv");
    expect(preview.totalRows).toBe(14);
    expect(preview.validRows).toBe(14);
    expect(preview.issueCount).toBe(0);
    expect(preview.confirmedRows).toBe(14);
    expect(preview.manualSelectionRows).toBe(14);
    expect(preview.statusCounts.CONFIRMED).toBe(14);
    expect(preview.statusCounts.TO_CONFIRM ?? 0).toBe(0);
    expect(preview.entries.map((entry) => entry.price_code)).not.toEqual(
      expect.arrayContaining(["KC-SOA-LANG-IND", "KC-SOA-LANG-GROUP"]),
    );
  });

  it("blocks rows with amounts that are not confirmed", () => {
    const csvText = buildCsv([
      validRow({
        price_code: "PLACEHOLDER-WITH-AMOUNT",
        rate_status: "TO_CONFIRM",
        rate_amount: "99.00",
      }),
    ]);

    const preview = preparePriceBookImport({
      csvText,
      sourceName: "invalid-template.csv",
    });

    expect(preview.canImport).toBe(false);
    expect(preview.validRows).toBe(0);
    expect(preview.issues).toContainEqual(
      expect.objectContaining({
        column: "rate_amount",
        message: "rate_amount must be empty unless rate_status is CONFIRMED.",
      }),
    );
  });

  it("returns a blocked preview for malformed CSV headers", () => {
    const preview = preparePriceBookImport({
      csvText: "wrong,header\nvalue,value",
      sourceName: "bad.csv",
    });

    expect(preview.canImport).toBe(false);
    expect(preview.totalRows).toBe(0);
    expect(preview.validRows).toBe(0);
    expect(preview.issues).toContainEqual(
      expect.objectContaining({
        message: "Price Book CSV header does not match the expected schema.",
      }),
    );
  });

  it("counts confirmed rows separately without selecting a price", () => {
    const csvText = buildCsv([
      validRow({
        price_code: "SOA-CONFIRMED-1",
        rate_status: "CONFIRMED",
        rate_amount: "42.50",
      }),
      validRow({
        price_code: "SOA-CONFIRMED-2",
        rate_status: "CONFIRMED",
        rate_amount: "43.50",
      }),
    ]);

    const preview = preparePriceBookImport({
      csvText,
      sourceName: "confirmed.csv",
    });

    expect(preview.canImport).toBe(true);
    expect(preview.confirmedRows).toBe(2);
    expect(preview.statusCounts.CONFIRMED).toBe(2);
    expect(preview.entries.map((entry) => entry.price_code)).toEqual([
      "SOA-CONFIRMED-1",
      "SOA-CONFIRMED-2",
    ]);
  });
});

type TestRow = Record<(typeof PRICE_BOOK_COLUMNS)[number], string>;

function buildCsv(rows: TestRow[]): string {
  return [
    PRICE_BOOK_COLUMNS.join(","),
    ...rows.map((row) => PRICE_BOOK_COLUMNS.map((column) => row[column]).join(",")),
  ].join("\n");
}

function validRow(overrides: Partial<TestRow> = {}): TestRow {
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
