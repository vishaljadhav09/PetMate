export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.18';
  };
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      admins: {
        Row: {
          created_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      app_settings: {
        Row: {
          id: boolean;
          require_pet_approval: boolean;
          updated_at: string;
        };
        Insert: {
          id?: boolean;
          require_pet_approval?: boolean;
          updated_at?: string;
        };
        Update: {
          id?: boolean;
          require_pet_approval?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      breed_age_overrides: {
        Row: {
          breed: string;
          min_age_months: number;
          species: Database['public']['Enums']['species_t'];
        };
        Insert: {
          breed: string;
          min_age_months: number;
          species: Database['public']['Enums']['species_t'];
        };
        Update: {
          breed?: string;
          min_age_months?: number;
          species?: Database['public']['Enums']['species_t'];
        };
        Relationships: [];
      };
      breeding_age_rules: {
        Row: {
          min_age_months: number;
          species: Database['public']['Enums']['species_t'];
        };
        Insert: {
          min_age_months: number;
          species: Database['public']['Enums']['species_t'];
        };
        Update: {
          min_age_months?: number;
          species?: Database['public']['Enums']['species_t'];
        };
        Relationships: [];
      };
      favorites: {
        Row: {
          created_at: string;
          pet_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          pet_id: string;
          user_id?: string;
        };
        Update: {
          created_at?: string;
          pet_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'favorites_pet_id_fkey';
            columns: ['pet_id'];
            isOneToOne: false;
            referencedRelation: 'pets';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'favorites_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      match_requests: {
        Row: {
          completed_at: string | null;
          created_at: string;
          id: string;
          message: string | null;
          pet_id: string;
          proposed_date: string | null;
          recipient_id: string;
          relative_warning: boolean;
          responded_at: string | null;
          sender_id: string;
          sender_pet_id: string;
          status: Database['public']['Enums']['request_status_t'];
        };
        Insert: {
          completed_at?: string | null;
          created_at?: string;
          id?: string;
          message?: string | null;
          pet_id: string;
          proposed_date?: string | null;
          recipient_id: string;
          relative_warning?: boolean;
          responded_at?: string | null;
          sender_id?: string;
          sender_pet_id: string;
          status?: Database['public']['Enums']['request_status_t'];
        };
        Update: {
          completed_at?: string | null;
          created_at?: string;
          id?: string;
          message?: string | null;
          pet_id?: string;
          proposed_date?: string | null;
          recipient_id?: string;
          relative_warning?: boolean;
          responded_at?: string | null;
          sender_id?: string;
          sender_pet_id?: string;
          status?: Database['public']['Enums']['request_status_t'];
        };
        Relationships: [
          {
            foreignKeyName: 'match_requests_pet_id_fkey';
            columns: ['pet_id'];
            isOneToOne: false;
            referencedRelation: 'pets';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'match_requests_recipient_id_fkey';
            columns: ['recipient_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'match_requests_sender_id_fkey';
            columns: ['sender_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'match_requests_sender_pet_id_fkey';
            columns: ['sender_pet_id'];
            isOneToOne: false;
            referencedRelation: 'pets';
            referencedColumns: ['id'];
          },
        ];
      };
      pet_addresses: {
        Row: {
          address_line: string;
          pet_id: string;
          pincode: string;
          state: string;
          updated_at: string;
        };
        Insert: {
          address_line: string;
          pet_id: string;
          pincode: string;
          state: string;
          updated_at?: string;
        };
        Update: {
          address_line?: string;
          pet_id?: string;
          pincode?: string;
          state?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'pet_addresses_pet_id_fkey';
            columns: ['pet_id'];
            isOneToOne: true;
            referencedRelation: 'pets';
            referencedColumns: ['id'];
          },
        ];
      };
      pets: {
        Row: {
          approved: boolean;
          breed: string;
          breeding_status: Database['public']['Enums']['breeding_status_t'];
          certificate_url: string | null;
          city: string | null;
          created_at: string;
          date_of_birth: string;
          description: string | null;
          gender: Database['public']['Enums']['gender_t'];
          hidden: boolean;
          hip_score: string | null;
          id: string;
          last_vet_checkup: string | null;
          lat: number | null;
          litter_ref: string | null;
          lng: number | null;
          location: unknown;
          owner_attests_breeding_ready: boolean;
          owner_id: string;
          pedigree_certified: boolean;
          pet_name: string;
          photos: string[];
          registration_number: string | null;
          species: Database['public']['Enums']['species_t'];
          status: Database['public']['Enums']['pet_status_t'];
          stud_fee: number | null;
          stud_fee_type: Database['public']['Enums']['stud_fee_type_t'];
          updated_at: string;
          vaccination_up_to_date: boolean;
          verified: boolean;
        };
        Insert: {
          approved?: boolean;
          breed: string;
          breeding_status?: Database['public']['Enums']['breeding_status_t'];
          certificate_url?: string | null;
          city?: string | null;
          created_at?: string;
          date_of_birth: string;
          description?: string | null;
          gender: Database['public']['Enums']['gender_t'];
          hidden?: boolean;
          hip_score?: string | null;
          id?: string;
          last_vet_checkup?: string | null;
          lat?: number | null;
          litter_ref?: string | null;
          lng?: number | null;
          location: unknown;
          owner_attests_breeding_ready?: boolean;
          owner_id?: string;
          pedigree_certified?: boolean;
          pet_name: string;
          photos?: string[];
          registration_number?: string | null;
          species?: Database['public']['Enums']['species_t'];
          status?: Database['public']['Enums']['pet_status_t'];
          stud_fee?: number | null;
          stud_fee_type?: Database['public']['Enums']['stud_fee_type_t'];
          updated_at?: string;
          vaccination_up_to_date?: boolean;
          verified?: boolean;
        };
        Update: {
          approved?: boolean;
          breed?: string;
          breeding_status?: Database['public']['Enums']['breeding_status_t'];
          certificate_url?: string | null;
          city?: string | null;
          created_at?: string;
          date_of_birth?: string;
          description?: string | null;
          gender?: Database['public']['Enums']['gender_t'];
          hidden?: boolean;
          hip_score?: string | null;
          id?: string;
          last_vet_checkup?: string | null;
          lat?: number | null;
          litter_ref?: string | null;
          lng?: number | null;
          location?: unknown;
          owner_attests_breeding_ready?: boolean;
          owner_id?: string;
          pedigree_certified?: boolean;
          pet_name?: string;
          photos?: string[];
          registration_number?: string | null;
          species?: Database['public']['Enums']['species_t'];
          status?: Database['public']['Enums']['pet_status_t'];
          stud_fee?: number | null;
          stud_fee_type?: Database['public']['Enums']['stud_fee_type_t'];
          updated_at?: string;
          vaccination_up_to_date?: boolean;
          verified?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: 'pets_owner_id_fkey';
            columns: ['owner_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      profile_private: {
        Row: {
          address_line: string | null;
          email: string | null;
          id: string;
          lat: number | null;
          lng: number | null;
          phone: string | null;
          pincode: string | null;
          state: string | null;
          push_token: string | null;
          updated_at: string;
        };
        Insert: {
          address_line?: string | null;
          email?: string | null;
          id: string;
          lat?: number | null;
          lng?: number | null;
          phone?: string | null;
          pincode?: string | null;
          state?: string | null;
          push_token?: string | null;
          updated_at?: string;
        };
        Update: {
          address_line?: string | null;
          email?: string | null;
          id?: string;
          lat?: number | null;
          lng?: number | null;
          phone?: string | null;
          pincode?: string | null;
          state?: string | null;
          push_token?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'profile_private_id_fkey';
            columns: ['id'];
            isOneToOne: true;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          bio: string | null;
          city: string | null;
          created_at: string;
          id: string;
          last_active: string | null;
          name: string;
          rating_avg: number;
          rating_count: number;
          trusted: boolean;
          updated_at: string;
          verified_owner: boolean;
        };
        Insert: {
          avatar_url?: string | null;
          bio?: string | null;
          city?: string | null;
          created_at?: string;
          id: string;
          last_active?: string | null;
          name?: string;
          rating_avg?: number;
          rating_count?: number;
          trusted?: boolean;
          updated_at?: string;
          verified_owner?: boolean;
        };
        Update: {
          avatar_url?: string | null;
          bio?: string | null;
          city?: string | null;
          created_at?: string;
          id?: string;
          last_active?: string | null;
          name?: string;
          rating_avg?: number;
          rating_count?: number;
          trusted?: boolean;
          updated_at?: string;
          verified_owner?: boolean;
        };
        Relationships: [];
      };
      ratings: {
        Row: {
          comment: string | null;
          created_at: string;
          id: string;
          match_request_id: string;
          rated_by: string;
          rated_user: string;
          rating: number;
        };
        Insert: {
          comment?: string | null;
          created_at?: string;
          id?: string;
          match_request_id: string;
          rated_by?: string;
          rated_user: string;
          rating: number;
        };
        Update: {
          comment?: string | null;
          created_at?: string;
          id?: string;
          match_request_id?: string;
          rated_by?: string;
          rated_user?: string;
          rating?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'ratings_match_request_id_fkey';
            columns: ['match_request_id'];
            isOneToOne: false;
            referencedRelation: 'match_requests';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'ratings_rated_by_fkey';
            columns: ['rated_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'ratings_rated_user_fkey';
            columns: ['rated_user'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      reports: {
        Row: {
          admin_note: string | null;
          created_at: string;
          details: string | null;
          id: string;
          reason: Database['public']['Enums']['report_reason_t'];
          reported_pet_id: string | null;
          reported_user_id: string | null;
          reporter_id: string;
          reviewed_at: string | null;
          status: Database['public']['Enums']['report_status_t'];
        };
        Insert: {
          admin_note?: string | null;
          created_at?: string;
          details?: string | null;
          id?: string;
          reason: Database['public']['Enums']['report_reason_t'];
          reported_pet_id?: string | null;
          reported_user_id?: string | null;
          reporter_id?: string;
          reviewed_at?: string | null;
          status?: Database['public']['Enums']['report_status_t'];
        };
        Update: {
          admin_note?: string | null;
          created_at?: string;
          details?: string | null;
          id?: string;
          reason?: Database['public']['Enums']['report_reason_t'];
          reported_pet_id?: string | null;
          reported_user_id?: string | null;
          reporter_id?: string;
          reviewed_at?: string | null;
          status?: Database['public']['Enums']['report_status_t'];
        };
        Relationships: [
          {
            foreignKeyName: 'reports_reported_pet_id_fkey';
            columns: ['reported_pet_id'];
            isOneToOne: false;
            referencedRelation: 'pets';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'reports_reported_user_id_fkey';
            columns: ['reported_user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'reports_reporter_id_fkey';
            columns: ['reporter_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      approval_required: { Args: never; Returns: boolean };
      get_match_contact: {
        Args: { p_request_id: string };
        Returns: {
          contact_name: string;
          contact_phone: string;
        }[];
      };
      is_admin: { Args: never; Returns: boolean };
      is_breeding_eligible: {
        Args: {
          p_breed: string;
          p_dob: string;
          p_species: Database['public']['Enums']['species_t'];
        };
        Returns: boolean;
      };
      min_breeding_age_months: {
        Args: {
          p_breed: string;
          p_species: Database['public']['Enums']['species_t'];
        };
        Returns: number;
      };
      nearby_pets: {
        Args: {
          p_breed?: string;
          p_lat: number;
          p_limit?: number;
          p_lng: number;
          p_my_pet_id?: string;
          p_offset?: number;
          p_radius_m?: number;
          p_species?: Database['public']['Enums']['species_t'];
          p_vaccinated_only?: boolean;
          p_verified_only?: boolean;
        };
        Returns: {
          age_months: number;
          breed: string;
          city: string;
          description: string;
          distance_m: number;
          gender: Database['public']['Enums']['gender_t'];
          id: string;
          lat: number;
          lng: number;
          owner_id: string;
          owner_name: string;
          owner_rating: number;
          owner_rating_count: number;
          owner_verified: boolean;
          pedigree_certified: boolean;
          pet_name: string;
          photos: string[];
          species: Database['public']['Enums']['species_t'];
          stud_fee: number;
          stud_fee_type: Database['public']['Enums']['stud_fee_type_t'];
          vaccination_up_to_date: boolean;
          verified: boolean;
        }[];
      };
      pet_age_months: { Args: { p_dob: string }; Returns: number };
      ping: { Args: never; Returns: string };
      set_match_request_status: {
        Args: {
          p_id: string;
          p_status: Database['public']['Enums']['request_status_t'];
        };
        Returns: {
          completed_at: string | null;
          created_at: string;
          id: string;
          message: string | null;
          pet_id: string;
          proposed_date: string | null;
          recipient_id: string;
          relative_warning: boolean;
          responded_at: string | null;
          sender_id: string;
          sender_pet_id: string;
          status: Database['public']['Enums']['request_status_t'];
        };
        SetofOptions: {
          from: '*';
          to: 'match_requests';
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
    };
    Enums: {
      breeding_status_t: 'available' | 'matched' | 'resting' | 'not_available';
      gender_t: 'male' | 'female';
      pet_status_t: 'active' | 'paused' | 'archived';
      report_reason_t:
        | 'underage_pet'
        | 'no_health_docs'
        | 'spam'
        | 'scam'
        | 'abuse_concern'
        | 'other';
      report_status_t: 'open' | 'reviewed' | 'actioned' | 'dismissed';
      request_status_t: 'new' | 'accepted' | 'declined' | 'completed' | 'cancelled';
      species_t: 'dog' | 'cat' | 'bird' | 'horse' | 'rabbit' | 'other';
      stud_fee_type_t: 'fee' | 'pick_of_litter' | 'free' | 'negotiable';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      breeding_status_t: ['available', 'matched', 'resting', 'not_available'],
      gender_t: ['male', 'female'],
      pet_status_t: ['active', 'paused', 'archived'],
      report_reason_t: ['underage_pet', 'no_health_docs', 'spam', 'scam', 'abuse_concern', 'other'],
      report_status_t: ['open', 'reviewed', 'actioned', 'dismissed'],
      request_status_t: ['new', 'accepted', 'declined', 'completed', 'cancelled'],
      species_t: ['dog', 'cat', 'bird', 'horse', 'rabbit', 'other'],
      stud_fee_type_t: ['fee', 'pick_of_litter', 'free', 'negotiable'],
    },
  },
} as const;
