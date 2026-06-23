export type EntityId = string;

export type ISODateString = string;

export type ISODateTimeString = string;

export type DocumentLanguage = "en" | "fr";

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

export interface Money {
  amountMinor: number;
  currency: string;
}

export interface StatusEvent {
  id: EntityId;
  proposalId: EntityId;
  versionId: EntityId;
  fromStatus: ProposalStatus | null;
  toStatus: ProposalStatus;
  changedAt: ISODateTimeString;
  changedByUserId: EntityId;
  note?: string;
}

export interface Proposal {
  id: EntityId;
  proposalNumber?: string;
  clientId?: EntityId;
  contactIds: EntityId[];
  learnerIds: EntityId[];
  currentVersionId?: EntityId;
  versionIds: EntityId[];
  statusHistory: StatusEvent[];
  language: DocumentLanguage;
  internalNotes?: string;
  attachmentIds: EntityId[];
  createdAt: ISODateTimeString;
  updatedAt: ISODateTimeString;
}

export interface ProposalVersion {
  id: EntityId;
  proposalId: EntityId;
  revisionNumber: number;
  status: ProposalStatus;
  isImmutable: boolean;
  basedOnVersionId?: EntityId;
  documentDate?: ISODateString;
  subject?: string;
  phaseIds: EntityId[];
  financialLineIds: EntityId[];
  administrativeInfo?: string;
  acceptanceTerms?: string;
  signatureInfo?: string;
  createdAt: ISODateTimeString;
  createdByUserId: EntityId;
}

export interface Client {
  id: EntityId;
  displayName: string;
  legalName?: string;
  type?: string;
  billingAddress?: string;
  notes?: string;
  createdAt: ISODateTimeString;
  updatedAt: ISODateTimeString;
}

export interface Contact {
  id: EntityId;
  clientId: EntityId;
  firstName: string;
  lastName: string;
  title?: string;
  email?: string;
  phone?: string;
  preferredLanguage?: DocumentLanguage;
}

export interface Learner {
  id: EntityId;
  clientId?: EntityId;
  firstName: string;
  lastName: string;
  email?: string;
  languageTarget?: string;
  notes?: string;
}

export interface TrainingType {
  id: EntityId;
  code: string;
  labelEn: string;
  labelFr: string;
  descriptionEn?: string;
  descriptionFr?: string;
  isActive: boolean;
}

export interface Rate {
  id: EntityId;
  trainingTypeId?: EntityId;
  label: string;
  money: Money;
  unit: string;
  effectiveFrom?: ISODateString;
  effectiveTo?: ISODateString;
  isActive: boolean;
  sourceNote?: string;
}

export interface Attachment {
  id: EntityId;
  proposalId: EntityId;
  fileName: string;
  mediaType: string;
  sizeBytes: number;
  storageKey: string;
  description?: string;
  createdAt: ISODateTimeString;
}

export interface Settings {
  id: EntityId;
  companyCoordinates?: string;
  standardTexts?: Record<string, string>;
  templateIds: EntityId[];
  paymentTerms?: string;
  validityDurationDays?: number;
  scheduleRules?: string;
  acceptanceTerms?: string;
  signatureInformation?: string;
  updatedAt: ISODateTimeString;
}

export interface CurrentUser {
  id: EntityId;
  displayName: string;
  email: string;
  role: string;
}
