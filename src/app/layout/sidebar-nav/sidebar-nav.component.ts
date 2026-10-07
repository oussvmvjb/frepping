import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Inject,
  PLATFORM_ID,
  HostListener,
  ElementRef,
  ViewChild,
  NgZone,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { BranchedMenuComponent, BranchedSection } from '../../shared/components/branched-menu/branched-menu.component';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category.model';

const HIDDEN_PATH_PREFIXES = ['/login', '/register', '/admin'];

@Component({
  selector: 'app-sidebar-nav',
  standalone: true,
  imports: [CommonModule, RouterModule, BranchedMenuComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sidebar-nav.component.html',
  styleUrls: ['./sidebar-nav.component.scss'],
})
export class SidebarNavComponent implements OnInit, OnDestroy {
  @ViewChild('toggleBtn') toggleBtnRef?: ElementRef<HTMLButtonElement>;
  @ViewChild('mobilePanel') mobilePanelRef?: ElementRef<HTMLElement>;

  // ── State ───────────────────────────────────────────────────────────────────
  isMobile = false;
  mobileOpen = false;
  hideSidebar = false;
  activeRoute = '';
  menuItems: BranchedSection[] = [];

  private destroy$ = new Subject<void>();
  private _isBrowser = false;
  private mediaQueryList?: MediaQueryList;
  private mediaListener?: (e: MediaQueryListEvent) => void;
  private _prevBodyOverflow = '';

  constructor(
    private router: Router,
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this._isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this._initResponsive();
    this._computeRouteState(this.router.url);
    this._buildInitialMenu();
    this._loadCategories();

    // Listen to route changes
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .pipe()
      .subscribe((e) => {
        this._computeRouteState(e.urlAfterRedirects || e.url);
        if (this.mobileOpen) {
          this.closeMobile();
        }
        this.cdr.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    if (this._isBrowser) {
      if (this.mediaQueryList && this.mediaListener) {
        this.mediaQueryList.removeEventListener('change', this.mediaListener);
      }
      this._unlockBodyScroll();
    }
  }

  // ── Responsive handling ─────────────────────────────────────────────────────

  private _initResponsive(): void {
    if (!this._isBrowser) return;

    this.mediaQueryList = window.matchMedia('(max-width: 768px)');
    this.isMobile = this.mediaQueryList.matches;

    this.mediaListener = (e: MediaQueryListEvent) => {
      this.ngZone.run(() => {
        this.isMobile = e.matches;
        if (!this.isMobile && this.mobileOpen) {
          this.closeMobile();
        }
        this.cdr.markForCheck();
      });
    };

    this.mediaQueryList.addEventListener('change', this.mediaListener);
  }

  // ── Menu Data Builder ───────────────────────────────────────────────────────

  private _buildInitialMenu(): void {
    this.menuItems = [
      {
        label: 'HOME',
        value: '/',
        icon: 'fas fa-home',
      },
      {
        label: 'SHOP',
        icon: 'fas fa-shopping-bag',
        children: [
          { label: 'All Products', value: '/shop', icon: 'fas fa-th-large' },
        ],
      },
      {
        label: 'ACCOUNT',
        icon: 'fas fa-user-circle',
        children: [
          { label: 'Profile', value: '/profile', icon: 'fas fa-id-card' },
          { label: 'Cart', value: '/cart', icon: 'fas fa-shopping-cart' },
          { label: 'Seller Hub', value: '/seller', icon: 'fas fa-store' },
        ],
      },
      {
        label: 'EXPLORE',
        icon: 'fas fa-compass',
        children: [
          { label: '3D Try-On', value: '/try-on', icon: 'fas fa-vr-cardboard' },
          { label: 'Store Page', value: '/stores/main', icon: 'fas fa-map-marker-alt' },
        ],
      },
    ];
  }

  private _loadCategories(): void {
    this.categoryService
      .getCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (cats: Category[]) => {
          if (!cats || cats.length === 0) return;
          this._mergeCategoriesIntoMenu(cats);
          this.cdr.markForCheck();
        },
        error: () => {
          // Keep existing menu if categories request fails
        },
      });
  }

  private _mergeCategoriesIntoMenu(categories: Category[]): void {
    const shopChildren: { label: string; value: string; icon?: string }[] = [
      { label: 'All Products', value: '/shop', icon: 'fas fa-th-large' },
    ];

    categories.forEach((cat) => {
      shopChildren.push({
        label: cat.name,
        value: `/shop?category_id=${cat.id}`,
        icon: 'fas fa-tag',
      });
    });

    this.menuItems = this.menuItems.map((sec) => {
      if (sec.label === 'SHOP') {
        return {
          ...sec,
          children: shopChildren,
        };
      }
      return sec;
    });
  }

  // ── Route & State Sync ──────────────────────────────────────────────────────

  private _computeRouteState(url: string): void {
    const cleanUrl = url.split('#')[0];
    this.activeRoute = cleanUrl;

    this.hideSidebar = HIDDEN_PATH_PREFIXES.some((prefix) =>
      cleanUrl.startsWith(prefix)
    );
  }

  onSelectMenuItem(event: { value: string; item: any }): void {
    if (!event.value) return;

    if (this.mobileOpen) {
      this.closeMobile();
    }

    this.router.navigateByUrl(event.value);
  }

  // ── Mobile Drawer & Accessibility ──────────────────────────────────────────

  toggleMobile(): void {
    if (this.mobileOpen) {
      this.closeMobile();
    } else {
      this.openMobile();
    }
  }

  openMobile(): void {
    this.mobileOpen = true;
    this._lockBodyScroll();
    this.cdr.markForCheck();

    // Focus panel after opening
    setTimeout(() => {
      if (this.mobilePanelRef?.nativeElement) {
        this.mobilePanelRef.nativeElement.focus();
      }
    }, 50);
  }

  closeMobile(): void {
    this.mobileOpen = false;
    this._unlockBodyScroll();
    this.cdr.markForCheck();

    // Return focus to toggle button
    if (this.toggleBtnRef?.nativeElement) {
      this.toggleBtnRef.nativeElement.focus();
    }
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.mobileOpen) {
      this.closeMobile();
      event.preventDefault();
      return;
    }

    // Simple focus trap inside mobile dialog
    if (this.mobileOpen && event.key === 'Tab' && this.mobilePanelRef?.nativeElement) {
      const panel = this.mobilePanelRef.nativeElement;
      const focusable = panel.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length > 0) {
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          last.focus();
          event.preventDefault();
        } else if (!event.shiftKey && document.activeElement === last) {
          first.focus();
          event.preventDefault();
        }
      }
    }
  }

  private _lockBodyScroll(): void {
    if (!this._isBrowser) return;
    this._prevBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }

  private _unlockBodyScroll(): void {
    if (!this._isBrowser) return;
    document.body.style.overflow = this._prevBodyOverflow || '';
  }
}
