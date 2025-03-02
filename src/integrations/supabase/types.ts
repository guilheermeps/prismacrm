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
      client_registration_links: {
        Row: {
          created_at: string | null
          expires_at: string | null
          form_data: Json | null
          id: string
          is_used: boolean | null
          lead_id: string
          token: string
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          form_data?: Json | null
          id?: string
          is_used?: boolean | null
          lead_id: string
          token: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          form_data?: Json | null
          id?: string
          is_used?: boolean | null
          lead_id?: string
          token?: string
        }
        Relationships: []
      }
      financial_transactions: {
        Row: {
          amount: number
          category: string | null
          client: string
          created_at: string | null
          due_date: string
          id: string
          payment_method: string | null
          source_id: string | null
          source_type: string | null
          status: string
          total_installments: number | null
          type: string
        }
        Insert: {
          amount?: number
          category?: string | null
          client: string
          created_at?: string | null
          due_date: string
          id?: string
          payment_method?: string | null
          source_id?: string | null
          source_type?: string | null
          status?: string
          total_installments?: number | null
          type: string
        }
        Update: {
          amount?: number
          category?: string | null
          client?: string
          created_at?: string | null
          due_date?: string
          id?: string
          payment_method?: string | null
          source_id?: string | null
          source_type?: string | null
          status?: string
          total_installments?: number | null
          type?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          createdat: string | null
          history: Json | null
          id: string
          isarchived: boolean | null
          name: string
          notes: string | null
          proposalvalue: number | null
          servicetype: string | null
          stageid: string
          whatsapp: string | null
        }
        Insert: {
          createdat?: string | null
          history?: Json | null
          id?: string
          isarchived?: boolean | null
          name: string
          notes?: string | null
          proposalvalue?: number | null
          servicetype?: string | null
          stageid: string
          whatsapp?: string | null
        }
        Update: {
          createdat?: string | null
          history?: Json | null
          id?: string
          isarchived?: boolean | null
          name?: string
          notes?: string | null
          proposalvalue?: number | null
          servicetype?: string | null
          stageid?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      schedule_events: {
        Row: {
          client: string
          created_at: string | null
          date: string
          id: string
          location: string
          notes: string | null
          service: string
          source_id: string | null
          source_type: string | null
          time: string
        }
        Insert: {
          client: string
          created_at?: string | null
          date: string
          id?: string
          location: string
          notes?: string | null
          service: string
          source_id?: string | null
          source_type?: string | null
          time: string
        }
        Update: {
          client?: string
          created_at?: string | null
          date?: string
          id?: string
          location?: string
          notes?: string | null
          service?: string
          source_id?: string | null
          source_type?: string | null
          time?: string
        }
        Relationships: []
      }
      stages: {
        Row: {
          color: string | null
          id: string
          title: string
        }
        Insert: {
          color?: string | null
          id?: string
          title: string
        }
        Update: {
          color?: string | null
          id?: string
          title?: string
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
