/** ====================================================================
 *  Admin Extended Models — all new domain interfaces
 * ==================================================================== */

// ─── Enums ────────────────────────────────────────────────────────────────────

export type OrderStatus =
  | 'PENDING' | 'PAID' | 'PROCESSING' | 'SHIPPED'
  | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
export type PaymentMethod = 'CARD' | 'COD' | 'GIFT_CARD';
export type FulfillmentStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'SELLER' | 'CUSTOMER';
export type DiscountType = 'PERCENT' | 'FIXED';

// ─── Dashboard ────────────────────────────────────────────────────────────────

export interface TopProductSalesItem {
  product_id: string;
  product_name: string;
  units_sold: number;
  total_revenue: string;
}

export interface TopProductLikesItem {
  product_id: string;
  product_name: string;
  likes_count: number;
}

export interface RevenueDailyItem {
  date: string;
  revenue: string;
  orders_count: number;
}

export interface AdminDashboardSummary {
  total_revenue: string;
  orders_count: number;
  orders_by_status: Record<string, number>;
  new_users: number;
  active_products: number;
  low_stock_count: number;
  top_products_by_sales: TopProductSalesItem[];
  top_products_by_likes: TopProductLikesItem[];
  revenue_daily: RevenueDailyItem[];
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export interface AddressSnapshot {
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
}

export interface OrderItemResponse {
  id: string;
  order_id: string;
  product_id: string | null;
  variant_id: string | null;
  seller_id: string | null;
  product_name: string;
  variant_label: string | null;
  sku: string | null;
  image_url: string | null;
  unit_price: string;
  quantity: number;
  line_total: string;
  fulfillment_status: FulfillmentStatus | null;
}

export interface OrderStatusHistoryResponse {
  id: string;
  from_status: OrderStatus | null;
  to_status: OrderStatus;
  changed_by: string | null;
  note: string | null;
  created_at: string;
}

export interface PaymentSummaryResponse {
  id: string;
  provider: string;
  provider_ref: string | null;
  amount: string;
  currency: string;
  status: PaymentStatus;
  card_brand: string | null;
  card_last4: string | null;
  created_at: string;
}

export interface OrderResponse {
  id: string;
  order_number: string;
  user_id: string;
  status: OrderStatus;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  subtotal: string;
  promo_discount: string;
  gift_wrap: boolean;
  gift_wrap_cost: string;
  delivery_cost: string;
  gift_card_amount_used: string;
  total: string;
  shipping_address: AddressSnapshot;
  tracking_number: string | null;
  estimated_delivery_at: string | null;
  placed_at: string;
  paid_at: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  cancelled_at: string | null;
  created_at: string;
  updated_at: string;
  items: OrderItemResponse[];
  status_history: OrderStatusHistoryResponse[];
  payment: PaymentSummaryResponse | null;
}

export interface OrderListResponse {
  items: OrderResponse[];
  page: number;
  page_size: number;
  total: number;
  pages: number;
}

export interface OrderStatusUpdateRequest {
  status: OrderStatus;
  note?: string | null;
  tracking_number?: string | null;
}

// ─── Inventory ────────────────────────────────────────────────────────────────

export interface LowStockVariantItem {
  variant_id: string;
  product_id: string;
  product_name: string;
  sku: string;
  size: string | null;
  color: string | null;
  stock: number;
}

export interface LowStockInventoryResponse {
  items: LowStockVariantItem[];
  threshold: number;
  count: number;
}

export interface VariantStockUpdateRequest {
  stock: number;
}

// ─── Gift Cards ───────────────────────────────────────────────────────────────

export interface GiftCardResponse {
  id: string;
  code: string;
  initial_balance: string;
  balance: string;
  currency: string;
  is_active: boolean;
  expires_at: string | null;
  created_at: string;
}

export interface GiftCardCreatedAdminResponse extends GiftCardResponse {
  pin: string;
}

export interface GiftCardListResponse {
  items: GiftCardResponse[];
  page: number;
  page_size: number;
  total: number;
  pages: number;
}

export interface GiftCardCreateRequest {
  initial_balance: string;
  currency: string;
  expires_at: string | null;
}

export interface GiftCardUpdateRequest {
  is_active?: boolean;
}

// ─── Promo Codes ──────────────────────────────────────────────────────────────

export interface PromoCodeResponse {
  id: string;
  code: string;
  description: string | null;
  discount_type: DiscountType;
  discount_value: string;
  min_order_amount: string;
  max_discount_amount: string | null;
  usage_limit: number | null;
  per_user_limit: number;
  starts_at: string | null;
  expires_at: string | null;
  is_active: boolean;
  used_count: number;
  created_at: string;
  updated_at: string;
}

export interface PromoCodeListResponse {
  items: PromoCodeResponse[];
  page: number;
  page_size: number;
  total: number;
  pages: number;
}

export interface PromoCodeCreateRequest {
  code: string;
  description?: string | null;
  discount_type: DiscountType;
  discount_value: string;
  min_order_amount?: string;
  max_discount_amount?: string | null;
  usage_limit?: number | null;
  per_user_limit?: number;
  starts_at?: string | null;
  expires_at?: string | null;
  is_active?: boolean;
}

export type PromoCodeUpdateRequest = Partial<PromoCodeCreateRequest>;

// ─── Delivery Options ─────────────────────────────────────────────────────────

export interface DeliveryOptionResponse {
  id: string;
  code: string;
  title: string;
  description: string | null;
  badge: string | null;
  icon: string | null;
  price: string;
  estimated_days_min: number | null;
  estimated_days_max: number | null;
  estimated_label: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface DeliveryOptionCreateRequest {
  code: string;
  title: string;
  description?: string | null;
  badge?: string | null;
  icon?: string | null;
  price: string;
  estimated_days_min?: number | null;
  estimated_days_max?: number | null;
  estimated_label?: string | null;
  is_active?: boolean;
  sort_order?: number;
}

export type DeliveryOptionUpdateRequest = Partial<DeliveryOptionCreateRequest>;

// ─── Users ────────────────────────────────────────────────────────────────────

export interface AdminUserResponse {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: UserRole;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
}

export interface AdminUserListResponse {
  items: AdminUserResponse[];
  total: number;
}

export interface UserRoleUpdateRequest {
  role: UserRole;
}

export interface UserStatusUpdateRequest {
  is_active: boolean;
}

// ─── Product Likes ────────────────────────────────────────────────────────────

export interface ProductLikerItem {
  user_id: string;
  full_name: string;
  email: string;
  created_at: string;
}

export interface ProductLikersListResponse {
  product_id: string;
  likes_count: number;
  items: ProductLikerItem[];
  page: number;
  page_size: number;
  total: number;
  pages: number;
}
