import { Category } from './category.model';
import { ProductImage } from './product-image.model';
import { ProductVariant } from './product-variant.model';

/**
 * Matches the backend ProductResponse schema exactly.
 * Used by the customer storefront and admin sections.
 */
export interface ApiProduct {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  /** Original/compare price for strike-through display. null = no discount shown. */
  compare_price: number | null;
  material: string | null;
  is_active: boolean;
  is_featured: boolean;
  category_id: string;
  /** Null for platform-managed (admin) products. */
  seller_id: string | null;
  category: Category | null;
  images: ProductImage[];
  variants: ProductVariant[];
  created_at: string;
  updated_at: string;
}

/** Backend paginated product list response */
export interface ProductListResponse {
  items: ApiProduct[];
  page: number;
  page_size: number;
  total: number;
  pages: number;
}

/** Query parameters for GET /products */
export interface ProductQueryParams {
  page?: number;
  page_size?: number;
  category_id?: string | null;
  search?: string | null;
  is_featured?: boolean | null;
}

/**
 * Convenience helper: returns the effective display price for a product/variant.
 * If a variant has a price override, that is used; otherwise the product base price.
 */
export function getEffectivePrice(product: ApiProduct, variant?: ProductVariant | null): number {
  if (variant?.price != null) {
    return Number(variant.price);
  }
  return Number(product.price);
}

/**
 * Returns the primary image URL, or the first image, or null.
 */
export function getPrimaryImage(product: ApiProduct): string | null {
  if (!product.images || product.images.length === 0) return null;
  const primary = product.images.find(img => img.is_primary);
  return primary ? primary.image_url : product.images[0].image_url;
}

/**
 * Returns the discount percentage between price and compare_price.
 * Returns 0 if there is no valid discount.
 */
export function getDiscountPercent(product: ApiProduct): number {
  const cp = Number(product.compare_price);
  const p = Number(product.price);
  if (!cp || cp <= p) return 0;
  return Math.round(((cp - p) / cp) * 100);
}

/**
 * Returns total available stock from all active variants.
 * Returns null if the product has no variants (stock not tracked at variant level).
 */
export function getTotalStock(product: ApiProduct): number | null {
  if (!product.variants || product.variants.length === 0) return null;
  return product.variants
    .filter(v => v.is_active)
    .reduce((sum, v) => sum + v.stock, 0);
}

/**
 * Returns true if the product has any active in-stock variant.
 * If no variants exist, returns true (treat as available).
 */
export function isProductInStock(product: ApiProduct): boolean {
  if (!product.variants || product.variants.length === 0) return true;
  return product.variants.some(v => v.is_active && v.stock > 0);
}
