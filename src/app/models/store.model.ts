/** Matches backend StoreResponse schema exactly */
export interface Store {
  id: string;
  seller_id: string;
  name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  banner_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/** Payload for POST /api/v1/stores */
export interface StoreCreate {
  name: string;
  slug: string;
  description?: string | null;
  logo_url?: string | null;
  banner_url?: string | null;
}

/** Payload for PATCH /api/v1/stores/me */
export interface StoreUpdate {
  name?: string;
  slug?: string;
  description?: string | null;
  logo_url?: string | null;
  banner_url?: string | null;
  is_active?: boolean;
}
