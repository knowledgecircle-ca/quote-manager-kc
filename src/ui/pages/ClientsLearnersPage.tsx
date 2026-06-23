import { EmptyState } from "@/ui/components/EmptyState";
import { PageHeader } from "@/ui/components/PageHeader";
import { SectionCard } from "@/ui/components/SectionCard";
import { demoLearners } from "@/ui/demo/prototypeData";

export function ClientsLearnersPage() {
  return (
    <section aria-labelledby="clients-learners-title" className="page-stack">
      <PageHeader
        eyebrow="Reusable records"
        title="Clients & Learners"
        subtitle="Prototype view for the records that will later feed proposal drafts. Records shown here are DEMO only."
      />
      <div className="two-column-grid">
        <SectionCard title="Client records" description="Reusable organizations and contacts will be modeled later.">
          <EmptyState
            title="No persistent client store yet"
            message="This Phase 2A page only shows where client and learner management will live."
          />
        </SectionCard>
        <SectionCard title="Learner cards" description="DEMO cards help validate the proposal workflow.">
          <div className="card-list">
            {demoLearners.map((learner) => (
              <article className="record-card" key={learner.id}>
                <strong>{learner.name}</strong>
                <span>Target language: {learner.targetLanguage}</span>
                <p>{learner.notes}</p>
              </article>
            ))}
          </div>
        </SectionCard>
      </div>
    </section>
  );
}
