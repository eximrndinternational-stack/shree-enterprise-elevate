-- ============ ROLES ============
CREATE TYPE public.app_role AS ENUM ('admin', 'editor');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.has_role(auth.uid(), 'admin')
$$;

CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Admins read all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.is_admin());

CREATE OR REPLACE FUNCTION public.touch_updated_at() RETURNS trigger
LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- ============ SECTORS ============
CREATE TABLE public.sectors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  headline text,
  description text,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.sectors TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sectors TO authenticated;
GRANT ALL ON public.sectors TO service_role;
ALTER TABLE public.sectors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Sectors public read" ON public.sectors FOR SELECT USING (true);
CREATE POLICY "Sectors admin write" ON public.sectors FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER t_sectors_updated BEFORE UPDATE ON public.sectors FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ============ CLIENTS ============
CREATE TABLE public.clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  relationship text,
  category text NOT NULL DEFAULT 'private',
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.clients TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.clients TO authenticated;
GRANT ALL ON public.clients TO service_role;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Clients public read" ON public.clients FOR SELECT USING (true);
CREATE POLICY "Clients admin write" ON public.clients FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER t_clients_updated BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ============ PROJECTS ============
CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ref_no int,
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  client_name text,
  client_slug text,
  sector_slug text NOT NULL,
  location text,
  district text,
  work_type text,
  scope text,
  description text,
  start_date date,
  end_date date,
  duration_note text,
  status text NOT NULL DEFAULT 'completed',
  project_value numeric,
  ownership text NOT NULL DEFAULT 'private',
  featured boolean NOT NULL DEFAULT false,
  needs_verification boolean NOT NULL DEFAULT false,
  verification_note text,
  published boolean NOT NULL DEFAULT true,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.projects TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.projects TO authenticated;
GRANT ALL ON public.projects TO service_role;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Projects public read" ON public.projects FOR SELECT USING (published = true);
CREATE POLICY "Projects admin read" ON public.projects FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Projects admin write" ON public.projects FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER t_projects_updated BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ============ PROJECT IMAGES ============
CREATE TABLE public.project_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE,
  url text NOT NULL,
  alt_text text NOT NULL,
  caption text,
  gallery_category text,
  is_cover boolean NOT NULL DEFAULT false,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.project_images TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.project_images TO authenticated;
GRANT ALL ON public.project_images TO service_role;
ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Project images public read" ON public.project_images FOR SELECT USING (true);
CREATE POLICY "Project images admin write" ON public.project_images FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ============ PROJECT DOCUMENTS (admin only) ============
CREATE TABLE public.project_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE,
  title text NOT NULL,
  doc_type text,
  storage_path text,
  issued_on date,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.project_documents TO authenticated;
GRANT ALL ON public.project_documents TO service_role;
ALTER TABLE public.project_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Docs admin only" ON public.project_documents FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ============ TEAM ============
CREATE TABLE public.team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text,
  team_group text NOT NULL,
  qualification text,
  experience text,
  discipline text,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.team_members TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.team_members TO authenticated;
GRANT ALL ON public.team_members TO service_role;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Team public read" ON public.team_members FOR SELECT USING (true);
CREATE POLICY "Team admin write" ON public.team_members FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER t_team_updated BEFORE UPDATE ON public.team_members FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ============ EQUIPMENT ============
CREATE TABLE public.equipment (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  make text,
  specification text,
  category text NOT NULL,
  quantity numeric,
  unit text NOT NULL DEFAULT 'nos',
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.equipment TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.equipment TO authenticated;
GRANT ALL ON public.equipment TO service_role;
ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Equipment public read" ON public.equipment FOR SELECT USING (true);
CREATE POLICY "Equipment admin write" ON public.equipment FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER t_equipment_updated BEFORE UPDATE ON public.equipment FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ============ SCAFFOLDING ============
CREATE TABLE public.scaffolding_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  specification text,
  quantity numeric,
  unit text NOT NULL DEFAULT 'pcs',
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.scaffolding_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.scaffolding_items TO authenticated;
GRANT ALL ON public.scaffolding_items TO service_role;
ALTER TABLE public.scaffolding_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Scaffolding public read" ON public.scaffolding_items FOR SELECT USING (true);
CREATE POLICY "Scaffolding admin write" ON public.scaffolding_items FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ============ CREDENTIALS ============
CREATE TABLE public.credentials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  doc_type text,
  issuing_authority text,
  status text NOT NULL DEFAULT 'Held on record',
  note text,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.credentials TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.credentials TO authenticated;
GRANT ALL ON public.credentials TO service_role;
ALTER TABLE public.credentials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Credentials public read" ON public.credentials FOR SELECT USING (true);
CREATE POLICY "Credentials admin write" ON public.credentials FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ============ NEWS ============
CREATE TABLE public.news_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  category text,
  excerpt text,
  body text,
  cover_url text,
  published boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.news_posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.news_posts TO authenticated;
GRANT ALL ON public.news_posts TO service_role;
ALTER TABLE public.news_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "News public read" ON public.news_posts FOR SELECT USING (published = true);
CREATE POLICY "News admin read" ON public.news_posts FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "News admin write" ON public.news_posts FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER t_news_updated BEFORE UPDATE ON public.news_posts FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ============ JOB OPENINGS ============
CREATE TABLE public.job_openings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  department text,
  location text,
  employment_type text,
  description text,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.job_openings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.job_openings TO authenticated;
GRANT ALL ON public.job_openings TO service_role;
ALTER TABLE public.job_openings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Jobs public read" ON public.job_openings FOR SELECT USING (active = true);
CREATE POLICY "Jobs admin write" ON public.job_openings FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ============ ENQUIRIES ============
CREATE TABLE public.enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  organisation text,
  email text NOT NULL,
  phone text,
  project_type text,
  project_location text,
  project_scale text,
  required_service text,
  expected_start text,
  message text,
  attachment_path text,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.enquiries TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.enquiries TO authenticated;
GRANT ALL ON public.enquiries TO service_role;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit enquiry" ON public.enquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Enquiries admin read" ON public.enquiries FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Enquiries admin update" ON public.enquiries FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Enquiries admin delete" ON public.enquiries FOR DELETE TO authenticated USING (public.is_admin());

-- ============ JOB APPLICATIONS ============
CREATE TABLE public.job_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  role_interest text,
  experience text,
  message text,
  resume_path text,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.job_applications TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.job_applications TO authenticated;
GRANT ALL ON public.job_applications TO service_role;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can apply" ON public.job_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Applications admin read" ON public.job_applications FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Applications admin update" ON public.job_applications FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Applications admin delete" ON public.job_applications FOR DELETE TO authenticated USING (public.is_admin());

-- ============ PROFILE DOWNLOADS ============
CREATE TABLE public.profile_downloads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  email text,
  organisation text,
  phone text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.profile_downloads TO anon;
GRANT SELECT, INSERT ON public.profile_downloads TO authenticated;
GRANT ALL ON public.profile_downloads TO service_role;
ALTER TABLE public.profile_downloads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can request profile" ON public.profile_downloads FOR INSERT WITH CHECK (true);
CREATE POLICY "Downloads admin read" ON public.profile_downloads FOR SELECT TO authenticated USING (public.is_admin());

-- ============ SITE SETTINGS ============
CREATE TABLE public.site_settings (
  key text PRIMARY KEY,
  value text,
  label text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Settings public read" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Settings admin write" ON public.site_settings FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ============================================================
-- SEED DATA (verified from the company profile)
-- ============================================================
INSERT INTO public.sectors (slug, name, headline, description, display_order) VALUES
('residential','Residential Construction','Apartments, villas and residential complexes','G+4 apartment blocks, G+1 duplex villas and multi-building residential complexes delivered for corporate developers and private promoter groups.',1),
('commercial-institutional','Commercial & Institutional','Institutional buildings and site facilities','College buildings, site laboratories, cement godowns, water vats and associated institutional civil works.',2),
('healthcare','Healthcare Construction','Hospital and healthcare facilities','Hospital construction and healthcare-related civil and structural works in North Bengal.',3),
('roads','Roads & Transportation','Bituminous, CC and paver-block roads','PMGSY and Zilla Parishad bituminous roads, CC roads, WBM improvement, paver-block roads and road maintenance.',4),
('drainage','Drainage & Civil Infrastructure','Drains, culverts and guard walls','Roadside drains, HP culverts, guard walls, pathways and associated civil infrastructure.',5),
('water','Water Infrastructure','Pipelines, reservoirs and borewells','PHE water pipelines with overhead reservoirs, solar-powered spot water sources and borewell installation.',6),
('government','Government Works','Public infrastructure for state departments','Projects executed for N.B.D.D, WBSRDA, PHE, Jalpaiguri Zilla Parishad, MGNREGS, Gram Panchayats and Block offices.',7),
('industrial','Industrial & Corporate','Civil works inside operating plants','Reservoir tanks, CC roads and drains executed inside the Hindustan Coca-Cola Beverages facility at Raninagar.',8),
('material-supply','Material Supply','Bulk construction material supply','Supply of sand, aggregate, bricks, GSB, rubble and Pakur chips to major project sites.',9),
('area-development','Area Development','Township-scale site infrastructure','Drainage, internal roads, landscaping, river training and boundary walls for large residential developments.',10);

INSERT INTO public.clients (slug, name, relationship, category, display_order) VALUES
('ambuja-neotia','Ambuja Neotia Group','Contractor for the Vanya Awas development at Lataguri and Utshadhara at Siliguri','private',1),
('shapoorji-pallonji','Shapoorji Pallonji And Company Limited','Successful service vendor','private',2),
('jmc-projects','JMC Projects (India) Ltd.','Successful vendor — Coca-Cola factory at Raninagar','private',3),
('hccb','Hindustan Coca-Cola Beverages Ltd.','Successful service vendor','corporate',4),
('manipal-hospital','Manipal Hospital','Contractor for the G+3 oncology hospital at Rangapani','corporate',5),
('medica-north-bengal','Medica North Bengal Clinic','Successful service vendor','corporate',6),
('govt-wb','Government of West Bengal','Successful contractor','government',7),
('nbdd','N.B.D.D','Executing contractor','government',8),
('wbsrda','WBSRDA','Executing contractor for PMGSY road works','government',9),
('phe-jalpaiguri','P.H. Engineering, Jalpaiguri Division','Executing contractor for water infrastructure','government',10),
('jalpaiguri-zilla-parishad','Jalpaiguri Zilla Parishad','Executing contractor for roads and drainage','government',11),
('mgnrega','MGNREGS','Executing contractor','government',12),
('private-promoter','Private Promoter Groups','Contractor for residential complexes in Jalpaiguri','private',13);

INSERT INTO public.projects (ref_no, slug, name, client_name, client_slug, sector_slug, location, district, work_type, scope, start_date, end_date, duration_note, status, project_value, ownership, featured, display_order) VALUES
(1,'borewell-jalpaiguri-super-speciality','Fixing of Borewell','Shapoorji Pallonji And Company Limited','shapoorji-pallonji','water','Jalpaiguri Super Speciality Hospital','Jalpaiguri','Fixing of Borewell','Fixing of borewell at the Jalpaiguri Super Speciality Hospital site.','2014-07-23','2014-08-03',NULL,'completed',240000,'private',false,1),
(2,'site-buildings-jalpaiguri-super-speciality','Site Building Work — Cement Godown, Laboratory, Water Vat','Shapoorji Pallonji And Company Limited','shapoorji-pallonji','commercial-institutional','Jalpaiguri Super Speciality Hospital','Jalpaiguri','Cement Godown, Lab, Water Vat','Construction of cement godown, site laboratory and water vat.','2014-08-04','2014-09-19',NULL,'completed',568384,'private',false,2),
(3,'bulk-material-supply-jssh','Supply of Bulk Materials — Sand, Aggregate, Bricks, GSB, Rubble, Pakur Chips','Shapoorji Pallonji And Company Limited','shapoorji-pallonji','material-supply','Jalpaiguri Super Speciality Hospital','Jalpaiguri','Supply of Bulk Materials','Supply of bulk construction materials viz. sand, aggregate, bricks, GSB, rubble and Pakur chips over the construction period.','2014-01-01','2016-07-08',NULL,'completed',25708722,'private',true,3),
(4,'netaji-subhash-mahabidyalya-holdibari','Construction of College — Netaji Subhash Mahabidyalya','N.B.D.D','nbdd','commercial-institutional','Netaji Subhash Mahabidyalya, Holdibari','Cooch Behar','Building','Construction of the college building.','2014-11-13','2016-09-16',NULL,'completed',23184667,'government',true,4),
(5,'bituminous-road-sakoajhora','Construction of Bituminous Road — Sakoajhora-I GP','Sakoajhora-I GP, Dist. Jalpaiguri','govt-wb','roads','Sakoajhora-I GP, Dhupguri','Jalpaiguri','Construction of Bituminous Road','Construction of bituminous road under Sakoajhora-I Gram Panchayat.','2016-04-11','2016-11-14',NULL,'completed',3517864,'government',false,5),
(6,'phe-pipeline-ohr-boxirhat','PHE Water Pipe Line with Overhead Reservoir — Boxirhat Zone 1 & 2','N.B.D.D','nbdd','water','Boxirhat Zone 1 & 2, Tufanganj Block','Cooch Behar','Over Head Reservoir','Water pipeline network with overhead reservoir for Boxirhat zones 1 and 2.','2016-11-24','2018-02-05',NULL,'completed',25801829,'government',true,6),
(7,'solar-spot-water-sources-darjeeling','Installation of Spot Water Sources with Solar Powered Dual Pump and Service Tank','N.B.D.D','nbdd','water','Darjeeling District — tribal area upliftment','Darjeeling','Installation of spot water sources with solar power dual pump and service Tank','Installation of spot water sources with solar-powered dual pumps and service tanks for the upliftment of tribal areas.','2019-01-17','2019-05-02',NULL,'completed',3854926,'government',false,7),
(8,'community-hall-garalbari','Construction of Community Hall — Garalbari GP','Office of the BDO, Sadar Block','govt-wb','government','Garalbari G.P., Sadar Block, Jalpaiguri','Jalpaiguri','Building','Construction of a community hall under Garalbari Gram Panchayat.','2019-02-07','2020-02-27',NULL,'completed',6746803,'government',false,8),
(9,'pmgsy-road-mal','PMGSY Bituminous Road — Maintenance, Mal Block','WBSRDA','wbsrda','roads','Block-Mal','Jalpaiguri','Maintenance of Bituminous Road','Maintenance of a PMGSY bituminous road in Mal Block.','2020-06-22','2020-11-20',NULL,'completed',3549468,'government',false,9),
(10,'bituminous-road-belacoba','Improvement of WBM Road to Bituminous Road — Belacoba GP','Office of the Belacoba Gram Panchayat','govt-wb','roads','Bakul Roy House to Pucca Road, Booth No 18/229, Belacoba GP','Jalpaiguri','Improvement of WBM road to bituminous road','Improvement of an existing WBM road to a bituminous road.','2020-03-13','2020-07-13',NULL,'completed',1119808,'government',true,10),
(11,'phe-pipeline-ohr-grass-more','PHE Water Pipe Line with Overhead Reservoir — Grass More Tea Garden','P.H. Engineering, Jalpaiguri Division','phe-jalpaiguri','water','Grass More T.G.','Jalpaiguri','Over Head Reservoir','Water pipeline with overhead reservoir serving Grass More Tea Garden.','2019-09-16','2021-01-15',NULL,'completed',9050019,'government',true,11),
(12,'bituminous-road-drain-chowrangi','Construction of Bituminous Road with Drain — Chowrangi More','Jalpaiguri Zilla Parishad','jalpaiguri-zilla-parishad','roads','Chowrangi More to House of Baidya Paul','Jalpaiguri','Construction Bituminous Road With Drain','Construction of bituminous road with roadside drain.','2020-11-05','2021-11-09',NULL,'completed',2370928,'government',false,12),
(13,'cc-road-hp-culvert-mohit-nagar','Construction of CC Road with 2 nos 600mm dia HP Culvert — Mohit Nagar','Jalpaiguri Zilla Parishad','jalpaiguri-zilla-parishad','drainage','Mohit Nagar Colony, Sadar P.S.','Jalpaiguri','HP Culvert','CC road with two 600mm diameter HP culverts.','2020-11-05','2021-11-09',NULL,'completed',2406163,'government',false,13),
(14,'cc-road-guard-wall-mohit-nagar','Construction of CC Road with Guard Wall — Mohit Nagar','Jalpaiguri Zilla Parishad','jalpaiguri-zilla-parishad','roads','Mohit Nagar Colony, Sadar P.S.','Jalpaiguri','Construction of CC Road with Guard Wall','CC road construction with guard wall.','2020-11-05','2021-11-09',NULL,'completed',2406163,'government',false,14),
(15,'bituminous-road-drain-guard-wall-mohit-nagar-1','Construction of Bituminous Road with Drain & Guard Wall — Mohit Nagar','Jalpaiguri Zilla Parishad','jalpaiguri-zilla-parishad','roads','Mohit Nagar Colony, Sadar P.S.','Jalpaiguri','Construction Bituminous Road With Drain','Bituminous road with drain and guard wall.','2020-11-05','2021-11-09',NULL,'completed',2496976,'government',false,15),
(16,'bituminous-road-drain-guard-wall-mohit-nagar-2','Construction of Bituminous Road with Drain & Guard Wall — Mohit Nagar (Package 2)','Jalpaiguri Zilla Parishad','jalpaiguri-zilla-parishad','roads','Mohit Nagar Colony, Sadar P.S.','Jalpaiguri','Construction Bituminous Road With Drain','Bituminous road with drain and guard wall.','2020-11-05','2021-11-09',NULL,'completed',2529095,'government',false,16),
(17,'bulk-material-supply-hccb-raninagar','Supply of Bulk Materials — Hindustan Coca-Cola Beverages, Raninagar','JMC Projects (India) Ltd.','jmc-projects','material-supply','Hindustan Coca-Cola Beverages Pvt. Ltd., Raninagar','Jalpaiguri','Supply of Bulk Materials viz. Sand, Aggregate, Bricks, GSB, Rubble','Supply of bulk materials — sand, aggregate, bricks, GSB and rubble — for the Coca-Cola factory at Raninagar.',NULL,'2022-08-01','June 2019 to 01/08/2022','completed',187564738,'corporate',true,17),
(18,'cc-road-barapatia','CC Road — Barapatia Notun Bos GP','MGNREGS','mgnrega','roads','Barapatia Notun Bos G.P., Sadar Block','Jalpaiguri','CC Road','Construction of CC road under MGNREGS.','2021-01-08','2021-05-12',NULL,'completed',7070442,'government',false,18),
(19,'pmgsy-road-metiali','PMGSY Bituminous Road — Metiali Block','WBSRDA','wbsrda','roads','Metiali Block','Jalpaiguri','Bituminous Road','PMGSY bituminous road construction in Metiali Block.','2021-02-01','2021-10-09',NULL,'completed',14193972,'government',true,19),
(20,'bituminous-road-gander-more','Construction of Bituminous Road — Gander More','Jalpaiguri Zilla Parishad','jalpaiguri-zilla-parishad','roads','Gander More','Jalpaiguri','Construction Bituminous Road','Construction of bituminous road at Gander More.',NULL,'2022-09-15','09/0/2022 to 15/09/2022','completed',2618316,'government',false,20),
(21,'hp-receiver-ammonia-tank-hccb','HP Receiver (Ammonia Tank) — HCCBL Raninagar','Hindustan Coca-Cola Beverage Ltd.','hccb','industrial','HCCBL, Raninagar','Jalpaiguri','Reservoir Tank','Construction of HP receiver (ammonia tank) reservoir structure inside the HCCB plant.','2022-08-05','2022-10-22',NULL,'completed',2125789,'corporate',true,21),
(22,'g4-apartment-ukil-para','G+4 Apartment with 16 Flats — Ukil Para','Private Promoter Group','private-promoter','residential','Ukil Para','Jalpaiguri','Residential Complex','Construction of a G+4 residential apartment building with 16 flats.','2020-03-05','2021-07-11',NULL,'completed',25600000,'private',false,22),
(23,'g4-apartment-mohanta-para','G+4 Apartment with 16 Flats — Mohanta Para','Private Promoter Group','private-promoter','residential','Mohanta Para','Jalpaiguri','Residential Complex','Construction of a G+4 residential apartment building with 16 flats.','2020-08-05','2022-03-11',NULL,'completed',25643000,'private',false,23),
(24,'marketing-office-lataguri','Marketing Office, Temporary Road, Boundary Wall & Misc. Work — Lataguri','Ambuja Neotia Group','ambuja-neotia','area-development','Lataguri','Jalpaiguri','Construction Marketing Office, Temporary Road, Boundary wall & misc work','Marketing office, temporary access road, boundary wall and miscellaneous enabling works for the Vanya Awas development.','2022-03-25',NULL,'25/03/2022 to continue','ongoing',11185236,'private',false,24),
(25,'paver-road-utshadhara-siliguri','Road with Paver Block at EWS & Utshadhara — Noukaghat','Ambuja Neotia Group','ambuja-neotia','roads','Noukaghat, Siliguri','Darjeeling','Construction of Road with paver block','Construction of paver-block roads across the EWS and Utshadhara areas.','2021-06-05',NULL,'05/06/2021 to continue','ongoing',54853197,'private',true,25),
(26,'g4-apartment-desbandhu-para','G+4 Apartment with 16 Flats — Desbandhu Para','Private Promoter Group','private-promoter','residential','Desbandhu Para','Jalpaiguri','Residential Complex','Construction of a G+4 residential apartment building with 16 flats.','2021-08-08','2023-07-18',NULL,'completed',29920000,'private',false,26),
(27,'g4-apartment-ukil-para-2','G+4 Apartment with 16 Flats — Ukil Para (Second Block)','Private Promoter Group','private-promoter','residential','Ukil Para','Jalpaiguri','Residential Complex','Construction of a G+4 residential apartment building with 16 flats.','2022-02-05','2024-05-17',NULL,'completed',26287000,'private',false,27),
(28,'cc-road-drain-hccb','CC Road and Drain at HCCB — Raninagar','Hindustan Coca-Cola Beverage Ltd.','hccb','industrial','HCCBL, Raninagar','Jalpaiguri','Construction of CC Road and Drain at HCCB','Construction of CC roads and drains inside the HCCB plant premises.','2022-10-12','2023-05-23',NULL,'completed',4558092,'corporate',true,28),
(29,'vanya-awas-apartments-lataguri','5 nos G+4 Apartments with 51 Flats Each — Vanya Awas, Lataguri','Ambuja Neotia Group','ambuja-neotia','residential','Lataguri','Jalpaiguri','Residential Complex','Construction of five G+4 apartment buildings with 51 flats in each block for the Vanya Awas development.','2023-01-01','2024-07-19',NULL,'completed',157267249,'private',true,29),
(30,'vanya-awas-villas-lataguri','30 nos G+1 Duplex Villas — Vanya Awas, Lataguri','Ambuja Neotia Group','ambuja-neotia','residential','Lataguri','Jalpaiguri','Residential Complex','Construction of thirty G+1 duplex villas for the Vanya Awas development.','2023-01-01','2025-05-28',NULL,'completed',85463276,'private',true,30),
(31,'vanya-awas-area-development-lataguri','Area Development — Vanya Awas, Lataguri','Ambuja Neotia Group','ambuja-neotia','area-development','Lataguri','Jalpaiguri','Drainage, Road works, Landscaping, River training, Boundary wall','Township-scale area development covering drainage, internal road works, landscaping, river training and boundary walls.','2023-01-01',NULL,'01/01/2023 to Ongoing','ongoing',44248778,'private',true,31),
(32,'oncology-hospital-rangapani','G+3 Oncology Hospital — Rangapani','Manipal Hospital','manipal-hospital','healthcare','Rangapani, Siliguri','Darjeeling','Oncology Hospital','Construction of a G+3 oncology hospital at Rangapani, Siliguri.','2025-03-01',NULL,'01/03/2025 to Ongoing','ongoing',50118062,'corporate',true,32);

UPDATE public.projects SET needs_verification = true,
  verification_note = 'The Key Achievements page of the company profile describes this as "Manipal Cancer Hospital G+7"; the project schedule records a G+3 oncology hospital at Rangapani. Published figures follow the project schedule. To be confirmed by the company.'
WHERE slug = 'oncology-hospital-rangapani';

-- ============ PROJECT IMAGES (real photographs from the company profile) ============
INSERT INTO public.project_images (project_id, url, alt_text, caption, gallery_category, is_cover, display_order)
SELECT p.id, v.url, v.alt_text, v.caption, v.cat, v.cover, v.ord FROM (VALUES
('hp-receiver-ammonia-tank-hccb','/__l5e/assets-v1/78ab4e97-84d4-45f9-a8c1-1b0f38fa8b1f/hccb-hp-receiver-1.jpg','HP receiver ammonia tank structure under construction at the Hindustan Coca-Cola Beverages plant, Raninagar, Jalpaiguri','HP receiver at HCCB, Raninagar, Jalpaiguri','Industrial',true,1)
) AS v(slug,url,alt_text,caption,cat,cover,ord) JOIN public.projects p ON p.slug = v.slug;

INSERT INTO public.site_settings (key, value, label) VALUES
('company_name','SHREE ENTERPRISE','Company name'),
('tagline','Building with Trust','Tagline'),
('since','2010','Established year'),
('address_line1','Dreamland, Pabitra Para','Address line 1'),
('address_line2','PO & Dist. Jalpaiguri, West Bengal – 735101, India','Address line 2'),
('phone_primary','9800045678','Primary phone'),
('phone_secondary','9832045678','Secondary phone'),
('email','shreeenterpriseof2010@gmail.com','Email'),
('whatsapp','9800045678','WhatsApp number'),
('founders','Mr. Sankha Pani Das and Mrs. Chumki Basu Das','Founders'),
('safety_statement','To be updated','Safety policy statement'),
('sustainability_statement','To be updated','Sustainability statement');

-- ============ TEAM ============
INSERT INTO public.team_members (name, role, team_group, qualification, experience, discipline, display_order) VALUES
('Sankha Pani Das','Partner','management',NULL,NULL,NULL,1),
('Saswata Mukherjee','Partner','management',NULL,NULL,NULL,2),
('Pulak Sanyal','Project-In-Charge','executive',NULL,NULL,'Project Management',1),
('Sanjay Ghosh','Technical Head','executive','Diploma (Civil)',NULL,'Civil Engineering',2),
('Rajdeep Das','Admin, Billing & Procurement Manager','executive','B.Tech (Civil)',NULL,'Procurement & Administration',3),
('Rathindra Nath Roy','Engineer-In-Charge — Civil','field_engineer','Diploma (Civil)','6+ years','Civil Engineering',1),
('Ranjit Kundu','QA & QC','field_engineer','B.Tech (Civil)','6+ years','Quality Assurance & Control',2),
('Rajesh Sarkar','Engineer-In-Charge — Electrical','field_engineer','Diploma (Electrical)','5+ years','Electrical Engineering',3),
('Raju Paul','Junior Engineer — Civil','field_engineer','B.Tech (Civil)','3+ years','Site Engineering',4),
('Prodeep Ghosh','Junior Engineer — Civil','field_engineer','B.Tech (Civil)','1+ years','Site Engineering',5),
('Debashis Sarkar','Field Supervisor','field_supervisor',NULL,NULL,'Site Supervision',1),
('Barun Dutta','Field Supervisor','field_supervisor',NULL,NULL,'Site Supervision',2),
('Partha Dey','Field Supervisor','field_supervisor',NULL,NULL,'Site Supervision',3),
('Ajiy Narayan','Field Supervisor','field_supervisor',NULL,NULL,'Site Supervision',4),
('Sujoy Ganguly','Field Supervisor','field_supervisor',NULL,NULL,'Site Supervision',5),
('Utpal Roy','Field Supervisor','field_supervisor',NULL,NULL,'Site Supervision',6),
('Arindam Paul','Field Supervisor','field_supervisor',NULL,NULL,'Site Supervision',7),
('Samir Basak','IT Manager','office',NULL,NULL,'Administration',1),
('Animesh Chakraborty','Accounts Manager','office',NULL,NULL,'Accounts',2),
('Pralay Adhikary','Store Manager','office',NULL,NULL,'Stores',3),
('Tapas Kr. Dey','Office Assistant','office',NULL,NULL,'Administration',4);

-- ============ EQUIPMENT ============
INSERT INTO public.equipment (name, make, specification, category, quantity, unit, display_order) VALUES
('Backhoe Loader','JCB',NULL,'earthmoving',3,'nos',1),
('Poklen',NULL,NULL,'earthmoving',3,'nos',2),
('Dumper',NULL,NULL,'earthmoving',2,'nos',3),
('Mixture Machine','JP 1050',NULL,'concrete',2,'nos',4),
('Vibrator Machine',NULL,NULL,'concrete',24,'nos',5),
('Vibrator Nozzle 60mm dia',NULL,'60mm diameter','concrete',50,'nos',6),
('Vibrator Nozzle 40mm dia',NULL,'40mm diameter','concrete',50,'nos',7),
('Pressure Pump','Putzmeister','Model 1404','concrete',1,'no',8),
('Concrete Pipe',NULL,NULL,'concrete',100,'metres',9),
('Concrete Carrier',NULL,NULL,'concrete',2,'nos',10),
('Total Station',NULL,NULL,'surveying',1,'no',11),
('Auto Level',NULL,NULL,'surveying',3,'nos',12),
('Laser Layout Machine','Hilti',NULL,'surveying',2,'nos',13),
('Concrete Cube Mould',NULL,NULL,'testing',30,'nos',14),
('Slump Cone & Accessories',NULL,NULL,'testing',2,'sets',15),
('Roller',NULL,NULL,'roadwork',1,'no',16),
('Vibratory Roller','Volvo',NULL,'roadwork',1,'no',17),
('Tractor with Trolley',NULL,NULL,'material-handling',5,'nos',18),
('Pick-up Van','Mahindra',NULL,'material-handling',1,'no',19),
('Material Lifting Machine',NULL,NULL,'material-handling',NULL,'nos',20),
('Farana Crane',NULL,'22 ton capacity','lifting',1,'no',21),
('Water Pump',NULL,NULL,'water',5,'nos',22),
('Tulu Pump',NULL,NULL,'water',5,'nos',23),
('Water Tanker',NULL,'12,000 litres','water',1,'no',24),
('Rod Cutting Machine',NULL,NULL,'site',15,'nos',25),
('Welding Machine',NULL,NULL,'welding',7,'nos',26);

-- ============ SCAFFOLDING ============
INSERT INTO public.scaffolding_items (name, specification, quantity, unit, display_order) VALUES
('Adjustable Pipe Prop','60.3 mm OD MS Black Pipe ERW "Med" ISI marked coil pipe, 150x150x5mm top and bottom M.S. plate, malleable C.I. nut (IS 1239/1161)',1000,'pcs',1),
('Adjustable Span (M.S. Beam)','14 SWG (2mm) M.S. sheet, 10mm M.S. round, 14mm dia M.S. round or 65x6m and 50x6m M.S. flat, 40x40x6mm tee, 75x75x6mm M.S. angle',600,'pcs',2),
('U Head',NULL,2200,'pcs',3),
('Scaffolding MS Pipe','40mm dia, 6m each',2000,'pcs',4),
('Joint Pin','260mm',300,'pcs',5),
('Cuplock Horizontal','1.8 m',3500,'pcs',6),
('Cuplock Horizontal','1.2 m',2000,'pcs',7),
('Cuplock Vertical','2.5 m',300,'pcs',8),
('Shuttering Ply',NULL,30000,'sq. ft.',9);

-- ============ CREDENTIALS ============
INSERT INTO public.credentials (name, doc_type, issuing_authority, status, note, display_order) VALUES
('Trade Licence','Statutory business licence','Local municipal authority','Held on record','Verified copy available on request.',1),
('PAN Card','Tax registration','Income Tax Department, Government of India','Held on record','Verified copy available on request.',2),
('GSTIN Certificate','Tax registration','Goods and Services Tax Department','Held on record','Verified copy available on request.',3),
('Employees Provident Fund Registration','Labour compliance','Employees Provident Fund Organisation','Held on record','Verified copy available on request.',4),
('ESIC Certificate','Labour compliance','Employees State Insurance Corporation','Held on record','Verified copy available on request.',5),
('Labour Licence','Labour compliance','Office of the Labour Commissioner','Held on record','Verified copy available on request.',6),
('MSME Registration Certificate','Enterprise registration','Ministry of Micro, Small and Medium Enterprises','Held on record','Verified copy available on request.',7);