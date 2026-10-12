import { Product } from './api.models';
import { ProductVariant } from './api.models';


export interface CartItem {
  id: string;
  product: Product | null;
  variant: ProductVariant | null;
  /** Effective unit price */
  unitPrice: number;
  
  quantity: number;
}
