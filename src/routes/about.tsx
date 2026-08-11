import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { PageHero, Section, SectionHeading } from "@/components/site/Section";
import { clientsQuery, projectsQuery } from "@/lib/queries";
import { SITE, formatINR } from "@/lib/site";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Shree Enterprise — Construction Contractor since 2010" },
      {
        name: "description",
        content:
          "Founded in 2010 in Jalpaiguri, Shree Enterprise delivers civil and infrastructure works for developers, corporates and West Bengal government departments across North Bengal.",
      },
      { property: "og:title", content: "About Shree Enterprise — Building with Trust since 2010" },
      {
        property: "og:description",
        content:
          "Our story, mission, working philosophy and verified proof points as a North Bengal civil and infrastructure contractor.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(projectsQuery),
      context.queryClient.ensureQueryData(clientsQuery),
    ]);
  },
  component: AboutPage,
});

function AboutPage() {
  const { data: projects } = useSuspenseQuery(projectsQuery);
  const { data: clients } = useSuspenseQuery(clientsQuery);

  const total = projects.reduce((s, p) => s + (p.project_value ?? 0), 0);
  const largest = [...projects].sort(
    (a, b) => (b.project_value ?? 0) - (a.project_value ?? 0),
  )[0];
  const ongoing = projects.filter((p) => p.status === "ongoing").length;
  const govt = projects.filter((p) => p.ownership === "government").length;

  const proof = [
    { value: `${projects.length}`, label: "Projects in the record", note: "Documented in our company profile with client, value and dates." },
    { value: formatINR(total), label: "Total contract value", note: "Aggregate of all documented awards." },
    { value: formatINR(largest?.project_value), label: "Largest single engagement", note: largest?.name ?? "" },
    { value: `${govt}`, label: "Government awards", note: "For N.B.D.D, WBSRDA, PHE, Zilla Parishad, MGNREGS and Gram Panchayats." },
    { value: `${ongoing}`, label: "Live engagements", note: "Currently under execution." },
    { value: `${clients.length}`, label: "Named client relationships", note: "Developers, corporates and state departments." },
  ];

  return (
    <>
      <PageHero
        index="01"
        eyebrow="About us"
        title="Fifteen years of building in North Bengal, one site at a time."
        lead={`Shree Enterprise was established in ${SITE.since} by ${SITE.founders}, and works from Jalpaiguri across Jalpaiguri, Darjeeling and Cooch Behar districts.`}
      />

      <Section>
        <div className="grid gap-14 lg:grid-cols-[1fr_1fr]">
          <div>
            <SectionHeading eyebrow="Our story" title="From local civil works to township-scale delivery." />
            <div className="mt-6 space-y-5 leading-relaxed text-muted-foreground">
              <p>
                The firm began with civil works and material supply around Jalpaiguri. Reliability
                on those early contracts brought larger principals: bulk material supply and site
                buildings for Shapoorji Pallonji at the Jalpaiguri Super Speciality Hospital, then
                college construction and rural water infrastructure for state departments.
              </p>
              <p>
                From 2019 the scale of work stepped up again — PHE overhead reservoirs, PMGSY
                bituminous roads, G+4 apartment blocks for private promoter groups, and bulk
                material supply to the Hindustan Coca-Cola Beverages plant at Raninagar through JMC
                Projects.
              </p>
              <p>
                Since 2021 the firm has been engaged by the Ambuja Neotia Group at Lataguri and
                Siliguri, executing five G+4 apartment blocks, thirty duplex villas and full area
                development at Vanya Awas. In 2025 we began a G+3 oncology hospital at Rangapani
                for Manipal Hospital.
              </p>
            </div>
          </div>

          <div className="space-y-10">
            <div className="border-l-2 border-signal pl-6">
              <p className="eyebrow">Mission</p>
              <p className="mt-3 text-xl font-display font-bold leading-snug">
                To deliver civil and infrastructure works that hold up to inspection years after
                handover — safely, on programme, and at a price the client can defend.
              </p>
            </div>
            <div className="border-l-2 border-border pl-6">
              <p className="eyebrow">Philosophy</p>
              <ul className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
                {[
                  ["Own the means of execution.", "We own our machinery, shuttering and staging so programme is not hostage to hired plant."],
                  ["Engineer before you build.", "Setting out with total station and auto levels, cube testing and slump control on every pour."],
                  ["One team, site to office.", "Engineers-in-charge, QA/QC, supervisors, stores and billing work off the same daily record."],
                  ["Say what is true.", "Values, dates and scope published here are taken from our own project schedule."],
                ].map(([t, b]) => (
                  <li key={t}>
                    <span className="font-semibold text-foreground">{t}</span> {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Section>

      <div className="border-y border-border bg-secondary/60">
        <Section>
          <SectionHeading
            index="02"
            eyebrow="Proof points"
            title="Numbers taken from the record, not from marketing."
            lead="Every figure below is derived from our documented project schedule."
          />
          <ul className="mt-12 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
            {proof.map((p) => (
              <li key={p.label} className="bg-background p-7">
                <p className="font-display text-3xl font-extrabold tabular-nums">{p.value}</p>
                <p className="mt-2 text-sm font-semibold">{p.label}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{p.note}</p>
              </li>
            ))}
          </ul>
        </Section>
      </div>

      <Section>
        <div className="grid gap-12 lg:grid-cols-3">
          <SectionHeading
            index="03"
            eyebrow="How we work"
            title="A predictable sequence on every job."
            className="lg:col-span-1"
          />
          <ol className="lg:col-span-2 grid gap-px bg-border sm:grid-cols-2">
            {[
              ["Enquiry & site assessment", "We visit, measure and confirm access, soil, services and constraints before quoting."],
              ["Estimation & method", "Rate build-up against drawings or SOR, with a construction method and programme."],
              ["Mobilisation", "Plant, shuttering, stores and site engineering set up under a named engineer-in-charge."],
              ["Execution & QA/QC", "Daily progress record, setting-out checks, cube tests and slump control at each stage."],
              ["Billing & measurement", "Joint measurement, RA bills and documentation prepared by the billing desk."],
              ["Handover & defects", "Snagging, rectification and handover with as-built records."],
            ].map(([t, b], i) => (
              <li key={t} className="bg-background p-6">
                <span className="font-mono text-[11px] tracking-[0.2em] text-signal">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="mt-3 font-display font-bold">{t}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{b}</p>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <div className="border-t border-border">
        <Section className="flex flex-wrap items-center justify-between gap-6">
          <p className="max-w-xl text-2xl font-display font-bold">
            Want the detail behind the numbers? The full portfolio lists every project with client,
            value and dates.
          </p>
          <Link
            to="/projects"
            className="inline-flex h-12 items-center gap-2 bg-charcoal px-6 text-sm font-semibold text-charcoal-foreground hover:bg-charcoal/90"
          >
            View portfolio <ArrowRight className="h-4 w-4" />
          </Link>
        </Section>
      </div>
    </>
  );
}
