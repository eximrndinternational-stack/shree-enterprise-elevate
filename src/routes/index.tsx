import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, Building2, HardHat, Truck, Waves } from "lucide-react";
import { Section, SectionHeading } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { useCountUp } from "@/hooks/use-count-up";
import { projectsQuery, projectImagesQuery, sectorsQuery, clientsQuery } from "@/lib/queries";
import { SITE, formatINR } from "@/lib/site";
import heroImage from "@/assets/hero-site.jpg.asset.json";

function StatCell({
  value,
  format,
  label,
}: {
  value: number;
  format: (n: number) => string;
  label: string;
}) {
  const { ref, n } = useCountUp(value);
  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className="group bg-card px-5 py-10 transition-colors hover:bg-secondary/50 lg:px-8"
    >
      <p className="font-display text-3xl font-extrabold tabular-nums lg:text-4xl">{format(n)}</p>
      <span className="mt-3 block h-px w-8 bg-signal transition-all duration-500 group-hover:w-16" aria-hidden />
      <p className="mt-3 text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
  );
}


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Shree Enterprise — Civil & Infrastructure Contractor, Jalpaiguri" },
      {
        name: "description",
        content:
          "Shree Enterprise is a Jalpaiguri-based civil and infrastructure contractor building residential, healthcare, road, drainage and water projects across North Bengal since 2010.",
      },
      { property: "og:title", content: "Shree Enterprise — Building with Trust since 2010" },
      {
        property: "og:description",
        content:
          "Residential, commercial, healthcare, roads, drainage, water and industrial civil works across North Bengal. 32 documented projects for Ambuja Neotia, Shapoorji Pallonji, HCCB and government departments.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "GeneralContractor",
          name: "Shree Enterprise",
          foundingDate: "2010",
          email: SITE.email,
          telephone: `+91${SITE.phonePrimary}`,
          address: {
            "@type": "PostalAddress",
            streetAddress: SITE.addressLine1,
            addressLocality: "Jalpaiguri",
            addressRegion: "West Bengal",
            postalCode: "735101",
            addressCountry: "IN",
          },
          areaServed: "North Bengal, West Bengal, India",
        }),
      },
    ],
  }),
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(projectsQuery),
      context.queryClient.ensureQueryData(projectImagesQuery),
      context.queryClient.ensureQueryData(sectorsQuery),
      context.queryClient.ensureQueryData(clientsQuery),
    ]);
  },
  component: Home,
});

function Home() {
  const { data: projects } = useSuspenseQuery(projectsQuery);
  const { data: images } = useSuspenseQuery(projectImagesQuery);
  const { data: sectors } = useSuspenseQuery(sectorsQuery);
  const { data: clients } = useSuspenseQuery(clientsQuery);

  const totalValue = projects.reduce((sum, p) => sum + (p.project_value ?? 0), 0);
  const featured = projects.filter((p) => p.featured).slice(0, 6);
  const coverFor = (projectId: string) =>
    images.find((i) => i.project_id === projectId && i.is_cover) ??
    images.find((i) => i.project_id === projectId);

  const stats = [
    {
      value: new Date().getFullYear() - SITE.since,
      format: (n: number) => `${Math.round(n)}+`,
      label: "Years in operation",
    },
    { value: projects.length, format: (n: number) => `${Math.round(n)}`, label: "Documented projects" },
    { value: totalValue, format: (n: number) => formatINR(n), label: "Contract value executed" },
    { value: 26, format: (n: number) => `${Math.round(n)}`, label: "Machinery item types owned" },
  ];

  const marqueeClients = clients.length ? [...clients, ...clients] : [];

  return (
    <>
      {/* Hero */}
      <section className="grain relative flex min-h-[92svh] items-end overflow-hidden bg-charcoal text-charcoal-foreground">
        <img
          src={heroImage.url}
          alt="Reinforced concrete frame of a multi-storey building under construction at dusk"
          className="absolute inset-0 h-full w-full scale-105 object-cover opacity-45"
          fetchPriority="high"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/75 to-charcoal/20"
          aria-hidden
        />
        <div className="blueprint absolute inset-0 opacity-60" aria-hidden />
        <div
          className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-charcoal to-transparent"
          aria-hidden
        />

        <div className="relative mx-auto w-full max-w-7xl px-5 pb-16 pt-32 lg:px-8 lg:pb-24">
          <Reveal>
            <p className="eyebrow flex flex-wrap items-center gap-3 text-charcoal-foreground/70">
              <span className="inline-flex items-center gap-2 border border-signal/40 bg-signal/10 px-2.5 py-1 text-signal">
                <span className="h-1.5 w-1.5 animate-pulse bg-signal" aria-hidden />
                Jalpaiguri, West Bengal
              </span>
              <span>Since {SITE.since}</span>
            </p>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-6 max-w-5xl text-balance text-[2.6rem] font-extrabold leading-[1.02] sm:text-6xl lg:text-7xl">
              Civil and infrastructure works,{" "}
              <span className="relative inline-block">
                <span className="relative z-10">delivered to programme</span>
                <span
                  className="absolute inset-x-0 bottom-1 z-0 h-3 bg-signal/35 lg:bottom-2 lg:h-4"
                  aria-hidden
                />
              </span>{" "}
              across North Bengal.
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-7 max-w-2xl border-l-2 border-signal/60 pl-5 text-base leading-relaxed text-charcoal-foreground/75 lg:text-lg">
              Apartments and villas, hospitals, bituminous and CC roads, drainage, water supply
              infrastructure, industrial civil works and bulk material supply — for Ambuja Neotia,
              Shapoorji Pallonji, Hindustan Coca-Cola Beverages, Manipal Hospital and West Bengal
              government departments.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link
                to="/projects"
                className="group inline-flex h-12 items-center gap-2 bg-signal px-6 text-sm font-semibold text-signal-foreground transition-all hover:gap-3 hover:brightness-110"
              >
                View the portfolio
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex h-12 items-center border border-charcoal-foreground/30 px-6 text-sm font-semibold backdrop-blur-sm transition-colors hover:border-charcoal-foreground/60 hover:bg-charcoal-foreground/10"
              >
                Start an enquiry
              </Link>
              <span className="ml-1 hidden h-8 w-px bg-charcoal-foreground/20 sm:block" aria-hidden />
              <span className="hidden font-mono text-[11px] uppercase tracking-[0.18em] text-charcoal-foreground/50 sm:inline">
                {projects.length} projects on record
              </span>
            </div>
          </Reveal>
        </div>

        <div
          className="absolute bottom-8 right-5 hidden h-16 w-px overflow-hidden bg-charcoal-foreground/15 lg:right-8 lg:block"
          aria-hidden
        >
          <span className="scroll-cue block h-full w-full bg-signal" />
        </div>
      </section>

      {/* Client marquee */}
      {marqueeClients.length > 0 && (
        <div className="overflow-hidden border-b border-border bg-charcoal py-4 text-charcoal-foreground">
          <div className="marquee-track flex w-max items-center gap-10 whitespace-nowrap">
            {marqueeClients.map((c, i) => (
              <span
                key={`${c.id}-${i}`}
                className="flex items-center gap-10 font-mono text-[11px] uppercase tracking-[0.22em] text-charcoal-foreground/55"
              >
                {c.name}
                <span className="h-1 w-1 bg-signal/70" aria-hidden />
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Proof band */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-border px-0 lg:grid-cols-4">
          {stats.map((s) => (
            <StatCell key={s.label} value={s.value} format={s.format} label={s.label} />
          ))}
        </div>
      </div>


      {/* About preview */}
      <Section>
        <div className="grid gap-14 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <SectionHeading
              index="01"
              eyebrow="About us"
              title="A contractor built around execution, not promises."
              lead={`Established in ${SITE.since} and founded by ${SITE.founders}, Shree Enterprise executes civil and infrastructure works from a single base in Jalpaiguri — with our own engineering team, supervisors, machinery fleet and shuttering resources.`}
            />
            <p className="mt-6 max-w-2xl leading-relaxed text-muted-foreground">
              Our work spans private developers, corporate plants and state departments. That mix
              keeps our systems honest: developer programmes demand pace and finish, plant work
              demands safety discipline inside a live facility, and government work demands
              measurable quality against schedule of rates.
            </p>
            <Link
              to="/about"
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold underline underline-offset-4"
            >
              Read the full company story <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <ul className="grid gap-px self-start bg-border">
            {[
              {
                icon: Building2,
                title: "Own engineering team",
                body: "Technical head, engineers-in-charge, dedicated QA/QC and seven field supervisors.",
              },
              {
                icon: HardHat,
                title: "Owned plant and shuttering",
                body: "26 machinery item types plus 1,000 props, cuplock staging and 30,000 sq ft of shuttering ply.",
              },
              {
                icon: Waves,
                title: "Multi-sector record",
                body: "Buildings, roads, drainage, water infrastructure, industrial civil works and area development.",
              },
              {
                icon: Truck,
                title: "Bulk supply capability",
                body: "Sand, aggregate, bricks, GSB, rubble and Pakur chips supplied at project scale.",
              },
            ].map((f) => (
              <li key={f.title} className="bg-card p-6">
                <f.icon className="h-5 w-5 text-signal" aria-hidden />
                <p className="mt-4 font-display font-bold">{f.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Capabilities */}
      <div className="border-y border-border bg-secondary/60">
        <Section>
          <SectionHeading
            index="02"
            eyebrow="Capabilities"
            title="Ten disciplines under one contractor."
            lead="Each capability is backed by completed work, not a service list."
          />
          <ul className="mt-12 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
            {sectors.map((s, i) => {
              const count = projects.filter((p) => p.sector_slug === s.slug).length;
              return (
                <li key={s.id} className="bg-background p-7">
                  <div className="flex items-start justify-between gap-4">
                    <span className="font-mono text-[11px] tracking-[0.2em] text-signal">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-mono text-[11px] text-muted-foreground">
                      {count} {count === 1 ? "project" : "projects"}
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-bold">{s.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {s.headline}
                  </p>
                </li>
              );
            })}
          </ul>
          <Link
            to="/capabilities"
            className="mt-10 inline-flex items-center gap-2 text-sm font-semibold underline underline-offset-4"
          >
            Explore capabilities in detail <ArrowRight className="h-4 w-4" />
          </Link>
        </Section>
      </div>

      {/* Featured projects */}
      <Section>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            index="03"
            eyebrow="Selected work"
            title="Projects on record."
            lead="Photographed on our own sites. Values and dates are as recorded in our project schedule."
          />
          <Link
            to="/projects"
            className="inline-flex h-11 items-center gap-2 border border-border px-5 text-sm font-semibold hover:bg-secondary"
          >
            All {projects.length} projects <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <ul className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => {
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
                      <div className="grid h-full w-full place-items-center grid-lines">
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
                  <h3 className="mt-2 text-lg font-bold leading-snug group-hover:underline">
                    {p.name}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {p.client_name} · {p.location}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      </Section>

      {/* Clients */}
      <div className="border-y border-border bg-charcoal text-charcoal-foreground">
        <Section>
          <p className="eyebrow text-charcoal-foreground/60">
            <span className="text-signal">04</span> Clients & principals
          </p>
          <h2 className="mt-4 max-w-3xl text-3xl font-extrabold sm:text-4xl">
            Retained by developers, corporates and state departments.
          </h2>
          <ul className="mt-12 grid gap-px bg-charcoal-foreground/10 sm:grid-cols-2 lg:grid-cols-3">
            {clients.map((c) => (
              <li key={c.id} className="bg-charcoal p-6">
                <p className="font-display text-base font-bold">{c.name}</p>
                {c.relationship && (
                  <p className="mt-1.5 text-sm text-charcoal-foreground/60">{c.relationship}</p>
                )}
              </li>
            ))}
          </ul>
        </Section>
      </div>

      {/* CTA */}
      <Section className="text-center">
        <p className="eyebrow">Next step</p>
        <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-extrabold sm:text-4xl lg:text-5xl">
          Send us the drawings, site location and programme. We will respond with a considered
          quote.
        </h2>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link
            to="/contact"
            className="inline-flex h-12 items-center gap-2 bg-charcoal px-6 text-sm font-semibold text-charcoal-foreground hover:bg-charcoal/90"
          >
            Start an enquiry <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href={`tel:${SITE.phonePrimary}`}
            className="inline-flex h-12 items-center border border-border px-6 text-sm font-semibold hover:bg-secondary"
          >
            Call {SITE.phonePrimary}
          </a>
        </div>
      </Section>
    </>
  );
}
