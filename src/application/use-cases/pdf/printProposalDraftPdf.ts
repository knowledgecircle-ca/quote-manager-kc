export interface PrintProposalDraftPdfInput {
  documentTitle: string;
  print: () => void;
  setDocumentTitle: (title: string) => void;
  getDocumentTitle: () => string;
  restoreDocumentTitle?: (restore: () => void) => void;
}

export function printProposalDraftPdf(input: PrintProposalDraftPdfInput) {
  const previousTitle = input.getDocumentTitle();
  let restored = false;
  const restore = () => {
    if (restored) {
      return;
    }

    input.setDocumentTitle(previousTitle);
    restored = true;
  };

  input.setDocumentTitle(input.documentTitle);
  input.print();
  if (input.restoreDocumentTitle) {
    input.restoreDocumentTitle(restore);
    return;
  }

  restore();
}
