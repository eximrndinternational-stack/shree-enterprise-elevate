import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Project = {
  id: string;
  ref_no: number | null;
  slug: string;
  name: string;
  client_name: string | null;
  client_slug: string | null;
  sector_slug: string;
  location: string | null;
  district: string | null;
  work_type: string | null;
  scope: string | null;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  duration_note: string | null;
  status: string;
  project_value: number | null;
  ownership: string;
  featured: boolean;
  needs_verification: boolean;
  verification_note: string | null;
  display_order: number;
};

export type ProjectImage = {
  id: string;
  project_id: string | null;
  url: string;
  alt_text: string;
  caption: string | null;
  gallery_category: string | null;
  is_cover: boolean;
  display_order: number;
};

export type Sector = {
  id: string;
  slug: string;
  name: string;
  headline: string | null;
  description: string | null;
  display_order: number;
};

function unwrap<T>(res: { data: T | null; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message);
  return (res.data ?? []) as T;
}

export const sectorsQuery = queryOptions({
  queryKey: ["sectors"],
  queryFn: async () =>
    unwrap<Sector[]>(await supabase.from("sectors").select("*").order("display_order")),
});

export const clientsQuery = queryOptions({
  queryKey: ["clients"],
  queryFn: async () =>
    unwrap<
      { id: string; slug: string; name: string; relationship: string | null; category: string }[]
    >(await supabase.from("clients").select("*").order("display_order")),
});

export const projectsQuery = queryOptions({
  queryKey: ["projects"],
  queryFn: async () =>
    unwrap<Project[]>(
      await supabase
        .from("projects")
        .select("*")
        .eq("published", true)
        .order("display_order", { ascending: false }),
    ),
});

export const projectImagesQuery = queryOptions({
  queryKey: ["project-images"],
  queryFn: async () =>
    unwrap<ProjectImage[]>(
      await supabase.from("project_images").select("*").order("display_order"),
    ),
});

export const projectDetailQuery = (slug: string) =>
  queryOptions({
    queryKey: ["project", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      if (error) throw new Error(error.message);
      if (!data) return null;
      const images = unwrap<ProjectImage[]>(
        await supabase
          .from("project_images")
          .select("*")
          .eq("project_id", (data as Project).id)
          .order("display_order"),
      );
      return { project: data as Project, images };
    },
  });

export const teamQuery = queryOptions({
  queryKey: ["team"],
  queryFn: async () =>
    unwrap<
      {
        id: string;
        name: string;
        role: string | null;
        team_group: string;
        qualification: string | null;
        experience: string | null;
        discipline: string | null;
        display_order: number;
      }[]
    >(await supabase.from("team_members").select("*").order("display_order")),
});

export const equipmentQuery = queryOptions({
  queryKey: ["equipment"],
  queryFn: async () =>
    unwrap<
      {
        id: string;
        name: string;
        make: string | null;
        specification: string | null;
        category: string;
        quantity: number | null;
        unit: string;
        display_order: number;
      }[]
    >(await supabase.from("equipment").select("*").order("display_order")),
});

export const scaffoldingQuery = queryOptions({
  queryKey: ["scaffolding"],
  queryFn: async () =>
    unwrap<
      {
        id: string;
        name: string;
        specification: string | null;
        quantity: number | null;
        unit: string;
      }[]
    >(await supabase.from("scaffolding_items").select("*").order("display_order")),
});

export const credentialsQuery = queryOptions({
  queryKey: ["credentials"],
  queryFn: async () =>
    unwrap<
      {
        id: string;
        name: string;
        doc_type: string | null;
        issuing_authority: string | null;
        status: string;
        note: string | null;
      }[]
    >(await supabase.from("credentials").select("*").order("display_order")),
});
