import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Section({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28", className)}>
      {children}
    </section>
  );
}

export function SectionHeading({
  index,
  eyebrow,
  title,
  lead,
  className,
}: {
  index?: string;
  eyebrow?: string;
  title: string;
  lead?: string;
  className?: string;
}) {
  return (
    <div className={cn("max-w-3xl", className)}>
      {(eyebrow || index) && (
        <p className="eyebrow flex items-center gap-3">
          {index && <span className="text-signal">{index}</span>}
          {eyebrow}
        </p>
      )}
      <h2 className="mt-4 text-3xl font-extrabold leading-[1.08] sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {lead && <p className="mt-5 text-base leading-relaxed text-muted-foreground lg:text-lg">{lead}</p>}
    </div>
  );
}

export function PageHero({
  index,
  eyebrow,
  title,
  lead,
}: {
  index?: string;
  eyebrow: string;
  title: string;
  lead?: string;
}) {
  return (
    <div className="border-b border-border bg-charcoal text-charcoal-foreground">
      <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
        <p className="eyebrow flex items-center gap-3 text-charcoal-foreground/60">
          {index && <span className="text-signal">{index}</span>}
          {eyebrow}
        </p>
        <h1 className="mt-5 max-w-4xl text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {lead && (
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-charcoal-foreground/70 lg:text-lg">
            {lead}
          </p>
        )}
      </div>
    </div>
  );
}
