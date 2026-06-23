interface LocalDataBannerProps {
  variant?: "full" | "compact";
}

export function LocalDataBanner({ variant = "full" }: LocalDataBannerProps) {
  const explanation = "Data is stored only on this device. Export a backup regularly.";

  if (variant === "full") {
    return null;
  }

  if (variant === "compact") {
    return (
      <button
        aria-label={`Local data. ${explanation}`}
        className="local-data-banner local-data-compact"
        title={explanation}
        type="button"
      >
        <span aria-hidden="true">i</span>
        Local data
      </button>
    );
  }
}
