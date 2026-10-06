/** Matches backend ProductVariantResponse schema exactly */
export interface ProductVariant {
  id: string;
  product_id: string;
  size: string | null;
  color: string | null;
  sku: string;
  stock: number;
  /** Variant-specific price override. null = use product base price */
  price: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
