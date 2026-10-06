import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/cart-item';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { getPrimaryImage, ApiProduct } from '../../models/api-product.model';
import emailjs from 'emailjs-com';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit, OnDestroy {
  cartItems$: Observable<CartItem[]>;
  cartItems: CartItem[] = [];
  private cartSubscription: Subscription | undefined;

  // Form state
  showCheckoutForm = false;
  checkoutForm: FormGroup;
  isSubmitting = false;

  // EmailJS Configuration
  readonly EMAILJS_CONFIG = {
    SERVICE_ID: 'service_xfoa9an',
    TEMPLATE_ID: 'template_oozt5vf',
    PUBLIC_KEY: '2w26KF5jldH41vNeR',
    RECEIVER_EMAIL: 'oussamajb02@gmail.com',
    SENDER_NAME: 'FREPPING Store',
  };

  // Tax and shipping configuration
  readonly TAX_RATE = 0.085; // 8.5%
  readonly SHIPPING_THRESHOLD = 100;
  readonly SHIPPING_COST = 9.99;

  // Cart summary values
  subtotal: number = 0;
  shippingCost: number = 0;
  taxAmount: number = 0;
  total: number = 0;
  discountAmount: number = 0;

  constructor(
    private cartService: CartService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.cartItems$ = this.cartService.cartItems$;
    this.checkoutForm = this.fb.group({});
    this.initializeForm();

    // Initialize EmailJS
    emailjs.init(this.EMAILJS_CONFIG.PUBLIC_KEY);
  }

  ngOnInit(): void {
    this.cartSubscription = this.cartItems$.subscribe((items) => {
      this.cartItems = items;
      this.calculateCartSummary();
    });

    this.loadSavedFormData();
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  initializeForm(): void {
    this.checkoutForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9\s\-()]{8,}$/)]],
      address: ['', Validators.required],
      city: ['', Validators.required],
      governorate: ['', Validators.required],
      postalCode: ['', [Validators.required, Validators.pattern(/^[0-9]{4}$/)]],
      paymentMethod: ['cash', Validators.required],
      cardNumber: [''],
      expiryDate: [''],
      cvv: [''],
      acceptTerms: [false, Validators.requiredTrue],
    });

    this.checkoutForm.get('paymentMethod')?.valueChanges.subscribe((method) => {
      const cardNumber = this.checkoutForm.get('cardNumber');
      const expiryDate = this.checkoutForm.get('expiryDate');
      const cvv = this.checkoutForm.get('cvv');

      if (method === 'card') {
        cardNumber?.setValidators([Validators.required, Validators.pattern(/^[0-9]{16}$/)]);
        expiryDate?.setValidators([Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/[0-9]{2}$/)]);
        cvv?.setValidators([Validators.required, Validators.pattern(/^[0-9]{3}$/)]);
      } else {
        cardNumber?.clearValidators();
        expiryDate?.clearValidators();
        cvv?.clearValidators();
      }

      cardNumber?.updateValueAndValidity();
      expiryDate?.updateValueAndValidity();
      cvv?.updateValueAndValidity();
    });

    this.checkoutForm.get('cardNumber')?.valueChanges.subscribe((value) => {
      if (value) {
        const formatted = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
        if (value !== formatted) {
          this.checkoutForm.get('cardNumber')?.setValue(formatted, { emitEvent: false });
        }
      }
    });
  }

  loadSavedFormData(): void {
    const savedData = localStorage.getItem('checkoutFormData');
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        this.checkoutForm.patchValue(data);
      } catch (e) {
        console.error('Error loading saved form data:', e);
      }
    }
  }

  saveFormData(): void {
    const formData = this.checkoutForm.value;
    localStorage.setItem('checkoutFormData', JSON.stringify(formData));
  }

  onInputEnter(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.blur();
  }

  goBack(): void {
    this.router.navigate(['/shop']);
  }

  removeFromCart(item: CartItem): void {
    this.cartService.removeFromCart(item.product.id, item.variant?.id ?? null);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  updateQuantity(item: CartItem, quantity: number): void {
    const validQuantity = Math.max(1, Math.floor(Number(quantity)));
    if (isNaN(validQuantity)) {
      return;
    }
    this.cartService.updateQuantity(item.product.id, item.variant?.id ?? null, validQuantity);
  }

  getItemImage(product: ApiProduct): string {
    return getPrimaryImage(product) || 'assets/placeholder.jpg';
  }

  getItemTotal(item: CartItem): number {
    return Math.round(item.unitPrice * item.quantity * 100) / 100;
  }

  getItemSavings(item: CartItem): number {
    if (item.product.compare_price && item.product.compare_price > item.unitPrice) {
      const savingsPerItem = item.product.compare_price - item.unitPrice;
      return Math.round(savingsPerItem * item.quantity * 100) / 100;
    }
    return 0;
  }

  isItemOnSale(item: CartItem): boolean {
    return !!(item.product.compare_price && item.product.compare_price > item.unitPrice);
  }

  getItemDiscountPercentage(item: CartItem): number {
    if (item.product.compare_price && item.product.compare_price > item.unitPrice) {
      const discount =
        ((item.product.compare_price - item.unitPrice) / item.product.compare_price) * 100;
      return Math.round(discount);
    }
    return 0;
  }

  calculateCartSummary(): void {
    this.subtotal = this.cartItems.reduce((sum, item) => {
      return sum + this.getItemTotal(item);
    }, 0);

    this.discountAmount = this.cartItems.reduce((sum, item) => {
      return sum + this.getItemSavings(item);
    }, 0);

    this.shippingCost =
      this.subtotal >= this.SHIPPING_THRESHOLD || this.cartItems.length === 0
        ? 0
        : this.SHIPPING_COST;

    this.taxAmount = Math.round(this.subtotal * this.TAX_RATE * 100) / 100;
    this.total = Math.round((this.subtotal + this.shippingCost + this.taxAmount) * 100) / 100;
  }

  getSubtotal(): number {
    return this.subtotal;
  }

  getTax(): number {
    return this.taxAmount;
  }

  getShipping(): number {
    return this.shippingCost;
  }

  getTotal(): number {
    return this.total;
  }

  getTotalSavings(): number {
    return this.discountAmount;
  }

  hasFreeShipping(): boolean {
    return this.subtotal >= this.SHIPPING_THRESHOLD;
  }

  getRemainingForFreeShipping(): number {
    if (this.hasFreeShipping() || this.cartItems.length === 0) {
      return 0;
    }
    return Math.max(0, this.SHIPPING_THRESHOLD - this.subtotal);
  }

  getTotalItems(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  continueShopping(): void {
    this.router.navigate(['/shop']);
  }

  proceedToCheckout(): void {
    if (this.cartItems.length === 0) return;
    this.showCheckoutForm = true;
  }

  formatCurrency(amount: number): string {
    return `$${amount.toFixed(2)}`;
  }

  submitCheckout(): void {
    if (this.checkoutForm.invalid) {
      Object.keys(this.checkoutForm.controls).forEach((key) => {
        const control = this.checkoutForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    this.isSubmitting = true;

    const orderData = {
      ...this.checkoutForm.value,
      cartItems: this.cartItems,
      subtotal: this.subtotal,
      shipping: this.shippingCost,
      tax: this.taxAmount,
      total: this.total,
      orderDate: new Date().toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      orderId: 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      itemsCount: this.getTotalItems(),
      hasFreeShipping: this.hasFreeShipping(),
      itemsList: this.generateItemsList(),
      itemsText: this.generateItemsListText(),
    };

    this.saveFormData();
    this.sendOrderEmail(orderData);
  }

  generateItemsList(): string {
    let text = '';
    this.cartItems.forEach((item) => {
      const total = this.getItemTotal(item);
      const variantInfo = item.variant
        ? ` (${[item.variant.size, item.variant.color].filter(Boolean).join('/')})`
        : '';
      text += `${item.quantity}x ${item.product.name}${variantInfo} - $${total.toFixed(2)}\n`;
    });
    return text;
  }

  generateItemsListText(): string {
    return this.cartItems
      .map((item) => {
        const itemTotal = this.getItemTotal(item);
        const variantInfo = item.variant
          ? ` (${[item.variant.size, item.variant.color].filter(Boolean).join('/')})`
          : '';
        return `${item.quantity}x ${item.product.name}${variantInfo} - $${itemTotal.toFixed(2)}`;
      })
      .join('\n');
  }

  async sendOrderEmail(orderData: any): Promise<void> {
    try {
      const emailParams = {
        to_email: this.EMAILJS_CONFIG.RECEIVER_EMAIL,
        to_name: this.EMAILJS_CONFIG.SENDER_NAME,
        from_name: `${orderData.firstName} ${orderData.lastName}`,
        from_email: orderData.email,
        reply_to: orderData.email,
        order_id: orderData.orderId,
        order_date: orderData.orderDate,
        customer_name: `${orderData.firstName} ${orderData.lastName}`,
        customer_email: orderData.email,
        customer_phone: orderData.phone,
        customer_address: `
          ${orderData.address}
          ${orderData.city}, ${orderData.governorate}
          Postal Code: ${orderData.postalCode}
        `,
        payment_method: this.getPaymentMethodName(orderData.paymentMethod),
        subtotal: `$${orderData.subtotal.toFixed(2)}`,
        shipping_cost: orderData.hasFreeShipping ? 'FREE' : `$${orderData.shipping.toFixed(2)}`,
        tax_amount: `$${orderData.tax.toFixed(2)}`,
        total_amount: `$${orderData.total.toFixed(2)}`,
        items_count: orderData.itemsCount.toString(),
        items_list: orderData.itemsList,
        items_text: orderData.itemsText,
        store_name: 'FREPPING',
        store_email: 'info@frepping.com',
        store_phone: '+216 XX XXX XXX',
        store_address: 'Los Santos Customs, FREPPING Headquarters',
      };

      await emailjs.send(
        this.EMAILJS_CONFIG.SERVICE_ID,
        this.EMAILJS_CONFIG.TEMPLATE_ID,
        emailParams
      );

      localStorage.setItem('lastOrder', JSON.stringify(orderData));
      this.cartService.clearCart();
      this.showOrderSuccess(orderData);

      setTimeout(() => {
        this.checkoutForm.reset({
          paymentMethod: 'cash',
          acceptTerms: false,
        });
        this.showCheckoutForm = false;
        this.isSubmitting = false;
      }, 3000);
    } catch (error) {
      console.error('Failed to send email:', error);
      this.isSubmitting = false;
      this.showEmailError(orderData);
    }
  }

  getPaymentMethodName(method: string): string {
    switch (method) {
      case 'cash':
        return 'Cash on Delivery';
      case 'card':
        return 'Credit/Debit Card';
      case 'flouci':
        return 'Flouci Wallet';
      default:
        return 'Unknown';
    }
  }

  showEmailError(orderData: any): void {
    localStorage.setItem('lastOrder', JSON.stringify(orderData));
    this.cartService.clearCart();

    const errorDiv = document.createElement('div');
    errorDiv.className = 'order-error-notification';
    errorDiv.innerHTML = `
      <div class="error-content">
        <i class="fas fa-exclamation-triangle"></i>
        <h3>ORDER PLACED BUT EMAIL FAILED</h3>
        <p>Your order #${orderData.orderId} has been saved.</p>
        <p>Total: $${orderData.total.toFixed(2)}</p>
        <p>We couldn't send the confirmation email. Please save your order number.</p>
        <p class="order-id-highlight">${orderData.orderId}</p>
      </div>
    `;

    document.body.appendChild(errorDiv);

    setTimeout(() => {
      if (errorDiv.parentNode) {
        errorDiv.parentNode.removeChild(errorDiv);
      }
      this.router.navigate(['/']);
    }, 5000);
  }

  showOrderSuccess(orderData: any): void {
    const successDiv = document.createElement('div');
    successDiv.className = 'order-success-notification';
    successDiv.innerHTML = `
      <div class="success-content">
        <i class="fas fa-check-circle"></i>
        <h3>ORDER CONFIRMED!</h3>
        <p>Your order #${orderData.orderId} has been placed successfully.</p>
        <p>Total: $${orderData.total.toFixed(2)}</p>
        <p>A confirmation email has been sent to ${orderData.email}</p>
        <p class="order-note">You will also receive an SMS confirmation shortly.</p>
      </div>
    `;

    document.body.appendChild(successDiv);

    setTimeout(() => {
      if (successDiv.parentNode) {
        successDiv.parentNode.removeChild(successDiv);
      }
      this.router.navigate(['/']);
    }, 5000);
  }
}