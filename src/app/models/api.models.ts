/**
 * Centralised TypeScript interfaces matching the FastAPI backend schemas.
 * Money fields come as STRING from the API – always use Number() to parse before math.
 */

// --- Generic Pagination ----------------------------------------------------
export interface Pagination<T> {
  items: T[];
  page: number;
  page_size: number;
  total: number;
  pages: number;
}

// --- User ------------------------------------------------------------------
export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'SELLER' | 'CUSTOMER';

export interface User {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserProfileUpdate {
  first_name?: string | null;
  last_name?: string | null;
  phone?: string | null;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

// --- Auth ------------------------------------------------------------------
export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

// --- Category -------------------------------------------------------------
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

// --- Product --------------------------------------------------------------
export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text: string | null;
  is_primary: boolean;
  sort_order: number;
  created_at?: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  size: string | null;
  color: string | null;
  sku: string;
  stock: number;
  price: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: string;
  compare_price: string | null;
  material: string | null;
  is_active: boolean;
  is_featured: boolean;
  category_id: string;
  seller_id: string | null;
  category: Category | null;
  images: ProductImage[];
  variants: ProductVariant[];
  likes_count: number;
  is_liked: boolean;
  in_stock: boolean;
  discount_percent: number;
  created_at: string;
  updated_at: string;
}

export type ProductListResponse = Pagination<Product>;

export interface ProductQueryParams {
  page?: number;
  page_size?: number;
  category_id?: string | null;
  search?: string | null;
  is_featured?: boolean | null;
  sort?: string | null;
  min_price?: number | null;
  max_price?: number | null;
  in_stock_only?: boolean | null;
}

// --- Store ----------------------------------------------------------------
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

export interface StoreCreate {
  name: string;
  slug: string;
  description?: string;
  logo_url?: string;
  banner_url?: string;
}

export interface StoreUpdate {
  name?: string;
  description?: string;
  logo_url?: string;
  banner_url?: string;
}

// --- Cart -----------------------------------------------------------------
export interface CartItem {
  id: string;
  cart_id: string;
  product_id: string;
  variant_id: string | null;
  quantity: number;
  unit_price: string;
  line_total: string;
  product: Product | null;
  variant: ProductVariant | null;
}

export interface Cart {
  id: string;
  user_id: string;
  items: CartItem[];
  promo_code: string | null;
  promo_discount: string;
  gift_wrap: boolean;
  gift_wrap_cost: string;
  subtotal: string;
  total: string;
}

export interface AddCartItemRequest {
  product_id: string;
  variant_id?: string | null;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export interface ApplyPromoRequest {
  code: string;
}

export interface GuestCartEntry {
  product_id: string;
  variant_id: string | null;
  quantity: number;
}

// --- Address --------------------------------------------------------------
export type AddressType = 'home' | 'office' | 'other';

export interface Address {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  type: AddressType;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface AddressCreate {
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country?: string;
  type?: AddressType;
  is_default?: boolean;
}

export type AddressUpdate = Partial<AddressCreate>;

// --- Delivery Option ------------------------------------------------------
export interface DeliveryOption {
  id: string;
  title: string;
  description: string;
  badge: string | null;
  icon: string | null;
  price: string;
  estimated_label: string | null;
  is_active: boolean;
}

// --- Promo Code -----------------------------------------------------------
export type DiscountType = 'PERCENT' | 'FIXED';

export interface PromoCode {
  id: string;
  code: string;
  description: string | null;
  discount_type: DiscountType;
  discount_value: string;
  min_order_amount: string | null;
  max_discount_amount: string | null;
  usage_limit: number | null;
  used_count: number;
  per_user_limit: number | null;
  starts_at: string | null;
  expires_at: string | null;
  is_active: boolean;
}

// --- Checkout -------------------------------------------------------------
export interface CheckoutPreviewRequest {
  address_id: string;
  delivery_option_id: string;
}

export interface CheckoutPreviewResponse {
  subtotal: string;
  promo_discount: string;
  gift_wrap_cost: string;
  delivery_cost: string;
  total: string;
  estimated_delivery: string | null;
}

// --- Order ----------------------------------------------------------------
export type PaymentMethod = 'CARD' | 'COD' | 'GIFT_CARD';
export type OrderStatus = 'PENDING' | 'PAID' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export interface PlaceOrderRequest {
  address_id: string;
  delivery_option_id: string;
  payment_method: PaymentMethod;
  payment_token?: string | null;
  save_card?: boolean;
  gift_card?: { number: string; pin: string } | null;
}

export interface OrderItem {
  id: string;
  product_id: string;
  variant_id: string | null;
  product_name: string;
  variant_label: string | null;
  image_url: string | null;
  seller_name: string | null;
  quantity: number;
  unit_price: string;
  line_total: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod;
  payment_brand: string | null;
  payment_last4: string | null;
  subtotal: string;
  promo_discount: string;
  gift_wrap_cost: string;
  delivery_cost: string;
  total: string;
  tracking_number: string | null;
  gift_wrap: boolean;
  promo_code: string | null;
  shipping_name: string;
  shipping_phone: string;
  shipping_address_line1: string;
  shipping_address_line2: string | null;
  shipping_city: string;
  shipping_state: string;
  shipping_postal_code: string;
  shipping_country: string;
  delivery_title: string | null;
  estimated_delivery: string | null;
  notes: string | null;
  items: OrderItem[];
  placed_at: string;
  created_at: string;
  updated_at: string;
}

export type OrderListResponse = Pagination<Order>;

// --- Payment Methods ------------------------------------------------------
export interface SavedPaymentMethod {
  id: string;
  user_id: string;
  brand: string;
  last4: string;
  exp_month: number;
  exp_year: number;
  is_default: boolean;
  created_at: string;
}

// --- Gift Card ------------------------------------------------------------
export interface GiftCard {
  id: string;
  code: string;
  balance: string;
  initial_balance: string;
  is_active: boolean;
  expires_at: string | null;
  created_at: string;
}

export interface GiftCardCheckRequest {
  number: string;
  pin: string;
}

export interface GiftCardCheckResponse {
  code: string;
  balance: string;
  is_active: boolean;
  expires_at: string | null;
}

// --- Admin Dashboard ------------------------------------------------------
export interface OrdersByStatus {
  PENDING: number;
  PAID: number;
  PROCESSING: number;
  SHIPPED: number;
  DELIVERED: number;
  CANCELLED: number;
  REFUNDED: number;
}

export interface TopProduct {
  product_id: string;
  product_name: string;
  total_sold: number;
  revenue: string;
}

export interface RevenuePoint {
  date: string;
  revenue: string;
}

export interface AdminDashboardSummary {
  total_orders: number;
  total_revenue: string;
  total_users: number;
  total_products: number;
  orders_by_status: OrdersByStatus;
  top_products: TopProduct[];
  revenue_last_30_days: RevenuePoint[];
}

// --- Seller Dashboard -----------------------------------------------------
export interface SellerDashboardSummary {
  total_orders: number;
  total_revenue: string;
  total_products: number;
  pending_orders: number;
}

// --- Inventory ------------------------------------------------------------
export interface LowStockVariant {
  variant_id: string;
  product_id: string;
  product_name: string;
  sku: string;
  size: string | null;
  color: string | null;
  stock: number;
}

export interface StockAdjustRequest {
  stock: number;
}
