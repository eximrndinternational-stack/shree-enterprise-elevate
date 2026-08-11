import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PageHero, Section, SectionHeading } from "@/components/site/Section";
import { equipmentQuery, scaffoldingQuery } from "@/lib/queries";
import { EQUIPMENT_CATEGORIES } from "@/lib/site";

export const Route = createFileRoute("/equipment")({
  head: () => ({
    meta: [
      { title: "Machinery & Equipment — Owned Plant and Shuttering Resources" },
      {
        name: "description",
        content:
          "Shree Enterprise owns 26 machinery item types including JCB backhoe loaders, Poklen excavators, a Volvo vibratory roller, Putzmeister pressure pump, total station and 30,000 sq ft of shuttering ply.",
      },
      { property: "og:title", content: "Machinery & Equipment — Shree Enterprise" },
      {
        property: "og:description",
        content:
          "Full inventory of owned plant, survey instruments, testing equipment, scaffolding and shuttering resources.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/equipment" },
    ],
    links: [{ rel: "canonical", href: "/equipment" }],
  }),
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(equipmentQuery),
      context.queryClient.ensureQueryData(scaffoldingQuery),
    ]);
  },
  component: EquipmentPage,
});

function EquipmentPage() {
  const { data: equipment } = useSuspenseQuery(equipmentQuery);
  const { data: scaffolding } = useSuspenseQuery(scaffoldingQuery);

  const totalUnits = equipment.reduce(
    (s, e) => s + (e.unit === "nos" || e.unit === "no" ? (e.quantity ?? 0) : 0),
    0,
  );

  return (
    <>
      <PageHero
        index="04"
        eyebrow="Machinery & equipment"
        title="Owned plant, so the programme is ours to keep."
        lead="Hired plant is the most common cause of slipped programmes. We carry our own earthmoving, concreting, survey, testing and staging resources."
      />

      <div className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-border lg:grid-cols-4">
          {[
            { v: `${equipment.length}`, l: "Machinery item types" },
            { v: `${totalUnits}`, l: "Individual machines on strength" },
            { v: "30,000", l: "Sq ft of shuttering ply" },
            { v: "1,000", l: "Adjustable pipe props" },
          ].map((s) => (
            <div key={s.l} className="bg-card px-5 py-10 lg:px-8">
              <p className="font-display text-3xl font-extrabold tabular-nums lg:text-4xl">{s.v}</p>
              <p className="mt-2 text-xs uppercase tracking-wider text-muted-foreground">{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      <Section>
        <SectionHeading
          eyebrow="Inventory"
          title="Plant and equipment on strength."
          lead="Quantities are as recorded in our company profile."
        />

        <div className="mt-12 space-y-14">
          {EQUIPMENT_CATEGORIES.map((cat) => {
            const items = equipment.filter((e) => e.category === cat.key);
            if (items.length === 0) return null;
            return (
              <div key={cat.key}>
                <h3 className="eyebrow border-b border-border pb-3">{cat.title}</h3>
                <ul className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((e) => (
                    <li key={e.id} className="flex items-baseline justify-between gap-4 bg-background px-5 py-5">
                      <span>
                        <span className="font-medium">{e.name}</span>
                        {(e.make || e.specification) && (
                          <span className="mt-1 block text-xs text-muted-foreground">
                            {[e.make, e.specification].filter(Boolean).join(" · ")}
                          </span>
                        )}
                      </span>
                      <span className="shrink-0 font-mono text-sm tabular-nums">
                        {e.quantity != null ? `${e.quantity} ${e.unit}` : "In use"}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </Section>

      <div className="border-t border-border bg-secondary/60">
        <Section>
          <SectionHeading
            eyebrow="Scaffolding & shuttering"
            title="Staging and formwork resources."
            lead="Cuplock staging, adjustable props, spans and shuttering ply held in our own stores."
          />
          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <caption className="sr-only">Scaffolding and shuttering inventory</caption>
              <thead>
                <tr className="border-b border-border text-left">
                  <th scope="col" className="eyebrow py-3 pr-4 font-normal">Item</th>
                  <th scope="col" className="eyebrow py-3 pr-4 font-normal">Specification</th>
                  <th scope="col" className="eyebrow py-3 text-right font-normal">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {scaffolding.map((s) => (
                  <tr key={s.id} className="border-b border-border/60 align-top">
                    <td className="py-4 pr-4 font-medium">{s.name}</td>
                    <td className="py-4 pr-4 text-muted-foreground">{s.specification ?? "—"}</td>
                    <td className="py-4 text-right font-mono tabular-nums">
                      {s.quantity?.toLocaleString("en-IN")} {s.unit}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      </div>
    </>
  );
}
