import { describe, expect, it, vi } from "vitest";

import { printProposalDraftPdf } from "./printProposalDraftPdf";

describe("printProposalDraftPdf", () => {
  it("sets a document title for browser PDF saving and restores the previous title", () => {
    let currentTitle = "Proposal Manager";
    const print = vi.fn();

    printProposalDraftPdf({
      documentTitle: "French training proposal - draft",
      getDocumentTitle: () => currentTitle,
      print,
      setDocumentTitle: (nextTitle) => {
        currentTitle = nextTitle;
      },
    });

    expect(print).toHaveBeenCalledTimes(1);
    expect(currentTitle).toBe("Proposal Manager");
  });

  it("can defer title restoration until the browser print dialog closes", () => {
    let currentTitle = "Proposal Manager";
    let restoreTitle: (() => void) | undefined;
    const print = vi.fn();

    printProposalDraftPdf({
      documentTitle: "KC-2026-0623-01 - French training proposal",
      getDocumentTitle: () => currentTitle,
      print,
      restoreDocumentTitle: (restore) => {
        restoreTitle = restore;
      },
      setDocumentTitle: (nextTitle) => {
        currentTitle = nextTitle;
      },
    });

    expect(print).toHaveBeenCalledTimes(1);
    expect(currentTitle).toBe("KC-2026-0623-01 - French training proposal");

    restoreTitle?.();

    expect(currentTitle).toBe("Proposal Manager");
  });
});
