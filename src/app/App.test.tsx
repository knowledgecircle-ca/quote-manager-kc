import { fireEvent, render, screen, within } from "@testing-library/react";
import { vi } from "vitest";

import { App } from "@/app/App";

describe("App Phase 2A prototype", () => {
  beforeEach(() => {
    window.history.pushState(null, "", "/");
  });

  function openNewProposal() {
    fireEvent.click(screen.getByRole("button", { name: "New proposal" }));
  }

  function openTrainingStep() {
    openNewProposal();
    fireEvent.click(screen.getByRole("button", { name: "Training" }));
  }

  function addLanguageTrainingService() {
    fireEvent.click(screen.getByRole("button", { name: "Add service" }));
    return screen.getByRole("article", { name: "Second language training" });
  }

  function addDiagnosticAssessmentService() {
    if (screen.queryByRole("article", { name: "Second language training" }) === null) {
      addLanguageTrainingService();
    }
    fireEvent.click(screen.getByRole("button", { name: "Add service" }));
    return screen.getByRole("article", { name: "Diagnostic assessment" });
  }

  it("renders the application shell", () => {
    render(<App />);

    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Application navigation" })).toBeInTheDocument();
  });

  it("shows the Proposal Manager title", () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: "Proposal Manager", level: 1 })).toBeInTheDocument();
  });

  it("does not show the old internal workspace kicker", () => {
    render(<App />);

    expect(screen.queryByText("Internal supplier workspace")).not.toBeInTheDocument();
  });

  it("does not show the old global local data warning", () => {
    render(<App />);

    expect(screen.queryByText(/Local prototype - Data is stored only on this device/i)).not.toBeInTheDocument();
  });

  it("redirects the default route to Proposals", () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: "Proposals", level: 2 })).toBeInTheDocument();
    expect(window.location.pathname).toBe("/proposals");
  });

  it("navigates to Proposals from another page", () => {
    window.history.pushState(null, "", "/price-book");
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "Proposals" }));

    expect(screen.getByRole("heading", { name: "Proposals", level: 2 })).toBeInTheDocument();
  });

  it("opens the New Proposal prototype", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "New proposal" }));

    expect(screen.getByRole("heading", { name: "New Proposal", level: 2 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Quote Summary", level: 3 })).toBeInTheDocument();
  });

  it("shows the compact editor header with new draft metadata", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "New proposal" }));

    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeInTheDocument();
    expect(screen.getByText("New draft")).toBeInTheDocument();
    expect(screen.getByText("Saved 10:42")).toBeInTheDocument();
    expect(screen.queryByText("Quote ID NEW-DEMO")).not.toBeInTheDocument();
  });

  it("opens the same Letter preview from the header and Quote Summary", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "New proposal" }));
    fireEvent.change(screen.getByLabelText("Proposal title"), {
      target: { value: "French individual training proposal" },
    });

    expect(screen.getByText("Letter / PDF")).toBeInTheDocument();
    expect(screen.queryByText("A4 / PDF")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Preview" }));

    expect(screen.getByRole("dialog", { name: "Proposal Preview" })).toBeInTheDocument();
    expect(screen.getByText("Draft preview - Letter size")).toBeInTheDocument();
    expect(screen.getByLabelText("Letter-size proposal preview")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "French individual training proposal", level: 3 })).toBeInTheDocument();
    expect(screen.getByText("Second language training proposal (Ref: New draft)")).toBeInTheDocument();
    expect(screen.queryByText("Knowledge Circle Learning Services Inc.")).not.toBeInTheDocument();
    expect(screen.queryByText("Online Second Language Training for the Public Service")).not.toBeInTheDocument();
    expect(screen.queryByText("Quote ID: New draft")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Close preview" }));

    expect(screen.queryByRole("dialog", { name: "Proposal Preview" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Open proposal preview" }));

    expect(screen.getByRole("dialog", { name: "Proposal Preview" })).toBeInTheDocument();
    expect(screen.getByText(/choose Save as PDF in the browser print dialog/i)).toBeInTheDocument();
  });

  it("opens the browser print dialog for PDF download", () => {
    const originalTitle = document.title;
    const printMock = vi.fn();
    Object.defineProperty(window, "print", { configurable: true, value: printMock });
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "New proposal" }));
    fireEvent.click(screen.getByRole("button", { name: "Preview" }));
    fireEvent.click(screen.getAllByRole("button", { name: "Download PDF" })[0]);

    expect(printMock).toHaveBeenCalledTimes(1);
    expect(document.title).toBe(originalTitle);
  });

  it("shows client-facing proposal preview copy and quotation columns", () => {
    render(<App />);

    openTrainingStep();
    addLanguageTrainingService();

    fireEvent.click(screen.getByRole("button", { name: "Preview" }));

    const dialog = screen.getByRole("dialog", { name: "Proposal Preview" });
    expect(within(dialog).getByAltText("Knowledge Circle")).toBeInTheDocument();
    expect(within(dialog).getByText(/is pleased to provide this proposal/i)).toBeInTheDocument();
    expect(within(dialog).getAllByText(/French part-time group training for 1 group/i).length).toBeGreaterThan(0);
    expect(within(dialog).queryByText(/This proposal text will be assembled/i)).not.toBeInTheDocument();
    expect(within(dialog).queryByText("Rate source")).not.toBeInTheDocument();
    expect(within(dialog).getByRole("columnheader", { name: "Item" })).toBeInTheDocument();
    expect(within(dialog).getByRole("columnheader", { name: "Description" })).toBeInTheDocument();
    expect(within(dialog).getByRole("columnheader", { name: "Rate" })).toBeInTheDocument();
    expect(within(dialog).getByRole("columnheader", { name: "Quantity" })).toBeInTheDocument();
    expect(within(dialog).getByRole("columnheader", { name: "Total" })).toBeInTheDocument();
    const quotationTable = within(dialog).getByRole("table");
    const quotationRow = within(quotationTable).getAllByRole("row")[1];
    expect(within(quotationRow).getByText("French group training, MS Teams, 1 group, 6 expected participants.")).toBeInTheDocument();
    expect(within(quotationRow).getByText("36 hours")).toBeInTheDocument();
    expect(within(quotationRow).queryByText(/billable hour/i)).not.toBeInTheDocument();
    expect(within(dialog).getByText("Offer validity")).toBeInTheDocument();
    expect(within(dialog).getByText("MyLearningMyWay access")).toBeInTheDocument();
    expect(within(dialog).getByText("Scheduling preferences")).toBeInTheDocument();
    expect(within(dialog).getByText("Statutory holidays")).toBeInTheDocument();
    expect(within(dialog).getByText(/All times indicated in this proposal are Ottawa, Ontario time/i)).toBeInTheDocument();
    expect(within(dialog).getByText(/indicative only and do not guarantee the final schedule/i)).toBeInTheDocument();
    expect(within(dialog).getByText(/applies Ontario statutory holidays by default/i)).toBeInTheDocument();
    expect(within(dialog).queryByText(/unavailable days: Sat, Sun/i)).not.toBeInTheDocument();
  });

  it("shows four proposal steps with aria-current on the active step", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "New proposal" }));

    const stepper = screen.getByRole("navigation", { name: "Proposal steps" });
    expect(within(stepper).getAllByRole("listitem")).toHaveLength(4);
    expect(within(stepper).getByRole("button", { name: "Basics" })).toHaveAttribute(
      "aria-current",
      "step",
    );
    expect(within(stepper).getByRole("button", { name: "Proposal" })).toBeInTheDocument();
    expect(within(stepper).queryByRole("button", { name: "Review" })).not.toBeInTheDocument();
  });

  it("moves the proposal language choice to the Proposal step", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "New proposal" }));

    expect(screen.queryByRole("group", { name: "Proposal language" })).not.toBeInTheDocument();
    expect(
      screen.queryByText("The proposal document language is separate from the application interface language."),
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Proposal" }));

    expect(screen.getByText("Draft PDF language")).toBeInTheDocument();
    const languageGroup = screen.getByRole("group", { name: "Proposal language" });
    expect(within(languageGroup).getByRole("button", { name: "English" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    fireEvent.click(within(languageGroup).getByRole("button", { name: "Français" }));
    expect(within(languageGroup).getByRole("button", { name: "Français" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    fireEvent.click(screen.getByRole("button", { name: "Preview" }));
    const dialog = screen.getByRole("dialog", { name: "Proposal Preview" });
    expect(within(dialog).getByText("Document language:")).toBeInTheDocument();
    expect(within(dialog).getByText("Français")).toBeInTheDocument();
  });

  it("keeps Basics focused on proposal document fields only", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "New proposal" }));

    expect(screen.queryByRole("heading", { name: "Basics", level: 3 })).not.toBeInTheDocument();
    expect(screen.queryByText(/Set the proposal document context/i)).not.toBeInTheDocument();
    expect(screen.queryByText("Commercial Context")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Client type required")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("SOA or contract")).not.toBeInTheDocument();
    expect(
      screen.queryByText(/SOA or contract details appear only when a Government - Standing Offer client type is selected/i),
    ).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Internal proposal name")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Quote date required")).toBeInTheDocument();
    expect(screen.getByLabelText("Proposal title")).toBeInTheDocument();
  });

  it("shows Pricing as Pending on the Basics step", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "New proposal" }));

    const summary = screen.getByRole("complementary", { name: "Quote Summary" });
    expect(within(summary).getByText("Pricing status")).toBeInTheDocument();
    expect(within(summary).getAllByText("Pending").length).toBeGreaterThan(0);
    expect(within(summary).queryByText("Pricing requires a confirmed rate before approval.")).not.toBeInTheDocument();
    expect(screen.queryByText(/Training and Pricing will be reviewed in later steps/i)).not.toBeInTheDocument();
  });

  it("shows dynamic proposal progress in the quote summary", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "New proposal" }));

    const summary = screen.getByRole("complementary", { name: "Quote Summary" });
    expect(within(summary).getByRole("heading", { name: "Progress", level: 4 })).toBeInTheDocument();
    expect(within(summary).getByText("Step 1 of 4")).toBeInTheDocument();
    expect(within(summary).getByText("Add a service to start the quote")).toBeInTheDocument();
    expect(within(summary).getByText("Pricing starts after services are added")).toBeInTheDocument();
    expect(within(summary).queryByText("1 of 6 steps complete")).not.toBeInTheDocument();
    expect(within(summary).queryByText("Pricing pending")).not.toBeInTheDocument();
    expect(within(summary).queryByText("Training details pending")).not.toBeInTheDocument();
    expect(within(summary).queryByRole("button", { name: "Review issues" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Training" }));
    fireEvent.click(screen.getByRole("button", { name: "Add service" }));

    expect(within(summary).getByText("Step 2 of 4")).toBeInTheDocument();
    expect(within(summary).getByText("1 service configured")).toBeInTheDocument();
    expect(within(summary).getByText("Automatic rates available for all services")).toBeInTheDocument();
  });

  it("shows the primary continue action for the Basics step", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "New proposal" }));

    expect(screen.getByRole("button", { name: "Continue to Training" })).toBeInTheDocument();
  });

  it("uses temporary free-text client fields before the client database exists", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "New proposal" }));

    expect(screen.queryByLabelText("Organization selector required")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Primary contact selector required")).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Learner cards", level: 3 })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Add learner" })).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Learner to be confirmed")).not.toBeInTheDocument();
    expect(screen.queryByText("Client records will be structured in a later phase.")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Organization name")).toHaveAttribute(
      "placeholder",
      "Paste the department, ministry, or organization name",
    );
    expect(screen.getByLabelText("Organization name")).toHaveDisplayValue("Federal Department");
    expect(screen.getByLabelText("Organization name")).not.toHaveAccessibleDescription();
    expect(screen.queryByLabelText("Primary contact name")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Contact name")).toHaveAttribute(
      "placeholder",
      "Paste the contact name or role",
    );
    expect(screen.getByLabelText("Contact name")).not.toHaveAccessibleDescription();
    expect(screen.getByLabelText("Contact details")).toHaveDisplayValue("Contact details");
    expect(screen.queryByText(/Temporary free-text field/i)).not.toBeInTheDocument();
  });

  it("uses the free-text organization and contact in the quote summary and proposal preview", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "New proposal" }));
    fireEvent.change(screen.getByLabelText("Organization name"), {
      target: { value: "Treasury Board of Canada Secretariat" },
    });
    fireEvent.change(screen.getByLabelText("Contact name"), {
      target: { value: "Jane Client" },
    });

    const summary = screen.getByRole("complementary", { name: "Quote Summary" });
    expect(within(summary).getByText("Treasury Board of Canada Secretariat")).toBeInTheDocument();
    expect(within(summary).getByText("Jane Client")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Preview" }));

    const dialog = screen.getByRole("dialog", { name: "Proposal Preview" });
    expect(within(dialog).getByText("Treasury Board of Canada Secretariat")).toBeInTheDocument();
    expect(within(dialog).getByText("Jane Client")).toBeInTheDocument();
    expect(within(dialog).queryByText("DEMO Federal Department")).not.toBeInTheDocument();
  });

  it("does not ask for offer validity or expected acceptance dates in Basics", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "New proposal" }));

    expect(screen.queryByLabelText("Expected client acceptance date")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Validity date required")).not.toBeInTheDocument();
    expect(screen.queryByText(/rate is selected from the client acceptance date/i)).not.toBeInTheDocument();
  });

  it("shows a compact local-data explanation in the editor", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "New proposal" }));

    const localData = screen.getByRole("button", {
      name: /Local data. Data is stored only on this device/i,
    });
    localData.focus();
    expect(localData).toHaveFocus();
    expect(localData).toHaveAttribute(
      "title",
      "Data is stored only on this device. Export a backup regularly.",
    );
  });

  it("changes editor steps", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "New proposal" }));
    fireEvent.click(screen.getByRole("button", { name: "Pricing" }));

    expect(screen.getByRole("heading", { name: "Pricing", level: 3 })).toBeInTheDocument();
    expect(screen.getAllByText("Rate to confirm").length).toBeGreaterThan(0);
  });

  it("starts a new proposal with no requested services", () => {
    render(<App />);

    openTrainingStep();

    expect(screen.queryByRole("article", { name: "Second language training" })).not.toBeInTheDocument();
    expect(screen.queryByRole("article", { name: "Diagnostic assessment" })).not.toBeInTheDocument();
    expect(screen.getByText("No services added yet")).toBeInTheDocument();

    const summary = screen.getByRole("complementary", { name: "Quote Summary" });
    expect(within(summary).getByText("No services added")).toBeInTheDocument();
    expect(within(summary).getByText("0 requested")).toBeInTheDocument();
    expect(within(summary).getByText("0 of 0 services priced automatically")).toBeInTheDocument();
  });

  it("shows training schedule fields inside language-training service blocks only", () => {
    render(<App />);

    openTrainingStep();

    expect(screen.queryByRole("heading", { name: "Training schedule", level: 3 })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Add another phase" })).not.toBeInTheDocument();

    const languageTrainingService = addLanguageTrainingService();
    expect(within(languageTrainingService).getByText("Group set 1")).toBeInTheDocument();
    expect(within(languageTrainingService).getByLabelText("Number of groups")).toHaveDisplayValue("1");
    expect(within(languageTrainingService).getByLabelText("Expected participants total")).toHaveDisplayValue("6");
    expect(within(languageTrainingService).getByText("Max per group")).toBeInTheDocument();
    expect(within(languageTrainingService).getByText("6 default")).toBeInTheDocument();
    expect(within(languageTrainingService).getByText("Recommended groups")).toBeInTheDocument();
    expect(within(languageTrainingService).getByText("Suggested from capacity: 1 groups x 6 max per group.")).toBeInTheDocument();
    expect(screen.getByText("1 group / 6 expected participants / 36 hours")).toBeInTheDocument();
    expect(within(languageTrainingService).getByLabelText("Session")).toHaveDisplayValue("Summer");
    expect(within(languageTrainingService).getByLabelText("Program start date")).toHaveDisplayValue("2026-07-06");
    expect(within(languageTrainingService).queryByLabelText("Training end date")).not.toBeInTheDocument();
    expect(within(languageTrainingService).getByLabelText("Teaching weeks")).toHaveDisplayValue("12");
    expect(within(languageTrainingService).getByLabelText("Buffer weeks")).toHaveDisplayValue("1 week");
    expect(within(languageTrainingService).getByLabelText("Classes per week")).toHaveDisplayValue("2x per week");
    expect(within(languageTrainingService).getByLabelText("Class duration")).toHaveDisplayValue("1.5 h");
    expect(within(languageTrainingService).queryByLabelText("Reserve hours")).not.toBeInTheDocument();
    expect(within(languageTrainingService).getAllByText("Teaching weeks").length).toBeGreaterThanOrEqual(2);
    expect(within(languageTrainingService).getByText("12 weeks")).toBeInTheDocument();
    expect(within(languageTrainingService).getByText("Buffer")).toBeInTheDocument();
    expect(within(languageTrainingService).getAllByText("1 week").length).toBeGreaterThanOrEqual(2);
    expect(within(languageTrainingService).getByText("Calendar span")).toBeInTheDocument();
    expect(within(languageTrainingService).getByText("13 weeks")).toBeInTheDocument();
    expect(within(languageTrainingService).getByText("Weekly rhythm")).toBeInTheDocument();
    expect(
      within(languageTrainingService).getByText("2x per week / 1.5 h classes / 3 h per week"),
    ).toBeInTheDocument();
    expect(within(languageTrainingService).getByText("Hours per group")).toBeInTheDocument();
    expect(within(languageTrainingService).getAllByText("36 h").length).toBeGreaterThanOrEqual(2);
    expect(within(languageTrainingService).getByText("Set billable estimate")).toBeInTheDocument();
    expect(within(languageTrainingService).getByText("Service billable estimate")).toBeInTheDocument();
    expect(within(languageTrainingService).getByRole("group", { name: "Availability & scheduling" })).toBeInTheDocument();
    expect(within(languageTrainingService).getByText("Unavailable days")).toBeInTheDocument();
    expect(within(languageTrainingService).getByText("Preferred days")).toBeInTheDocument();
    expect(within(languageTrainingService).getAllByRole("button", { name: "Sat" })[0]).toHaveAttribute("aria-pressed", "true");
    expect(within(languageTrainingService).getAllByRole("button", { name: "Sun" })[0]).toHaveAttribute("aria-pressed", "true");
    expect(within(languageTrainingService).getByLabelText("Exclude statutory holidays")).toBeChecked();
    expect(within(languageTrainingService).getByLabelText("Time zone for scheduling")).toHaveDisplayValue("Eastern");

    const assessmentService = addDiagnosticAssessmentService();
    expect(within(assessmentService).queryByLabelText("Training start date")).not.toBeInTheDocument();
    expect(within(assessmentService).queryByLabelText("Training end date")).not.toBeInTheDocument();
  });

  it("shows full-time schedule controls with five training days per week", () => {
    render(<App />);

    openTrainingStep();

    const languageTrainingService = addLanguageTrainingService();
    fireEvent.change(within(languageTrainingService).getByLabelText("Training format"), {
      target: { value: "Full-time" },
    });

    expect(within(languageTrainingService).getByLabelText("Training start date")).toHaveDisplayValue("2026-07-06");
    expect(within(languageTrainingService).getByLabelText("Training end date")).toHaveDisplayValue("2026-12-19");
    expect(within(languageTrainingService).getByLabelText("Hours per day")).toHaveDisplayValue("6 h");
    expect(within(languageTrainingService).getByText("5 days per week / 6 h per day / 30 h per week")).toBeInTheDocument();
    expect(within(languageTrainingService).getAllByText("720 h").length).toBeGreaterThanOrEqual(2);

    fireEvent.change(within(languageTrainingService).getByLabelText("Hours per day"), {
      target: { value: "7.5" },
    });

    expect(
      within(languageTrainingService).getByText("5 days per week / 7.5 h per day / 37.5 h per week"),
    ).toBeInTheDocument();
    expect(within(languageTrainingService).getAllByText("900 h").length).toBeGreaterThanOrEqual(2);
  });

  it("supports one or more learners for individual language training", () => {
    render(<App />);

    openTrainingStep();

    const languageTrainingService = addLanguageTrainingService();
    expect(within(languageTrainingService).queryByLabelText("Participants")).not.toBeInTheDocument();
    expect(within(languageTrainingService).getByLabelText("Expected participants total")).toBeInTheDocument();

    fireEvent.change(within(languageTrainingService).getByLabelText("Class type"), {
      target: { value: "Individual" },
    });

    expect(within(languageTrainingService).queryByLabelText("Participants")).not.toBeInTheDocument();
    expect(within(languageTrainingService).getByLabelText("Individual learners")).toHaveDisplayValue("1");
    expect(within(languageTrainingService).getByLabelText("Reserve hours")).toHaveDisplayValue("0");
    expect(within(languageTrainingService).getAllByText("72 h").length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText("KC-NONSOA-LANG-IND / CAD 43.00 / Per hour / N/A")).toBeInTheDocument();
    expect(screen.getByText("Estimated amount: CAD 3096.00")).toBeInTheDocument();

    fireEvent.change(within(languageTrainingService).getByLabelText("Individual learners"), {
      target: { value: "5" },
    });

    expect(within(languageTrainingService).getByLabelText("Availability details apply to")).toHaveDisplayValue("Whole service");
    expect(within(languageTrainingService).getByText("72 h per learner")).toBeInTheDocument();
    expect(within(languageTrainingService).getByText("360 h")).toBeInTheDocument();
    expect(screen.getByText("Estimated amount: CAD 15480.00")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Preview" }));
    const previewDialog = screen.getByRole("dialog", { name: "Proposal Preview" });
    expect(
      within(previewDialog).getByText(
        /The current training plan includes individual training for 5 learners and an estimated 360 billable training hours\./,
      ),
    ).toBeInTheDocument();
    expect(within(previewDialog).queryByText(/5 individuals for 5 participants/i)).not.toBeInTheDocument();
    fireEvent.click(within(previewDialog).getByRole("button", { name: "Close preview" }));

    fireEvent.change(within(languageTrainingService).getByLabelText("Availability details apply to"), {
      target: { value: "by-learner-or-group" },
    });

    const learnerTwoSchedule = within(languageTrainingService).getByRole("group", {
      name: "Learner 2 availability & scheduling",
    });
    fireEvent.click(within(learnerTwoSchedule).getAllByRole("button", { name: "Tue" })[1]);
    fireEvent.change(within(learnerTwoSchedule).getByLabelText("Time zone for scheduling"), {
      target: { value: "Pacific" },
    });

    expect(within(learnerTwoSchedule).getAllByRole("button", { name: "Tue" })[1]).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(within(learnerTwoSchedule).getByText(/retained for scheduling after the contract is received/i)).toBeInTheDocument();

    fireEvent.change(within(languageTrainingService).getByLabelText("Reserve hours"), {
      target: { value: "10" },
    });

    expect(within(languageTrainingService).getByText("10 h per learner")).toBeInTheDocument();
    expect(within(languageTrainingService).getByText("410 h")).toBeInTheDocument();
    expect(screen.getByText("Estimated amount: CAD 17630.00")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Pricing" }));

    const table = screen.getByRole("table", { name: "DEMO service quotation line items" });
    expect(
      within(table).getByText(
        "French / 5 participants / Individual / Part-time / 2x per week / 1.5 h classes / 3 h per week / MS Teams / 72 scheduled hours per learner x 5 learners + 10 reserve hours per learner = 410 total hours",
      ),
    ).toBeInTheDocument();
  });

  it("builds proposals from requested service blocks with automatic Price Book rates", () => {
    render(<App />);

    openTrainingStep();

    expect(screen.getByRole("heading", { name: "Requested services", level: 3 })).toBeInTheDocument();
    addLanguageTrainingService();
    expect(screen.getByText("KC-NONSOA-LANG-GROUP / CAD 45.00 / Per hour / N/A")).toBeInTheDocument();
    expect(screen.getByText("Estimated amount: CAD 1620.00")).toBeInTheDocument();
    expect(screen.queryByLabelText("Compatible Price Book line")).not.toBeInTheDocument();
    expect(screen.getAllByLabelText("Pricing source")[0]).toHaveDisplayValue("Non-SOA");

    addDiagnosticAssessmentService();

    expect(screen.getByRole("heading", { name: "Diagnostic assessment", level: 4 })).toBeInTheDocument();
    expect(screen.getByText("KC-DIAG-ASSESSMENT / CAD 55.00 / Per selected competency / N/A")).toBeInTheDocument();
    expect(screen.getByText("Estimated amount: CAD 55.00")).toBeInTheDocument();
  });

  it("moves focus to a newly added service", () => {
    render(<App />);

    openTrainingStep();

    const languageTrainingService = addLanguageTrainingService();
    expect(languageTrainingService).toHaveFocus();
  });

  it("shows quick service shortcuts when multiple services are configured", () => {
    render(<App />);

    openTrainingStep();

    const languageTrainingService = addLanguageTrainingService();
    addDiagnosticAssessmentService();

    const shortcuts = screen.getByRole("navigation", { name: "Requested service shortcuts" });
    expect(within(shortcuts).getByRole("button", { name: "Service 1: Second language training" })).toBeInTheDocument();
    expect(within(shortcuts).getByRole("button", { name: "Service 2: Diagnostic assessment" })).toBeInTheDocument();

    fireEvent.click(within(shortcuts).getByRole("button", { name: "Service 1: Second language training" }));
    expect(languageTrainingService).toHaveFocus();
  });

  it("allows proposal-specific rate overrides for Non-SOA services only", () => {
    render(<App />);

    openTrainingStep();

    const languageTrainingService = addLanguageTrainingService();
    fireEvent.click(within(languageTrainingService).getByLabelText("Adjust this rate for this proposal only"));
    fireEvent.change(within(languageTrainingService).getByLabelText("Proposal rate"), {
      target: { value: "50.00" },
    });
    fireEvent.change(within(languageTrainingService).getByLabelText("Adjustment note required"), {
      target: { value: "Client-specific approved adjustment" },
    });

    expect(within(languageTrainingService).getByText("Adjusted rate: CAD 50.00")).toBeInTheDocument();
    expect(within(languageTrainingService).getByText("Estimated amount: CAD 1800.00")).toBeInTheDocument();
    expect(within(languageTrainingService).queryByText("Add a note before approving this proposal.")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Pricing" }));
    const table = screen.getByRole("table", { name: "DEMO service quotation line items" });
    expect(within(table).getByText("CAD 50.00")).toBeInTheDocument();
    expect(within(table).getByText("Adjusted from CAD 45.00")).toBeInTheDocument();
    expect(within(table).getByText("CAD 1800.00")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Preview" }));
    const dialog = screen.getByRole("dialog", { name: "Proposal Preview" });
    expect(within(dialog).getByText("CAD 50.00 / Per hour")).toBeInTheDocument();
    expect(within(dialog).getByText("CAD 1800.00")).toBeInTheDocument();
  });

  it("locks rate overrides when a service uses SOA pricing", () => {
    render(<App />);

    openTrainingStep();

    const languageTrainingService = addLanguageTrainingService();
    expect(within(languageTrainingService).getByLabelText("Adjust this rate for this proposal only")).toBeInTheDocument();

    fireEvent.change(within(languageTrainingService).getByLabelText("Pricing source"), {
      target: { value: "SOA" },
    });

    expect(within(languageTrainingService).queryByLabelText("Adjust this rate for this proposal only")).not.toBeInTheDocument();
    expect(within(languageTrainingService).queryByLabelText("Proposal rate")).not.toBeInTheDocument();
  });

  it("adds group sets and multiplies billable hours by the number of groups", () => {
    render(<App />);

    openTrainingStep();

    const languageTrainingService = addLanguageTrainingService();

    fireEvent.change(within(languageTrainingService).getByLabelText("Number of groups"), {
      target: { value: "7" },
    });

    expect(within(languageTrainingService).getByLabelText("Expected participants total")).toHaveDisplayValue("42");
    expect(screen.getByText("7 groups / 42 expected participants / 252 hours")).toBeInTheDocument();
    expect(screen.getByText("Estimated amount: CAD 11340.00")).toBeInTheDocument();

    fireEvent.change(within(languageTrainingService).getByLabelText("Expected participants total"), {
      target: { value: "12" },
    });
    fireEvent.change(within(languageTrainingService).getByLabelText("Number of groups"), {
      target: { value: "1" },
    });

    expect(within(languageTrainingService).getByText("Recommended groups: 2 to cover 12 expected participants.")).toBeInTheDocument();

    fireEvent.change(within(languageTrainingService).getByLabelText("Number of groups"), {
      target: { value: "3" },
    });

    expect(within(languageTrainingService).getByText("Configured capacity covers up to 18 participants.")).toBeInTheDocument();
    expect(within(languageTrainingService).getByText("Total groups")).toBeInTheDocument();
    expect(within(languageTrainingService).getAllByText("3").length).toBeGreaterThanOrEqual(2);
    expect(within(languageTrainingService).getByText("Total participants")).toBeInTheDocument();
    expect(within(languageTrainingService).getByText("12")).toBeInTheDocument();
    expect(within(languageTrainingService).getByText("Hours per group")).toBeInTheDocument();
    expect(within(languageTrainingService).getByText("Set billable estimate")).toBeInTheDocument();
    expect(within(languageTrainingService).getAllByText("108 h").length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText("Estimated amount: CAD 4860.00")).toBeInTheDocument();

    fireEvent.click(within(languageTrainingService).getByRole("button", { name: "Add group set" }));

    expect(within(languageTrainingService).getByText("Group set 2")).toBeInTheDocument();
    expect(
      within(languageTrainingService).getByText(/If one of those changes, add another service/i),
    ).toBeInTheDocument();
  });

  it("summarizes mixed group and individual training services", () => {
    render(<App />);

    openTrainingStep();

    addLanguageTrainingService();
    const secondService = addDiagnosticAssessmentService();

    fireEvent.change(within(secondService).getByLabelText("Service type"), {
      target: { value: "Second language training" },
    });

    const individualTrainingService = screen.getAllByRole("article", { name: "Second language training" })[1];
    fireEvent.change(within(individualTrainingService).getByLabelText("Class type"), {
      target: { value: "Individual" },
    });

    const summary = screen.getByRole("complementary", { name: "Quote Summary" });
    expect(within(summary).getByText("1 group / 1 individual learner / 7 participants / 108 hours")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Preview" }));
    const dialog = screen.getByRole("dialog", { name: "Proposal Preview" });
    expect(
      within(dialog).getByText(
        /The current training plan includes 1 group and individual training for 1 learner, covering 7 participants and an estimated 108 billable training hours\./,
      ),
    ).toBeInTheDocument();
  });

  it("prices complex assessment groups by language and competency mix", () => {
    render(<App />);

    openTrainingStep();

    const assessmentService = addDiagnosticAssessmentService();
    const candidates = within(assessmentService).getAllByLabelText("Candidates");
    const languages = within(assessmentService).getAllByLabelText("Language");
    const reading = within(assessmentService).getAllByLabelText("Reading");
    const oral = within(assessmentService).getAllByLabelText("Oral");

    fireEvent.change(candidates[0], { target: { value: "3" } });
    fireEvent.click(oral[0]);
    fireEvent.click(reading[0]);

    fireEvent.click(within(assessmentService).getByRole("button", { name: "Add assessment group" }));
    fireEvent.change(within(assessmentService).getAllByLabelText("Candidates")[1], { target: { value: "3" } });
    fireEvent.click(within(assessmentService).getAllByLabelText("Writing")[1]);
    fireEvent.click(within(assessmentService).getAllByLabelText("Oral")[1]);
    fireEvent.click(within(assessmentService).getAllByLabelText("Reading")[1]);

    fireEvent.click(within(assessmentService).getByRole("button", { name: "Add assessment group" }));
    fireEvent.change(within(assessmentService).getAllByLabelText("Language")[2], { target: { value: "English" } });
    fireEvent.change(within(assessmentService).getAllByLabelText("Candidates")[2], { target: { value: "6" } });
    fireEvent.click(within(assessmentService).getAllByLabelText("Writing")[2]);
    fireEvent.click(within(assessmentService).getAllByLabelText("Oral")[2]);

    fireEvent.click(within(assessmentService).getByRole("button", { name: "Add assessment group" }));
    fireEvent.change(within(assessmentService).getAllByLabelText("Language")[3], { target: { value: "English" } });
    fireEvent.change(within(assessmentService).getAllByLabelText("Candidates")[3], { target: { value: "3" } });
    fireEvent.click(within(assessmentService).getAllByLabelText("Oral")[3]);
    fireEvent.click(within(assessmentService).getAllByLabelText("Reading")[3]);

    expect(languages[0]).toHaveDisplayValue("French");
    expect(screen.getByText("Quantity: 30 competency units across 15 candidates")).toBeInTheDocument();
    expect(screen.getByText("Estimated amount: CAD 1650.00")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Pricing" }));

    const table = screen.getByRole("table", { name: "DEMO service quotation line items" });
    expect(
      within(table).getByText(
        "French 3: Oral / French 3: Writing, Oral / English 6: Reading, Writing, Oral / English 3: Oral",
      ),
    ).toBeInTheDocument();
    expect(within(table).getByText("30 competency units across 15 candidates")).toBeInTheDocument();
    expect(within(table).getByText("CAD 1650.00")).toBeInTheDocument();
  });

  it("lets a service revision switch between SOA and non-SOA pricing paths", () => {
    render(<App />);

    openTrainingStep();
    addLanguageTrainingService();

    const firstServiceSource = screen.getAllByLabelText("Pricing source")[0];
    fireEvent.change(firstServiceSource, { target: { value: "SOA" } });

    expect(screen.getAllByLabelText("Specific SOA")[0]).toHaveDisplayValue("NMSO - CW2379765");
    expect(screen.getAllByLabelText("Service type")[0]).toHaveDisplayValue("NMSO placement test");

    fireEvent.change(screen.getAllByLabelText("Pricing source")[0], { target: { value: "Non-SOA" } });

    expect(screen.queryAllByLabelText("Specific SOA")).toHaveLength(0);
    expect(screen.getAllByLabelText("Service type")[0]).toHaveDisplayValue("Second language training");
    expect(screen.getByText("KC-NONSOA-LANG-GROUP / CAD 45.00 / Per hour / N/A")).toBeInTheDocument();
    expect(screen.queryByLabelText("Compatible Price Book line")).not.toBeInTheDocument();
  });

  it("derives SOA service-type choices from the selected Price Book source", () => {
    render(<App />);

    openTrainingStep();
    addLanguageTrainingService();
    addDiagnosticAssessmentService();
    fireEvent.change(screen.getAllByLabelText("Pricing source")[1], { target: { value: "SOA" } });

    fireEvent.change(screen.getAllByLabelText("Specific SOA")[0], { target: { value: "SOA-EN578-202723-006-ZF" } });

    const osoServiceType = screen.getAllByLabelText("Service type")[1];
    expect(within(osoServiceType).getByRole("option", { name: "Second language training" })).toBeInTheDocument();
    expect(within(osoServiceType).getByRole("option", { name: "Placement test" })).toBeInTheDocument();
    expect(within(osoServiceType).queryByRole("option", { name: "NMSO placement test" })).not.toBeInTheDocument();

    fireEvent.change(osoServiceType, { target: { value: "Placement test" } });

    expect(screen.getByText("KC-OSO-STREAM-8 / CAD 75.00 / Per candidate / 2021-05-01 to 2026-07-03")).toBeInTheDocument();

    fireEvent.change(screen.getAllByLabelText("Specific SOA")[0], { target: { value: "SOA-20230676" } });

    const trainingOnlyServiceType = screen.getAllByLabelText("Service type")[1];
    expect(trainingOnlyServiceType).toHaveDisplayValue("Second language training");
    expect(within(trainingOnlyServiceType).queryByRole("option", { name: "Placement test" })).not.toBeInTheDocument();
    expect(
      within(trainingOnlyServiceType).queryByRole("option", { name: "Assessment / evaluation / placement" }),
    ).not.toBeInTheDocument();

    const fcacService = screen.getAllByRole("article", { name: "Second language training" })[1];
    const fcacClassType = within(fcacService).getByLabelText("Class type");
    const fcacTrainingFormat = within(fcacService).getByLabelText("Training format");
    expect(fcacClassType).toHaveDisplayValue("Group");
    expect(within(fcacClassType).queryByRole("option", { name: "Individual" })).not.toBeInTheDocument();
    expect(fcacTrainingFormat).toHaveDisplayValue("Part-time");
    expect(within(fcacTrainingFormat).queryByRole("option", { name: "Full-time" })).not.toBeInTheDocument();
    expect(screen.getByText("SOA-20230676_0-243 / CAD 42.00 / Per hour / 2025-09-01 to 2026-08-31")).toBeInTheDocument();
  });

  it("shows pricing rows from selected requested services", () => {
    render(<App />);

    openTrainingStep();
    addLanguageTrainingService();
    fireEvent.click(screen.getByRole("button", { name: "Pricing" }));

    const table = screen.getByRole("table", { name: "DEMO service quotation line items" });
    expect(within(table).getByText("KC-NONSOA-LANG-GROUP")).toBeInTheDocument();
    expect(within(table).queryByText("KC-NMSO-PLACEMENT")).not.toBeInTheDocument();
    expect(
      within(table).getByText(
        "Group set 1: 1 groups / French / 6 participants expected total / max 6 default per group / 1 recommended groups / Summer / 12 weeks teaching / 1 week buffer / 2x per week / 1.5 h classes / 3 h per week / MS Teams / 36 h per group / 36 h total",
      ),
    ).toBeInTheDocument();
    expect(within(table).getByText("CAD 1620.00")).toBeInTheDocument();
    expect(screen.getByText("Estimated subtotal")).toBeInTheDocument();
    expect(screen.getAllByText("CAD 1620.00").length).toBeGreaterThan(0);
    expect(screen.getByText(/Amounts are calculated before taxes and final rounding rules/i)).toBeInTheDocument();
  });

  it("shows proposal document clauses for PDF preview", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "New proposal" }));
    fireEvent.click(screen.getByRole("button", { name: "Proposal" }));

    expect(screen.getByRole("heading", { name: "Proposal document", level: 3 })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Preview proposal" })).toBeInTheDocument();
    expect(screen.getByText(/review the sections that will appear in the proposal PDF/i)).toBeInTheDocument();
    expect(screen.getByText("Training access and MyLearningMyWay")).toBeInTheDocument();
    expect(screen.getByText(/class access, calendar, materials, attendance, reports, and homework/i)).toBeInTheDocument();
    expect(screen.getByText("Scheduling preferences disclaimer")).toBeInTheDocument();
    expect(screen.getByText(/preferences are considered for planning/i)).toBeInTheDocument();
    expect(screen.getByText(/Tuesday and Thursday mornings/i)).toBeInTheDocument();
    expect(screen.getByText(/This proposal is valid for 30 days/i)).toBeInTheDocument();
    expect(screen.queryByText(/Cancellation, absence, tax, and contract precedence clauses/i)).not.toBeInTheDocument();
    expect(screen.queryByText("Editable content")).not.toBeInTheDocument();
    expect(screen.queryByText("Letter Proposal Preview")).not.toBeInTheDocument();
    expect(screen.queryByText("Structured placeholder content for review only.")).not.toBeInTheDocument();
  });

  it("does not expose manual rate selection controls after automatic pricing", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "New proposal" }));
    fireEvent.click(screen.getByRole("button", { name: /Pricing/i }));

    expect(screen.queryByRole("button", { name: "Select rate" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Review rate" })).not.toBeInTheDocument();
    expect(screen.queryByRole("dialog", { name: "Select Rate" })).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Manual override reason required")).not.toBeInTheDocument();
  });

  it("filters the table when a summary card is clicked", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: /Draft/i }));

    const table = screen.getByRole("table", { name: "DEMO proposals" });
    expect(within(table).getAllByRole("row")).toHaveLength(2);
    expect(screen.getByText("Showing 1 of 3 proposals.")).toBeInTheDocument();
  });

  it("clearing filters restores all rows", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: /Draft/i }));
    fireEvent.click(screen.getByRole("button", { name: "Clear filters" }));

    const table = screen.getByRole("table", { name: "DEMO proposals" });
    expect(within(table).getAllByRole("row")).toHaveLength(4);
    expect(screen.getByText("Showing 3 of 3 proposals.")).toBeInTheDocument();
  });

  it("shows Rate to confirm instead of masked price placeholders", () => {
    render(<App />);

    expect(screen.getAllByText("Rate to confirm").length).toBeGreaterThan(0);
    expect(screen.queryByText("$--")).not.toBeInTheDocument();
  });

  it("keeps the overflow menu keyboard accessible", () => {
    render(<App />);

    const menuButton = screen.getByRole("button", { name: "More actions for DEMO-001" });
    menuButton.focus();
    expect(menuButton).toHaveFocus();

    fireEvent.keyDown(menuButton, { key: "Enter" });

    expect(screen.getByRole("menu")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("menuitem", { name: "Generate PDF" }));

    expect(screen.getByRole("dialog", { name: "Prototype action" })).toBeInTheDocument();
    expect(screen.getByText(/has not changed data/i)).toBeInTheDocument();
  });

  it("keeps demo records clearly identifiable", () => {
    render(<App />);

    expect(screen.getAllByText("DEMO data")).toHaveLength(3);
  });

  it("does not introduce real price values on the proposals page", () => {
    render(<App />);

    expect(screen.queryByText(/\$\d/)).not.toBeInTheDocument();
  });

  it("keeps main controls keyboard focusable", () => {
    render(<App />);

    const priceBookNav = screen.getByRole("button", { name: "Price Book" });
    priceBookNav.focus();
    expect(priceBookNav).toHaveFocus();

    fireEvent.click(priceBookNav);
    const searchField = screen.getByLabelText("Search price book");
    searchField.focus();
    expect(searchField).toHaveFocus();
  });

  it("shows templates as a reusable clause library", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "Templates" }));

    expect(screen.getByRole("heading", { name: "Templates & Clauses", level: 2 })).toBeInTheDocument();
    expect(screen.getByText(/These clauses feed the Proposal document step/i)).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "Template language" })).toBeInTheDocument();
    expect(screen.getByText("Training access and MyLearningMyWay")).toBeInTheDocument();
    expect(screen.getByDisplayValue(/This proposal is valid for 30 days/i)).toBeInTheDocument();
    expect(screen.getByText("Scheduling preferences disclaimer")).toBeInTheDocument();
    expect(screen.getByDisplayValue(/applies Ontario statutory holidays by default/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue(/All times indicated in the proposal are Ottawa, Ontario time/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue(/Tuesday and Thursday mornings/i)).toBeInTheDocument();
    expect(screen.getByText("Template rules")).toBeInTheDocument();
    expect(screen.queryByText("Editable content")).not.toBeInTheDocument();
  });

  it("does not show a Source filter in the price book controls", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "Price Book" }));

    const filters = screen.getByRole("form", { name: "Price Book filters" });
    expect(within(filters).queryByLabelText("Source")).not.toBeInTheDocument();
  });

  it("shows the updated working price book catalog", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "Price Book" }));

    expect(screen.getByText("Catalogue")).toBeInTheDocument();
    expect(screen.queryByText("Catalogue prototype")).not.toBeInTheDocument();
    expect(screen.queryByText("Working catalog.")).not.toBeInTheDocument();
    expect(screen.queryByText(/Review active SOA sources separately/i)).not.toBeInTheDocument();
    expect(screen.queryByText("KC-SOA-LANG-IND")).not.toBeInTheDocument();
    expect(screen.queryByText("KC-SOA-LANG-GROUP")).not.toBeInTheDocument();
    expect(screen.getByText(/Rates are validated when a proposal is accepted or a contract is received/i)).toBeInTheDocument();
    expect(screen.getByText("KC-NONSOA-LANG-IND")).toBeInTheDocument();
    expect(screen.getByText("CAD 43.00")).toBeInTheDocument();
    expect(screen.getAllByText("Per hour").length).toBeGreaterThan(0);
    expect(screen.getAllByText("N/A").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Diagnostic assessment").length).toBeGreaterThan(0);
    expect(screen.getAllByText("NMSO placement test").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Placement test").length).toBeGreaterThan(0);
    expect(screen.getAllByText("CCC assessment").length).toBeGreaterThan(0);
    expect(screen.getByText("KC-OSO-STREAM-4")).toBeInTheDocument();
    expect(screen.getByText("OSO Stream 8 - placement tests")).toBeInTheDocument();
    expect(screen.getAllByText("OSO SOA").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Per candidate").length).toBeGreaterThan(0);
    expect(screen.queryByRole("button", { name: /SOA rate review/i })).not.toBeInTheDocument();
    expect(screen.getByText("KC-CCC-LANG-GROUP")).toBeInTheDocument();
    expect(screen.getByText("2 to 15 participants")).toBeInTheDocument();
    expect(screen.getAllByText("2026-01-20 to 2028-03-31").length).toBeGreaterThan(0);
    expect(screen.getByText("CAD 46.00")).toBeInTheDocument();
    expect(screen.getAllByText(/Reading, Writing, Oral/i).length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("button", { name: /SOA sources/i }));

    expect(screen.getByText("Canadian Commercial Corporation")).toBeInTheDocument();
    expect(screen.getByText("106974.136")).toBeInTheDocument();
    expect(screen.getByText("48 business hours")).toBeInTheDocument();
    expect(screen.getByText("2026-01-20 to 2028-03-31")).toBeInTheDocument();
    expect(screen.getByText("EN578-202723/006/ZF")).toBeInTheDocument();
    expect(screen.queryByText("Active - rates to confirm")).not.toBeInTheDocument();
  });

  it("includes SOA review lines inside the unified price lines list", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "Price Book" }));

    expect(screen.getByText("SOA-100018367_0-224")).toBeInTheDocument();
    expect(screen.getByText("SOA-4600002737_0-257")).toBeInTheDocument();
    expect(screen.getByText("SOA-CW2379765-607")).toBeInTheDocument();
    expect(screen.getAllByText("2025-11-07 to 2026-11-06").length).toBeGreaterThan(0);
    expect(screen.getAllByText("2024-11-01 to 2029-11-01").length).toBeGreaterThan(0);
    expect(screen.getAllByText("2021-05-01 to 2026-07-03").length).toBeGreaterThan(0);
    expect(screen.getAllByText("CAD 36.00").length).toBeGreaterThan(0);
    expect(screen.getAllByText("CAD 75.00").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Per candidate").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Not applicable").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Service basis").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Schedule / delivery").length).toBeGreaterThan(0);
    expect(screen.queryByText("Needs review")).not.toBeInTheDocument();
    expect(screen.getAllByText("CONFIRMED").length).toBeGreaterThan(25);
    expect(screen.queryByText("Confirm language and billing unit before quoting.")).not.toBeInTheDocument();
    expect(
      screen.getByText(
        (_, node) => node?.textContent?.replace(/\s+/g, " ").trim() === "Showing 39 of 39 price lines.",
      ),
    ).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Search price book"), {
      target: { value: "Group starts at 2 participants" },
    });

    expect(screen.getByText("SOA-4600002737_0-257")).toBeInTheDocument();
    expect(screen.queryByText("SOA-CW2379765-607")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Edit - Edit SOA-4600002737_0-257" }));

    expect(screen.getByDisplayValue("Per hour")).toBeInTheDocument();
    expect(
      screen.getByDisplayValue(
        "Usable SOA group line. Group starts at 2 participants; no maximum is assumed unless the source states one.",
      ),
    ).toBeInTheDocument();
  });

  it("opens the price lines for a selected SOA source", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "Price Book" }));
    fireEvent.click(screen.getByRole("button", { name: /SOA sources/i }));

    const cccRow = screen.getByText("106974.136").closest("tr");
    expect(cccRow).not.toBeNull();

    fireEvent.click(cccRow as HTMLTableRowElement);

    expect(
      within(screen.getByRole("group", { name: "Price Book view" })).getByRole("button", { name: /Price lines/i }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText(/Showing price lines for/i)).toHaveTextContent("CCC");
    expect(
      screen.getByText(
        (_, node) => node?.textContent?.replace(/\s+/g, " ").trim() === "Showing 6 of 39 price lines.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("KC-CCC-LANG-GROUP")).toBeInTheDocument();
    expect(screen.getByText("KC-CCC-ASSESS-ORAL")).toBeInTheDocument();
    expect(screen.queryByText("KC-NONSOA-LANG-IND")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Show all price lines" }));

    expect(
      screen.getByText(
        (_, node) => node?.textContent?.replace(/\s+/g, " ").trim() === "Showing 39 of 39 price lines.",
      ),
    ).toBeInTheDocument();
  });

  it("edits a price book line locally", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "Price Book" }));
    fireEvent.click(screen.getByRole("button", { name: "Edit - Edit KC-NONSOA-LANG-IND" }));
    fireEvent.change(screen.getByLabelText("Label"), {
      target: { value: "Language training - individual updated" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save local changes" }));

    expect(screen.getByText("Language training - individual updated")).toBeInTheDocument();
  });

  it("adds and archives local price book records", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "Price Book" }));
    fireEvent.click(screen.getByRole("button", { name: "Add product line" }));
    fireEvent.change(screen.getByLabelText("Code"), {
      target: { value: "KC-LOCAL-TEST" },
    });
    fireEvent.change(screen.getByLabelText("Label"), {
      target: { value: "Local test product" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save local changes" }));

    expect(screen.getByText("KC-LOCAL-TEST")).toBeInTheDocument();
    expect(screen.getByText("Local test product")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Archive - Archive KC-LOCAL-TEST" }));

    expect(screen.getByText("Inactive")).toBeInTheDocument();
  });

  it("adds and archives a local SOA source", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "Price Book" }));
    fireEvent.click(screen.getByRole("button", { name: "Add SOA source" }));
    fireEvent.change(screen.getByLabelText("Display Name"), {
      target: { value: "Local SOA test" },
    });
    fireEvent.change(screen.getByLabelText("Standing Offer Number"), {
      target: { value: "SOA-LOCAL-001" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save local changes" }));
    fireEvent.click(screen.getByRole("button", { name: /SOA sources/i }));

    expect(screen.getByText("Local SOA test")).toBeInTheDocument();
    expect(screen.getByText("SOA-LOCAL-001")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Archive - Archive Local SOA test" }));

    expect(screen.getAllByText("Inactive").length).toBeGreaterThan(0);
  });

  it("filters the price book through the global search field", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "Price Book" }));
    fireEvent.change(screen.getByLabelText("Search price book"), {
      target: { value: "stream 8" },
    });

    expect(screen.getByText("KC-OSO-STREAM-8")).toBeInTheDocument();
    expect(screen.queryByText("KC-OSO-STREAM-4")).not.toBeInTheDocument();
    expect(
      screen.getByText(
        (_, node) => node?.textContent?.replace(/\s+/g, " ").trim() === "Showing 1 of 39 price lines.",
      ),
    ).toBeInTheDocument();
  });
});
