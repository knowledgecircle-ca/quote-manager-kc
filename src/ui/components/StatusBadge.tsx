interface StatusBadgeProps {
  tone?: "neutral" | "success" | "warning" | "danger";
  children: string;
}

const statusIcons: Record<string, string> = {
  "Approved internally": "Check",
  Accepted: "Check",
  Cancelled: "Stop",
  "Change requested": "Alert",
  Draft: "Edit",
  Expired: "Clock",
  Revised: "Rev",
  Sent: "Send",
  Viewed: "View",
};

export function StatusBadge({ children, tone = "neutral" }: StatusBadgeProps) {
  return (
    <span className={`status-badge status-badge-${tone}`}>
      <span aria-hidden="true" className="status-icon">
        {statusIcons[children] ?? "Info"}
      </span>
      {children}
    </span>
  );
}
