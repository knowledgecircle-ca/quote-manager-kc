import { PageHeader } from "@/ui/components/PageHeader";
import { SectionCard } from "@/ui/components/SectionCard";

interface SettingsBackupPageProps {
  onPrototypeAction: (actionName: string) => void;
}

export function SettingsBackupPage({ onPrototypeAction }: SettingsBackupPageProps) {
  return (
    <section aria-labelledby="settings-title" className="page-stack">
      <PageHeader
        eyebrow="Local configuration"
        title="Settings & Backup"
        subtitle="Visual sections for defaults and local-data controls. Actions are prototype-only unless implemented safely later."
      />
      <div className="settings-layout">
        <SectionCard title="Company details" description="Coordinates, signature block, and administrative defaults.">
          <label>
            Company display name
            <input defaultValue="Knowledge Circle Learning Services Inc." />
          </label>
          <label>
            Default proposal contact
            <input defaultValue="Kevin - Account Manager" />
          </label>
        </SectionCard>
        <SectionCard title="Branding placeholders" description="Logo, colours, letterhead, footer, and signature extension points.">
          <div className="brand-placeholder">KC</div>
        </SectionCard>
        <SectionCard title="Local data warning" description="The MVP will store data on this device when persistence is implemented.">
          <p className="inline-warning">Standalone MVP - Data is stored locally on this device</p>
        </SectionCard>
        <SectionCard title="Backup controls" description="Export, import, and reset are prototype-only in Phase 2A.">
          <div className="button-row">
            <button className="button-secondary" onClick={() => onPrototypeAction("Export backup")} type="button">
              Export backup - prototype only
            </button>
            <button className="button-secondary" onClick={() => onPrototypeAction("Import backup")} type="button">
              Import backup - prototype only
            </button>
            <button className="button-danger" onClick={() => onPrototypeAction("Reset demo data")} type="button">
              Reset demo data - prototype only
            </button>
          </div>
        </SectionCard>
      </div>
    </section>
  );
}
