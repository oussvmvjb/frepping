import { ApiProduct } from './api-product.model';
import { ProductVariant } from './product-variant.model';

/**
 * A cart item that carries the full variant context.
 * The cart is in-memory (no backend cart API yet).
 */
export interface CartItem {
  product: ApiProduct;
  variant: ProductVariant | null;
  /** Effective unit price: variant.price ?? product.price */
  unitPrice: number;
  quantity: number;
}
