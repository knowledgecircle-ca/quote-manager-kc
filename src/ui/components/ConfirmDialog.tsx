interface ConfirmDialogProps {
  actionName: string;
  onClose: () => void;
}

export function ConfirmDialog({ actionName, onClose }: ConfirmDialogProps) {
  return (
    <div className="dialog-backdrop" role="presentation">
      <div aria-labelledby="placeholder-dialog-title" aria-modal="true" className="dialog" role="dialog">
        <h2 id="placeholder-dialog-title">Prototype action</h2>
        <p>
          {actionName} is a clickable placeholder in this Phase 2A prototype.
          It has not changed data, generated a PDF, sent email, or called any service.
        </p>
        <button className="button-primary" onClick={onClose} type="button">
          Close
        </button>
      </div>
    </div>
  );
}
