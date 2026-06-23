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
});
