import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild
} from '@angular/core';

// ─────────────────────────────────────────────────────────────
//  PasswordMascotComponent
//
//  A small, transparent interactive character that reacts to:
//    - Password input focus
//    - Password visibility toggle (eye icon clicks)
//    - Password blur
//
//  State Machine & Frame Sequences (151 transparent PNG frames):
//    A. NORMAL_LOOP:
//       Continuous smooth loop from 001 to 151:
//       001 → 002 → ... → 151 → 001 → ...
//
//    B. COVER_EYES (when password focused or hidden):
//       Fast forward transition from current frame to 100,
//       then loop strictly between 100 and 151:
//       current → 100 → 101 → ... → 151 → 100 → ...
//
//    C. REVEAL_EYES (when eye icon clicked to show password):
//       Fast backward transition from current frame to 001,
//       then resume NORMAL_LOOP:
//       current → 001 → 002 → ... → 151 → 001 → ...
// ─────────────────────────────────────────────────────────────

export type MascotAnimState =
  | 'NORMAL_LOOP'           // Playing 001 → 151 → 001
  | 'TRANSITION_TO_COVER'   // Fast-forwarding to 100
  | 'COVER_LOOP'            // Looping 100 → 151 → 100
  | 'TRANSITION_TO_REVEAL'; // Fast-rewinding to 001

const FRAME_PATH = 'assets/login/mascot-frames/';
const TOTAL_FRAMES = 151;
const COVER_START_FRAME = 100;

// Timing constants
const NORMAL_STEP_MS = 38; // ~26 fps smooth playback
const FAST_STEP_MS = 18;   // ~55 fps fast, smooth transition

@Component({
  selector: 'app-password-mascot',
  template: `<canvas #mascotCanvas class="mascot-canvas" aria-hidden="true"></canvas>`,
  styleUrls: ['./password-mascot.component.scss']
})
export class PasswordMascotComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('mascotCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  /** Current password visibility state */
  @Input() isPasswordVisible = false;

  // ── State Machine ──────────────────────────────────────────
  state: MascotAnimState = 'NORMAL_LOOP';
  private currentFrame = 1;
  private lastStepTime = 0;
  private isInputFocused = false;

  // ── Frame Cache ────────────────────────────────────────────
  private frames = new Map<number, HTMLImageElement>();
  private loading = new Set<number>();

  // ── Rendering & Lifecycle ──────────────────────────────────
  private raf = 0;
  private disposed = false;
  private ctx!: CanvasRenderingContext2D;
  private ro!: ResizeObserver;
  private cachedDpr = 1;

  // ─────────────────────────── Lifecycle ───────────────────────

  ngOnInit(): void {
    this.preloadAll();
  }

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    this.ctx = ctx;
    this.setupResizeObserver(canvas);
    this.lastStepTime = performance.now();
    this.raf = requestAnimationFrame(this.loop);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isPasswordVisible'] && !changes['isPasswordVisible'].firstChange) {
      const visible = changes['isPasswordVisible'].currentValue as boolean;
      this.handleVisibilityChange(visible);
    }
  }

  ngOnDestroy(): void {
    this.disposed = true;
    if (this.raf) {
      cancelAnimationFrame(this.raf);
    }
    this.ro?.disconnect();
    this.frames.clear();
  }

  // ─────────────────────────── Public API ──────────────────────

  /**
   * Called when user clicks or focuses the password input.
   * If password is hidden, immediately fast-forwards to frame 100 and loops 100–151.
   */
  onPasswordFocus(): void {
    this.isInputFocused = true;
    if (!this.isPasswordVisible) {
      this.startTransitionToCover();
    }
  }

  /**
   * Called when password input loses focus.
   * If password is not visible, smoothly returns to normal 001–151 loop.
   */
  onPasswordBlur(): void {
    this.isInputFocused = false;
    if (!this.isPasswordVisible) {
      this.startTransitionToReveal();
    }
  }

  /**
   * Called when eye icon is clicked or password visibility changes.
   */
  togglePasswordVisibility(visible?: boolean): void {
    if (visible !== undefined) {
      this.isPasswordVisible = visible;
    } else {
      this.isPasswordVisible = !this.isPasswordVisible;
    }
    this.handleVisibilityChange(this.isPasswordVisible);
  }

  /**
   * Synchronizes animation state with password visibility.
   */
  private handleVisibilityChange(visible: boolean): void {
    if (visible) {
      // Password shown: immediately stop 100–151 loop, quickly animate backward to 001, then loop 001–151
      this.startTransitionToReveal();
    } else {
      // Password hidden: quickly animate forward to 100, then loop 100–151
      this.startTransitionToCover();
    }
  }

  private startTransitionToCover(): void {
    if (this.state === 'COVER_LOOP') return;
    this.state = 'TRANSITION_TO_COVER';
    this.lastStepTime = performance.now();
  }

  private startTransitionToReveal(): void {
    if (this.state === 'NORMAL_LOOP' && this.currentFrame === 1) return;
    this.state = 'TRANSITION_TO_REVEAL';
    this.lastStepTime = performance.now();
  }

  // ─────────────────────────── Animation Loop ──────────────────

  private loop = (now: number): void => {
    if (this.disposed) return;

    const isTransition =
      this.state === 'TRANSITION_TO_COVER' || this.state === 'TRANSITION_TO_REVEAL';
    const stepInterval = isTransition ? FAST_STEP_MS : NORMAL_STEP_MS;

    const elapsed = now - this.lastStepTime;
    if (elapsed >= stepInterval) {
      this.lastStepTime = now - (elapsed % stepInterval);
      this.advance();
    }

    this.drawFrame(this.currentFrame);
    this.raf = requestAnimationFrame(this.loop);
  };

  /**
   * Advance frames according to the state machine.
   */
  private advance(): void {
    switch (this.state) {
      case 'NORMAL_LOOP':
        this.currentFrame++;
        if (this.currentFrame > TOTAL_FRAMES) {
          this.currentFrame = 1; // Seamless 001 → 151 → 001 loop
        }
        break;

      case 'TRANSITION_TO_COVER':
        if (this.currentFrame < COVER_START_FRAME) {
          // Smooth accelerated forward step to frame 100
          const diff = COVER_START_FRAME - this.currentFrame;
          const jump = Math.max(1, Math.min(4, Math.ceil(diff / 6)));
          this.currentFrame = Math.min(COVER_START_FRAME, this.currentFrame + jump);
          if (this.currentFrame >= COVER_START_FRAME) {
            this.currentFrame = COVER_START_FRAME;
            this.state = 'COVER_LOOP';
          }
        } else {
          // Already at or past 100, enter COVER_LOOP directly
          this.state = 'COVER_LOOP';
        }
        break;

      case 'COVER_LOOP':
        this.currentFrame++;
        if (this.currentFrame > TOTAL_FRAMES) {
          this.currentFrame = COVER_START_FRAME; // Loop strictly between 100 and 151
        }
        break;

      case 'TRANSITION_TO_REVEAL':
        if (this.currentFrame > 1) {
          // Smooth accelerated backward step to frame 001
          const jump = Math.max(1, Math.min(4, Math.ceil(this.currentFrame / 6)));
          this.currentFrame = Math.max(1, this.currentFrame - jump);
          if (this.currentFrame <= 1) {
            this.currentFrame = 1;
            this.state = 'NORMAL_LOOP';
          }
        } else {
          this.currentFrame = 1;
          this.state = 'NORMAL_LOOP';
        }
        break;
    }
  }

  // ─────────────────────────── Canvas Draw ─────────────────────

  private drawFrame(n: number): void {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas || !this.ctx) return;

    const dpr = this.cachedDpr || 1;
    const cw = canvas.width / dpr;
    const ch = canvas.height / dpr;
    this.ctx.clearRect(0, 0, cw, ch);

    const img = this.frames.get(n) ?? this.nearestLoaded(n);
    if (!img) {
      this.loadFrame(n);
      return;
    }
    this.renderContain(img, cw, ch);
  }

  /**
   * Render frame with object-fit: contain semantics.
   * Anchored bottom-right so the character naturally peeks from the right edge.
   */
  private renderContain(img: HTMLImageElement, cw: number, ch: number): void {
    const iw = img.naturalWidth || 1;
    const ih = img.naturalHeight || 1;
    const scale = Math.min(cw / iw, ch / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    // Align to right edge and bottom
    const dx = cw - dw;
    const dy = ch - dh;
    this.ctx.drawImage(img, dx, dy, dw, dh);
  }

  private nearestLoaded(n: number): HTMLImageElement | null {
    for (let d = 1; d <= 10; d++) {
      const lo = this.frames.get(n - d);
      if (lo) return lo;
      const hi = this.frames.get(n + d);
      if (hi) return hi;
    }
    return null;
  }

  // ─────────────────────────── Preload ─────────────────────────

  private frameSrc(n: number): string {
    return `${FRAME_PATH}ezgif-frame-${String(n).padStart(3, '0')}.png`;
  }

  private preloadAll(): void {
    // Eagerly load normal loop start (1–30) and cover targets (95–115)
    for (let i = 1; i <= 30; i++) this.loadFrame(i);
    for (let i = 95; i <= 115; i++) this.loadFrame(i);

    // Load remaining frames in batches
    const loadBatch = (start: number, end: number, nextDelay: number) => {
      for (let i = start; i <= end; i++) this.loadFrame(i);
    };

    setTimeout(() => loadBatch(31, 94, 200), 100);
    setTimeout(() => loadBatch(116, TOTAL_FRAMES, 200), 250);
  }

  private loadFrame(n: number): void {
    if (this.frames.has(n) || this.loading.has(n)) return;
    this.loading.add(n);
    const img = new Image();
    img.onload = () => {
      this.frames.set(n, img);
      this.loading.delete(n);
    };
    img.onerror = () => this.loading.delete(n);
    img.src = this.frameSrc(n);
  }

  // ─────────────────────────── Resize ──────────────────────────

  private setupResizeObserver(canvas: HTMLCanvasElement): void {
    this.ro = new ResizeObserver(() => this.resizeCanvas(canvas));
    this.ro.observe(canvas.parentElement ?? canvas);
  }

  private resizeCanvas(canvas: HTMLCanvasElement): void {
    const container = canvas.parentElement;
    if (!container) return;
    const { width, height } = container.getBoundingClientRect();
    if (width <= 0 || height <= 0) return;
    this.cachedDpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * this.cachedDpr);
    canvas.height = Math.round(height * this.cachedDpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    this.ctx.setTransform(this.cachedDpr, 0, 0, this.cachedDpr, 0, 0);
    this.drawFrame(this.currentFrame);
  }
}
