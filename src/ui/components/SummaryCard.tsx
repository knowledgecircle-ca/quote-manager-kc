interface SummaryCardProps {
  label: string;
  value: string;
  detail?: string;
}

export function SummaryCard({ detail, label, value }: SummaryCardProps) {
  return (
    <article className="summary-card">
      <span>{label}</span>
      <strong>{value}</strong>
      {detail && <p>{detail}</p>}
    </article>
  );
}
