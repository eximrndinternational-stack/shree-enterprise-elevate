import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, Info } from "lucide-react";
import { Section } from "@/components/site/Section";
import { projectDetailQuery, projectsQuery, sectorsQuery } from "@/lib/queries";
import { formatDateFull, formatINR } from "@/lib/site";

export const Route = createFileRoute("/projects/$slug")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(projectDetailQuery(params.slug));
    if (!data) throw notFound();
    await Promise.all([
      context.queryClient.ensureQueryData(projectsQuery),
      context.queryClient.ensureQueryData(sectorsQuery),
    ]);
    return data;
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Project not found — Shree Enterprise" }, { name: "robots", content: "noindex" }],
      };
    }
    const p = loaderData.project;
    const title = `${p.name} — Shree Enterprise`;
    const description = (p.description ?? p.scope ?? "").slice(0, 155);
    const cover = loaderData.images.find((i) => i.is_cover) ?? loaderData.images[0];
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `/projects/${params.slug}` },
        ...(cover
          ? [
              { property: "og:image", content: cover.url },
              { name: "twitter:image", content: cover.url },
            ]
          : []),
      ],
      links: [{ rel: "canonical", href: `/projects/${params.slug}` }],
    };
  },
  component: ProjectDetail,
  notFoundComponent: ProjectNotFound,
});

function ProjectNotFound() {
  return (
    <Section className="text-center">
      <h1 className="text-3xl font-extrabold">Project not found</h1>
      <p className="mt-3 text-muted-foreground">This project is not published.</p>
      <Link to="/projects" className="mt-6 inline-block text-sm font-semibold underline underline-offset-4">
        Back to the portfolio
      </Link>
    </Section>
  );
}

function ProjectDetail() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(projectDetailQuery(slug));
  const { data: all } = useSuspenseQuery(projectsQuery);
  const { data: sectors } = useSuspenseQuery(sectorsQuery);
  if (!data) return <ProjectNotFound />;

  const { project: p, images } = data;
  const sector = sectors.find((s) => s.slug === p.sector_slug);
  const related = all.filter((x) => x.sector_slug === p.sector_slug && x.id !== p.id).slice(0, 3);
  const cover = images.find((i) => i.is_cover) ?? images[0];
  const rest = images.filter((i) => i.id !== cover?.id);

  const facts: [string, string][] = [
    ["Client", p.client_name ?? "—"],
    ["Sector", sector?.name ?? p.sector_slug],
    ["Location", p.location ?? "—"],
    ["District", p.district ?? "—"],
    ["Type of work", p.work_type ?? "—"],
    ["Contract value", formatINR(p.project_value)],
    ["Commenced", p.start_date ? formatDateFull(p.start_date) : (p.duration_note ?? "—")],
    ["Completed", p.end_date ? formatDateFull(p.end_date) : p.status === "ongoing" ? "Ongoing" : "—"],
  ];

  return (
    <>
      <div className="border-b border-border bg-charcoal text-charcoal-foreground">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-sm text-charcoal-foreground/70 hover:text-charcoal-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Portfolio
          </Link>
          <p className="eyebrow mt-8 flex flex-wrap items-center gap-3 text-charcoal-foreground/60">
            <span className="text-signal">{sector?.name}</span>
            <span aria-hidden>·</span>
            {p.status === "ongoing" ? "Ongoing" : "Completed"}
          </p>
          <h1 className="mt-4 max-w-4xl text-3xl font-extrabold leading-[1.06] sm:text-5xl">
            {p.name}
          </h1>
          <p className="mt-5 max-w-2xl leading-relaxed text-charcoal-foreground/70">
            {p.description}
          </p>
        </div>
      </div>

      {cover && (
        <div className="border-b border-border">
          <img
            src={cover.url}
            alt={cover.alt_text}
            className="h-[46vh] w-full object-cover lg:h-[62vh]"
          />
        </div>
      )}

      <Section>
        <div className="grid gap-14 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <h2 className="eyebrow">Project facts</h2>
            <dl className="mt-6 divide-y divide-border border-y border-border">
              {facts.map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between gap-6 py-3.5">
                  <dt className="text-sm text-muted-foreground">{k}</dt>
                  <dd className="text-right text-sm font-medium">{v}</dd>
                </div>
              ))}
            </dl>
            {p.needs_verification && p.verification_note && (
              <p className="mt-6 flex gap-3 border border-border bg-secondary/60 p-4 text-xs leading-relaxed text-muted-foreground">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-signal" aria-hidden />
                <span>{p.verification_note}</span>
              </p>
            )}
          </div>

          <div>
            <h2 className="eyebrow">Scope of works</h2>
            <p className="mt-6 text-lg leading-relaxed">{p.scope}</p>
            <h3 className="eyebrow mt-12">Delivery notes</h3>
            <ul className="mt-5 space-y-3 text-sm leading-relaxed text-muted-foreground">
              <li>
                Executed by our in-house engineering and supervision team under a named
                engineer-in-charge, with QA/QC checks at each stage.
              </li>
              <li>
                Plant, shuttering and staging drawn from our own fleet, so the programme did not
                depend on hired equipment availability.
              </li>
              {p.duration_note && <li>Recorded period: {p.duration_note}.</li>}
            </ul>
          </div>
        </div>

        {rest.length > 0 && (
          <div className="mt-20">
            <h2 className="eyebrow">Site photographs</h2>
            <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((img) => (
                <li key={img.id}>
                  <figure>
                    <img
                      src={img.url}
                      alt={img.alt_text}
                      loading="lazy"
                      className="aspect-[4/3] w-full object-cover"
                    />
                    {img.caption && (
                      <figcaption className="mt-2 text-xs text-muted-foreground">
                        {img.caption}
                      </figcaption>
                    )}
                  </figure>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Section>

      {related.length > 0 && (
        <div className="border-t border-border bg-secondary/60">
          <Section>
            <h2 className="text-2xl font-extrabold">More {sector?.name?.toLowerCase()} work</h2>
            <ul className="mt-8 divide-y divide-border border-y border-border">
              {related.map((r) => (
                <li key={r.id}>
                  <Link
                    to="/projects/$slug"
                    params={{ slug: r.slug }}
                    className="group flex items-center justify-between gap-6 py-5"
                  >
                    <span>
                      <span className="font-medium group-hover:underline">{r.name}</span>
                      <span className="mt-1 block text-sm text-muted-foreground">
                        {r.client_name} · {r.location}
                      </span>
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                  </Link>
                </li>
              ))}
            </ul>
          </Section>
        </div>
      )}
    </>
  );
}
