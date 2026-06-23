export type ProposalStatus =
  | "Draft"
  | "Approved internally"
  | "Sent"
  | "Viewed"
  | "Change requested"
  | "Revised"
  | "Accepted"
  | "Expired"
  | "Cancelled";

export type PriceStatus =
  | "CONFIRMED"
  | "TO_CONFIRM"
  | "AMBIGUOUS"
  | "MISSING"
  | "EXPIRED"
  | "FUTURE";

export interface DemoProposal {
  id: string;
  title: string;
  client: string;
  department: string;
  contact: string;
  objective: string;
  learners: number;
  language: "English" | "French";
  maximumAmount: string;
  status: ProposalStatus;
  revision: string;
  lastUpdated: string;
  pricingStatus: string;
  nextDecision: string;
}

export interface DemoLearner {
  id: string;
  name: string;
  targetLanguage: "English" | "French";
  notes: string;
}

export interface DemoTrainingPhase {
  id: string;
  title: string;
  selectedLearners: string;
  serviceType: string;
  language: "English" | "French";
  classType: string;
  rhythm: string;
  startDate: string;
  endDate: string;
  hoursPerDay: string;
  daysPerWeek: string;
  hoursPerWeek: string;
  totalProgramHours: string;
  objective: string;
  scheduleNotes: string;
}

export interface DemoLineItem {
  id: string;
  item: string;
  description: string;
  rateSource: string;
  rateType: string;
  rateUnit: string;
  rate: string;
  quantity: string;
  subtotal: string;
  status: PriceStatus;
}

export interface DemoPriceBookEntry {
  code: string;
  label: string;
  source: string;
  contractVehicle: string;
  service: string;
  selection: string;
  descriptionRule: string;
  classType: string;
  delivery: string;
  activeDates?: string;
  rate: string;
  unit: string;
  status: PriceStatus;
}

export interface DemoStandingOffer {
  code: string;
  standingOfferNumber: string;
  displayName: string;
  agency: string;
  source: "Ezsked" | "Manual";
  startDate: string;
  endDate: string;
  cancellationPolicy: string;
  services: string;
  activeRateRows: string;
  status: "Active";
  notes: string;
}

export interface DemoSoaRateReviewEntry {
  code: string;
  standingOfferNumber: string;
  agency: string;
  service: string;
  sourceSelection: string;
  classType: string;
  rhythm: string;
  activeDates: string;
  rateVisibility: string;
  reviewNote: string;
}

export interface TemplateCardData {
  id: string;
  title: string;
  status: string;
  content: string;
  source?: string;
  reviewState?: "Generated" | "Template applied" | "Needs review" | "Optional" | "Required";
  appliesWhen?: string;
}

export const proposalStatuses: ProposalStatus[] = [
  "Draft",
  "Approved internally",
  "Sent",
  "Viewed",
  "Change requested",
  "Revised",
  "Accepted",
  "Expired",
  "Cancelled",
];

export const demoProposals: DemoProposal[] = [
  {
    id: "DEMO-001",
    title: "French training proposal",
    client: "DEMO Federal Department",
    department: "Learning and development",
    contact: "Program Coordinator",
    objective: "Second language training for a French group cohort.",
    learners: 3,
    language: "English",
    maximumAmount: "Rate to confirm",
    status: "Draft",
    revision: "v1",
    lastUpdated: "2026-06-22",
    pricingStatus: "Rate to confirm",
    nextDecision: "Choose a valid price source before internal approval.",
  },
  {
    id: "DEMO-002",
    title: "Bilingual group training",
    client: "DEMO Crown Corporation",
    department: "People operations",
    contact: "Learning Manager",
    objective: "Bilingual group training plan awaiting final content review.",
    learners: 8,
    language: "French",
    maximumAmount: "Not priced",
    status: "Approved internally",
    revision: "v2",
    lastUpdated: "2026-06-20",
    pricingStatus: "Not priced",
    nextDecision: "Preview content and confirm administrative sections.",
  },
  {
    id: "DEMO-003",
    title: "SOA scenario review",
    client: "DEMO Government Agency",
    department: "Training authority",
    contact: "Contract Authority",
    objective: "SOA-compatible training scenario requiring automatic rate review.",
    learners: 1,
    language: "English",
    maximumAmount: "Rate to confirm",
    status: "Change requested",
    revision: "v1",
    lastUpdated: "2026-06-18",
    pricingStatus: "Ambiguous rate",
    nextDecision: "Review the automatically selected compatible SOA line.",
  },
];

export const demoLearners: DemoLearner[] = [
  {
    id: "learner-1",
    name: "DEMO Learner 1",
    targetLanguage: "French",
    notes: "Learner details to be confirmed before approval.",
  },
  {
    id: "learner-2",
    name: "DEMO Learner 2",
    targetLanguage: "French",
    notes: "Schedule availability not final.",
  },
];

export const demoTrainingPhases: DemoTrainingPhase[] = [
  {
    id: "phase-1",
    title: "Phase 1 - Foundation",
    selectedLearners: "DEMO Learner 1, DEMO Learner 2",
    serviceType: "Second language training",
    language: "French",
    classType: "Group",
    rhythm: "6 hours/day",
    startDate: "2026-07-06",
    endDate: "2026-08-14",
    hoursPerDay: "6",
    daysPerWeek: "5",
    hoursPerWeek: "30",
    totalProgramHours: "180",
    objective: "Build operational workplace communication.",
    scheduleNotes: "Dates and rhythm are display-only in this prototype.",
  },
];

export const demoLineItems: DemoLineItem[] = [
  {
    id: "line-1",
    item: "Training phase",
    description: "Second language training, group format",
    rateSource: "Price Book",
    rateType: "TO_CONFIRM",
    rateUnit: "TO_CONFIRM",
    rate: "Rate to confirm",
    quantity: "180 hours",
    subtotal: "Rate to confirm",
    status: "TO_CONFIRM",
  },
  {
    id: "line-2",
    item: "Demo confirmed example",
    description: "Masked amount for interface validation only",
    rateSource: "DEMO",
    rateType: "Hourly",
    rateUnit: "Instructor hour",
    rate: "Rate to confirm",
    quantity: "1",
    subtotal: "Rate to confirm",
    status: "TO_CONFIRM",
  },
  {
    id: "line-3",
    item: "SOA compatible option",
    description: "Automatic Price Book rate pending service details",
    rateSource: "SOA Catalog",
    rateType: "Ambiguous",
    rateUnit: "TO_CONFIRM",
    rate: "Rate to confirm",
    quantity: "To confirm",
    subtotal: "Rate to confirm",
    status: "AMBIGUOUS",
  },
];

export const demoPriceBookEntries: DemoPriceBookEntry[] = [
  {
    code: "KC-NONSOA-LANG-IND",
    label: "Language training - individual",
    source: "KC confirmed working catalog",
    contractVehicle: "Non-SOA",
    service: "Second language training",
    selection: "English or French / full-time or part-time",
    descriptionRule: "Show language, individual class, delivery mode, format, hours, and non-SOA source.",
    classType: "Individual",
    delivery: "MS Teams / in person / hybrid",
    activeDates: "N/A",
    rate: "CAD 43.00",
    unit: "Per hour",
    status: "CONFIRMED",
  },
  {
    code: "KC-NONSOA-LANG-GROUP",
    label: "Language training - group",
    source: "KC confirmed working catalog",
    contractVehicle: "Non-SOA",
    service: "Second language training",
    selection: "English or French / full-time or part-time",
    descriptionRule: "Show language, group class, learner count, delivery mode, format, hours, and non-SOA source. Group starts at 2 participants; no general maximum applies.",
    classType: "Group",
    delivery: "MS Teams / in person / hybrid",
    activeDates: "N/A",
    rate: "CAD 45.00",
    unit: "Per hour",
    status: "CONFIRMED",
  },
  {
    code: "KC-DIAG-ASSESSMENT",
    label: "Diagnostic assessment",
    source: "KC confirmed working catalog",
    contractVehicle: "Non-SOA",
    service: "Diagnostic assessment",
    selection: "Choose Reading, Writing, Oral, or any combination",
    descriptionRule: "Description must explicitly list each selected competency.",
    classType: "Per candidate",
    delivery: "Assessment delivery to confirm",
    activeDates: "N/A",
    rate: "CAD 55.00",
    unit: "Per selected competency",
    status: "CONFIRMED",
  },
  {
    code: "KC-NMSO-PLACEMENT",
    label: "NMSO placement test",
    source: "NMSO SOA",
    contractVehicle: "NMSO SOA",
    service: "NMSO placement test",
    selection: "Requires Reading, Writing, and Oral",
    descriptionRule: "Description must state that all three competencies are included and may be added to training.",
    classType: "Per candidate",
    delivery: "Placement delivery to confirm",
    activeDates: "2024-11-01 to 2029-11-01",
    rate: "CAD 75.00",
    unit: "Per candidate",
    status: "CONFIRMED",
  },
  {
    code: "KC-CCC-LANG-GROUP",
    label: "CCC group training",
    source: "CCC SOA",
    contractVehicle: "CCC SOA",
    service: "Second language training",
    selection: "2 to 15 participants",
    descriptionRule: "Description must show CCC SOA source, group training, participant count, delivery mode, and hours.",
    classType: "Group",
    delivery: "To confirm",
    activeDates: "2026-01-20 to 2028-03-31",
    rate: "CAD 46.00",
    unit: "Per hour",
    status: "CONFIRMED",
  },
  {
    code: "KC-CCC-LANG-SEMI-PRIVATE",
    label: "CCC semi-private training",
    source: "CCC SOA",
    contractVehicle: "CCC SOA",
    service: "Second language training",
    selection: "Up to 2 participants",
    descriptionRule: "Description must show CCC SOA source, semi-private training, participant count, delivery mode, and hours.",
    classType: "Semi-private",
    delivery: "To confirm",
    activeDates: "2026-01-20 to 2028-03-31",
    rate: "CAD 44.00",
    unit: "Per hour",
    status: "CONFIRMED",
  },
  {
    code: "KC-CCC-LANG-PRIVATE",
    label: "CCC private training",
    source: "CCC SOA",
    contractVehicle: "CCC SOA",
    service: "Second language training",
    selection: "One participant",
    descriptionRule: "Description must show CCC SOA source, private training, delivery mode, and hours.",
    classType: "Individual",
    delivery: "To confirm",
    activeDates: "2026-01-20 to 2028-03-31",
    rate: "CAD 42.00",
    unit: "Per hour",
    status: "CONFIRMED",
  },
  {
    code: "KC-CCC-ASSESS-READING",
    label: "CCC reading assessment",
    source: "CCC SOA",
    contractVehicle: "CCC SOA",
    service: "CCC assessment",
    selection: "Reading",
    descriptionRule: "Description must explicitly list Reading assessment and CCC SOA source.",
    classType: "Per candidate",
    delivery: "Assessment delivery to confirm",
    activeDates: "2026-01-20 to 2028-03-31",
    rate: "CAD 75.00",
    unit: "Per selected competency",
    status: "CONFIRMED",
  },
  {
    code: "KC-CCC-ASSESS-WRITING",
    label: "CCC writing assessment",
    source: "CCC SOA",
    contractVehicle: "CCC SOA",
    service: "CCC assessment",
    selection: "Writing",
    descriptionRule: "Description must explicitly list Writing assessment and CCC SOA source.",
    classType: "Per candidate",
    delivery: "Assessment delivery to confirm",
    activeDates: "2026-01-20 to 2028-03-31",
    rate: "CAD 75.00",
    unit: "Per selected competency",
    status: "CONFIRMED",
  },
  {
    code: "KC-CCC-ASSESS-ORAL",
    label: "CCC oral assessment",
    source: "CCC SOA",
    contractVehicle: "CCC SOA",
    service: "CCC assessment",
    selection: "Oral",
    descriptionRule: "Description must explicitly list Oral assessment and CCC SOA source.",
    classType: "Per candidate",
    delivery: "Assessment delivery to confirm",
    activeDates: "2026-01-20 to 2028-03-31",
    rate: "CAD 75.00",
    unit: "Per selected competency",
    status: "CONFIRMED",
  },
  {
    code: "KC-OSO-STREAM-4",
    label: "OSO Stream 4 - full-time individual virtual",
    source: "OSO SOA",
    contractVehicle: "OSO SOA",
    service: "Second language training",
    selection: "English or French / full-time individual / virtual",
    descriptionRule: "Description must show OSO Stream 4, language, full-time individual virtual training, hours, and fiscal year rate.",
    classType: "Individual",
    delivery: "Virtual",
    activeDates: "2021-05-01 to 2026-07-03",
    rate: "CAD 40.00",
    unit: "Per hour",
    status: "CONFIRMED",
  },
  {
    code: "KC-OSO-STREAM-5",
    label: "OSO Stream 5 - part-time virtual individual",
    source: "OSO SOA",
    contractVehicle: "OSO SOA",
    service: "Second language training",
    selection: "English or French / part-time individual / virtual",
    descriptionRule: "Description must show OSO Stream 5, language, part-time virtual individual training, hours, and fiscal year rate.",
    classType: "Individual",
    delivery: "Virtual",
    activeDates: "2021-05-01 to 2026-07-03",
    rate: "CAD 40.00",
    unit: "Per hour",
    status: "CONFIRMED",
  },
  {
    code: "KC-OSO-STREAM-6",
    label: "OSO Stream 6 - part-time individual federal institution",
    source: "OSO SOA",
    contractVehicle: "OSO SOA",
    service: "Second language training",
    selection: "English or French / part-time individual / federal institution",
    descriptionRule: "Description must show OSO Stream 6, language, part-time individual training in a federal institution, hours, and fiscal year rate.",
    classType: "Individual",
    delivery: "Federal institution",
    activeDates: "2021-05-01 to 2026-07-03",
    rate: "CAD 40.00",
    unit: "Per hour",
    status: "CONFIRMED",
  },
  {
    code: "KC-OSO-STREAM-8",
    label: "OSO Stream 8 - placement tests",
    source: "OSO SOA",
    contractVehicle: "OSO SOA",
    service: "Placement test",
    selection: "Placement tests for language learning",
    descriptionRule: "Description must show OSO Stream 8, placement tests for language learning, candidate count, and fiscal year rate.",
    classType: "Per candidate",
    delivery: "Placement delivery to confirm",
    activeDates: "2021-05-01 to 2026-07-03",
    rate: "CAD 75.00",
    unit: "Per candidate",
    status: "CONFIRMED",
  },
];

export const demoStandingOffers: DemoStandingOffer[] = [
  {
    code: "SOA-100018367",
    standingOfferNumber: "100018367.0",
    displayName: "Employment and Social Development Canada SOA",
    agency: "Employment and Social Development Canada",
    source: "Ezsked",
    startDate: "2022-11-01",
    endDate: "2027-11-01",
    cancellationPolicy: "48 hours",
    services: "Full-time and part-time training; assessment; group and individual",
    activeRateRows: "6",
    status: "Active",
    notes: "Extracted from Ezsked soa_offers on 2026-06-22.",
  },
  {
    code: "SOA-20230676",
    standingOfferNumber: "20230676.0",
    displayName: "Financial Consumer Agency of Canada SOA",
    agency: "Financial Consumer Agency of Canada",
    source: "Ezsked",
    startDate: "2023-09-01",
    endDate: "2026-08-01",
    cancellationPolicy: "48 hours",
    services: "Part-time group",
    activeRateRows: "3",
    status: "Active",
    notes: "Extracted from Ezsked soa_offers on 2026-06-22.",
  },
  {
    code: "SOA-2L165-21-0335",
    standingOfferNumber: "2L165-21-0335",
    displayName: "Communications Security Establishment SOA",
    agency: "Communications Security Establishment",
    source: "Ezsked",
    startDate: "2021-09-01",
    endDate: "2026-08-01",
    cancellationPolicy: "48 hours",
    services: "Assessment; evaluations; full-time and part-time group and individual",
    activeRateRows: "6",
    status: "Active",
    notes: "Extracted from Ezsked soa_offers on 2026-06-22.",
  },
  {
    code: "SOA-37132-23-0001",
    standingOfferNumber: "37132-23-0001",
    displayName: "PEPSI",
    agency: "Public Safety and Emergency Preparedness Canada",
    source: "Ezsked",
    startDate: "2023-04-01",
    endDate: "2028-03-01",
    cancellationPolicy: "24 hours",
    services: "Diagnostic assessments; second language evaluations; virtual or at PSEPC",
    activeRateRows: "4",
    status: "Active",
    notes: "Extracted from Ezsked soa_offers on 2026-06-22.",
  },
  {
    code: "SOA-4600002737",
    standingOfferNumber: "4600002737.0",
    displayName: "Indigenous Services Canada SOA",
    agency: "Indigenous Services Canada",
    source: "Ezsked",
    startDate: "2025-04-01",
    endDate: "2030-03-01",
    cancellationPolicy: "48 hours",
    services: "Full-time and part-time group and individual",
    activeRateRows: "4",
    status: "Active",
    notes: "Extracted from Ezsked soa_offers on 2026-06-22.",
  },
  {
    code: "SOA-CW2379765",
    standingOfferNumber: "CW2379765",
    displayName: "NMSO",
    agency: "National Master Standing Offer",
    source: "Ezsked",
    startDate: "2024-11-01",
    endDate: "2029-11-01",
    cancellationPolicy: "24 hours",
    services: "Virtual and in-person individual training; placement tests",
    activeRateRows: "4",
    status: "Active",
    notes: "Extracted from Ezsked soa_offers on 2026-06-22.",
  },
  {
    code: "SOA-EN578-202723-006-ZF",
    standingOfferNumber: "EN578-202723/006/ZF",
    displayName: "OSO",
    agency: "Online Standing Offer",
    source: "Ezsked",
    startDate: "2021-05-01",
    endDate: "2026-07-03",
    cancellationPolicy: "48 h",
    services: "Stream 4 full-time individual virtual; Stream 5 part-time virtual individual; Stream 6 part-time individual in a federal institution; Stream 8 placement tests",
    activeRateRows: "4 confirmed stream summaries",
    status: "Active",
    notes: "OSO stream rates confirmed by Kevin on 2026-06-22 for fiscal years 2024/25 through 2028/29.",
  },
  {
    code: "SOA-CCC",
    standingOfferNumber: "106974.136",
    displayName: "CCC",
    agency: "Canadian Commercial Corporation",
    source: "Manual",
    startDate: "2026-01-20",
    endDate: "2028-03-31",
    cancellationPolicy: "48 business hours",
    services: "Group, semi-private, private training; reading, writing, oral assessments",
    activeRateRows: "6",
    status: "Active",
    notes: "Added manually from Kevin's 2026-06-22 CCC details.",
  },
];

export const demoSoaRateReviewEntries: DemoSoaRateReviewEntry[] = [
  {
    code: "SOA-100018367_0-214",
    standingOfferNumber: "100018367.0",
    agency: "Employment and Social Development Canada",
    service: "Assessment / placement",
    sourceSelection: "Full-Time Assessment",
    classType: "Per candidate",
    rhythm: "Not applicable",
    activeDates: "2025-11-07 to 2026-11-06",
    rateVisibility: "Amount kept in private audit",
    reviewNote: "Rate applies per candidate; proposal wording must state the selected assessment or placement service.",
  },
  {
    code: "SOA-100018367_0-219",
    standingOfferNumber: "100018367.0",
    agency: "Employment and Social Development Canada",
    service: "Assessment / placement",
    sourceSelection: "Part-Time Assessment",
    classType: "Per candidate",
    rhythm: "Not applicable",
    activeDates: "2025-11-07 to 2026-11-06",
    rateVisibility: "Amount kept in private audit",
    reviewNote: "Rate applies per candidate; proposal wording must state the selected assessment or placement service.",
  },
  {
    code: "SOA-100018367_0-224",
    standingOfferNumber: "100018367.0",
    agency: "Employment and Social Development Canada",
    service: "Second language training",
    sourceSelection: "Full-Time Individual",
    classType: "Individual",
    rhythm: "Full-time",
    activeDates: "2025-11-07 to 2026-11-06",
    rateVisibility: "Amount kept in private audit",
    reviewNote: "Usable SOA individual line; proposal wording must state language, schedule, hours, and SOA source.",
  },
  {
    code: "SOA-100018367_0-229",
    standingOfferNumber: "100018367.0",
    agency: "Employment and Social Development Canada",
    service: "Second language training",
    sourceSelection: "Part-Time Individual",
    classType: "Individual",
    rhythm: "Part-time",
    activeDates: "2025-11-07 to 2026-11-06",
    rateVisibility: "Amount kept in private audit",
    reviewNote: "Usable SOA individual line; proposal wording must state language, schedule, hours, and SOA source.",
  },
  {
    code: "SOA-100018367_0-234",
    standingOfferNumber: "100018367.0",
    agency: "Employment and Social Development Canada",
    service: "Second language training",
    sourceSelection: "Full-Time Group",
    classType: "Group",
    rhythm: "Full-time",
    activeDates: "2025-11-07 to 2026-11-06",
    rateVisibility: "Amount kept in private audit",
    reviewNote: "Usable SOA group line. Group starts at 2 participants; no maximum is assumed unless the source states one.",
  },
  {
    code: "SOA-100018367_0-239",
    standingOfferNumber: "100018367.0",
    agency: "Employment and Social Development Canada",
    service: "Second language training",
    sourceSelection: "Part-Time Group",
    classType: "Group",
    rhythm: "Part-time",
    activeDates: "2025-11-07 to 2026-11-06",
    rateVisibility: "Amount kept in private audit",
    reviewNote: "Usable SOA group line. Group starts at 2 participants; no maximum is assumed unless the source states one.",
  },
  {
    code: "SOA-20230676_0-243",
    standingOfferNumber: "20230676.0",
    agency: "Financial Consumer Agency of Canada",
    service: "Second language training",
    sourceSelection: "Part-Time Group",
    classType: "Group",
    rhythm: "Part-time",
    activeDates: "2025-09-01 to 2026-08-31",
    rateVisibility: "Amount kept in private audit",
    reviewNote: "Usable SOA group line. Group starts at 2 participants; no maximum is assumed unless the source states one.",
  },
  {
    code: "SOA-2L165-21-0335-185",
    standingOfferNumber: "2L165-21-0335",
    agency: "Communications Security Establishment",
    service: "Assessment / placement",
    sourceSelection: "Assessment",
    classType: "Per candidate",
    rhythm: "Not applicable",
    activeDates: "2025-08-12 to 2026-08-11",
    rateVisibility: "Amount kept in private audit",
    reviewNote: "Rate applies per candidate; proposal wording must state the selected assessment or placement service.",
  },
  {
    code: "SOA-2L165-21-0335-190",
    standingOfferNumber: "2L165-21-0335",
    agency: "Communications Security Establishment",
    service: "Second language training",
    sourceSelection: "Full-Time Individual",
    classType: "Individual",
    rhythm: "Full-time",
    activeDates: "2025-08-12 to 2026-08-11",
    rateVisibility: "Amount kept in private audit",
    reviewNote: "Usable SOA individual line; proposal wording must state language, schedule, hours, and SOA source.",
  },
  {
    code: "SOA-2L165-21-0335-195",
    standingOfferNumber: "2L165-21-0335",
    agency: "Communications Security Establishment",
    service: "Second language training",
    sourceSelection: "Part-Time Individual",
    classType: "Individual",
    rhythm: "Part-time",
    activeDates: "2025-08-12 to 2026-08-11",
    rateVisibility: "Amount kept in private audit",
    reviewNote: "Usable SOA individual line; proposal wording must state language, schedule, hours, and SOA source.",
  },
  {
    code: "SOA-2L165-21-0335-200",
    standingOfferNumber: "2L165-21-0335",
    agency: "Communications Security Establishment",
    service: "Second language training",
    sourceSelection: "Full-Time Group",
    classType: "Group",
    rhythm: "Full-time",
    activeDates: "2025-08-12 to 2026-08-11",
    rateVisibility: "Amount kept in private audit",
    reviewNote: "Usable SOA group line. Group starts at 2 participants; no maximum is assumed unless the source states one.",
  },
  {
    code: "SOA-2L165-21-0335-205",
    standingOfferNumber: "2L165-21-0335",
    agency: "Communications Security Establishment",
    service: "Second language training",
    sourceSelection: "Part-Time Group",
    classType: "Group",
    rhythm: "Part-time",
    activeDates: "2025-08-12 to 2026-08-11",
    rateVisibility: "Amount kept in private audit",
    reviewNote: "Usable SOA group line. Group starts at 2 participants; no maximum is assumed unless the source states one.",
  },
  {
    code: "SOA-2L165-21-0335-210",
    standingOfferNumber: "2L165-21-0335",
    agency: "Communications Security Establishment",
    service: "Assessment / placement",
    sourceSelection: "Evaluations",
    classType: "Per candidate",
    rhythm: "Not applicable",
    activeDates: "2025-08-12 to 2026-08-11",
    rateVisibility: "Amount kept in private audit",
    reviewNote: "Rate applies per candidate; proposal wording must state the selected assessment or placement service.",
  },
  {
    code: "SOA-37132-23-0001-384",
    standingOfferNumber: "37132-23-0001",
    agency: "Public Safety and Emergency Preparedness Canada",
    service: "Second language training",
    sourceSelection: "At National Capital Region",
    classType: "To confirm",
    rhythm: "To confirm",
    activeDates: "2026-04-01 to 2027-03-31",
    rateVisibility: "Amount kept in private audit",
    reviewNote: "Usable SOA line. Select clear language, class details, schedule, hours, and SOA source wording in the proposal.",
  },
  {
    code: "SOA-37132-23-0001-389",
    standingOfferNumber: "37132-23-0001",
    agency: "Public Safety and Emergency Preparedness Canada",
    service: "Assessment / placement",
    sourceSelection: "Diagnostic Assessments",
    classType: "Per candidate",
    rhythm: "Not applicable",
    activeDates: "2026-04-01 to 2027-03-31",
    rateVisibility: "Amount kept in private audit",
    reviewNote: "Rate applies per candidate; proposal wording must state the selected assessment or placement service.",
  },
  {
    code: "SOA-37132-23-0001-394",
    standingOfferNumber: "37132-23-0001",
    agency: "Public Safety and Emergency Preparedness Canada",
    service: "Assessment / placement",
    sourceSelection: "Second Language Evaluations",
    classType: "Per candidate",
    rhythm: "Not applicable",
    activeDates: "2026-04-01 to 2027-03-31",
    rateVisibility: "Amount kept in private audit",
    reviewNote: "Rate applies per candidate; proposal wording must state the selected assessment or placement service.",
  },
  {
    code: "SOA-37132-23-0001-399",
    standingOfferNumber: "37132-23-0001",
    agency: "Public Safety and Emergency Preparedness Canada",
    service: "Second language training",
    sourceSelection: "Virtually/At PSEPC",
    classType: "To confirm",
    rhythm: "To confirm",
    activeDates: "2026-04-01 to 2027-03-31",
    rateVisibility: "Amount kept in private audit",
    reviewNote: "Usable SOA line. Select clear language, class details, schedule, hours, and SOA source wording in the proposal.",
  },
  {
    code: "SOA-4600002737_0-247",
    standingOfferNumber: "4600002737.0",
    agency: "Indigenous Services Canada",
    service: "Second language training",
    sourceSelection: "Full-Time Individual",
    classType: "Individual",
    rhythm: "Full-time",
    activeDates: "2026-04-01 to 2027-03-31",
    rateVisibility: "Amount kept in private audit",
    reviewNote: "Usable SOA individual line; proposal wording must state language, schedule, hours, and SOA source.",
  },
  {
    code: "SOA-4600002737_0-252",
    standingOfferNumber: "4600002737.0",
    agency: "Indigenous Services Canada",
    service: "Second language training",
    sourceSelection: "Part-Time Individual",
    classType: "Individual",
    rhythm: "Part-time",
    activeDates: "2026-04-01 to 2027-03-31",
    rateVisibility: "Amount kept in private audit",
    reviewNote: "Usable SOA individual line; proposal wording must state language, schedule, hours, and SOA source.",
  },
  {
    code: "SOA-4600002737_0-257",
    standingOfferNumber: "4600002737.0",
    agency: "Indigenous Services Canada",
    service: "Second language training",
    sourceSelection: "Full-Time Group",
    classType: "Group",
    rhythm: "Full-time",
    activeDates: "2026-04-01 to 2027-03-31",
    rateVisibility: "Amount kept in private audit",
    reviewNote: "Usable SOA group line. Group starts at 2 participants; no maximum is assumed unless the source states one.",
  },
  {
    code: "SOA-4600002737_0-262",
    standingOfferNumber: "4600002737.0",
    agency: "Indigenous Services Canada",
    service: "Second language training",
    sourceSelection: "Part-Time Group",
    classType: "Group",
    rhythm: "Part-time",
    activeDates: "2026-04-01 to 2027-03-31",
    rateVisibility: "Amount kept in private audit",
    reviewNote: "Usable SOA group line. Group starts at 2 participants; no maximum is assumed unless the source states one.",
  },
  {
    code: "SOA-CW2379765-592",
    standingOfferNumber: "CW2379765",
    agency: "National Master Standing Offer",
    service: "Second language training",
    sourceSelection: "Full-Time Individual (Virtual)",
    classType: "Individual",
    rhythm: "Full-time",
    activeDates: "2025-11-12 to 2026-11-11",
    rateVisibility: "Amount kept in private audit",
    reviewNote: "Usable SOA individual line; proposal wording must state language, schedule, hours, and SOA source.",
  },
  {
    code: "SOA-CW2379765-597",
    standingOfferNumber: "CW2379765",
    agency: "National Master Standing Offer",
    service: "Second language training",
    sourceSelection: "Part-Time Individual (In-Person)",
    classType: "Individual",
    rhythm: "Part-time",
    activeDates: "2025-11-12 to 2026-11-11",
    rateVisibility: "Amount kept in private audit",
    reviewNote: "Usable SOA individual line; proposal wording must state language, schedule, hours, and SOA source.",
  },
  {
    code: "SOA-CW2379765-602",
    standingOfferNumber: "CW2379765",
    agency: "National Master Standing Offer",
    service: "Second language training",
    sourceSelection: "Part-Time Individual (Virtual)",
    classType: "Individual",
    rhythm: "Part-time",
    activeDates: "2025-11-12 to 2026-11-11",
    rateVisibility: "Amount kept in private audit",
    reviewNote: "Usable SOA individual line; proposal wording must state language, schedule, hours, and SOA source.",
  },
  {
    code: "SOA-CW2379765-607",
    standingOfferNumber: "CW2379765",
    agency: "National Master Standing Offer",
    service: "Assessment / placement",
    sourceSelection: "Placement Tests",
    classType: "Per candidate",
    rhythm: "Not applicable",
    activeDates: "2025-11-12 to 2026-11-11",
    rateVisibility: "Amount kept in private audit",
    reviewNote: "Rate applies per candidate; proposal wording must state the selected assessment or placement service.",
  },
];

export const templateSections: TemplateCardData[] = [
  {
    id: "overview",
    title: "Overview",
    status: "Generated",
    reviewState: "Generated",
    source: "Client, service, schedule, and Price Book setup",
    appliesWhen: "Every proposal",
    content: "Knowledge Circle Learning Services Inc. is pleased to provide this proposal for the services described below. The final wording is generated from the selected client, service, dates, delivery mode, rate source, and schedule.",
  },
  {
    id: "training-access",
    title: "Training access and MyLearningMyWay",
    status: "Template applied",
    reviewState: "Template applied",
    source: "Standard Knowledge Circle learning platform clause",
    appliesWhen: "Virtual, hybrid, or supported language-training services",
    content: "Learners access their virtual classes, training calendar, pedagogical materials, homework, attendance sheets, progress reports, class reports, and other program information through Knowledge Circle's secure MyLearningMyWay platform when applicable.",
  },
  {
    id: "schedule",
    title: "Schedule and service details",
    status: "Generated",
    reviewState: "Generated",
    source: "Services & Training step",
    appliesWhen: "Every training proposal",
    content: "Training dates, rhythm, delivery mode, groups, candidates, competencies, and estimated hours are generated from the configured service blocks. Proposed dates remain subject to authorization and instructor availability until confirmed.",
  },
  {
    id: "scheduling-preferences",
    title: "Scheduling preferences disclaimer",
    status: "Template applied",
    reviewState: "Template applied",
    source: "Standard scheduling protection clause",
    appliesWhen: "Every proposal with availability or scheduling preferences",
    content: "Knowledge Circle will consider the scheduling preferences, preferred days, preferred times, location details, time zone, and other availability information provided for planning purposes. All times indicated in the proposal are Ottawa, Ontario time (Eastern Time), unless expressly stated otherwise. Preferred days and AM/PM preferences, including common part-time requests such as Tuesday and Thursday mornings, are indicative only and do not constitute a guarantee of final schedule, instructor availability, delivery location, start date, class time, or reserved training capacity. Knowledge Circle is based in Ottawa and applies Ontario statutory holidays by default when planning schedules. If the client requires additional provincial, territorial, organizational, or location-specific holidays to be observed, the client must identify them in writing before the schedule is confirmed. Final scheduling is confirmed only after the required authorization is received and resources are assigned.",
  },
  {
    id: "administrative",
    title: "Administrative conditions",
    status: "Template applied",
    reviewState: "Template applied",
    source: "Standard administrative terms",
    appliesWhen: "Every proposal",
    content: "This proposal is valid for 30 days from the issue date. It is an estimate of proposed services and is not an invoice, final reservation confirmation, or active contract. Services begin only after an acceptable authorization such as a Call-Up, purchase order, signed authorization, or written confirmation from an authorized client representative.",
  },
  {
    id: "billing-payment",
    title: "Billing and payment",
    status: "Needs review",
    reviewState: "Needs review",
    source: "Administrative and commercial terms",
    appliesWhen: "Every priced proposal",
    content: "Invoices are normally issued monthly based on delivered hours or completed services. Payment terms are Net 30 days. Government acquisition card, departmental payment system, or another approved method may be used when applicable.",
  },
  {
    id: "security",
    title: "Security and protected information",
    status: "Template applied",
    reviewState: "Template applied",
    source: "Virtual delivery and federal-client clause",
    appliesWhen: "Virtual classes, MyLearningMyWay, or federal clients",
    content: "Virtual sessions and learning-platform use are intended for Unclassified exchanges. Classified, protected, or sensitive information must not be shared through MS Teams, MyLearningMyWay, or training documents unless an approved solution is in place.",
  },
  {
    id: "acceptance",
    title: "Acceptance",
    status: "Template applied",
    reviewState: "Template applied",
    source: "Standard acceptance wording",
    appliesWhen: "Every proposal",
    content: "To proceed, the client must provide a valid Call-Up under the applicable standing offer or a written and signed authorization. Upon receipt, Knowledge Circle Learning Services Inc. will assign the instructor, confirm the schedule, and organize the start of services subject to resource availability and applicable contractual conditions.",
  },
  {
    id: "authorization",
    title: "Client authorization block",
    status: "Template applied",
    reviewState: "Template applied",
    source: "Standard authorization fields",
    appliesWhen: "Every proposal PDF",
    content: "The PDF should include fields for organization or ministry, authorized representative, title, email address, Call-Up or purchase order number, authorized amount, date, and signature.",
  },
  {
    id: "pdf-footer",
    title: "PDF footer",
    status: "Template applied",
    reviewState: "Template applied",
    source: "Standard Knowledge Circle document footer",
    appliesWhen: "Every proposal PDF page",
    content: "Knowledge Circle Language Services Inc. ©2026 1 Rideau Street, 7th Floor, Ottawa K1N 8S7, Canada. Include Page X of Y on every proposal page.",
  },
];

export const quoteSummary = {
  client: "DEMO Federal Department",
  contact: "Program Coordinator",
  learnerCount: "3",
  phaseCount: "1",
  estimatedHours: "180",
  pricingStatus: "Rate to confirm",
  maximumAmount: "Rate to confirm",
  validity: "30 days",
  errors: ["Pricing requires a confirmed rate before approval."],
  warnings: ["Schedule dates are display-only in this prototype."],
};
