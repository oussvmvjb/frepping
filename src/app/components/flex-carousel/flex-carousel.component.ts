import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
  NgZone,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

// ── OGL imports ─────────────────────────────────────────────────────────────
import { Renderer, Camera, Transform, Program, Mesh, Plane, Texture, Vec2, OGLRenderingContext } from 'ogl';

// ── Public item type ─────────────────────────────────────────────────────────
export interface FlexCarouselItem {
  src: string;
  alt: string;
  title?: string;
  subtitle?: string;
  productId?: string;
  price?: string;
  category?: string;
}

// ── Shader source ─────────────────────────────────────────────────────────────
const VERT = /* glsl */`
  attribute vec2 position;
  attribute vec2 uv;
  uniform mat4 modelMatrix;
  uniform mat4 viewMatrix;
  uniform mat4 projectionMatrix;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 0.0, 1.0);
  }
`;

const FRAG = /* glsl */`
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D tMap;
  uniform float uBend;
  uniform float uReach;
  uniform float uDispersion;
  uniform float uLiquid;
  uniform float uProgress;
  uniform float uTime;
  uniform vec2  uLens;
  uniform vec2  uTilt;
  uniform float uLoaded;

  // Lens warp along the horizontal centre
  vec2 lensWarp(vec2 uv, float strength) {
    vec2 c = uv - 0.5;
    float r2 = dot(c, c);
    float bend = strength * uReach;
    c *= 1.0 + bend * r2;
    return c + 0.5;
  }

  void main() {
    // Tilt shift
    vec2 uv = vUv;
    uv += uTilt * 0.012 * (uv - 0.5);

    // Liquid morph: pinch towards centre
    float liq = uLiquid * 0.18;
    uv.x = mix(uv.x, 0.5 + (uv.x - 0.5) * (1.0 - liq), 1.0);

    // Lens bend
    vec2 bent = lensWarp(uv, uBend * uProgress);

    // Chromatic dispersion: sample R/G/B at slightly offset UVs
    float d = uDispersion * 0.018 * uProgress;
    float r = texture2D(tMap, vec2(bent.x - d, bent.y)).r;
    float g = texture2D(tMap, bent).g;
    float b = texture2D(tMap, vec2(bent.x + d, bent.y)).b;
    float a = texture2D(tMap, bent).a;

    // Placeholder grey when not yet loaded
    vec3 colour = mix(vec3(0.12), vec3(r, g, b), uLoaded);

    // Intro fade
    float alpha = a * uProgress;

    gl_FragColor = vec4(colour, alpha);
  }
`;

// ── Spring helper ─────────────────────────────────────────────────────────────
interface Spring {
  pos: number;
  vel: number;
  target: number;
}
function tickSpring(s: Spring, stiffness = 0.10, damping = 0.80): boolean {
  const force = (s.target - s.pos) * stiffness;
  s.vel = s.vel * damping + force;
  s.pos += s.vel;
  return Math.abs(s.vel) > 0.001 || Math.abs(s.target - s.pos) > 0.001;
}

@Component({
  selector: 'app-flex-carousel',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex-carousel-host" #host [style.height.px]="560">
      <canvas #canvas class="flex-carousel-canvas" tabindex="0"
              (keydown)="onKey($event)"></canvas>

      <!-- Caption -->
      <div class="flex-carousel__caption" *ngIf="captions && focusedItem">
        <div class="flex-carousel__title">
          <span>{{ focusedItem.title }}</span>
          <span class="flex-carousel__subtitle" *ngIf="focusedItem.subtitle">
            {{ focusedItem.subtitle }}
          </span>
        </div>
        <div class="flex-carousel__count"
             [attr.data-hidden]="items.length <= 1 ? '' : null">
          <span class="flex-carousel__digits">
            <span class="flex-carousel__digit">
              <div class="flex-carousel__reel"
                   [style.transform]="'translateY(-' + focusedIndex + 'em)'">
                <span *ngFor="let _ of items; let i = index">{{ i + 1 }}</span>
              </div>
            </span>
          </span>
          <span class="flex-carousel__slash">&nbsp;/&nbsp;</span>
          <span>{{ items.length }}</span>
        </div>
      </div>

      <!-- Action bar -->
      <div class="flex-carousel__action-bar" *ngIf="focusedItem?.productId">
        <button class="fc-btn-quick-view" (click)="onQuickView()">
          <i class="fas fa-eye"></i> QUICK VIEW
        </button>
        <span class="fc-btn-add-cart" (click)="onAddToCart()">
          ADD TO CART <i class="fas fa-plus"></i>
        </span>
      </div>

      <!-- CSS fallback -->
      <div class="flex-carousel__fallback" *ngIf="webglFailed">
        <div *ngFor="let item of items; let i = index"
             class="fc-fallback-card"
             (click)="emitClick(i)">
          <img [src]="item.src" [alt]="item.alt">
          <div class="fc-fallback-info">
            <p>{{ item.title }}</p>
            <small>{{ item.subtitle }}</small>
          </div>
        </div>
      </div>

      <!-- Screen-reader live region -->
      <div class="flex-carousel__live" aria-live="polite" aria-atomic="true">
        {{ focusedItem?.title }}
      </div>
    </div>
  `,
  styleUrls: ['./flex-carousel.component.scss'],
})
export class FlexCarouselComponent implements OnInit, AfterViewInit, OnDestroy {
  // ── Inputs ─────────────────────────────────────────────────────────────────
  @Input() items: FlexCarouselItem[] = [];
  @Input() preset: 'liquid' | 'flat' | 'bend' = 'liquid';
  @Input() intro: 'rise' | 'fade' | 'none' = 'rise';
  @Input() cardHeight = 0.5;
  @Input() gap = 12;
  @Input() squeeze = 0.2;
  @Input() focusOnClick = true;
  @Input() captions = true;
  @Input() fit: 'cover' | 'contain' | 'natural' = 'natural';
  @Input() radius = 0;
  @Input() lensWidth = 0.74;
  @Input() lensHeight = 1.18;
  @Input() tilt = 62;
  @Input() roundness = 1;
  @Input() bend = 0.34;
  @Input() reach = 0.38;
  @Input() curl: 'twist' | 'flat' | 'wave' = 'twist';
  @Input() dispersion = 0.45;
  @Input() liquid = 0;
  @Input() followCursor = false;
  @Input() autoplay = false;
  @Input() interval = 4;
  @Input() captureWheel = true;

  // ── Outputs ────────────────────────────────────────────────────────────────
  @Output() itemClick = new EventEmitter<{ index: number; item: FlexCarouselItem }>();
  @Output() itemFocus = new EventEmitter<{ index: number; item: FlexCarouselItem }>();

  // ── View refs ──────────────────────────────────────────────────────────────
  @ViewChild('canvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('host', { static: false })   hostRef!: ElementRef<HTMLDivElement>;

  // ── Public state (bound in template) ──────────────────────────────────────
  webglFailed = false;
  focusedIndex = 0;
  focusedItem: FlexCarouselItem | null = null;

  // ── Private engine state ───────────────────────────────────────────────────
  private renderer!: Renderer;
  private camera!: Camera;
  private scene!: Transform;
  private gl!: OGLRenderingContext;

  private cards: Array<{
    mesh: Mesh;
    program: Program;
    texture: Texture;
    xSpring: Spring;
    ySpring: Spring;   // intro
    alphaSpring: Spring;
    progressSpring: Spring;
  }> = [];

  private raf = 0;
  private resizeObserver!: ResizeObserver;
  private intersectionObserver!: IntersectionObserver;
  private visible = true;
  private autoplayTimer: any = null;
  private wheelDebounce: any = null;

  // drag
  private dragging = false;
  private dragStartX = 0;
  private dragOffsetX = 0;
  private pointerDown = false;

  // layout
  private cW = 0;
  private cH = 0;
  private cardW = 0;
  private cardH = 0;

  // cursor tilt
  private cursorVec = { x: 0, y: 0 };
  private cursorSpring: Spring = { pos: 0, vel: 0, target: 0 };

  // global scroll offset across all cards
  private scrollOffset = 0;
  private scrollVelSpring: Spring = { pos: 0, vel: 0, target: 0 };

  private reducedMotion = false;
  private destroyed = false;
  private time = 0;

  constructor(
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.focusedItem = this.items[0] ?? null;
  }

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.initEngine();
    });
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    cancelAnimationFrame(this.raf);
    clearInterval(this.autoplayTimer);
    clearTimeout(this.wheelDebounce);
    this.resizeObserver?.disconnect();
    this.intersectionObserver?.disconnect();
    this.removeCanvasListeners();
    try { this.renderer?.gl.getExtension('WEBGL_lose_context')?.loseContext(); } catch {}
  }

  // ── Engine bootstrap ────────────────────────────────────────────────────────
  private initEngine(): void {
    const canvas = this.canvasRef.nativeElement;
    const host = this.hostRef.nativeElement;

    try {
      this.renderer = new Renderer({ canvas, alpha: true, antialias: false, dpr: Math.min(window.devicePixelRatio, 2) });
      this.gl = this.renderer.gl;
      this.gl.clearColor(0, 0, 0, 0);
    } catch {
      this.ngZone.run(() => { this.webglFailed = true; this.cdr.detectChanges(); });
      return;
    }

    // Camera – orthographic (NDC coords)
    this.camera = new Camera(this.gl, { near: 0.1, far: 100 });
    this.camera.position.z = 5;

    this.scene = new Transform();

    // Measure host
    this.measureHost();

    // Build cards
    this.buildCards();

    // Intro animation
    if (!this.reducedMotion && this.intro !== 'none') {
      this.items.forEach((_, i) => {
        const c = this.cards[i];
        c.ySpring.pos = this.cH * 0.6;
        c.ySpring.target = 0;
        c.alphaSpring.pos = 0;
        c.alphaSpring.target = 1;
        // Stagger
        setTimeout(() => {
          if (!this.destroyed) {
            c.ySpring.target = 0;
            c.alphaSpring.target = 1;
            c.progressSpring.target = 1;
          }
        }, i * 70);
      });
    } else {
      this.cards.forEach(c => {
        c.ySpring.pos = c.ySpring.target = 0;
        c.alphaSpring.pos = c.alphaSpring.target = 1;
        c.progressSpring.pos = c.progressSpring.target = 1;
      });
    }

    // Observers
    this.setupResizeObserver(host);
    this.setupIntersectionObserver(host);

    // Canvas listeners
    this.addCanvasListeners(canvas);

    // Autoplay
    if (this.autoplay && !this.reducedMotion) {
      this.startAutoplay();
    }

    // Focus first card
    this.setFocused(0);

    // Start loop
    this.loop();
  }

  // ── Card creation ───────────────────────────────────────────────────────────
  private buildCards(): void {
    this.cards = [];
    const gl = this.gl;
    const geo = new Plane(gl, { width: 1, height: 1 });

    this.items.forEach((item, i) => {
      const tex = new Texture(gl, { generateMipmaps: false });
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => { tex.image = img; };
      img.src = item.src;

      const program = new Program(gl, {
        vertex: VERT,
        fragment: FRAG,
        uniforms: {
          tMap:        { value: tex },
          uBend:       { value: this.bend },
          uReach:      { value: this.reach },
          uDispersion: { value: this.dispersion },
          uLiquid:     { value: this.liquid },
          uProgress:   { value: 0 },
          uTime:       { value: 0 },
          uLens:       { value: new Vec2(this.lensWidth, this.lensHeight) },
          uTilt:       { value: new Vec2(0, 0) },
          uLoaded:     { value: 0 },
        },
        transparent: true,
        depthTest: false,
        depthWrite: false,
      });

      // Mark loaded
      img.onload = () => {
        tex.image = img;
        program.uniforms['uLoaded'].value = 1;
      };

      const mesh = new Mesh(gl, { geometry: geo, program });
      mesh.setParent(this.scene);

      // Position — centred on focused, rest spread
      const xTarget = (i - 0) * (this.cardW + this.gap);

      this.cards.push({
        mesh,
        program,
        texture: tex,
        xSpring:       { pos: xTarget, vel: 0, target: xTarget },
        ySpring:       { pos: 0,        vel: 0, target: 0 },
        alphaSpring:   { pos: 0,        vel: 0, target: 1 },
        progressSpring:{ pos: 0,        vel: 0, target: 1 },
      });

      // Scale mesh to card dimensions
      mesh.scale.x = this.cardW;
      mesh.scale.y = this.cardH;
    });

    this.updateScrollPositions();
  }

  // ── Layout helpers ──────────────────────────────────────────────────────────
  private measureHost(): void {
    const host = this.hostRef.nativeElement;
    this.cW = host.clientWidth  || 800;
    this.cH = host.clientHeight || 560;
    this.cardW = this.cW * this.lensWidth;
    this.cardH = this.cH * this.cardHeight;

    this.renderer.setSize(this.cW, this.cH);

    // Orthographic: 1 unit = half container width
    const aspect = this.cW / this.cH;
    (this.camera as any).orthographic?.();
    // Use perspective but map NDC ourselves via scale
    // Camera stays at z=5, fov matched so 1 unit = half height at z=0
    const fov = 2 * Math.atan((this.cH / 2) / 5) * (180 / Math.PI);
    this.camera.perspective({ fov, aspect, near: 0.1, far: 100 });
  }

  // Convert pixel x to NDC x  (centre = 0)
  private pxToNdc(px: number): number {
    return (px / this.cW) * 2 - 1;
  }
  private pxYToNdc(py: number): number {
    return -((py / this.cH) * 2 - 1);
  }
  // Map NDC to world units at z=0 with perspective camera
  private ndcToWorld(ndcX: number, ndcY: number): [number, number] {
    const fovRad = (this.camera as any).fov * Math.PI / 180;
    const halfH = Math.tan(fovRad / 2) * 5; // z=5 camera
    const halfW = halfH * (this.cW / this.cH);
    return [ndcX * halfW, ndcY * halfH];
  }
  private pxToWorld(px: number, py: number): [number, number] {
    return this.ndcToWorld(this.pxToNdc(px), this.pxYToNdc(py));
  }

  // ── Scroll / position ───────────────────────────────────────────────────────
  private updateScrollPositions(): void {
    const nearest = this.nearestIndex();
    this.cards.forEach((c, i) => {
      const stridePx = this.cardW + this.gap;
      c.xSpring.target = (i - nearest) * stridePx + this.scrollOffset;
    });
  }

  private nearestIndex(): number {
    let best = 0;
    let bestDist = Infinity;
    this.cards.forEach((c, i) => {
      const d = Math.abs(c.xSpring.pos - this.scrollOffset);
      if (d < bestDist) { bestDist = d; best = i; }
    });
    return best;
  }

  private goTo(index: number): void {
    index = Math.max(0, Math.min(this.items.length - 1, index));
    this.scrollOffset = 0;
    const stridePx = this.cardW + this.gap;
    this.cards.forEach((c, i) => {
      c.xSpring.target = (i - index) * stridePx;
    });
    this.setFocused(index);
  }

  private snap(): void {
    this.goTo(this.nearestIndex());
  }

  private setFocused(index: number): void {
    this.focusedIndex = index;
    this.focusedItem = this.items[index] ?? null;
    this.ngZone.run(() => { this.cdr.detectChanges(); });
    this.itemFocus.emit({ index, item: this.items[index] });
  }

  emitClick(i: number): void {
    this.ngZone.run(() => {
      this.itemClick.emit({ index: i, item: this.items[i] });
    });
  }

  // ── RAF loop ────────────────────────────────────────────────────────────────
  private loop = (): void => {
    if (this.destroyed) return;
    this.raf = requestAnimationFrame(this.loop);
    if (!this.visible) return;

    this.time += 0.016;

    // Update springs
    const stridePx = this.cardW + this.gap;
    const nearest = this.nearestIndex();

    this.cards.forEach((c, i) => {
      c.xSpring.target = (i - nearest) * stridePx + this.scrollOffset;
      tickSpring(c.xSpring, 0.10, 0.80);
      tickSpring(c.ySpring, 0.10, 0.78);
      tickSpring(c.alphaSpring, 0.12, 0.82);
      tickSpring(c.progressSpring, 0.08, 0.78);

      // Scale: focused card slightly larger
      const isFocused = i === nearest;
      const targetScaleX = isFocused ? this.cardW * (1 + this.squeeze * 0.4) : this.cardW;
      const targetScaleY = isFocused ? this.cardH * (1 + this.squeeze * 0.2) : this.cardH;
      c.mesh.scale.x += (targetScaleX - c.mesh.scale.x) * 0.1;
      c.mesh.scale.y += (targetScaleY - c.mesh.scale.y) * 0.1;

      // World position
      const [wx, wy] = this.pxToWorld(
        this.cW / 2 + c.xSpring.pos,
        this.cH / 2 - c.ySpring.pos,
      );
      c.mesh.position.x = wx;
      c.mesh.position.y = wy;

      // Uniforms
      c.program.uniforms['uProgress'].value = c.progressSpring.pos;
      c.program.uniforms['uTime'].value = this.time;
      const tx = this.followCursor ? this.cursorVec.x : 0;
      const ty = this.followCursor ? this.cursorVec.y : 0;
      (c.program.uniforms['uTilt'].value as Vec2).set(tx, ty);
    });

    // Update focused if scroll changed enough
    const newNearest = this.nearestIndex();
    if (newNearest !== this.focusedIndex) {
      this.setFocused(newNearest);
    }

    this.renderer.render({ scene: this.scene, camera: this.camera });
  };

  // ── Canvas event listeners ─────────────────────────────────────────────────
  private _onPointerDown!: (e: PointerEvent) => void;
  private _onPointerMove!: (e: PointerEvent) => void;
  private _onPointerUp!: (e: PointerEvent) => void;
  private _onWheel!: (e: WheelEvent) => void;
  private _onPointerEnter!: () => void;
  private _onPointerLeave!: () => void;
  private _onClick!: (e: MouseEvent) => void;
  private _onMouseMove!: (e: MouseEvent) => void;

  private addCanvasListeners(canvas: HTMLCanvasElement): void {
    this._onPointerDown = (e) => this.onPointerDown(e);
    this._onPointerMove = (e) => this.onPointerMove(e);
    this._onPointerUp   = (e) => this.onPointerUp(e);
    this._onWheel       = (e) => this.onWheel(e);
    this._onPointerEnter = () => this.onPointerEnter();
    this._onPointerLeave = () => this.onPointerLeave();
    this._onClick       = (e) => this.onClick(e);
    this._onMouseMove   = (e) => this.onMouseMove(e);

    canvas.addEventListener('pointerdown',  this._onPointerDown,  { passive: true });
    canvas.addEventListener('pointermove',  this._onPointerMove,  { passive: true });
    canvas.addEventListener('pointerup',    this._onPointerUp,    { passive: true });
    canvas.addEventListener('pointercancel',this._onPointerUp,    { passive: true });
    canvas.addEventListener('pointerenter', this._onPointerEnter, { passive: true });
    canvas.addEventListener('pointerleave', this._onPointerLeave, { passive: true });
    canvas.addEventListener('click',        this._onClick);
    canvas.addEventListener('mousemove',    this._onMouseMove,    { passive: true });
    if (this.captureWheel) {
      canvas.addEventListener('wheel', this._onWheel, { passive: false });
    }
  }

  private removeCanvasListeners(): void {
    if (!this.canvasRef) return;
    const canvas = this.canvasRef.nativeElement;
    canvas.removeEventListener('pointerdown',   this._onPointerDown);
    canvas.removeEventListener('pointermove',   this._onPointerMove);
    canvas.removeEventListener('pointerup',     this._onPointerUp);
    canvas.removeEventListener('pointercancel', this._onPointerUp);
    canvas.removeEventListener('pointerenter',  this._onPointerEnter);
    canvas.removeEventListener('pointerleave',  this._onPointerLeave);
    canvas.removeEventListener('click',         this._onClick);
    canvas.removeEventListener('mousemove',     this._onMouseMove);
    canvas.removeEventListener('wheel',         this._onWheel);
  }

  private onPointerDown(e: PointerEvent): void {
    this.pointerDown = true;
    this.dragging = false;
    this.dragStartX = e.clientX;
    this.dragOffsetX = 0;
    this.canvasRef.nativeElement.setPointerCapture(e.pointerId);
    this.canvasRef.nativeElement.setAttribute('data-dragging', '');
    clearInterval(this.autoplayTimer);
  }

  private onPointerMove(e: PointerEvent): void {
    if (!this.pointerDown) return;
    const dx = e.clientX - this.dragStartX;
    if (Math.abs(dx) > 4) { this.dragging = true; }
    if (this.dragging) {
      this.scrollOffset = dx;
      this.dragOffsetX = dx;
    }
  }

  private onPointerUp(e: PointerEvent): void {
    this.pointerDown = false;
    this.canvasRef.nativeElement.removeAttribute('data-dragging');
    if (this.dragging) {
      this.dragging = false;
      this.scrollOffset = 0;
      this.snap();
    }
  }

  private onWheel(e: WheelEvent): void {
    e.preventDefault();
    this.scrollOffset -= e.deltaX * 0.8 + e.deltaY * 0.4;
    clearTimeout(this.wheelDebounce);
    this.wheelDebounce = setTimeout(() => {
      this.scrollOffset = 0;
      this.snap();
    }, 80);
  }

  private onClick(e: MouseEvent): void {
    if (this.dragging) return;
    const nearest = this.nearestIndex();
    if (this.focusOnClick) {
      const progSpring = this.cards[nearest]?.progressSpring;
      if (progSpring) {
        progSpring.target = progSpring.target < 0.99 ? 1 : 1;
      }
    }
    this.ngZone.run(() => {
      this.itemClick.emit({ index: nearest, item: this.items[nearest] });
    });
  }

  private onPointerEnter(): void {
    clearInterval(this.autoplayTimer);
  }

  private onPointerLeave(): void {
    this.cursorVec = { x: 0, y: 0 };
    if (this.autoplay && !this.reducedMotion) { this.startAutoplay(); }
  }

  private onMouseMove(e: MouseEvent): void {
    if (!this.followCursor) return;
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    this.cursorVec.x = ((e.clientX - rect.left) / rect.width  - 0.5) * 2;
    this.cursorVec.y = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;
  }

  // ── Keyboard ────────────────────────────────────────────────────────────────
  onKey(e: KeyboardEvent): void {
    if (e.key === 'ArrowLeft')  { e.preventDefault(); this.goTo(this.focusedIndex - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); this.goTo(this.focusedIndex + 1); }
  }

  // ── Autoplay ────────────────────────────────────────────────────────────────
  private startAutoplay(): void {
    clearInterval(this.autoplayTimer);
    this.autoplayTimer = setInterval(() => {
      const next = (this.focusedIndex + 1) % this.items.length;
      this.goTo(next);
    }, this.interval * 1000);
  }

  // ── ResizeObserver ──────────────────────────────────────────────────────────
  private setupResizeObserver(host: HTMLElement): void {
    this.resizeObserver = new ResizeObserver(() => {
      this.measureHost();
      this.cards.forEach(c => {
        c.mesh.scale.x = this.cardW;
        c.mesh.scale.y = this.cardH;
      });
      this.updateScrollPositions();
    });
    this.resizeObserver.observe(host);
  }

  // ── IntersectionObserver ────────────────────────────────────────────────────
  private setupIntersectionObserver(host: HTMLElement): void {
    this.intersectionObserver = new IntersectionObserver(
      (entries) => { this.visible = entries[0].isIntersecting; },
      { threshold: 0.1 },
    );
    this.intersectionObserver.observe(host);
  }

  // ── Public action handlers (called from template) ──────────────────────────
  onQuickView(): void {
    this.ngZone.run(() => {
      this.itemClick.emit({ index: this.focusedIndex, item: this.items[this.focusedIndex] });
    });
  }

  onAddToCart(): void {
    // The host component listens via (itemClick) or a dedicated output.
    // We re-use itemClick with a synthetic marker — the parent checks productId.
    this.ngZone.run(() => {
      this.itemClick.emit({ index: this.focusedIndex, item: { ...this.items[this.focusedIndex], _addToCart: true } as any });
    });
  }
}
