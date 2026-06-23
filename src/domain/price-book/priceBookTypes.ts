export const PRICE_BOOK_COLUMNS = [
  "price_code",
  "price_label",
  "client_type",
  "contract_vehicle_type",
  "soa_number",
  "agency_name",
  "service_type",
  "language",
  "class_type",
  "rhythm",
  "min_learners",
  "max_learners",
  "level_band",
  "training_objective",
  "rate_type",
  "rate_unit",
  "rate_amount",
  "rate_status",
  "currency",
  "effective_from",
  "effective_to",
  "cancellation_policy",
  "price_source",
  "source_record_type",
  "source_record_id",
  "source_rate_id",
  "requires_manual_selection",
  "quote_rule",
  "internal_notes",
] as const;

export type PriceBookColumn = (typeof PRICE_BOOK_COLUMNS)[number];

export const CLIENT_TYPES = [
  "SOA",
  "Government non-SOA",
  "Corporate",
  "Private",
  "Non-SOA",
] as const;

export type ClientType = (typeof CLIENT_TYPES)[number];

export const CONTRACT_VEHICLE_TYPES = [
  "SOA",
  "AWARDED_RFP",
  "OTHER_CONTRACT",
  "NONE",
  "TO_CONFIRM",
] as const;

export type ContractVehicleType = (typeof CONTRACT_VEHICLE_TYPES)[number];

export const SERVICE_TYPES = [
  "Second language training",
  "SLE preparation",
  "Oral proficiency coaching",
  "Written expression coaching",
  "Reading comprehension coaching",
  "Full program",
  "Assessment / placement",
  "Assessment / evaluation / placement",
  "Diagnostic assessment",
  "Placement test",
  "NMSO placement test",
  "CCC assessment",
  "Custom training",
] as const;

export type ServiceType = (typeof SERVICE_TYPES)[number];

export const PRICE_BOOK_LANGUAGES = [
  "French",
  "English",
  "Bilingual / Mixed",
  "TO_CONFIRM",
] as const;

export type PriceBookLanguage = (typeof PRICE_BOOK_LANGUAGES)[number];

export const CLASS_TYPES = [
  "Individual",
  "Semi-private",
  "Group",
  "Workshop",
  "Per candidate",
  "TO_CONFIRM",
] as const;

export type ClassType = (typeof CLASS_TYPES)[number];

export const RHYTHMS = [
  "Full-time",
  "Part-time",
  "AM",
  "PM",
  "AM/PM",
  "Custom",
  "Not applicable",
  "TO_CONFIRM",
] as const;

export type Rhythm = (typeof RHYTHMS)[number];

export const LEVEL_BANDS = [
  "A",
  "B",
  "C",
  "A1",
  "A2",
  "A3",
  "B1",
  "B2",
  "B3",
  "C1",
  "C2",
  "C3",
  "SLE Prep",
  "ALL_LEVELS",
  "TBD",
] as const;

export type LevelBand = (typeof LEVEL_BANDS)[number];

export const TRAINING_OBJECTIVES = [
  "Target B",
  "Target C",
  "Maintain level",
  "SLE oral preparation",
  "SLE written preparation",
  "SLE reading preparation",
  "Professional communication",
  "Custom",
  "TO_CONFIRM",
] as const;

export type TrainingObjective = (typeof TRAINING_OBJECTIVES)[number];

export const RATE_TYPES = ["HOURLY", "FIXED", "PACKAGE", "TO_CONFIRM"] as const;

export type RateType = (typeof RATE_TYPES)[number];

export const RATE_UNITS = [
  "PER_INSTRUCTOR_HOUR",
  "PER_TRAINING_HOUR",
  "PER_LEARNER_HOUR",
  "PER_GROUP_HOUR",
  "PER_LEARNER",
  "PER_ASSESSMENT",
  "PER_COMPETENCY",
  "PER_PACKAGE",
  "TO_CONFIRM",
] as const;

export type RateUnit = (typeof RATE_UNITS)[number];

export const RATE_STATUSES = [
  "CONFIRMED",
  "TO_CONFIRM",
  "AMBIGUOUS",
  "MISSING",
  "EXPIRED",
  "FUTURE",
] as const;

export type RateStatus = (typeof RATE_STATUSES)[number];

export const CURRENCIES = ["CAD"] as const;

export type Currency = (typeof CURRENCIES)[number];

export const PRICE_SOURCES = [
  "KC Default",
  "KC Confirmed Working Catalog",
  "SOA Catalog",
  "NMSO SOA",
  "CCC SOA",
  "OSO SOA",
  "Awarded Contract",
  "Manual Override",
  "Placeholder",
] as const;

export type PriceSource = (typeof PRICE_SOURCES)[number];

export const SOURCE_RECORD_TYPES = [
  "TEMPLATE",
  "SOA_RATE",
  "CONTRACT_PROGRAM_INSTANCE",
] as const;

export type SourceRecordType = (typeof SOURCE_RECORD_TYPES)[number];

export interface PriceBookEntry {
  price_code: string;
  price_label: string;
  client_type: ClientType;
  contract_vehicle_type: ContractVehicleType;
  soa_number: string;
  agency_name: string;
  service_type: ServiceType;
  language: PriceBookLanguage;
  class_type: ClassType;
  rhythm: Rhythm;
  min_learners: string;
  max_learners: string;
  level_band: LevelBand;
  training_objective: TrainingObjective;
  rate_type: RateType;
  rate_unit: RateUnit;
  rate_amount: string;
  rate_status: RateStatus;
  currency: Currency;
  effective_from: string;
  effective_to: string;
  cancellation_policy: string;
  price_source: PriceSource;
  source_record_type: SourceRecordType;
  source_record_id: string;
  source_rate_id: string;
  requires_manual_selection: "true" | "false";
  quote_rule: string;
  internal_notes: string;
}

export type RawPriceBookRow = Record<PriceBookColumn, string>;
