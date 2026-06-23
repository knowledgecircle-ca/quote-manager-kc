import { useEffect, useMemo, useRef, useState } from "react";

import { printProposalDraftPdf } from "@/application/use-cases/pdf/printProposalDraftPdf";
import { LocalDataBanner } from "@/ui/components/LocalDataBanner";
import { QuoteSummary } from "@/ui/components/QuoteSummary";
import { SectionCard } from "@/ui/components/SectionCard";
import { StatusBadge } from "@/ui/components/StatusBadge";
import { Stepper, type StepDefinition } from "@/ui/components/Stepper";
import {
  demoPriceBookEntries,
  demoProposals,
  demoSoaRateReviewEntries,
  demoStandingOffers,
  quoteSummary,
  templateSections,
  type DemoPriceBookEntry,
  type DemoSoaRateReviewEntry,
  type DemoStandingOffer,
} from "@/ui/demo/prototypeData";

import { DataTable } from "../components/DataTable";

const editorSteps: StepDefinition[] = [
  { id: "basics", label: "Basics & Client", shortLabel: "Basics" },
  { id: "training-phases", label: "Services & Training", shortLabel: "Training" },
  { id: "pricing", label: "Pricing" },
  { id: "content", label: "Proposal document", shortLabel: "Proposal" },
];

type ServiceFamily =
  | "Second language training"
  | "Diagnostic assessment"
  | "Assessment / evaluation / placement"
  | "Placement test"
  | "NMSO placement test"
  | "CCC assessment";
type PricingSource = "SOA" | "Non-SOA";
type TargetLanguage = "English" | "French";
type DayPreference = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
type SchedulePreferenceScope = "whole-service" | "by-learner-or-group";
type ScheduleTimePreference = "No preference" | "AM" | "PM";
type ScheduleTimeZone = "Atlantic" | "Eastern" | "Central" | "Mountain" | "Pacific";

interface SchedulePreferences {
  excludedDays: DayPreference[];
  excludeStatutoryHolidays: boolean;
  preferredDays: DayPreference[];
  timePreference: ScheduleTimePreference;
  timeZone: ScheduleTimeZone;
  locationNote: string;
  notes: string;
}

interface AssessmentGroup {
  id: string;
  language: TargetLanguage;
  candidates: string;
  competencies: string[];
}

interface TrainingGroup {
  id: string;
  groupCount: string;
  language: TargetLanguage;
  participants: string;
  participantsMode: "auto" | "manual";
  groupSession: string;
  trainingStartDate: string;
  teachingWeeks: string;
  bufferWeeks: string;
  partTimeSessionsPerWeek: string;
  partTimeClassDurationHours: string;
  deliveryMode: string;
  scheduleNotes: string;
  schedulePreferences: SchedulePreferences;
}

interface RequestedService {
  id: string;
  pricingSource: PricingSource;
  soaSourceCode: string;
  family: ServiceFamily;
  source: string;
  classType: string;
  deliveryMode: string;
  trainingFormat: string;
  trainingStartDate: string;
  trainingEndDate: string;
  groupSession: string;
  teachingWeeks: string;
  bufferWeeks: string;
  scheduleNotes: string;
  schedulePreferenceScope: SchedulePreferenceScope;
  schedulePreferences: SchedulePreferences;
  learnerSchedulePreferences: SchedulePreferences[];
  fullTimeHoursPerDay: string;
  fullTimeHoursPerWeek: string;
  partTimeSessionsPerWeek: string;
  partTimeClassDurationHours: string;
  reserveHours: string;
  targetLanguages: TargetLanguage[];
  participants: string;
  hours: string;
  candidates: string;
  englishCandidates: string;
  frenchCandidates: string;
  competencies: string[];
  assessmentGroups: AssessmentGroup[];
  trainingGroups: TrainingGroup[];
  priceLineCode: string;
  overrideRateEnabled: boolean;
  overrideRate: string;
  overrideRateNote: string;
}

interface ClientDraft {
  contactDetails: string;
  contactName: string;
  organizationName: string;
}

interface ProposalBasicsDraft {
  proposalTitle: string;
  quoteDate: string;
  quoteId: string;
}

const competencyOptions = ["Reading", "Writing", "Oral"] as const;
const languageOptions = ["English", "French"] as const;
const fullTimeHoursPerDayOptions = ["6", "7", "7.5"] as const;
const partTimeSessionOptions = ["1", "2", "3", "4", "5"] as const;
const partTimeClassDurationOptions = ["1", "1.5", "2", "3", "3.5", "4"] as const;
const groupSessionOptions = ["Winter", "Spring", "Summer", "Fall", "Custom"] as const;
const groupPartTimeSessionOptions = ["1", "2"] as const;
const groupPartTimeClassDurationOptions = ["1", "1.5", "2", "3"] as const;
const groupBufferWeekOptions = ["0", "1", "2"] as const;
const scheduleDayOptions: DayPreference[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const scheduleTimePreferenceOptions: ScheduleTimePreference[] = ["No preference", "AM", "PM"];
const scheduleTimeZoneOptions: ScheduleTimeZone[] = ["Atlantic", "Eastern", "Central", "Mountain", "Pacific"];

const soaReviewRatesByCode: Record<string, string> = {
  "SOA-100018367_0-214": "CAD 55.00",
  "SOA-100018367_0-219": "CAD 55.00",
  "SOA-100018367_0-224": "CAD 36.00",
  "SOA-100018367_0-229": "CAD 36.00",
  "SOA-100018367_0-234": "CAD 38.00",
  "SOA-100018367_0-239": "CAD 38.00",
  "SOA-20230676_0-243": "CAD 42.00",
  "SOA-2L165-21-0335-185": "CAD 39.00",
  "SOA-2L165-21-0335-190": "CAD 40.00",
  "SOA-2L165-21-0335-195": "CAD 40.00",
  "SOA-2L165-21-0335-200": "CAD 42.00",
  "SOA-2L165-21-0335-205": "CAD 42.00",
  "SOA-2L165-21-0335-210": "CAD 39.00",
  "SOA-37132-23-0001-384": "CAD 45.00",
  "SOA-37132-23-0001-389": "CAD 55.00",
  "SOA-37132-23-0001-394": "CAD 40.00",
  "SOA-37132-23-0001-399": "CAD 40.00",
  "SOA-4600002737_0-247": "CAD 40.00",
  "SOA-4600002737_0-252": "CAD 40.00",
  "SOA-4600002737_0-257": "CAD 40.00",
  "SOA-4600002737_0-262": "CAD 40.00",
  "SOA-CW2379765-592": "CAD 40.00",
  "SOA-CW2379765-597": "CAD 40.00",
  "SOA-CW2379765-602": "CAD 40.00",
  "SOA-CW2379765-607": "CAD 75.00",
};

function soaReviewUnit(entry: DemoSoaRateReviewEntry) {
  return entry.classType === "Per candidate" ? "Per candidate" : "Per hour";
}

function soaReviewEntryToPriceLine(entry: DemoSoaRateReviewEntry): DemoPriceBookEntry {
  return {
    activeDates: entry.activeDates,
    classType: entry.classType,
    code: entry.code,
    contractVehicle: `SOA ${entry.standingOfferNumber}`,
    delivery: entry.rhythm,
    descriptionRule: entry.reviewNote,
    label: entry.sourceSelection,
    rate: soaReviewRatesByCode[entry.code] ?? "Rate to confirm",
    selection: entry.sourceSelection,
    service: entry.service,
    source: entry.agency,
    status: "CONFIRMED",
    unit: soaReviewUnit(entry),
  };
}

const proposalPriceBookEntries = [
  ...demoPriceBookEntries,
  ...demoSoaRateReviewEntries.map(soaReviewEntryToPriceLine),
];

const initialRequestedServices: RequestedService[] = [];
const defaultProposalBasics: ProposalBasicsDraft = {
  proposalTitle: "Second language training proposal",
  quoteDate: "2026-06-22",
  quoteId: "",
};
const proposalFooterCompany = "Knowledge Circle Language Services Inc.";
const proposalFooterAddress = "1 Rideau Street, 7th Floor, Ottawa K1N 8S7, Canada";
const quoteIdPattern = /^KC-\d{4}-\d{4}-\d{2}$/;

function isQuoteIdValid(quoteId: string) {
  return quoteIdPattern.test(quoteId.trim());
}

function serviceCardId(serviceId: string) {
  return `service-card-${serviceId}`;
}

function defaultSchedulePreferences(): SchedulePreferences {
  return {
    excludeStatutoryHolidays: true,
    excludedDays: ["Sat", "Sun"],
    preferredDays: [],
    timePreference: "No preference",
    timeZone: "Eastern",
    locationNote: "",
    notes: "",
  };
}

function normalizeSchedulePreferences(preferences?: Partial<SchedulePreferences>) {
  return {
    ...defaultSchedulePreferences(),
    ...preferences,
    excludedDays: preferences?.excludedDays ?? defaultSchedulePreferences().excludedDays,
    preferredDays: preferences?.preferredDays ?? defaultSchedulePreferences().preferredDays,
  };
}

function defaultLanguageTrainingService(id: string): RequestedService {
  return {
    id,
    pricingSource: "Non-SOA",
    soaSourceCode: "",
    family: "Second language training",
    source: "Non-SOA",
    classType: "Group",
    deliveryMode: "MS Teams",
    trainingFormat: "Part-time",
    trainingStartDate: "2026-07-06",
    trainingEndDate: "2026-12-19",
    groupSession: "Summer",
    teachingWeeks: "12",
    bufferWeeks: "1",
    scheduleNotes: "",
    schedulePreferenceScope: "whole-service",
    schedulePreferences: defaultSchedulePreferences(),
    learnerSchedulePreferences: [],
    fullTimeHoursPerDay: "6",
    fullTimeHoursPerWeek: "30",
    partTimeSessionsPerWeek: "2",
    partTimeClassDurationHours: "1.5",
    reserveHours: "0",
    targetLanguages: ["French"],
    participants: "3",
    hours: "180",
    candidates: "",
    englishCandidates: "0",
    frenchCandidates: "0",
    competencies: [],
    assessmentGroups: [],
    trainingGroups: [
      {
        id: "training-group-1",
        groupCount: "1",
        language: "French",
        participants: "6",
        participantsMode: "auto",
        groupSession: "Summer",
        trainingStartDate: "2026-07-06",
        teachingWeeks: "12",
        bufferWeeks: "1",
        partTimeSessionsPerWeek: "2",
        partTimeClassDurationHours: "1.5",
        deliveryMode: "MS Teams",
        scheduleNotes: "",
        schedulePreferences: defaultSchedulePreferences(),
      },
    ],
    priceLineCode: "KC-NONSOA-LANG-GROUP",
    overrideRateEnabled: false,
    overrideRate: "",
    overrideRateNote: "",
  };
}

function defaultAssessmentService(id: string): RequestedService {
  return {
    id,
    pricingSource: "Non-SOA",
    soaSourceCode: "",
    family: "Diagnostic assessment",
    source: "Non-SOA",
    classType: "Per candidate",
    deliveryMode: "Assessment delivery to confirm",
    trainingFormat: "Not applicable",
    trainingStartDate: "",
    trainingEndDate: "",
    groupSession: "",
    teachingWeeks: "",
    bufferWeeks: "",
    scheduleNotes: "",
    schedulePreferenceScope: "whole-service",
    schedulePreferences: defaultSchedulePreferences(),
    learnerSchedulePreferences: [],
    fullTimeHoursPerDay: "",
    fullTimeHoursPerWeek: "",
    partTimeSessionsPerWeek: "",
    partTimeClassDurationHours: "",
    reserveHours: "",
    targetLanguages: ["French"],
    participants: "",
    hours: "",
    candidates: "1",
    englishCandidates: "0",
    frenchCandidates: "1",
    competencies: ["Reading"],
    assessmentGroups: defaultAssessmentGroups("Diagnostic assessment"),
    trainingGroups: [],
    priceLineCode: "KC-DIAG-ASSESSMENT",
    overrideRateEnabled: false,
    overrideRate: "",
    overrideRateNote: "",
  };
}

function priceLineForCode(code: string) {
  return proposalPriceBookEntries.find((entry) => entry.code === code);
}

function selectedPriceLineForService(service: RequestedService) {
  return compatiblePriceLinesForService(service)[0] ?? priceLineForCode(service.priceLineCode);
}

function defaultAssessmentGroups(family: ServiceFamily): AssessmentGroup[] {
  return [
    {
      id: "group-1",
      language: "French",
      candidates: "1",
      competencies: family === "NMSO placement test" ? [...competencyOptions] : ["Reading"],
    },
  ];
}

function normalizeAssessmentGroups(service: RequestedService, family: ServiceFamily) {
  if (family === "Second language training") {
    return [];
  }

  const baseGroups = service.assessmentGroups.length > 0 ? service.assessmentGroups : defaultAssessmentGroups(family);

  return baseGroups.map((group, index) => ({
    ...group,
    id: group.id || `group-${index + 1}`,
    candidates: group.candidates || "1",
    competencies: family === "NMSO placement test" ? [...competencyOptions] : group.competencies.length > 0 ? group.competencies : ["Reading"],
    language: group.language || "French",
  }));
}

function defaultTrainingGroups(service: RequestedService): TrainingGroup[] {
  return [
    {
      id: "training-group-1",
      groupCount: "1",
      language: service.targetLanguages[0] ?? "French",
      participants: "6",
      participantsMode: "auto",
      groupSession: service.groupSession || "Summer",
      trainingStartDate: service.trainingStartDate || "2026-07-06",
      teachingWeeks: service.teachingWeeks || "12",
      bufferWeeks: service.bufferWeeks || "1",
      partTimeSessionsPerWeek: service.partTimeSessionsPerWeek || "2",
      partTimeClassDurationHours: service.partTimeClassDurationHours || "1.5",
      deliveryMode: service.deliveryMode || "MS Teams",
      scheduleNotes: service.scheduleNotes || "",
    schedulePreferences: normalizeSchedulePreferences(service.schedulePreferences),
    },
  ];
}

function normalizeTrainingGroups(service: RequestedService, family: ServiceFamily) {
  if (family !== "Second language training" || service.classType !== "Group" || service.trainingFormat !== "Part-time") {
    return [];
  }

  const groups = service.trainingGroups.length > 0 ? service.trainingGroups : defaultTrainingGroups(service);
  return groups.map((group, index) => ({
    ...group,
    id: group.id || `training-group-${index + 1}`,
    bufferWeeks: group.bufferWeeks || "1",
    deliveryMode: group.deliveryMode || service.deliveryMode || "MS Teams",
    groupCount: group.groupCount || "1",
    groupSession: group.groupSession || service.groupSession || "Summer",
    language: group.language || service.targetLanguages[0] || "French",
    participants: group.participants || service.participants || "6",
    participantsMode: group.participantsMode ?? "auto",
    partTimeClassDurationHours: group.partTimeClassDurationHours || service.partTimeClassDurationHours || "1.5",
    partTimeSessionsPerWeek: group.partTimeSessionsPerWeek || service.partTimeSessionsPerWeek || "2",
    scheduleNotes: group.scheduleNotes || "",
    schedulePreferences: normalizeSchedulePreferences(group.schedulePreferences),
    teachingWeeks: group.teachingWeeks || "12",
    trainingStartDate: group.trainingStartDate || service.trainingStartDate || "2026-07-06",
  }));
}

function normalizeLearnerSchedulePreferences(service: RequestedService) {
  if (service.family !== "Second language training" || service.classType !== "Individual") {
    return [];
  }

  const learnerCount = positiveIntegerValue(service.participants);
  return Array.from({ length: learnerCount }, (_, index) =>
    normalizeSchedulePreferences(service.learnerSchedulePreferences[index]),
  );
}

function normalizeIdentifier(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function standingOfferAliases(standingOffer: DemoStandingOffer) {
  const baseAliases = [
    standingOffer.standingOfferNumber,
    standingOffer.displayName,
    standingOffer.agency,
    `SOA ${standingOffer.standingOfferNumber}`,
  ];

  if (standingOffer.displayName === "CCC") {
    return [...baseAliases, "CCC SOA", "Canadian Commercial Corporation"];
  }

  if (standingOffer.displayName === "NMSO") {
    return [...baseAliases, "NMSO SOA", "National Master Standing Offer"];
  }

  if (standingOffer.displayName === "OSO") {
    return [...baseAliases, "OSO SOA", "Online Standing Offer"];
  }

  return baseAliases;
}

function priceLineBelongsToStandingOffer(entry: DemoPriceBookEntry, standingOffer: DemoStandingOffer) {
  const searchableValues = [
    entry.code,
    entry.source,
    entry.contractVehicle,
    entry.label,
    entry.selection,
    entry.descriptionRule,
  ].map(normalizeIdentifier);

  return standingOfferAliases(standingOffer).some((alias) => {
    const normalizedAlias = normalizeIdentifier(alias);
    return normalizedAlias !== "" && searchableValues.some((value) => value.includes(normalizedAlias));
  });
}

function standingOfferForCode(code: string) {
  return demoStandingOffers.find((standingOffer) => standingOffer.code === code);
}

function sourceLabelForService(service: RequestedService) {
  if (service.pricingSource === "Non-SOA") {
    return "Non-SOA";
  }

  const standingOffer = standingOfferForCode(service.soaSourceCode);
  return standingOffer ? `${standingOffer.displayName} SOA` : "SOA";
}

function familiesForPriceLine(entry: DemoPriceBookEntry, standingOffer?: DemoStandingOffer): ServiceFamily[] {
  if (entry.service === "Second language training") {
    return ["Second language training"];
  }

  if (entry.service === "Diagnostic assessment") {
    return ["Diagnostic assessment"];
  }

  if (entry.service === "Placement test") {
    return ["Placement test"];
  }

  if (entry.service === "NMSO placement test") {
    return standingOffer?.displayName === "NMSO" ? ["NMSO placement test"] : ["Placement test"];
  }

  if (entry.service === "CCC assessment") {
    return ["CCC assessment"];
  }

  if (entry.service === "Assessment / placement") {
    return standingOffer?.displayName === "NMSO"
      ? ["NMSO placement test"]
      : ["Assessment / evaluation / placement"];
  }

  return [];
}

function availableServiceFamiliesForSource(pricingSource: PricingSource, soaSourceCode: string): ServiceFamily[] {
  const standingOffer = pricingSource === "SOA" ? standingOfferForCode(soaSourceCode) : undefined;
  const compatibleEntries = proposalPriceBookEntries.filter((entry) => {
    if (pricingSource === "Non-SOA") {
      return entry.contractVehicle === "Non-SOA";
    }

    return standingOffer ? priceLineBelongsToStandingOffer(entry, standingOffer) : false;
  });
  const families = compatibleEntries.flatMap((entry) => familiesForPriceLine(entry, standingOffer));

  return Array.from(new Set(families));
}

function availableServiceFamiliesForService(service: RequestedService): ServiceFamily[] {
  return availableServiceFamiliesForSource(service.pricingSource, service.soaSourceCode);
}

function defaultFamilyForSource(pricingSource: PricingSource, soaSourceCode: string): ServiceFamily {
  return availableServiceFamiliesForSource(pricingSource, soaSourceCode)[0] ?? "Second language training";
}

function serviceMatchesFamily(entry: DemoPriceBookEntry, family: ServiceFamily) {
  if (family === "Second language training") {
    return entry.service === "Second language training";
  }

  if (family === "Diagnostic assessment") {
    return entry.service === "Diagnostic assessment" || entry.service === "Assessment / placement";
  }

  if (family === "Assessment / evaluation / placement") {
    return entry.service === "Assessment / placement";
  }

  if (family === "Placement test") {
    return entry.service === "Placement test";
  }

  if (family === "NMSO placement test") {
    return entry.service === "NMSO placement test" || entry.service === "Assessment / placement";
  }

  return entry.service === "CCC assessment";
}

function sourceAndFamilyPriceLinesForService(service: RequestedService) {
  return proposalPriceBookEntries.filter((entry) => {
    if (service.pricingSource === "Non-SOA") {
      return entry.contractVehicle === "Non-SOA" && serviceMatchesFamily(entry, service.family);
    }

    const standingOffer = standingOfferForCode(service.soaSourceCode);
    return Boolean(
      standingOffer &&
        priceLineBelongsToStandingOffer(entry, standingOffer) &&
        serviceMatchesFamily(entry, service.family),
    );
  });
}

function trainingFormatsForPriceLine(entry: DemoPriceBookEntry) {
  const searchable = `${entry.delivery} ${entry.selection} ${entry.label}`.toLowerCase();
  const formats: string[] = [];

  if (searchable.includes("full-time")) {
    formats.push("Full-time");
  }

  if (searchable.includes("part-time")) {
    formats.push("Part-time");
  }

  return formats;
}

function availableTrainingClassTypesForService(service: RequestedService) {
  if (service.family !== "Second language training") {
    return [];
  }

  return Array.from(new Set(sourceAndFamilyPriceLinesForService(service).map((entry) => entry.classType)));
}

function availableTrainingFormatsForService(service: RequestedService) {
  if (service.family !== "Second language training") {
    return [];
  }

  return Array.from(
    new Set(
      sourceAndFamilyPriceLinesForService(service)
        .filter((entry) => service.classType === "Any" || entry.classType === service.classType)
        .flatMap(trainingFormatsForPriceLine),
    ),
  );
}

function compatiblePriceLinesForService(service: RequestedService) {
  return sourceAndFamilyPriceLinesForService(service).filter((entry) => {
    if (service.family === "Second language training") {
      const classMatches = service.classType === "Any" || entry.classType === service.classType;
      const formatOptions = trainingFormatsForPriceLine(entry);
      const formatMatches = formatOptions.length === 0 || formatOptions.includes(service.trainingFormat);
      return classMatches && formatMatches;
    }

    return true;
  });
}

function normalizeRequestedService(service: RequestedService): RequestedService {
  const availableFamilies = availableServiceFamiliesForService(service);
  const family = availableFamilies.includes(service.family)
    ? service.family
    : defaultFamilyForSource(service.pricingSource, service.soaSourceCode);
  const isTraining = family === "Second language training";
  const isNmso = family === "NMSO placement test";
  const requestedClassType = service.classType === "Per candidate" ? "Group" : service.classType;
  const classTypeOptions = isTraining
    ? availableTrainingClassTypesForService({ ...service, family, classType: requestedClassType })
    : [];
  const classType = isTraining && classTypeOptions.length > 0 && !classTypeOptions.includes(requestedClassType)
    ? classTypeOptions[0]
    : requestedClassType;
  const requestedTrainingFormat = service.trainingFormat === "Not applicable" ? "Part-time" : service.trainingFormat;
  const trainingFormatOptions = isTraining
    ? availableTrainingFormatsForService({ ...service, family, classType, trainingFormat: requestedTrainingFormat })
    : [];
  const trainingFormat =
    isTraining && trainingFormatOptions.length > 0 && !trainingFormatOptions.includes(requestedTrainingFormat)
      ? trainingFormatOptions[0]
      : requestedTrainingFormat;
  const normalizedBase: RequestedService = isTraining
    ? {
        ...service,
        candidates: "",
        competencies: [],
        classType,
        deliveryMode: service.deliveryMode.includes("delivery to confirm") ? "MS Teams" : service.deliveryMode,
        englishCandidates: "0",
        family,
        frenchCandidates: "0",
        fullTimeHoursPerDay: service.fullTimeHoursPerDay || "6",
        fullTimeHoursPerWeek: service.fullTimeHoursPerWeek || "30",
        groupSession: service.groupSession || "Summer",
        hours: service.hours || "1",
        partTimeClassDurationHours: service.partTimeClassDurationHours || "1.5",
        partTimeSessionsPerWeek: service.partTimeSessionsPerWeek || "2",
        participants: classType === "Individual" ? service.participants || "1" : service.participants || "2",
        reserveHours: classType === "Individual" ? service.reserveHours || "0" : "0",
        scheduleNotes: service.scheduleNotes,
        schedulePreferenceScope: service.schedulePreferenceScope ?? "whole-service",
        schedulePreferences: normalizeSchedulePreferences(service.schedulePreferences),
        learnerSchedulePreferences: normalizeLearnerSchedulePreferences({ ...service, family, classType }),
        source: sourceLabelForService({ ...service, family }),
        targetLanguages: service.targetLanguages.length > 0 ? service.targetLanguages : ["French"],
        trainingEndDate: service.trainingEndDate || "2026-12-19",
        trainingFormat,
        trainingStartDate: service.trainingStartDate || "2026-07-06",
        teachingWeeks: service.teachingWeeks || "12",
        bufferWeeks: service.bufferWeeks || "1",
        assessmentGroups: [],
        trainingGroups: normalizeTrainingGroups({ ...service, family, classType, trainingFormat }, family),
        overrideRateEnabled: service.pricingSource === "Non-SOA" ? service.overrideRateEnabled : false,
        overrideRate: service.pricingSource === "Non-SOA" ? service.overrideRate : "",
        overrideRateNote: service.pricingSource === "Non-SOA" ? service.overrideRateNote : "",
      }
    : {
        ...service,
        candidates: service.candidates || "1",
        classType: "Per candidate",
        deliveryMode: isNmso ? "Placement delivery to confirm" : "Assessment delivery to confirm",
        englishCandidates: service.englishCandidates || "0",
        family,
        frenchCandidates: service.frenchCandidates || service.candidates || "1",
        fullTimeHoursPerDay: "",
        fullTimeHoursPerWeek: "",
        groupSession: "",
        hours: "",
        partTimeClassDurationHours: "",
        partTimeSessionsPerWeek: "",
        participants: "",
        reserveHours: "",
        scheduleNotes: "",
        schedulePreferenceScope: "whole-service",
        schedulePreferences: defaultSchedulePreferences(),
        learnerSchedulePreferences: [],
        source: sourceLabelForService({ ...service, family }),
        targetLanguages: service.targetLanguages.length > 0 ? service.targetLanguages : ["French"],
        trainingFormat: "Not applicable",
        trainingEndDate: "",
        trainingStartDate: "",
        teachingWeeks: "",
        bufferWeeks: "",
        assessmentGroups: normalizeAssessmentGroups(service, family),
        trainingGroups: [],
        competencies: isNmso ? ["Reading", "Writing", "Oral"] : service.competencies,
        overrideRateEnabled: service.pricingSource === "Non-SOA" ? service.overrideRateEnabled : false,
        overrideRate: service.pricingSource === "Non-SOA" ? service.overrideRate : "",
        overrideRateNote: service.pricingSource === "Non-SOA" ? service.overrideRateNote : "",
      };

  const compatiblePriceLines = compatiblePriceLinesForService(normalizedBase);
  const priceLineStillCompatible = compatiblePriceLines.some((entry) => entry.code === normalizedBase.priceLineCode);

  return {
    ...normalizedBase,
    priceLineCode: priceLineStillCompatible ? normalizedBase.priceLineCode : compatiblePriceLines[0]?.code ?? "",
  };
}

function updateTargetLanguages(currentLanguages: TargetLanguage[], language: TargetLanguage) {
  if (currentLanguages.includes(language)) {
    const nextLanguages = currentLanguages.filter((item) => item !== language);
    return nextLanguages.length > 0 ? nextLanguages : currentLanguages;
  }

  return [...currentLanguages, language];
}

function toggleScheduleDay(days: DayPreference[], day: DayPreference) {
  return days.includes(day) ? days.filter((item) => item !== day) : [...days, day];
}

function SchedulePreferencesEditor({
  onChange,
  title,
  value,
}: {
  onChange: (updates: Partial<SchedulePreferences>) => void;
  title: string;
  value: SchedulePreferences;
}) {
  return (
    <fieldset className="schedule-preferences-editor">
      <legend>{title}</legend>
      <div className="schedule-day-groups">
        <div className="day-toggle-group" aria-label={`${title} unavailable days`}>
          <span>Unavailable days</span>
          {scheduleDayOptions.map((day) => (
            <button
              aria-pressed={value.excludedDays.includes(day)}
              key={day}
              onClick={() => onChange({ excludedDays: toggleScheduleDay(value.excludedDays, day) })}
              type="button"
            >
              {day}
            </button>
          ))}
        </div>
        <div className="day-toggle-group" aria-label={`${title} preferred days`}>
          <span>Preferred days</span>
          {scheduleDayOptions.map((day) => (
            <button
              aria-pressed={value.preferredDays.includes(day)}
              key={day}
              onClick={() => onChange({ preferredDays: toggleScheduleDay(value.preferredDays, day) })}
              type="button"
            >
              {day}
            </button>
          ))}
        </div>
      </div>
      <label className="holiday-toggle">
        <input
          checked={value.excludeStatutoryHolidays}
          onChange={(event) => onChange({ excludeStatutoryHolidays: event.target.checked })}
          type="checkbox"
        />
        Exclude statutory holidays
      </label>
      <div className="schedule-preference-grid">
        <label>
          Preferred time
          <select
            value={value.timePreference}
            onChange={(event) => onChange({ timePreference: event.target.value as ScheduleTimePreference })}
          >
            {scheduleTimePreferenceOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
        <label>
          Time zone for scheduling
          <select
            value={value.timeZone}
            onChange={(event) => onChange({ timeZone: event.target.value as ScheduleTimeZone })}
          >
            {scheduleTimeZoneOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
        <label>
          Location / delivery note
          <input
            value={value.locationNote}
            onChange={(event) => onChange({ locationNote: event.target.value })}
            placeholder="Ottawa, Vancouver, client site, MS Teams..."
          />
        </label>
        <label>
          Additional availability note
          <input
            value={value.notes}
            onChange={(event) => onChange({ notes: event.target.value })}
            placeholder="Availability, holidays, scheduling constraints..."
          />
        </label>
      </div>
      <p className="schedule-operational-note">
        Time zone is retained for scheduling after the contract is received. Scheduling is coordinated from Ottawa/Eastern time.
      </p>
    </fieldset>
  );
}

function assessmentCandidateCount(service: RequestedService) {
  if (service.assessmentGroups.length > 0) {
    return service.assessmentGroups.reduce((total, group) => total + numericValue(group.candidates), 0);
  }

  const english = Number.parseInt(service.englishCandidates || "0", 10);
  const french = Number.parseInt(service.frenchCandidates || "0", 10);
  return (Number.isNaN(english) ? 0 : english) + (Number.isNaN(french) ? 0 : french);
}

function numericValue(value: string) {
  const parsed = Number.parseFloat(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function displayHourValue(value: string | number) {
  const numeric = typeof value === "number" ? value : numericValue(value);
  return Number.isInteger(numeric) ? String(numeric) : numeric.toFixed(1);
}

function displayWeekValue(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function pluralizeCount(value: number, singular: string, plural = `${singular}s`) {
  const rounded = Math.round(value * 10) / 10;
  return `${displayHourValue(rounded)} ${rounded === 1 ? singular : plural}`;
}

function joinReadable(items: string[]) {
  if (items.length <= 1) {
    return items[0] ?? "";
  }

  if (items.length === 2) {
    return `${items[0]} and ${items[1]}`;
  }

  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

function weekLabel(value: number) {
  const rounded = Math.round(value * 10) / 10;
  return `${displayWeekValue(rounded)} ${rounded === 1 ? "week" : "weeks"}`;
}

function parseCadMinorUnits(rate: string) {
  const match = /^CAD\s+(\d+(?:\.\d{1,2})?)$/.exec(rate.trim());
  if (!match) {
    return null;
  }

  return Math.round(Number.parseFloat(match[1]) * 100);
}

function formatCadMinorUnits(minorUnits: number) {
  return `CAD ${(minorUnits / 100).toFixed(2)}`;
}

function formatCadMinorUnitsForProposal(minorUnits: number) {
  const [dollars, cents] = (minorUnits / 100).toFixed(2).split(".");
  const groupedDollars = dollars.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `CAD ${groupedDollars}.${cents}`;
}

function parseEditableRateMinorUnits(rate: string) {
  const normalized = rate.trim().replace(/^CAD\s+/i, "");
  const match = /^(\d+(?:\.\d{1,2})?)$/.exec(normalized);
  if (!match) {
    return null;
  }

  const value = Number.parseFloat(match[1]);
  return value > 0 ? Math.round(value * 100) : null;
}

function editableRateFromPriceLine(priceLine?: DemoPriceBookEntry) {
  const minorUnits = priceLine ? parseCadMinorUnits(priceLine.rate) : null;
  return minorUnits === null ? "" : (minorUnits / 100).toFixed(2);
}

function canOverrideRate(service: RequestedService, priceLine?: DemoPriceBookEntry) {
  return service.pricingSource === "Non-SOA" && parseCadMinorUnits(priceLine?.rate ?? "") !== null;
}

function effectiveRateMinorUnits(service: RequestedService, priceLine?: DemoPriceBookEntry) {
  if (!priceLine) {
    return null;
  }

  if (canOverrideRate(service, priceLine) && service.overrideRateEnabled) {
    return parseEditableRateMinorUnits(service.overrideRate);
  }

  return parseCadMinorUnits(priceLine.rate);
}

function effectiveRateLabel(service: RequestedService, priceLine?: DemoPriceBookEntry) {
  const minorUnits = effectiveRateMinorUnits(service, priceLine);
  return minorUnits === null ? "Rate to confirm" : formatCadMinorUnits(minorUnits);
}

function rateOverrideNeedsNote(service: RequestedService, priceLine?: DemoPriceBookEntry) {
  return canOverrideRate(service, priceLine) && service.overrideRateEnabled && service.overrideRateNote.trim() === "";
}

function proposalLanguageLabel(language: "English" | "Francais") {
  return language === "Francais" ? "Français" : language;
}

function billingQuantity(service: RequestedService, priceLine?: DemoPriceBookEntry) {
  if (service.family === "Second language training") {
    return quotedTrainingHours(service);
  }

  if (service.assessmentGroups.length > 0) {
    return service.assessmentGroups.reduce((total, group) => {
      const candidates = numericValue(group.candidates);
      if (priceLine?.unit === "Per selected competency") {
        return total + candidates * Math.max(group.competencies.length, 1);
      }

      return total + candidates;
    }, 0);
  }

  const candidates = assessmentCandidateCount(service);
  if (priceLine?.unit === "Per selected competency") {
    return candidates * Math.max(service.competencies.length, 1);
  }

  return candidates;
}

function billingQuantityLabel(service: RequestedService, priceLine?: DemoPriceBookEntry) {
  if (service.family === "Second language training") {
    return `${displayHourValue(quotedTrainingHours(service))} hours`;
  }

  if (service.assessmentGroups.length > 0) {
    const candidates = assessmentCandidateCount(service);
    if (priceLine?.unit === "Per selected competency") {
      return `${displayHourValue(billingQuantity(service, priceLine))} competency units across ${displayHourValue(candidates)} candidates`;
    }

    return `${displayHourValue(candidates)} candidates`;
  }

  const candidates = assessmentCandidateCount(service);
  if (priceLine?.unit === "Per selected competency") {
    return `${candidates} candidates x ${Math.max(service.competencies.length, 1)} competencies`;
  }

  return `${candidates} candidates`;
}

function estimatedAmount(service: RequestedService, priceLine?: DemoPriceBookEntry) {
  if (!priceLine) {
    return "Rate to confirm";
  }

  const minorUnits = effectiveRateMinorUnits(service, priceLine);
  if (minorUnits === null) {
    return "Rate to confirm";
  }

  return formatCadMinorUnits(Math.round(minorUnits * billingQuantity(service, priceLine)));
}

function participantCountForClassType(classType: string, currentParticipants: string) {
  const currentValue = Number.parseInt(currentParticipants || "0", 10);
  const safeCurrentValue = Number.isNaN(currentValue) ? 0 : currentValue;

  if (classType === "Individual") {
    return String(Math.max(1, safeCurrentValue || 1));
  }

  if ((classType === "Group" || classType === "Semi-private") && safeCurrentValue < 2) {
    return "2";
  }

  return currentParticipants;
}

function positiveIntegerValue(value: string) {
  const parsed = Number.parseInt(value || "0", 10);
  return Number.isNaN(parsed) || parsed < 1 ? 1 : parsed;
}

function optionalParticipantValue(value: string) {
  const parsed = Number.parseInt(value || "0", 10);
  return Number.isNaN(parsed) || parsed < 1 ? 0 : parsed;
}

function groupCapacityRule(priceLine?: DemoPriceBookEntry) {
  const searchableText = `${priceLine?.code ?? ""} ${priceLine?.selection ?? ""} ${priceLine?.descriptionRule ?? ""}`.toLowerCase();

  if (searchableText.includes("2 to 15 participants") || searchableText.includes("up to 15 participants")) {
    return { maximum: 15, source: "CCC SOA" };
  }

  return { maximum: 6, source: "default" };
}

function groupCapacityLabel(priceLine?: DemoPriceBookEntry) {
  const rule = groupCapacityRule(priceLine);
  return rule.source === "default" ? `${rule.maximum} default` : `${rule.maximum} under ${rule.source}`;
}

function recommendedGroupCount(group: TrainingGroup, priceLine?: DemoPriceBookEntry) {
  const expectedParticipants = expectedParticipantsValue(group, priceLine);
  if (expectedParticipants === 0) {
    return 1;
  }

  return Math.max(1, Math.ceil(expectedParticipants / groupCapacityRule(priceLine).maximum));
}

function configuredParticipantCapacity(group: TrainingGroup, priceLine?: DemoPriceBookEntry) {
  return positiveIntegerValue(group.groupCount) * groupCapacityRule(priceLine).maximum;
}

function expectedParticipantsValue(group: TrainingGroup, priceLine?: DemoPriceBookEntry) {
  if (group.participantsMode === "auto") {
    return configuredParticipantCapacity(group, priceLine);
  }

  return optionalParticipantValue(group.participants);
}

function expectedParticipantsInputValue(group: TrainingGroup, priceLine?: DemoPriceBookEntry) {
  return String(expectedParticipantsValue(group, priceLine));
}

function groupCapacityStatus(group: TrainingGroup, priceLine?: DemoPriceBookEntry) {
  const expectedParticipants = expectedParticipantsValue(group, priceLine);
  if (expectedParticipants === 0) {
    return "Enter expected participants to calculate a recommended group count.";
  }

  const capacity = configuredParticipantCapacity(group, priceLine);
  if (group.participantsMode === "auto") {
    return `Suggested from capacity: ${positiveIntegerValue(group.groupCount)} groups x ${groupCapacityRule(priceLine).maximum} max per group.`;
  }

  if (capacity < expectedParticipants) {
    return `Recommended groups: ${recommendedGroupCount(group, priceLine)} to cover ${expectedParticipants} expected participants.`;
  }

  return `Configured capacity covers up to ${capacity} participants.`;
}

function shouldShowParticipantsField(service: RequestedService) {
  return service.family === "Second language training" && service.classType !== "Individual" && !usesGroupProgramModel(service);
}

function shouldShowIndividualLearnersField(service: RequestedService) {
  return service.family === "Second language training" && service.classType === "Individual";
}

function participantSummaryForCount(value: string) {
  const participants = value || "To confirm";
  return participants === "1" ? "1 participant" : `${participants} participants`;
}

function totalGroupParticipants(service: RequestedService) {
  return service.trainingGroups.reduce((total, group) => total + expectedParticipantsValue(group), 0);
}

function totalGroupParticipantsForPriceLine(service: RequestedService, priceLine?: DemoPriceBookEntry) {
  return service.trainingGroups.reduce((total, group) => total + expectedParticipantsValue(group, priceLine), 0);
}

function totalGroupCount(service: RequestedService) {
  return service.trainingGroups.reduce((total, group) => total + positiveIntegerValue(group.groupCount), 0);
}

function participantSummary(service: RequestedService) {
  if (usesGroupProgramModel(service)) {
    const groupCount = service.trainingGroups.length;
    const groupLabel = groupCount === 1 ? "1 group" : `${groupCount} groups`;
    return `${groupLabel} / ${participantSummaryForCount(displayHourValue(totalGroupParticipants(service)))}`;
  }

  const participants = service.classType === "Individual" ? String(positiveIntegerValue(service.participants)) : service.participants || "To confirm";
  return participantSummaryForCount(participants);
}

function partTimeWeeklyHours(service: RequestedService) {
  return numericValue(service.partTimeSessionsPerWeek) * numericValue(service.partTimeClassDurationHours);
}

function groupPartTimeWeeklyHours(group: TrainingGroup) {
  return numericValue(group.partTimeSessionsPerWeek) * numericValue(group.partTimeClassDurationHours);
}

function usesGroupProgramModel(service: RequestedService) {
  return (
    service.family === "Second language training" &&
    service.classType === "Group" &&
    service.trainingFormat === "Part-time"
  );
}

function parseDateToUtc(value: string) {
  const [year, month, day] = value.split("-").map((part) => Number.parseInt(part, 10));
  if ([year, month, day].some((part) => Number.isNaN(part))) {
    return null;
  }

  return Date.UTC(year, month - 1, day);
}

function trainingDurationWeeks(service: RequestedService) {
  const start = parseDateToUtc(service.trainingStartDate);
  const end = parseDateToUtc(service.trainingEndDate);
  if (start === null || end === null || end < start) {
    return 0;
  }

  const startDate = new Date(start);
  const endDate = new Date(end);
  const startWeekOffset = (startDate.getUTCDay() + 6) % 7;
  const endWeekOffset = (endDate.getUTCDay() + 6) % 7;
  const startWeekMonday = start - startWeekOffset * 86_400_000;
  const endWeekMonday = end - endWeekOffset * 86_400_000;

  return Math.floor((endWeekMonday - startWeekMonday) / (7 * 86_400_000)) + 1;
}

function weeklyTrainingHours(service: RequestedService) {
  return service.trainingFormat === "Full-time" ? numericValue(service.fullTimeHoursPerWeek) : partTimeWeeklyHours(service);
}

function teachingWeeksForService(service: RequestedService) {
  return usesGroupProgramModel(service)
    ? service.trainingGroups.reduce((total, group) => total + numericValue(group.teachingWeeks), 0)
    : trainingDurationWeeks(service);
}

function calculatedTrainingGroupHours(group: TrainingGroup) {
  return Math.round(numericValue(group.teachingWeeks) * groupPartTimeWeeklyHours(group) * 10) / 10;
}

function calculatedTrainingGroupSetHours(group: TrainingGroup) {
  return Math.round(calculatedTrainingGroupHours(group) * positiveIntegerValue(group.groupCount) * 10) / 10;
}

function calendarSpanWeeksForGroup(group: TrainingGroup) {
  return numericValue(group.teachingWeeks) + numericValue(group.bufferWeeks);
}

function calculatedTrainingHours(service: RequestedService) {
  if (usesGroupProgramModel(service)) {
    return Math.round(service.trainingGroups.reduce((total, group) => total + calculatedTrainingGroupSetHours(group), 0) * 10) / 10;
  }

  const plannedHours = Math.round(teachingWeeksForService(service) * weeklyTrainingHours(service) * 10) / 10;
  return service.classType === "Individual" ? plannedHours * positiveIntegerValue(service.participants) : plannedHours;
}

function calculatedTrainingHoursPerIndividualLearner(service: RequestedService) {
  return Math.round(teachingWeeksForService(service) * weeklyTrainingHours(service) * 10) / 10;
}

function durationWeeksLabel(service: RequestedService) {
  return weekLabel(trainingDurationWeeks(service));
}

function reserveTrainingHours(service: RequestedService) {
  return service.classType === "Individual" ? numericValue(service.reserveHours) * positiveIntegerValue(service.participants) : 0;
}

function reserveTrainingHoursPerIndividualLearner(service: RequestedService) {
  return service.classType === "Individual" ? numericValue(service.reserveHours) : 0;
}

function quotedTrainingHours(service: RequestedService) {
  return Math.round((calculatedTrainingHours(service) + reserveTrainingHours(service)) * 10) / 10;
}

function scheduleSummary(service: RequestedService) {
  if (service.trainingFormat === "Full-time") {
    return `5 days per week / ${displayHourValue(service.fullTimeHoursPerDay)} h per day / ${displayHourValue(service.fullTimeHoursPerWeek)} h per week`;
  }

  return `${service.partTimeSessionsPerWeek}x per week / ${displayHourValue(service.partTimeClassDurationHours)} h classes / ${displayHourValue(partTimeWeeklyHours(service))} h per week`;
}

function trainingGroupScheduleSummary(group: TrainingGroup) {
  return `${group.partTimeSessionsPerWeek}x per week / ${displayHourValue(group.partTimeClassDurationHours)} h classes / ${displayHourValue(groupPartTimeWeeklyHours(group))} h per week`;
}

function schedulePreferenceSummary(preferences: SchedulePreferences) {
  const details: string[] = [];
  const defaultPreferences = defaultSchedulePreferences();
  const unavailableDaysWereCustomized =
    preferences.excludedDays.length !== defaultPreferences.excludedDays.length ||
    preferences.excludedDays.some((day) => !defaultPreferences.excludedDays.includes(day));

  if (preferences.preferredDays.length > 0) {
    details.push(`preferred days: ${preferences.preferredDays.join(", ")}`);
  }

  if (unavailableDaysWereCustomized && preferences.excludedDays.length > 0) {
    details.push(`unavailable days: ${preferences.excludedDays.join(", ")}`);
  }

  if (preferences.timePreference !== "No preference") {
    details.push(`${preferences.timePreference} preferred`);
  }

  if (preferences.timeZone !== defaultPreferences.timeZone) {
    details.push(`scheduling time zone: ${preferences.timeZone}`);
  }

  if (preferences.locationNote.trim() !== "") {
    details.push(preferences.locationNote.trim());
  }

  if (preferences.notes.trim() !== "") {
    details.push(preferences.notes.trim());
  }

  return details.join("; ");
}

function serviceSchedulePreferenceText(service: RequestedService) {
  const preferenceText = schedulePreferenceSummary(service.schedulePreferences);
  return preferenceText === "" ? "" : ` Availability and scheduling preferences: ${preferenceText}.`;
}

function groupSchedulePreferenceText(group: TrainingGroup) {
  const preferenceText = schedulePreferenceSummary(group.schedulePreferences);
  return preferenceText === "" ? "" : ` Availability and scheduling preferences for this group set: ${preferenceText}.`;
}

function learnerSchedulePreferenceText(service: RequestedService) {
  if (service.classType !== "Individual" || service.schedulePreferenceScope !== "by-learner-or-group") {
    return serviceSchedulePreferenceText(service);
  }

  const learnerDetails = normalizeLearnerSchedulePreferences(service)
    .map((preferences, index) => {
      const preferenceText = schedulePreferenceSummary(preferences);
      return preferenceText === "" ? "" : `Learner ${index + 1}: ${preferenceText}`;
    })
    .filter(Boolean);

  return learnerDetails.length === 0 ? "" : ` Availability and scheduling preferences: ${learnerDetails.join("; ")}.`;
}

function estimatedAmountMinorUnits(service: RequestedService, priceLine?: DemoPriceBookEntry) {
  if (!priceLine) {
    return null;
  }

  const minorUnits = effectiveRateMinorUnits(service, priceLine);
  if (minorUnits === null) {
    return null;
  }

  return Math.round(minorUnits * billingQuantity(service, priceLine));
}

function serviceConfigurationSummary(service: RequestedService, priceLine?: DemoPriceBookEntry) {
  if (service.family === "Second language training") {
    if (usesGroupProgramModel(service)) {
      return service.trainingGroups
        .map(
          (group, index) =>
            `Group set ${index + 1}: ${positiveIntegerValue(group.groupCount)} groups / ${group.language} / ${participantSummaryForCount(displayHourValue(expectedParticipantsValue(group, priceLine)))} expected total / max ${groupCapacityLabel(priceLine)} per group / ${recommendedGroupCount(group, priceLine)} recommended groups / ${group.groupSession} / ${weekLabel(numericValue(group.teachingWeeks))} teaching / ${weekLabel(numericValue(group.bufferWeeks))} buffer / ${trainingGroupScheduleSummary(group)} / ${group.deliveryMode} / ${displayHourValue(calculatedTrainingGroupHours(group))} h per group / ${displayHourValue(calculatedTrainingGroupSetHours(group))} h total`,
        )
        .join(" / ");
    }

    const reserveHours = reserveTrainingHours(service);
    const individualLearners = service.classType === "Individual" ? positiveIntegerValue(service.participants) : 0;
    const hoursSummary =
      service.classType === "Individual" && individualLearners > 1
        ? `${displayHourValue(calculatedTrainingHoursPerIndividualLearner(service))} scheduled hours per learner x ${individualLearners} learners${reserveHours > 0 ? ` + ${displayHourValue(reserveTrainingHoursPerIndividualLearner(service))} reserve hours per learner` : ""} = ${displayHourValue(quotedTrainingHours(service))} total hours`
        : reserveHours > 0
          ? `${displayHourValue(calculatedTrainingHours(service))} scheduled + ${displayHourValue(reserveHours)} reserve = ${displayHourValue(quotedTrainingHours(service))} total hours`
          : `${displayHourValue(quotedTrainingHours(service))} total hours`;
    const groupProgramSummary = usesGroupProgramModel(service)
      ? ` / ${service.groupSession} / ${weekLabel(teachingWeeksForService(service))} teaching / ${weekLabel(numericValue(service.bufferWeeks))} buffer`
      : "";
    return `${service.targetLanguages.join(" + ")} / ${participantSummary(service)} / ${service.classType} / ${service.trainingFormat}${groupProgramSummary} / ${scheduleSummary(service)} / ${service.deliveryMode} / ${hoursSummary}`;
  }

  if (service.assessmentGroups.length > 0) {
    return service.assessmentGroups
      .map((group) => `${group.language} ${group.candidates}: ${group.competencies.join(", ")}`)
      .join(" / ");
  }

  return `English ${service.englishCandidates || "0"} / French ${service.frenchCandidates || "0"} / ${service.competencies.join(", ")}`;
}

function serviceFamilyProposalLabel(family: ServiceFamily) {
  const labels: Record<ServiceFamily, string> = {
    "Assessment / evaluation / placement": "assessment, evaluation, or placement services",
    "CCC assessment": "CCC assessment services",
    "Diagnostic assessment": "diagnostic assessment services",
    "NMSO placement test": "NMSO placement testing",
    "Placement test": "placement testing",
    "Second language training": "second-language training",
  };

  return labels[family];
}

function classSessionsLabel(value: string | number) {
  const count = numericValue(String(value));
  return `${displayHourValue(count)} ${count === 1 ? "class" : "classes"} per week`;
}

function clientFacingTrainingSchedule(service: RequestedService) {
  if (service.trainingFormat === "Full-time") {
    return `five days per week, ${displayHourValue(service.fullTimeHoursPerDay)} hours per day (${displayHourValue(service.fullTimeHoursPerWeek)} hours per week)`;
  }

  return `${classSessionsLabel(service.partTimeSessionsPerWeek)} of ${displayHourValue(service.partTimeClassDurationHours)} hours each (${displayHourValue(partTimeWeeklyHours(service))} hours per week)`;
}

function clientFacingGroupSchedule(group: TrainingGroup) {
  return `${classSessionsLabel(group.partTimeSessionsPerWeek)} of ${displayHourValue(group.partTimeClassDurationHours)} hours each (${displayHourValue(groupPartTimeWeeklyHours(group))} hours per week)`;
}

function proposalOverviewText(services: RequestedService[]) {
  if (services.length === 0) {
    return "Add the requested services to prepare a client-ready proposal overview, training details, and quotation.";
  }

  const serviceNames = joinReadable(Array.from(new Set(services.map((service) => serviceFamilyProposalLabel(service.family)))));
  const trainingServices = services.filter((service) => service.family === "Second language training");
  const assessmentServices = services.filter((service) => service.family !== "Second language training");
  const sentences = [
    `Knowledge Circle Learning Services Inc. is pleased to provide this proposal for ${serviceNames}.`,
  ];

  if (trainingServices.length > 0) {
    const metrics = trainingPlanMetrics(trainingServices);
    const hours = trainingServices.reduce((total, service) => total + quotedTrainingHours(service), 0);

    if (
      metrics.groupCount > 0 &&
      metrics.individualCount === 0 &&
      metrics.semiPrivateCount === 0 &&
      metrics.otherTrainingCount === 0
    ) {
      sentences.push(
        `The current training plan includes ${pluralizeCount(metrics.groupCount, "group")} with ${pluralizeCount(metrics.groupParticipants, "expected participant")} and an estimated ${pluralizeCount(hours, "billable training hour")}.`,
      );
    } else if (metrics.labelParts.length > 0) {
      if (
        metrics.groupCount === 0 &&
        metrics.individualCount > 0 &&
        metrics.semiPrivateCount === 0 &&
        metrics.otherTrainingCount === 0
      ) {
        sentences.push(
          `The current training plan includes individual training for ${pluralizeCount(metrics.individualCount, "learner")} and an estimated ${pluralizeCount(hours, "billable training hour")}.`,
        );
      } else {
        sentences.push(
          `The current training plan includes ${joinReadable(metrics.labelParts)}, covering ${pluralizeCount(metrics.totalParticipants, "participant")} and an estimated ${pluralizeCount(hours, "billable training hour")}.`,
        );
      }
    } else {
      sentences.push(
        `The current training plan includes ${pluralizeCount(trainingServices.length, "training service")} with an estimated ${pluralizeCount(hours, "billable training hour")}.`,
      );
    }
  }

  if (assessmentServices.length > 0) {
    sentences.push(
      "Assessment and placement items are organized by language, candidate quantity, and selected competencies so the quotation remains clear.",
    );
  }

  return sentences.join(" ");
}

function proposalTrainingDetailText(service: RequestedService, priceLine?: DemoPriceBookEntry) {
  if (service.family === "Second language training") {
    if (usesGroupProgramModel(service)) {
      return service.trainingGroups
        .map((group) => {
          const groupCount = positiveIntegerValue(group.groupCount);
          const expectedParticipants = expectedParticipantsValue(group, priceLine);
          const capacityRule = groupCapacityRule(priceLine);
          const capacityText =
            capacityRule.source === "default"
              ? `Capacity is currently planned at up to ${capacityRule.maximum} participants per group until a source-specific limit is confirmed.`
              : `The selected source supports up to ${capacityRule.maximum} participants per group.`;

          return `${group.language} part-time group training for ${pluralizeCount(groupCount, "group")} in the ${group.groupSession.toLowerCase()} session. Teaching is planned for ${weekLabel(numericValue(group.teachingWeeks))} with ${weekLabel(numericValue(group.bufferWeeks))} of scheduling buffer, delivered by ${group.deliveryMode} at ${clientFacingGroupSchedule(group)}. This represents ${pluralizeCount(calculatedTrainingGroupHours(group), "hour")} per group and ${pluralizeCount(calculatedTrainingGroupSetHours(group), "billable hour")} in total for ${pluralizeCount(expectedParticipants, "expected participant")}. ${capacityText}${service.schedulePreferenceScope === "by-learner-or-group" ? groupSchedulePreferenceText(group) : ""}`;
        })
        .join(" ") + (service.schedulePreferenceScope === "whole-service" ? serviceSchedulePreferenceText(service) : "");
    }

    const languageText = joinReadable(service.targetLanguages);
    const individualLearners = service.classType === "Individual" ? positiveIntegerValue(service.participants) : 0;
    const scheduledHours =
      service.classType === "Individual" ? calculatedTrainingHoursPerIndividualLearner(service) : calculatedTrainingHours(service);
    const reserveHours =
      service.classType === "Individual" ? reserveTrainingHoursPerIndividualLearner(service) : reserveTrainingHours(service);
    const reserveText =
      reserveHours > 0
        ? ` An additional ${pluralizeCount(reserveHours, "reserve hour")} per learner is included for individual training contingencies, for a total of ${pluralizeCount(quotedTrainingHours(service), "billable hour")}.`
        : "";
    const learnerText =
      service.classType === "Individual" && individualLearners > 1
        ? ` for ${pluralizeCount(individualLearners, "learner")}`
        : "";
    const scheduledText =
      service.classType === "Individual"
        ? `${pluralizeCount(scheduledHours, "scheduled hour")} per learner`
        : pluralizeCount(scheduledHours, "scheduled hour");
    const totalText =
      service.classType === "Individual" && individualLearners > 1
        ? `, representing ${pluralizeCount(quotedTrainingHours(service), "billable hour")} in total`
        : "";

    return `${languageText} ${service.classType.toLowerCase()} ${service.trainingFormat.toLowerCase()} training${learnerText} delivered by ${service.deliveryMode}. The schedule is planned for ${durationWeeksLabel(service)} at ${clientFacingTrainingSchedule(service)}, for ${scheduledText}${totalText}.${reserveText}${learnerSchedulePreferenceText(service)}`;
  }

  if (service.assessmentGroups.length > 0) {
    const groupText = service.assessmentGroups.map((group) => {
      const competencies = joinReadable(group.competencies);
      return `${pluralizeCount(numericValue(group.candidates), "candidate")} in ${group.language} for ${competencies}`;
    });

    return `${service.family} configured for ${joinReadable(groupText)}. Pricing is based on the selected Price Book unit and the competencies included for each candidate group.`;
  }

  return `${service.family} configured for ${pluralizeCount(assessmentCandidateCount(service), "candidate")} and ${joinReadable(service.competencies)}.`;
}

function quotationDescriptionText(service: RequestedService, priceLine?: DemoPriceBookEntry) {
  if (service.family === "Second language training") {
    if (usesGroupProgramModel(service)) {
      const groupCount = totalGroupCount(service);
      const expectedParticipants = totalGroupParticipantsForPriceLine(service, priceLine);
      const languages = joinReadable(Array.from(new Set(service.trainingGroups.map((group) => group.language))));
      const deliveryModes = joinReadable(Array.from(new Set(service.trainingGroups.map((group) => group.deliveryMode))));

      return `${languages} group training, ${deliveryModes}, ${pluralizeCount(groupCount, "group")}, ${pluralizeCount(expectedParticipants, "expected participant")}.`;
    }

    const learnerText =
      service.classType === "Individual"
        ? `, ${pluralizeCount(positiveIntegerValue(service.participants), "learner")}`
        : "";
    return `${joinReadable(service.targetLanguages)} ${service.classType.toLowerCase()} ${service.trainingFormat.toLowerCase()} training, ${service.deliveryMode}${learnerText}.`;
  }

  if (service.assessmentGroups.length > 0) {
    return `${service.family}, ${pluralizeCount(assessmentCandidateCount(service), "candidate")}, configured by selected competencies.`;
  }

  return `${service.family}, ${pluralizeCount(assessmentCandidateCount(service), "candidate")}.`;
}

function trainingPlanMetrics(trainingServices: RequestedService[]) {
  let groupCount = 0;
  let groupParticipants = 0;
  let individualCount = 0;
  let semiPrivateCount = 0;
  let semiPrivateParticipants = 0;
  let otherTrainingCount = 0;
  let otherParticipants = 0;

  trainingServices.forEach((service) => {
    if (service.classType === "Group") {
      if (usesGroupProgramModel(service)) {
        const priceLine = selectedPriceLineForService(service);
        groupCount += totalGroupCount(service);
        groupParticipants += totalGroupParticipantsForPriceLine(service, priceLine);
      } else {
        groupCount += 1;
        groupParticipants += optionalParticipantValue(service.participants);
      }
      return;
    }

    if (service.classType === "Individual") {
      individualCount += positiveIntegerValue(service.participants);
      return;
    }

    if (service.classType === "Semi-private") {
      semiPrivateCount += 1;
      semiPrivateParticipants += optionalParticipantValue(service.participants) || 2;
      return;
    }

    otherTrainingCount += 1;
    otherParticipants += optionalParticipantValue(service.participants);
  });

  const labelParts: string[] = [];
  const summaryParts: string[] = [];
  if (groupCount > 0) {
    labelParts.push(`${groupCount} ${groupCount === 1 ? "group" : "groups"}`);
    summaryParts.push(`${groupCount} ${groupCount === 1 ? "group" : "groups"}`);
  }
  if (individualCount > 0) {
    labelParts.push(`individual training for ${pluralizeCount(individualCount, "learner")}`);
    summaryParts.push(`${individualCount} individual ${individualCount === 1 ? "learner" : "learners"}`);
  }
  if (semiPrivateCount > 0) {
    labelParts.push(`${semiPrivateCount} semi-private ${semiPrivateCount === 1 ? "service" : "services"}`);
    summaryParts.push(`${semiPrivateCount} semi-private ${semiPrivateCount === 1 ? "service" : "services"}`);
  }
  if (otherTrainingCount > 0) {
    labelParts.push(`${otherTrainingCount} other training ${otherTrainingCount === 1 ? "service" : "services"}`);
    summaryParts.push(`${otherTrainingCount} other training ${otherTrainingCount === 1 ? "service" : "services"}`);
  }

  return {
    groupCount,
    groupParticipants,
    individualCount,
    labelParts,
    otherTrainingCount,
    semiPrivateCount,
    summaryParts,
    totalParticipants: groupParticipants + individualCount + semiPrivateParticipants + otherParticipants,
  };
}

function quoteSummaryTrainingText(services: RequestedService[]) {
  if (services.length === 0) {
    return "No services added";
  }

  const trainingServices = services.filter((service) => service.family === "Second language training");
  if (trainingServices.length === 0) {
    return "No training services selected";
  }

  const metrics = trainingPlanMetrics(trainingServices);
  const hours = trainingServices.reduce((total, service) => total + quotedTrainingHours(service), 0);

  if (
    metrics.groupCount > 0 &&
    metrics.individualCount === 0 &&
    metrics.semiPrivateCount === 0 &&
    metrics.otherTrainingCount === 0
  ) {
    const groupLabel = metrics.groupCount === 1 ? "1 group" : `${metrics.groupCount} groups`;
    return `${groupLabel} / ${displayHourValue(metrics.groupParticipants)} expected participants / ${displayHourValue(hours)} hours`;
  }

  if (metrics.summaryParts.length > 0) {
    return `${metrics.summaryParts.join(" / ")} / ${displayHourValue(metrics.totalParticipants)} participants / ${displayHourValue(hours)} hours`;
  }

  return `${trainingServices.length} training service${trainingServices.length === 1 ? "" : "s"} / ${displayHourValue(hours)} hours`;
}

interface ProposalEditorPageProps {
  mode: "new" | "edit";
  proposalId?: string;
  onBackToProposals: () => void;
  onPrototypeAction: (actionName: string) => void;
}

export function ProposalEditorPage({
  mode,
  onBackToProposals,
  onPrototypeAction,
  proposalId,
}: ProposalEditorPageProps) {
  const [activeStepId, setActiveStepId] = useState(editorSteps[0].id);
  const [clientDraft, setClientDraft] = useState<ClientDraft>({
    contactDetails: "Contact details",
    contactName: "Program Coordinator",
    organizationName: "Federal Department",
  });
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [proposalBasics, setProposalBasics] = useState<ProposalBasicsDraft>(defaultProposalBasics);
  const [proposalLanguage, setProposalLanguage] = useState<"English" | "Francais">("English");
  const [requestedServices, setRequestedServices] = useState<RequestedService[]>(initialRequestedServices);

  const proposal = useMemo(
    () => demoProposals.find((item) => item.id === proposalId) ?? demoProposals[0],
    [proposalId],
  );

  const manualQuoteId = proposalBasics.quoteId.trim();
  const hasValidQuoteId = isQuoteIdValid(manualQuoteId);
  const quoteId = mode === "new" ? manualQuoteId || "Quote ID required" : proposal.id;
  const canGeneratePdf = mode === "edit" || hasValidQuoteId;
  const proposalTitle = mode === "new" ? proposalBasics.proposalTitle : proposal.title;
  const activeStepIndex = editorSteps.findIndex((step) => step.id === activeStepId);
  const nextStep = editorSteps[Math.min(activeStepIndex + 1, editorSteps.length - 1)];
  const previousStep = editorSteps[Math.max(activeStepIndex - 1, 0)];
  const isFinalStep = activeStepIndex === editorSteps.length - 1;
  const liveQuoteSummary = useMemo(
    () => ({
      ...quoteSummary,
      client: clientDraft.organizationName.trim() || "Organization to confirm",
      contact: clientDraft.contactName.trim() || "Contact to confirm",
    }),
    [clientDraft.contactName, clientDraft.organizationName],
  );
  const stepsWithState = editorSteps.map((step, index) => ({
    ...step,
    state:
      index < activeStepIndex
        ? ("completed" as const)
        : step.id === "pricing" && activeStepId === "basics"
          ? ("pending" as const)
          : ("pending" as const),
  }));

function addRequestedService() {
    const nextIndex = requestedServices.length + 1;
    const nextService =
      requestedServices.length === 0
        ? defaultLanguageTrainingService(`service-${nextIndex}`)
        : defaultAssessmentService(`service-${nextIndex}`);

    setRequestedServices([
      ...requestedServices,
      nextService,
    ]);
  }

  function updateRequestedService(serviceId: string, updates: Partial<RequestedService>) {
    setRequestedServices((services) =>
      services.map((service) => (service.id === serviceId ? normalizeRequestedService({ ...service, ...updates }) : service)),
    );
  }

  function removeRequestedService(serviceId: string) {
    setRequestedServices((services) => services.filter((service) => service.id !== serviceId));
  }

  return (
    <section aria-labelledby="proposal-editor-title" className="proposal-editor">
      <div className="editor-workspace">
        <header className="editor-header">
          <div>
            <nav aria-label="Breadcrumb" className="editor-breadcrumb">
              <button onClick={onBackToProposals} type="button">
                Proposals
              </button>
              <span aria-hidden="true">/</span>
              <span>{mode === "new" ? "New proposal" : proposal.id}</span>
            </nav>
            <div className="editor-title-row">
              <h2 id="proposal-editor-title">{mode === "new" ? "New Proposal" : proposal.title}</h2>
              <StatusBadge tone="neutral">{mode === "new" ? "Draft" : proposal.status}</StatusBadge>
            </div>
            <p className="editor-metadata">
              {quoteId}
              {mode === "edit" && ` - ${proposal.revision}`}
            </p>
          </div>
          <div className="editor-header-actions">
            <LocalDataBanner variant="compact" />
            <span className="save-indicator" title="Prototype draft state. Use the external quote register until server persistence exists.">
              Local draft
            </span>
            <button className="button-secondary" onClick={() => setIsPreviewOpen(true)} type="button">
              Preview
            </button>
            <button
              aria-label="More proposal actions"
              className="icon-button"
              onClick={() => onPrototypeAction("More proposal actions")}
              title="More proposal actions"
              type="button"
            >
              ...
            </button>
          </div>
        </header>

        <Stepper activeStepId={activeStepId} onStepChange={setActiveStepId} steps={stepsWithState} />

        <div className="editor-main">
          {activeStepId === "basics" && (
            <BasicsStep
              clientDraft={clientDraft}
              onClientDraftChange={(updates) => setClientDraft((current) => ({ ...current, ...updates }))}
              onProposalBasicsChange={(updates) => setProposalBasics((current) => ({ ...current, ...updates }))}
              proposalBasics={proposalBasics}
            />
          )}
          {activeStepId === "training-phases" && (
            <ServicesTrainingStep
              onAddService={addRequestedService}
              onRemoveService={removeRequestedService}
              onUpdateService={updateRequestedService}
              requestedServices={requestedServices}
            />
          )}
          {activeStepId === "pricing" && <PricingStep requestedServices={requestedServices} />}
          {activeStepId === "content" && (
            <ContentStep
              onProposalLanguageChange={setProposalLanguage}
              proposalLanguage={proposalLanguage}
              requestedServices={requestedServices}
            />
          )}
        </div>
        <footer className="sticky-editor-actions">
          <button
            className="button-secondary"
            onClick={() => {
              if (activeStepIndex === 0) {
                onBackToProposals();
              } else {
                setActiveStepId(previousStep.id);
              }
            }}
            type="button"
          >
            Back
          </button>
          <div>
            <button className="button-secondary" onClick={() => onPrototypeAction("Save draft")} type="button">
              Save draft
            </button>
            <button
              className="button-primary"
              onClick={() => {
                if (isFinalStep) {
                  setIsPreviewOpen(true);
                } else {
                  setActiveStepId(nextStep.id);
                }
              }}
              type="button"
            >
              {activeStepId === "basics"
                ? "Continue to Training"
                : isFinalStep
                  ? "Preview proposal"
                  : `Continue to ${nextStep.shortLabel ?? nextStep.label}`}
            </button>
          </div>
        </footer>
      </div>
      <QuoteSummary
        activeStepId={activeStepId}
        onOpenPreview={() => setIsPreviewOpen(true)}
        requestedServices={requestedServices}
        summary={liveQuoteSummary}
        trainingSummary={quoteSummaryTrainingText(requestedServices)}
        previewTitle={proposalTitle}
      />
      {isPreviewOpen && (
        <ProposalPreviewDialog
          onClose={() => setIsPreviewOpen(false)}
          quoteDate={proposalBasics.quoteDate}
          quoteId={quoteId}
          canGeneratePdf={canGeneratePdf}
          requestedServices={requestedServices}
          summary={liveQuoteSummary}
          title={proposalTitle}
        />
      )}
    </section>
  );
}

function BasicsStep({
  clientDraft,
  onClientDraftChange,
  onProposalBasicsChange,
  proposalBasics,
}: {
  clientDraft: ClientDraft;
  onClientDraftChange: (updates: Partial<ClientDraft>) => void;
  onProposalBasicsChange: (updates: Partial<ProposalBasicsDraft>) => void;
  proposalBasics: ProposalBasicsDraft;
}) {
  return (
    <div className="page-stack">
      <section className="section-card basics-card" aria-label="Proposal basics">
      <div className="basics-form">
        <fieldset className="form-section">
          <legend>Proposal</legend>
          <div className="form-grid">
            <label>
              Quote date required
              <input
                onChange={(event) => onProposalBasicsChange({ quoteDate: event.target.value })}
                type="date"
                value={proposalBasics.quoteDate}
              />
            </label>
            <div className="field-stack">
              <label htmlFor="quote-id">Quote ID required</label>
              <input
                aria-describedby="quote-id-help"
                aria-invalid={proposalBasics.quoteId.length > 0 && !isQuoteIdValid(proposalBasics.quoteId)}
                id="quote-id"
                onChange={(event) => onProposalBasicsChange({ quoteId: event.target.value })}
                placeholder="Example: KC-2026-0623-01"
                value={proposalBasics.quoteId}
              />
              <span className="field-help" id="quote-id-help">
                Use Kevin's external quote register. Format: KC-YYYY-MMDD-XX. Do not reuse an ID.
              </span>
            </div>
            <label className="full-width">
              Proposal title
              <input
                onChange={(event) => onProposalBasicsChange({ proposalTitle: event.target.value })}
                value={proposalBasics.proposalTitle}
              />
            </label>
          </div>
        </fieldset>
      </div>
      </section>
      <ClientStep clientDraft={clientDraft} onClientDraftChange={onClientDraftChange} />
    </div>
  );
}

function ClientStep({
  clientDraft,
  onClientDraftChange,
}: {
  clientDraft: ClientDraft;
  onClientDraftChange: (updates: Partial<ClientDraft>) => void;
}) {
  return (
    <SectionCard title="Client and contact">
      <div className="form-grid">
        <label className="full-width">
          Organization name
          <input
            onChange={(event) => onClientDraftChange({ organizationName: event.target.value })}
            placeholder="Paste the department, ministry, or organization name"
            value={clientDraft.organizationName}
          />
        </label>
        <label>
          Contact name
          <input
            onChange={(event) => onClientDraftChange({ contactName: event.target.value })}
            placeholder="Paste the contact name or role"
            value={clientDraft.contactName}
          />
        </label>
        <label>
          Contact details
          <textarea
            onChange={(event) => onClientDraftChange({ contactDetails: event.target.value })}
            rows={4}
            value={clientDraft.contactDetails}
          />
        </label>
      </div>
    </SectionCard>
  );
}

function ServicesTrainingStep({
  onAddService,
  onRemoveService,
  onUpdateService,
  requestedServices,
}: {
  requestedServices: RequestedService[];
  onAddService: () => void;
  onRemoveService: (serviceId: string) => void;
  onUpdateService: (serviceId: string, updates: Partial<RequestedService>) => void;
}) {
  const previousServiceCount = useRef(requestedServices.length);

  function focusService(serviceId: string) {
    const element = document.getElementById(serviceCardId(serviceId));
    element?.scrollIntoView?.({ block: "start", behavior: "smooth" });
    element?.focus({ preventScroll: true });
  }

  useEffect(() => {
    if (requestedServices.length > previousServiceCount.current) {
      const addedService = requestedServices[requestedServices.length - 1];
      if (addedService) {
        focusService(addedService.id);
      }
    }
    previousServiceCount.current = requestedServices.length;
  }, [requestedServices]);

  return (
    <div className="page-stack">
      <SectionCard
        actions={
          <button className="button-primary" onClick={onAddService} type="button">
            Add service
          </button>
        }
        title="Requested services"
      >
        {requestedServices.length > 1 && (
          <nav aria-label="Requested service shortcuts" className="service-shortcuts">
            <span>Jump to</span>
            <div>
              {requestedServices.map((service, index) => (
                <button
                  key={service.id}
                  onClick={() => focusService(service.id)}
                  type="button"
                >
                  Service {index + 1}: {service.family}
                </button>
              ))}
            </div>
          </nav>
        )}
        <div className="service-builder-list">
          {requestedServices.length === 0 && (
            <div className="empty-state service-empty-state">
              <strong>No services added yet</strong>
              <p>Start with Add service, then choose the pricing source, service type, schedule, and quantity.</p>
            </div>
          )}
          {requestedServices.map((service, index) => (
            <ServiceBuilderCard
              index={index}
              key={service.id}
              onRemove={() => onRemoveService(service.id)}
              onUpdate={(updates) => onUpdateService(service.id, updates)}
              service={service}
            />
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

function ServiceBuilderCard({
  index,
  onRemove,
  onUpdate,
  service,
}: {
  index: number;
  service: RequestedService;
  onRemove: () => void;
  onUpdate: (updates: Partial<RequestedService>) => void;
}) {
  const selectedPriceLine = selectedPriceLineForService(service);
  const isTraining = service.family === "Second language training";
  const isNmso = service.family === "NMSO placement test";
  const isGroupPartTimeProgram = usesGroupProgramModel(service);
  const availableFamilies = availableServiceFamiliesForService(service);
  const trainingClassTypeOptions =
    isTraining && availableTrainingClassTypesForService(service).length > 0
      ? availableTrainingClassTypesForService(service)
      : ["Individual", "Group", "Semi-private", "Any"];
  const trainingFormatOptions =
    isTraining && availableTrainingFormatsForService(service).length > 0
      ? availableTrainingFormatsForService(service)
      : ["Full-time", "Part-time"];

  function updateFamily(family: ServiceFamily) {
    onUpdate({ family, priceLineCode: "" });
  }

  function updatePricingSource(pricingSource: PricingSource) {
    const soaSourceCode = pricingSource === "SOA" ? "SOA-CW2379765" : "";
    onUpdate({
      pricingSource,
      soaSourceCode,
      family: defaultFamilyForSource(pricingSource, soaSourceCode),
      overrideRateEnabled: false,
      overrideRate: "",
      overrideRateNote: "",
      priceLineCode: "",
    });
  }

  function updateSoaSource(soaSourceCode: string) {
    onUpdate({
      soaSourceCode,
      family: defaultFamilyForSource("SOA", soaSourceCode),
      priceLineCode: "",
    });
  }

  function addAssessmentGroup() {
    onUpdate({
      assessmentGroups: [
        ...service.assessmentGroups,
        {
          id: `group-${service.assessmentGroups.length + 1}`,
          language: "French",
          candidates: "1",
          competencies: isNmso ? [...competencyOptions] : ["Reading"],
        },
      ],
    });
  }

  function updateAssessmentGroup(groupId: string, updates: Partial<AssessmentGroup>) {
    onUpdate({
      assessmentGroups: service.assessmentGroups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              ...updates,
              competencies: isNmso ? [...competencyOptions] : updates.competencies ?? group.competencies,
            }
          : group,
      ),
    });
  }

  function removeAssessmentGroup(groupId: string) {
    if (service.assessmentGroups.length <= 1) {
      return;
    }

    onUpdate({
      assessmentGroups: service.assessmentGroups.filter((group) => group.id !== groupId),
    });
  }

  function addTrainingGroup() {
    const baseGroup = service.trainingGroups[service.trainingGroups.length - 1] ?? defaultTrainingGroups(service)[0];
    onUpdate({
      trainingGroups: [
        ...service.trainingGroups,
        {
          ...baseGroup,
          id: `training-group-${service.trainingGroups.length + 1}`,
          groupCount: "1",
          scheduleNotes: "",
          schedulePreferences: defaultSchedulePreferences(),
        },
      ],
    });
  }

  function updateTrainingGroup(groupId: string, updates: Partial<TrainingGroup>) {
    onUpdate({
      trainingGroups: service.trainingGroups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              ...updates,
              groupCount: updates.groupCount !== undefined ? String(positiveIntegerValue(updates.groupCount)) : group.groupCount,
              participants: updates.participants !== undefined ? updates.participants : group.participants,
              participantsMode: updates.participants !== undefined ? "manual" : updates.participantsMode ?? group.participantsMode,
            }
          : group,
      ),
    });
  }

  function removeTrainingGroup(groupId: string) {
    if (service.trainingGroups.length <= 1) {
      return;
    }

    onUpdate({
      trainingGroups: service.trainingGroups.filter((group) => group.id !== groupId),
    });
  }

  function toggleAssessmentGroupCompetency(group: AssessmentGroup, competency: string) {
    if (isNmso) {
      return;
    }

    const nextCompetencies = group.competencies.includes(competency)
      ? group.competencies.filter((item) => item !== competency)
      : [...group.competencies, competency];

    updateAssessmentGroup(group.id, {
      competencies: nextCompetencies.length > 0 ? nextCompetencies : group.competencies,
    });
  }

  function updateClassType(classType: string) {
    onUpdate({
      classType,
      bufferWeeks: classType === "Group" ? service.bufferWeeks || "1" : service.bufferWeeks,
      participants: classType === "Individual" ? "1" : participantCountForClassType(classType, service.participants),
      partTimeClassDurationHours: classType === "Group" ? service.partTimeClassDurationHours || "1.5" : service.partTimeClassDurationHours,
      partTimeSessionsPerWeek: classType === "Group" ? service.partTimeSessionsPerWeek || "2" : service.partTimeSessionsPerWeek,
      reserveHours: classType === "Individual" ? service.reserveHours || "0" : "0",
      teachingWeeks: classType === "Group" ? service.teachingWeeks || "12" : service.teachingWeeks,
      priceLineCode: "",
    });
  }

  function updateTrainingFormat(trainingFormat: string) {
    onUpdate(
      trainingFormat === "Full-time"
        ? {
            trainingFormat,
            fullTimeHoursPerDay: service.fullTimeHoursPerDay || "6",
            fullTimeHoursPerWeek: service.fullTimeHoursPerWeek || "30",
          }
        : {
            trainingFormat,
            bufferWeeks: service.bufferWeeks || "1",
            partTimeSessionsPerWeek: service.partTimeSessionsPerWeek || "2",
            partTimeClassDurationHours: service.partTimeClassDurationHours || "1.5",
            teachingWeeks: service.teachingWeeks || "12",
          },
    );
  }

  function updateFullTimeHoursPerDay(fullTimeHoursPerDay: string) {
    onUpdate({
      fullTimeHoursPerDay,
      fullTimeHoursPerWeek: displayHourValue(numericValue(fullTimeHoursPerDay) * 5),
    });
  }

  function toggleRateOverride(enabled: boolean) {
    onUpdate({
      overrideRateEnabled: enabled,
      overrideRate: enabled ? service.overrideRate || editableRateFromPriceLine(selectedPriceLine) : "",
      overrideRateNote: enabled ? service.overrideRateNote : "",
    });
  }

  function updateServiceSchedulePreferences(updates: Partial<SchedulePreferences>) {
    onUpdate({
      schedulePreferences: {
        ...service.schedulePreferences,
        ...updates,
      },
    });
  }

  function updateLearnerSchedulePreferences(index: number, updates: Partial<SchedulePreferences>) {
    const learnerPreferences = normalizeLearnerSchedulePreferences(service);
    learnerPreferences[index] = {
      ...learnerPreferences[index],
      ...updates,
    };
    onUpdate({ learnerSchedulePreferences: learnerPreferences });
  }

  return (
    <article
      className="service-builder-card"
      id={serviceCardId(service.id)}
      aria-labelledby={`${service.id}-title`}
      tabIndex={-1}
    >
      <div className="service-builder-header">
        <div>
          <p className="eyebrow">Service {index + 1}</p>
          <h4 id={`${service.id}-title`}>{service.family}</h4>
        </div>
        <button className="button-secondary" disabled={index === 0} onClick={onRemove} type="button">
          Remove service
        </button>
      </div>

      <div className="form-grid">
        <label>
          Pricing source
          <select value={service.pricingSource} onChange={(event) => updatePricingSource(event.target.value as PricingSource)}>
            <option>SOA</option>
            <option>Non-SOA</option>
          </select>
        </label>

        {service.pricingSource === "SOA" && (
          <label>
            Specific SOA
            <select value={service.soaSourceCode} onChange={(event) => updateSoaSource(event.target.value)}>
              {demoStandingOffers.map((standingOffer) => (
                <option key={standingOffer.code} value={standingOffer.code}>
                  {standingOffer.displayName} - {standingOffer.standingOfferNumber}
                </option>
              ))}
            </select>
          </label>
        )}

        <label>
          Service type
          <select value={service.family} onChange={(event) => updateFamily(event.target.value as ServiceFamily)}>
            {availableFamilies.map((family) => (
              <option key={family}>{family}</option>
            ))}
          </select>
        </label>

        {isTraining ? (
          <>
            {!isGroupPartTimeProgram && (
              <fieldset className="competency-fieldset language-fieldset">
                <legend>Training language</legend>
                {languageOptions.map((language) => (
                  <label className="checkbox-card compact-checkbox" key={language}>
                    <input
                      checked={service.targetLanguages.includes(language)}
                      onChange={() =>
                        onUpdate({ targetLanguages: updateTargetLanguages(service.targetLanguages, language) })
                      }
                      type="checkbox"
                    />
                    {language}
                  </label>
                ))}
              </fieldset>
            )}
            <label>
              Class type
              <select value={service.classType} onChange={(event) => updateClassType(event.target.value)}>
                {trainingClassTypeOptions.map((classType) => (
                  <option key={classType}>{classType}</option>
                ))}
              </select>
            </label>
            <label>
              Training format
              <select value={service.trainingFormat} onChange={(event) => updateTrainingFormat(event.target.value)}>
                {trainingFormatOptions.map((trainingFormat) => (
                  <option key={trainingFormat}>{trainingFormat}</option>
                ))}
              </select>
            </label>
            {!isGroupPartTimeProgram && (
              <label>
                Delivery mode
                <select value={service.deliveryMode} onChange={(event) => onUpdate({ deliveryMode: event.target.value })}>
                  <option>MS Teams</option>
                  <option>In person</option>
                  <option>Hybrid</option>
                  <option>Federal institution</option>
                  <option>Virtual</option>
                </select>
              </label>
            )}
            {shouldShowParticipantsField(service) && (
              <label>
                Participants
                <input inputMode="numeric" value={service.participants} onChange={(event) => onUpdate({ participants: event.target.value })} />
              </label>
            )}
            {shouldShowIndividualLearnersField(service) && (
              <label>
                Individual learners
                <input
                  inputMode="numeric"
                  value={service.participants}
                  onChange={(event) => onUpdate({ participants: event.target.value })}
                />
              </label>
            )}
            <fieldset className="service-schedule-fieldset full-width">
              <legend>Schedule & estimated hours</legend>
              {isGroupPartTimeProgram ? (
                <div className="training-groups">
                  <p className="compatibility-note">
                    Add group sets here when the pricing source, service type, class type, and training format stay the same.
                    If one of those changes, add another service so the Price Book rate remains clear.
                  </p>
                  {service.trainingGroups.map((group, groupIndex) => (
                    <section className="training-group-card" key={group.id}>
                      <div className="training-group-header">
                        <h5>Group set {groupIndex + 1}</h5>
                        <button
                          className="button-secondary"
                          disabled={service.trainingGroups.length === 1}
                          onClick={() => removeTrainingGroup(group.id)}
                          type="button"
                        >
                          Remove group set
                        </button>
                      </div>
                      <div className="schedule-input-grid full-width">
                        <label>
                          Number of groups
                          <input
                            inputMode="numeric"
                            value={group.groupCount}
                            onChange={(event) => updateTrainingGroup(group.id, { groupCount: event.target.value })}
                          />
                        </label>
                        <label>
                          Language
                          <select
                            value={group.language}
                            onChange={(event) => updateTrainingGroup(group.id, { language: event.target.value as TargetLanguage })}
                          >
                            {languageOptions.map((language) => (
                              <option key={language}>{language}</option>
                            ))}
                          </select>
                        </label>
                        <label>
                          Expected participants total
                          <input
                            inputMode="numeric"
                            value={expectedParticipantsInputValue(group, selectedPriceLine)}
                            onChange={(event) => updateTrainingGroup(group.id, { participants: event.target.value })}
                          />
                        </label>
                        <label>
                          Session
                          <select
                            value={group.groupSession}
                            onChange={(event) => updateTrainingGroup(group.id, { groupSession: event.target.value })}
                          >
                            {groupSessionOptions.map((session) => (
                              <option key={session}>{session}</option>
                            ))}
                          </select>
                        </label>
                        <label>
                          Program start date
                          <input
                            type="date"
                            value={group.trainingStartDate}
                            onChange={(event) => updateTrainingGroup(group.id, { trainingStartDate: event.target.value })}
                          />
                        </label>
                        <label>
                          Teaching weeks
                          <input
                            inputMode="numeric"
                            value={group.teachingWeeks}
                            onChange={(event) => updateTrainingGroup(group.id, { teachingWeeks: event.target.value })}
                          />
                        </label>
                        <label>
                          Buffer weeks
                          <select
                            value={group.bufferWeeks}
                            onChange={(event) => updateTrainingGroup(group.id, { bufferWeeks: event.target.value })}
                          >
                            {groupBufferWeekOptions.map((weeks) => (
                              <option key={weeks} value={weeks}>
                                {weekLabel(numericValue(weeks))}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label>
                          Classes per week
                          <select
                            value={group.partTimeSessionsPerWeek}
                            onChange={(event) => updateTrainingGroup(group.id, { partTimeSessionsPerWeek: event.target.value })}
                          >
                            {groupPartTimeSessionOptions.map((frequency) => (
                              <option key={frequency} value={frequency}>
                                {frequency}x per week
                              </option>
                            ))}
                          </select>
                        </label>
                        <label>
                          Class duration
                          <select
                            value={group.partTimeClassDurationHours}
                            onChange={(event) => updateTrainingGroup(group.id, { partTimeClassDurationHours: event.target.value })}
                          >
                            {groupPartTimeClassDurationOptions.map((duration) => (
                              <option key={duration} value={duration}>
                                {displayHourValue(duration)} h
                              </option>
                            ))}
                          </select>
                        </label>
                        <label>
                          Delivery mode
                          <select
                            value={group.deliveryMode}
                            onChange={(event) => updateTrainingGroup(group.id, { deliveryMode: event.target.value })}
                          >
                            <option>MS Teams</option>
                            <option>In person</option>
                            <option>Hybrid</option>
                            <option>Federal institution</option>
                            <option>Virtual</option>
                          </select>
                        </label>
                      </div>
                      <dl className="schedule-results full-width" aria-label={`Group set ${groupIndex + 1} schedule estimate`}>
                        <div className="schedule-result-card">
                          <dt>Groups</dt>
                          <dd>{positiveIntegerValue(group.groupCount)}</dd>
                        </div>
                        <div className="schedule-result-card">
                          <dt>Max per group</dt>
                          <dd>{groupCapacityLabel(selectedPriceLine)}</dd>
                        </div>
                        <div className="schedule-result-card">
                          <dt>Recommended groups</dt>
                          <dd>{recommendedGroupCount(group, selectedPriceLine)}</dd>
                        </div>
                        <div className="schedule-result-card">
                          <dt>Teaching weeks</dt>
                          <dd>{weekLabel(numericValue(group.teachingWeeks))}</dd>
                        </div>
                        <div className="schedule-result-card">
                          <dt>Buffer</dt>
                          <dd>{weekLabel(numericValue(group.bufferWeeks))}</dd>
                        </div>
                        <div className="schedule-result-card">
                          <dt>Calendar span</dt>
                          <dd>{weekLabel(calendarSpanWeeksForGroup(group))}</dd>
                        </div>
                        <div className="schedule-result-card">
                          <dt>Weekly rhythm</dt>
                          <dd>{trainingGroupScheduleSummary(group)}</dd>
                        </div>
                        <div className="schedule-result-card">
                          <dt>Hours per group</dt>
                          <dd>{displayHourValue(calculatedTrainingGroupHours(group))} h</dd>
                        </div>
                        <div className="schedule-result-card schedule-result-total">
                          <dt>Set billable estimate</dt>
                          <dd>{displayHourValue(calculatedTrainingGroupSetHours(group))} h</dd>
                        </div>
                      </dl>
                      <p className="inline-warning">{groupCapacityStatus(group, selectedPriceLine)}</p>
                      {groupIndex === 0 && (
                        <label className="schedule-preference-scope">
                          Availability details apply to
                          <select
                            value={service.schedulePreferenceScope}
                            onChange={(event) => onUpdate({ schedulePreferenceScope: event.target.value as SchedulePreferenceScope })}
                          >
                            <option value="whole-service">Whole service</option>
                            <option value="by-learner-or-group">Each group set</option>
                          </select>
                        </label>
                      )}
                      {service.schedulePreferenceScope === "by-learner-or-group" && (
                        <SchedulePreferencesEditor
                          title={`Group set ${groupIndex + 1} availability & scheduling`}
                          value={group.schedulePreferences}
                          onChange={(updates) =>
                            updateTrainingGroup(group.id, {
                              schedulePreferences: {
                                ...group.schedulePreferences,
                                ...updates,
                              },
                            })
                          }
                        />
                      )}
                    </section>
                  ))}
                  {service.schedulePreferenceScope === "whole-service" && (
                    <SchedulePreferencesEditor
                      title="Availability & scheduling"
                      value={service.schedulePreferences}
                      onChange={updateServiceSchedulePreferences}
                    />
                  )}
                  <button className="button-secondary" onClick={addTrainingGroup} type="button">
                    Add group set
                  </button>
                  <dl className="schedule-results full-width" aria-label="Service group total">
                    <div className="schedule-result-card">
                      <dt>Group sets</dt>
                      <dd>{service.trainingGroups.length}</dd>
                    </div>
                    <div className="schedule-result-card">
                      <dt>Total groups</dt>
                      <dd>{totalGroupCount(service)}</dd>
                    </div>
                    <div className="schedule-result-card">
                      <dt>Total participants</dt>
                      <dd>{displayHourValue(totalGroupParticipants(service))}</dd>
                    </div>
                    <div className="schedule-result-card schedule-result-total">
                      <dt>Service billable estimate</dt>
                      <dd>{displayHourValue(quotedTrainingHours(service))} h</dd>
                    </div>
                  </dl>
                </div>
              ) : (
                <>
                  <div className="schedule-input-grid full-width">
                    <label>
                      Training start date
                      <input
                        type="date"
                        value={service.trainingStartDate}
                        onChange={(event) => onUpdate({ trainingStartDate: event.target.value })}
                      />
                    </label>
                  <label>
                    Training end date
                    <input
                      type="date"
                      value={service.trainingEndDate}
                      onChange={(event) => onUpdate({ trainingEndDate: event.target.value })}
                    />
                  </label>
                  {service.trainingFormat === "Full-time" ? (
                    <label>
                      Hours per day
                      <select
                        value={service.fullTimeHoursPerDay}
                        onChange={(event) => updateFullTimeHoursPerDay(event.target.value)}
                      >
                        {fullTimeHoursPerDayOptions.map((hours) => (
                          <option key={hours} value={hours}>
                            {displayHourValue(hours)} h
                          </option>
                        ))}
                      </select>
                    </label>
                  ) : (
                    <>
                      <label>
                        Classes per week
                        <select
                          value={service.partTimeSessionsPerWeek}
                          onChange={(event) => onUpdate({ partTimeSessionsPerWeek: event.target.value })}
                        >
                          {partTimeSessionOptions.map((frequency) => (
                            <option key={frequency} value={frequency}>
                              {frequency}x per week
                            </option>
                          ))}
                        </select>
                      </label>
                      <label>
                        Class duration
                        <select
                          value={service.partTimeClassDurationHours}
                          onChange={(event) => onUpdate({ partTimeClassDurationHours: event.target.value })}
                        >
                          {partTimeClassDurationOptions.map((duration) => (
                            <option key={duration} value={duration}>
                              {displayHourValue(duration)} h
                            </option>
                          ))}
                        </select>
                      </label>
                    </>
                  )}
                  {service.classType === "Individual" && (
                    <label>
                      Reserve hours
                      <input
                        inputMode="decimal"
                        value={service.reserveHours}
                        onChange={(event) => onUpdate({ reserveHours: event.target.value })}
                      />
                    </label>
                  )}
                </div>
                <dl className="schedule-results full-width" aria-label="Schedule estimate">
                  <div className="schedule-result-card">
                    <dt>Duration</dt>
                    <dd>{durationWeeksLabel(service)}</dd>
                  </div>
                  <div className="schedule-result-card">
                    <dt>Weekly rhythm</dt>
                    <dd>{scheduleSummary(service)}</dd>
                  </div>
                  <div className="schedule-result-card">
                    <dt>Planned hours</dt>
                    <dd>
                      {service.classType === "Individual" && positiveIntegerValue(service.participants) > 1
                        ? `${displayHourValue(calculatedTrainingHoursPerIndividualLearner(service))} h per learner`
                        : `${displayHourValue(calculatedTrainingHours(service))} h`}
                    </dd>
                  </div>
                  {service.classType === "Individual" && (
                    <div className="schedule-result-card">
                      <dt>Reserve</dt>
                      <dd>
                        {positiveIntegerValue(service.participants) > 1
                          ? `${displayHourValue(reserveTrainingHoursPerIndividualLearner(service))} h per learner`
                          : `${displayHourValue(reserveTrainingHours(service))} h`}
                      </dd>
                    </div>
                  )}
                  <div className="schedule-result-card schedule-result-total">
                    <dt>Billable estimate</dt>
                    <dd>{displayHourValue(quotedTrainingHours(service))} h</dd>
                  </div>
                </dl>
                {service.classType === "Individual" && positiveIntegerValue(service.participants) > 1 && (
                  <label className="schedule-preference-scope">
                    Availability details apply to
                    <select
                      value={service.schedulePreferenceScope}
                      onChange={(event) => onUpdate({ schedulePreferenceScope: event.target.value as SchedulePreferenceScope })}
                    >
                      <option value="whole-service">Whole service</option>
                      <option value="by-learner-or-group">Each individual learner</option>
                    </select>
                  </label>
                )}
                {service.classType === "Individual" &&
                service.schedulePreferenceScope === "by-learner-or-group" &&
                positiveIntegerValue(service.participants) > 1 ? (
                  <div className="learner-schedule-list full-width">
                    {normalizeLearnerSchedulePreferences(service).map((preferences, learnerIndex) => (
                      <SchedulePreferencesEditor
                        key={`learner-schedule-${learnerIndex}`}
                        title={`Learner ${learnerIndex + 1} availability & scheduling`}
                        value={preferences}
                        onChange={(updates) => updateLearnerSchedulePreferences(learnerIndex, updates)}
                      />
                    ))}
                  </div>
                ) : (
                  <SchedulePreferencesEditor
                    title="Availability & scheduling"
                    value={service.schedulePreferences}
                    onChange={updateServiceSchedulePreferences}
                  />
                )}
              </>
              )}
            </fieldset>
          </>
        ) : (
          <>
            <fieldset className="assessment-groups full-width">
              <legend>Assessment groups</legend>
              {isNmso && <p>NMSO placement tests include Reading, Writing, and Oral.</p>}
              {service.assessmentGroups.map((group, groupIndex) => (
                <div className="assessment-group-row" key={group.id}>
                  <label>
                    Language
                    <select
                      value={group.language}
                      onChange={(event) => updateAssessmentGroup(group.id, { language: event.target.value as TargetLanguage })}
                    >
                      {languageOptions.map((language) => (
                        <option key={language}>{language}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Candidates
                    <input
                      inputMode="numeric"
                      value={group.candidates}
                      onChange={(event) => updateAssessmentGroup(group.id, { candidates: event.target.value })}
                    />
                  </label>
                  <fieldset className="assessment-competencies">
                    <legend>Competencies for group {groupIndex + 1}</legend>
                    {competencyOptions.map((competency) => (
                      <label className="checkbox-card compact-checkbox" key={competency}>
                        <input
                          checked={group.competencies.includes(competency)}
                          disabled={isNmso}
                          onChange={() => toggleAssessmentGroupCompetency(group, competency)}
                          type="checkbox"
                        />
                        {competency}
                      </label>
                    ))}
                  </fieldset>
                  <button
                    className="button-secondary"
                    disabled={service.assessmentGroups.length <= 1}
                    onClick={() => removeAssessmentGroup(group.id)}
                    type="button"
                  >
                    Remove group
                  </button>
                </div>
              ))}
              <button className="button-secondary" onClick={addAssessmentGroup} type="button">
                Add assessment group
              </button>
            </fieldset>
          </>
        )}

      </div>

      <div className="selected-price-line" aria-live="polite">
        <span>Automatic Price Book rate</span>
        {selectedPriceLine ? (
          <>
            <strong>
              {selectedPriceLine.code} / {selectedPriceLine.rate} / {selectedPriceLine.unit} / {selectedPriceLine.activeDates ?? "N/A"}
            </strong>
            <div className="rate-metrics">
              <span>Quantity: {billingQuantityLabel(service, selectedPriceLine)}</span>
              {service.overrideRateEnabled && <span>Adjusted rate: {effectiveRateLabel(service, selectedPriceLine)}</span>}
              <span>Estimated amount: {estimatedAmount(service, selectedPriceLine)}</span>
            </div>
            {canOverrideRate(service, selectedPriceLine) && (
              <fieldset className="rate-override-panel">
                <legend>Non-SOA rate override</legend>
                <label className="rate-override-toggle">
                  <input
                    checked={service.overrideRateEnabled}
                    onChange={(event) => toggleRateOverride(event.target.checked)}
                    type="checkbox"
                  />
                  Adjust this rate for this proposal only
                </label>
                {service.overrideRateEnabled && (
                  <div className="rate-override-fields">
                    <label>
                      Proposal rate
                      <input
                        aria-describedby={`${service.id}-override-help`}
                        inputMode="decimal"
                        onChange={(event) => onUpdate({ overrideRate: event.target.value })}
                        placeholder={editableRateFromPriceLine(selectedPriceLine)}
                        value={service.overrideRate}
                      />
                    </label>
                    <label className="full-width">
                      Adjustment note required
                      <input
                        onChange={(event) => onUpdate({ overrideRateNote: event.target.value })}
                        placeholder="Reason for this proposal-specific adjustment"
                        value={service.overrideRateNote}
                      />
                    </label>
                    <p className="rate-override-help" id={`${service.id}-override-help`}>
                      Applies only to this proposal. The Price Book rate remains {selectedPriceLine.rate}.
                    </p>
                    {rateOverrideNeedsNote(service, selectedPriceLine) && (
                      <p className="inline-warning">Add a note before approving this proposal.</p>
                    )}
                  </div>
                )}
              </fieldset>
            )}
          </>
        ) : (
          <strong>No compatible Price Book rate found</strong>
        )}
      </div>
    </article>
  );
}

function PricingStep({ requestedServices }: { requestedServices: RequestedService[] }) {
  const pricedRows = requestedServices.map((service) => {
    const selectedPriceLine = selectedPriceLineForService(service);
    return {
      amountMinorUnits: estimatedAmountMinorUnits(service, selectedPriceLine),
      selectedPriceLine,
      service,
    };
  });
  const subtotalMinorUnits = pricedRows.reduce(
    (total, row) => (row.amountMinorUnits === null ? total : total + row.amountMinorUnits),
    0,
  );
  const hasUnpricedRows = pricedRows.some((row) => row.amountMinorUnits === null);

  return (
    <SectionCard
      title="Pricing"
      description="Rates and estimated amounts are selected automatically from the compatible Price Book lines. Taxes and final rounding are not implemented yet."
    >
      <DataTable
        caption="DEMO service quotation line items"
        columns={["Service", "Configuration", "Price Book rate", "Rate source", "Rate", "Unit", "Quantity", "Active dates", "Estimated amount"]}
      >
        {pricedRows.map(({ selectedPriceLine, service }) => {
          return (
            <tr key={service.id}>
              <td>{service.family}</td>
              <td>{serviceConfigurationSummary(service, selectedPriceLine)}</td>
              <td>{selectedPriceLine?.code ?? "No compatible rate"}</td>
              <td>{selectedPriceLine?.source ?? service.source}</td>
              <td>
                {selectedPriceLine ? effectiveRateLabel(service, selectedPriceLine) : "Rate to confirm"}
                {service.overrideRateEnabled && selectedPriceLine ? (
                  <span className="cell-note">Adjusted from {selectedPriceLine.rate}</span>
                ) : null}
              </td>
              <td>{selectedPriceLine?.unit ?? "Unit to confirm"}</td>
              <td>{billingQuantityLabel(service, selectedPriceLine)}</td>
              <td>{selectedPriceLine?.activeDates ?? "To confirm"}</td>
              <td>{estimatedAmount(service, selectedPriceLine)}</td>
            </tr>
          );
        })}
      </DataTable>
      <div className="totals-panel">
        <strong>Estimated subtotal</strong>
        <span>{formatCadMinorUnits(subtotalMinorUnits)}{hasUnpricedRows ? " + rates to confirm" : ""}</span>
        <small>Amounts are calculated before taxes and final rounding rules.</small>
      </div>
    </SectionCard>
  );
}

function proposalTextSummary(services: RequestedService[]) {
  const selectedServiceCount = services.length;
  const pricedCount = services.filter((service) => selectedPriceLineForService(service)).length;
  const trainingServices = services.filter((service) => service.family === "Second language training").length;
  const assessmentServices = selectedServiceCount - trainingServices;

  return {
    assessmentServices,
    pricedCount,
    selectedServiceCount,
    trainingServices,
  };
}

function generatedOverviewText(services: RequestedService[]) {
  return proposalOverviewText(services);
}

function contentSectionText(sectionId: string, content: string, services: RequestedService[]) {
  if (sectionId === "overview") {
    return generatedOverviewText(services);
  }

  if (sectionId === "schedule") {
    if (services.length === 0) {
      return "No service details have been configured yet.";
    }

    return services
      .map((service, index) => {
        const selectedPriceLine = selectedPriceLineForService(service);
        return `Service ${index + 1}: ${proposalTrainingDetailText(service, selectedPriceLine)}`;
      })
      .join("\n\n");
  }

  return content;
}

function ContentStep({
  onProposalLanguageChange,
  proposalLanguage,
  requestedServices,
}: {
  onProposalLanguageChange: (language: "English" | "Francais") => void;
  proposalLanguage: "English" | "Francais";
  requestedServices: RequestedService[];
}) {
  const textSummary = proposalTextSummary(requestedServices);

  return (
    <div className="proposal-text-workspace">
      <SectionCard
        actions={<span className="template-status">Draft proposal preparation</span>}
        title="Proposal document"
      >
        <div className="proposal-text-intro">
          <p>
            Review the sections that will appear in the proposal PDF. Service wording is generated from the quote
            builder; administrative clauses are applied from templates and can be reviewed before PDF generation.
          </p>
          <div className="document-language-panel">
            <span>Draft PDF language</span>
            <div className="segmented-control" aria-label="Proposal language" role="group">
              {(["English", "Francais"] as const).map((language) => (
                <button
                  aria-pressed={proposalLanguage === language}
                  key={language}
                  onClick={() => onProposalLanguageChange(language)}
                  type="button"
                >
                  {proposalLanguageLabel(language)}
                </button>
              ))}
            </div>
          </div>
          <dl className="content-summary-metrics" aria-label="Proposal text summary">
            <div>
              <dt>Services</dt>
              <dd>{textSummary.selectedServiceCount}</dd>
            </div>
            <div>
              <dt>Priced</dt>
              <dd>{textSummary.pricedCount}</dd>
            </div>
            <div>
              <dt>Training</dt>
              <dd>{textSummary.trainingServices}</dd>
            </div>
            <div>
              <dt>Assessments</dt>
              <dd>{textSummary.assessmentServices}</dd>
            </div>
          </dl>
        </div>
      </SectionCard>

      <div className="proposal-text-layout">
        <section className="proposal-section-list" aria-labelledby="proposal-sections-title">
          <h3 id="proposal-sections-title">PDF sections</h3>
          {templateSections.map((section) => (
            <article className="proposal-text-section" key={section.id}>
              <div className="proposal-text-section-header">
                <div>
                  <h4>{section.title}</h4>
                  <p>{section.source}</p>
                </div>
                <span className={`content-state ${section.reviewState === "Needs review" ? "content-state-warning" : ""}`}>
                  {section.reviewState ?? section.status}
                </span>
              </div>
              <p className="proposal-text-copy">{contentSectionText(section.id, section.content, requestedServices)}</p>
              <div className="proposal-text-meta">
                <span>{section.appliesWhen}</span>
                {section.reviewState === "Needs review" ? (
                  <strong>Review before PDF</strong>
                ) : (
                  <strong>Ready for draft PDF</strong>
                )}
              </div>
            </article>
          ))}
        </section>

        <aside className="content-clause-panel" aria-labelledby="clause-panel-title">
          <h3 id="clause-panel-title">Applied clauses</h3>
          <ul>
            <li>
              <strong>30-day validity</strong>
              <span>Uses the project decision that all offers are valid for 30 days.</span>
            </li>
            <li>
              <strong>MyLearningMyWay access</strong>
              <span>Included for class access, calendar, materials, attendance, reports, and homework.</span>
            </li>
            <li>
              <strong>Authorization required</strong>
              <span>Call-Up, purchase order, signed authorization, or written approval before services start.</span>
            </li>
            <li>
              <strong>Scheduling preferences</strong>
              <span>Availability preferences are considered for planning, but do not guarantee the final schedule or capacity.</span>
            </li>
            <li>
              <strong>Unclassified virtual delivery</strong>
              <span>MS Teams and platform use must not receive protected or classified information by default.</span>
            </li>
          </ul>
        </aside>
      </div>
    </div>
  );
}

interface ProposalPreviewDialogProps {
  canGeneratePdf: boolean;
  onClose: () => void;
  quoteDate: string;
  quoteId: string;
  requestedServices: RequestedService[];
  summary: typeof quoteSummary;
  title: string;
}

function proposalPreviewRows(requestedServices: RequestedService[]) {
  return requestedServices.map((service, index) => {
    const selectedPriceLine = selectedPriceLineForService(service);
    const amountMinorUnits = estimatedAmountMinorUnits(service, selectedPriceLine);
    return {
      amount: amountMinorUnits === null ? "Rate to confirm" : formatCadMinorUnitsForProposal(amountMinorUnits),
      configuration: proposalTrainingDetailText(service, selectedPriceLine),
      description: quotationDescriptionText(service, selectedPriceLine),
      id: service.id,
      label: `Service ${index + 1}`,
      quantity: billingQuantityLabel(service, selectedPriceLine),
      rate: selectedPriceLine ? effectiveRateLabel(service, selectedPriceLine) : "Rate to confirm",
      serviceName: service.family,
      unit: selectedPriceLine?.unit ?? "Unit to confirm",
    };
  });
}

type ProposalPreviewRow = ReturnType<typeof proposalPreviewRows>[number];

function chunkArray<T>(items: T[], size: number) {
  const chunks: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}

function proposalPreviewSubtotal(requestedServices: RequestedService[]) {
  const subtotalMinorUnits = requestedServices.reduce((total, service) => {
    const selectedPriceLine = selectedPriceLineForService(service);
    const amountMinorUnits = estimatedAmountMinorUnits(service, selectedPriceLine);
    return amountMinorUnits === null ? total : total + amountMinorUnits;
  }, 0);
  const hasUnpricedRows = requestedServices.some((service) => {
    const selectedPriceLine = selectedPriceLineForService(service);
    return estimatedAmountMinorUnits(service, selectedPriceLine) === null;
  });

  return `${formatCadMinorUnitsForProposal(subtotalMinorUnits)}${hasUnpricedRows ? " + rates to confirm" : ""}`;
}

function pdfSafeNamePart(value: string) {
  return value
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[<>:"/\\|?*]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[-_]+|[-_]+$/g, "");
}

function pdfDocumentTitle(quoteId: string, contactName: string) {
  const reference = quoteId === "Quote ID required" ? "draft" : quoteId;
  const contact = pdfSafeNamePart(contactName) || "Contact";
  return `${reference}-${contact}`;
}

function previewSummaryStats(requestedServices: RequestedService[]) {
  const trainingServices = requestedServices.filter((service) => service.family === "Second language training");
  const assessmentServices = requestedServices.filter((service) => service.family !== "Second language training");
  const trainingMetrics = trainingPlanMetrics(trainingServices);
  const trainingHours = trainingServices.reduce((total, service) => total + quotedTrainingHours(service), 0);

  return [
    {
      label: "Services",
      value: requestedServices.length === 0 ? "None yet" : pluralizeCount(requestedServices.length, "service"),
    },
    {
      label: "Training",
      value:
        trainingServices.length === 0
          ? "Not included"
          : `${displayHourValue(trainingHours)} hours / ${displayHourValue(trainingMetrics.totalParticipants)} participants`,
    },
    {
      label: "Assessments",
      value:
        assessmentServices.length === 0
          ? "Not included"
          : pluralizeCount(assessmentServices.reduce((total, service) => total + assessmentCandidateCount(service), 0), "candidate"),
    },
  ];
}

function LetterFooter({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) {
  return (
    <footer className="letter-footer" aria-label={`Proposal footer page ${pageNumber} of ${totalPages}`}>
      <span>{proposalFooterCompany} &copy;2026 {proposalFooterAddress}</span>
      <span className="letter-footer-page">Page {pageNumber} of {totalPages}</span>
    </footer>
  );
}

function LetterContinuationHeader({ quoteId, title }: { quoteId: string; title: string }) {
  return (
    <header className="letter-continuation-header">
      <strong>Knowledge Circle Language Services Inc.</strong>
      <span>{title} (Ref: {quoteId})</span>
    </header>
  );
}

type LetterSectionIconType = "acceptance" | "quotation" | "summary" | "training";

function LetterSectionHeading({
  eyebrow,
  icon,
  title,
}: {
  eyebrow?: string;
  icon?: LetterSectionIconType;
  title: string;
}) {
  return (
    <div className="letter-section-heading">
      {icon ? (
        <span className={`letter-section-icon letter-section-icon-${icon}`}>
          <LetterDocumentStructureIcon type={icon} />
        </span>
      ) : null}
      <div>
        {eyebrow ? <span>{eyebrow}</span> : null}
        <h3>{title}</h3>
      </div>
    </div>
  );
}

function LetterDocumentStructureIcon({ type }: { type: LetterSectionIconType }) {
  if (type === "summary") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M5 5h14v14H5z" />
        <path d="M8 9h8M8 13h5M8 17h3" />
        <path d="M17 16l2 2 2-3" />
      </svg>
    );
  }

  if (type === "training") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M4.5 6.5h6.5c1.1 0 2 .9 2 2v10c0-1.1-.9-2-2-2H4.5z" />
        <path d="M19.5 6.5H13c-1.1 0-2 .9-2 2v10c0-1.1.9-2 2-2h6.5z" />
        <path d="M7.5 10h2.8M7.5 13h2.2M15 10h2.4M15 13h1.8" />
      </svg>
    );
  }

  if (type === "quotation") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <rect height="16" rx="2" width="12" x="6" y="4" />
        <path d="M9 8h6M9 12h6M9 16h2.5M14.5 16H15" />
        <path d="M19 7l1.5 1.5L22 7" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M12 3.8 18 6v5.1c0 3.6-2.4 6.8-6 8.1-3.6-1.3-6-4.5-6-8.1V6z" />
      <path d="M9 12l2 2 4-4" />
      <path d="M7 20h10" />
    </svg>
  );
}

function LetterTrainingDetailsSection({
  continuationNote,
  rows,
}: {
  continuationNote?: string;
  rows: ProposalPreviewRow[];
}) {
  return (
    <section className="letter-section">
      <LetterSectionHeading eyebrow="Service plan" icon="training" title="Training Details" />
      {rows.length === 0 ? (
        <p>No services have been added yet.</p>
      ) : (
        <div className="letter-service-cards">
          {rows.map((row) => (
            <article className="letter-service-card" key={row.id}>
              <div>
                <span className="letter-service-kicker">{row.label}</span>
                <strong>{row.serviceName}</strong>
              </div>
              <p>{row.configuration}</p>
            </article>
          ))}
        </div>
      )}
      {continuationNote ? <p className="letter-continuation-note">{continuationNote}</p> : null}
    </section>
  );
}

function LetterQuotationSection({
  rows,
  showTotal,
  subtotal,
}: {
  rows: ProposalPreviewRow[];
  showTotal: boolean;
  subtotal: string;
}) {
  return (
    <section className="letter-section">
      <LetterSectionHeading eyebrow="Financial summary" icon="quotation" title="Quotation" />
      <table className="letter-table">
        <colgroup>
          <col className="letter-col-item" />
          <col className="letter-col-description" />
          <col className="letter-col-rate" />
          <col className="letter-col-quantity" />
          <col className="letter-col-total" />
        </colgroup>
        <thead>
          <tr>
            <th>Item</th>
            <th>Description</th>
            <th>Rate</th>
            <th>Quantity</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={5}>No quotation lines yet.</td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.id}>
                <td>{row.serviceName}</td>
                <td>{row.description}</td>
                <td>{row.rate} / {row.unit}</td>
                <td>{row.quantity}</td>
                <td>{row.amount}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {showTotal ? (
        <div className="letter-total">
          <span>Total</span>
          <strong>{subtotal}</strong>
        </div>
      ) : null}
    </section>
  );
}

function ProposalPreviewDialog({ canGeneratePdf, onClose, quoteDate, quoteId, requestedServices, summary, title }: ProposalPreviewDialogProps) {
  const previewRows = proposalPreviewRows(requestedServices);
  const assetBaseUrl = import.meta.env.BASE_URL;
  const summaryStats = previewSummaryStats(requestedServices);
  const trainingChunks = chunkArray(previewRows, 4);
  const quotationChunks = chunkArray(previewRows.length === 0 ? [] : previewRows, 6);
  const subtotal = proposalPreviewSubtotal(requestedServices);
  let nextPageNumber = 2;
  const trainingPages = trainingChunks.map((rows) => ({
    pageNumber: nextPageNumber++,
    rows,
  }));
  const quotationPages = quotationChunks.map((rows, index) => ({
    pageNumber: nextPageNumber++,
    rows,
    showTotal: index === quotationChunks.length - 1,
  }));
  const adminPageNumber = nextPageNumber;
  const proposalPageCount = adminPageNumber;

  function handleDownloadPdf() {
    if (!canGeneratePdf) {
      return;
    }

    printProposalDraftPdf({
      documentTitle: pdfDocumentTitle(quoteId, summary.contact),
      getDocumentTitle: () => document.title,
      print: () => window.print(),
      restoreDocumentTitle: (restore) => {
        window.setTimeout(restore, 1_000);
      },
      setDocumentTitle: (nextTitle) => {
        document.title = nextTitle;
      },
    });
  }

  return (
    <div className="dialog-backdrop preview-backdrop" role="presentation">
      <section aria-labelledby="proposal-preview-title" aria-modal="true" className="dialog preview-dialog" role="dialog">
        <div className="preview-dialog-header">
          <div>
            <p className="eyebrow">Draft preview - Letter size</p>
            <h2 id="proposal-preview-title">Proposal Preview</h2>
          </div>
          <div className="preview-dialog-header-actions">
            <button className="button-primary" disabled={!canGeneratePdf} onClick={handleDownloadPdf} type="button">
              Download PDF
            </button>
            <button aria-label="Close proposal preview" className="icon-button" onClick={onClose} title="Close preview" type="button">
              X
            </button>
          </div>
        </div>
        <div className="letter-pages" aria-label="Letter-size proposal preview">
          <div className="letter-page" aria-label={`Letter-size proposal preview page 1 of ${proposalPageCount}`}>
            <div className="letter-page-content">
              <header className="letter-header">
                <div className="letter-brand-row">
                  <img alt="Knowledge Circle" className="letter-logo" src={`${assetBaseUrl}kc-logo-horizontal.png`} />
                  <div className="letter-reference-card">
                    <span>Proposal reference</span>
                    <strong>{quoteId}</strong>
                  </div>
                </div>
                <div className="letter-title-block">
                  <p>Knowledge Circle Proposal</p>
                  <h3>{title}</h3>
                  <span className="letter-quote-id">Ref: {quoteId}</span>
                </div>
              </header>
              <section className="letter-meta-grid" aria-label="Proposal metadata">
                <div>
                  <span>Prepared for</span>
                  <strong>{summary.client}</strong>
                </div>
                <div>
                  <span>Contact</span>
                  <strong>{summary.contact}</strong>
                </div>
                <div>
                  <span>Issued</span>
                  <strong>{quoteDate}</strong>
                </div>
                <div>
                  <span>Valid for</span>
                  <strong>30 days</strong>
                </div>
              </section>
              <section className="letter-section letter-summary-section">
                <LetterSectionHeading eyebrow="Proposal summary" title={title} />
                <p>{generatedOverviewText(requestedServices)}</p>
                <div className="letter-summary-stats" aria-label="Proposal summary metrics">
                  {summaryStats.map((stat) => (
                    <div key={stat.label}>
                      <span>{stat.label}</span>
                      <strong>{stat.value}</strong>
                    </div>
                  ))}
                </div>
              </section>
              <section className="letter-section letter-next-steps">
                <LetterSectionHeading eyebrow="Document structure" title="What follows" />
                <ol>
                  <li>
                    <span className="letter-next-step-icon letter-next-step-icon-training">
                      <span className="letter-next-step-number">1</span>
                      <LetterDocumentStructureIcon type="training" />
                    </span>
                    <span>Training and assessment details</span>
                  </li>
                  <li>
                    <span className="letter-next-step-icon letter-next-step-icon-quotation">
                      <span className="letter-next-step-number">2</span>
                      <LetterDocumentStructureIcon type="quotation" />
                    </span>
                    <span>Quotation and estimated total</span>
                  </li>
                  <li>
                    <span className="letter-next-step-icon letter-next-step-icon-acceptance">
                      <span className="letter-next-step-number">3</span>
                      <LetterDocumentStructureIcon type="acceptance" />
                    </span>
                    <span>Administrative conditions and acceptance instructions</span>
                  </li>
                </ol>
              </section>
            </div>
            <LetterFooter pageNumber={1} totalPages={proposalPageCount} />
          </div>
          {trainingPages.map((page, index) => (
            <div className="letter-page letter-page-continuation" aria-label={`Letter-size proposal preview page ${page.pageNumber} of ${proposalPageCount}`} key={`training-${page.pageNumber}`}>
              <div className="letter-page-content">
                <LetterContinuationHeader quoteId={quoteId} title={title} />
                <LetterTrainingDetailsSection
                  continuationNote={index < trainingPages.length - 1 ? "Training details continue on the next page." : undefined}
                  rows={page.rows}
                />
              </div>
              <LetterFooter pageNumber={page.pageNumber} totalPages={proposalPageCount} />
            </div>
          ))}
          {quotationPages.map((page) => (
            <div className="letter-page letter-page-continuation" aria-label={`Letter-size proposal preview page ${page.pageNumber} of ${proposalPageCount}`} key={`quotation-${page.pageNumber}`}>
              <div className="letter-page-content">
                <LetterContinuationHeader quoteId={quoteId} title={title} />
                <LetterQuotationSection rows={page.rows} showTotal={page.showTotal} subtotal={subtotal} />
              </div>
              <LetterFooter pageNumber={page.pageNumber} totalPages={proposalPageCount} />
            </div>
          ))}
          <div className="letter-page letter-page-continuation" aria-label={`Letter-size proposal preview page ${adminPageNumber} of ${proposalPageCount}`}>
            <div className="letter-page-content">
              <LetterContinuationHeader quoteId={quoteId} title={title} />
              <section className="letter-section">
                <LetterSectionHeading eyebrow="Client conditions" icon="acceptance" title="Administrative Conditions" />
                <ul className="letter-condition-list">
                  <li>
                    <span aria-hidden="true" className="letter-condition-icon">
                      <svg viewBox="0 0 24 24">
                        <rect height="15" rx="2" width="16" x="4" y="5" />
                        <path d="M8 3v4M16 3v4M4 10h16M8 15l2 2 5-5" />
                      </svg>
                    </span>
                    <div>
                      <strong>Offer validity</strong>
                      <p>This proposal is valid for 30 days from the issue date.</p>
                    </div>
                  </li>
                  <li>
                    <span aria-hidden="true" className="letter-condition-icon">
                      <svg viewBox="0 0 24 24">
                        <rect height="11" rx="2" width="16" x="4" y="5" />
                        <path d="M9 20h6M12 16v4M8 9h8M8 12h5" />
                      </svg>
                    </span>
                    <div>
                      <strong>MyLearningMyWay access</strong>
                      <p>Learners may access class links, calendars, materials, attendance sheets, homework, progress reports, class reports, and other program information through MyLearningMyWay when applicable.</p>
                    </div>
                  </li>
                  <li>
                    <span aria-hidden="true" className="letter-condition-icon">
                      <svg viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="8" />
                        <path d="M12 8v4l3 2M7 18l-2 2M17 18l2 2" />
                      </svg>
                    </span>
                    <div>
                      <strong>Scheduling preferences</strong>
                      <p>Scheduling preferences, preferred days, preferred times, location details, time zone, and other availability information are considered for planning purposes only. All times indicated in this proposal are Ottawa, Ontario time (Eastern Time), unless expressly stated otherwise. Preferred days and AM/PM preferences, including common part-time requests such as Tuesday and Thursday mornings, are indicative only and do not guarantee the final schedule, instructor availability, delivery location, start date, class time, or reserved training capacity.</p>
                    </div>
                  </li>
                  <li>
                    <span aria-hidden="true" className="letter-condition-icon">
                      <svg viewBox="0 0 24 24">
                        <path d="M5 5h14M7 5v14h10V5M9 9h6M9 13h3" />
                        <path d="M16 15l1.5 1.5L20 14" />
                      </svg>
                    </span>
                    <div>
                      <strong>Statutory holidays</strong>
                      <p>Knowledge Circle is based in Ottawa and applies Ontario statutory holidays by default when planning schedules. If the client requires additional provincial, territorial, organizational, or location-specific holidays to be observed, the client must identify them in writing before the schedule is confirmed.</p>
                    </div>
                  </li>
                </ul>
              </section>
              <section className="letter-section">
                <LetterSectionHeading eyebrow="Next step" icon="acceptance" title="Acceptance" />
                <p>To proceed, please provide a valid Call-Up, purchase order, signed authorization, or written approval from an authorized representative.</p>
              </section>
            </div>
            <LetterFooter pageNumber={adminPageNumber} totalPages={proposalPageCount} />
          </div>
        </div>
        <div className="button-row dialog-actions">
          <span className="validation-note">
            {canGeneratePdf
              ? "Use Download PDF, then choose Save as PDF in the browser print dialog."
              : "Enter a valid Quote ID from the external quote register before generating the PDF. Format: KC-YYYY-MMDD-XX."}
          </span>
          <button className="button-secondary" disabled={!canGeneratePdf} onClick={handleDownloadPdf} type="button">
            Download PDF
          </button>
          <button className="button-primary" onClick={onClose} type="button">
            Close preview
          </button>
        </div>
      </section>
    </div>
  );
}
