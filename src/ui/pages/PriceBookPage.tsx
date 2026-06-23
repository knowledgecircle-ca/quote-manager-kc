import { useMemo, useState } from "react";

import { DataTable } from "@/ui/components/DataTable";
import { PageHeader } from "@/ui/components/PageHeader";
import { StatusBadge } from "@/ui/components/StatusBadge";
import {
  demoPriceBookEntries,
  demoSoaRateReviewEntries,
  demoStandingOffers,
  type DemoPriceBookEntry,
  type DemoSoaRateReviewEntry,
  type DemoStandingOffer,
  type PriceStatus,
} from "@/ui/demo/prototypeData";

type PriceBookView = "standing-offers" | "price-lines";
type EditablePriceBookEntry = DemoPriceBookEntry & { isArchived?: boolean };
type EditableStandingOffer = Omit<DemoStandingOffer, "source" | "status"> & {
  isArchived?: boolean;
  source: string;
  status: string;
};
type EditableKind = "price-line" | "standing-offer";
type EditTarget = {
  id?: string;
  kind: EditableKind;
  mode: "add" | "edit";
};

const soaReviewRatesByCode: Record<string, string> = {
  "SOA-100018367_0-214": "CAD 55.00",
  "SOA-100018367_0-219": "CAD 55.00",
  "SOA-100018367_0-224": "CAD 36.00",
  "SOA-100018367_0-229": "CAD 36.00",
  "SOA-100018367_0-234": "CAD 38.00",
  "SOA-100018367_0-239": "CAD 38.00",
  "SOA-20230676_0-243": "CAD 42.00",
  "SOA-2L165-21-0335-185": "CAD 39.00",
  "SOA-2L165-21-0335-190": "CAD 40.00",
  "SOA-2L165-21-0335-195": "CAD 40.00",
  "SOA-2L165-21-0335-200": "CAD 42.00",
  "SOA-2L165-21-0335-205": "CAD 42.00",
  "SOA-2L165-21-0335-210": "CAD 39.00",
  "SOA-37132-23-0001-384": "CAD 45.00",
  "SOA-37132-23-0001-389": "CAD 55.00",
  "SOA-37132-23-0001-394": "CAD 40.00",
  "SOA-37132-23-0001-399": "CAD 40.00",
  "SOA-4600002737_0-247": "CAD 40.00",
  "SOA-4600002737_0-252": "CAD 40.00",
  "SOA-4600002737_0-257": "CAD 40.00",
  "SOA-4600002737_0-262": "CAD 40.00",
  "SOA-CW2379765-592": "CAD 40.00",
  "SOA-CW2379765-597": "CAD 40.00",
  "SOA-CW2379765-602": "CAD 40.00",
  "SOA-CW2379765-607": "CAD 75.00",
};

const priceLineFields = [
  "code",
  "label",
  "source",
  "contractVehicle",
  "service",
  "selection",
  "classType",
  "delivery",
  "activeDates",
  "rate",
  "unit",
  "descriptionRule",
  "status",
] as const;

const standingOfferFields = [
  "code",
  "standingOfferNumber",
  "displayName",
  "agency",
  "source",
  "startDate",
  "endDate",
  "cancellationPolicy",
  "services",
  "activeRateRows",
  "status",
  "notes",
] as const;

function priceTone(status: PriceStatus) {
  if (status === "CONFIRMED") {
    return "success";
  }

  if (status === "MISSING" || status === "EXPIRED") {
    return "danger";
  }

  return "warning";
}

function priceStatusLabel(status: string) {
  if (status === "TO_CONFIRM") {
    return "To confirm";
  }

  return status.replace(/_/g, " ");
}

function normalizeSearch(value: string) {
  return value.trim().toLowerCase();
}

function matchesQuery(values: string[], query: string) {
  if (!query) {
    return true;
  }

  return values.join(" ").toLowerCase().includes(query);
}

function uniqueOptions(values: string[]) {
  return Array.from(new Set(values)).sort((first, second) => first.localeCompare(second));
}

function fieldLabel(field: string, kind?: EditableKind) {
  if (field === "classType") {
    return "Service basis";
  }

  if (kind === "price-line" && field === "delivery") {
    return "Schedule / delivery";
  }

  if (kind === "price-line" && field === "descriptionRule") {
    return "Notes";
  }

  return field.replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase());
}

function archivedLabel(isArchived?: boolean) {
  return isArchived ? "Inactive" : "Active";
}

function standingOfferSearchFields(standingOffer: EditableStandingOffer) {
  return [
    standingOffer.code,
    standingOffer.standingOfferNumber,
    standingOffer.displayName,
    standingOffer.agency,
    standingOffer.source,
    standingOffer.startDate,
    standingOffer.endDate,
    standingOffer.cancellationPolicy,
    standingOffer.services,
    standingOffer.activeRateRows,
    standingOffer.status,
    standingOffer.notes,
    archivedLabel(standingOffer.isArchived),
  ];
}

function priceLineSearchFields(entry: EditablePriceBookEntry) {
  return [
    entry.code,
    entry.label,
    entry.source,
    entry.contractVehicle,
    entry.service,
    entry.selection,
    entry.descriptionRule,
    entry.classType,
    entry.delivery,
    entry.activeDates ?? "",
    entry.rate,
    entry.unit,
    priceStatusLabel(entry.status),
    archivedLabel(entry.isArchived),
  ];
}

function normalizeIdentifier(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function standingOfferAliases(standingOffer: EditableStandingOffer) {
  const baseAliases = [
    standingOffer.standingOfferNumber,
    standingOffer.displayName,
    standingOffer.agency,
    `SOA ${standingOffer.standingOfferNumber}`,
  ];

  if (standingOffer.displayName === "CCC") {
    return [...baseAliases, "CCC SOA", "Canadian Commercial Corporation"];
  }

  if (standingOffer.displayName === "NMSO") {
    return [...baseAliases, "NMSO SOA", "National Master Standing Offer"];
  }

  if (standingOffer.displayName === "OSO") {
    return [...baseAliases, "OSO SOA", "Online Standing Offer"];
  }

  return baseAliases;
}

function priceLineBelongsToStandingOffer(entry: EditablePriceBookEntry, standingOffer: EditableStandingOffer) {
  const searchableValues = [
    entry.code,
    entry.source,
    entry.contractVehicle,
    entry.label,
    entry.selection,
    entry.descriptionRule,
  ];
  const normalizedSearchableValues = searchableValues.map(normalizeIdentifier);

  return standingOfferAliases(standingOffer).some((alias) => {
    const normalizedAlias = normalizeIdentifier(alias);
    return normalizedAlias !== "" && normalizedSearchableValues.some((value) => value.includes(normalizedAlias));
  });
}

function isInteractiveElement(target: EventTarget) {
  return target instanceof Element && Boolean(target.closest("button, a, input, select, textarea"));
}

function emptyPriceLine(): EditablePriceBookEntry {
  return {
    activeDates: "N/A",
    classType: "To confirm",
    code: `KC-NEW-${Date.now()}`,
    contractVehicle: "To confirm",
    delivery: "To confirm",
    descriptionRule: "To confirm",
    label: "New product line",
    rate: "Rate to confirm",
    selection: "To confirm",
    service: "Second language training",
    source: "Manual local catalog",
    status: "TO_CONFIRM",
    unit: "To confirm",
  };
}

function emptyStandingOffer(): EditableStandingOffer {
  return {
    activeRateRows: "0",
    agency: "To confirm",
    cancellationPolicy: "To confirm",
    code: `SOA-NEW-${Date.now()}`,
    displayName: "New SOA",
    endDate: "To confirm",
    notes: "Added locally for review.",
    services: "To confirm",
    source: "Manual",
    standingOfferNumber: "To confirm",
    startDate: "To confirm",
    status: "Active",
  };
}

function soaReviewUnit(entry: DemoSoaRateReviewEntry) {
  if (entry.classType === "Per candidate") {
    return "Per candidate";
  }

  return "Per hour";
}

function soaReviewDescription(entry: DemoSoaRateReviewEntry) {
  if (entry.classType === "Per candidate") {
    return "Usable SOA line. Rate applies per candidate; proposal wording must state the selected assessment or placement service.";
  }

  if (entry.classType === "Group") {
    return "Usable SOA group line. Group starts at 2 participants; no maximum is assumed unless the source states one.";
  }

  if (entry.classType === "Individual") {
    return "Usable SOA individual line. Proposal wording must state language, schedule, hours, and SOA source.";
  }

  return "Usable SOA line. Select clear language, class details, schedule, hours, and SOA source wording in the proposal.";
}

function soaReviewEntryToPriceLine(entry: DemoSoaRateReviewEntry): EditablePriceBookEntry {
  return {
    activeDates: entry.activeDates,
    classType: entry.classType,
    code: entry.code,
    contractVehicle: `SOA ${entry.standingOfferNumber}`,
    delivery: entry.rhythm,
    descriptionRule: soaReviewDescription(entry),
    label: entry.sourceSelection,
    rate: soaReviewRatesByCode[entry.code] ?? "Rate to confirm",
    selection: entry.sourceSelection,
    service: entry.service,
    source: entry.agency,
    status: "CONFIRMED",
    unit: soaReviewUnit(entry),
  };
}

export function PriceBookPage() {
  const [activeView, setActiveView] = useState<PriceBookView>("price-lines");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [serviceFilter, setServiceFilter] = useState("All");
  const [contractFilter, setContractFilter] = useState("All");
  const [classTypeFilter, setClassTypeFilter] = useState("All");
  const [selectedStandingOfferCode, setSelectedStandingOfferCode] = useState<string | null>(null);
  const [priceLines, setPriceLines] = useState<EditablePriceBookEntry[]>([
    ...demoPriceBookEntries,
    ...demoSoaRateReviewEntries.map(soaReviewEntryToPriceLine),
  ]);
  const [standingOffers, setStandingOffers] = useState<EditableStandingOffer[]>(demoStandingOffers);
  const [editTarget, setEditTarget] = useState<EditTarget | null>(null);
  const [editDraft, setEditDraft] = useState<Record<string, string>>({});

  const normalizedQuery = normalizeSearch(query);
  const standingOfferStatusOptions = useMemo(
    () => uniqueOptions([...standingOffers.map((standingOffer) => standingOffer.status), "Inactive"]),
    [standingOffers],
  );
  const priceLineStatusOptions = useMemo(() => uniqueOptions(priceLines.map((entry) => entry.status)), [priceLines]);
  const serviceOptions = useMemo(() => uniqueOptions(priceLines.map((entry) => entry.service)), [priceLines]);
  const contractOptions = useMemo(() => uniqueOptions(priceLines.map((entry) => entry.contractVehicle)), [priceLines]);
  const classTypeOptions = useMemo(() => uniqueOptions(priceLines.map((entry) => entry.classType)), [priceLines]);
  const relevantFilters =
    activeView === "standing-offers" ? [statusFilter] : [statusFilter, serviceFilter, contractFilter, classTypeFilter];
  const activeFilterCount =
    relevantFilters.filter((value) => value !== "All").length + (normalizedQuery ? 1 : 0) + (selectedStandingOfferCode ? 1 : 0);
  const selectedStandingOffer = selectedStandingOfferCode
    ? standingOffers.find((standingOffer) => standingOffer.code === selectedStandingOfferCode)
    : undefined;

  const filteredStandingOffers = useMemo(
    () =>
      standingOffers.filter((standingOffer) => {
        const displayStatus = standingOffer.isArchived ? "Inactive" : standingOffer.status;
        const statusMatches = statusFilter === "All" || displayStatus === statusFilter;
        return statusMatches && matchesQuery(standingOfferSearchFields(standingOffer), normalizedQuery);
      }),
    [normalizedQuery, standingOffers, statusFilter],
  );

  const filteredPriceLines = useMemo(
    () =>
      priceLines.filter((entry) => {
        const statusMatches = statusFilter === "All" || entry.status === statusFilter;
        const serviceMatches = serviceFilter === "All" || entry.service === serviceFilter;
        const contractMatches = contractFilter === "All" || entry.contractVehicle === contractFilter;
        const classTypeMatches = classTypeFilter === "All" || entry.classType === classTypeFilter;
        return (
          statusMatches &&
          serviceMatches &&
          contractMatches &&
          classTypeMatches &&
          (!selectedStandingOffer || priceLineBelongsToStandingOffer(entry, selectedStandingOffer)) &&
          matchesQuery(priceLineSearchFields(entry), normalizedQuery)
        );
      }),
    [classTypeFilter, contractFilter, normalizedQuery, priceLines, selectedStandingOffer, serviceFilter, statusFilter],
  );

  const shownCount = activeView === "standing-offers" ? filteredStandingOffers.length : filteredPriceLines.length;
  const totalCount = activeView === "standing-offers" ? standingOffers.length : priceLines.length;
  const resultLabel = activeView === "standing-offers" ? "SOA sources" : "price lines";

  function clearFilters() {
    setQuery("");
    setStatusFilter("All");
    setServiceFilter("All");
    setContractFilter("All");
    setClassTypeFilter("All");
    setSelectedStandingOfferCode(null);
  }

  function changeView(nextView: PriceBookView) {
    setActiveView(nextView);
    clearFilters();
  }

  function viewStandingOfferLines(standingOffer: EditableStandingOffer) {
    setActiveView("price-lines");
    setQuery("");
    setStatusFilter("All");
    setServiceFilter("All");
    setContractFilter("All");
    setClassTypeFilter("All");
    setSelectedStandingOfferCode(standingOffer.code);
  }

  function openEdit(kind: EditableKind, id: string) {
    const record =
      kind === "price-line"
        ? priceLines.find((entry) => entry.code === id)
        : standingOffers.find((entry) => entry.code === id);

    if (!record) {
      return;
    }

    setEditTarget({ id, kind, mode: "edit" });
    setEditDraft(record as unknown as Record<string, string>);
  }

  function openAdd(kind: "price-line" | "standing-offer") {
    const record = kind === "price-line" ? emptyPriceLine() : emptyStandingOffer();
    setEditTarget({ kind, mode: "add" });
    setEditDraft(record as unknown as Record<string, string>);
  }

  function archiveRecord(kind: EditableKind, id: string) {
    if (kind === "price-line") {
      setPriceLines((entries) => entries.map((entry) => (entry.code === id ? { ...entry, isArchived: true } : entry)));
    } else {
      setStandingOffers((entries) =>
        entries.map((entry) => (entry.code === id ? { ...entry, isArchived: true, status: "Inactive" } : entry)),
      );
    }
  }

  function closeEditor() {
    setEditTarget(null);
    setEditDraft({});
  }

  function saveEditor() {
    if (!editTarget) {
      return;
    }

    if (editTarget.kind === "price-line") {
      const record = editDraft as unknown as EditablePriceBookEntry;
      setPriceLines((entries) =>
        editTarget.mode === "add"
          ? [...entries, record]
          : entries.map((entry) => (entry.code === editTarget.id ? { ...entry, ...record } : entry)),
      );
    } else if (editTarget.kind === "standing-offer") {
      const record = editDraft as unknown as EditableStandingOffer;
      setStandingOffers((entries) =>
        editTarget.mode === "add"
          ? [...entries, record]
          : entries.map((entry) => (entry.code === editTarget.id ? { ...entry, ...record } : entry)),
      );
    }

    closeEditor();
  }

  const editorFields =
    editTarget?.kind === "price-line"
      ? priceLineFields
      : standingOfferFields;

  return (
    <section aria-labelledby="price-book-title" className="page-stack price-book-page">
      <PageHeader
        actions={
          <div className="page-actions">
            <button className="button-secondary" onClick={() => openAdd("standing-offer")} type="button">
              Add SOA source
            </button>
            <button className="button-primary" onClick={() => openAdd("price-line")} type="button">
              Add product line
            </button>
          </div>
        }
        eyebrow="Catalogue"
        title="Price Book"
      />

      <p className="price-book-rule-note">
        Rates are validated when a proposal is accepted or a contract is received. Automatic status-based validation is not implemented yet.
      </p>

      <div className="price-book-viewbar" role="group" aria-label="Price Book view">
        <button
          aria-pressed={activeView === "standing-offers"}
          onClick={() => changeView("standing-offers")}
          type="button"
        >
          SOA sources
          <span>{standingOffers.length}</span>
        </button>
        <button
          aria-pressed={activeView === "price-lines"}
          onClick={() => changeView("price-lines")}
          type="button"
        >
          Price lines
          <span>{priceLines.length}</span>
        </button>
      </div>

      <form className="price-book-search-panel" aria-label="Price Book filters">
        <label className="price-book-search-field">
          Search price book
          <input
            aria-label="Search price book"
            onChange={(event) => setQuery(event.target.value)}
            placeholder={
              activeView === "standing-offers"
                ? "Search SOA number, agency, services, cancellation, notes..."
                : "Search code, SOA number, service, stream, rate, unit, notes..."
            }
            type="search"
            value={query}
          />
          <span>Search includes every field in the selected view.</span>
        </label>
        <div className="price-book-filter-grid">
          {activeView === "standing-offers" && (
            <label>
              Status
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                <option>All</option>
                {standingOfferStatusOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
          )}
          {activeView !== "standing-offers" && (
            <>
              <label>
                Status
                <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                  <option>All</option>
                  {priceLineStatusOptions.map((option) => (
                    <option key={option} value={option}>
                      {priceStatusLabel(option)}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Service
                <select value={serviceFilter} onChange={(event) => setServiceFilter(event.target.value)}>
                  <option>All</option>
                  {serviceOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </label>
              <label>
                Contract
                <select value={contractFilter} onChange={(event) => setContractFilter(event.target.value)}>
                  <option>All</option>
                  {contractOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </label>
              <label>
                Service basis
                <select value={classTypeFilter} onChange={(event) => setClassTypeFilter(event.target.value)}>
                  <option>All</option>
                  {classTypeOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </label>
            </>
          )}
        </div>
        {selectedStandingOffer && activeView === "price-lines" && (
          <div className="active-context-filter" role="status">
            <span>
              Showing price lines for <strong>{selectedStandingOffer.displayName}</strong>{" "}
              ({selectedStandingOffer.standingOfferNumber}).
            </span>
            <button className="button-secondary" onClick={() => setSelectedStandingOfferCode(null)} type="button">
              Show all price lines
            </button>
          </div>
        )}
        <div className="filter-status-row">
          <p>
            Showing <span>{shownCount}</span> of <span>{totalCount}</span> {resultLabel}.
          </p>
          <span>{activeFilterCount} active filters</span>
          <button className="button-secondary" onClick={clearFilters} type="button">
            Clear filters
          </button>
        </div>
      </form>

      {activeView === "standing-offers" ? (
        <DataTable
          caption="Active SOA sources"
          columns={[
            "SOA",
            "Name",
            "Agency",
            "Active dates",
            "Cancellation",
            "Services",
            "Rate rows",
            "Status",
            "Notes",
            "Actions",
          ]}
        >
          {filteredStandingOffers.map((standingOffer) => (
            <tr
              className={`interactive-row ${standingOffer.isArchived ? "archived-row" : ""}`.trim()}
              key={standingOffer.code}
              onClick={(event) => {
                if (isInteractiveElement(event.target)) {
                  return;
                }
                viewStandingOfferLines(standingOffer);
              }}
              onKeyDown={(event) => {
                if (event.currentTarget !== event.target || !["Enter", " "].includes(event.key)) {
                  return;
                }

                event.preventDefault();
                viewStandingOfferLines(standingOffer);
              }}
              tabIndex={0}
            >
              <td>
                <strong>{standingOffer.standingOfferNumber}</strong>
              </td>
              <td>{standingOffer.displayName}</td>
              <td>{standingOffer.agency}</td>
              <td>
                {standingOffer.startDate} to {standingOffer.endDate}
              </td>
              <td>{standingOffer.cancellationPolicy}</td>
              <td>{standingOffer.services}</td>
              <td>{standingOffer.activeRateRows}</td>
              <td>
                <StatusBadge tone={standingOffer.isArchived ? "neutral" : "success"}>
                  {standingOffer.isArchived ? "Inactive" : standingOffer.status}
                </StatusBadge>
              </td>
              <td>{standingOffer.notes}</td>
              <td>
                <div className="table-actions-nowrap">
                  <button className="table-button" onClick={() => viewStandingOfferLines(standingOffer)} type="button">
                    View lines
                    <span className="visually-hidden"> for {standingOffer.displayName}</span>
                  </button>
                  <RowActions
                    archiveLabel={`Archive ${standingOffer.displayName}`}
                    editLabel={`Edit ${standingOffer.displayName}`}
                    isArchived={standingOffer.isArchived}
                    onArchive={() => archiveRecord("standing-offer", standingOffer.code)}
                    onEdit={() => openEdit("standing-offer", standingOffer.code)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </DataTable>
      ) : (
        <DataTable
          caption="Working price book entries"
          columns={[
            "Price code",
            "Price label",
            "Source",
            "Contract",
            "Service",
            "Selection",
            "Service basis",
            "Schedule / delivery",
            "Active dates",
            "Rate",
            "Unit",
            "Status",
            "Actions",
          ]}
        >
          {filteredPriceLines.map((entry) => (
            <tr className={entry.isArchived ? "archived-row" : undefined} key={entry.code}>
              <td>
                <strong>{entry.code}</strong>
              </td>
              <td>{entry.label}</td>
              <td>{entry.source}</td>
              <td>{entry.contractVehicle}</td>
              <td>{entry.service}</td>
              <td>{entry.selection}</td>
              <td>{entry.classType}</td>
              <td>{entry.delivery}</td>
              <td>{entry.activeDates ?? "N/A"}</td>
              <td>{entry.rate}</td>
              <td>{entry.unit}</td>
              <td>
                <StatusBadge tone={entry.isArchived ? "neutral" : priceTone(entry.status)}>
                  {entry.isArchived ? "Inactive" : priceStatusLabel(entry.status)}
                </StatusBadge>
              </td>
              <td>
                <RowActions
                  archiveLabel={`Archive ${entry.code}`}
                  editLabel={`Edit ${entry.code}`}
                  isArchived={entry.isArchived}
                  onArchive={() => archiveRecord("price-line", entry.code)}
                  onEdit={() => openEdit("price-line", entry.code)}
                />
              </td>
            </tr>
          ))}
        </DataTable>
      )}

      {editTarget && (
        <div className="dialog-backdrop">
          <section aria-labelledby="price-book-editor-title" aria-modal="true" className="dialog wide-dialog" role="dialog">
            <div className="drawer-header">
              <div>
                <h3 id="price-book-editor-title">
                  {editTarget.mode === "add" ? "Add" : "Edit"}{" "}
                  {editTarget.kind === "standing-offer" ? "SOA source" : "price line"}
                </h3>
                <p>Local prototype edit. Persistence will be added in a later phase.</p>
              </div>
              <button aria-label="Close editor" className="icon-button" onClick={closeEditor} type="button">
                x
              </button>
            </div>
            <div className="edit-dialog-grid">
              {editorFields.map((field) => (
                <label className={field === "descriptionRule" || field === "reviewNote" || field === "notes" ? "full-width" : undefined} key={field}>
                  {fieldLabel(field, editTarget.kind)}
                  <input
                    onChange={(event) => setEditDraft((draft) => ({ ...draft, [field]: event.target.value }))}
                    value={editDraft[field] ?? ""}
                  />
                </label>
              ))}
            </div>
            <div className="button-row dialog-actions">
              <button className="button-secondary" onClick={closeEditor} type="button">
                Cancel
              </button>
              <button className="button-primary" onClick={saveEditor} type="button">
                Save local changes
              </button>
            </div>
          </section>
        </div>
      )}
    </section>
  );
}

function RowActions({
  archiveLabel,
  editLabel,
  isArchived,
  onArchive,
  onEdit,
}: {
  archiveLabel: string;
  editLabel: string;
  isArchived?: boolean;
  onArchive: () => void;
  onEdit: () => void;
}) {
  return (
    <div className="table-actions-nowrap">
      <button className="table-button" onClick={onEdit} type="button">
        Edit
        <span className="visually-hidden"> - {editLabel}</span>
      </button>
      <button className="table-button" disabled={isArchived} onClick={onArchive} type="button">
        Archive
        <span className="visually-hidden"> - {archiveLabel}</span>
      </button>
    </div>
  );
}
