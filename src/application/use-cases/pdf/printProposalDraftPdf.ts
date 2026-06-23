export interface PrintProposalDraftPdfInput {
  documentTitle: string;
  print: () => void;
  setDocumentTitle: (title: string) => void;
  getDocumentTitle: () => string;
}

export function printProposalDraftPdf(input: PrintProposalDraftPdfInput) {
  const previousTitle = input.getDocumentTitle();
  input.setDocumentTitle(input.documentTitle);
  input.print();
  input.setDocumentTitle(previousTitle);
}
