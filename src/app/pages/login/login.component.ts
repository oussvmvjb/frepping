import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';

// ── WebGL Warp Shaders (OGL – image-frame texture) ────────────────────────

const WARP_VERTEX = `#version 300 es
in vec2 position;
in vec2 uv;
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const WARP_FRAGMENT = `#version 300 es
precision highp float;

uniform sampler2D uTextTexture;
uniform vec2 uResolution;
uniform vec2 uPointer;
uniform float uPointerActive;
uniform float uTime;
uniform float uWarpStrength;
uniform float uWarpScale;
uniform float uSpeed;
uniform float uPointerInfluence;
uniform float uPointerStrength;
uniform float uRefraction;
uniform float uRipple;
uniform float uMotion;

in vec2 vUv;
out vec4 fragColor;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 4; i++) {
    value += amplitude * noise(p);
    p *= 2.02;
    amplitude *= 0.5;
  }
  return value;
}

vec4 sampleFrame(vec2 uv) {
  uv = clamp(uv, 0.0, 1.0);
  return texture(uTextTexture, uv);
}

void main() {
  vec2 uv = vUv;
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  float time = uTime * uSpeed;
  float scale = max(uWarpScale, 0.001);

  vec2 drift = vec2(time * 0.055, -time * 0.045);
  float n1 = fbm(uv * scale * 3.1 + drift);
  float n2 = fbm((uv + 19.17) * scale * 3.4 - drift.yx);
  vec2 ambient = (vec2(n1, n2) - 0.5) * uWarpStrength * 0.045 * uMotion;

  vec2 pointerDelta = uv - uPointer;
  vec2 aspectDelta = vec2(pointerDelta.x * aspect, pointerDelta.y);
  float dist = length(aspectDelta);
  float radius = max(uPointerInfluence, 0.001);
  float t = clamp(dist / radius, 0.0, 1.0);
  float lens = smoothstep(radius, 0.0, dist) * uPointerActive;
  float bulge = t * (1.0 - t) * (1.0 - t) * 6.75 * uPointerActive;
  vec2 dir = dist > 0.0001 ? vec2(aspectDelta.x / aspect, aspectDelta.y) / dist : vec2(0.0);

  float rippleWave = sin(dist * 28.0 - time * 4.2) * 0.5 + 0.5;
  float rippleRing = (rippleWave - 0.5) * uRipple;
  vec2 pointerWarp = -dir * bulge * uPointerStrength * 0.045;
  pointerWarp += dir * rippleRing * bulge * uPointerStrength * 0.016;

  vec2 displaced = uv + ambient + pointerWarp;
  vec2 splitDir = ambient + pointerWarp;
  float splitLen = length(splitDir);
  splitDir = splitLen > 0.00001 ? splitDir / splitLen : vec2(0.7071, 0.7071);
  vec2 split = splitDir * uRefraction * 0.16 * (0.35 + lens * 1.65);

  float r = sampleFrame(displaced + split).r;
  float g = sampleFrame(displaced).g;
  float b = sampleFrame(displaced - split).b;

  vec3 color = vec3(r, g, b) + lens * 0.055;
  fragColor = vec4(color, 1.0);
}
`;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy, AfterViewInit {
  // OGL warp container (left side)
  @ViewChild('bgContainer') bgContainer!: ElementRef<HTMLDivElement>;

  loginForm: FormGroup;
  loading = false;
  error = '';
  returnUrl: string;

  // ── Password eye toggle (public – used in template) ──
  isPasswordVisible = false;

  // ── Password animation state ──
  // Hidden eye: range 001–010. Open eye: range 001–031.
  private readonly PW_HIDDEN_MAX = 10;
  private readonly PW_VISIBLE_MAX = 31;
  private currentPasswordFrame = 1;
  private pwTargetFrame = 1;
  private pwStepIntervalMs = 20;
  private lastPwStepTime = 0;
  private prevPasswordLength = 0;

  // ── Warp animation mode ──
  private warpMode: 'loop' | 'password' = 'loop';

  // ── Background frames (001–300 in assets/bg_login/) ──
  private readonly BG_FRAME_TOTAL = 300;
  private readonly BG_FRAME_PATH = 'assets/bg_login/ezgif-5b9c0a13a8c18428-jpg/';
  private readonly BG_FPS = 30;
  private bgPreloadedFrames: Map<number, HTMLImageElement> = new Map();
  private bgLoadingFrames: Set<number> = new Set();
  private bgCurrentFrame = 1;

  // ── Password frames (001–036 in assets/login/ezgif-7be40d30fa388ec8-jpg/) ──
  private readonly PW_FRAME_PATH = 'assets/login/ezgif-7be40d30fa388ec8-jpg/';
  private pwPreloadedFrames: Map<number, HTMLImageElement> = new Map();
  private pwLoadingFrames: Set<number> = new Set();

  // ── OGL WebGL renderer state ──
  private warpDisposed = false;
  private warpRaf = 0;
  private warpPointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, active: 0, activeTarget: 0 };
  private warpStartTime = 0;
  private warpCleanup: (() => void) | null = null;

  private passwordSub!: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    if (this.authService.getCurrentUser()) {
      this.router.navigate(['/']);
    }
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  ngOnInit(): void {
    // Preload looping background frames and all password animation frames (001–036)
    this.preloadBgFrames();
    this.preloadPwFrames();

    // Track password input changes to advance or step backward through frames
    this.passwordSub = this.loginForm.get('password')!.valueChanges.subscribe((val: string) => {
      const newLen = (val || '').length;
      const diff = newLen - this.prevPasswordLength;
      this.prevPasswordLength = newLen;

      // Only adjust step-by-step frame when eye is closed and in password mode
      if (this.warpMode === 'password' && !this.isPasswordVisible) {
        if (diff > 0) {
          // User typed characters: advance forward step-by-step, capped at 10
          this.pwTargetFrame = Math.min(this.PW_HIDDEN_MAX, this.currentPasswordFrame + diff);
          this.pwStepIntervalMs = 20;
        } else if (diff < 0) {
          // User deleted characters: step backward through frames down to min 1
          if (newLen === 0) {
            this.pwTargetFrame = 1;
          } else {
            this.pwTargetFrame = Math.max(1, this.currentPasswordFrame + diff);
          }
          this.pwStepIntervalMs = 20;
        }
      }
    });
  }

  ngAfterViewInit(): void {
    this.initWarpAnimation();
  }

  ngOnDestroy(): void {
    this.destroyWarpAnimation();
    if (this.passwordSub) this.passwordSub.unsubscribe();
  }

  // ── Auth ─────────────────────────────────────────────────────────────────

  onSubmit(): void {
    if (this.loginForm.invalid) return;
    this.loading = true;
    this.error = '';
    this.authService.login(this.loginForm.value).subscribe({
      next: (user: any) => {
        if (user && user.role === 'SUPER_ADMIN') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate([this.returnUrl]);
        }
      },
      error: (err: any) => {
        this.error = err.error?.detail || 'Email or password is incorrect.';
        this.loading = false;
      }
    });
  }

  // ── Password input events ─────────────────────────────────────────────────

  /**
   * Password field focused:
   * - Immediately switch to Password animation
   * - Start at frame 001
   * - Sequentially play 001 → 002 → ... → 010 (fast sequential animation)
   */
  onPasswordFocus(): void {
    this.warpMode = 'password';
    this.isPasswordVisible = false;
    this.currentPasswordFrame = 1;
    this.pwTargetFrame = this.PW_HIDDEN_MAX; // 10
    this.pwStepIntervalMs = 25; // 25ms per frame: plays 001 -> 010 in ~225ms
    this.lastPwStepTime = performance.now();
    this.prevPasswordLength = (this.loginForm.get('password')?.value || '').length;
  }

  /** Password field blurred → resume the 1–300 loop animation */
  onPasswordBlur(): void {
    this.warpMode = 'loop';
  }

  /**
   * Toggle password visibility.
   * - Opening eye: go to frame 031 super fast (~6ms/frame).
   * - Closing eye: return to frame 010 (stepping down from 031 or returning to 010) at 10ms/frame.
   */
  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;

    if (this.isPasswordVisible) {
      // Opening eye: go to frame 031 super fast
      this.pwTargetFrame = this.PW_VISIBLE_MAX; // 31
      this.pwStepIntervalMs = 6; // super fast
      this.lastPwStepTime = performance.now();
    } else {
      // Closing eye: return to frame 010
      this.pwTargetFrame = this.PW_HIDDEN_MAX; // 10
      this.pwStepIntervalMs = 10; // fast 10ms step
      this.lastPwStepTime = performance.now();
    }
  }

  // ── Password frame preloading ─────────────────────────────────────────────

  private getPwFrameSrc(frame: number): string {
    const padded = String(frame).padStart(3, '0');
    return `${this.PW_FRAME_PATH}ezgif-frame-${padded}.png`;
  }

  private preloadPwFrames(): void {
    // Eagerly preload all 36 frames for password states (001 to 036)
    for (let i = 1; i <= this.PW_VISIBLE_MAX; i++) {
      const img = new Image();
      const n = i;
      img.onload = () => this.pwPreloadedFrames.set(n, img);
      img.src = this.getPwFrameSrc(i);
    }
  }

  // ── Background frame preloading ───────────────────────────────────────────

  private getBgFrameSrc(frame: number): string {
    const padded = String(frame).padStart(3, '0');
    return `${this.BG_FRAME_PATH}ezgif-frame-${padded}.jpg`;
  }

  private preloadBgFrames(): void {
    // Eagerly load initial loop frames
    const EAGER_COUNT = 30;
    for (let i = 1; i <= EAGER_COUNT; i++) {
      const img = new Image();
      const n = i;
      img.onload = () => this.bgPreloadedFrames.set(n, img);
      img.src = this.getBgFrameSrc(i);
    }

    // Lazily load the remaining frames in batches to avoid blocking the browser
    const BATCH = 30;
    const loadBatch = (start: number) => {
      const end = Math.min(start + BATCH - 1, this.BG_FRAME_TOTAL);
      for (let i = start; i <= end; i++) {
        if (this.bgPreloadedFrames.has(i) || this.bgLoadingFrames.has(i)) continue;
        const img = new Image();
        const n = i;
        this.bgLoadingFrames.add(n);
        img.onload = () => {
          this.bgPreloadedFrames.set(n, img);
          this.bgLoadingFrames.delete(n);
        };
        img.src = this.getBgFrameSrc(i);
      }
      if (end < this.BG_FRAME_TOTAL) {
        setTimeout(() => loadBatch(end + 1), 200);
      }
    };
    setTimeout(() => loadBatch(EAGER_COUNT + 1), 800);
  }

  // ── OGL WebGL warp renderer ───────────────────────────────────────────────

  private async initWarpAnimation(): Promise<void> {
    const container = this.bgContainer?.nativeElement;
    if (!container || typeof window === 'undefined') return;

    let ogl: any;
    try {
      ogl = await import('ogl');
    } catch (err) {
      console.warn('WarpAnimation: OGL could not be loaded.', err);
      return;
    }

    const { Renderer, Program, Mesh, Triangle, Texture } = ogl;

    let renderer: any, gl: any;
    try {
      renderer = new Renderer({
        webgl: 2,
        alpha: false,
        antialias: true,
        dpr: Math.min(window.devicePixelRatio || 1, 2)
      });
      gl = renderer.gl;
    } catch (err) {
      console.warn('WarpAnimation: WebGL could not be initialised.', err);
      return;
    }

    // Mount OGL canvas
    const oglCanvas: HTMLCanvasElement = gl.canvas;
    Object.assign(oglCanvas.style, {
      position: 'absolute',
      inset: '0',
      width: '100%',
      height: '100%',
      display: 'block'
    });
    container.appendChild(oglCanvas);

    // Shared texture – updated each tick with the current frame image
    const texture = new Texture(gl, {
      generateMipmaps: false,
      minFilter: gl.LINEAR,
      magFilter: gl.LINEAR,
      wrapS: gl.CLAMP_TO_EDGE,
      wrapT: gl.CLAMP_TO_EDGE
    });

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: WARP_VERTEX,
      fragment: WARP_FRAGMENT,
      transparent: false,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        uTextTexture:      { value: texture },
        uResolution:       { value: new Float32Array([1, 1]) },
        uPointer:          { value: new Float32Array([0.5, 0.5]) },
        uPointerActive:    { value: 0 },
        uTime:             { value: 0 },
        uWarpStrength:     { value: 0.08 },
        uWarpScale:        { value: 1.7 },
        uSpeed:            { value: 0.55 },
        uPointerInfluence: { value: 0.42 },
        uPointerStrength:  { value: 0.38 },
        uRefraction:       { value: 0.018 },
        uRipple:           { value: 1.0 },
        uMotion:           { value: 1.0 }
      }
    });
    const mesh = new Mesh(gl, { geometry, program });

    // ── Resize handler ──
    const resize = () => {
      const rect = container.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      renderer.dpr = Math.min(window.devicePixelRatio || 1, 2);
      renderer.setSize(rect.width, rect.height);
      program.uniforms.uResolution.value[0] = gl.drawingBufferWidth;
      program.uniforms.uResolution.value[1] = gl.drawingBufferHeight;
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();

    // ── Pointer tracking ──
    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      const rect = oglCanvas.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      this.warpPointer.tx = (e.clientX - rect.left) / rect.width;
      this.warpPointer.ty = 1 - (e.clientY - rect.top) / rect.height;
      this.warpPointer.activeTarget = 1;
    };
    const onPointerLeave = () => { this.warpPointer.activeTarget = 0; };
    oglCanvas.addEventListener('pointermove', onPointerMove);
    oglCanvas.addEventListener('pointerleave', onPointerLeave);

    // ── Helper: push a background frame (.jpg) to the GPU texture ──
    const uploadBgFrame = (frameNum: number) => {
      const img = this.bgPreloadedFrames.get(frameNum);
      if (img && img.complete && img.naturalWidth > 0) {
        texture.image = img;
        texture.needsUpdate = true;
      } else if (!this.bgLoadingFrames.has(frameNum)) {
        this.bgLoadingFrames.add(frameNum);
        const onDemand = new Image();
        onDemand.onload = () => {
          this.bgPreloadedFrames.set(frameNum, onDemand);
          this.bgLoadingFrames.delete(frameNum);
          if (this.warpMode === 'loop' && this.bgCurrentFrame === frameNum) {
            texture.image = onDemand;
            texture.needsUpdate = true;
          }
        };
        onDemand.src = this.getBgFrameSrc(frameNum);
      }
    };

    // ── Helper: push a password frame (.png) to the GPU texture ──
    const uploadPwFrame = (frameNum: number) => {
      const img = this.pwPreloadedFrames.get(frameNum);
      if (img && img.complete && img.naturalWidth > 0) {
        texture.image = img;
        texture.needsUpdate = true;
      } else if (!this.pwLoadingFrames.has(frameNum)) {
        this.pwLoadingFrames.add(frameNum);
        const onDemand = new Image();
        onDemand.onload = () => {
          this.pwPreloadedFrames.set(frameNum, onDemand);
          this.pwLoadingFrames.delete(frameNum);
          if (this.warpMode === 'password' && this.currentPasswordFrame === frameNum) {
            texture.image = onDemand;
            texture.needsUpdate = true;
          }
        };
        onDemand.src = this.getPwFrameSrc(frameNum);
      }
    };

    // Pre-populate texture with initial frame
    uploadBgFrame(1);

    // ── Main render loop ──
    this.warpStartTime = performance.now();
    const FPS_INTERVAL = 1000 / this.BG_FPS; // ~33 ms for 30 fps loop
    let lastLoopFrameTime = 0;    // gates loop animation
    let lastWarpMode: 'loop' | 'password' = 'loop';

    const loop = (now: number) => {
      if (this.warpDisposed) return;

      const elapsed = (now - this.warpStartTime) * 0.001;
      let needUpload = false;
      let frameToShow = 1;

      // Detect mode switch immediately
      if (this.warpMode !== lastWarpMode) {
        lastWarpMode = this.warpMode;
        needUpload = true;
      }

      // ── Frame selection ──────────────────────────────────────────────────
      if (this.warpMode === 'loop') {
        // Normal 1→300 looping animation at target FPS
        if (now - lastLoopFrameTime >= FPS_INTERVAL) {
          lastLoopFrameTime = now;
          this.bgCurrentFrame =
            this.bgCurrentFrame >= this.BG_FRAME_TOTAL ? 1 : this.bgCurrentFrame + 1;
          needUpload = true;
        }
        frameToShow = this.bgCurrentFrame;

      } else {
        // Password mode: step-by-step animation toward pwTargetFrame
        if (this.currentPasswordFrame < this.pwTargetFrame) {
          if (now - this.lastPwStepTime >= this.pwStepIntervalMs) {
            const steps = Math.max(1, Math.floor((now - this.lastPwStepTime) / this.pwStepIntervalMs));
            this.lastPwStepTime = now;
            this.currentPasswordFrame = Math.min(this.pwTargetFrame, this.currentPasswordFrame + steps);
            needUpload = true;
          }
        } else if (this.currentPasswordFrame > this.pwTargetFrame) {
          if (now - this.lastPwStepTime >= this.pwStepIntervalMs) {
            const steps = Math.max(1, Math.floor((now - this.lastPwStepTime) / this.pwStepIntervalMs));
            this.lastPwStepTime = now;
            this.currentPasswordFrame = Math.max(this.pwTargetFrame, this.currentPasswordFrame - steps);
            needUpload = true;
          }
        }

        frameToShow = this.currentPasswordFrame;
      }

      if (needUpload) {
        if (this.warpMode === 'password') {
          uploadPwFrame(frameToShow);
        } else {
          uploadBgFrame(frameToShow);
        }
      }

      // ── Warp pointer uniforms (always animate smoothly) ──────────────────
      const idleX = 0.5 + Math.sin(elapsed * 0.33) * 0.12;
      const idleY = 0.5 + Math.cos(elapsed * 0.27) * 0.10;
      const targetX = this.warpPointer.activeTarget > 0 ? this.warpPointer.tx : idleX;
      const targetY = this.warpPointer.activeTarget > 0 ? this.warpPointer.ty : idleY;
      const damping  = this.warpPointer.activeTarget > 0 ? 0.12 : 0.035;

      this.warpPointer.x += (targetX - this.warpPointer.x) * damping;
      this.warpPointer.y += (targetY - this.warpPointer.y) * damping;
      this.warpPointer.active +=
        ((this.warpPointer.activeTarget > 0 ? 1.0 : 0.18) - this.warpPointer.active) * 0.06;

      program.uniforms.uPointer.value[0]    = this.warpPointer.x;
      program.uniforms.uPointer.value[1]    = this.warpPointer.y;
      program.uniforms.uPointerActive.value = this.warpPointer.active;
      program.uniforms.uTime.value          = elapsed;

      renderer.render({ scene: mesh });
      this.warpRaf = requestAnimationFrame(loop);
    };

    this.warpRaf = requestAnimationFrame(loop);

    // ── Cleanup callback ──
    this.warpCleanup = () => {
      resizeObserver.disconnect();
      oglCanvas.removeEventListener('pointermove', onPointerMove);
      oglCanvas.removeEventListener('pointerleave', onPointerLeave);
      if (oglCanvas.parentNode === container) container.removeChild(oglCanvas);
      try {
        if (texture?.texture) gl.deleteTexture(texture.texture);
        gl.getExtension('WEBGL_lose_context')?.loseContext();
      } catch (e) { void e; }
    };
  }

  private destroyWarpAnimation(): void {
    this.warpDisposed = true;
    if (this.warpRaf) {
      cancelAnimationFrame(this.warpRaf);
      this.warpRaf = 0;
    }
    this.warpCleanup?.();
    this.warpCleanup = null;
  }
}
