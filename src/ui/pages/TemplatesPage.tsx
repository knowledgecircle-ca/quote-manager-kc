import { useState } from "react";

import { PageHeader } from "@/ui/components/PageHeader";
import { SectionCard } from "@/ui/components/SectionCard";
import { templateSections } from "@/ui/demo/prototypeData";

type TemplateLanguage = "English" | "Francais";

export function TemplatesPage() {
  const [language, setLanguage] = useState<TemplateLanguage>("English");
  const needsReviewCount = templateSections.filter((section) => section.reviewState === "Needs review").length;
  const generatedCount = templateSections.filter((section) => section.reviewState === "Generated").length;
  const templateCount = templateSections.length - generatedCount;

  return (
    <section aria-labelledby="templates-title" className="page-stack">
      <PageHeader
        eyebrow="Template library"
        title="Templates & Clauses"
        subtitle="Maintain reusable proposal text separately from each proposal. English and French versions remain independent."
      />
      <SectionCard
        actions={
          <div aria-label="Template language" className="segmented-control" role="group">
            {(["English", "Francais"] as const).map((option) => (
              <button
                aria-pressed={language === option}
                key={option}
                onClick={() => setLanguage(option)}
                type="button"
              >
                {option}
              </button>
            ))}
          </div>
        }
        title="Proposal document library"
      >
        <div className="template-library-intro">
          <p>
            These clauses feed the Proposal document step. Service-specific wording is generated from structured proposal
            data; reusable administrative wording stays here so it can later be maintained in English and French.
          </p>
          <dl className="content-summary-metrics" aria-label="Template library summary">
            <div>
              <dt>Sections</dt>
              <dd>{templateSections.length}</dd>
            </div>
            <div>
              <dt>Templates</dt>
              <dd>{templateCount}</dd>
            </div>
            <div>
              <dt>Generated</dt>
              <dd>{generatedCount}</dd>
            </div>
            <div>
              <dt>Review</dt>
              <dd>{needsReviewCount}</dd>
            </div>
          </dl>
        </div>
      </SectionCard>

      <div className="template-library-layout">
        <section className="template-library-list" aria-labelledby="template-sections-title">
          <h3 id="template-sections-title">{language} sections and clauses</h3>
          {templateSections.map((section) => (
            <article className="template-library-card" key={section.id}>
              <div className="template-library-card-header">
                <div>
                  <h4>{section.title}</h4>
                  <p>{section.appliesWhen}</p>
                </div>
                <span className={`content-state ${section.reviewState === "Needs review" ? "content-state-warning" : ""}`}>
                  {section.reviewState ?? section.status}
                </span>
              </div>
              <dl className="template-metadata">
                <div>
                  <dt>Source</dt>
                  <dd>{section.source}</dd>
                </div>
                <div>
                  <dt>Use in Proposal document</dt>
                  <dd>{section.reviewState === "Generated" ? "Generated from proposal fields" : "Reusable clause"}</dd>
                </div>
              </dl>
              <label>
                Template body
                <textarea rows={4} defaultValue={`${section.content}${language === "Francais" ? "\n\n[French version to be maintained separately.]" : ""}`} />
              </label>
              <div className="template-card-footer">
                <span>No client-specific data belongs in this template.</span>
                <button className="button-secondary" type="button">
                  Reset draft text
                </button>
              </div>
            </article>
          ))}
        </section>

        <aside className="content-clause-panel" aria-labelledby="template-rules-title">
          <h3 id="template-rules-title">Template rules</h3>
          <ul>
            <li>
              <strong>Language separation</strong>
              <span>English and French text must be maintained independently, not auto-translated silently.</span>
            </li>
            <li>
              <strong>Structured data first</strong>
              <span>Client, dates, rates, groups, candidates, and services should come from proposal fields.</span>
            </li>
            <li>
              <strong>Conditional clauses</strong>
              <span>MyLearningMyWay, scheduling preferences, SOA, non-SOA, assessment, security, and billing clauses apply by service context.</span>
            </li>
            <li>
              <strong>Prototype only</strong>
              <span>Edits shown here are local UI drafts until template persistence is implemented.</span>
            </li>
          </ul>
          <div className="content-review-note">
            <strong>Next template decision</strong>
            <p>Cancellation, absence, tax, and contract-precedence clauses still need approval before they become required PDF clauses.</p>
          </div>
        </aside>
      </div>
    </section>
  );
}
