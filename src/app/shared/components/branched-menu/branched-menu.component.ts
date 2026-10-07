import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  AfterViewInit,
  AfterViewChecked,
  ViewChildren,
  ViewChild,
  QueryList,
  ElementRef,
  NgZone,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewEncapsulation,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { IconComponent } from '../icon/icon.component';

// ── Types ──────────────────────────────────────────────────────────────────────
export interface BranchedChild {
  value: string;
  label: string;
  icon?: any; // FA class string or HugeIcons data array
}

export interface BranchedSection {
  label: string;
  value?: string; // if set = leaf (no children)
  icon?: any;
  children?: BranchedChild[];
}

// ── Constants (ported 1:1 from BranchedMenu.jsx) ──────────────────────────────
const PAD = 6;
const MARK = 16;

@Component({
  selector: 'app-branched-menu',
  standalone: true,
  imports: [CommonModule, IconComponent],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './branched-menu.component.html',
  styleUrls: ['./branched-menu.component.scss'],
})
export class BranchedMenuComponent implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {
  // ── Inputs ──────────────────────────────────────────────────────────────────
  @Input() items: BranchedSection[] = [];
  @Input() defaultOpen: number | number[] = 0;
  @Input() defaultActive = '';
  @Input() active: string | undefined; // controlled from outside (router sync)
  @Input() color = 'var(--white, #f5f5f5)';
  @Input() accentColor = 'var(--neon-green, #39ff14)';
  @Input() lineColor = 'var(--gray, #3f3f46)';
  @Input() width: number | string = 240;
  @Input() rowHeight = 36;
  @Input() indent = 40;
  @Input() trunk = 14;
  @Input() radius = 10;
  @Input() lineWidth = 1.5;
  @Input() fontSize = 14;
  @Input() drawDuration = 400;
  @Input() foldDuration = 300;
  @Input() className = '';

  // ── Outputs ─────────────────────────────────────────────────────────────────
  @Output() selectItem = new EventEmitter<{ value: string; item: BranchedChild | BranchedSection }>();
  @Output() toggleSection = new EventEmitter<{ index: number; open: boolean }>();

  // ── ViewChildren ─────────────────────────────────────────────────────────────
  @ViewChildren('head') headRefs!: QueryList<ElementRef<HTMLElement>>;
  @ViewChild('marker') markerRef!: ElementRef<HTMLElement>;
  @ViewChild('navEl') navRef!: ElementRef<HTMLElement>;

  // ── Internal state ───────────────────────────────────────────────────────────
  openSet: Set<number> = new Set();
  activeValue = '';

  private resizeObserver?: ResizeObserver;
  private _firstResizeSkipped = false;
  private _lastPlaceKey = '';
  private _prevActive?: string;
  private _isBrowser = false;

  constructor(
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this._isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    // Init open set
    const d = this.defaultOpen;
    if (Array.isArray(d)) {
      d.forEach((i) => this.openSet.add(i));
    } else if (typeof d === 'number') {
      this.openSet.add(d);
    }

    // Init active value
    if (this.active !== undefined) {
      this.activeValue = this.active;
      this._prevActive = this.active;
    } else if (this.defaultActive) {
      this.activeValue = this.defaultActive;
    } else {
      // First child of first open section
      const idx = Array.from(this.openSet)[0] ?? 0;
      this.activeValue = this.items[idx]?.children?.[0]?.value ?? '';
    }

    // Ensure the section containing active is open
    this._syncOpenToActive();
  }

  ngAfterViewInit(): void {
    if (!this._isBrowser) return;

    this.ngZone.runOutsideAngular(() => {
      if (!this.navRef?.nativeElement || typeof ResizeObserver === 'undefined') return;
      this._firstResizeSkipped = false;
      this.resizeObserver = new ResizeObserver(() => {
        if (!this._firstResizeSkipped) {
          this._firstResizeSkipped = true;
          return;
        }
        this.place(false);
      });
      this.resizeObserver.observe(this.navRef.nativeElement);
    });

    // Initial marker placement
    setTimeout(() => {
      this.place(false);
      this.cdr.markForCheck();
    }, 0);
  }

  ngAfterViewChecked(): void {
    if (!this._isBrowser) return;

    // Controlled input changed from parent
    if (this.active !== undefined && this.active !== this._prevActive) {
      this._prevActive = this.active;
      this.activeValue = this.active;
      this._syncOpenToActive();
      this.place(true);
      this.cdr.markForCheck();
    }

    const key = `${this.activeSection}:${this.markerShown}:${this.items.length}:${this.fontSize}:${this.rowHeight}:${this.openSet.size}`;
    if (key !== this._lastPlaceKey) {
      this._lastPlaceKey = key;
      this.place(true);
    }
  }

  ngOnDestroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = undefined;
    }
  }

  // ── Computed helpers (ported 1:1 from BranchedMenu.jsx) ─────────────────────

  get activeSection(): number {
    return this.items.findIndex(
      (s) =>
        (s.value && s.value === this.activeValue) ||
        s.children?.some((c) => c.value === this.activeValue)
    );
  }

  get markerShown(): boolean {
    if (this.activeSection < 0) return false;
    const sec = this.items[this.activeSection];
    // If leaf section, show marker
    if (!sec.children?.length) return true;
    return this.openSet.has(this.activeSection);
  }

  /** Total height of section body (0 when closed) */
  bodyH(i: number): number {
    const kids = this.items[i]?.children;
    if (!kids || !this.openSet.has(i)) return 0;
    return PAD * 2 + kids.length * this.rowHeight;
  }

  /** SVG width for branch lines */
  get svgW(): number {
    return this.indent;
  }

  /** Row centre Y for child k (0-indexed) inside the open body */
  rowY(k: number): number {
    return PAD + k * this.rowHeight + this.rowHeight / 2;
  }

  /** Effective radius (clamped so it never exceeds half rowHeight - 2) */
  private get r(): number {
    return Math.min(this.radius, Math.max(2, this.rowHeight / 2 - 2));
  }

  /** Horizontal end of branch (endX = indent - 8) */
  private get endX(): number {
    return this.indent - 8;
  }

  /** The trunk vertical line for the branch SVG */
  trunkPath(i: number): string {
    const n = this.items[i]?.children?.length ?? 0;
    if (n === 0) return '';
    const lastY = this.rowY(n - 1);
    const x = this.trunk;
    return `M ${x} ${PAD} V ${lastY}`;
  }

  /** Base (static) branch path: starts at trunk PAD, drops vertically to y - r, curves around radius to horizontal endX */
  branchBase(k: number): string {
    const y = this.rowY(k);
    const x = this.trunk;
    const ex = this.endX;
    const rv = this.r;
    return `M ${x} ${PAD} V ${y - rv} Q ${x} ${y} ${x + rv} ${y} H ${ex}`;
  }

  /** Animated (reach) path — same geometry, drives stroke-dashoffset */
  reachPath(k: number): string {
    return this.branchBase(k);
  }

  /** Path length approximation (straight vertical + quarter circle arc + straight horizontal) */
  length(k: number): number {
    const y = this.rowY(k);
    const rv = this.r;
    const vertLen = Math.max(0, y - PAD - rv);
    const arcLen = (Math.PI / 2) * rv;
    const horizLen = Math.max(0, this.endX - this.trunk - rv);
    return Math.round((vertLen + arcLen + horizLen) * 10) / 10;
  }

  // ── Marker placement (ported place() + first-skip + transition:none trick) ──

  place(animate: boolean): void {
    if (!this._isBrowser || !this.headRefs || !this.markerRef) return;
    const heads = this.headRefs.toArray();
    const marker = this.markerRef.nativeElement;
    const si = this.activeSection;

    if (si < 0 || !this.markerShown) {
      marker.style.opacity = '0';
      return;
    }

    const head = heads[si];
    if (!head) return;
    const nav = this.navRef?.nativeElement;
    if (!nav) return;

    const headRect = head.nativeElement.getBoundingClientRect();
    const navRect = nav.getBoundingClientRect();
    const topOffset = headRect.top - navRect.top + nav.scrollTop;

    if (!animate) {
      marker.style.transition = 'none';
      marker.style.transform = `translateY(${topOffset}px)`;
      // Force synchronous reflow to bypass transition
      void marker.offsetHeight;
      marker.style.transition = '';
    } else {
      marker.style.transform = `translateY(${topOffset}px)`;
    }
    marker.style.opacity = '1';
  }

  // ── Event handlers ────────────────────────────────────────────────────────────

  toggleOpen(i: number): void {
    const section = this.items[i];
    if (!section) return;

    // If a leaf head (no children), treat as navigation
    if (section.value && !section.children?.length) {
      this.activeValue = section.value;
      this._prevActive = section.value;
      this.cdr.markForCheck();
      this.selectItem.emit({ value: section.value, item: section });
      this.place(true);
      return;
    }

    const wasOpen = this.openSet.has(i);
    const next = new Set(this.openSet);
    if (wasOpen) {
      next.delete(i);
    } else {
      next.add(i);
    }
    this.openSet = next;
    this.toggleSection.emit({ index: i, open: !wasOpen });
    this.cdr.markForCheck();
    setTimeout(() => this.place(true), 50);
  }

  onChildClick(child: BranchedChild): void {
    this.activeValue = child.value;
    this._prevActive = child.value;
    this.cdr.markForCheck();
    this.selectItem.emit({ value: child.value, item: child });
    this.place(true);
  }

  trackByIndex(i: number): number {
    return i;
  }

  trackByValue(_: number, c: BranchedChild): string {
    return c.value;
  }

  /** Build the CSS custom property object for [ngStyle] on nav */
  get navStyles(): Record<string, string> {
    const widthVal = typeof this.width === 'number' ? `${this.width}px` : this.width;
    return {
      '--bm-w': widthVal,
      '--bm-ink': this.color,
      '--bm-accent': this.accentColor,
      '--bm-line': this.lineColor,
      '--bm-font': `${this.fontSize}px`,
      '--bm-row': `${this.rowHeight}px`,
      '--bm-indent': `${this.indent}px`,
      '--bm-line-w': `${this.lineWidth}px`,
      '--bm-draw': `${this.drawDuration}ms`,
      '--bm-fold': `${this.foldDuration}ms`,
      '--bm-trunk': `${this.trunk}px`,
      '--bm-radius': `${this.radius}px`,
    };
  }

  private _syncOpenToActive(): void {
    const si = this.items.findIndex((s) =>
      s.children?.some((c) => c.value === this.activeValue)
    );
    if (si >= 0) {
      const next = new Set(this.openSet);
      next.add(si);
      this.openSet = next;
    }
  }
}
