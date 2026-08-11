import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { SITE } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-charcoal text-charcoal-foreground">
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-display text-xl font-extrabold uppercase tracking-tight">
              Shree Enterprise
            </p>
            <p className="mt-3 max-w-xs text-sm text-charcoal-foreground/70">
              Civil and infrastructure contractor working across North Bengal since {SITE.since}.
              Buildings, roads, drainage, water infrastructure and bulk material supply.
            </p>
            <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.22em] text-charcoal-foreground/50">
              {SITE.tagline}
            </p>
          </div>

          <nav aria-label="Company">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-charcoal-foreground/50">
              Company
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              {[
                { to: "/about", label: "About us" },
                { to: "/people", label: "People" },
                { to: "/credentials", label: "Credentials" },
                { to: "/contact", label: "Contact" },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-charcoal-foreground/80 hover:text-charcoal-foreground">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Work">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-charcoal-foreground/50">
              Work
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              {[
                { to: "/capabilities", label: "Capabilities" },
                { to: "/projects", label: "Project portfolio" },
                { to: "/equipment", label: "Machinery & equipment" },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-charcoal-foreground/80 hover:text-charcoal-foreground">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <address className="not-italic">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-charcoal-foreground/50">
              Registered office
            </p>
            <ul className="mt-4 space-y-3 text-sm text-charcoal-foreground/80">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-signal" aria-hidden />
                <span>
                  {SITE.addressLine1}
                  <br />
                  {SITE.addressLine2}
                </span>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-signal" aria-hidden />
                <span>
                  <a href={`tel:${SITE.phonePrimary}`} className="hover:text-charcoal-foreground">
                    {SITE.phonePrimary}
                  </a>
                  {" / "}
                  <a href={`tel:${SITE.phoneSecondary}`} className="hover:text-charcoal-foreground">
                    {SITE.phoneSecondary}
                  </a>
                </span>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-signal" aria-hidden />
                <a href={`mailto:${SITE.email}`} className="break-all hover:text-charcoal-foreground">
                  {SITE.email}
                </a>
              </li>
            </ul>
          </address>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-charcoal-foreground/15 pt-6 text-xs text-charcoal-foreground/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {SITE.legal}. All rights reserved.
          </p>
          <p>
            {SITE.city}, {SITE.state}, India
          </p>
        </div>
      </div>
    </footer>
  );
}
