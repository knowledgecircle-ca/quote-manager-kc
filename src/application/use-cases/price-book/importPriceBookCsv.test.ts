import { importPriceBookCsv } from "@/application/use-cases/price-book";
import { PRICE_BOOK_COLUMNS } from "@/domain/price-book";
import { InMemoryPriceBookRepository } from "@/infrastructure/memory";

describe("importPriceBookCsv", () => {
  it("replaces repository entries when the CSV is valid", async () => {
    const repository = new InMemoryPriceBookRepository();
    const csvText = buildCsv([validRow("SOA-VALID-1"), validRow("SOA-VALID-2")]);

    const result = await importPriceBookCsv({
      repository,
      csvText,
      sourceName: "valid.csv",
    });

    expect(result.imported).toBe(true);
    expect(result.preview.canImport).toBe(true);
    await expect(repository.list()).resolves.toEqual([
      expect.objectContaining({ price_code: "SOA-VALID-1" }),
      expect.objectContaining({ price_code: "SOA-VALID-2" }),
    ]);
  });

  it("does not mutate repository entries when validation fails", async () => {
    const repository = new InMemoryPriceBookRepository([validEntry("EXISTING-PRICE")]);
    const csvText = buildCsv([
      {
        ...validRow("INVALID-PRICE"),
        rate_status: "TO_CONFIRM",
        rate_amount: "10.00",
      },
    ]);

    const result = await importPriceBookCsv({
      repository,
      csvText,
      sourceName: "invalid.csv",
    });

    expect(result.imported).toBe(false);
    expect(result.preview.canImport).toBe(false);
    await expect(repository.list()).resolves.toEqual([
      expect.objectContaining({ price_code: "EXISTING-PRICE" }),
    ]);
  });
});

type CsvRow = Record<(typeof PRICE_BOOK_COLUMNS)[number], string>;

function buildCsv(rows: CsvRow[]): string {
  return [
    PRICE_BOOK_COLUMNS.join(","),
    ...rows.map((row) => PRICE_BOOK_COLUMNS.map((column) => row[column]).join(",")),
  ].join("\n");
}

function validRow(priceCode: string): CsvRow {
  return {
    price_code: priceCode,
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
  };
}

function validEntry(priceCode: string) {
  return {
    ...validRow(priceCode),
  };
}
