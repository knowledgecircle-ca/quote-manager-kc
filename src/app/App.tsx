import { useEffect, useState } from "react";

import { parseRoute, type AppRoute } from "@/app/routing";
import { AppShell } from "@/ui/components/AppShell";
import { ConfirmDialog } from "@/ui/components/ConfirmDialog";
import { ClientsLearnersPage } from "@/ui/pages/ClientsLearnersPage";
import { PriceBookPage } from "@/ui/pages/PriceBookPage";
import { ProposalEditorPage } from "@/ui/pages/ProposalEditorPage";
import { ProposalsPage } from "@/ui/pages/ProposalsPage";
import { SettingsBackupPage } from "@/ui/pages/SettingsBackupPage";
import { TemplatesPage } from "@/ui/pages/TemplatesPage";

function getInitialRoute() {
  if (typeof window === "undefined") {
    return parseRoute("/proposals");
  }

  return parseRoute(window.location.pathname);
}

export function App() {
  const [route, setRoute] = useState<AppRoute>(getInitialRoute);
  const [dialogAction, setDialogAction] = useState<string | null>(null);

  useEffect(() => {
    if (window.location.pathname === "/") {
      window.history.replaceState(null, "", "/proposals");
      setRoute(parseRoute("/proposals"));
    }

    function handlePopState() {
      setRoute(parseRoute(window.location.pathname));
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  function navigate(path: AppRoute["path"]) {
    window.history.pushState(null, "", path);
    setRoute(parseRoute(path));
  }

  return (
    <AppShell activeRouteName={route.name} onNavigate={navigate}>
      {route.name === "proposals" && (
        <ProposalsPage
          onNewProposal={() => navigate("/proposals/new")}
          onOpenProposal={(proposalId) => navigate(`/proposals/${proposalId}/edit`)}
          onPrototypeAction={setDialogAction}
        />
      )}
      {route.name === "new-proposal" && (
        <ProposalEditorPage
          mode="new"
          onBackToProposals={() => navigate("/proposals")}
          onPrototypeAction={setDialogAction}
        />
      )}
      {route.name === "edit-proposal" && (
        <ProposalEditorPage
          mode="edit"
          onBackToProposals={() => navigate("/proposals")}
          onPrototypeAction={setDialogAction}
          proposalId={route.proposalId}
        />
      )}
      {route.name === "clients-learners" && <ClientsLearnersPage />}
      {route.name === "price-book" && <PriceBookPage />}
      {route.name === "templates" && <TemplatesPage />}
      {route.name === "settings" && <SettingsBackupPage onPrototypeAction={setDialogAction} />}
      {dialogAction && <ConfirmDialog actionName={dialogAction} onClose={() => setDialogAction(null)} />}
    </AppShell>
  );
}
