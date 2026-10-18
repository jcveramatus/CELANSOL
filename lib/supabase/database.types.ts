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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      customers: {
        Row: {
          blocked_reason: string | null
          created_at: string
          dni: string | null
          email: string | null
          full_name: string
          id: string
          is_blocked: boolean
          notes: string | null
          phone: string
          tags: string[]
          updated_at: string
        }
        Insert: {
          blocked_reason?: string | null
          created_at?: string
          dni?: string | null
          email?: string | null
          full_name: string
          id?: string
          is_blocked?: boolean
          notes?: string | null
          phone: string
          tags?: string[]
          updated_at?: string
        }
        Update: {
          blocked_reason?: string | null
          created_at?: string
          dni?: string | null
          email?: string | null
          full_name?: string
          id?: string
          is_blocked?: boolean
          notes?: string | null
          phone?: string
          tags?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      dropi_links: {
        Row: {
          cost_price: number
          dropi_product_id: string | null
          dropi_stock: number | null
          dropi_variation_id: string | null
          last_synced_at: string | null
          notes: string | null
          shipping_estimate: number
          supplier_name: string | null
          updated_at: string
          variant_id: string
        }
        Insert: {
          cost_price?: number
          dropi_product_id?: string | null
          dropi_stock?: number | null
          dropi_variation_id?: string | null
          last_synced_at?: string | null
          notes?: string | null
          shipping_estimate?: number
          supplier_name?: string | null
          updated_at?: string
          variant_id: string
        }
        Update: {
          cost_price?: number
          dropi_product_id?: string | null
          dropi_stock?: number | null
          dropi_variation_id?: string | null
          last_synced_at?: string | null
          notes?: string | null
          shipping_estimate?: number
          supplier_name?: string | null
          updated_at?: string
          variant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dropi_links_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: true
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      order_events: {
        Row: {
          actor: Database["public"]["Enums"]["order_actor"]
          actor_user_id: string | null
          created_at: string
          from_status: Database["public"]["Enums"]["order_status"] | null
          id: number
          note: string | null
          order_id: string
          reason: string | null
          to_status: Database["public"]["Enums"]["order_status"]
        }
        Insert: {
          actor?: Database["public"]["Enums"]["order_actor"]
          actor_user_id?: string | null
          created_at?: string
          from_status?: Database["public"]["Enums"]["order_status"] | null
          id?: never
          note?: string | null
          order_id: string
          reason?: string | null
          to_status: Database["public"]["Enums"]["order_status"]
        }
        Update: {
          actor?: Database["public"]["Enums"]["order_actor"]
          actor_user_id?: string | null
          created_at?: string
          from_status?: Database["public"]["Enums"]["order_status"] | null
          id?: never
          note?: string | null
          order_id?: string
          reason?: string | null
          to_status?: Database["public"]["Enums"]["order_status"]
        }
        Relationships: [
          {
            foreignKeyName: "order_events_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          compare_at_price: number | null
          created_at: string
          discount_amount: number
          id: string
          line_total: number
          order_id: string
          product_id: string | null
          quantity: number
          sku: string | null
          source: Database["public"]["Enums"]["item_source"]
          title: string
          unit_cost: number | null
          unit_price: number
          variant_id: string | null
          variant_title: string | null
        }
        Insert: {
          compare_at_price?: number | null
          created_at?: string
          discount_amount?: number
          id?: string
          line_total: number
          order_id: string
          product_id?: string | null
          quantity: number
          sku?: string | null
          source?: Database["public"]["Enums"]["item_source"]
          title: string
          unit_cost?: number | null
          unit_price: number
          variant_id?: string | null
          variant_title?: string | null
        }
        Update: {
          compare_at_price?: number | null
          created_at?: string
          discount_amount?: number
          id?: string
          line_total?: number
          order_id?: string
          product_id?: string | null
          quantity?: number
          sku?: string | null
          source?: Database["public"]["Enums"]["item_source"]
          title?: string
          unit_cost?: number | null
          unit_price?: number
          variant_id?: string | null
          variant_title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          address_line: string
          address_reference: string | null
          cancelled_at: string | null
          carrier: string | null
          client_ip: unknown
          confirmed_at: string | null
          created_at: string
          currency: string
          customer_id: string | null
          customer_name: string
          delivered_at: string | null
          department: string
          discount_total: number
          district: string
          dni: string | null
          dropi_order_id: string | null
          dropi_status_raw: string | null
          dropi_synced_at: string | null
          email: string | null
          fbc: string | null
          fbclid: string | null
          fbp: string | null
          id: string
          landing_path: string | null
          notes: string | null
          order_number: number
          payment_method: Database["public"]["Enums"]["payment_method"]
          payment_status: Database["public"]["Enums"]["payment_status"]
          phone: string
          province: string
          returned_at: string | null
          sent_to_dropi_at: string | null
          shipping_total: number
          status: Database["public"]["Enums"]["order_status"]
          subtotal: number
          total: number
          tracking_event_id: string
          tracking_number: string | null
          ubigeo: string | null
          updated_at: string
          user_agent: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
        }
        Insert: {
          address_line: string
          address_reference?: string | null
          cancelled_at?: string | null
          carrier?: string | null
          client_ip?: unknown
          confirmed_at?: string | null
          created_at?: string
          currency?: string
          customer_id?: string | null
          customer_name: string
          delivered_at?: string | null
          department: string
          discount_total?: number
          district: string
          dni?: string | null
          dropi_order_id?: string | null
          dropi_status_raw?: string | null
          dropi_synced_at?: string | null
          email?: string | null
          fbc?: string | null
          fbclid?: string | null
          fbp?: string | null
          id?: string
          landing_path?: string | null
          notes?: string | null
          order_number?: never
          payment_method?: Database["public"]["Enums"]["payment_method"]
          payment_status?: Database["public"]["Enums"]["payment_status"]
          phone: string
          province: string
          returned_at?: string | null
          sent_to_dropi_at?: string | null
          shipping_total?: number
          status?: Database["public"]["Enums"]["order_status"]
          subtotal: number
          total: number
          tracking_event_id?: string
          tracking_number?: string | null
          ubigeo?: string | null
          updated_at?: string
          user_agent?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Update: {
          address_line?: string
          address_reference?: string | null
          cancelled_at?: string | null
          carrier?: string | null
          client_ip?: unknown
          confirmed_at?: string | null
          created_at?: string
          currency?: string
          customer_id?: string | null
          customer_name?: string
          delivered_at?: string | null
          department?: string
          discount_total?: number
          district?: string
          dni?: string | null
          dropi_order_id?: string | null
          dropi_status_raw?: string | null
          dropi_synced_at?: string | null
          email?: string | null
          fbc?: string | null
          fbclid?: string | null
          fbp?: string | null
          id?: string
          landing_path?: string | null
          notes?: string | null
          order_number?: never
          payment_method?: Database["public"]["Enums"]["payment_method"]
          payment_status?: Database["public"]["Enums"]["payment_status"]
          phone?: string
          province?: string
          returned_at?: string | null
          sent_to_dropi_at?: string | null
          shipping_total?: number
          status?: Database["public"]["Enums"]["order_status"]
          subtotal?: number
          total?: number
          tracking_event_id?: string
          tracking_number?: string | null
          ubigeo?: string | null
          updated_at?: string
          user_agent?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer_stats"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      product_blocks: {
        Row: {
          created_at: string
          data: Json
          id: string
          is_visible: boolean
          position: number
          product_id: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          data?: Json
          id?: string
          is_visible?: boolean
          position?: number
          product_id: string
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          data?: Json
          id?: string
          is_visible?: boolean
          position?: number
          product_id?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_blocks_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_media: {
        Row: {
          alt: string
          context: Database["public"]["Enums"]["media_context"]
          created_at: string
          height: number | null
          id: string
          position: number
          product_id: string
          storage_path: string | null
          type: Database["public"]["Enums"]["media_type"]
          url: string | null
          width: number | null
        }
        Insert: {
          alt?: string
          context?: Database["public"]["Enums"]["media_context"]
          created_at?: string
          height?: number | null
          id?: string
          position?: number
          product_id: string
          storage_path?: string | null
          type?: Database["public"]["Enums"]["media_type"]
          url?: string | null
          width?: number | null
        }
        Update: {
          alt?: string
          context?: Database["public"]["Enums"]["media_context"]
          created_at?: string
          height?: number | null
          id?: string
          position?: number
          product_id?: string
          storage_path?: string | null
          type?: Database["public"]["Enums"]["media_type"]
          url?: string | null
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "product_media_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variants: {
        Row: {
          compare_at_price: number | null
          created_at: string
          id: string
          image_id: string | null
          is_active: boolean
          option_values: Json
          position: number
          price: number
          product_id: string
          sku: string | null
          stock: number | null
          title: string
          updated_at: string
        }
        Insert: {
          compare_at_price?: number | null
          created_at?: string
          id?: string
          image_id?: string | null
          is_active?: boolean
          option_values?: Json
          position?: number
          price: number
          product_id: string
          sku?: string | null
          stock?: number | null
          title?: string
          updated_at?: string
        }
        Update: {
          compare_at_price?: number | null
          created_at?: string
          id?: string
          image_id?: string | null
          is_active?: boolean
          option_values?: Json
          position?: number
          price?: number
          product_id?: string
          sku?: string | null
          stock?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_image_id_fkey"
            columns: ["image_id"]
            isOneToOne: false
            referencedRelation: "product_media"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          badges: string[]
          created_at: string
          description: string | null
          id: string
          line: Database["public"]["Enums"]["product_line"]
          options: Json
          product_type: string | null
          published_at: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          specs: Json
          status: Database["public"]["Enums"]["product_status"]
          subtitle: string | null
          tags: string[]
          test_status: Database["public"]["Enums"]["test_status"]
          title: string
          updated_at: string
        }
        Insert: {
          badges?: string[]
          created_at?: string
          description?: string | null
          id?: string
          line?: Database["public"]["Enums"]["product_line"]
          options?: Json
          product_type?: string | null
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          specs?: Json
          status?: Database["public"]["Enums"]["product_status"]
          subtitle?: string | null
          tags?: string[]
          test_status?: Database["public"]["Enums"]["test_status"]
          title: string
          updated_at?: string
        }
        Update: {
          badges?: string[]
          created_at?: string
          description?: string | null
          id?: string
          line?: Database["public"]["Enums"]["product_line"]
          options?: Json
          product_type?: string | null
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          specs?: Json
          status?: Database["public"]["Enums"]["product_status"]
          subtitle?: string | null
          tags?: string[]
          test_status?: Database["public"]["Enums"]["test_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      staff: {
        Row: {
          created_at: string
          full_name: string
          role: Database["public"]["Enums"]["staff_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          full_name: string
          role?: Database["public"]["Enums"]["staff_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          full_name?: string
          role?: Database["public"]["Enums"]["staff_role"]
          user_id?: string
        }
        Relationships: []
      }
      store_settings: {
        Row: {
          announcements: string[]
          footer_text: string
          gtm_container_id: string | null
          id: boolean
          seo_description: string | null
          seo_title: string | null
          store_name: string
          trust_badges: Json
          updated_at: string
          updated_by: string | null
          whatsapp_number: string | null
        }
        Insert: {
          announcements?: string[]
          footer_text?: string
          gtm_container_id?: string | null
          id?: boolean
          seo_description?: string | null
          seo_title?: string | null
          store_name?: string
          trust_badges?: Json
          updated_at?: string
          updated_by?: string | null
          whatsapp_number?: string | null
        }
        Update: {
          announcements?: string[]
          footer_text?: string
          gtm_container_id?: string | null
          id?: boolean
          seo_description?: string | null
          seo_title?: string | null
          store_name?: string
          trust_badges?: Json
          updated_at?: string
          updated_by?: string | null
          whatsapp_number?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      customer_stats: {
        Row: {
          cancelled_count: number | null
          customer_id: string | null
          delivered_count: number | null
          delivered_revenue: number | null
          last_order_at: string | null
          orders_count: number | null
          returned_count: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      change_order_status: {
        Args: {
          p_note?: string
          p_order_id: string
          p_reason?: string
          p_status: Database["public"]["Enums"]["order_status"]
        }
        Returns: {
          address_line: string
          address_reference: string | null
          cancelled_at: string | null
          carrier: string | null
          client_ip: unknown
          confirmed_at: string | null
          created_at: string
          currency: string
          customer_id: string | null
          customer_name: string
          delivered_at: string | null
          department: string
          discount_total: number
          district: string
          dni: string | null
          dropi_order_id: string | null
          dropi_status_raw: string | null
          dropi_synced_at: string | null
          email: string | null
          fbc: string | null
          fbclid: string | null
          fbp: string | null
          id: string
          landing_path: string | null
          notes: string | null
          order_number: number
          payment_method: Database["public"]["Enums"]["payment_method"]
          payment_status: Database["public"]["Enums"]["payment_status"]
          phone: string
          province: string
          returned_at: string | null
          sent_to_dropi_at: string | null
          shipping_total: number
          status: Database["public"]["Enums"]["order_status"]
          subtotal: number
          total: number
          tracking_event_id: string
          tracking_number: string | null
          ubigeo: string | null
          updated_at: string
          user_agent: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
        }
        SetofOptions: {
          from: "*"
          to: "orders"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      is_staff: {
        Args: { allowed?: Database["public"]["Enums"]["staff_role"][] }
        Returns: boolean
      }
      staff_role: {
        Args: never
        Returns: Database["public"]["Enums"]["staff_role"]
      }
    }
    Enums: {
      item_source:
        | "principal"
        | "volumen"
        | "upsell_formulario"
        | "post_compra"
        | "downsell"
        | "cross_sell"
      media_context: "producto" | "en_uso"
      media_type: "imagen" | "video"
      order_actor: "sistema" | "staff" | "cliente" | "dropi"
      order_status:
        | "nuevo"
        | "por_confirmar"
        | "confirmado"
        | "enviado_dropi"
        | "guia_generada"
        | "en_transito"
        | "en_reparto"
        | "entregado"
        | "novedad"
        | "devuelto"
        | "cancelado"
        | "pendiente_pago"
        | "pagado"
      payment_method: "contra_entrega" | "online"
      payment_status: "pendiente" | "pagado" | "fallido" | "reembolsado"
      product_line: "hogar" | "mascotas"
      product_status: "borrador" | "activo" | "archivado"
      staff_role: "admin" | "operaciones" | "contenido" | "atencion"
      test_status:
        | "sin_testear"
        | "en_test"
        | "ganador"
        | "pausado"
        | "descartado"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      item_source: [
        "principal",
        "volumen",
        "upsell_formulario",
        "post_compra",
        "downsell",
        "cross_sell",
      ],
      media_context: ["producto", "en_uso"],
      media_type: ["imagen", "video"],
      order_actor: ["sistema", "staff", "cliente", "dropi"],
      order_status: [
        "nuevo",
        "por_confirmar",
        "confirmado",
        "enviado_dropi",
        "guia_generada",
        "en_transito",
        "en_reparto",
        "entregado",
        "novedad",
        "devuelto",
        "cancelado",
        "pendiente_pago",
        "pagado",
      ],
      payment_method: ["contra_entrega", "online"],
      payment_status: ["pendiente", "pagado", "fallido", "reembolsado"],
      product_line: ["hogar", "mascotas"],
      product_status: ["borrador", "activo", "archivado"],
      staff_role: ["admin", "operaciones", "contenido", "atencion"],
      test_status: [
        "sin_testear",
        "en_test",
        "ganador",
        "pausado",
        "descartado",
      ],
    },
  },
} as const
