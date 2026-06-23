import type { PriceBookRepository } from "@/application/ports";
import {
  preparePriceBookImport,
  type PreparePriceBookImportInput,
  type PriceBookImportPreview,
} from "@/application/use-cases/price-book/preparePriceBookImport";

export interface ImportPriceBookCsvInput extends PreparePriceBookImportInput {
  repository: PriceBookRepository;
}

export interface ImportPriceBookCsvResult {
  imported: boolean;
  preview: PriceBookImportPreview;
}

export async function importPriceBookCsv(
  input: ImportPriceBookCsvInput,
): Promise<ImportPriceBookCsvResult> {
  const preview = preparePriceBookImport({
    csvText: input.csvText,
    sourceName: input.sourceName,
  });

  if (!preview.canImport) {
    return {
      imported: false,
      preview,
    };
  }

  await input.repository.replaceAll(preview.entries);

  return {
    imported: true,
    preview,
  };
}
