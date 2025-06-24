export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      group_projects: {
        Row: {
          circle_day: string | null
          circle_frequency: string | null
          circle_time_local: string | null
          circle_time_zone: string | null
          circle_topics_of_interest: string[] | null
          co_uid: string | null
          created_at: string
          description: string
          group_size: string | null
          hackathon_estimated_effort: string | null
          hackathon_skills_needed: string[] | null
          hackathon_start_date: string | null
          job_chat_teams_url: string | null
          job_function_chat_audience: Json | null
          luma_link: string | null
          meetup_duration_minutes: number | null
          meetup_start_time_local: string | null
          meetup_time_zone: string | null
          project_id: string
          status: string | null
          title: string
          type: string | null
          uid: string | null
          updated_at: string
        }
        Insert: {
          circle_day?: string | null
          circle_frequency?: string | null
          circle_time_local?: string | null
          circle_time_zone?: string | null
          circle_topics_of_interest?: string[] | null
          co_uid?: string | null
          created_at?: string
          description: string
          group_size?: string | null
          hackathon_estimated_effort?: string | null
          hackathon_skills_needed?: string[] | null
          hackathon_start_date?: string | null
          job_chat_teams_url?: string | null
          job_function_chat_audience?: Json | null
          luma_link?: string | null
          meetup_duration_minutes?: number | null
          meetup_start_time_local?: string | null
          meetup_time_zone?: string | null
          project_id?: string
          status?: string | null
          title: string
          type?: string | null
          uid?: string | null
          updated_at?: string
        }
        Update: {
          circle_day?: string | null
          circle_frequency?: string | null
          circle_time_local?: string | null
          circle_time_zone?: string | null
          circle_topics_of_interest?: string[] | null
          co_uid?: string | null
          created_at?: string
          description?: string
          group_size?: string | null
          hackathon_estimated_effort?: string | null
          hackathon_skills_needed?: string[] | null
          hackathon_start_date?: string | null
          job_chat_teams_url?: string | null
          job_function_chat_audience?: Json | null
          luma_link?: string | null
          meetup_duration_minutes?: number | null
          meetup_start_time_local?: string | null
          meetup_time_zone?: string | null
          project_id?: string
          status?: string | null
          title?: string
          type?: string | null
          uid?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      kudos: {
        Row: {
          id: string
          message: string | null
          nominator_id: string
          nominee_id: string
          reason: string | null
          week: string | null
        }
        Insert: {
          id?: string
          message?: string | null
          nominator_id: string
          nominee_id: string
          reason?: string | null
          week?: string | null
        }
        Update: {
          id?: string
          message?: string | null
          nominator_id?: string
          nominee_id?: string
          reason?: string | null
          week?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kudos_nominator_id_fkey"
            columns: ["nominator_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kudos_nominee_id_fkey"
            columns: ["nominee_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      leaderboard: {
        Row: {
          badges: string[] | null
          id: string
          points: number | null
          user_id: string
        }
        Insert: {
          badges?: string[] | null
          id?: string
          points?: number | null
          user_id: string
        }
        Update: {
          badges?: string[] | null
          id?: string
          points?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "leaderboard_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          collab_interest: string | null
          directory_optin: boolean | null
          id: string
          job_function: string
          job_search_status: string | null
          job_title: string
          linkedin_url: string | null
          location: string | null
          offerings: string[] | null
          technical_tags: string[] | null
          user_id: string
        }
        Insert: {
          collab_interest?: string | null
          directory_optin?: boolean | null
          id?: string
          job_function: string
          job_search_status?: string | null
          job_title: string
          linkedin_url?: string | null
          location?: string | null
          offerings?: string[] | null
          technical_tags?: string[] | null
          user_id: string
        }
        Update: {
          collab_interest?: string | null
          directory_optin?: boolean | null
          id?: string
          job_function?: string
          job_search_status?: string | null
          job_title?: string
          linkedin_url?: string | null
          location?: string | null
          offerings?: string[] | null
          technical_tags?: string[] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      project_submissions: {
        Row: {
          cohort: string | null
          consent: boolean
          created_at: string
          description: string | null
          industry_tags: string[] | null
          linkedin_url: string | null
          nominated: boolean
          nominated_by: string | null
          nomination_timestamp: string | null
          owner_display_name: string
          points_earned: number
          project_id: string
          project_link: string | null
          project_title: string
          project_week: number | null
          reflection: string | null
          resources: string | null
          skills_used: string[] | null
          smpost_url: string | null
          submitted_at: string | null
          thumbnail_url: string | null
          tools_used: string[] | null
          uid: string
          updated_at: string
          upvoted_at: string | null
        }
        Insert: {
          cohort?: string | null
          consent?: boolean
          created_at?: string
          description?: string | null
          industry_tags?: string[] | null
          linkedin_url?: string | null
          nominated?: boolean
          nominated_by?: string | null
          nomination_timestamp?: string | null
          owner_display_name: string
          points_earned?: number
          project_id?: string
          project_link?: string | null
          project_title: string
          project_week?: number | null
          reflection?: string | null
          resources?: string | null
          skills_used?: string[] | null
          smpost_url?: string | null
          submitted_at?: string | null
          thumbnail_url?: string | null
          tools_used?: string[] | null
          uid: string
          updated_at?: string
          upvoted_at?: string | null
        }
        Update: {
          cohort?: string | null
          consent?: boolean
          created_at?: string
          description?: string | null
          industry_tags?: string[] | null
          linkedin_url?: string | null
          nominated?: boolean
          nominated_by?: string | null
          nomination_timestamp?: string | null
          owner_display_name?: string
          points_earned?: number
          project_id?: string
          project_link?: string | null
          project_title?: string
          project_week?: number | null
          reflection?: string | null
          resources?: string | null
          skills_used?: string[] | null
          smpost_url?: string | null
          submitted_at?: string | null
          thumbnail_url?: string | null
          tools_used?: string[] | null
          uid?: string
          updated_at?: string
          upvoted_at?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          description: string | null
          id: string
          is_featured: boolean | null
          linkedin_url: string | null
          nominated: boolean | null
          project_name: string
          teams_url: string | null
          user_id: string
          week: string
        }
        Insert: {
          description?: string | null
          id?: string
          is_featured?: boolean | null
          linkedin_url?: string | null
          nominated?: boolean | null
          project_name: string
          teams_url?: string | null
          user_id: string
          week: string
        }
        Update: {
          description?: string | null
          id?: string
          is_featured?: boolean | null
          linkedin_url?: string | null
          nominated?: boolean | null
          project_name?: string
          teams_url?: string | null
          user_id?: string
          week?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      task_submissions: {
        Row: {
          completed_at: string | null
          id: string
          submission_text: string | null
          submission_url: string | null
          task_id: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          id?: string
          submission_text?: string | null
          submission_url?: string | null
          task_id: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          id?: string
          submission_text?: string | null
          submission_url?: string | null
          task_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_submissions_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_submissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          description: string | null
          due_date: string | null
          id: string
          is_required: boolean | null
          link_template: string | null
          points: number | null
          submission_type: string
          task_name: string
          week: string
        }
        Insert: {
          description?: string | null
          due_date?: string | null
          id?: string
          is_required?: boolean | null
          link_template?: string | null
          points?: number | null
          submission_type: string
          task_name: string
          week: string
        }
        Update: {
          description?: string | null
          due_date?: string | null
          id?: string
          is_required?: boolean | null
          link_template?: string | null
          points?: number | null
          submission_type?: string
          task_name?: string
          week?: string
        }
        Relationships: []
      }
      tool_insights: {
        Row: {
          cons: string | null
          pricing_tips: string | null
          pros: string
          rating: number
          submitted_at: string
          tool_id: string
          tool_name: string
          uid: string | null
        }
        Insert: {
          cons?: string | null
          pricing_tips?: string | null
          pros: string
          rating: number
          submitted_at?: string
          tool_id: string
          tool_name: string
          uid?: string | null
        }
        Update: {
          cons?: string | null
          pricing_tips?: string | null
          pros?: string
          rating?: number
          submitted_at?: string
          tool_id?: string
          tool_name?: string
          uid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_tool"
            columns: ["tool_id"]
            isOneToOne: true
            referencedRelation: "tools"
            referencedColumns: ["tool_id"]
          },
        ]
      }
      tools: {
        Row: {
          category: string | null
          collective_summary: string | null
          last_updated_at: string
          tool_id: string
          tool_name: string
          tool_url: string | null
          uid: string | null
        }
        Insert: {
          category?: string | null
          collective_summary?: string | null
          last_updated_at?: string
          tool_id?: string
          tool_name: string
          tool_url?: string | null
          uid?: string | null
        }
        Update: {
          category?: string | null
          collective_summary?: string | null
          last_updated_at?: string
          tool_id?: string
          tool_name?: string
          tool_url?: string | null
          uid?: string | null
        }
        Relationships: []
      }
      tracks: {
        Row: {
          assigned_track: string
          experience_level: string
          id: string
          to_community: string | null
          user_id: string
        }
        Insert: {
          assigned_track: string
          experience_level: string
          id?: string
          to_community?: string | null
          user_id: string
        }
        Update: {
          assigned_track?: string
          experience_level?: string
          id?: string
          to_community?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tracks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          role: string
          status: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          role: string
          status: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          role?: string
          status?: string
        }
        Relationships: []
      }
      waitlist: {
        Row: {
          email: string
          id: string
          note: string | null
          submitted_at: string | null
        }
        Insert: {
          email: string
          id?: string
          note?: string | null
          submitted_at?: string | null
        }
        Update: {
          email?: string
          id?: string
          note?: string | null
          submitted_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
