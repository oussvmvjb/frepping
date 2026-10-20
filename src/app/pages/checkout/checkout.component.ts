import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { takeUntil, finalize } from "rxjs/operators";
import { CartService } from "../../services/cart.service";
import { AuthService } from "../../services/auth.service";
import { AddressService } from "../../services/address.service";
import { DeliveryService } from "../../services/delivery.service";
import { PromoService } from "../../services/promo.service";
import { PaymentTokenService } from "../../services/payment-token.service";
import { PaymentMethodService } from "../../services/payment-method.service";
import { GiftCardService } from "../../services/gift-card.service";
import { CheckoutService } from "../../services/checkout.service";
import {
  Cart,
  CartItem,
  Address,
  AddressCreate,
  DeliveryOption,
  PromoCode,
  SavedPaymentMethod,
  CheckoutPreviewResponse,
  Order,
  PlaceOrderRequest
} from "../../models/api.models";

@Component({
  selector: "app-checkout",
  templateUrl: "./checkout.component.html",
  styleUrls: ["./checkout.component.scss"],
})
export class CheckoutComponent implements OnInit, OnDestroy {
  activeStep = 0; // 0: Cart, 1: Address & Delivery, 2: Payment, 3: Confirmation

  steps = [
    { title: "Cart", icon: "fas fa-shopping-bag" },
    { title: "Address", icon: "fas fa-map-marker-alt" },
    { title: "Payment", icon: "fas fa-credit-card" },
    { title: "Confirmation", icon: "fas fa-check-circle" },
  ];

  // Cart state
  cart: Cart | null = null;
  cartItems: CartItem[] = [];
  loadingCart = true;
  cartUpdatingId: string | null = null;

  // Active promos banner
  activePromos: PromoCode[] = [];
  showOfferAlert = true;

  // Promo code in sidebar
  promoCodeInput = "";
  promoError = "";
  promoSuccess = "";
  promoSubmitting = false;

  // Gift wrap
  hasGiftWrap = false;
  giftWrapLoading = false;

  // Addresses
  addresses: Address[] = [];
  selectedAddressId = "";
  loadingAddresses = false;
  showAddAddressModal = false;
  addressError = "";
  newAddress: AddressCreate = {
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "US",
    type: "home",
    is_default: false,
  };

  // Delivery options
  deliveryOptions: DeliveryOption[] = [];
  selectedDeliveryId = "";
  loadingDelivery = false;

  // Checkout Preview (totals & estimated delivery calculated by backend)
  preview: CheckoutPreviewResponse | null = null;
  loadingPreview = false;

  // Payment
  paymentMethod: "CARD" | "COD" | "GIFT_CARD" = "CARD";
  savedCards: SavedPaymentMethod[] = [];
  selectedSavedCardId: string | null = null;
  cardDetails = {
    number: "",
    name: "",
    expiry: "",
    cvv: "",
    saveCard: true,
  };

  giftCard = {
    number: "",
    pin: "",
    balance: null as string | null,
    error: "",
    checking: false,
    checked: false,
  };

  // Order submission
  submittingOrder = false;
  orderError: string | null = null;
  stockErrorItems: string[] = [];
  idempotencyKey = "";
  lastOrder: Order | null = null;

  // User
  userEmail = "";

  private destroy$ = new Subject<void>();

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private addressService: AddressService,
    private deliveryService: DeliveryService,
    private promoService: PromoService,
    private paymentTokenService: PaymentTokenService,
    private paymentMethodService: PaymentMethodService,
    private giftCardService: GiftCardService,
    private checkoutService: CheckoutService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.currentUser;
    if (user) {
      this.userEmail = user.email;
    } else {
      this.authService.currentUser$.pipe(takeUntil(this.destroy$)).subscribe(u => {
        if (u) this.userEmail = u.email;
      });
    }

    this.regenerateIdempotencyKey();
    this.loadCart();
    this.loadPromos();
    this.loadAddresses();
    this.loadDeliveryOptions();
    this.loadSavedPaymentMethods();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private regenerateIdempotencyKey(): void {
    this.idempotencyKey = typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : "order-" + Date.now() + "-" + Math.random().toString(36).substring(2, 9);
  }

  // --- Step Navigation ------------------------------------------------------

  goToStep(index: number): void {
    if (index <= this.activeStep || this.canGoToStep(index)) {
      this.activeStep = index;
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  canGoToStep(index: number): boolean {
    if (this.cartItems.some(item => !item.product)) return false;
    if (index === 1) return this.cartItems.length > 0;
    if (index === 2) return this.cartItems.length > 0 && !!this.selectedAddressId && !!this.selectedDeliveryId;
    if (index === 3) return !!this.lastOrder;
    return false;
  }

  nextStep(): void {
    if (this.activeStep === 0) {
      if (this.cartItems.length === 0) return;
      if (!this.authService.getAccessToken()) {
        this.router.navigate(["/login"], { queryParams: { returnUrl: "/checkout" } });
        return;
      }
      this.activeStep = 1;
      this.fetchPreview();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (this.activeStep === 1) {
      if (!this.selectedAddressId || !this.selectedDeliveryId) return;
      this.activeStep = 2;
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  prevStep(): void {
    if (this.activeStep > 0 && this.activeStep < 3) {
      this.activeStep--;
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  // --- Step 1: Cart ---------------------------------------------------------

  loadCart(): void {
    this.loadingCart = true;
    this.cartService.load().pipe(
      takeUntil(this.destroy$),
      finalize(() => (this.loadingCart = false))
    ).subscribe({
      next: cart => {
        this.cart = cart;
        this.cartItems = cart?.items || [];
        this.hasGiftWrap = !!cart?.gift_wrap;
        if (this.selectedAddressId && this.selectedDeliveryId) {
          this.fetchPreview();
        }
      },
      error: () => {
        this.cart = null;
        this.cartItems = [];
      },
    });
  }

  loadPromos(): void {
    this.promoService.getActive().pipe(takeUntil(this.destroy$)).subscribe({
      next: res => {
        this.activePromos = res?.items || [];
      },
      error: () => {
        this.activePromos = [];
      },
    });
  }

  updateQty(item: CartItem, delta: number): void {
    const newQty = item.quantity + delta;
    if (newQty < 1) {
      this.removeItem(item);
      return;
    }
    this.cartUpdatingId = item.id;
    this.cartService.updateQty(item.id, newQty).pipe(
      finalize(() => (this.cartUpdatingId = null))
    ).subscribe({
      next: cart => {
        this.cart = cart;
        this.cartItems = cart.items;
        if (this.selectedAddressId && this.selectedDeliveryId) this.fetchPreview();
      },
      error: err => {
        this.promoError = err.message;
      },
    });
  }

  removeItem(item: CartItem): void {
    this.cartUpdatingId = item.id;
    this.cartService.removeItem(item.id).pipe(
      finalize(() => (this.cartUpdatingId = null))
    ).subscribe({
      next: cart => {
        this.cart = cart;
        this.cartItems = cart.items;
        if (this.selectedAddressId && this.selectedDeliveryId) this.fetchPreview();
      },
      error: err => {
        this.promoError = err.message;
      },
    });
  }

  applyPromo(): void {
    const code = this.promoCodeInput.trim().toUpperCase();
    if (!code) {
      this.promoError = "Please enter a voucher code.";
      return;
    }
    this.promoError = "";
    this.promoSuccess = "";
    this.promoSubmitting = true;

    this.cartService.applyPromo(code).pipe(
      finalize(() => (this.promoSubmitting = false))
    ).subscribe({
      next: cart => {
        this.cart = cart;
        this.cartItems = cart.items;
        this.promoSuccess = `Promo code "${code}" applied successfully!`;
        if (this.selectedAddressId && this.selectedDeliveryId) this.fetchPreview();
      },
      error: (err: Error) => {
        this.promoError = err.message || "Invalid promo code.";
      },
    });
  }

  removePromo(): void {
    this.promoError = "";
    this.promoSuccess = "";
    this.promoSubmitting = true;

    this.cartService.removePromo().pipe(
      finalize(() => (this.promoSubmitting = false))
    ).subscribe({
      next: cart => {
        this.cart = cart;
        this.cartItems = cart.items;
        this.promoCodeInput = "";
        this.promoSuccess = "Promo code removed.";
        if (this.selectedAddressId && this.selectedDeliveryId) this.fetchPreview();
      },
      error: (err: Error) => {
        this.promoError = err.message;
      },
    });
  }

  onGiftWrapToggle(enabled: boolean): void {
    this.hasGiftWrap = enabled;
    this.giftWrapLoading = true;
    this.cartService.setGiftWrap(enabled).pipe(
      finalize(() => (this.giftWrapLoading = false))
    ).subscribe({
      next: cart => {
        this.cart = cart;
        if (this.selectedAddressId && this.selectedDeliveryId) this.fetchPreview();
      },
      error: () => {
        this.hasGiftWrap = !enabled;
      },
    });
  }

  getItemImage(item: CartItem): string {
    const images = item.product?.images;
    if (images?.length) {
      const primary = images.find(img => img.is_primary);
      return primary ? primary.image_url : images[0].image_url;
    }
    return "assets/bg/bg1.jpg";
  }

  getSellerName(item: CartItem): string {
    return (item.product as any)?.seller?.store_name || "FREPPING";
  }

  // --- Step 2: Address & Delivery -------------------------------------------

  loadAddresses(): void {
    if (!this.authService.getAccessToken()) return;
    this.loadingAddresses = true;
    this.addressService.list().pipe(
      takeUntil(this.destroy$),
      finalize(() => (this.loadingAddresses = false))
    ).subscribe({
      next: addresses => {
        this.addresses = addresses;
        if (addresses.length > 0 && !this.selectedAddressId) {
          const defaultAddr = addresses.find(a => a.is_default) || addresses[0];
          this.selectedAddressId = defaultAddr.id;
          if (this.selectedDeliveryId) this.fetchPreview();
        }
      },
      error: () => {
        this.addresses = [];
      },
    });
  }

  loadDeliveryOptions(): void {
    this.loadingDelivery = true;
    this.deliveryService.getActive().pipe(
      takeUntil(this.destroy$),
      finalize(() => (this.loadingDelivery = false))
    ).subscribe({
      next: options => {
        this.deliveryOptions = options;
        if (options.length > 0 && !this.selectedDeliveryId) {
          this.selectedDeliveryId = options[0].id;
          if (this.selectedAddressId) this.fetchPreview();
        }
      },
      error: () => {
        this.deliveryOptions = [];
      },
    });
  }

  selectAddress(id: string): void {
    this.selectedAddressId = id;
    if (this.selectedDeliveryId) this.fetchPreview();
  }

  selectDelivery(id: string): void {
    this.selectedDeliveryId = id;
    if (this.selectedAddressId) this.fetchPreview();
  }

  setDefaultAddress(id: string, event: Event): void {
    event.stopPropagation();
    this.addressService.setDefault(id).subscribe({
      next: updated => {
        this.addresses.forEach(a => (a.is_default = a.id === updated.id));
      },
    });
  }

  removeAddress(id: string, event: Event): void {
    event.stopPropagation();
    this.addressService.remove(id).subscribe({
      next: () => {
        this.addresses = this.addresses.filter(a => a.id !== id);
        if (this.selectedAddressId === id) {
          this.selectedAddressId = this.addresses[0]?.id || "";
          if (this.selectedAddressId && this.selectedDeliveryId) {
            this.fetchPreview();
          } else {
            this.preview = null;
          }
        }
      },
    });
  }

  openAddAddressModal(): void {
    this.addressError = "";
    this.newAddress = {
      name: "",
      phone: "",
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "US",
      type: "home",
      is_default: this.addresses.length === 0,
    };
    this.showAddAddressModal = true;
  }

  closeAddAddressModal(): void {
    this.showAddAddressModal = false;
  }

  saveNewAddress(): void {
    if (!this.newAddress.name.trim() || !this.newAddress.street.trim() ||
        !this.newAddress.city.trim() || !this.newAddress.zip.trim() ||
        !this.newAddress.phone.trim()) {
      this.addressError = "Please fill in all required fields.";
      return;
    }

    this.addressService.create(this.newAddress).subscribe({
      next: created => {
        this.addresses.push(created);
        this.selectedAddressId = created.id;
        this.showAddAddressModal = false;
        if (this.selectedDeliveryId) this.fetchPreview();
      },
      error: (err: Error) => {
        this.addressError = err.message;
      },
    });
  }

  fetchPreview(): void {
    if (!this.selectedAddressId || !this.selectedDeliveryId) return;
    this.loadingPreview = true;
    this.checkoutService.preview({
      address_id: this.selectedAddressId,
      delivery_option_id: this.selectedDeliveryId,
    }).pipe(
      takeUntil(this.destroy$),
      finalize(() => (this.loadingPreview = false))
    ).subscribe({
      next: res => {
        this.preview = res;
      },
      error: () => {},
    });
  }

  get totalAmount(): number {
    if (this.preview?.total != null) return Number(this.preview.total) || 0;
    if (this.cart?.total != null) return Number(this.cart.total) || 0;
    return 0;
  }

  get subtotalAmount(): number {
    if (this.preview?.subtotal != null) return Number(this.preview.subtotal) || 0;
    if (this.cart?.subtotal != null) return Number(this.cart.subtotal) || 0;
    return 0;
  }

  get promoDiscountAmount(): number {
    if (this.preview?.promo_discount != null) return Number(this.preview.promo_discount) || 0;
    if (this.cart?.promo_discount != null) return Number(this.cart.promo_discount) || 0;
    return 0;
  }

  get deliveryCostAmount(): number {
    if (this.preview?.delivery_cost != null) return Number(this.preview.delivery_cost) || 0;
    if (this.selectedDelivery?.price != null) return Number(this.selectedDelivery.price) || 0;
    return 0;
  }

  get giftWrapCostAmount(): number {
    if (this.preview?.gift_wrap_cost != null) return Number(this.preview.gift_wrap_cost) || 0;
    if (this.cart?.gift_wrap_cost != null) return Number(this.cart.gift_wrap_cost) || 0;
    return 0;
  }

  getItemLineTotal(item: CartItem): number {
    return (Number(item.unit_price) || 0) * item.quantity;
  }

  getItemCompareTotal(item: CartItem): number {
    return (Number(item.product?.compare_price) || 0) * item.quantity;
  }

  hasComparePrice(item: CartItem): boolean {
    return !!(item.product?.compare_price && Number(item.product.compare_price) > Number(item.unit_price));
  }

  get selectedAddress(): Address | undefined {
    return this.addresses.find(a => a.id === this.selectedAddressId);
  }

  get selectedDelivery(): DeliveryOption | undefined {
    return this.deliveryOptions.find(d => d.id === this.selectedDeliveryId);
  }

  // --- Step 3: Payment ------------------------------------------------------

  loadSavedPaymentMethods(): void {
    if (!this.authService.getAccessToken()) return;
    this.paymentMethodService.list().pipe(takeUntil(this.destroy$)).subscribe({
      next: cards => {
        this.savedCards = cards;
        if (cards.length > 0) {
          this.selectedSavedCardId = cards[0].id;
        }
      },
      error: () => {
        this.savedCards = [];
      },
    });
  }

  deleteSavedCard(id: string, event: Event): void {
    event.stopPropagation();
    this.paymentMethodService.remove(id).subscribe({
      next: () => {
        this.savedCards = this.savedCards.filter(c => c.id !== id);
        if (this.selectedSavedCardId === id) {
          this.selectedSavedCardId = this.savedCards[0]?.id || null;
        }
      },
    });
  }

  checkGiftCardBalance(): void {
    if (!this.giftCard.number.trim() || !this.giftCard.pin.trim()) {
      this.giftCard.error = "Please enter gift card number and PIN.";
      return;
    }
    this.giftCard.error = "";
    this.giftCard.checking = true;

    this.giftCardService.check({
      number: this.giftCard.number.trim(),
      pin: this.giftCard.pin.trim(),
    }).pipe(
      finalize(() => (this.giftCard.checking = false))
    ).subscribe({
      next: res => {
        this.giftCard.balance = res.balance;
        this.giftCard.checked = true;
      },
      error: (err: Error) => {
        this.giftCard.error = err.message;
        this.giftCard.balance = null;
      },
    });
  }

  placeOrder(): void {
    if (!this.selectedAddressId || !this.selectedDeliveryId) {
      this.activeStep = 1;
      return;
    }
    if (this.submittingOrder) return;

    this.orderError = null;
    this.stockErrorItems = [];
    this.submittingOrder = true;

    if (this.paymentMethod === "CARD") {
      if (this.selectedSavedCardId) {
        // Paying with an existing saved card (we don't re-tokenize)
        this.submitPlaceOrder({
          address_id: this.selectedAddressId,
          delivery_option_id: this.selectedDeliveryId,
          payment_method: "CARD",
          save_card: false,
        });
      } else {
        // Tokenise card details via mock PaymentTokenService (never send raw card to API)
        this.paymentTokenService.tokenize({
          number: this.cardDetails.number,
          name: this.cardDetails.name,
          expiry: this.cardDetails.expiry,
          cvv: this.cardDetails.cvv,
        }).subscribe({
          next: tokenized => {
            this.submitPlaceOrder({
              address_id: this.selectedAddressId,
              delivery_option_id: this.selectedDeliveryId,
              payment_method: "CARD",
              payment_token: tokenized.token,
              save_card: this.cardDetails.saveCard,
            });
          },
          error: (err: Error) => {
            this.submittingOrder = false;
            this.orderError = err.message || "Failed to tokenize card";
          },
        });
      }
    } else if (this.paymentMethod === "COD") {
      this.submitPlaceOrder({
        address_id: this.selectedAddressId,
        delivery_option_id: this.selectedDeliveryId,
        payment_method: "COD",
      });
    } else if (this.paymentMethod === "GIFT_CARD") {
      if (!this.giftCard.number || !this.giftCard.pin) {
        this.orderError = "Please enter gift card number and PIN.";
        this.submittingOrder = false;
        return;
      }
      this.submitPlaceOrder({
        address_id: this.selectedAddressId,
        delivery_option_id: this.selectedDeliveryId,
        payment_method: "GIFT_CARD",
        gift_card: {
          number: this.giftCard.number.trim(),
          pin: this.giftCard.pin.trim(),
        },
      });
    }
  }

  private submitPlaceOrder(payload: PlaceOrderRequest): void {
    this.checkoutService.placeOrder(payload, this.idempotencyKey).pipe(
      finalize(() => (this.submittingOrder = false))
    ).subscribe({
      next: order => {
        this.lastOrder = order;
        this.activeStep = 3;
        this.regenerateIdempotencyKey();
        this.cartService.load().subscribe(); // Cart is now emptied by backend
        window.scrollTo({ top: 0, behavior: "smooth" });
      },
      error: (err: Error) => {
        const msg = err.message || "Order placement failed";
        if (msg.toLowerCase().includes("stock") || msg.toLowerCase().includes("inventory")) {
          // Stock error: return to step 0 so user can adjust quantities
          this.orderError = msg;
          this.activeStep = 0;
          this.loadCart();
        } else {
          // Payment/validation error: stay on step 2
          this.orderError = msg;
        }
      },
    });
  }

  // --- Confirmation Helpers -------------------------------------------------

  continueShopping(): void {
    this.router.navigate(["/shop"]);
  }

  goToOrders(): void {
    this.router.navigate(["/profile"]);
  }
}
