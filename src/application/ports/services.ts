import type { CurrentUser } from "@/domain/models";

export interface ProposalDocument {
  fileName: string;
  language: "en" | "fr";
  title: string;
}

export interface GeneratedPdf {
  fileName: string;
  blob: Blob;
}

export interface BackupPayload {
  formatVersion: number;
  exportedAt: string;
  data: unknown;
}

export interface ImportResult {
  importedAt: string;
  restoredPreviousState: boolean;
}

export interface CurrentUserProvider {
  getCurrentUser(): Promise<CurrentUser>;
}

export interface PdfGenerator {
  generate(document: ProposalDocument): Promise<GeneratedPdf>;
}

export interface BackupService {
  exportAll(): Promise<BackupPayload>;
  importAll(payload: BackupPayload): Promise<ImportResult>;
  resetAll(): Promise<void>;
}
