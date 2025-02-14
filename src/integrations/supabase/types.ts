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
      achievements: {
        Row: {
          created_at: string
          description: string
          icon: string
          id: string
          progress: number | null
          target: number
          tier: string
          title: string
          type: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          description: string
          icon: string
          id?: string
          progress?: number | null
          target: number
          tier: string
          title: string
          type: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string
          icon?: string
          id?: string
          progress?: number | null
          target?: number
          tier?: string
          title?: string
          type?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      habit_logs: {
        Row: {
          coins_earned: number | null
          completed_at: string
          habit_id: string
          id: string
          user_id: string
          xp_earned: number | null
        }
        Insert: {
          coins_earned?: number | null
          completed_at?: string
          habit_id: string
          id?: string
          user_id: string
          xp_earned?: number | null
        }
        Update: {
          coins_earned?: number | null
          completed_at?: string
          habit_id?: string
          id?: string
          user_id?: string
          xp_earned?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "habit_logs_habit_id_fkey"
            columns: ["habit_id"]
            isOneToOne: false
            referencedRelation: "habits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "habit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      habit_statistics: {
        Row: {
          completion_rate: number | null
          created_at: string
          habit_id: string | null
          id: string
          monthly_completions: number | null
          streak_history: number[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          completion_rate?: number | null
          created_at?: string
          habit_id?: string | null
          id?: string
          monthly_completions?: number | null
          streak_history?: number[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          completion_rate?: number | null
          created_at?: string
          habit_id?: string | null
          id?: string
          monthly_completions?: number | null
          streak_history?: number[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "habit_statistics_habit_id_fkey"
            columns: ["habit_id"]
            isOneToOne: true
            referencedRelation: "habits"
            referencedColumns: ["id"]
          },
        ]
      }
      habit_templates: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          duration_minutes: number | null
          frequency: string
          id: string
          theme: string | null
          title: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          frequency: string
          id?: string
          theme?: string | null
          title: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          frequency?: string
          id?: string
          theme?: string | null
          title?: string
        }
        Relationships: []
      }
      habits: {
        Row: {
          category: string | null
          coin_reward: number | null
          created_at: string
          description: string | null
          duration_minutes: number | null
          frequency: string
          id: string
          label_color: string | null
          last_completion_date: string | null
          priority: number | null
          reminder_days: number[] | null
          reminder_enabled: boolean | null
          reminder_time: string | null
          scheduled_time: string | null
          streak: number | null
          streak_breaks_count: number | null
          streak_recovery_cost: number | null
          streak_start_date: string | null
          theme: string | null
          title: string
          total_completions: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          coin_reward?: number | null
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          frequency: string
          id?: string
          label_color?: string | null
          last_completion_date?: string | null
          priority?: number | null
          reminder_days?: number[] | null
          reminder_enabled?: boolean | null
          reminder_time?: string | null
          scheduled_time?: string | null
          streak?: number | null
          streak_breaks_count?: number | null
          streak_recovery_cost?: number | null
          streak_start_date?: string | null
          theme?: string | null
          title: string
          total_completions?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          coin_reward?: number | null
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          frequency?: string
          id?: string
          label_color?: string | null
          last_completion_date?: string | null
          priority?: number | null
          reminder_days?: number[] | null
          reminder_enabled?: boolean | null
          reminder_time?: string | null
          scheduled_time?: string | null
          streak?: number | null
          streak_breaks_count?: number | null
          streak_recovery_cost?: number | null
          streak_start_date?: string | null
          theme?: string | null
          title?: string
          total_completions?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_habit_category"
            columns: ["user_id", "category"]
            isOneToOne: false
            referencedRelation: "user_goals"
            referencedColumns: ["user_id", "category"]
          },
          {
            foreignKeyName: "habits_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          coins: number | null
          created_at: string
          display_name: string | null
          id: string
          level: number | null
          updated_at: string
          username: string | null
          xp: number | null
        }
        Insert: {
          avatar_url?: string | null
          coins?: number | null
          created_at?: string
          display_name?: string | null
          id: string
          level?: number | null
          updated_at?: string
          username?: string | null
          xp?: number | null
        }
        Update: {
          avatar_url?: string | null
          coins?: number | null
          created_at?: string
          display_name?: string | null
          id?: string
          level?: number | null
          updated_at?: string
          username?: string | null
          xp?: number | null
        }
        Relationships: []
      }
      team_members: {
        Row: {
          id: string
          joined_at: string
          role: string | null
          team_id: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          role?: string | null
          team_id: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          role?: string | null
          team_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      team_task_completions: {
        Row: {
          completed_at: string
          id: string
          task_id: string | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string
          id?: string
          task_id?: string | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string
          id?: string
          task_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_task_completions_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "team_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      team_task_votes: {
        Row: {
          id: string
          task_id: string | null
          user_id: string | null
          voted_at: string
        }
        Insert: {
          id?: string
          task_id?: string | null
          user_id?: string | null
          voted_at?: string
        }
        Update: {
          id?: string
          task_id?: string | null
          user_id?: string | null
          voted_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_task_votes_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "team_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      team_tasks: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          status: string | null
          team_id: string | null
          title: string
          votes: number | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          status?: string | null
          team_id?: string | null
          title: string
          votes?: number | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          status?: string | null
          team_id?: string | null
          title?: string
          votes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "team_tasks_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_goals: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          target: string | null
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          target?: string | null
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          target?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_stats: {
        Row: {
          id: string
          last_updated: string
          user_id: string | null
          weekly_completions: number[]
        }
        Insert: {
          id?: string
          last_updated?: string
          user_id?: string | null
          weekly_completions?: number[]
        }
        Update: {
          id?: string
          last_updated?: string
          user_id?: string | null
          weekly_completions?: number[]
        }
        Relationships: []
      }
    }
    Views: {
      global_leaderboard: {
        Row: {
          streak: number | null
          username: string | null
          xp: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      team_role: "leader" | "co_leader" | "member"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
