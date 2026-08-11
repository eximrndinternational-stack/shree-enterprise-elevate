# Shree Enterprise — Corporate Website

A premium construction/infrastructure website built entirely from the company profile PDF. No invented projects, clients, numbers or claims. Where the profile is silent, the field is left out or marked "To be updated" and made editable in the admin.

## What the PDF actually gives us (verified)

- **32 documented projects**, 2014 → ongoing, with client/department, location, type, duration and value. Range: ₹2,40,000 (borewell, Jalpaiguri Super Speciality Hospital) to ₹18,75,64,738 (bulk material supply, HCCB Raninagar via JMC Projects).
- **Named clients/departments**: Ambuja Neotia Group (Epoch Greenfields Parks Development), Shapoorji Pallonji, JMC Projects (India), Hindustan Coca-Cola Beverages, Manipal Hospital, N.B.D.D, WBSRDA, PHE Jalpaiguri, Jalpaiguri Zilla Parishad, MGNREGS, Gram Panchayats, BDO Sadar Block, private promoter groups.
- **Ongoing**: Vanya Awas area development (Lataguri), G+3 Oncology Hospital for Manipal at Rangapani (₹5.01 Cr, from 01/03/2025), Utshadhara/Noukaghat roads (Siliguri), Lataguri marketing office and boundary works.
- **Vanya Awas work orders** with real values: 3 apartments part-2 phase-1 ₹9.85 Cr; 20 villas phase-1 ₹5.53 Cr; river training ₹1.93 Cr; precast boundary wall ₹35.2 L; jungle-side boundary wall ₹17.6 L; plus studio apartments and common-area scopes.
- **People**: 2 partners, 3 executive team, 5 field engineers (with qualification + years), 7 field supervisors, 4 office staff — all named in the profile.
- **26 machinery line items** and **9 scaffolding inventory line items** with quantities.
- **7 business credentials**: Trade Licence, PAN, GSTIN, EPF, ESIC, Labour Licence, MSME.
- **~367 embedded images**, including genuine site photographs (HP receiver at HCCB, bituminous roads at Belacoba and Shakoajhora, OHR at Grass More Tea Garden, G+3 apartments and G+1 villas at Lataguri, landscaping, river training, drainage/road works at Lataguri and Siliguri) with under-construction / ready-for-delivery pairs.

## Design direction

Institutional and engineering-led, not decorative. Deep charcoal base, off-white, concrete and steel greys, with a single restrained industrial accent (safety-amber tone) used only for emphasis and CTAs. Neo-grotesk typography with large structural headlines, wide letter-spaced labels, and a visible architectural grid. Motion is precise and minimal: scroll reveals, count-ups, hairline draw-ins. Full dark/light-safe semantic tokens in `src/styles.css` — no hardcoded colours.

Hero: cinematic full-bleed project imagery, "BUILDING WITH TRUST", "Construction. Infrastructure. Execution. Since 2010.", CTAs *Explore Our Projects* and *Start a Conversation*, subtle scroll indicator.

## Imagery

Real site photographs are extracted from the PDF, cleaned, deduped, mapped to their captioned projects, and uploaded as CDN assets with descriptive alt text. Generated architectural/abstract imagery is used only for hero backdrops, section dividers and capability tiles where the scanned photo quality is too low — never to imply a project or equipment the company doesn't have. Scans of work orders and certificates are not published.

## Pages

- **Home** — hero, verified proof strip (count-ups from real figures), who we are, capabilities, signature projects, equipment/workforce scale, clients, people, credentials, "Let's build what comes next."
- **About** — Our Story, Mission, Philosophy (Armstrong quote as stated inspiration, not slogan), Leadership.
- **Capabilities** — index plus a page per sector: Residential, Commercial & Institutional, Healthcare, Roads, Drainage, Water Infrastructure, Government, Industrial & Corporate, Material Supply, Area Development. Each pulls its own real projects.
- **Projects** — the core page. Filter by sector, status, location and client; card grid with name, client, location, sector, value, dates, status.
- **Project case study** — one per project, with hero, overview, client, scope, value, timeline, execution, equipment used, gallery, related projects. Fields absent from the PDF are simply omitted.
- **Timeline** — 2014 → ongoing progression.
- **Project map** — documented districts (Jalpaiguri, Lataguri, Siliguri, Dhupguri, Cooch Behar, Darjeeling, Tufanganj, Mal, Metiali, Holdibari) with project popovers at town level only.
- **People** — Management, Executive Team, Field Engineers, Field Supervisors, Office Staff; qualifications exactly as in the profile, no invented biographies.
- **Engineering Capability** — disciplines evidenced by the actual team.
- **Equipment** — all 26 items, grouped into earthmoving, concrete, surveying, roadwork, material handling, water, lifting, welding, site.
- **Scaffolding & Site Resources** — full owned inventory.
- **Quality & Execution** — "Precision on site. Accountability in every detail." Built around real QA/QC personnel and owned testing/survey equipment. No invented certifications.
- **Safety** and **Sustainability** — honest structural framing, current practices separated from stated future commitments; both fully CMS-editable.
- **Government & Public Infrastructure** and **Corporate & Industrial Projects** — dedicated portfolios.
- **Track Record** — the documented achievements, presented as evidence.
- **Clients & Partners** — documented organisations only, with the exact relationship type stated (service vendor / contractor / vendor).
- **Credentials** — the 7 registrations as status cards. Names, types and issuing authorities only; no scans, no document numbers.
- **Careers** — role families plus an open application form; no invented vacancies.
- **News & Updates** — empty, CMS-ready.
- **Contact** — full B2B enquiry form with file upload, click-to-call, WhatsApp, map, address.
- **Download Company Profile** — gated behind optional lead capture.
- Privacy, Terms, Disclaimer, 404.

## Backend (Lovable Cloud)

Enabled with an admin area so the company can update everything without code.

Tables: `projects`, `project_images`, `project_documents`, `clients`, `sectors`, `team_members`, `equipment`, `scaffolding_items`, `credentials`, `news_posts`, `job_openings`, `enquiries`, `job_applications`, `profile_downloads`, `site_settings`, `user_roles`.

- All PDF-verified content seeded via SQL migration, so the site is fully populated on first load.
- Public read only on published, non-sensitive rows; anonymous insert on enquiries/applications; every write and all admin reads gated by a separate `user_roles` table with a security-definer role check. No role on profiles.
- Enquiries, applications and uploaded documents are private — admin-only. Nothing containing third-party contact details, purchase-order terms or payment information is ever exposed publicly.
- Storage buckets for project images (public) and enquiry/application uploads (private).
- Admin at `/admin` behind login: CRUD for projects, images, team, equipment, credentials, news, vacancies, site settings, plus an enquiry inbox.

## Search, SEO, performance, accessibility

Global search across projects, locations, clients, sectors, services and people. Per-route metadata, clean slugged URLs, Organization + LocalBusiness + Project + BreadcrumbList + FAQ structured data, sitemap and robots. Local SEO targeted at Jalpaiguri, Siliguri, Lataguri and North Bengal only — no unsupported service areas. Responsive images with lazy loading, code splitting, route-level SSR. Mobile gets its own treatment: sticky call and enquiry bar, swipeable galleries, sheet-based filtering. WCAG-conscious: contrast, keyboard navigation, focus states, alt text, reduced-motion support.

## Technical notes

TanStack Start (React 19 + TypeScript) with file-based routing, Tailwind v4 tokens in `src/styles.css`, TanStack Query loaders, server functions for enquiries and admin mutations, and Zod validation plus rate limiting on public form endpoints. Reusable components: ProjectCard, ProjectHero, ProjectFilter, TeamMember, EquipmentCard, CredentialCard, ClientBadge, StatCounter, Gallery, Timeline, ContactForm, CTASection.

## Content validation

Every value, date, client and quantity is transcribed from the profile. Two figures in the source conflict (the Key Achievements page says Manipal Cancer Hospital is G+7 while the project table lists a G+3 oncology hospital at Rangapani); I'll publish the project-table figure and flag the item in the admin for company verification rather than silently picking one.
