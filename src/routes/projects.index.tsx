import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { PageHero, Section } from "@/components/site/Section";
import { projectImagesQuery, projectsQuery, sectorsQuery } from "@/lib/queries";
import { formatINR } from "@/lib/site";
import { cn } from "@/lib/utils";

type Search = { sector?: string | undefined; status?: string | undefined };

export const Route = createFileRoute("/projects/")({
  validateSearch: (search: Record<string, unknown>): Search => {
    const out: Search = {};
    if (typeof search["sector"] === "string") out.sector = search["sector"];
    if (typeof search["status"] === "string") out.status = search["status"];
    return out;
  },
  head: () => ({
    meta: [
      { title: "Project Portfolio — 32 Civil & Infrastructure Projects" },
      {
        name: "description",
        content:
          "Browse Shree Enterprise's documented portfolio: Vanya Awas at Lataguri, Manipal oncology hospital, Hindustan Coca-Cola Beverages civil works, PMGSY roads, PHE reservoirs and more.",
      },
      { property: "og:title", content: "Project Portfolio — Shree Enterprise" },
      {
        property: "og:description",
        content:
          "Filterable record of every documented project with client, sector, location, value and dates.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/projects" },
    ],
    links: [{ rel: "canonical", href: "/projects" }],
  }),
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(projectsQuery),
      context.queryClient.ensureQueryData(projectImagesQuery),
      context.queryClient.ensureQueryData(sectorsQuery),
    ]);
  },
  component: ProjectsPage,
});

function ProjectsPage() {
  const { sector, status } = Route.useSearch();
  const navigate = Route.useNavigate();
  const { data: projects } = useSuspenseQuery(projectsQuery);
  const { data: images } = useSuspenseQuery(projectImagesQuery);
  const { data: sectors } = useSuspenseQuery(sectorsQuery);
  const [view, setView] = useState<"grid" | "table">("grid");

  const filtered = useMemo(
    () =>
      projects.filter(
        (p) =>
          (!sector || p.sector_slug === sector) && (!status || p.status === status),
      ),
    [projects, sector, status],
  );

  const setFilter = (next: Search) =>
    navigate({ search: (prev) => ({ ...prev, ...next }), replace: true });

  const coverFor = (id: string) =>
    images.find((i) => i.project_id === id && i.is_cover) ??
    images.find((i) => i.project_id === id);

  const sectorName = (slug: string) => sectors.find((s) => s.slug === slug)?.name ?? slug;

  return (
    <>
      <PageHero
        index="03"
        eyebrow="Portfolio"
        title="Every project, with the numbers attached."
        lead="Client, sector, location, contract value and dates as recorded in our project schedule. Photographs are from our own sites."
      />

      <Section>
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-border pb-6">
          <div className="flex flex-wrap gap-2">
            <FilterChip active={!sector} onClick={() => setFilter({ sector: undefined })}>
              All sectors
            </FilterChip>
            {sectors.map((s) => (
              <FilterChip
                key={s.id}
                active={sector === s.slug}
                onClick={() => setFilter({ sector: s.slug })}
              >
                {s.name}
              </FilterChip>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <FilterChip active={!status} onClick={() => setFilter({ status: undefined })}>
              Any status
            </FilterChip>
            <FilterChip active={status === "completed"} onClick={() => setFilter({ status: "completed" })}>
              Completed
            </FilterChip>
            <FilterChip active={status === "ongoing"} onClick={() => setFilter({ status: "ongoing" })}>
              Ongoing
            </FilterChip>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-4">
          <p aria-live="polite" className="text-sm text-muted-foreground">
            Showing {filtered.length} of {projects.length} projects ·{" "}
            {formatINR(filtered.reduce((s, p) => s + (p.project_value ?? 0), 0))} combined value
          </p>
          <div className="flex gap-2">
            <FilterChip active={view === "grid"} onClick={() => setView("grid")}>
              Grid
            </FilterChip>
            <FilterChip active={view === "table"} onClick={() => setView("table")}>
              Schedule
            </FilterChip>
          </div>
        </div>

        {view === "grid" ? (
          <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => {
              const cover = coverFor(p.id);
              return (
                <li key={p.id} className="group">
                  <Link to="/projects/$slug" params={{ slug: p.slug }} className="block">
                    <div className="aspect-[4/3] overflow-hidden bg-concrete">
                      {cover ? (
                        <img
                          src={cover.url}
                          alt={cover.alt_text}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                        />
                      ) : (
                        <div className="grid h-full w-full place-items-center grid-lines p-6 text-center">
                          <span className="eyebrow">{p.work_type}</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-4 flex items-center gap-3">
                      <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-signal">
                        {p.status === "ongoing" ? "Ongoing" : "Completed"}
                      </span>
                      <span className="h-px flex-1 bg-border" aria-hidden />
                      <span className="font-mono text-[11px] text-muted-foreground">
                        {formatINR(p.project_value)}
                      </span>
                    </div>
                    <h2 className="mt-2 text-lg font-bold leading-snug group-hover:underline">
                      {p.name}
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {p.client_name} · {p.location}
                    </p>
                    <p className="mt-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                      {sectorName(p.sector_slug)}
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[820px] border-collapse text-sm">
              <caption className="sr-only">Schedule of documented projects</caption>
              <thead>
                <tr className="border-b border-border text-left">
                  {["Project", "Client", "Sector", "Location", "Period", "Value"].map((h) => (
                    <th key={h} scope="col" className="py-3 pr-4 eyebrow font-normal">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="border-b border-border/60 align-top">
                    <td className="py-4 pr-4 font-medium">
                      <Link to="/projects/$slug" params={{ slug: p.slug }} className="hover:underline">
                        {p.name}
                      </Link>
                    </td>
                    <td className="py-4 pr-4 text-muted-foreground">{p.client_name}</td>
                    <td className="py-4 pr-4 text-muted-foreground">{sectorName(p.sector_slug)}</td>
                    <td className="py-4 pr-4 text-muted-foreground">{p.location}</td>
                    <td className="py-4 pr-4 text-muted-foreground">
                      {p.duration_note ??
                        `${p.start_date?.slice(0, 4) ?? "—"} – ${p.end_date?.slice(0, 4) ?? "ongoing"}`}
                    </td>
                    <td className="py-4 pr-4 tabular-nums">{formatINR(p.project_value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>
    </>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "border px-3.5 py-1.5 text-xs font-medium transition-colors",
        active
          ? "border-charcoal bg-charcoal text-charcoal-foreground"
          : "border-border text-muted-foreground hover:border-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
