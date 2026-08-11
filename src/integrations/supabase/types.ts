export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      clients: {
        Row: {
          category: string
          created_at: string
          display_order: number
          id: string
          name: string
          relationship: string | null
          slug: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          display_order?: number
          id?: string
          name: string
          relationship?: string | null
          slug: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          display_order?: number
          id?: string
          name?: string
          relationship?: string | null
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      credentials: {
        Row: {
          created_at: string
          display_order: number
          doc_type: string | null
          id: string
          issuing_authority: string | null
          name: string
          note: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          doc_type?: string | null
          id?: string
          issuing_authority?: string | null
          name: string
          note?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number
          doc_type?: string | null
          id?: string
          issuing_authority?: string | null
          name?: string
          note?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      enquiries: {
        Row: {
          attachment_path: string | null
          created_at: string
          email: string
          expected_start: string | null
          id: string
          message: string | null
          name: string
          organisation: string | null
          phone: string | null
          project_location: string | null
          project_scale: string | null
          project_type: string | null
          required_service: string | null
          status: string
        }
        Insert: {
          attachment_path?: string | null
          created_at?: string
          email: string
          expected_start?: string | null
          id?: string
          message?: string | null
          name: string
          organisation?: string | null
          phone?: string | null
          project_location?: string | null
          project_scale?: string | null
          project_type?: string | null
          required_service?: string | null
          status?: string
        }
        Update: {
          attachment_path?: string | null
          created_at?: string
          email?: string
          expected_start?: string | null
          id?: string
          message?: string | null
          name?: string
          organisation?: string | null
          phone?: string | null
          project_location?: string | null
          project_scale?: string | null
          project_type?: string | null
          required_service?: string | null
          status?: string
        }
        Relationships: []
      }
      equipment: {
        Row: {
          category: string
          created_at: string
          display_order: number
          id: string
          make: string | null
          name: string
          quantity: number | null
          specification: string | null
          unit: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          display_order?: number
          id?: string
          make?: string | null
          name: string
          quantity?: number | null
          specification?: string | null
          unit?: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          display_order?: number
          id?: string
          make?: string | null
          name?: string
          quantity?: number | null
          specification?: string | null
          unit?: string
          updated_at?: string
        }
        Relationships: []
      }
      job_applications: {
        Row: {
          created_at: string
          email: string
          experience: string | null
          id: string
          message: string | null
          name: string
          phone: string | null
          resume_path: string | null
          role_interest: string | null
          status: string
        }
        Insert: {
          created_at?: string
          email: string
          experience?: string | null
          id?: string
          message?: string | null
          name: string
          phone?: string | null
          resume_path?: string | null
          role_interest?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          email?: string
          experience?: string | null
          id?: string
          message?: string | null
          name?: string
          phone?: string | null
          resume_path?: string | null
          role_interest?: string | null
          status?: string
        }
        Relationships: []
      }
      job_openings: {
        Row: {
          active: boolean
          created_at: string
          department: string | null
          description: string | null
          employment_type: string | null
          id: string
          location: string | null
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          department?: string | null
          description?: string | null
          employment_type?: string | null
          id?: string
          location?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          department?: string | null
          description?: string | null
          employment_type?: string | null
          id?: string
          location?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      news_posts: {
        Row: {
          body: string | null
          category: string | null
          cover_url: string | null
          created_at: string
          excerpt: string | null
          id: string
          published: boolean
          published_at: string | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          body?: string | null
          category?: string | null
          cover_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published?: boolean
          published_at?: string | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          body?: string | null
          category?: string | null
          cover_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published?: boolean
          published_at?: string | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profile_downloads: {
        Row: {
          created_at: string
          email: string | null
          id: string
          name: string | null
          organisation: string | null
          phone: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          organisation?: string | null
          phone?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          organisation?: string | null
          phone?: string | null
        }
        Relationships: []
      }
      project_documents: {
        Row: {
          created_at: string
          doc_type: string | null
          id: string
          issued_on: string | null
          project_id: string | null
          storage_path: string | null
          title: string
        }
        Insert: {
          created_at?: string
          doc_type?: string | null
          id?: string
          issued_on?: string | null
          project_id?: string | null
          storage_path?: string | null
          title: string
        }
        Update: {
          created_at?: string
          doc_type?: string | null
          id?: string
          issued_on?: string | null
          project_id?: string | null
          storage_path?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_documents_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_images: {
        Row: {
          alt_text: string
          caption: string | null
          created_at: string
          display_order: number
          gallery_category: string | null
          id: string
          is_cover: boolean
          project_id: string | null
          url: string
        }
        Insert: {
          alt_text: string
          caption?: string | null
          created_at?: string
          display_order?: number
          gallery_category?: string | null
          id?: string
          is_cover?: boolean
          project_id?: string | null
          url: string
        }
        Update: {
          alt_text?: string
          caption?: string | null
          created_at?: string
          display_order?: number
          gallery_category?: string | null
          id?: string
          is_cover?: boolean
          project_id?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_images_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          client_name: string | null
          client_slug: string | null
          created_at: string
          description: string | null
          display_order: number
          district: string | null
          duration_note: string | null
          end_date: string | null
          featured: boolean
          id: string
          location: string | null
          name: string
          needs_verification: boolean
          ownership: string
          project_value: number | null
          published: boolean
          ref_no: number | null
          scope: string | null
          sector_slug: string
          slug: string
          start_date: string | null
          status: string
          updated_at: string
          verification_note: string | null
          work_type: string | null
        }
        Insert: {
          client_name?: string | null
          client_slug?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          district?: string | null
          duration_note?: string | null
          end_date?: string | null
          featured?: boolean
          id?: string
          location?: string | null
          name: string
          needs_verification?: boolean
          ownership?: string
          project_value?: number | null
          published?: boolean
          ref_no?: number | null
          scope?: string | null
          sector_slug: string
          slug: string
          start_date?: string | null
          status?: string
          updated_at?: string
          verification_note?: string | null
          work_type?: string | null
        }
        Update: {
          client_name?: string | null
          client_slug?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          district?: string | null
          duration_note?: string | null
          end_date?: string | null
          featured?: boolean
          id?: string
          location?: string | null
          name?: string
          needs_verification?: boolean
          ownership?: string
          project_value?: number | null
          published?: boolean
          ref_no?: number | null
          scope?: string | null
          sector_slug?: string
          slug?: string
          start_date?: string | null
          status?: string
          updated_at?: string
          verification_note?: string | null
          work_type?: string | null
        }
        Relationships: []
      }
      scaffolding_items: {
        Row: {
          created_at: string
          display_order: number
          id: string
          name: string
          quantity: number | null
          specification: string | null
          unit: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          name: string
          quantity?: number | null
          specification?: string | null
          unit?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          name?: string
          quantity?: number | null
          specification?: string | null
          unit?: string
          updated_at?: string
        }
        Relationships: []
      }
      sectors: {
        Row: {
          created_at: string
          description: string | null
          display_order: number
          headline: string | null
          id: string
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number
          headline?: string | null
          id?: string
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number
          headline?: string | null
          id?: string
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          label: string | null
          updated_at: string
          value: string | null
        }
        Insert: {
          key: string
          label?: string | null
          updated_at?: string
          value?: string | null
        }
        Update: {
          key?: string
          label?: string | null
          updated_at?: string
          value?: string | null
        }
        Relationships: []
      }
      team_members: {
        Row: {
          created_at: string
          discipline: string | null
          display_order: number
          experience: string | null
          id: string
          name: string
          qualification: string | null
          role: string | null
          team_group: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          discipline?: string | null
          display_order?: number
          experience?: string | null
          id?: string
          name: string
          qualification?: string | null
          role?: string | null
          team_group: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          discipline?: string | null
          display_order?: number
          experience?: string | null
          id?: string
          name?: string
          qualification?: string | null
          role?: string | null
          team_group?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "editor"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "editor"],
    },
  },
} as const
