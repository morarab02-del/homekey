import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";

/** Page titles per route — keeps document.title in sync without a plugin. */
const TITLES: { match: RegExp; title: string }[] = [
  { match: /^\/$/, title: "HomeKey | Homes for Rent Across Texas" },
  { match: /^\/homes\/[^/]+$/, title: "Property details | HomeKey" },
  { match: /^\/saved$/, title: "Saved homes | HomeKey" },
  { match: /^\/about$/, title: "About HomeKey" },
  { match: /^\/contact$/, title: "Contact HomeKey" },
  { match: /^\/terms$/, title: "Terms of use | HomeKey" },
  { match: /^\/privacy$/, title: "Privacy policy | HomeKey" },
];

export function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    const entry = TITLES.find((t) => t.match.test(pathname));
    document.title = entry?.title ?? "Page not found | HomeKey";
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-surface-main dark:bg-surface-main">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-brand-700 focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to main content
      </a>
      <Header />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
