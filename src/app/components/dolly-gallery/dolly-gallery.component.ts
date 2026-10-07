import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  OnChanges,
  AfterViewChecked,
  SimpleChanges,
  ElementRef,
  NgZone,
  ChangeDetectionStrategy,
  PLATFORM_ID,
  Inject,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

export interface DollyGalleryItem {
  src: string;
  alt?: string;
  label?: string;
  id?: any;
}

@Component({
  selector: 'app-dolly-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dolly-gallery.component.html',
  styleUrls: ['./dolly-gallery.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DollyGalleryComponent
  implements OnInit, OnDestroy, OnChanges, AfterViewChecked
{
  // ── Inputs ───────────────────────────────────────────────────────────────
  @Input() images: (string | DollyGalleryItem)[] = [];
  @Input() infinite = true;
  @Input() itemWidth = 170;
  @Input() aspectRatio = 0.8;
  @Input() borderRadius = 7;
  @Input() grayscale = 1;
  @Input() perspective = 1000;
  @Input() spacing = 800;
  @Input() spread = 0.8;
  @Input() scatter = 0.1;
  @Input() revealRange = 1.5;
  @Input() passRange = 1;
  @Input() parallaxX = 0.12;
  @Input() parallaxY = 0.06;
  @Input() parallaxSmooth = 0.85;
  @Input() tilt = 4;
  @Input() pulse = 0.03;
  @Input() drift = 0.08;
  @Input() smooth = 0.85;
  @Input() wheelSpeed = 1.0;
  @Input() dragSpeed = 1.5;
  @Input() autoScroll = 0;
  @Input() pauseOnHover = true;
  @Input() backgroundColor = 'transparent';
  @Input() height = '70vh';

  // ── Outputs ──────────────────────────────────────────────────────────────
  @Output() indexChange = new EventEmitter<number>();
  @Output() itemClick = new EventEmitter<{ index: number; item: any }>();

  // ── Template-visible state ───────────────────────────────────────────────
  items: DollyGalleryItem[] = [];
  hasInteracted = false;
  focusedIndex = 0;

  // ── Internal animation state ─────────────────────────────────────────────
  private isBrowser: boolean;
  private rafId: number | null = null;
  private targetScroll = 0;
  private currentScroll = 0;
  private prevScroll = 0;
  private velocity = 0;

  private pointerNormX = 0;
  private pointerNormY = 0;
  private smoothPointerX = 0;
  private smoothPointerY = 0;

  private containerWidth = 0;
  private containerHeight = 0;
  private actualItemWidth = 120;
  private actualItemHeight = 150;

  private isDragging = false;
  private dragStartY = 0;
  private dragStartX = 0;
  private dragScrollStart = 0;
  private dragMovedPx = 0;

  private isHovered = false;
  private lastInputTime = 0;
  private readonly idleThreshold = 150;

  private reducedMotion = false;

  private itemEls: HTMLElement[] = [];
  private labelEls: HTMLElement[] = [];
  private containerEl: HTMLElement | null = null;
  private hostEl: HTMLElement;

  private resizeObserver: ResizeObserver | null = null;
  private intersectionObserver: IntersectionObserver | null = null;
  private isVisible = true;

  private lastFrameTime = 0;
  private needsElCache = true;
  private cachedItemCount = 0;

  constructor(
    private el: ElementRef<HTMLElement>,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.hostEl = this.el.nativeElement;
  }

  ngOnInit(): void {
    if (!this.isBrowser) return;
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.normalizeItems();
  }

  ngAfterViewChecked(): void {
    if (!this.isBrowser) return;
    const currentCount = this.items.length;
    if (this.needsElCache || this.cachedItemCount !== currentCount) {
      this.cacheElements();
      this.cachedItemCount = currentCount;
      this.needsElCache = false;

      if (!this.containerEl) this.setupContainer();
      if (!this.rafId && this.items.length > 0) this.startRaf();
    }
  }

  ngOnDestroy(): void {
    this.stopRaf();
    this.resizeObserver?.disconnect();
    this.intersectionObserver?.disconnect();
    if (this.hostEl) {
      this.hostEl.removeEventListener('wheel', this.onWheel);
    }
    if (this.containerEl) {
      this.containerEl.removeEventListener('pointerdown', this.onPointerDown);
      this.containerEl.removeEventListener('pointermove', this.onPointerMoveParallax);
      this.containerEl.removeEventListener('pointerenter', this.onPointerEnter);
      this.containerEl.removeEventListener('pointerleave', this.onPointerLeave);
      this.containerEl.removeEventListener('keydown', this.onKeyDown);
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('pointermove', this.onPointerMove);
      window.removeEventListener('pointerup', this.onPointerUp);
      window.removeEventListener('pointercancel', this.onPointerUp);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.isBrowser) return;
    if (changes['images']) {
      this.normalizeItems();
      this.needsElCache = true;
      this.clampScroll();
      if (this.isVisible && !this.rafId && this.items.length > 0) {
        this.startRaf();
      }
    }
  }

  private normalizeItems(): void {
    this.items = (this.images || []).map((img) => {
      if (typeof img === 'string') return { src: img, alt: '', label: '' };
      const di = img as DollyGalleryItem;
      return { src: di.src, alt: di.alt || '', label: di.label || '', id: di.id };
    });
  }

  makePlaceholderSvg(label: string): string {
    const initials = (label || '')
      .split(' ')
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() || '')
      .join('');
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='120' height='150' viewBox='0 0 120 150'>` +
      `<rect width='120' height='150' fill='#1a1a1a'/>` +
      `<text x='60' y='70' font-family='sans-serif' font-size='28' fill='#39ff14' font-weight='bold' text-anchor='middle' dominant-baseline='middle'>${initials}</text>` +
      `<text x='60' y='105' font-family='sans-serif' font-size='10' fill='#888888' text-anchor='middle' letter-spacing='2'>${(label || '').toUpperCase().slice(0, 12)}</text>` +
      `</svg>`;
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  }

  scrollToIndex(index: number): void {
    if (index < 0 || index >= this.items.length) return;
    this.hasInteracted = true;
    this.lastInputTime = performance.now();
    this.targetScroll = index * this.spacing;
    if (!this.rafId) this.startRaf();
  }

  onDotHover(index: number): void {
    this.scrollToIndex(index);
  }

  onFooterWheel(e: WheelEvent): void {
    const n = this.items.length;
    if (n <= 1) return;
    const maxScroll = (n - 1) * this.spacing;

    if (!this.infinite) {
      if (this.currentScroll >= maxScroll - 15 && e.deltaY > 0) return;
      if (this.currentScroll <= 15 && e.deltaY < 0) return;
    }

    e.preventDefault();
    e.stopPropagation();
    this.hasInteracted = true;
    this.lastInputTime = performance.now();
    this.targetScroll += e.deltaY * this.wheelSpeed;
    if (!this.infinite) {
      this.targetScroll = Math.max(0, Math.min(this.targetScroll, maxScroll));
    }
    if (!this.rafId) this.startRaf();
  }

  private setupContainer(): void {
    this.containerEl = this.hostEl.querySelector('.dolly-container');
    if (!this.containerEl) return;

    this.measureContainer();

    this.resizeObserver = new ResizeObserver(() => {
      this.measureContainer();
      this.updateItemSizes();
      if (!this.rafId && this.items.length > 0) this.startRaf();
    });
    this.resizeObserver.observe(this.containerEl);

    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        this.isVisible = entries[0]?.isIntersecting ?? true;
        if (this.isVisible && !this.rafId && this.items.length > 0) {
          this.startRaf();
        } else if (!this.isVisible) {
          this.stopRaf();
        }
      },
      { threshold: 0.05 }
    );
    this.intersectionObserver.observe(this.containerEl);

    this.bindEvents();
  }

  private measureContainer(): void {
    if (!this.containerEl) return;
    this.containerWidth = this.containerEl.clientWidth || 300;
    this.containerHeight = this.containerEl.clientHeight || 400;
    this.actualItemWidth = Math.min(this.itemWidth, this.containerWidth * 0.8);
    this.actualItemHeight = this.actualItemWidth / this.aspectRatio;
  }

  private updateItemSizes(): void {
    this.itemEls.forEach((el) => {
      el.style.width = `${this.actualItemWidth}px`;
      el.style.height = `${this.actualItemHeight}px`;
    });
  }

  private cacheElements(): void {
    if (!this.containerEl) {
      this.containerEl = this.hostEl.querySelector('.dolly-container');
    }
    this.itemEls = Array.from(
      this.containerEl?.querySelectorAll<HTMLElement>('.dolly-item') || []
    );
    this.labelEls = Array.from(
      this.containerEl?.querySelectorAll<HTMLElement>('.dolly-label') || []
    );
    this.measureContainer();
    this.updateItemSizes();
  }

  private clampScroll(): void {
    if (!this.infinite) {
      const max = Math.max(0, (this.items.length - 1) * this.spacing);
      this.targetScroll = Math.max(0, Math.min(this.targetScroll, max));
    }
  }

  private startRaf(): void {
    if (this.rafId !== null) return;
    this.ngZone.runOutsideAngular(() => {
      const loop = (ts: number) => {
        if (!this.isVisible) {
          this.rafId = null;
          return;
        }
        const dt = Math.min((ts - (this.lastFrameTime || ts)) / 1000, 0.05);
        this.lastFrameTime = ts;
        const isStillAnimating = this.tick(dt);
        if (isStillAnimating) {
          this.rafId = requestAnimationFrame(loop);
        } else {
          this.rafId = null;
        }
      };
      this.rafId = requestAnimationFrame(loop);
    });
  }

  private stopRaf(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  private tick(dt: number): boolean {
    const n = this.items.length;
    if (n === 0 || this.itemEls.length === 0) return false;

    // Single item edge case
    if (n === 1) {
      const el = this.itemEls[0];
      if (el) {
        el.style.visibility = 'visible';
        el.style.opacity = '1';
        el.style.transform = `translate(-50%,-50%) translate3d(0,0,0) scale(1)`;
        if (this.labelEls[0]) this.labelEls[0].style.opacity = '1';
      }
      return false;
    }

    const maxScroll = (n - 1) * this.spacing;

    // Auto-scroll travel
    if (this.autoScroll !== 0 && !(this.pauseOnHover && this.isHovered) && !this.reducedMotion) {
      this.targetScroll += this.autoScroll * dt;
    }

    // Snap to nearest image when idle
    const isIdle = !this.isDragging && performance.now() - this.lastInputTime > this.idleThreshold;
    if (isIdle && this.autoScroll === 0) {
      const nearest = Math.round(this.targetScroll / this.spacing) * this.spacing;
      const clampedNearest = this.infinite ? nearest : Math.max(0, Math.min(nearest, maxScroll));
      this.targetScroll += (clampedNearest - this.targetScroll) * (this.reducedMotion ? 1 : 0.08);
    }

    // Clamp finite scroll
    if (!this.infinite) {
      this.targetScroll = Math.max(0, Math.min(this.targetScroll, maxScroll));
    }

    // Lerp scroll
    const lerpK = 1 - Math.pow(Math.max(0, Math.min(this.smooth, 0.9999)), dt * 60);
    this.prevScroll = this.currentScroll;
    this.currentScroll += (this.targetScroll - this.currentScroll) * lerpK;
    this.velocity = this.currentScroll - this.prevScroll;

    // Lerp pointer
    const pK = 1 - Math.pow(Math.max(0, Math.min(this.parallaxSmooth, 0.9999)), dt * 60);
    this.smoothPointerX += (this.pointerNormX - this.smoothPointerX) * pK;
    this.smoothPointerY += (this.pointerNormY - this.smoothPointerY) * pK;

    const totalDepth = n * this.spacing;
    const normVel = Math.min(Math.abs(this.velocity) / (this.spacing * 0.05), 1);

    // Compute depth for each item & find nearest to focus
    let minDist = Infinity;
    let newFocusIdx = 0;
    const dArr = new Float64Array(n);

    for (let i = 0; i < n; i++) {
      let d = i * this.spacing - this.currentScroll;
      if (this.infinite && n > 1) {
        const half = totalDepth / 2;
        d = ((d + half) % totalDepth + totalDepth) % totalDepth - half;
      }
      dArr[i] = d;
      const ad = Math.abs(d);
      if (ad < minDist) {
        minDist = ad;
        newFocusIdx = i;
      }
    }

    // Apply transforms
    for (let i = 0; i < n; i++) {
      const el = this.itemEls[i];
      if (!el) continue;

      const d = dArr[i];
      const steps = d / this.spacing;

      if (steps > this.revealRange || steps < -this.passRange) {
        el.style.visibility = 'hidden';
        el.style.opacity = '0';
        if (this.labelEls[i]) this.labelEls[i].style.opacity = '0';
        continue;
      }

      el.style.visibility = 'visible';

      // Opacity fade in/out
      const opacity = steps > 0
        ? Math.max(0, 1 - Math.min(steps / this.revealRange, 1))
        : Math.max(0, 1 - Math.min(-steps / this.passRange, 1));

      // Lateral and vertical scatter
      const sideSign = i % 2 === 0 ? -1 : 1;
      const lateralOffset = sideSign * this.spread * this.actualItemWidth;
      const pseudoRand = Math.sin(i * 127.1 + 311.7) * 0.5 + 0.5;
      const vertScatter = (pseudoRand * 2 - 1) * this.scatter * this.actualItemHeight;

      let tx = lateralOffset;
      let ty = vertScatter;
      const tz = -d;
      let rx = 0;
      let ry = 0;
      let sc = 1;

      // Drift against scroll direction
      if (!this.reducedMotion) {
        ty -= Math.sign(this.velocity) * this.drift * this.actualItemHeight * Math.min(normVel, 1);
      }

      // Focus enhancements
      if (i === newFocusIdx && !this.reducedMotion) {
        tx += this.smoothPointerX * this.parallaxX * this.actualItemWidth;
        ty += this.smoothPointerY * this.parallaxY * this.actualItemHeight;
        rx = -this.smoothPointerY * this.tilt * normVel;
        ry = this.smoothPointerX * this.tilt * normVel;
        sc = 1 + this.pulse * normVel;
      }

      el.style.opacity = opacity.toFixed(3);
      el.style.transform = `translate(-50%,-50%) translate3d(${tx.toFixed(1)}px,${ty.toFixed(1)}px,${tz.toFixed(1)}px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) scale(${sc.toFixed(4)})`;

      if (this.labelEls[i]) {
        this.labelEls[i].style.opacity = opacity > 0.6 ? ((opacity - 0.6) / 0.4).toFixed(3) : '0';
      }
    }

    // Focus change
    if (newFocusIdx !== this.focusedIndex) {
      this.focusedIndex = newFocusIdx;
      this.ngZone.run(() => {
        this.indexChange.emit(this.focusedIndex);
        this.cdr.markForCheck();
      });
    }

    // Keep loop alive if animating
    const isScrollSettled = Math.abs(this.targetScroll - this.currentScroll) < 0.2 && Math.abs(this.velocity) < 0.05;
    const isPointerSettled = Math.abs(this.smoothPointerX - this.pointerNormX) < 0.005 && Math.abs(this.smoothPointerY - this.pointerNormY) < 0.005;

    if (this.isDragging || !isIdle || this.autoScroll !== 0 || !isScrollSettled || !isPointerSettled) {
      return true;
    }
    return false;
  }

  // ── Event Handlers ────────────────────────────────────────────────────────

  private bindEvents(): void {
    // Listen to wheel on host element so the entire section area reacts
    this.hostEl.addEventListener('wheel', this.onWheel, { passive: false });

    const el = this.containerEl!;
    el.addEventListener('pointerdown', this.onPointerDown);
    window.addEventListener('pointermove', this.onPointerMove);
    window.addEventListener('pointerup', this.onPointerUp);
    window.addEventListener('pointercancel', this.onPointerUp);
    el.addEventListener('pointermove', this.onPointerMoveParallax);
    el.addEventListener('pointerenter', this.onPointerEnter);
    el.addEventListener('pointerleave', this.onPointerLeave);
    el.addEventListener('keydown', this.onKeyDown);
  }

  private onWheel = (e: WheelEvent): void => {
    const n = this.items.length;
    if (n <= 1) return;

    const maxScroll = (n - 1) * this.spacing;

    if (!this.infinite) {
      // If at the end and scrolling down: DO NOT call preventDefault!
      // This allows the page to smoothly continue scrolling down to the next section!
      if (this.currentScroll >= maxScroll - 15 && e.deltaY > 0) {
        return;
      }
      // If at the beginning and scrolling up: DO NOT call preventDefault!
      // This allows the page to smoothly continue scrolling up to the previous section!
      if (this.currentScroll <= 15 && e.deltaY < 0) {
        return;
      }
    }

    // Intercept wheel to dolly through items
    e.preventDefault();
    this.hasInteracted = true;
    this.lastInputTime = performance.now();
    this.targetScroll += e.deltaY * this.wheelSpeed;

    if (!this.infinite) {
      this.targetScroll = Math.max(0, Math.min(this.targetScroll, maxScroll));
    }

    if (!this.rafId) this.startRaf();
  };

  private onPointerDown = (e: PointerEvent): void => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    this.isDragging = true;
    this.dragStartY = e.clientY;
    this.dragStartX = e.clientX;
    this.dragScrollStart = this.targetScroll;
    this.dragMovedPx = 0;
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}
    if (this.containerEl) {
      this.containerEl.style.cursor = 'grabbing';
      this.containerEl.focus();
    }
    if (!this.rafId) this.startRaf();
  };

  private onPointerMove = (e: PointerEvent): void => {
    if (!this.isDragging) return;
    const dy = e.clientY - this.dragStartY;
    const dx = e.clientX - this.dragStartX;
    this.dragMovedPx = Math.sqrt(dy * dy + dx * dx);
    const delta = Math.abs(dy) >= Math.abs(dx) ? dy : dx;
    this.targetScroll = this.dragScrollStart - delta * this.dragSpeed;
    this.hasInteracted = true;
    this.lastInputTime = performance.now();

    if (!this.infinite) {
      const maxScroll = (this.items.length - 1) * this.spacing;
      this.targetScroll = Math.max(0, Math.min(this.targetScroll, maxScroll));
    }

    if (!this.rafId) this.startRaf();
  };

  private onPointerUp = (e: PointerEvent): void => {
    if (!this.isDragging) return;
    this.isDragging = false;
    if (this.containerEl) this.containerEl.style.cursor = 'grab';

    if (this.dragMovedPx < 5) {
      const itemEl = (e.target as HTMLElement).closest<HTMLElement>('.dolly-item');
      if (itemEl) {
        const idx = parseInt(itemEl.dataset['index'] || '-1', 10);
        if (idx >= 0 && this.items[idx]) {
          this.ngZone.run(() => this.itemClick.emit({ index: idx, item: this.items[idx] }));
        }
      }
    }
  };

  private onPointerMoveParallax = (e: PointerEvent): void => {
    if (!this.containerEl) return;
    const rect = this.containerEl.getBoundingClientRect();
    this.pointerNormX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    this.pointerNormY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    if (!this.rafId) this.startRaf();
  };

  private onPointerEnter = (): void => {
    this.isHovered = true;
    if (!this.rafId) this.startRaf();
  };

  private onPointerLeave = (): void => {
    this.isHovered = false;
    this.pointerNormX = 0;
    this.pointerNormY = 0;
    if (!this.rafId) this.startRaf();
  };

  private onKeyDown = (e: KeyboardEvent): void => {
    const dir: Record<string, number> = { ArrowDown: 1, PageDown: 1, ArrowUp: -1, PageUp: -1 };
    const move = dir[e.key];
    if (move === undefined) return;
    e.preventDefault();
    this.targetScroll += move * this.spacing;
    this.hasInteracted = true;
    this.lastInputTime = performance.now();

    if (!this.infinite) {
      const maxScroll = (this.items.length - 1) * this.spacing;
      this.targetScroll = Math.max(0, Math.min(this.targetScroll, maxScroll));
    }

    if (!this.rafId) this.startRaf();
  };

  trackByIdx(_: number, item: DollyGalleryItem): any {
    return item.id ?? item.src;
  }
}
