import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ShieldCheck, Lock } from "lucide-react";
import { PageHero, Section, SectionHeading } from "@/components/site/Section";
import { credentialsQuery } from "@/lib/queries";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/credentials")({
  head: () => ({
    meta: [
      { title: "Credentials & Compliance — Registrations and Statutory Records" },
      {
        name: "description",
        content:
          "Shree Enterprise holds trade licence, PAN, GSTIN, EPF, ESIC, labour licence and MSME registration. Verified copies are shared with clients on request.",
      },
      { property: "og:title", content: "Credentials & Compliance — Shree Enterprise" },
      {
        property: "og:description",
        content:
          "Business registrations and labour compliance records held by Shree Enterprise, Jalpaiguri.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/credentials" },
    ],
    links: [{ rel: "canonical", href: "/credentials" }],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(credentialsQuery),
  component: CredentialsPage,
});

function CredentialsPage() {
  const { data: credentials } = useSuspenseQuery(credentialsQuery);

  return (
    <>
      <PageHero
        index="06"
        eyebrow="Credentials"
        title="Registered, compliant and ready for vendor onboarding."
        lead="We maintain the statutory registrations expected of a contractor working with corporate principals and government departments."
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <SectionHeading eyebrow="On record" title="Registrations held." />
            <p className="mt-6 flex gap-3 border border-border bg-secondary/60 p-5 text-sm leading-relaxed text-muted-foreground">
              <Lock className="mt-0.5 h-4 w-4 shrink-0 text-signal" aria-hidden />
              <span>
                Registration and document numbers are deliberately not published on this website.
                Verified copies are issued directly to clients during vendor registration or
                tendering, on written request.
              </span>
            </p>
          </div>

          <ul className="divide-y divide-border border-y border-border">
            {credentials.map((c) => (
              <li key={c.id} className="flex items-start gap-4 py-5">
                <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-signal" aria-hidden />
                <div className="flex-1">
                  <p className="font-display font-bold">{c.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {[c.doc_type, c.issuing_authority].filter(Boolean).join(" · ")}
                  </p>
                </div>
                <span className="shrink-0 border border-border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  {c.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <div className="border-t border-border bg-charcoal text-charcoal-foreground">
        <Section className="grid gap-10 lg:grid-cols-2">
          <div>
            <p className="eyebrow text-charcoal-foreground/60">Vendor onboarding</p>
            <h2 className="mt-4 text-3xl font-extrabold">
              Need our documents for empanelment?
            </h2>
            <p className="mt-5 leading-relaxed text-charcoal-foreground/70">
              Send your vendor registration form and the list of documents required. We will return
              a complete, signed set — including registration certificates, past performance
              records and machinery declarations.
            </p>
          </div>
          <div className="flex flex-col justify-center gap-4">
            <Link
              to="/contact"
              className="inline-flex h-12 items-center justify-center bg-signal px-6 text-sm font-semibold text-signal-foreground hover:opacity-90"
            >
              Request document set
            </Link>
            <a
              href={`mailto:${SITE.email}`}
              className="inline-flex h-12 items-center justify-center border border-charcoal-foreground/30 px-6 text-sm font-semibold hover:bg-charcoal-foreground/10"
            >
              Email {SITE.email}
            </a>
          </div>
        </Section>
      </div>
    </>
  );
}
