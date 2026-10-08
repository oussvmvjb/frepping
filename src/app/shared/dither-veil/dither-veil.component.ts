import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  OnDestroy,
  AfterViewInit,
  SimpleChanges,
  ElementRef,
  ViewChild,
  NgZone,
  ChangeDetectionStrategy,
  PLATFORM_ID,
  Inject,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Renderer, Program, Mesh, Triangle, Texture, RenderTarget } from 'ogl';

// ── Constants (same as React source) ──────────────────────────────────────
const MASK_SCALE   = 0.5;
const MAX_BURSTS   = 4;
const BURST_SECONDS = 1.2;
const HOLD         = 1.6;
const INTRO_MS     = 1100;

const ORDERED: Record<string, number> = { bayer: 0, noise: 1, lines: 2 };

const KERNELS: Record<string, number[][]> = {
  atkinson: [[1,0,1/8],[2,0,1/8],[-1,1,1/8],[0,1,1/8],[1,1,1/8],[0,2,1/8]],
  floyd:    [[1,0,7/16],[-1,1,3/16],[0,1,5/16],[1,1,1/16]],
};

// ── Helpers ────────────────────────────────────────────────────────────────
function hexToRgb(hex: string): [number, number, number] {
  let h = String(hex || '').replace('#', '');
  if (h.length === 3) h = h.replace(/./g, (c: string) => c + c);
  const n = parseInt(h.slice(0, 6), 16);
  if (Number.isNaN(n)) return [0, 0, 0];
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

function fitScale(w: number, h: number, iw: number, ih: number, contain: boolean): [number, number] {
  const ratio = (w / h) / (iw / ih);
  if (contain) return ratio > 1 ? [ratio, 1] : [1, 1 / ratio];
  return ratio > 1 ? [1, 1 / ratio] : [ratio, 1];
}

function wanderAt(t: number, w: number, h: number): [number, number] {
  return [
    w * (0.5 + 0.33 * Math.sin(t * 0.53) + 0.08 * Math.sin(t * 1.31 + 0.6)),
    h * (0.5 + 0.28 * Math.sin(t * 0.71 + 1.1) + 0.07 * Math.cos(t * 1.57)),
  ];
}

function measureEdge(context: CanvasRenderingContext2D, image: HTMLImageElement) {
  const size = 32;
  context.canvas.width = size;
  context.canvas.height = size;
  context.drawImage(image, 0, 0, size, size);
  const data = context.getImageData(0, 0, size, size).data;
  const sum = [0, 0, 0];
  const squares = [0, 0, 0];
  let count = 0;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (x > 0 && y > 0 && x < size - 1 && y < size - 1) continue;
      for (let c = 0; c < 3; c++) {
        const v = data[(y * size + x) * 4 + c] / 255;
        sum[c] += v;
        squares[c] += v * v;
      }
      count++;
    }
  }
  const matte = [sum[0] / count, sum[1] / count, sum[2] / count] as [number,number,number];
  const spread = matte.reduce(
    (total, mean, c) => total + Math.sqrt(Math.max(0, squares[c] / count - mean * mean)), 0) / 3;
  return { matte, plain: spread < 0.06 };
}

// Module-level blue-noise cache (same as React source)
let blueNoiseCache: Uint8Array | null = null;
function getBlueNoise(): Uint8Array {
  if (blueNoiseCache) return blueNoiseCache;
  const size = 64; const n = size * size; const wrap = size - 1;
  const taps: number[] = [];
  for (let dy = -6; dy <= 6; dy++)
    for (let dx = -6; dx <= 6; dx++)
      taps.push(dx, dy, Math.exp(-(dx * dx + dy * dy) / 4.5));
  const energy = new Float32Array(n);
  const on = new Uint8Array(n);
  const splat = (i: number, sign: number) => {
    const x = i % size; const y = (i - x) / size;
    for (let k = 0; k < taps.length; k += 3)
      energy[((y + taps[k + 1]) & wrap) * size + ((x + taps[k]) & wrap)] += sign * taps[k + 2];
  };
  const find = (state: number, highest: boolean) => {
    let best = 0; let value = highest ? -Infinity : Infinity;
    for (let i = 0; i < n; i++) {
      if (on[i] !== state) continue;
      if (highest ? energy[i] > value : energy[i] < value) { value = energy[i]; best = i; }
    }
    return best;
  };
  let seed = 7;
  const random = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  const initial = Math.round(n * 0.1);
  for (let placed = 0; placed < initial; ) {
    const i = Math.floor(random() * n);
    if (on[i]) continue; on[i] = 1; splat(i, 1); placed++;
  }
  for (let guard = 0; guard < n; guard++) {
    const cluster = find(1, true); on[cluster] = 0; splat(cluster, -1);
    const gap = find(0, false); on[gap] = 1; splat(gap, 1);
    if (gap === cluster) break;
  }
  const seedOn = on.slice(); const seedEnergy = energy.slice();
  const rank = new Uint16Array(n);
  for (let r = initial - 1; r >= 0; r--) {
    const cluster = find(1, true); on[cluster] = 0; splat(cluster, -1); rank[cluster] = r;
  }
  on.set(seedOn); energy.set(seedEnergy);
  for (let r = initial; r < n; r++) {
    const gap = find(0, false); on[gap] = 1; splat(gap, 1); rank[gap] = r;
  }
  const data = new Uint8Array(n * 4);
  for (let i = 0; i < n; i++) {
    const v = Math.floor((rank[i] / n) * 256);
    data[i * 4] = data[i * 4 + 1] = data[i * 4 + 2] = v; data[i * 4 + 3] = 255;
  }
  blueNoiseCache = data;
  return data;
}

function diffuse(
  pixels: Uint8ClampedArray, cols: number, rows: number,
  kernel: number[][], levels: number, rgb: boolean,
  grade: (v: number) => number,
): Uint8Array {
  const channels = rgb ? 3 : 1;
  const values = new Float32Array(cols * rows * channels);
  for (let i = 0; i < cols * rows; i++) {
    const r = pixels[i*4]/255, g = pixels[i*4+1]/255, b = pixels[i*4+2]/255;
    if (rgb) { values[i*3]=grade(r); values[i*3+1]=grade(g); values[i*3+2]=grade(b); }
    else values[i] = grade(0.2126*r + 0.7152*g + 0.0722*b);
  }
  const steps = levels - 1;
  const out = new Uint8Array(cols * rows * 4);
  for (let y = 0; y < rows; y++) {
    const dir = y & 1 ? -1 : 1;
    for (let i = 0; i < cols; i++) {
      const x = dir > 0 ? i : cols - 1 - i;
      const p = y * cols + x;
      for (let c = 0; c < channels; c++) {
        const old = values[p * channels + c];
        const q = Math.min(steps, Math.max(0, Math.round(old * steps))) / steps;
        const err = old - q;
        const byte = Math.round(q * 255);
        if (rgb) out[p*4+c] = byte;
        else out[p*4] = out[p*4+1] = out[p*4+2] = byte;
        for (const k of kernel) {
          const nx = x + k[0] * dir; const ny = y + k[1];
          if (nx < 0 || nx >= cols || ny >= rows) continue;
          values[(ny * cols + nx) * channels + c] += err * k[2];
        }
      }
      out[p*4+3] = 255;
    }
  }
  return out;
}

// ── GLSL ──────────────────────────────────────────────────────────────────
const vertex = `#version 300 es
in vec2 position;
in vec2 uv;
out vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position, 0.0, 1.0); }`;

const maskFragment = `#version 300 es
precision highp float;
uniform sampler2D tPrev;
uniform vec2 uSize;
uniform vec2 uFrom;
uniform vec2 uTo;
uniform float uRadius;
uniform float uSoftness;
uniform float uStrength;
uniform float uFade;
uniform float uHold;
in vec2 vUv;
out vec4 fragColor;
float strokeDistance(vec2 p, vec2 a, vec2 b) {
  vec2 ab = b - a;
  float h = clamp(dot(p-a,ab)/max(dot(ab,ab),0.0001),0.0,1.0);
  return length(p-a-ab*h);
}
void main() {
  vec2 p = vec2(vUv.x, 1.0-vUv.y)*uSize;
  float trail = max(texture(tPrev,vUv).r-uFade,0.0);
  float band  = max(uRadius*uSoftness,1.0)*uHold;
  float d     = strokeDistance(p,uFrom,uTo);
  trail = max(trail,clamp((uRadius-d)/band,0.0,1.0)*uStrength);
  fragColor = vec4(trail,0.0,0.0,1.0);
}`;

const viewFragment = `#version 300 es
precision highp float;
precision highp int;
uniform sampler2D tImage;
uniform sampler2D tMask;
uniform sampler2D tNoise;
uniform sampler2D tDiffused;
uniform vec2 uResolution;
uniform vec2 uCover;
uniform float uLod;
uniform float uCell;
uniform int uPattern;
uniform int uPalette;
uniform float uLevels;
uniform vec3 uInk;
uniform vec3 uPaper;
uniform vec3 uRimColor;
uniform float uRim;
uniform float uContrast;
uniform float uBrightness;
uniform float uReverse;
uniform float uIntro;
uniform float uHold;
uniform vec3 uMatte;
uniform float uKey;
uniform vec2 uSize;
uniform vec4 uBursts[4];
uniform float uBurstWidth;
in vec2 vUv;
out vec4 fragColor;
float bayer(vec2 cell){
  ivec2 p=ivec2(mod(cell,8.0));
  int v=p.x^p.y;
  int m=((v&1)<<5)|((p.y&1)<<4)|((v&2)<<2)|((p.y&2)<<1)|((v&4)>>1)|((p.y&4)>>2);
  return(float(m)+0.5)/64.0;
}
float blueNoiseSamp(vec2 cell){
  return(texelFetch(tNoise,ivec2(mod(cell,64.0)),0).r*255.0+0.5)/256.0;
}
float engraving(vec2 cell){
  float period=6.0;
  float f=(mod(cell.x+cell.y,period)+0.5)/period;
  return clamp(abs(f*2.0-1.0)+(bayer(cell)-0.5)*(2.0/period),0.0,1.0);
}
vec2 imageUv(vec2 uv){return(uv-0.5)*uCover+0.5;}
float within(vec2 p){vec2 s=step(vec2(0.0),p)*step(p,vec2(1.0));return s.x*s.y;}
vec3 grade(vec3 c){return pow(clamp((c-0.5)*uContrast+0.5+uBrightness,0.0,1.0),vec3(1.6));}
float shockwave(vec2 p){
  float value=0.0;
  for(int i=0;i<4;i++){
    vec4 burst=uBursts[i];
    if(burst.w<=0.0)continue;
    float offset=distance(p,burst.xy)-burst.z;
    float edge=offset>0.0?offset/(uBurstWidth*0.35):-offset/uBurstWidth;
    value=max(value,clamp(1.0-edge,0.0,1.0)*burst.w);
  }
  return value;
}
vec3 toned(vec3 c){return uPalette==1?grade(c):grade(vec3(dot(c,vec3(0.2126,0.7152,0.0722))));}
vec3 quantize(vec3 v,float t){
  float steps=max(uLevels-1.0,1.0);
  vec3 s=v*steps;
  vec3 base=floor(s);
  return min(base+step(vec3(t),s-base),vec3(steps))/steps;
}
void main(){
  vec2 px=vec2(gl_FragCoord.x,uResolution.y-gl_FragCoord.y);
  vec2 cell=floor(px/uCell);
  vec2 center=(cell+0.5)*uCell;
  vec2 cellUv=vec2(center.x/uResolution.x,1.0-center.y/uResolution.y);
  vec2 sampleUv=imageUv(cellUv);
  float framed=within(sampleUv);
  vec3 level;
  if(uPattern==3){
    level=texelFetch(tDiffused,ivec2(cell),0).rgb;
  } else {
    vec3 c=mix(uMatte,textureLod(tImage,sampleUv,uLod).rgb,framed);
    float t=uPattern==1?blueNoiseSamp(cell):(uPattern==2?engraving(cell):bayer(cell));
    level=quantize(toned(c),t);
  }
  vec3 color=mix(uInk,mix(uInk,uPaper,level),max(framed,uKey));
  vec3 backdrop=mix(uInk,uPaper,toned(uMatte));
  vec2 photoUv=imageUv(vUv);
  vec3 raw=texture(tImage,photoUv).rgb;
  float plain=uKey*(1.0-smoothstep(0.05,0.22,distance(raw,uMatte)));
  vec3 photo=mix(mix(uInk,backdrop,uKey),mix(raw,backdrop,plain),within(photoUv));
  vec2 point=vec2(cellUv.x,1.0-cellUv.y)*uSize;
  float mask=max(clamp(texture(tMask,cellUv).r*uHold,0.0,1.0),shockwave(point));
  float shown=mix(mask,1.0-mask,uReverse);
  float order=bayer(cell.yx);
  float low=order*(1.0-uRim);
  color=mix(color,uRimColor,step(low,shown)*step(0.001,uRim));
  color=mix(color,photo,step(low+uRim,shown));
  vec2 aspect=vec2(uResolution.x/uResolution.y,1.0);
  float spread=length((cellUv-0.5)*aspect)/length(aspect*0.5);
  float appear=step(spread*0.72+bayer(cell+vec2(3.0,5.0))*0.28,uIntro*1.001);
  fragColor=vec4(mix(uInk,color,appear),1.0);
}`;

// ── Component ──────────────────────────────────────────────────────────────
@Component({
  selector: 'app-dither-veil',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div #host class="dither-veil"></div>`,
  styleUrls: ['./dither-veil.component.scss'],
})
export class DitherVeilComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('host', { static: false }) hostRef!: ElementRef<HTMLDivElement>;

  // ── Inputs (matching React props) ─────────────────────────────────────
  @Input() src            = '';
  @Input() fit            = 'contain';
  @Input() pattern        = 'floyd';
  @Input() pixelSize      = 2;
  @Input() levels         = 2;
  @Input() palette        = 'duotone';
  @Input() inkColor       = '#120f17';
  @Input() paperColor     = '#f4f1ea';
  @Input() contrast       = 1.15;
  @Input() brightness     = 0;
  @Input() revealRadius   = 200;
  @Input() softness       = 0.6;
  @Input() linger         = 1;
  @Input() rimColor       = '#a78bfa';
  @Input() rim            = 0;
  @Input() reverse        = false;
  @Input() wander         = false;
  @Input() clickBurst     = true;

  @Output() imageError = new EventEmitter<void>();

  // ── Private renderer state ─────────────────────────────────────────────
  private renderer: any = null;
  private gl: any = null;
  private canvas: HTMLCanvasElement | null = null;
  private maskMesh: any = null;
  private viewMesh: any = null;
  private maskUniforms: any = null;
  private viewUniforms: any = null;
  private masks: any[] = [];
  private noiseTexture: any = null;
  private diffusedTexture: any = null;
  private imageTexture: any = null;
  private floatMask = false;
  private sampler: HTMLCanvasElement | null = null;
  private samplerCtx: CanvasRenderingContext2D | null = null;

  private image: HTMLImageElement | null = null;
  private introStart = 0;
  private diffusedKey = '';
  private diffusionBlocked = false;
  private vWidth = 1;
  private vHeight = 1;
  private visible = true;
  private raf = 0;
  private last = 0;
  private trailUntil = 0;
  private presence = 0;
  private drift = 0;
  private pointer = { x: 0, y: 0, inside: false, fresh: true, placed: false };
  private brush = { x: 0, y: 0, px: 0, py: 0 };
  private bursts: { x: number; y: number; start: number }[] = [];

  private resizeObserver: ResizeObserver | null = null;
  private intersectionObserver: IntersectionObserver | null = null;
  private onMove!: (e: PointerEvent) => void;
  private onLeave!: () => void;
  private onDown!: (e: PointerEvent) => void;
  private reducedMotion = false;
  private initialized = false;
  private currentSrc = '';

  constructor(
    private zone: NgZone,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.zone.runOutsideAngular(() => this.initRenderer());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.initialized) return;
    if (changes['src'] && !changes['src'].firstChange) {
      this.zone.runOutsideAngular(() => this.reloadImage(this.src));
    }
    // All other input changes: just wake (the frame loop reads inputs directly)
    this.wake();
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  // ── Getters used by the frame loop (replaces settingsRef.current) ──────
  private get settings() {
    return {
      fit: this.fit, pattern: this.pattern, pixelSize: this.pixelSize,
      levels: this.levels, palette: this.palette, inkColor: this.inkColor,
      paperColor: this.paperColor, contrast: this.contrast, brightness: this.brightness,
      revealRadius: this.revealRadius, softness: this.softness, linger: this.linger,
      rimColor: this.rimColor, rim: this.rim, reverse: this.reverse,
      wander: this.wander, clickBurst: this.clickBurst,
    };
  }

  // ── Renderer init ──────────────────────────────────────────────────────
  private initRenderer(): void {
    const container = this.hostRef?.nativeElement;
    if (!container) return;

    this.reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

    // Mobile: cap DPR at 1.5
    const isMobile = window.innerWidth <= 768;
    const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);

    let renderer: any;
    try {
      renderer = new Renderer({ dpr, alpha: false, antialias: false });
    } catch {
      this.zone.run(() => this.imageError.emit());
      return;
    }

    this.renderer = renderer;
    const gl = renderer.gl;
    this.gl = gl;
    const canvas = gl.canvas as HTMLCanvasElement;
    this.canvas = canvas;
    canvas.style.cssText = 'display:block;width:100%;height:100%;';
    container.appendChild(canvas);

    this.floatMask = renderer.isWebgl2 && !!renderer.getExtension('EXT_color_buffer_float');
    const geometry = new Triangle(gl);

    const dataTexture = () => new Texture(gl, {
      image: new Uint8Array(4), width: 1, height: 1,
      generateMipmaps: false, flipY: false,
      minFilter: gl.NEAREST, magFilter: gl.NEAREST,
    });

    this.imageTexture  = new Texture(gl, { minFilter: gl.LINEAR_MIPMAP_LINEAR, magFilter: gl.LINEAR });
    this.noiseTexture  = dataTexture();
    this.diffusedTexture = dataTexture();

    this.masks = [this.createMask(2, 2), this.createMask(2, 2)];

    this.maskUniforms = {
      tPrev: { value: this.masks[0].texture },
      uSize: { value: [1,1] }, uFrom: { value: [0,0] }, uTo: { value: [0,0] },
      uRadius: { value: 1 }, uSoftness: { value: 0.5 },
      uStrength: { value: 0 }, uFade: { value: 1 }, uHold: { value: HOLD },
    };
    this.viewUniforms = {
      tImage: { value: this.imageTexture }, tMask: { value: this.masks[0].texture },
      tNoise: { value: this.noiseTexture }, tDiffused: { value: this.diffusedTexture },
      uResolution: { value: [1,1] }, uCover: { value: [1,1] },
      uLod: { value: 0 }, uCell: { value: 3 }, uPattern: { value: 0 }, uPalette: { value: 0 },
      uLevels: { value: 2 }, uInk: { value: [0,0,0] }, uPaper: { value: [1,1,1] },
      uRimColor: { value: [1,1,1] }, uRim: { value: 0 }, uContrast: { value: 1 },
      uBrightness: { value: 0 }, uReverse: { value: 0 }, uIntro: { value: 0 },
      uHold: { value: HOLD }, uMatte: { value: [0,0,0] }, uKey: { value: 0 },
      uSize: { value: [1,1] },
      uBursts: { value: new Array(MAX_BURSTS * 4).fill(0) },
      uBurstWidth: { value: 60 },
    };

    const mkProgram = (frag: string, uniforms: any) =>
      new Program(gl, { vertex, fragment: frag, uniforms, depthTest: false, depthWrite: false });

    this.maskMesh = new Mesh(gl, { geometry, program: mkProgram(maskFragment, this.maskUniforms) });
    this.viewMesh = new Mesh(gl, { geometry, program: mkProgram(viewFragment, this.viewUniforms) });

    this.sampler   = document.createElement('canvas');
    this.samplerCtx = this.sampler.getContext('2d', { willReadFrequently: true });

    // Pointer handlers
    this.onMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      this.pointer.x = e.clientX - rect.left;
      this.pointer.y = e.clientY - rect.top;
      this.pointer.placed = true;
      if (!this.pointer.inside) { this.pointer.inside = true; this.pointer.fresh = true; }
      this.wake();
    };
    this.onLeave = () => { this.pointer.inside = false; this.wake(); };
    this.onDown  = (e: PointerEvent) => {
      this.onMove(e);
      const s = this.settings;
      if (!s.clickBurst || (e.pointerType === 'mouse' && e.button !== 0)) return;
      this.bursts.push({ x: this.pointer.x, y: this.pointer.y, start: performance.now() });
      if (this.bursts.length > MAX_BURSTS) this.bursts.shift();
    };

    container.addEventListener('pointermove',  this.onMove,  { passive: true });
    container.addEventListener('pointerenter', this.onMove,  { passive: true });
    container.addEventListener('pointerdown',  this.onDown,  { passive: true });
    container.addEventListener('pointerleave', this.onLeave, { passive: true });
    container.addEventListener('pointercancel',this.onLeave, { passive: true });

    this.resizeObserver = new ResizeObserver(() => { this.layout(); this.wake(); });
    this.resizeObserver.observe(container);

    this.intersectionObserver = new IntersectionObserver(([entry]) => {
      this.visible = entry.isIntersecting;
      this.wake();
    });
    this.intersectionObserver.observe(container);

    this.layout();
    this.initialized = true;

    // Load initial image
    this.reloadImage(this.src);
    this.wake();
  }

  private createMask(w: number, h: number): any {
    const gl = this.gl;
    return new RenderTarget(gl, {
      width: w, height: h, depth: false,
      type: this.floatMask ? gl.HALF_FLOAT : gl.UNSIGNED_BYTE,
      internalFormat: this.floatMask ? gl.RGBA16F : gl.RGBA,
      minFilter: gl.LINEAR, magFilter: gl.LINEAR,
    });
  }

  private destroyMask(target: any): void {
    const gl = this.gl;
    if (!gl) return;
    try { gl.deleteFramebuffer(target.buffer); } catch {}
    try { gl.deleteTexture(target.texture.texture); } catch {}
  }

  private layout(): void {
    const container = this.hostRef?.nativeElement;
    if (!container || !this.renderer || !this.canvas) return;
    this.vWidth  = Math.max(1, container.clientWidth);
    this.vHeight = Math.max(1, container.clientHeight);
    this.renderer.setSize(this.vWidth, this.vHeight);
    this.viewUniforms.uResolution.value = [this.canvas.width, this.canvas.height];
    this.maskUniforms.uSize.value = [this.vWidth, this.vHeight];
    this.viewUniforms.uSize.value = [this.vWidth, this.vHeight];
    const mw = Math.max(2, Math.round(this.vWidth  * MASK_SCALE));
    const mh = Math.max(2, Math.round(this.vHeight * MASK_SCALE));
    if (mw !== this.masks[0].width || mh !== this.masks[0].height) {
      this.masks.forEach(m => this.destroyMask(m));
      this.masks = [this.createMask(mw, mh), this.createMask(mw, mh)];
    }
    if (!this.pointer.placed) {
      this.pointer.x = this.vWidth / 2;
      this.pointer.y = this.vHeight / 2;
    }
  }

  private reloadImage(src: string): void {
    if (!src || src === this.currentSrc) return;
    this.currentSrc = src;
    this.image = null;
    this.diffusedKey = '';
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.decoding = 'async';
    img.onload = () => {
      this.image = img;
      this.imageTexture.image = img;
      this.imageTexture.needsUpdate = true;
      try {
        if (this.samplerCtx) {
          const edge = measureEdge(this.samplerCtx, img);
          this.viewUniforms.uMatte.value = edge.matte;
          this.viewUniforms.uKey.value = edge.plain ? 1 : 0;
        }
      } catch {}
      this.introStart = performance.now();
      this.wake();
    };
    img.onerror = () => {
      // Retry without crossOrigin in case CORS headers are absent
      const fallbackImg = new Image();
      fallbackImg.decoding = 'async';
      fallbackImg.onload = () => {
        this.image = fallbackImg;
        this.imageTexture.image = fallbackImg;
        this.imageTexture.needsUpdate = true;
        this.introStart = performance.now();
        this.wake();
      };
      fallbackImg.onerror = () => {
        this.zone.run(() => this.imageError.emit());
      };
      fallbackImg.src = src;
    };
    img.src = src;
  }

  private updateDiffusion(cell: number, s: typeof this.settings): void {
    if (!this.image || !this.samplerCtx || !this.canvas) return;
    const cols = Math.ceil(this.canvas.width / cell);
    const rows = Math.ceil(this.canvas.height / cell);
    const key = [s.pattern, s.levels, s.palette, s.contrast, s.brightness, s.fit,
                  cols, rows, this.canvas.width, this.canvas.height].join('|');
    if (key === this.diffusedKey) return;
    this.diffusedKey = key;
    const [cx, cy] = this.viewUniforms.uCover.value as [number, number];
    const iw = this.image.naturalWidth, ih = this.image.naturalHeight;
    this.sampler!.width = cols; this.sampler!.height = rows;
    this.samplerCtx.imageSmoothingEnabled = true;
    this.samplerCtx.imageSmoothingQuality = 'high';
    const [mr, mg, mb] = this.viewUniforms.uMatte.value as [number,number,number];
    this.samplerCtx.fillStyle = `rgb(${mr*255},${mg*255},${mb*255})`;
    this.samplerCtx.fillRect(0, 0, cols, rows);
    const sx = (0.5 - 0.5*cx)*iw, sy = (0.5 - 0.5*cy)*ih;
    const sw = ((cols*cell)/this.canvas.width)*cx*iw;
    const sh = ((rows*cell)/this.canvas.height)*cy*ih;
    const x0=Math.max(sx,0), y0=Math.max(sy,0);
    const x1=Math.min(sx+sw,iw), y1=Math.min(sy+sh,ih);
    if (x1>x0 && y1>y0) {
      this.samplerCtx.drawImage(this.image, x0,y0,x1-x0,y1-y0,
        ((x0-sx)/sw)*cols, ((y0-sy)/sh)*rows,
        ((x1-x0)/sw)*cols, ((y1-y0)/sh)*rows);
    }
    const grade = (v: number) => Math.pow(Math.min(1, Math.max(0, (v-0.5)*s.contrast+0.5+s.brightness)), 1.6);
    const pixels = this.samplerCtx.getImageData(0, 0, cols, rows).data;
    this.diffusedTexture.image = diffuse(pixels, cols, rows, KERNELS[s.pattern], s.levels, s.palette==='rgb', grade);
    this.diffusedTexture.width = cols;
    this.diffusedTexture.height = rows;
    this.diffusedTexture.needsUpdate = true;
  }

  private frame = (now: number): void => {
    this.raf = 0;
    const s = this.settings;
    const dt = Math.min(0.05, Math.max(0, (now - this.last) / 1000));
    this.last = now;

    const wanderOn = s.wander && !this.reducedMotion;
    let targetX = this.pointer.x, targetY = this.pointer.y;
    if (!this.pointer.inside && wanderOn) {
      this.drift = Math.min(1, this.drift + dt / 1.2);
      const [wx, wy] = wanderAt(now / 1000, this.vWidth, this.vHeight);
      const k = this.drift * this.drift * (3 - 2 * this.drift);
      targetX += (wx - targetX) * k;
      targetY += (wy - targetY) * k;
    } else {
      this.drift = 0;
    }

    this.presence += ((this.pointer.inside || wanderOn ? 1 : 0) - this.presence) * (1 - Math.exp(-dt / 0.16));

    if (this.pointer.fresh) {
      this.brush.x = this.brush.px = targetX;
      this.brush.y = this.brush.py = targetY;
      this.pointer.fresh = false;
    } else {
      const follow = 1 - Math.exp(-dt / 0.035);
      this.brush.x += (targetX - this.brush.x) * follow;
      this.brush.y += (targetY - this.brush.y) * follow;
    }

    const burstData = this.viewUniforms.uBursts.value as number[];
    burstData.fill(0);
    for (let i = this.bursts.length - 1; i >= 0; i--) {
      if ((now - this.bursts[i].start) / 1000 >= BURST_SECONDS) this.bursts.splice(i, 1);
    }
    this.bursts.forEach((b, i) => {
      const k = Math.max(0, (now - b.start) / 1000 / BURST_SECONDS);
      const reach = Math.hypot(Math.max(b.x, this.vWidth - b.x), Math.max(b.y, this.vHeight - b.y))
                    + (this.viewUniforms.uBurstWidth.value as number);
      burstData[i*4]   = b.x;
      burstData[i*4+1] = b.y;
      burstData[i*4+2] = reach * Math.sin((k * Math.PI) / 2);
      burstData[i*4+3] = 1 - k * k * k;
    });

    if (this.presence > 0.002) this.trailUntil = now + s.linger * 1000 + 150;

    const minFade = this.floatMask ? 0 : 1.5 / 255;
    const fade = s.linger > 0 ? dt / s.linger : 1;
    this.maskUniforms.tPrev.value = this.masks[0].texture;
    this.maskUniforms.uFrom.value = [this.brush.px, this.brush.py];
    this.maskUniforms.uTo.value   = [this.brush.x,  this.brush.y];
    this.maskUniforms.uRadius.value   = s.revealRadius * (0.45 + 0.55 * this.presence);
    this.maskUniforms.uSoftness.value = s.softness;
    this.maskUniforms.uStrength.value = this.presence;
    this.maskUniforms.uFade.value     = Math.max(fade, minFade);
    this.viewUniforms.uBurstWidth.value = Math.max(60, s.revealRadius * 0.9);

    this.renderer.render({ scene: this.maskMesh, target: this.masks[1] });
    this.masks.reverse();
    this.brush.px = this.brush.x;
    this.brush.py = this.brush.y;

    const cell = Math.max(1, Math.round(s.pixelSize * this.renderer.dpr));
    if (this.image && this.canvas) {
      this.viewUniforms.uCover.value = fitScale(
        this.canvas.width, this.canvas.height,
        this.image.naturalWidth, this.image.naturalHeight,
        s.fit === 'contain',
      );
    }

    let patternIndex = ORDERED[s.pattern] ?? 0;
    if (KERNELS[s.pattern]) {
      patternIndex = 0;
      if (this.image && !this.diffusionBlocked) {
        try { this.updateDiffusion(cell, s); patternIndex = 3; }
        catch { this.diffusionBlocked = true; }
      }
    }
    if (patternIndex === 1 && this.noiseTexture.width !== 64) {
      this.noiseTexture.image = getBlueNoise();
      this.noiseTexture.width = 64;
      this.noiseTexture.height = 64;
      this.noiseTexture.needsUpdate = true;
    }

    const texelsPerPixel = this.image && this.canvas
      ? (this.viewUniforms.uCover.value[0] * this.image.naturalWidth) / this.canvas.width : 1;
    this.viewUniforms.tMask.value     = this.masks[0].texture;
    this.viewUniforms.uCell.value     = cell;
    this.viewUniforms.uLod.value      = Math.log2(Math.max(cell * texelsPerPixel, 1));
    this.viewUniforms.uPattern.value  = patternIndex;
    this.viewUniforms.uPalette.value  = s.palette === 'rgb' ? 1 : 0;
    this.viewUniforms.uLevels.value   = Math.max(2, Math.round(s.levels));
    this.viewUniforms.uInk.value      = hexToRgb(s.inkColor);
    this.viewUniforms.uPaper.value    = hexToRgb(s.paperColor);
    this.viewUniforms.uRimColor.value = hexToRgb(s.rimColor);
    this.viewUniforms.uRim.value      = Math.min(Math.max(s.rim, 0), 0.95);
    this.viewUniforms.uContrast.value   = s.contrast;
    this.viewUniforms.uBrightness.value = s.brightness;
    this.viewUniforms.uReverse.value    = s.reverse ? 1 : 0;
    const intro = this.image ? Math.min(1, (now - this.introStart) / INTRO_MS) : 0;
    this.viewUniforms.uIntro.value = 1 - Math.pow(1 - intro, 2);
    this.renderer.render({ scene: this.viewMesh });

    const busy = this.pointer.inside || wanderOn || this.presence > 0.002
      || this.bursts.length > 0 || now < this.trailUntil || (this.image && intro < 1);
    if (busy && this.visible) this.raf = requestAnimationFrame(this.frame);
  };

  private wake(): void {
    if (this.raf || !this.visible || !this.initialized) return;
    this.last = performance.now();
    this.raf  = requestAnimationFrame(this.frame);
  }

  private cleanup(): void {
    cancelAnimationFrame(this.raf);
    this.raf = 0;
    this.resizeObserver?.disconnect();
    this.intersectionObserver?.disconnect();
    const container = this.hostRef?.nativeElement;
    if (container) {
      container.removeEventListener('pointermove',   this.onMove);
      container.removeEventListener('pointerenter',  this.onMove);
      container.removeEventListener('pointerdown',   this.onDown);
      container.removeEventListener('pointerleave',  this.onLeave);
      container.removeEventListener('pointercancel', this.onLeave);
    }
    try {
      const ext = this.gl?.getExtension?.('WEBGL_lose_context');
      if (ext) ext.loseContext();
    } catch {}
    if (this.canvas?.parentNode) this.canvas.parentNode.removeChild(this.canvas);
    this.masks.forEach(m => this.destroyMask(m));
    this.masks = [];
    this.renderer = null;
    this.gl = null;
    this.canvas = null;
  }
}
