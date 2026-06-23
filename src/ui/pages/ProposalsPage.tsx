import { useMemo, useState } from "react";

import { DataTable } from "@/ui/components/DataTable";
import { PageHeader } from "@/ui/components/PageHeader";
import { StatusBadge } from "@/ui/components/StatusBadge";
import { demoProposals, proposalStatuses, type DemoProposal, type ProposalStatus } from "@/ui/demo/prototypeData";

type SummaryFilter = "draft" | "approved" | "sent-viewed" | "needs-attention" | "accepted";
type SortMode = "newest" | "oldest";

const summaryFilters: Array<{ id: SummaryFilter; label: string; detail: string }> = [
  { id: "draft", label: "Draft", detail: "Working proposals" },
  { id: "approved", label: "Approved", detail: "Ready for next step" },
  { id: "sent-viewed", label: "Sent / Viewed", detail: "With client" },
  { id: "needs-attention", label: "Needs attention", detail: "Missing or changed" },
  { id: "accepted", label: "Accepted", detail: "Closed successfully" },
];

function statusTone(status: ProposalStatus) {
  if (status === "Accepted" || status === "Approved internally") {
    return "success";
  }

  if (status === "Change requested" || status === "Expired") {
    return "warning";
  }

  if (status === "Cancelled") {
    return "danger";
  }

  return "neutral";
}

function proposalMatchesSummary(proposal: DemoProposal, filter: SummaryFilter) {
  if (filter === "draft") {
    return proposal.status === "Draft";
  }

  if (filter === "approved") {
    return proposal.status === "Approved internally";
  }

  if (filter === "sent-viewed") {
    return proposal.status === "Sent" || proposal.status === "Viewed";
  }

  if (filter === "needs-attention") {
    return (
      proposal.status === "Change requested" ||
      proposal.maximumAmount === "Rate to confirm" ||
      proposal.pricingStatus === "Rate to confirm"
    );
  }

  return proposal.status === "Accepted";
}

function formatMaximumAmount(proposal: DemoProposal) {
  if (proposal.maximumAmount === "Rate to confirm") {
    return (
      <span className="pricing-warning">
        <span aria-hidden="true">!</span>
        Rate to confirm
      </span>
    );
  }

  if (proposal.maximumAmount === "Not priced") {
    return <span>Not priced</span>;
  }

  return <span>{proposal.maximumAmount}</span>;
}

interface ProposalsPageProps {
  onNewProposal: () => void;
  onOpenProposal: (proposalId: string) => void;
  onPrototypeAction: (actionName: string) => void;
}

export function ProposalsPage({
  onNewProposal,
  onOpenProposal,
  onPrototypeAction,
}: ProposalsPageProps) {
  const [summaryFilter, setSummaryFilter] = useState<SummaryFilter | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [language, setLanguage] = useState("All");
  const [client, setClient] = useState("All");
  const [sortMode, setSortMode] = useState<SortMode>("newest");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const filteredProposals = useMemo(() => {
    const query = search.trim().toLowerCase();

    return demoProposals
      .filter((proposal) => {
        const searchableText = [
          proposal.id,
          proposal.client,
          proposal.department,
          proposal.contact,
          proposal.title,
          proposal.objective,
        ]
          .join(" ")
          .toLowerCase();

        return (
          (!summaryFilter || proposalMatchesSummary(proposal, summaryFilter)) &&
          (!query || searchableText.includes(query)) &&
          (status === "All" || proposal.status === status) &&
          (language === "All" || proposal.language === language) &&
          (client === "All" || proposal.client === client)
        );
      })
      .sort((a, b) =>
        sortMode === "newest"
          ? b.lastUpdated.localeCompare(a.lastUpdated)
          : a.lastUpdated.localeCompare(b.lastUpdated),
      );
  }, [client, language, search, sortMode, status, summaryFilter]);

  const activeFilterCount =
    (summaryFilter ? 1 : 0) +
    (search.trim() ? 1 : 0) +
    (status !== "All" ? 1 : 0) +
    (language !== "All" ? 1 : 0) +
    (client !== "All" ? 1 : 0);

  function clearFilters() {
    setSummaryFilter(null);
    setSearch("");
    setStatus("All");
    setLanguage("All");
    setClient("All");
    setSortMode("newest");
    setOpenMenuId(null);
  }

  function runPrototypeAction(action: string, proposalId: string) {
    setOpenMenuId(null);
    onPrototypeAction(`${action} proposal ${proposalId}`);
  }

  return (
    <section aria-labelledby="proposals-title" className="page-stack proposals-page">
      <PageHeader
        eyebrow="Proposal workspace"
        title="Proposals"
        subtitle="Create and review structured Knowledge Circle proposal drafts using DEMO records only."
        actions={
          <button className="button-primary" onClick={onNewProposal} type="button">
            New proposal
          </button>
        }
      />

      <div aria-label="Proposal status filters" className="summary-grid summary-grid-five" role="group">
        {summaryFilters.map((filter) => {
          const count = demoProposals.filter((proposal) => proposalMatchesSummary(proposal, filter.id)).length;
          const isSelected = summaryFilter === filter.id;
          return (
            <button
              aria-pressed={isSelected}
              className="summary-card summary-filter-card"
              key={filter.id}
              onClick={() => setSummaryFilter(isSelected ? null : filter.id)}
              type="button"
            >
              <span>{filter.label}</span>
              <strong>{count}</strong>
              <p>{filter.detail}</p>
            </button>
          );
        })}
      </div>

      <form className="filter-bar proposals-filter-bar" onSubmit={(event) => event.preventDefault()}>
        <label>
          Search proposals
          <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} />
        </label>
        <label>
          Status
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option>All</option>
            {proposalStatuses.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
        <label>
          Language
          <select value={language} onChange={(event) => setLanguage(event.target.value)}>
            <option>All</option>
            <option>English</option>
            <option>French</option>
          </select>
        </label>
        <label>
          Client
          <select value={client} onChange={(event) => setClient(event.target.value)}>
            <option>All</option>
            {[...new Set(demoProposals.map((proposal) => proposal.client))].map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
        <label>
          Sort by Last updated
          <select value={sortMode} onChange={(event) => setSortMode(event.target.value as SortMode)}>
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </label>
      </form>

      <div className="filter-status-row">
        <p aria-live="polite">
          Showing {filteredProposals.length} of {demoProposals.length} proposals.
        </p>
        <span>{activeFilterCount} active filter{activeFilterCount === 1 ? "" : "s"}</span>
        <button className="button-secondary" disabled={activeFilterCount === 0 && sortMode === "newest"} onClick={clearFilters} type="button">
          Clear filters
        </button>
      </div>

      <DataTable
        caption="DEMO proposals"
        columns={[
          "Quote ID",
          "Client",
          "Proposal",
          "Learners",
          "Language",
          "Maximum amount",
          "Status",
          "Revision",
          "Last updated",
          "Actions",
        ]}
      >
        {filteredProposals.map((proposal) => (
          <tr className="interactive-row" key={proposal.id} tabIndex={-1}>
            <td>
              <strong>{proposal.id}</strong>
              <span className="demo-label">DEMO data</span>
            </td>
            <td>
              <strong>{proposal.client}</strong>
              <span>{proposal.contact}</span>
            </td>
            <td>
              <strong>{proposal.title}</strong>
              <span>{proposal.objective}</span>
            </td>
            <td>{proposal.learners}</td>
            <td>{proposal.language}</td>
            <td>{formatMaximumAmount(proposal)}</td>
            <td>
              <StatusBadge tone={statusTone(proposal.status)}>{proposal.status}</StatusBadge>
            </td>
            <td>{proposal.revision}</td>
            <td>{proposal.lastUpdated}</td>
            <td>
              <div className="row-actions">
                <button className="table-button" onClick={() => onOpenProposal(proposal.id)} type="button">
                  Open
                </button>
                <div className="overflow-menu-wrap">
                  <button
                    aria-expanded={openMenuId === proposal.id}
                    aria-haspopup="menu"
                    aria-label={`More actions for ${proposal.id}`}
                    className="icon-button"
                    onClick={() => setOpenMenuId(openMenuId === proposal.id ? null : proposal.id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setOpenMenuId(openMenuId === proposal.id ? null : proposal.id);
                      }

                      if (event.key === "Escape") {
                        setOpenMenuId(null);
                      }
                    }}
                    title={`More actions for ${proposal.id}`}
                    type="button"
                  >
                    ...
                  </button>
                  {openMenuId === proposal.id && (
                    <div className="overflow-menu" role="menu">
                      {["Preview", "Duplicate", "Create revision", "Change status", "Generate PDF", "Cancel proposal"].map(
                        (action) => (
                          <button
                            key={action}
                            onClick={() => runPrototypeAction(action, proposal.id)}
                            role="menuitem"
                            type="button"
                          >
                            {action}
                          </button>
                        ),
                      )}
                    </div>
                  )}
                </div>
              </div>
            </td>
          </tr>
        ))}
      </DataTable>
    </section>
  );
}
