import type { ReactNode } from "react";

import type { NavigateTo } from "@/app/routing";

interface NavigationItem {
  label: string;
  path: Parameters<NavigateTo>[0];
  routeNames: string[];
  icon: "proposals" | "clients" | "price-book" | "templates" | "settings";
}

const navigationItems: NavigationItem[] = [
  { label: "Proposals", path: "/proposals", routeNames: ["proposals", "new-proposal", "edit-proposal"], icon: "proposals" },
  { label: "Clients", path: "/clients-learners", routeNames: ["clients-learners"], icon: "clients" },
  { label: "Price Book", path: "/price-book", routeNames: ["price-book"], icon: "price-book" },
  { label: "Templates", path: "/templates", routeNames: ["templates"], icon: "templates" },
  { label: "Settings", path: "/settings", routeNames: ["settings"], icon: "settings" },
];

interface AppShellProps {
  activeRouteName: string;
  children: ReactNode;
  onNavigate: NavigateTo;
}

export function AppShell({ activeRouteName, children, onNavigate }: AppShellProps) {
  const isEditorRoute = activeRouteName === "new-proposal" || activeRouteName === "edit-proposal";
  const assetBaseUrl = import.meta.env.BASE_URL;

  return (
    <div className={`app-frame app-frame-rail ${isEditorRoute ? "app-frame-editor-route" : ""}`}>
      <aside className="app-sidebar">
        <div className="brand-block">
          <img
            alt="Knowledge Circle symbol"
            className="sidebar-logo"
            height="96"
            src={`${assetBaseUrl}kc-logo-symbol.png`}
            width="96"
          />
          <span className="brand-caption">Proposal Manager</span>
        </div>
        <nav aria-label="Application navigation" className="side-navigation">
          {navigationItems.map((item) => {
            const isActive = item.routeNames.includes(activeRouteName);
            return (
              <button
                aria-label={item.label}
                aria-current={isActive ? "page" : undefined}
                className="side-navigation-item"
                key={item.path}
                onClick={() => onNavigate(item.path)}
                title={item.label}
                type="button"
              >
                <span aria-hidden="true" className="nav-symbol">
                  <NavigationIcon name={item.icon} />
                </span>
                <span className="nav-label">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>
      <div className="app-main-column">
        <h1 className="visually-hidden">Proposal Manager</h1>
        <main className="app-content" id="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}

function NavigationIcon({ name }: { name: NavigationItem["icon"] }) {
  const commonProps = {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 2,
    viewBox: "0 0 24 24",
  };

  if (name === "proposals") {
    return (
      <svg aria-hidden="true" {...commonProps}>
        <rect height="14" rx="1.8" width="12" x="6" y="5" />
        <path d="M9 9h6M9 13h4" />
      </svg>
    );
  }

  if (name === "clients") {
    return (
      <svg aria-hidden="true" {...commonProps}>
        <path d="M16 18c0-2-1.8-3.5-4-3.5S8 16 8 18" />
        <circle cx="12" cy="9" r="2.5" />
        <path d="M20 18c0-1.5-1.1-2.8-2.7-3.3M17 7.5a2 2 0 0 1 0 3.8M4 18c0-1.5 1.1-2.8 2.7-3.3M7 7.5a2 2 0 0 0 0 3.8" />
      </svg>
    );
  }

  if (name === "price-book") {
    return (
      <svg aria-hidden="true" {...commonProps}>
        <path d="M4.5 12.5 11 19l8-8-6.5-6.5h-5L4.5 7.5z" />
        <circle cx="9" cy="8.5" r="1" />
      </svg>
    );
  }

  if (name === "templates") {
    return (
      <svg aria-hidden="true" {...commonProps}>
        <rect height="14" rx="1.8" width="14" x="5" y="5" />
        <path d="M9 5v14M5 10h14M5 15h14" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" {...commonProps}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2.8v2.1M12 19.1v2.1M4.9 4.9l1.5 1.5M17.6 17.6l1.5 1.5M2.8 12h2.1M19.1 12h2.1M4.9 19.1l1.5-1.5M17.6 6.4l1.5-1.5" />
    </svg>
  );
}
