export type AppRoute =
  | { name: "proposals"; path: "/proposals" }
  | { name: "new-proposal"; path: "/proposals/new" }
  | { name: "edit-proposal"; path: `/proposals/${string}/edit`; proposalId: string }
  | { name: "clients-learners"; path: "/clients-learners" }
  | { name: "price-book"; path: "/price-book" }
  | { name: "templates"; path: "/templates" }
  | { name: "help"; path: "/help" }
  | { name: "settings"; path: "/settings" };

export type NavigateTo = (path: AppRoute["path"]) => void;

export function parseRoute(pathname: string): AppRoute {
  if (pathname === "/" || pathname === "") {
    return { name: "proposals", path: "/proposals" };
  }

  if (pathname === "/proposals") {
    return { name: "proposals", path: "/proposals" };
  }

  if (pathname === "/proposals/new") {
    return { name: "new-proposal", path: "/proposals/new" };
  }

  const editMatch = pathname.match(/^\/proposals\/([^/]+)\/edit$/);
  if (editMatch) {
    return {
      name: "edit-proposal",
      path: `/proposals/${editMatch[1]}/edit`,
      proposalId: editMatch[1],
    };
  }

  if (pathname === "/clients-learners") {
    return { name: "clients-learners", path: "/clients-learners" };
  }

  if (pathname === "/price-book") {
    return { name: "price-book", path: "/price-book" };
  }

  if (pathname === "/templates") {
    return { name: "templates", path: "/templates" };
  }

  if (pathname === "/help") {
    return { name: "help", path: "/help" };
  }

  if (pathname === "/settings") {
    return { name: "settings", path: "/settings" };
  }

  return { name: "proposals", path: "/proposals" };
}
