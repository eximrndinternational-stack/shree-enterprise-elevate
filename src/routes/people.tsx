import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PageHero, Section, SectionHeading } from "@/components/site/Section";
import { teamQuery } from "@/lib/queries";
import { TEAM_GROUPS } from "@/lib/site";

export const Route = createFileRoute("/people")({
  head: () => ({
    meta: [
      { title: "People — Management, Engineering and Site Supervision" },
      {
        name: "description",
        content:
          "The Shree Enterprise team: partners, technical head, engineers-in-charge, QA/QC, junior engineers, field supervisors and office support, with their qualifications and experience.",
      },
      { property: "og:title", content: "People — Shree Enterprise" },
      {
        property: "og:description",
        content:
          "Named management, engineering and supervisory staff with real qualifications and site experience.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/people" },
    ],
    links: [{ rel: "canonical", href: "/people" }],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(teamQuery),
  component: PeoplePage,
});

function PeoplePage() {
  const { data: team } = useSuspenseQuery(teamQuery);

  const initials = (name: string) =>
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0])
      .join("");

  return (
    <>
      <PageHero
        index="05"
        eyebrow="People"
        title="The people who actually run the works."
        lead={`${team.length} named staff across management, technical, field engineering, supervision and office support.`}
      />

      <Section>
        <div className="space-y-16">
          {TEAM_GROUPS.map((g) => {
            const members = team.filter((m) => m.team_group === g.key);
            if (members.length === 0) return null;
            return (
              <div key={g.key}>
                <SectionHeading eyebrow={`${members.length} people`} title={g.title} lead={g.blurb} />
                <ul className="mt-8 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
                  {members.map((m) => (
                    <li key={m.id} className="bg-background p-6">
                      <div className="flex items-start gap-4">
                        <span
                          aria-hidden
                          className="grid h-11 w-11 shrink-0 place-items-center bg-charcoal font-display text-sm font-bold text-charcoal-foreground"
                        >
                          {initials(m.name)}
                        </span>
                        <div>
                          <p className="font-display text-base font-bold">{m.name}</p>
                          <p className="mt-0.5 text-sm text-muted-foreground">{m.role}</p>
                        </div>
                      </div>
                      {(m.qualification || m.experience || m.discipline) && (
                        <dl className="mt-5 space-y-1.5 border-t border-border pt-4 text-xs">
                          {m.qualification && (
                            <div className="flex justify-between gap-4">
                              <dt className="text-muted-foreground">Qualification</dt>
                              <dd className="text-right font-medium">{m.qualification}</dd>
                            </div>
                          )}
                          {m.experience && (
                            <div className="flex justify-between gap-4">
                              <dt className="text-muted-foreground">Experience</dt>
                              <dd className="text-right font-medium">{m.experience}</dd>
                            </div>
                          )}
                          {m.discipline && (
                            <div className="flex justify-between gap-4">
                              <dt className="text-muted-foreground">Discipline</dt>
                              <dd className="text-right font-medium">{m.discipline}</dd>
                            </div>
                          )}
                        </dl>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </Section>
    </>
  );
}
