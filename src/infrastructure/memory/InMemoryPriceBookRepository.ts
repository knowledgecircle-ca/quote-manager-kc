import type { PriceBookRepository } from "@/application/ports";
import type { PriceBookEntry } from "@/domain/price-book";

export class InMemoryPriceBookRepository implements PriceBookRepository {
  private entries: PriceBookEntry[];

  constructor(initialEntries: PriceBookEntry[] = []) {
    this.entries = [...initialEntries];
  }

  async list(): Promise<PriceBookEntry[]> {
    return [...this.entries];
  }

  async replaceAll(entries: PriceBookEntry[]): Promise<void> {
    this.entries = [...entries];
  }

  async clear(): Promise<void> {
    this.entries = [];
  }
}
