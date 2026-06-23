interface QuoteSummaryProps {
  activeStepId?: string;
  onOpenPreview?: () => void;
  previewTitle?: string;
  requestedServices?: Array<{
    family: string;
    priceLineCode: string;
  }>;
  trainingSummary?: string;
  summary: {
    client: string;
    contact: string;
    learnerCount: string;
    phaseCount: string;
    estimatedHours: string;
    pricingStatus: string;
    maximumAmount: string;
    validity: string;
    errors: string[];
    warnings: string[];
  };
}

const proposalStepOrder = ["basics", "training-phases", "pricing", "content"] as const;

function progressDetails(activeStepId: string, selectedServiceCount: number, pricedServiceCount: number) {
  const activeStepIndex = Math.max(0, proposalStepOrder.indexOf(activeStepId as (typeof proposalStepOrder)[number]));
  const activeStepNumber = activeStepIndex + 1;
  const totalSteps = proposalStepOrder.length;
  const progressPercent = Math.round((activeStepNumber / totalSteps) * 100);
  const issues: string[] = [];

  if (selectedServiceCount === 0) {
    issues.push("Add a service to start the quote");
  } else {
    issues.push(`${selectedServiceCount} service${selectedServiceCount === 1 ? "" : "s"} configured`);
  }

  if (selectedServiceCount === 0) {
    issues.push("Pricing starts after services are added");
  } else if (pricedServiceCount === selectedServiceCount) {
    issues.push("Automatic rates available for all services");
  } else {
    issues.push(`${selectedServiceCount - pricedServiceCount} service${selectedServiceCount - pricedServiceCount === 1 ? "" : "s"} need rate review`);
  }

  if (activeStepId === "content") {
    issues.push("Proposal document ready for preview");
  } else {
    issues.push("Proposal document not reviewed yet");
  }

  return {
    activeStepNumber,
    issues,
    progressLabel: `Step ${activeStepNumber} of ${totalSteps}`,
    progressPercent,
    totalSteps,
  };
}

export function QuoteSummary({
  activeStepId = "basics",
  onOpenPreview,
  previewTitle = "Proposal",
  requestedServices = [],
  summary,
  trainingSummary,
}: QuoteSummaryProps) {
  const maximumAmount = activeStepId === "basics" ? "Pending" : summary.maximumAmount;
  const selectedServiceCount = requestedServices.length;
  const pricedServiceCount = requestedServices.filter((service) => service.priceLineCode).length;
  const progress = progressDetails(activeStepId, selectedServiceCount, pricedServiceCount);
  const previewServiceLabel =
    selectedServiceCount === 0
      ? "No services yet"
      : `${selectedServiceCount} service${selectedServiceCount === 1 ? "" : "s"}`;
  const previewTrainingLabel =
    selectedServiceCount === 0
      ? "Add services to build the draft."
      : `Summary: ${trainingSummary ?? "Draft content ready."}`;

  return (
    <aside className="quote-summary" aria-labelledby="quote-summary-title">
      <h3 id="quote-summary-title">Quote Summary</h3>
      <section className="summary-section">
        <h4>Quote at a Glance</h4>
        <dl>
          <div>
            <dt>Client</dt>
            <dd>{summary.client}</dd>
          </div>
          <div>
            <dt>Contact</dt>
            <dd>{summary.contact}</dd>
          </div>
          <div>
            <dt>Training</dt>
            <dd>{trainingSummary ?? `${summary.learnerCount} learners / ${summary.phaseCount} phase / ${summary.estimatedHours} hours`}</dd>
          </div>
          <div>
            <dt>Services</dt>
            <dd>{selectedServiceCount || 0} requested</dd>
          </div>
        </dl>
      </section>
      <section className="summary-section">
        <h4>Pricing</h4>
        <dl>
          <div>
            <dt>Pricing status</dt>
            <dd>{pricedServiceCount} of {selectedServiceCount || 0} services priced automatically</dd>
          </div>
          <div>
            <dt>Maximum amount</dt>
            <dd>{maximumAmount}</dd>
          </div>
        </dl>
      </section>
      <section className="summary-section">
        <h4>Progress</h4>
        <div className="readiness-meter" aria-label={`${progress.progressLabel} in proposal workflow`}>
          <span style={{ width: `${progress.progressPercent}%` }} />
        </div>
        <p>{progress.progressLabel}</p>
        <ul className="readiness-list">
          {progress.issues.map((issue) => (
            <li key={issue}>{issue}</li>
          ))}
        </ul>
      </section>
      <section className="summary-section summary-preview" aria-labelledby="summary-preview-title">
        <div className="summary-preview-heading">
          <h4 id="summary-preview-title">Proposal preview</h4>
          <span>Letter / PDF</span>
        </div>
        <button
          aria-label="Open proposal preview"
          className="mini-paper-button"
          onClick={onOpenPreview}
          type="button"
        >
          <span className="mini-paper" aria-hidden="true">
            <span className="mini-paper-title">{previewTitle}</span>
            <span className="mini-line mini-line-accent" />
            <span className="mini-paper-copy">{previewServiceLabel}</span>
            <span className="mini-paper-copy mini-paper-copy-muted">{previewTrainingLabel}</span>
            <span className="mini-line mini-line-wide" />
            <span className="mini-line" />
            <span className="mini-line mini-line-wide" />
            <span className="mini-line mini-line-short" />
          </span>
        </button>
        <p className="summary-preview-caption">Overview / Training Details / Quotation / Acceptance</p>
      </section>
    </aside>
  );
}
