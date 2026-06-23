import { InMemoryPriceBookRepository } from "@/infrastructure/memory";
import type { PriceBookEntry } from "@/domain/price-book";

describe("InMemoryPriceBookRepository", () => {
  it("lists initial entries without exposing internal array state", async () => {
    const repository = new InMemoryPriceBookRepository([entry("PRICE-1")]);

    const firstList = await repository.list();
    firstList.push(entry("PRICE-2"));

    await expect(repository.list()).resolves.toHaveLength(1);
  });

  it("replaces all entries", async () => {
    const repository = new InMemoryPriceBookRepository([entry("PRICE-1")]);

    await repository.replaceAll([entry("PRICE-2"), entry("PRICE-3")]);

    await expect(repository.list()).resolves.toEqual([
      expect.objectContaining({ price_code: "PRICE-2" }),
      expect.objectContaining({ price_code: "PRICE-3" }),
    ]);
  });

  it("clears entries", async () => {
    const repository = new InMemoryPriceBookRepository([entry("PRICE-1")]);

    await repository.clear();

    await expect(repository.list()).resolves.toEqual([]);
  });
});

function entry(priceCode: string): PriceBookEntry {
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
