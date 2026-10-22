import {
  Component, Input, Output, EventEmitter, ElementRef, ViewChild,
  AfterViewInit, OnDestroy, OnChanges, SimpleChanges, NgZone, HostListener,
  ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type OptionWheelSide = 'left' | 'right';

export interface OptionWheelItem {
  id?: string;
  label: string;
  icon?: string;
  badge?: number | string;
}

interface WheelConfig {
  count: number;
  rowH: number;
  curve: number;
  tilt: number;
  blur: number;
  fade: number;
  minOpacity: number;
  side: OptionWheelSide;
  loop: boolean;
  smoothing: number;
  draggable: boolean;
}

@Component({
  selector: 'app-option-wheel',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './option-wheel.component.html',
  styleUrls: ['./option-wheel.component.scss']
})
export class OptionWheelComponent implements AfterViewInit, OnDestroy, OnChanges {
  @ViewChild('rootRef', { static: false }) rootRef!: ElementRef<HTMLDivElement>;

  @Input() items: (OptionWheelItem | string)[] = [];
  @Input() selectedIndex = 0;
  @Input() textColor = '#888888';
  @Input() activeColor = '#39ff14';
  @Input() side: OptionWheelSide = 'left';
  @Input() fontSize = 1.6; // in rem
  @Input() spacing = 1.45;
  @Input() curve = 1.0;
  @Input() tilt = 6.5;
  @Input() blur = 1.8;
  @Input() fade = 0.28;
  @Input() minOpacity = 0.08;
  @Input() smoothing = 180;
  @Input() inset = 30;
  @Input() loop = false;
  @Input() draggable = true;
  @Input() sound = true;

  @Output() selectChange = new EventEmitter<{ index: number; item: OptionWheelItem | string }>();

  currentIndex = 0;
  isDragging = false;

  private pos = 0;
  private target = 0;
  private rafId: number | null = null;
  private lastTime = 0;
  private wheelTimer: any = null;
  private drag: { y: number; start: number; id: number } | null = null;
  private dragMoved = false;
  private lastTickTime = 0;
  private audioCtx: AudioContext | null = null;
  private wheelListener = (e: WheelEvent) => this.onWheel(e);

  constructor(private ngZone: NgZone, private cdr: ChangeDetectorRef) {}

  get normalizedItems(): OptionWheelItem[] {
    return this.items.map(item => {
      if (typeof item === 'string') {
        return { label: item };
      }
      return item;
    });
  }

  private getConfig(): WheelConfig {
    const remPx = typeof window !== 'undefined'
      ? parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
      : 16;

    return {
      count: this.items.length,
      rowH: Math.max(this.fontSize * this.spacing * remPx, 32),
      curve: this.curve,
      tilt: this.tilt,
      blur: this.blur,
      fade: this.fade,
      minOpacity: this.minOpacity,
      side: this.side,
      loop: this.loop,
      smoothing: this.smoothing,
      draggable: this.draggable
    };
  }

  ngAfterViewInit(): void {
    this.pos = this.selectedIndex;
    this.target = this.selectedIndex;
    this.currentIndex = this.selectedIndex;

    const root = this.rootRef?.nativeElement;
    if (root) {
      root.addEventListener('wheel', this.wheelListener, { passive: false });
    }

    this.ngZone.runOutsideAngular(() => {
      this.startLoop();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedIndex'] && !changes['selectedIndex'].isFirstChange()) {
      this.applyTarget(this.selectedIndex, true, false);
    }
    if (changes['items'] && !changes['items'].isFirstChange()) {
      this.applyTarget(this.target, true, false);
    }
  }

  ngOnDestroy(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    if (this.wheelTimer) {
      clearTimeout(this.wheelTimer);
    }
    const root = this.rootRef?.nativeElement;
    if (root) {
      root.removeEventListener('wheel', this.wheelListener);
    }
    if (this.audioCtx) {
      this.audioCtx.close().catch(() => {});
    }
  }

  // ── Physics-based rAF smoothing loop ─────────────────────────────────────

  private startLoop(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
    }
    this.lastTime = performance.now();
    this.rafId = requestAnimationFrame(now => this.runFrame(now));
  }

  private runFrame(now: number): void {
    const dt = Math.min((now - this.lastTime) / 1000, 0.05);
    this.lastTime = now;
    const cfg = this.getConfig();
    const tau = Math.max(cfg.smoothing, 1) / 1000;
    const k = 1 - Math.exp(-dt / tau);

    const target = this.target;
    const cur = this.pos;
    let next = cur + (target - cur) * k;
    const settled = Math.abs(target - next) < 0.001;
    if (settled) next = target;
    this.pos = next;

    this.renderItems(cfg, next);

    if (!settled) {
      this.rafId = requestAnimationFrame(t => this.runFrame(t));
    } else {
      this.rafId = null;
    }
  }

  private renderItems(cfg: WheelConfig, next: number): void {
    const root = this.rootRef?.nativeElement;
    if (!root) return;
    const itemEls = root.querySelectorAll<HTMLElement>('.option-wheel__item');
    const n = cfg.count;
    const mirror = cfg.side === 'right' ? -1 : 1;
    const tiltRad = (cfg.tilt * Math.PI) / 180;
    const R = tiltRad > 0.0005 ? cfg.rowH / tiltRad : 0;

    for (let i = 0; i < n && i < itemEls.length; i++) {
      const el = itemEls[i];
      if (!el) continue;

      let d = i - next;
      if (cfg.loop && n > 1) {
        d = ((d % n) + n) % n;
        if (d > n / 2) d -= n;
      }
      const dist = Math.abs(d);
      let x = 0;
      let y = d * cfg.rowH;
      let rot = 0;

      if (R > 0) {
        const ang = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, d * tiltRad));
        y = R * Math.sin(ang);
        x = -mirror * R * (1 - Math.cos(ang)) * cfg.curve;
        rot = (mirror * ang * 180) / Math.PI;
      }

      el.style.transform = `translate3d(${x.toFixed(2)}px, calc(${y.toFixed(2)}px - 50%), 0) rotate(${rot.toFixed(3)}deg)`;
      el.style.opacity = String(Math.max(cfg.minOpacity, 1 - dist * cfg.fade));
      el.style.filter = cfg.blur > 0 ? `blur(${(dist * cfg.blur).toFixed(2)}px)` : 'none';
      el.style.setProperty('--ow-p', Math.max(0, 1 - Math.min(dist, 1)).toFixed(4));
    }
  }

  // ── Target & Selection ───────────────────────────────────────────────────

  private applyTarget(value: number, snap: boolean, emit = true): void {
    const cfg = this.getConfig();
    let v = value;
    if (!cfg.loop) {
      v = Math.min(Math.max(v, 0), Math.max(cfg.count - 1, 0));
    }
    if (snap) {
      v = Math.round(v);
    }
    this.target = v;

    const idx = ((Math.round(v) % cfg.count) + cfg.count) % cfg.count;
    if (idx !== this.currentIndex) {
      this.currentIndex = idx;
      this.cdr.markForCheck();
      this.playTick();
      if (emit && this.items[idx] !== undefined) {
        this.ngZone.run(() => {
          this.selectChange.emit({ index: idx, item: this.items[idx] });
        });
      }
    }

    this.startLoop();
  }

  // ── Audio Tick ───────────────────────────────────────────────────────────

  private playTick(): void {
    if (!this.sound) return;
    const now = performance.now();
    if (now - this.lastTickTime < 75) return;
    this.lastTickTime = now;

    try {
      if (!this.audioCtx) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          this.audioCtx = new AudioCtx();
        }
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      if (this.audioCtx) {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, this.audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(160, this.audioCtx.currentTime + 0.025);
        gain.gain.setValueAtTime(0.05, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.025);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start();
        osc.stop(this.audioCtx.currentTime + 0.03);
      }
    } catch {
      // Audio autoplay policy
    }
  }

  // ── Interaction: Wheel ───────────────────────────────────────────────────

  private onWheel(e: WheelEvent): void {
    e.preventDefault();
    const cfg = this.getConfig();
    const delta = e.deltaMode === 1 ? e.deltaY * 24 : e.deltaY;
    const step = Math.max(-1, Math.min(1, delta / cfg.rowH));
    this.applyTarget(this.target + step, false);

    if (this.wheelTimer) clearTimeout(this.wheelTimer);
    this.wheelTimer = setTimeout(() => {
      this.applyTarget(this.target, true);
    }, 140);
  }

  // ── Interaction: Drag & Pointer ──────────────────────────────────────────

  onPointerDown(e: PointerEvent): void {
    if (!this.draggable) return;
    this.drag = { y: e.clientY, start: this.target, id: e.pointerId };
    this.dragMoved = false;
    this.isDragging = true;
  }

  onPointerMove(e: PointerEvent): void {
    if (!this.drag) return;
    const dy = e.clientY - this.drag.y;
    if (!this.dragMoved && Math.abs(dy) > 4) {
      this.dragMoved = true;
      this.rootRef?.nativeElement?.setPointerCapture(this.drag.id);
    }
    if (this.dragMoved) {
      const cfg = this.getConfig();
      this.applyTarget(this.drag.start - dy / cfg.rowH, false);
    }
  }

  onPointerEnd(): void {
    if (!this.drag) return;
    this.drag = null;
    this.isDragging = false;
    if (this.dragMoved) {
      this.applyTarget(this.target, true);
    }
  }

  onItemClick(index: number, e: MouseEvent): void {
    e.stopPropagation();
    if (this.dragMoved) return;

    const cfg = this.getConfig();
    const cur = this.target;
    let d = index - (((cur % cfg.count) + cfg.count) % cfg.count);
    if (cfg.loop && cfg.count > 1) {
      if (d > cfg.count / 2) d -= cfg.count;
      else if (d < -cfg.count / 2) d += cfg.count;
    }
    this.applyTarget(cur + d, true);
  }

  onKeyDown(e: KeyboardEvent): void {
    let delta: number | null = null;
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') delta = -1;
    else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') delta = 1;
    if (delta == null) return;
    e.preventDefault();
    this.applyTarget(Math.round(this.target) + delta, true);
  }
}
