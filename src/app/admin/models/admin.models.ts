/** ============================================================
 *  Admin feature — TypeScript interfaces
 * ============================================================ */

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductImageCreate {
  image_url: string;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
}

export interface ProductImageResponse extends ProductImageCreate {
  id: string;
  product_id: string;
  created_at: string;
}

export interface ProductVariantCreate {
  size: string | null;
  color: string | null;
  sku: string;
  stock: number;
  price: number | null;
  is_active: boolean;
}

export interface ProductVariantResponse extends ProductVariantCreate {
  id: string;
  product_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateProductRequest {
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compare_price: number | null;
  material: string | null;
  is_active: boolean;
  is_featured: boolean;
  category_id: string;
  images: ProductImageCreate[];
  variants: ProductVariantCreate[];
}

/** PATCH /api/v1/products/{id} — all fields optional */
export interface UpdateProductRequest {
  name?: string;
  slug?: string;
  description?: string | null;
  price?: number;
  compare_price?: number | null;
  material?: string | null;
  is_active?: boolean;
  is_featured?: boolean;
  category_id?: string;
}

/** PATCH /api/v1/categories/{id} — all fields optional */
export interface UpdateCategoryRequest {
  name?: string;
  slug?: string;
  description?: string | null;
  image_url?: string | null;
  is_active?: boolean;
}

/** POST /api/v1/categories */
export interface CreateCategoryRequest {
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  is_active: boolean;
}

export interface ProductResponse {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compare_price: number | null;
  material: string | null;
  is_active: boolean;
  is_featured: boolean;
  category_id: string;
  category: Category | null;
  images: ProductImageResponse[];
  variants: ProductVariantResponse[];
  created_at: string;
  updated_at: string;
}

export interface ProductListResponse {
  items: ProductResponse[];
  page: number;
  page_size: number;
  total: number;
  pages: number;
}

/** Direct Aliases matching prompt requirements without `any` */
export type Product = ProductResponse;
export type ProductImage = ProductImageResponse;
export type ProductVariant = ProductVariantResponse;

export interface ProductQueryParams {
  page?: number;
  pageSize?: number;
  categoryId?: string | null;
  search?: string | null;
  isFeatured?: boolean | null;
}
