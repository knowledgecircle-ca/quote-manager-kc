interface EmptyStateProps {
  title: string;
  message: string;
}

export function EmptyState({ message, title }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <strong>{title}</strong>
      <p>{message}</p>
    </div>
  );
}
