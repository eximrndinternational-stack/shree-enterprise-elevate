import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { PageHero, Section } from "@/components/site/Section";
import { projectsQuery, sectorsQuery } from "@/lib/queries";
import { formatINR } from "@/lib/site";

export const Route = createFileRoute("/capabilities")({
  head: () => ({
    meta: [
      { title: "Capabilities — Residential, Roads, Water & Industrial Civil Works" },
      {
        name: "description",
        content:
          "Shree Enterprise capabilities: residential and commercial buildings, healthcare construction, bituminous and CC roads, drainage, water infrastructure, industrial civil works and bulk material supply.",
      },
      { property: "og:title", content: "Capabilities — Shree Enterprise" },
      {
        property: "og:description",
        content:
          "Ten construction disciplines backed by completed projects across Jalpaiguri, Darjeeling and Cooch Behar districts.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/capabilities" },
    ],
    links: [{ rel: "canonical", href: "/capabilities" }],
  }),
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(sectorsQuery),
      context.queryClient.ensureQueryData(projectsQuery),
    ]);
  },
  component: CapabilitiesPage,
});

function CapabilitiesPage() {
  const { data: sectors } = useSuspenseQuery(sectorsQuery);
  const { data: projects } = useSuspenseQuery(projectsQuery);

  return (
    <>
      <PageHero
        index="02"
        eyebrow="Capabilities"
        title="What we build, and the record behind each discipline."
        lead="Ten capabilities delivered by one in-house team, one machinery fleet and one set of quality controls."
      />

      <Section className="py-0 lg:py-0">
        <ul className="divide-y divide-border">
          {sectors.map((s, i) => {
            const list = projects.filter((p) => p.sector_slug === s.slug);
            const value = list.reduce((sum, p) => sum + (p.project_value ?? 0), 0);
            return (
              <li key={s.id} id={s.slug} className="scroll-mt-24 py-14 lg:py-20">
                <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
                  <div>
                    <p className="eyebrow flex items-center gap-3">
                      <span className="text-signal">{String(i + 1).padStart(2, "0")}</span>
                      {s.headline}
                    </p>
                    <h2 className="mt-4 text-2xl font-extrabold sm:text-3xl lg:text-4xl">
                      {s.name}
                    </h2>
                    <p className="mt-5 leading-relaxed text-muted-foreground">{s.description}</p>
                    <dl className="mt-7 flex gap-10">
                      <div>
                        <dt className="eyebrow">Projects</dt>
                        <dd className="mt-1 font-display text-2xl font-extrabold tabular-nums">
                          {list.length}
                        </dd>
                      </div>
                      <div>
                        <dt className="eyebrow">Value delivered</dt>
                        <dd className="mt-1 font-display text-2xl font-extrabold tabular-nums">
                          {formatINR(value)}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div className="border-l border-border pl-6 lg:pl-10">
                    <p className="eyebrow">Representative work</p>
                    <ul className="mt-4 divide-y divide-border/70">
                      {list.slice(0, 4).map((p) => (
                        <li key={p.id}>
                          <Link
                            to="/projects/$slug"
                            params={{ slug: p.slug }}
                            className="group flex items-baseline justify-between gap-6 py-3"
                          >
                            <span className="text-sm font-medium group-hover:underline">
                              {p.name}
                            </span>
                            <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
                              {formatINR(p.project_value)}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                    {list.length > 4 && (
                      <Link
                        to="/projects"
                        search={{ sector: s.slug }}
                        className="mt-5 inline-flex items-center gap-2 text-sm font-semibold underline underline-offset-4"
                      >
                        All {list.length} {s.name.toLowerCase()} projects{" "}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </Section>

      <div className="border-t border-border bg-charcoal text-charcoal-foreground">
        <Section className="flex flex-wrap items-center justify-between gap-6">
          <p className="max-w-xl text-2xl font-display font-bold">
            Not sure which package fits your project? Send the scope — we will tell you plainly
            whether it is work we can do well.
          </p>
          <Link
            to="/contact"
            className="inline-flex h-12 items-center gap-2 bg-signal px-6 text-sm font-semibold text-signal-foreground hover:opacity-90"
          >
            Start an enquiry <ArrowRight className="h-4 w-4" />
          </Link>
        </Section>
      </div>
    </>
  );
}
