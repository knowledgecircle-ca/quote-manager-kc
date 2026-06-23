import {
  CLASS_TYPES,
  CLIENT_TYPES,
  CONTRACT_VEHICLE_TYPES,
  CURRENCIES,
  LEVEL_BANDS,
  PRICE_BOOK_COLUMNS,
  PRICE_BOOK_LANGUAGES,
  PRICE_SOURCES,
  RATE_STATUSES,
  RATE_TYPES,
  RATE_UNITS,
  RHYTHMS,
  SERVICE_TYPES,
  SOURCE_RECORD_TYPES,
  TRAINING_OBJECTIVES,
  type PriceBookColumn,
  type PriceBookEntry,
  type RawPriceBookRow,
} from "@/domain/price-book/priceBookTypes";

export interface PriceBookValidationIssue {
  rowNumber?: number;
  column?: PriceBookColumn;
  message: string;
}

export interface PriceBookValidationResult {
  entries: PriceBookEntry[];
  issues: PriceBookValidationIssue[];
}

const priceCodePattern = /^[A-Z0-9_-]+$/;
const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;
const decimalPattern = /^\d+(\.\d+)?$/;
const integerPattern = /^\d+$/;

export function parsePriceBookCsv(csvText: string): RawPriceBookRow[] {
  const records = parseCsvRecords(csvText);

  if (records.length === 0) {
    return [];
  }

  const [header, ...rows] = records;
  if (!hasExpectedHeader(header)) {
    throw new Error("Price Book CSV header does not match the expected schema.");
  }

  return rows
    .filter((row) => row.some((cell) => cell.trim() !== ""))
    .map((row) => toRawPriceBookRow(row));
}

export function validatePriceBookRows(rows: RawPriceBookRow[]): PriceBookValidationResult {
  const issues: PriceBookValidationIssue[] = [];
  const entries: PriceBookEntry[] = [];
  const seenPriceCodes = new Set<string>();

  rows.forEach((row, index) => {
    const rowNumber = index + 2;
    const rowIssues = validatePriceBookRow(row, rowNumber);
    const priceCode = row.price_code;

    if (seenPriceCodes.has(priceCode)) {
      rowIssues.push({
        rowNumber,
        column: "price_code",
        message: `Duplicate price_code '${priceCode}'.`,
      });
    }
    seenPriceCodes.add(priceCode);

    issues.push(...rowIssues);
    if (rowIssues.length === 0) {
      entries.push(row as PriceBookEntry);
    }
  });

  return { entries, issues };
}

export function validatePriceBookCsv(csvText: string): PriceBookValidationResult {
  return validatePriceBookRows(parsePriceBookCsv(csvText));
}

function validatePriceBookRow(row: RawPriceBookRow, rowNumber: number): PriceBookValidationIssue[] {
  const issues: PriceBookValidationIssue[] = [];

  requireValue(row, "price_code", rowNumber, issues);
  requireValue(row, "price_label", rowNumber, issues);
  requireValue(row, "client_type", rowNumber, issues);
  requireValue(row, "contract_vehicle_type", rowNumber, issues);
  requireValue(row, "service_type", rowNumber, issues);
  requireValue(row, "language", rowNumber, issues);
  requireValue(row, "class_type", rowNumber, issues);
  requireValue(row, "rhythm", rowNumber, issues);
  requireValue(row, "level_band", rowNumber, issues);
  requireValue(row, "training_objective", rowNumber, issues);
  requireValue(row, "rate_type", rowNumber, issues);
  requireValue(row, "rate_unit", rowNumber, issues);
  requireValue(row, "rate_status", rowNumber, issues);
  requireValue(row, "currency", rowNumber, issues);
  requireValue(row, "price_source", rowNumber, issues);
  requireValue(row, "source_record_type", rowNumber, issues);
  requireValue(row, "requires_manual_selection", rowNumber, issues);

  if (row.price_code && !priceCodePattern.test(row.price_code)) {
    issues.push({
      rowNumber,
      column: "price_code",
      message: "price_code must use uppercase letters, numbers, hyphens, or underscores only.",
    });
  }

  validateEnum(row, "client_type", CLIENT_TYPES, rowNumber, issues);
  validateEnum(row, "contract_vehicle_type", CONTRACT_VEHICLE_TYPES, rowNumber, issues);
  validateEnum(row, "service_type", SERVICE_TYPES, rowNumber, issues);
  validateEnum(row, "language", PRICE_BOOK_LANGUAGES, rowNumber, issues);
  validateEnum(row, "class_type", CLASS_TYPES, rowNumber, issues);
  validateEnum(row, "rhythm", RHYTHMS, rowNumber, issues);
  validateEnum(row, "level_band", LEVEL_BANDS, rowNumber, issues);
  validateEnum(row, "training_objective", TRAINING_OBJECTIVES, rowNumber, issues);
  validateEnum(row, "rate_type", RATE_TYPES, rowNumber, issues);
  validateEnum(row, "rate_unit", RATE_UNITS, rowNumber, issues);
  validateEnum(row, "rate_status", RATE_STATUSES, rowNumber, issues);
  validateEnum(row, "currency", CURRENCIES, rowNumber, issues);
  validateEnum(row, "price_source", PRICE_SOURCES, rowNumber, issues);
  validateEnum(row, "source_record_type", SOURCE_RECORD_TYPES, rowNumber, issues);

  if (row.requires_manual_selection !== "true" && row.requires_manual_selection !== "false") {
    issues.push({
      rowNumber,
      column: "requires_manual_selection",
      message: "requires_manual_selection must be true or false.",
    });
  }

  validateDate(row, "effective_from", rowNumber, issues);
  validateDate(row, "effective_to", rowNumber, issues);

  if (row.effective_from && row.effective_to && row.effective_from > row.effective_to) {
    issues.push({
      rowNumber,
      column: "effective_from",
      message: "effective_from must be on or before effective_to.",
    });
  }

  validateLearners(row, rowNumber, issues);
  validateRateAmount(row, rowNumber, issues);

  if (row.client_type === "SOA" && !row.soa_number) {
    issues.push({
      rowNumber,
      column: "soa_number",
      message: "SOA rows must include soa_number.",
    });
  }

  if (row.source_record_type !== "TEMPLATE" && !row.source_record_id) {
    issues.push({
      rowNumber,
      column: "source_record_id",
      message: "Extracted rows must include source_record_id.",
    });
  }

  return issues;
}

function parseCsvRecords(csvText: string): string[][] {
  const records: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let index = 0; index < csvText.length; index += 1) {
    const char = csvText[index];
    const nextChar = csvText[index + 1];

    if (char === "\"" && inQuotes && nextChar === "\"") {
      field += "\"";
      index += 1;
      continue;
    }

    if (char === "\"") {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      row.push(field);
      field = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && nextChar === "\n") {
        index += 1;
      }
      row.push(field);
      records.push(row);
      row = [];
      field = "";
      continue;
    }

    field += char;
  }

  if (field || row.length > 0) {
    row.push(field);
    records.push(row);
  }

  return records;
}

function hasExpectedHeader(header: string[]): boolean {
  return (
    header.length === PRICE_BOOK_COLUMNS.length &&
    PRICE_BOOK_COLUMNS.every((column, index) => header[index] === column)
  );
}

function toRawPriceBookRow(row: string[]): RawPriceBookRow {
  const output = Object.fromEntries(
    PRICE_BOOK_COLUMNS.map((column, index) => [column, row[index]?.trim() ?? ""]),
  );

  return output as RawPriceBookRow;
}

function requireValue(
  row: RawPriceBookRow,
  column: PriceBookColumn,
  rowNumber: number,
  issues: PriceBookValidationIssue[],
) {
  if (!row[column]) {
    issues.push({ rowNumber, column, message: `${column} is required.` });
  }
}

function validateEnum<const T extends readonly string[]>(
  row: RawPriceBookRow,
  column: PriceBookColumn,
  allowedValues: T,
  rowNumber: number,
  issues: PriceBookValidationIssue[],
) {
  const value = row[column];
  if (value && !allowedValues.includes(value)) {
    issues.push({
      rowNumber,
      column,
      message: `${column} has unsupported value '${value}'.`,
    });
  }
}

function validateDate(
  row: RawPriceBookRow,
  column: "effective_from" | "effective_to",
  rowNumber: number,
  issues: PriceBookValidationIssue[],
) {
  const value = row[column];
  if (value && !isoDatePattern.test(value)) {
    issues.push({ rowNumber, column, message: `${column} must use YYYY-MM-DD.` });
  }
}

function validateLearners(
  row: RawPriceBookRow,
  rowNumber: number,
  issues: PriceBookValidationIssue[],
) {
  for (const column of ["min_learners", "max_learners"] as const) {
    const value = row[column];
    if (value && !integerPattern.test(value)) {
      issues.push({ rowNumber, column, message: `${column} must be a whole number.` });
    }
  }

  if (
    row.min_learners &&
    row.max_learners &&
    integerPattern.test(row.min_learners) &&
    integerPattern.test(row.max_learners) &&
    Number(row.min_learners) > Number(row.max_learners)
  ) {
    issues.push({
      rowNumber,
      column: "min_learners",
      message: "min_learners must be less than or equal to max_learners.",
    });
  }
}

function validateRateAmount(
  row: RawPriceBookRow,
  rowNumber: number,
  issues: PriceBookValidationIssue[],
) {
  if (row.rate_status === "CONFIRMED") {
    if (!decimalPattern.test(row.rate_amount)) {
      issues.push({
        rowNumber,
        column: "rate_amount",
        message: "CONFIRMED rows must include a numeric rate_amount.",
      });
    }
    return;
  }

  if (row.rate_amount) {
    issues.push({
      rowNumber,
      column: "rate_amount",
      message: "rate_amount must be empty unless rate_status is CONFIRMED.",
    });
  }
}
