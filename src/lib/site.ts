export const SITE = {
  name: "SHREE ENTERPRISE",
  legal: "Shree Enterprise",
  tagline: "Building with Trust",
  since: 2010,
  city: "Jalpaiguri",
  state: "West Bengal",
  addressLine1: "Dreamland, Pabitra Para",
  addressLine2: "PO & Dist. Jalpaiguri, West Bengal – 735101, India",
  phonePrimary: "9800045678",
  phoneSecondary: "9832045678",
  email: "shreeenterpriseof2010@gmail.com",
  founders: "Mr. Sankha Pani Das and Mrs. Chumki Basu Das",
} as const;

/** Format a rupee amount in Indian crore / lakh notation. */
export function formatINR(value: number | null | undefined): string {
  if (value == null) return "—";
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(2)} L`;
  return `₹${value.toLocaleString("en-IN")}`;
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
}

export function formatDateFull(value: string | null | undefined): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export const TEAM_GROUPS: { key: string; title: string; blurb: string }[] = [
  {
    key: "management",
    title: "Management",
    blurb: "Partners who set direction, commercial terms and client commitments.",
  },
  {
    key: "executive",
    title: "Executive & Technical",
    blurb: "Project leadership, technical control, procurement and billing.",
  },
  {
    key: "field_engineer",
    title: "Field Engineering",
    blurb: "Engineers-in-charge, QA/QC and junior engineers running the works.",
  },
  {
    key: "field_supervisor",
    title: "Field Supervision",
    blurb: "Supervisors holding daily quality, sequence and safety on site.",
  },
  {
    key: "office",
    title: "Office & Support",
    blurb: "Accounts, stores, IT and administration behind every site.",
  },
];

export const EQUIPMENT_CATEGORIES: { key: string; title: string }[] = [
  { key: "earthmoving", title: "Earthmoving & Excavation" },
  { key: "concrete", title: "Concrete & Placement" },
  { key: "surveying", title: "Survey & Setting Out" },
  { key: "testing", title: "Quality Testing" },
  { key: "roadwork", title: "Road Compaction" },
  { key: "material-handling", title: "Material Handling" },
  { key: "lifting", title: "Lifting" },
  { key: "water", title: "Water & Curing" },
  { key: "site", title: "Site Fabrication" },
  { key: "welding", title: "Welding" },
];
