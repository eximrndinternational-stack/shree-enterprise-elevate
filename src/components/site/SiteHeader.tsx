import { Link } from "@tanstack/react-router";
import { Menu, X, Phone } from "lucide-react";
import { useState } from "react";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/about", label: "About" },
  { to: "/capabilities", label: "Capabilities" },
  { to: "/projects", label: "Projects" },
  { to: "/equipment", label: "Equipment" },
  { to: "/people", label: "People" },
  { to: "/credentials", label: "Credentials" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-5 lg:h-20 lg:px-8">
        <Link to="/" className="group flex items-baseline gap-2" onClick={() => setOpen(false)}>
          <span className="font-display text-lg font-extrabold uppercase tracking-tight lg:text-xl">
            Shree Enterprise
          </span>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:inline">
            Est. {SITE.since}
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/contact"
            className="inline-flex h-10 items-center bg-charcoal px-5 text-sm font-semibold text-charcoal-foreground transition-colors hover:bg-charcoal/90"
          >
            Request a quote
          </Link>
        </nav>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center border border-border lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div className={cn("border-t border-border lg:hidden", open ? "block" : "hidden")}>
        <nav aria-label="Mobile" className="mx-auto max-w-7xl px-5 py-4">
          <ul className="flex flex-col">
            {NAV.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="block border-b border-border/60 py-3 text-base font-medium"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-col gap-3">
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="inline-flex h-11 items-center justify-center bg-charcoal px-5 text-sm font-semibold text-charcoal-foreground"
            >
              Request a quote
            </Link>
            <a
              href={`tel:${SITE.phonePrimary}`}
              className="inline-flex h-11 items-center justify-center gap-2 border border-border px-5 text-sm font-semibold"
            >
              <Phone className="h-4 w-4" /> {SITE.phonePrimary}
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
