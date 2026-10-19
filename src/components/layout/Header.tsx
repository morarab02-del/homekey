import { useEffect, useState, useRef, useCallback } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { clsx } from "clsx";
import { Menu, X, Sun, Moon, MessageCircle } from "lucide-react";
import { Logo } from "./Logo";
import { whatsappLink, generalEnquiryMessage } from "@/lib/formatting";
import { useTheme } from "@/context/ThemeContext";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/?rentType=monthly", label: "Rentals" },
  { to: "/saved", label: "Saved" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const tickingRef = useRef(false);
  const location = useLocation();
  const navItemsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const [indicatorStyle, setIndicatorStyle] = useState({ width: 0, left: 0, opacity: 0 });
  const prefersReducedMotion = useRef(false);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    prefersReducedMotion.current = mediaQuery.matches;
    
    const handleChange = (e: MediaQueryListEvent) => {
      prefersReducedMotion.current = e.matches;
    };
    
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  // Update indicator position based on active nav item
  const updateIndicator = useCallback(() => {
    const activeItem = navItemsRef.current.find((el) => el?.classList.contains("text-ink-primary"));
    if (activeItem) {
      const rect = activeItem.getBoundingClientRect();
      const headerRect = activeItem.closest("header")?.getBoundingClientRect();
      if (headerRect) {
        setIndicatorStyle({
          width: rect.width,
          left: rect.left - headerRect.left,
          opacity: 1,
        });
      }
    } else {
      setIndicatorStyle({ width: 0, left: 0, opacity: 0 });
    }
  }, []);

  // Update indicator on route change, layout changes, and window resize
  useEffect(() => {
    const update = () => {
      if (prefersReducedMotion.current) {
        updateIndicator();
        return;
      }
      // Also update after a brief delay to catch layout changes
      rafIdRef.current = requestAnimationFrame(updateIndicator);
    };
    
    update();
    
    // Handle window resize
    window.addEventListener("resize", update);
    
    return () => {
      window.removeEventListener("resize", update);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [location.pathname, updateIndicator]);

  const handleScroll = useCallback(() => {
    if (tickingRef.current) return;
    tickingRef.current = true;
    window.requestAnimationFrame(() => {
      const currentScrollY = window.scrollY;
      
      // Update scrolled state for background styling
      setScrolled(currentScrollY > 8);
      
      // Hide header when scrolling down past threshold, show when scrolling up
      if (currentScrollY > 100) {
        setHeaderVisible(currentScrollY < lastScrollY);
      } else {
        setHeaderVisible(true);
      }
      
      setLastScrollY(currentScrollY);
      tickingRef.current = false;
    });
  }, [lastScrollY]);

  useEffect(() => {
    handleScroll(); // Initial check
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const waHref = whatsappLink(generalEnquiryMessage());

  return (
    <>
      <header
        className={clsx(
          "sticky top-0 z-50 transition-all duration-300 ease-out",
          "transform",
          headerVisible ? "translate-y-0" : "-translate-y-full",
          scrolled
            ? "border-b border-sand-border bg-surface-card/95 backdrop-blur-md dark:border-white/10 dark:bg-surface-card/95 shadow-card"
            : "border-b border-sand-border bg-surface-card dark:border-white/10 dark:bg-surface-card",
        )}
        style={{ willChange: "transform" }}
      >
        <div className="min-h-[72px] px-5 md:px-6 flex items-center justify-between gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 flex-shrink-0"
            aria-label="HomeKey home"
          >
            <Logo showText />
          </Link>

          <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-8 flex-1 justify-center">
            {NAV.map((item, index) => (
              <NavLink
                key={item.to}
                to={item.to}
                ref={(el) => { navItemsRef.current[index] = el; }}
                className={({ isActive }) =>
                  clsx(
                    "text-sm font-medium transition-colors py-5 relative",
                    isActive
                      ? "text-ink-primary"
                      : "text-ink-muted hover:text-ink-primary dark:text-muted-400 dark:hover:text-white",
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {item.label}
                    {isActive && (
                      <span 
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-0.5 bg-brass-accent transition-all duration-300 ease-spring" 
                        style={{ transformOrigin: "center" }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm border border-sand-border hover:bg-surface-subtle transition-all duration-200"
            >
              {theme === "dark" ? (
                <>
                  <Sun className="w-4 h-4" aria-hidden="true" />
                  <span>Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4" aria-hidden="true" />
                  <span>Dark</span>
                </>
              )}
            </button>

            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm border border-sand-border hover:bg-surface-subtle transition-all duration-200"
            >
              <MessageCircle className="w-4 h-4 text-brass-accent" aria-hidden="true" />
              WhatsApp
            </a>

            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              className="md:hidden p-2 rounded-lg border border-sand-border"
            >
              <Menu className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Active nav indicator line animation */}
        <div 
          className="absolute bottom-0 left-0 h-0.5 bg-brass-accent origin-center transition-all duration-300 ease-spring"
          style={{ 
            transform: `scaleX(${indicatorStyle.width > 0 ? 1 : 0})`,
            width: indicatorStyle.width,
            left: indicatorStyle.left,
            opacity: indicatorStyle.opacity,
          }}
        />
      </header>

      {/* Mobile drawer */}
      <div
        className={clsx(
          "fixed inset-0 z-[50] md:hidden",
          open ? "visible" : "invisible",
        )}
        aria-hidden={!open}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawerTitle"
      >
        <button
          type="button"
          className="overlay-backdrop absolute inset-0 bg-black/55 backdrop-blur-sm"
          data-close-overlay="mobileDrawer"
          aria-label="Close navigation menu"
          onClick={() => setOpen(false)}
        />
        <div
          className={clsx(
            "dialog-panel absolute right-0 top-0 bottom-0 w-[min(20rem,90vw)] bg-surface-card border-l border-sand-border p-6 shadow-2xl flex flex-col justify-between overflow-y-auto transition-transform duration-300 ease-out",
            open ? "translate-x-0" : "translate-x-full",
          )}
          tabIndex={-1}
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-sand-border pb-4">
              <h2 id="drawerTitle" className="font-serif text-xl font-bold">HomeKey</h2>
              <button
                type="button"
                id="mobileDrawerCloseBtn"
                data-close-overlay="mobileDrawer"
                aria-label="Close navigation menu"
                className="p-2 rounded-lg"
                onClick={() => setOpen(false)}
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
            <nav aria-label="Mobile navigation" className="flex flex-col gap-4 text-base font-medium">
              {NAV.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    clsx(
                      "transition-colors flex items-center gap-3 px-3 py-2 rounded-lg",
                      isActive
                        ? "bg-brass-light text-ink-primary"
                        : "text-ink-muted hover:text-ink-primary hover:bg-surface-subtle"
                    )
                  }
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
          <button type="button" data-demo-action className="w-full py-2.5 rounded-lg border border-sand-border transition-colors hover:bg-surface-subtle">
            List Your Property (demo)
          </button>
        </div>
      </div>
    </>
  );
}