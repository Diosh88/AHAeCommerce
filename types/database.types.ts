/**
 * AHAeCommerce — Supabase Database Types
 * Generated from: supabase/migrations/
 *
 * IMPORTANT: Never approximate column names. Always reference this file.
 * Gate 3c requirement: all queries use exact names from this file.
 *
 * To regenerate after schema changes:
 *   npx supabase gen types typescript --project-id <id> > types/database.types.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      subscribers: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          source: string;
          topics: string[] | null;
          kit_id: string | null;
          gdpr_consent: boolean;
          gdpr_consent_at: string | null;
          subscribed_at: string;
          unsubscribed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name?: string | null;
          source: string;
          topics?: string[] | null;
          kit_id?: string | null;
          gdpr_consent?: boolean;
          gdpr_consent_at?: string | null;
          subscribed_at?: string;
          unsubscribed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          source?: string;
          topics?: string[] | null;
          kit_id?: string | null;
          gdpr_consent?: boolean;
          gdpr_consent_at?: string | null;
          subscribed_at?: string;
          unsubscribed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      purchases: {
        Row: {
          id: string;
          email: string;
          product_slug: string;
          lemon_order_id: string;
          lemon_variant_id: string;
          amount_cents: number;
          currency: string;
          status: string;
          purchased_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          product_slug: string;
          lemon_order_id: string;
          lemon_variant_id: string;
          amount_cents: number;
          currency?: string;
          status?: string;
          purchased_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          product_slug?: string;
          lemon_order_id?: string;
          lemon_variant_id?: string;
          amount_cents?: number;
          currency?: string;
          status?: string;
          purchased_at?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

// Convenience type aliases for common use
export type Subscriber = Database["public"]["Tables"]["subscribers"]["Row"];
export type SubscriberInsert =
  Database["public"]["Tables"]["subscribers"]["Insert"];

export type Purchase = Database["public"]["Tables"]["purchases"]["Row"];
export type PurchaseInsert =
  Database["public"]["Tables"]["purchases"]["Insert"];
