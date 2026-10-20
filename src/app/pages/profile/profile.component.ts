import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { takeUntil, finalize } from "rxjs/operators";
import { AuthService } from "../../services/auth.service";
import { OrderService } from "../../services/order.service";
import { LikeService } from "../../services/like.service";
import { AddressService } from "../../services/address.service";
import { PaymentMethodService } from "../../services/payment-method.service";
import {
  User,
  Order,
  OrderStatus,
  Product,
  Address,
  AddressCreate,
  SavedPaymentMethod
} from "../../models/api.models";

type ProfileTab = "profile" | "password" | "orders" | "favorites" | "addresses" | "cards";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent implements OnInit, OnDestroy {
  activeTab: ProfileTab = "profile";
  user: User | null = null;
  loadingUser = true;

  // Profile Edit
  profileForm = {
    first_name: "",
    last_name: "",
    phone: "",
  };
  profileSaving = false;
  profileSuccess = "";
  profileError = "";

  // Password Change
  passwordForm = {
    current_password: "",
    new_password: "",
    confirm_password: "",
  };
  passwordSaving = false;
  passwordSuccess = "";
  passwordError = "";

  // Orders Tab
  orders: Order[] = [];
  loadingOrders = false;
  selectedOrderStatus: OrderStatus | "ALL" = "ALL";
  ordersPage = 1;
  ordersPageSize = 5;
  totalOrders = 0;
  totalOrderPages = 1;
  selectedOrderDetail: Order | null = null;
  cancellingOrderId: string | null = null;
  orderActionMsg = "";

  // Favorites Tab
  favorites: Product[] = [];
  loadingFavorites = false;
  favoritesPage = 1;
  totalFavorites = 0;

  // Addresses Tab
  addresses: Address[] = [];
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

  // Saved Cards Tab
  cards: SavedPaymentMethod[] = [];
  loadingCards = false;

  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private orderService: OrderService,
    private likeService: LikeService,
    private addressService: AddressService,
    private paymentMethodService: PaymentMethodService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  switchTab(tab: ProfileTab): void {
    this.activeTab = tab;
    this.clearMessages();
    if (tab === "orders" && this.orders.length === 0) {
      this.loadOrders();
    } else if (tab === "favorites" && this.favorites.length === 0) {
      this.loadFavorites();
    } else if (tab === "addresses" && this.addresses.length === 0) {
      this.loadAddresses();
    } else if (tab === "cards" && this.cards.length === 0) {
      this.loadCards();
    }
  }

  private clearMessages(): void {
    this.profileSuccess = "";
    this.profileError = "";
    this.passwordSuccess = "";
    this.passwordError = "";
    this.orderActionMsg = "";
    this.addressError = "";
  }

  // --- Profile Tab ----------------------------------------------------------

  loadCurrentUser(): void {
    this.loadingUser = true;
    this.authService.me().pipe(
      takeUntil(this.destroy$),
      finalize(() => (this.loadingUser = false))
    ).subscribe({
      next: user => {
        this.user = user;
        this.profileForm = {
          first_name: user.first_name || "",
          last_name: user.last_name || "",
          phone: user.phone || "",
        };
      },
      error: () => {
        this.router.navigate(["/login"]);
      },
    });
  }

  saveProfile(): void {
    this.profileSaving = true;
    this.profileSuccess = "";
    this.profileError = "";

    this.authService.updateMe(this.profileForm).pipe(
      finalize(() => (this.profileSaving = false))
    ).subscribe({
      next: updated => {
        this.user = updated;
        this.profileSuccess = "Profile updated successfully!";
      },
      error: (err: Error) => {
        this.profileError = err.message || "Failed to update profile";
      },
    });
  }

  // --- Password Tab ---------------------------------------------------------

  changePassword(): void {
    if (!this.passwordForm.current_password || !this.passwordForm.new_password) {
      this.passwordError = "Please fill in all password fields.";
      return;
    }
    if (this.passwordForm.new_password !== this.passwordForm.confirm_password) {
      this.passwordError = "New passwords do not match.";
      return;
    }
    if (this.passwordForm.new_password.length < 6) {
      this.passwordError = "New password must be at least 6 characters.";
      return;
    }

    this.passwordSaving = true;
    this.passwordSuccess = "";
    this.passwordError = "";

    this.authService.changePassword({
      current_password: this.passwordForm.current_password,
      new_password: this.passwordForm.new_password,
    }).pipe(
      finalize(() => (this.passwordSaving = false))
    ).subscribe({
      next: () => {
        this.passwordSuccess = "Password updated successfully!";
        this.passwordForm = { current_password: "", new_password: "", confirm_password: "" };
      },
      error: (err: Error) => {
        this.passwordError = err.message || "Failed to change password";
      },
    });
  }

  // --- Orders Tab -----------------------------------------------------------

  loadOrders(page = 1): void {
    this.loadingOrders = true;
    this.ordersPage = page;
    const filter = this.selectedOrderStatus === "ALL" ? undefined : this.selectedOrderStatus;

    this.orderService.getMyOrders({
      page,
      page_size: this.ordersPageSize,
      status: filter,
    }).pipe(
      takeUntil(this.destroy$),
      finalize(() => (this.loadingOrders = false))
    ).subscribe({
      next: res => {
        this.orders = res.items;
        this.totalOrders = res.total;
        this.totalOrderPages = res.pages;
      },
      error: () => {
        this.orders = [];
      },
    });
  }

  filterOrdersByStatus(status: OrderStatus | "ALL"): void {
    this.selectedOrderStatus = status;
    this.selectedOrderDetail = null;
    this.loadOrders(1);
  }

  viewOrderDetail(order: Order): void {
    this.selectedOrderDetail = order;
  }

  closeOrderDetail(): void {
    this.selectedOrderDetail = null;
  }

  canCancelOrder(order: Order): boolean {
    return ["PENDING", "PAID", "PROCESSING"].includes(order.status);
  }

  cancelOrder(order: Order, event?: Event): void {
    if (event) event.stopPropagation();
    if (!confirm(`Are you sure you want to cancel order #${order.order_number}?`)) return;

    this.cancellingOrderId = order.id;
    this.orderActionMsg = "";

    this.orderService.cancel(order.id).pipe(
      finalize(() => (this.cancellingOrderId = null))
    ).subscribe({
      next: updated => {
        order.status = updated.status;
        if (this.selectedOrderDetail?.id === order.id) {
          this.selectedOrderDetail.status = updated.status;
        }
        this.orderActionMsg = `Order #${order.order_number} has been cancelled.`;
      },
      error: (err: Error) => {
        this.orderActionMsg = `Failed to cancel order: ${err.message}`;
      },
    });
  }

  // --- Favorites Tab --------------------------------------------------------

  loadFavorites(page = 1): void {
    this.loadingFavorites = true;
    this.favoritesPage = page;

    this.likeService.getFavorites(page, 12).pipe(
      takeUntil(this.destroy$),
      finalize(() => (this.loadingFavorites = false))
    ).subscribe({
      next: res => {
        this.favorites = res.items;
        this.totalFavorites = res.total;
      },
      error: () => {
        this.favorites = [];
      },
    });
  }

  unlikeProduct(productId: string, event: Event): void {
    event.stopPropagation();
    this.likeService.unlike(productId).subscribe({
      next: () => {
        this.favorites = this.favorites.filter(p => p.id !== productId);
        this.totalFavorites = Math.max(0, this.totalFavorites - 1);
      },
    });
  }

  // --- Addresses Tab --------------------------------------------------------

  loadAddresses(): void {
    this.loadingAddresses = true;
    this.addressService.list().pipe(
      takeUntil(this.destroy$),
      finalize(() => (this.loadingAddresses = false))
    ).subscribe({
      next: addrs => {
        this.addresses = addrs;
      },
      error: () => {
        this.addresses = [];
      },
    });
  }

  setDefaultAddress(id: string): void {
    this.addressService.setDefault(id).subscribe({
      next: updated => {
        this.addresses.forEach(a => (a.is_default = a.id === updated.id));
      },
    });
  }

  deleteAddress(id: string): void {
    if (!confirm("Are you sure you want to delete this address?")) return;
    this.addressService.remove(id).subscribe({
      next: () => {
        this.addresses = this.addresses.filter(a => a.id !== id);
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

  saveAddress(): void {
    if (!this.newAddress.name.trim() || !this.newAddress.street.trim() ||
        !this.newAddress.city.trim() || !this.newAddress.zip.trim() ||
        !this.newAddress.phone.trim()) {
      this.addressError = "Please fill in all required fields.";
      return;
    }

    this.addressService.create(this.newAddress).subscribe({
      next: created => {
        this.addresses.push(created);
        this.showAddAddressModal = false;
      },
      error: (err: Error) => {
        this.addressError = err.message;
      },
    });
  }

  // --- Saved Cards Tab ------------------------------------------------------

  loadCards(): void {
    this.loadingCards = true;
    this.paymentMethodService.list().pipe(
      takeUntil(this.destroy$),
      finalize(() => (this.loadingCards = false))
    ).subscribe({
      next: cards => {
        this.cards = cards;
      },
      error: () => {
        this.cards = [];
      },
    });
  }

  deleteCard(id: string): void {
    if (!confirm("Remove this saved payment method?")) return;
    this.paymentMethodService.remove(id).subscribe({
      next: () => {
        this.cards = this.cards.filter(c => c.id !== id);
      },
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
