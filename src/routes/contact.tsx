import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Mail, MapPin, Phone, Check } from "lucide-react";
import { toast } from "sonner";
import { PageHero, Section } from "@/components/site/Section";
import { SITE } from "@/lib/site";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Enquiries — Shree Enterprise, Jalpaiguri" },
      {
        name: "description",
        content:
          "Send a construction enquiry to Shree Enterprise, Jalpaiguri. Share your scope, location and programme and we will respond with a considered quote.",
      },
      { property: "og:title", content: "Contact Shree Enterprise" },
      {
        property: "og:description",
        content: "Enquiries for civil, road, drainage, water and industrial works across North Bengal.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

const SERVICES = [
  "Residential construction",
  "Commercial / institutional building",
  "Healthcare construction",
  "Roads",
  "Drainage & civil infrastructure",
  "Water infrastructure",
  "Industrial civil works",
  "Bulk material supply",
  "Area development",
  "Other",
];

function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") ?? "").trim(),
      organisation: String(fd.get("organisation") ?? "").trim() || null,
      email: String(fd.get("email") ?? "").trim(),
      phone: String(fd.get("phone") ?? "").trim() || null,
      project_type: String(fd.get("project_type") ?? "").trim() || null,
      project_location: String(fd.get("project_location") ?? "").trim() || null,
      project_scale: String(fd.get("project_scale") ?? "").trim() || null,
      required_service: String(fd.get("required_service") ?? "").trim() || null,
      expected_start: String(fd.get("expected_start") ?? "").trim() || null,
      message: String(fd.get("message") ?? "").trim() || null,
    };

    if (!payload.name || !payload.email) {
      toast.error("Please add your name and email so we can reply.");
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("enquiries").insert(payload);
    setSubmitting(false);

    if (error) {
      toast.error("We could not send that. Please try again or call us directly.");
      return;
    }
    form.reset();
    setDone(true);
    toast.success("Enquiry received. We will respond shortly.");
  }

  const field =
    "mt-2 h-11 w-full border border-input bg-background px-3 text-sm outline-none focus:border-foreground focus:ring-2 focus:ring-ring/40";
  const labelCls = "block text-xs font-medium uppercase tracking-wider text-muted-foreground";

  return (
    <>
      <PageHero
        index="07"
        eyebrow="Contact"
        title="Tell us about the work."
        lead="Scope, location and programme are enough to start. We reply to every serious enquiry."
      />

      <Section>
        <div className="grid gap-14 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <h2 className="text-2xl font-extrabold">Project enquiry</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Fields marked with an asterisk are required.
            </p>

            {done ? (
              <div className="mt-8 border border-border bg-secondary/60 p-8">
                <Check className="h-6 w-6 text-signal" aria-hidden />
                <p className="mt-4 font-display text-xl font-bold">Enquiry received.</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Thank you. Our team will review the scope and get back to you. For anything
                  urgent, call {SITE.phonePrimary}.
                </p>
                <button
                  type="button"
                  onClick={() => setDone(false)}
                  className="mt-6 border border-border px-4 py-2 text-sm font-semibold hover:bg-background"
                >
                  Send another enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="mt-8 grid gap-6 sm:grid-cols-2">
                <div>
                  <label className={labelCls} htmlFor="name">Full name *</label>
                  <input id="name" name="name" required autoComplete="name" className={field} />
                </div>
                <div>
                  <label className={labelCls} htmlFor="organisation">Organisation</label>
                  <input id="organisation" name="organisation" autoComplete="organization" className={field} />
                </div>
                <div>
                  <label className={labelCls} htmlFor="email">Email *</label>
                  <input id="email" name="email" type="email" required autoComplete="email" className={field} />
                </div>
                <div>
                  <label className={labelCls} htmlFor="phone">Phone</label>
                  <input id="phone" name="phone" type="tel" autoComplete="tel" className={field} />
                </div>
                <div>
                  <label className={labelCls} htmlFor="required_service">Service required</label>
                  <select id="required_service" name="required_service" className={field} defaultValue="">
                    <option value="">Select a service</option>
                    {SERVICES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls} htmlFor="project_type">Project type</label>
                  <input id="project_type" name="project_type" placeholder="e.g. G+4 apartment block" className={field} />
                </div>
                <div>
                  <label className={labelCls} htmlFor="project_location">Project location</label>
                  <input id="project_location" name="project_location" placeholder="Town / district" className={field} />
                </div>
                <div>
                  <label className={labelCls} htmlFor="project_scale">Approximate scale or budget</label>
                  <input id="project_scale" name="project_scale" placeholder="e.g. 12,000 sq ft / ₹2 Cr" className={field} />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls} htmlFor="expected_start">Expected start</label>
                  <input id="expected_start" name="expected_start" placeholder="e.g. Q3 2026" className={field} />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls} htmlFor="message">Scope and other details</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    className="mt-2 w-full border border-input bg-background p-3 text-sm outline-none focus:border-foreground focus:ring-2 focus:ring-ring/40"
                  />
                </div>
                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex h-12 items-center bg-charcoal px-7 text-sm font-semibold text-charcoal-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
                  >
                    {submitting ? "Sending…" : "Send enquiry"}
                  </button>
                </div>
              </form>
            )}
          </div>

          <aside className="space-y-8 lg:border-l lg:border-border lg:pl-12">
            <div>
              <p className="eyebrow">Registered office</p>
              <address className="mt-4 space-y-4 not-italic text-sm">
                <p className="flex gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-signal" aria-hidden />
                  <span>
                    {SITE.addressLine1}
                    <br />
                    {SITE.addressLine2}
                  </span>
                </p>
                <p className="flex gap-3">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-signal" aria-hidden />
                  <span>
                    <a className="hover:underline" href={`tel:${SITE.phonePrimary}`}>{SITE.phonePrimary}</a>
                    <br />
                    <a className="hover:underline" href={`tel:${SITE.phoneSecondary}`}>{SITE.phoneSecondary}</a>
                  </span>
                </p>
                <p className="flex gap-3">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-signal" aria-hidden />
                  <a className="break-all hover:underline" href={`mailto:${SITE.email}`}>{SITE.email}</a>
                </p>
              </address>
            </div>

            <div className="border-t border-border pt-8">
              <p className="eyebrow">Working area</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Jalpaiguri, Darjeeling and Cooch Behar districts, and the wider North Bengal region.
                Larger packages considered across West Bengal.
              </p>
            </div>

            <div className="border-t border-border pt-8">
              <p className="eyebrow">Who we work with</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Real estate developers, corporate plants and EPC principals, hospitals and
                institutions, and state government departments and panchayats.
              </p>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
