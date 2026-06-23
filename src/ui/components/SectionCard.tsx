import type { ReactNode } from "react";

interface SectionCardProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}

export function SectionCard({ actions, children, description, title }: SectionCardProps) {
  return (
    <section className="section-card" aria-labelledby={`${title.replaceAll(" ", "-")}-title`}>
      <div className="section-card-header">
        <div>
          <h3 id={`${title.replaceAll(" ", "-")}-title`}>{title}</h3>
          {description && <p>{description}</p>}
        </div>
        {actions && <div className="section-actions">{actions}</div>}
      </div>
      {children}
    </section>
  );
}
