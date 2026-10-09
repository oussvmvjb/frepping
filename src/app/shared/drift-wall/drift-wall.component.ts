import {
  Component, Input, Output, EventEmitter,
  OnChanges, OnDestroy, AfterViewInit, SimpleChanges,
  ViewChild, ElementRef, NgZone, ChangeDetectionStrategy,
  ChangeDetectorRef, PLATFORM_ID, Inject
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

// ── Public interface ─────────────────────────────────────────────────────────
export interface DriftItem {
  id: string | number;
  image: string;
  title: string;
  price: number;
  comparePrice?: number | null;
  category?: string;
  inStock: boolean;
  discountPercent: number;
  rank?: number;          // 1-based rank (set externally)
  raw: any;               // original ApiProduct
}

// ── Helpers ──────────────────────────────────────────────────────────────────
const PHI = (1 + Math.sqrt(5)) / 2;

function columnFactor(index: number, variance: number): number {
  // golden-ratio pseudo-random per-column speed multiplier
  return 1 + ((index * PHI) % 1) * 2 * variance - variance;
}

// ── Component ────────────────────────────────────────────────────────────────
@Component({
  selector: 'app-drift-wall',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './drift-wall.component.html',
  styleUrls: ['./drift-wall.component.css'],
})
export class DriftWallComponent implements AfterViewInit, OnChanges, OnDestroy {
  // ── Inputs ────────────────────────────────────────────────────────────────
  @Input() items: DriftItem[] = [];
  @Input() columns = 5;
  @Input() tileWidth = 200;
  @Input() tileHeight = 260;
  @Input() gap = 18;
  @Input() radius = 14;
  @Input() tilt = 16;
  @Input() turn = -14;
  @Input() roll = 0;
  @Input() perspective = 1200;
  @Input() depth = 120;
  @Input() speed = 42;
  @Input() direction: 'up' | 'down' = 'up';
  @Input() variance = 0.45;
  @Input() parallax = 0.6;
  @Input() pauseOnHover = false;
  @Input() lift = 64;
  @Input() fade = 0.6;
  @Input() dim = 0.55;
  @Input() grayscale = false;
  @Input() overlayColor = '#060010';
  @Input() favoriteIds: Set<string | number> = new Set();

  // ── Outputs ───────────────────────────────────────────────────────────────
  @Output() tileClick  = new EventEmitter<DriftItem>();
  @Output() addToCart  = new EventEmitter<DriftItem>();
  @Output() tryOn      = new EventEmitter<DriftItem>();
  @Output() toggleFav  = new EventEmitter<DriftItem>();

  // ── ViewChildren ──────────────────────────────────────────────────────────
  @ViewChild('containerRef') containerRef!: ElementRef<HTMLDivElement>;
  @ViewChild('planeRef')     planeRef!: ElementRef<HTMLDivElement>;

  // ── Template data (rebuilt on input changes) ──────────────────────────────
  columnsData: { index: number; copies: { copyIndex: number; items: DriftItem[] }[] }[] = [];
  cssVars: Record<string, string> = {};

  // ── Runtime state ─────────────────────────────────────────────────────────
  activeId: string | number | null = null;
  hoveredCol = -1;

  private containerHeight = 640;
  private reduced = false;
  private initialized = false;

  // Per-column scroll positions
  private offsets: number[] = [];
  // Per-column current velocities (px/s after damping)
  private velocities: number[] = [];
  // Copy heights (= cols * (tileH + gap) * numCopies … see below)
  private copyHeights: number[] = [];
  // Base velocity magnitudes per column (speed * factor)
  private baseVelocities: number[] = [];

  // Pointer parallax
  private pointerX = 0;
  private pointerY = 0;
  private smoothX = 0;
  private smoothY = 0;

  private raf = 0;
  private last = 0;
  private resizeObserver: ResizeObserver | null = null;
  private trackEls: HTMLElement[] = [];

  // Memoize to avoid rebuilding every CD cycle
  private prevItemsRef: DriftItem[] = [];
  private prevColumns = 0;

  constructor(
    private zone: NgZone,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {}

  // ── Lifecycle ─────────────────────────────────────────────────────────────

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    window.matchMedia('(prefers-reduced-motion: reduce)')
      .addEventListener('change', (e) => { this.reduced = e.matches; });

    this.observeContainer();
    this.rebuild();
    this.initialized = true;
    this.zone.runOutsideAngular(() => this.startLoop());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.initialized) return;
    const itemsChanged  = changes['items']   && changes['items'].currentValue !== this.prevItemsRef;
    const colsChanged   = changes['columns'] && changes['columns'].currentValue !== this.prevColumns;
    const sizeChanged   = changes['tileWidth'] || changes['tileHeight'] || changes['gap'] || changes['speed']
                       || changes['variance'] || changes['direction'];
    if (itemsChanged || colsChanged || sizeChanged) {
      this.rebuild();
    }
    this.updateCssVars();
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.raf);
    this.raf = 0;
    this.resizeObserver?.disconnect();
  }

  // ── Build / rebuild ───────────────────────────────────────────────────────

  private rebuild(): void {
    const cols = Math.max(1, this.columns);
    const items = this.items.length ? this.items : [];
    this.prevItemsRef = items;
    this.prevColumns  = cols;

    // Ensure every column has at least 3 tiles; repeat items if needed
    const minPerCol = 3;
    let padded = items.slice();
    while (padded.length < cols * minPerCol && padded.length > 0) {
      padded = [...padded, ...items];
    }

    // Distribute items round-robin into columns
    const columnItems: DriftItem[][] = Array.from({ length: cols }, () => []);
    padded.forEach((item, i) => columnItems[i % cols].push(item));

    // Ensure each column has at least minPerCol entries
    columnItems.forEach((col, ci) => {
      while (col.length < minPerCol && items.length > 0) {
        col.push(items[col.length % items.length]);
      }
    });

    // For seamless looping we need at least 2 copies of the column
    const numCopies = 2;
    this.columnsData = columnItems.map((colItems, ci) => ({
      index: ci,
      copies: Array.from({ length: numCopies }, (_, ki) => ({
        copyIndex: ki,
        items: colItems,
      })),
    }));

    // Compute copy height (px) per column
    this.copyHeights = columnItems.map(col =>
      col.length * (this.tileHeight + this.gap)
    );

    // Base velocities
    const dir = this.direction === 'down' ? -1 : 1;
    this.baseVelocities = Array.from({ length: cols }, (_, i) =>
      dir * this.speed * columnFactor(i, this.variance)
    );

    // Init offsets: alternate direction
    if (this.offsets.length !== cols) {
      this.offsets    = Array.from({ length: cols }, (_, i) =>
        i % 2 === 0 ? 0 : -(this.copyHeights[i] ?? 0)
      );
      this.velocities = [...this.baseVelocities];
    } else {
      // resize: keep existing offsets, just recompute velocities
      this.velocities = [...this.baseVelocities];
    }

    this.updateCssVars();
    this.cdr.markForCheck();

    // After render, grab track element references
    requestAnimationFrame(() => this.bindTrackRefs());
  }

  private bindTrackRefs(): void {
    if (!this.containerRef) return;
    this.trackEls = Array.from(
      this.containerRef.nativeElement.querySelectorAll<HTMLElement>('.dw-track')
    );
  }

  private updateCssVars(): void {
    const tw = this.tileWidth;
    const th = this.tileHeight;
    const g  = this.gap;
    this.cssVars = {
      '--dw-cols': `${this.columns}`,
      '--dw-tw':   `${tw}px`,
      '--dw-th':   `${th}px`,
      '--dw-gap':  `${g}px`,
      '--dw-radius': `${this.radius}px`,
      '--dw-tilt':   `${this.tilt}deg`,
      '--dw-turn':   `${this.turn}deg`,
      '--dw-roll':   `${this.roll}deg`,
      '--dw-persp':  `${this.perspective}px`,
      '--dw-depth':  `${this.depth}px`,
      '--dw-lift':   `${this.lift}px`,
      '--dw-fade':   `${this.fade}`,
      '--dw-dim':    `${this.dim}`,
      '--dw-overlay-color': this.overlayColor,
      '--dw-total-width':   `${this.columns * (tw + g) - g}px`,
    };
  }

  // ── Container observer ────────────────────────────────────────────────────

  private observeContainer(): void {
    if (!this.containerRef) return;
    this.resizeObserver = new ResizeObserver(entries => {
      for (const e of entries) {
        const h = e.contentRect.height;
        if (h && h !== this.containerHeight) {
          this.containerHeight = h;
        }
      }
    });
    this.resizeObserver.observe(this.containerRef.nativeElement);
  }

  // ── Animation loop ────────────────────────────────────────────────────────

  private startLoop(): void {
    this.last = performance.now();
    const loop = (now: number) => {
      this.raf = requestAnimationFrame(loop);
      const dt = Math.min(0.05, (now - this.last) / 1000);
      this.last = now;
      this.tick(dt, now);
    };
    this.raf = requestAnimationFrame(loop);
  }

  private tick(dt: number, _now: number): void {
    if (this.reduced) return;

    const cols = this.columns;

    // Smooth pointer
    const kp = 1 - Math.exp(-dt / 0.12);
    this.smoothX += (this.pointerX - this.smoothX) * kp;
    this.smoothY += (this.pointerY - this.smoothY) * kp;

    // Update plane perspective transform (parallax)
    if (this.planeRef) {
      const rx =  this.smoothY * this.tilt  * this.parallax;
      const ry =  this.smoothX * this.turn  * this.parallax;
      const rz =  this.smoothX * this.roll  * this.parallax;
      this.planeRef.nativeElement.style.transform =
        `perspective(${this.perspective}px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)`;
    }

    // Update each column track
    for (let ci = 0; ci < cols; ci++) {
      const track = this.trackEls[ci];
      if (!track) continue;

      const copyH = this.copyHeights[ci] ?? 1;
      const base  = this.baseVelocities[ci] ?? 0;

      // Pause this column whenever the pointer is over one of its tiles.
      // pauseOnHover input still works, but hovering an active tile
      // always stops the column even if pauseOnHover is false.
      const paused = this.hoveredCol === ci || (this.pauseOnHover && this.hoveredCol !== -1);
      const targetV = paused ? 0 : base;

      const kv = 1 - Math.exp(-dt / (paused ? 0.08 : 0.28));
      this.velocities[ci] += (targetV - this.velocities[ci]) * kv;
      if (paused && Math.abs(this.velocities[ci]) < 0.5) {
        this.velocities[ci] = 0;
      }

      this.offsets[ci] = ((this.offsets[ci] + this.velocities[ci] * dt) % copyH + copyH) % copyH;

      const y = -this.offsets[ci];
      track.style.transform = `translate3d(0, ${y}px, 0)`;
    }
  }

  // ── Pointer handling ──────────────────────────────────────────────────────

  onPointerMove(event: PointerEvent): void {
    if (!this.containerRef) return;
    const rect = this.containerRef.nativeElement.getBoundingClientRect();
    if (this.parallax > 0 && !this.reduced) {
      this.pointerX = (event.clientX - rect.left) / rect.width  * 2 - 1;
      this.pointerY = (event.clientY - rect.top)  / rect.height * 2 - 1;
    }

    const hit = document.elementFromPoint(event.clientX, event.clientY);
    const tile = hit && hit.closest ? (hit.closest('[data-tile-id]') as HTMLElement | null) : null;
    if (tile) {
      const id = tile.dataset['tileId'] ?? null;
      const colStr = tile.dataset['col'];
      const col = colStr != null ? parseInt(colStr, 10) : -1;
      const parsedId = id != null ? (isNaN(+id) ? id : +id) : null;

      if (this.hoveredCol !== col) {
        this.hoveredCol = col;
      }
      if (this.activeId !== parsedId) {
        this.activeId = parsedId;
        this.zone.run(() => this.cdr.markForCheck());
      }
    }
  }

  onPointerLeave(): void {
    this.pointerX = 0;
    this.pointerY = 0;
    this.hoveredCol = -1;
    if (this.activeId !== null) {
      this.activeId = null;
      this.zone.run(() => this.cdr.markForCheck());
    }
  }

  /** Called via (mouseenter) on each .dw-tile */
  onTileEnter(item: DriftItem, colIndex: number): void {
    this.hoveredCol = colIndex;
    if (this.activeId !== item.id) {
      this.activeId = item.id;
      this.zone.run(() => this.cdr.markForCheck());
    }
  }

  /** Called via (mouseleave) on each .dw-tile */
  onTileLeave(event: MouseEvent): void {
    // Only clear if not immediately entering another tile
    const related = (event as MouseEvent).relatedTarget as HTMLElement | null;
    if (!related?.closest('[data-tile-id]')) {
      this.hoveredCol = -1;
      if (this.activeId !== null) {
        this.activeId = null;
        this.zone.run(() => this.cdr.markForCheck());
      }
    }
  }

  onTileFocus(item: DriftItem): void {
    if (this.activeId !== item.id) {
      this.activeId = item.id;
      this.cdr.markForCheck();
    }
  }

  onTileBlur(): void {
    this.activeId = null;
    this.cdr.markForCheck();
  }

  onTileKeydown(event: KeyboardEvent, item: DriftItem): void {
    if (event.key === 'Enter') this.tileClick.emit(item);
  }

  // ── Action handlers ───────────────────────────────────────────────────────

  onTileClick(event: MouseEvent, item: DriftItem): void {
    this.tileClick.emit(item);
  }

  onAddToCart(event: MouseEvent, item: DriftItem): void {
    event.stopPropagation();
    this.addToCart.emit(item);
  }

  onTryOn(event: MouseEvent, item: DriftItem): void {
    event.stopPropagation();
    this.tryOn.emit(item);
  }

  onToggleFav(event: MouseEvent, item: DriftItem): void {
    event.stopPropagation();
    this.toggleFav.emit(item);
  }

  // ── Template helpers ──────────────────────────────────────────────────────

  isActive(item: DriftItem): boolean {
    return this.activeId === item.id;
  }

  isFav(item: DriftItem): boolean {
    return this.favoriteIds.has(item.id);
  }

  trackByCol(_: number, col: { index: number }): number { return col.index; }
  trackByCopy(_: number, c: { copyIndex: number }): number { return c.copyIndex; }
  trackByItem(_: number, item: DriftItem): string | number { return item.id; }

  getCssVarString(): string {
    return Object.entries(this.cssVars).map(([k, v]) => `${k}:${v}`).join(';');
  }
}
