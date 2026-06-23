import { PageHeader } from "@/ui/components/PageHeader";
import { SectionCard } from "@/ui/components/SectionCard";

const coreScenarios = [
  "Create a blank proposal and confirm that no service is preselected.",
  "Add individual second-language training for one learner, then change it to multiple learners with the same conditions.",
  "Add group second-language training with multiple groups, a session, teaching weeks, buffer weeks, frequency, and class duration.",
  "Create a mixed proposal with training plus diagnostic assessment.",
  "Test assessment quantities where French and English candidates require different competencies.",
  "Select SOA pricing, then switch to Non-SOA pricing and verify that compatible rates update automatically.",
  "Override a Non-SOA rate for this proposal only and confirm the adjusted total appears in Pricing and Preview.",
  "Open the proposal preview and generate the PDF using the browser print dialog.",
];

const reviewChecklist = [
  "Are the training descriptions clear enough for a client to understand what they are buying?",
  "Do group and individual training summaries use the right terminology?",
  "Are quantities, rates, and totals easy to verify?",
  "Are SOA, Non-SOA, NMSO, CCC, diagnostic, placement, and assessment options clear?",
  "Does the PDF look professional enough to share as a test version?",
  "Are the administrative clauses accurate and protective enough?",
  "Which real-world scenarios are still missing from the workflow?",
];

const prototypeLimits = [
  "Data is still prototype/local test data unless a persistence feature is explicitly added.",
  "The PDF is generated through the browser print dialog.",
  "Status changes, revisions, approval, backup, import, and export are not yet complete production workflows.",
  "There is no backend, authentication, email, CRM integration, OpenAI integration, or Ezsked sync.",
  "No real client data or confidential attachments should be entered during testing.",
];

export function HelpPage() {
  return (
    <section aria-labelledby="help-title" className="page-stack help-page">
      <PageHeader
        eyebrow="Testing guide"
        title="Help"
        subtitle="Use this guide to review the Proposal Manager MVP before sharing detailed feedback."
      />

      <div className="help-hero">
        <div>
          <h3>Goal for this test version</h3>
          <p>
            Validate whether Kevin can build a clear Knowledge Circle proposal, choose services, apply Price Book rates,
            review totals, and produce a client-facing PDF draft.
          </p>
        </div>
        <dl>
          <div>
            <dt>Primary tester</dt>
            <dd>Kevin</dd>
          </div>
          <div>
            <dt>Data mode</dt>
            <dd>Local prototype</dd>
          </div>
          <div>
            <dt>Output to review</dt>
            <dd>Letter-size PDF draft</dd>
          </div>
        </dl>
      </div>

      <div className="help-grid">
        <SectionCard title="Quick Start" description="A short path through the app for the first test pass.">
          <ol className="help-list">
            <li>Open Proposals and select New proposal.</li>
            <li>Complete Basics with the organization, contact, proposal title, and quote date.</li>
            <li>Add one or more services in Training.</li>
            <li>Review automatic rates and totals in Pricing.</li>
            <li>Review the Proposal document step and open Preview.</li>
            <li>Use Download PDF and choose Save as PDF in the browser print dialog.</li>
          </ol>
        </SectionCard>

        <SectionCard title="Recommended Scenarios" description="These scenarios cover the main business shapes we have discussed.">
          <ul className="help-list">
            {coreScenarios.map((scenario) => (
              <li key={scenario}>{scenario}</li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="What Kevin Should Check" description="Feedback should focus on business accuracy and client readability.">
          <ul className="help-list">
            {reviewChecklist.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="Current Prototype Limits" description="These items are intentionally not complete yet.">
          <ul className="help-list help-list-muted">
            {prototypeLimits.map((limit) => (
              <li key={limit}>{limit}</li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </section>
  );
}
