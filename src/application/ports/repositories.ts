import type {
  Attachment,
  Client,
  Contact,
  EntityId,
  Learner,
  Proposal,
  ProposalVersion,
  Rate,
  Settings,
  TrainingType,
} from "@/domain/models";
import type { PriceBookEntry } from "@/domain/price-book";

export interface ProposalRepository {
  list(): Promise<Proposal[]>;
  getById(id: EntityId): Promise<Proposal | null>;
  save(proposal: Proposal): Promise<void>;
  saveVersion(version: ProposalVersion): Promise<void>;
  getVersionById(id: EntityId): Promise<ProposalVersion | null>;
}

export interface ClientRepository {
  list(): Promise<Client[]>;
  getById(id: EntityId): Promise<Client | null>;
  save(client: Client): Promise<void>;
  listContacts(clientId: EntityId): Promise<Contact[]>;
  saveContact(contact: Contact): Promise<void>;
}

export interface LearnerRepository {
  list(): Promise<Learner[]>;
  getById(id: EntityId): Promise<Learner | null>;
  save(learner: Learner): Promise<void>;
}

export interface TrainingTypeRepository {
  list(): Promise<TrainingType[]>;
  getById(id: EntityId): Promise<TrainingType | null>;
  save(trainingType: TrainingType): Promise<void>;
}

export interface RateRepository {
  list(): Promise<Rate[]>;
  getById(id: EntityId): Promise<Rate | null>;
  save(rate: Rate): Promise<void>;
}

export interface PriceBookRepository {
  list(): Promise<PriceBookEntry[]>;
  replaceAll(entries: PriceBookEntry[]): Promise<void>;
  clear(): Promise<void>;
}

export interface SettingsRepository {
  get(): Promise<Settings>;
  save(settings: Settings): Promise<void>;
  restoreDefaults(): Promise<Settings>;
}

export interface AttachmentRepository {
  listForProposal(proposalId: EntityId): Promise<Attachment[]>;
  getById(id: EntityId): Promise<Attachment | null>;
  save(attachment: Attachment): Promise<void>;
  remove(id: EntityId): Promise<void>;
}
