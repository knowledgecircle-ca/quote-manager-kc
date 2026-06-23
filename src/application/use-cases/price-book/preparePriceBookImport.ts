import {
  parsePriceBookCsv,
  validatePriceBookRows,
  type PriceBookEntry,
  type PriceBookValidationIssue,
  type RateStatus,
} from "@/domain/price-book";

export interface PreparePriceBookImportInput {
  csvText: string;
  sourceName: string;
}

export interface PriceBookImportStatusCounts {
  CONFIRMED: number;
  TO_CONFIRM: number;
  AMBIGUOUS: number;
  MISSING: number;
  EXPIRED: number;
  FUTURE: number;
}

export interface PriceBookImportPreview {
  sourceName: string;
  canImport: boolean;
  totalRows: number;
  validRows: number;
  issueCount: number;
  confirmedRows: number;
  manualSelectionRows: number;
  statusCounts: PriceBookImportStatusCounts;
  issues: PriceBookValidationIssue[];
  entries: PriceBookEntry[];
}

export function preparePriceBookImport(
  input: PreparePriceBookImportInput,
): PriceBookImportPreview {
  let parsedRows: ReturnType<typeof parsePriceBookCsv>;

  try {
    parsedRows = parsePriceBookCsv(input.csvText);
  } catch (error) {
    return emptyPreview(input.sourceName, [
      {
        message: error instanceof Error ? error.message : "Price Book CSV could not be parsed.",
      },
    ]);
  }

  const validation = validatePriceBookRows(parsedRows);
  const statusCounts = countStatuses(validation.entries);

  return {
    sourceName: input.sourceName,
    canImport: validation.issues.length === 0,
    totalRows: parsedRows.length,
    validRows: validation.entries.length,
    issueCount: validation.issues.length,
    confirmedRows: statusCounts.CONFIRMED,
    manualSelectionRows: validation.entries.filter(
      (entry) => entry.requires_manual_selection === "true",
    ).length,
    statusCounts,
    issues: validation.issues,
    entries: validation.entries,
  };
}

function emptyPreview(
  sourceName: string,
  issues: PriceBookValidationIssue[],
): PriceBookImportPreview {
  return {
    sourceName,
    canImport: false,
    totalRows: 0,
    validRows: 0,
    issueCount: issues.length,
    confirmedRows: 0,
    manualSelectionRows: 0,
    statusCounts: {
      CONFIRMED: 0,
      TO_CONFIRM: 0,
      AMBIGUOUS: 0,
      MISSING: 0,
      EXPIRED: 0,
      FUTURE: 0,
    },
    issues,
    entries: [],
  };
}

function countStatuses(entries: PriceBookEntry[]): PriceBookImportStatusCounts {
  const counts: PriceBookImportStatusCounts = {
    CONFIRMED: 0,
    TO_CONFIRM: 0,
    AMBIGUOUS: 0,
    MISSING: 0,
    EXPIRED: 0,
    FUTURE: 0,
  };

  for (const entry of entries) {
    counts[entry.rate_status as RateStatus] += 1;
  }

  return counts;
}
