/**
 * tshirt-live-cloth.engine.ts
 * Pure TypeScript (no THREE / Angular). Works on the baked Hi_T-shirt_atlas.glb.
 *
 *  - Size / fit  : real measurements (cm) -> per-piece "goal" shape.
 *  - Fabric      : physical presets (stiffness, drape, damping, swing...).
 *  - Live cloth  : goal-driven soft cloth (springs + edge constraints + bend smoothing
 *                  + inertial forces from the model's rotation + body collision).
 */

export type FabricId = 'cotton' | 'heavy-cotton' | 'linen' | 'silk-blend' | 'tech-mesh';
export type SizeId = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
export type FitId = 'slim' | 'regular' | 'oversized';

export interface ClothPhysics {
  hold: number;      // goal-spring stiffness where the cloth is supported (1/s^2)
  freeHold: number;  // goal-spring stiffness at hem / cuffs (lower = looser)
  damping: number;   // velocity damping (1/s)
  drape: number;     // gravity sag factor (0..0.2)
  stretch: number;   // edge constraint stiffness (0..1)
  bend: number;      // neighbour smoothing of displacement (0..0.5) - higher = stiffer sheet
  swing: number;     // response to rotation (1 = physical)
  maxDrift: number;  // max distance from goal in metres
  wind: number;      // breeze strength (m/s^2)
}

export const FABRIC_PHYSICS: Record<FabricId, ClothPhysics> = {
  'cotton':       { hold: 220, freeHold: 45, damping: 5.5, drape: 0.10, stretch: 0.50, bend: 0.30, swing: 1.00, maxDrift: 0.06, wind: 0.15 },
  'heavy-cotton': { hold: 320, freeHold: 85, damping: 6.5, drape: 0.06, stretch: 0.70, bend: 0.40, swing: 0.55, maxDrift: 0.04, wind: 0.06 },
  'linen':        { hold: 200, freeHold: 50, damping: 4.0, drape: 0.09, stretch: 0.60, bend: 0.22, swing: 0.90, maxDrift: 0.06, wind: 0.18 },
  'silk-blend':   { hold: 120, freeHold: 22, damping: 2.6, drape: 0.16, stretch: 0.35, bend: 0.12, swing: 1.50, maxDrift: 0.10, wind: 0.35 },
  'tech-mesh':    { hold: 160, freeHold: 35, damping: 3.2, drape: 0.07, stretch: 0.45, bend: 0.18, swing: 1.20, maxDrift: 0.07, wind: 0.30 }
};

export interface LiveMeasurements { chestCm: number; lengthCm: number; sleeveCm: number; }

const SIZE_FACTORS: Record<SizeId, [number, number, number]> = {
  XS: [0.89, 0.94, 0.90], S: [0.94, 0.96, 0.95], M: [0.97, 0.98, 0.975],
  L: [1.0, 1.0, 1.0], XL: [1.05, 1.03, 1.04], XXL: [1.10, 1.06, 1.08]
};
const FIT_FACTORS: Record<FitId, [number, number, number]> = {
  slim: [0.93, 0.98, 0.95], regular: [1, 1, 1], oversized: [1.14, 1.06, 1.20]
};

/** Real measurements (cm) for a size + fit, relative to the baked garment. */
export function measurementsFor(size: SizeId, fit: FitId, base: LiveMeasurements): LiveMeasurements {
  const s = SIZE_FACTORS[size], f = FIT_FACTORS[fit];
  return {
    chestCm: base.chestCm * s[0] * f[0],
    lengthCm: base.lengthCm * s[1] * f[1],
    sleeveCm: base.sleeveCm * s[2] * f[2]
  };
}

export interface ClothMeta {
  landmarks: Record<string, number[]>;
  yArm: number;
  base: LiveMeasurements;
  torso: { y0: number; dy: number; a: number[]; b: number[]; zc: number[] };
  pieceRoles: Record<string, number[]>;
  seamPairs: number[];
}

export interface EngineInit {
  positions: Float32Array;        // engine space = (original_m - center) * scale ; mutated in place
  index: Uint32Array;
  piece: Float32Array;            // _PIECE attribute
  meta: ClothMeta;
  scale: number;                  // engine units per metre
  center: [number, number, number]; // original-space centre that was subtracted
}

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

export class LiveClothEngine {
  readonly positions: Float32Array;
  readonly normals: Float32Array;
  readonly n: number;
  fabric: ClothPhysics = FABRIC_PHYSICS['cotton'];

  /** Higher = more accurate, slower. 1 is fine for 60 fps. */
  substeps = 1;
  stretchIterations = 1;
  collision = true;
  windEnabled = true;

  private s: number; private c: [number, number, number];
  private meta: ClothMeta; private idx: Uint32Array; private pc: Uint8Array;
  private rest: Float32Array; private goal: Float32Array; private vel: Float32Array;
  private free: Float32Array; private role: Uint8Array; private isBody: Uint8Array;
  private ea!: Uint32Array; private eb!: Uint32Array; private erest!: Float32Array;
  private deg!: Float32Array; private tmp: Float32Array;
  private seam: Uint32Array;
  private kHold = new Float32Array(0);
  private time = 0; private asleep = false; private frame = 0;
  private qPrev: [number, number, number, number] | null = null;
  private wPrev: [number, number, number] = [0, 0, 0];
  private alpha: [number, number, number] = [0, 0, 0];
  private omega: [number, number, number] = [0, 0, 0];
  private qCur: [number, number, number, number] = [0, 0, 0, 1];
  measurements: LiveMeasurements;

  constructor(init: EngineInit) {
    this.positions = init.positions; this.idx = init.index; this.meta = init.meta;
    this.s = init.scale; this.c = init.center; this.n = init.positions.length / 3;
    this.pc = Uint8Array.from(init.piece as unknown as number[]);
    this.rest = Float32Array.from(init.positions); this.goal = Float32Array.from(init.positions);
    this.vel = new Float32Array(this.n * 3); this.normals = new Float32Array(this.n * 3);
    this.free = new Float32Array(this.n); this.role = new Uint8Array(this.n); this.isBody = new Uint8Array(this.n);
    this.tmp = new Float32Array(this.n * 3);
    this.seam = Uint32Array.from(init.meta.seamPairs);
    this.measurements = { ...init.meta.base };
    this.buildTopology(); this.buildRoles(); this.setMeasurements(this.measurements, true); this.setFabric('cotton');
  }

  // ───────────────────────────── setup ─────────────────────────────
  private buildTopology(): void {
    const set = new Set<number>(); const n = this.n, I = this.idx;
    for (let t = 0; t < I.length; t += 3) for (let k = 0; k < 3; k++) {
      const a = I[t + k], b = I[t + (k + 1) % 3]; const lo = a < b ? a : b, hi = a < b ? b : a; set.add(lo * n + hi);
    }
    const m = set.size; this.ea = new Uint32Array(m); this.eb = new Uint32Array(m); this.erest = new Float32Array(m);
    this.deg = new Float32Array(n); let e = 0;
    set.forEach(key => { const a = Math.floor(key / n), b = key - a * n; this.ea[e] = a; this.eb[e] = b; this.deg[a]++; this.deg[b]++; e++; });
  }

  private buildRoles(): void {
    const R = this.meta.pieceRoles, rid: Record<number, number> = {};
    (R['body'] || []).forEach(p => rid[p] = 0); (R['sleeveL'] || []).forEach(p => rid[p] = 1);
    (R['sleeveR'] || []).forEach(p => rid[p] = 2); (R['collar'] || []).forEach(p => rid[p] = 3); (R['label'] || []).forEach(p => rid[p] = 4);
    const L = this.meta.landmarks, P = this.rest, s = this.s, c = this.c;
    const yTop = (1.56 - c[1]) * s, yBot = (0.93 - c[1]) * s;
    for (let i = 0; i < this.n; i++) {
      const r = rid[this.pc[i]] ?? 0; this.role[i] = r; this.isBody[i] = r === 0 ? 1 : 0;
      const x = P[i * 3], y = P[i * 3 + 1], z = P[i * 3 + 2]; let f = 0;
      if (r === 0) { const t = Math.min(1, Math.max(0, (yTop - y) / (yTop - yBot))); f = Math.pow(smooth(0, 1, t), 1.3) * 0.9; }
      else if (r === 1 || r === 2) {
        const nk = this.toEngine(r === 1 ? L['neckL'] : L['neckR']), cf = this.toEngine(r === 1 ? L['cuffL'] : L['cuffR']);
        const len = Math.hypot(cf[0] - nk[0], cf[1] - nk[1], cf[2] - nk[2]);
        const d = Math.hypot(x - nk[0], y - nk[1], z - nk[2]); f = smooth(0.25, 1.0, d / len) * 0.95;
      } else f = r === 3 ? 0.05 : 0.1;
      this.free[i] = f;
    }
  }

  private toEngine(p: number[]): [number, number, number] {
    return [(p[0] - this.c[0]) * this.s, (p[1] - this.c[1]) * this.s, (p[2] - this.c[2]) * this.s];
  }

  setFabric(id: FabricId | string): void {
    this.fabric = FABRIC_PHYSICS[id as FabricId] || FABRIC_PHYSICS['cotton'];
    const F = this.fabric; this.kHold = new Float32Array(this.n);
    for (let i = 0; i < this.n; i++) this.kHold[i] = F.hold + (F.freeHold - F.hold) * this.free[i];
    this.asleep = false;
  }

  /** Change real measurements (cm). Cloth then settles into the new shape with the fabric's dynamics. */
  setMeasurements(m: LiveMeasurements, instant = false): void {
    this.measurements = { ...m }; const B = this.meta.base, L = this.meta.landmarks, s = this.s, c = this.c;
    const sx = m.chestCm / B.chestCm, sl = m.lengthCm / B.lengthCm, ss = m.sleeveCm / B.sleeveCm;
    const T = this.meta.torso, yArm = this.meta.yArm;
    const zcAt = (y: number) => { const f = Math.min(T.zc.length - 1.001, Math.max(0, (y - T.y0) / T.dy)); const i = Math.floor(f), t = f - i; return T.zc[i] * (1 - t) + T.zc[i + 1] * t; };
    const xU = (Math.abs(L['underarmL'][0]) + Math.abs(L['underarmR'][0])) / 2;
    const map = (x: number, y: number, z: number): [number, number, number] => {
      const f = 1 - (1 - smooth(0.10, 0.15, Math.abs(x))) * smooth(1.54, 1.60, y), k = 1 + (sx - 1) * f;
      const ax = Math.abs(x), nx = ax <= xU ? ax * k : ax + xU * (k - 1), zc = zcAt(y);
      return [Math.sign(x || 1) * nx, y < yArm ? yArm - (yArm - y) * sl : y, zc + (z - zc) * k];
    };
    const axMap: Record<number, number[]> = {}, U: Record<number, number[]> = {};
    ([[1, 'L'], [2, 'R']] as [number, string][]).forEach(([r, sd]) => {
      const u = L['underarm' + sd], cf = L['cuff' + sd], up = map(u[0], u[1], u[2]);
      const cp = map(cf[0], cf[1], cf[2]), d = [cp[0] - up[0], cp[1] - up[1], cp[2] - up[2]], l = Math.hypot(d[0], d[1], d[2]);
      axMap[r] = [d[0] / l, d[1] / l, d[2] / l]; U[r] = up;
    });
    const R = this.rest, G = this.goal;
    for (let i = 0; i < this.n; i++) {
      const r = this.role[i], ox = R[i * 3] / s + c[0], oy = R[i * 3 + 1] / s + c[1], oz = R[i * 3 + 2] / s + c[2];
      let p: [number, number, number] = [ox, oy, oz];
      if (r <= 2) {
        p = map(ox, oy, oz);
        if (r > 0) {
          const a = axMap[r], u = U[r], t = (p[0] - u[0]) * a[0] + (p[1] - u[1]) * a[1] + (p[2] - u[2]) * a[2];
          if (t > 0) { const e = (ss - 1) * t; p = [p[0] + a[0] * e, p[1] + a[1] * e, p[2] + a[2] * e]; }
        }
      }
      G[i * 3] = (p[0] - c[0]) * s; G[i * 3 + 1] = (p[1] - c[1]) * s; G[i * 3 + 2] = (p[2] - c[2]) * s;
    }
    for (let e = 0; e < this.ea.length; e++) {
      const a = this.ea[e] * 3, b = this.eb[e] * 3;
      this.erest[e] = Math.hypot(G[a] - G[b], G[a + 1] - G[b + 1], G[a + 2] - G[b + 2]);
    }
    if (instant) { this.positions.set(G); this.vel.fill(0); this.computeNormals(); }
    this.asleep = false;
  }

  setSizeFit(size: SizeId, fit: FitId, instant = false): LiveMeasurements {
    const m = measurementsFor(size, fit, this.meta.base); this.setMeasurements(m, instant); return m;
  }

  // ───────────────────────────── simulation ─────────────────────────────
  /** Call once per frame. q = world quaternion of the rotating model pivot (x,y,z,w). */
  update(dtFrame: number, q: [number, number, number, number] = [0, 0, 0, 1]): void {
    const dt = Math.min(Math.max(dtFrame, 1 / 240), 1 / 30);
    this.trackRotation(q, dt);
    const moving = Math.hypot(this.omega[0], this.omega[1], this.omega[2]) > 0.02;
    if (this.asleep && !moving && !this.windEnabled) return;
    const h = dt / this.substeps;
    for (let k = 0; k < this.substeps; k++) this.substep(h);
    if ((this.frame++ & 1) === 0) this.computeNormals();
  }

  private trackRotation(q: [number, number, number, number], dt: number): void {
    this.qCur = q;
    if (!this.qPrev) { this.qPrev = q; return; }
    const p = this.qPrev; // dq = q * conj(p)   (world-space angular velocity)
    const dx = q[3] * -p[0] + q[0] * p[3] + q[1] * -p[2] - q[2] * -p[1];
    const dy = q[3] * -p[1] - q[0] * -p[2] + q[1] * p[3] + q[2] * -p[0];
    const dz = q[3] * -p[2] + q[0] * -p[1] - q[1] * -p[0] + q[2] * p[3];
    const dw = q[3] * p[3] + q[0] * p[0] + q[1] * p[1] + q[2] * p[2];
    const sgn = dw < 0 ? -1 : 1, sinHalf = Math.hypot(dx, dy, dz);
    const ang = 2 * Math.atan2(sinHalf, Math.abs(dw)), k = sinHalf > 1e-9 ? (sgn * ang) / (sinHalf * dt) : 0;
    const wl = this.worldToLocal([dx * k, dy * k, dz * k]), cl = (v: number) => Math.max(-8, Math.min(8, v));
    const w: [number, number, number] = [cl(wl[0]), cl(wl[1]), cl(wl[2])];
    const lerp = 0.35; // filtered omega and alpha
    const nw: [number, number, number] = [this.omega[0] + (w[0] - this.omega[0]) * lerp, this.omega[1] + (w[1] - this.omega[1]) * lerp, this.omega[2] + (w[2] - this.omega[2]) * lerp];
    const ca = (v: number) => Math.max(-150, Math.min(150, v));
    this.alpha = [ca((nw[0] - this.omega[0]) / dt), ca((nw[1] - this.omega[1]) / dt), ca((nw[2] - this.omega[2]) / dt)];
    this.omega = nw; this.qPrev = q;
  }

  private worldToLocal(v: [number, number, number]): [number, number, number] {
    const [x, y, z, w] = this.qCur; // rotate by conjugate
    const ix = w * v[0] - y * v[2] + z * v[1], iy = w * v[1] - z * v[0] + x * v[2], iz = w * v[2] - x * v[1] + y * v[0], iw = x * v[0] + y * v[1] + z * v[2];
    return [ix * w + iw * x + iy * z - iz * y, iy * w + iw * y + iz * x - ix * z, iz * w + iw * z + ix * y - iy * x];
  }

  private substep(dt: number): void {
    const F = this.fabric, s = this.s, n = this.n, P = this.positions, V = this.vel, G = this.goal;
    const g = this.worldToLocal([0, -9.81 * s, 0]), w = this.omega, al = this.alpha, sw = F.swing;
    const damp = 1 / (1 + F.damping * dt); this.time += dt;
    const wt = this.windEnabled ? F.wind * s : 0, t = this.time;
    const wx = wt * (Math.sin(t * 1.3) + 0.5 * Math.sin(t * 2.9 + 1)), wz = wt * (Math.cos(t * 1.1) + 0.5 * Math.sin(t * 3.3));
    const drift = F.maxDrift * s; let maxV = 0;
    for (let i = 0; i < n; i++) {
      const j = i * 3, x = P[j], y = P[j + 1], z = P[j + 2], fr = this.free[i], k = this.kHold[i];
      let vx = V[j], vy = V[j + 1], vz = V[j + 2];
      let ax = k * (G[j] - x) + g[0] * F.drape * fr, ay = k * (G[j + 1] - y) + g[1] * F.drape * fr, az = k * (G[j + 2] - z) + g[2] * F.drape * fr;
      // inertial (pseudo) forces:  -alpha x r  - 2 w x v  - w x (w x r)
      const wxr = [w[1] * z - w[2] * y, w[2] * x - w[0] * z, w[0] * y - w[1] * x];
      const px = -(al[1] * z - al[2] * y) - 2 * (w[1] * vz - w[2] * vy) - (w[1] * wxr[2] - w[2] * wxr[1]);
      const py = -(al[2] * x - al[0] * z) - 2 * (w[2] * vx - w[0] * vz) - (w[2] * wxr[0] - w[0] * wxr[2]);
      const pz = -(al[0] * y - al[1] * x) - 2 * (w[0] * vy - w[1] * vx) - (w[0] * wxr[1] - w[1] * wxr[0]);
      const sf = sw * (0.25 + 0.75 * fr);
      ax += px * sf + wx * fr; ay += py * sf; az += pz * sf + wz * fr;
      vx = (vx + ax * dt) * damp; vy = (vy + ay * dt) * damp; vz = (vz + az * dt) * damp;
      V[j] = vx; V[j + 1] = vy; V[j + 2] = vz; P[j] = x + vx * dt; P[j + 1] = y + vy * dt; P[j + 2] = z + vz * dt;
      const sp = Math.abs(vx) + Math.abs(vy) + Math.abs(vz); if (sp > maxV) maxV = sp;
    }
    // edge constraints (keep cloth lengths of the goal shape)
    const ks = F.stretch;
    for (let it = 0; it < this.stretchIterations; it++) for (let e = 0; e < this.ea.length; e++) {
      const a = this.ea[e] * 3, b = this.eb[e] * 3, dx = P[b] - P[a], dy = P[b + 1] - P[a + 1], dz = P[b + 2] - P[a + 2];
      const d = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1e-9, cc = ((d - this.erest[e]) / d) * 0.5 * ks;
      P[a] += dx * cc; P[a + 1] += dy * cc; P[a + 2] += dz * cc; P[b] -= dx * cc; P[b + 1] -= dy * cc; P[b + 2] -= dz * cc;
    }
    // bending: smooth the displacement field d = p - goal over neighbours
    const T = this.tmp; T.fill(0);
    for (let e = 0; e < this.ea.length; e++) {
      const a = this.ea[e] * 3, b = this.eb[e] * 3;
      for (let k = 0; k < 3; k++) { const da = P[a + k] - G[a + k], db = P[b + k] - G[b + k]; T[a + k] += db; T[b + k] += da; }
    }
    const kb = F.bend;
    for (let i = 0; i < n; i++) {
      const d = this.deg[i] || 1, j = i * 3;
      for (let k = 0; k < 3; k++) { const di = P[j + k] - G[j + k]; P[j + k] = G[j + k] + di + kb * (T[j + k] / d - di); }
    }
    // seams: pair vertices of neighbouring pieces share their displacement
    const Sv = this.seam;
    for (let q = 0; q < Sv.length; q += 2) {
      const a = Sv[q] * 3, b = Sv[q + 1] * 3;
      for (let k = 0; k < 3; k++) { const dd = (P[a + k] - G[a + k]) - (P[b + k] - G[b + k]); P[a + k] -= 0.25 * dd; P[b + k] += 0.25 * dd; }
    }
    // clamp drift + body collision
    const Tt = this.meta.torso, cc = this.c, na = Tt.a.length;
    for (let i = 0; i < n; i++) {
      const j = i * 3; const dx = P[j] - G[j], dy = P[j + 1] - G[j + 1], dz = P[j + 2] - G[j + 2];
      const dl = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (dl > drift) { const f = drift / dl; P[j] = G[j] + dx * f; P[j + 1] = G[j + 1] + dy * f; P[j + 2] = G[j + 2] + dz * f; }
      if (this.collision && this.isBody[i]) {
        const oy = P[j + 1] / s + cc[1], ft = (oy - Tt.y0) / Tt.dy; if (ft < 0 || ft > na - 1.001) continue;
        const ii = Math.floor(ft), tt = ft - ii,
          ellA = (Tt.a[ii] * (1 - tt) + Tt.a[ii + 1] * tt) * 0.93,
          ellB = (Tt.b[ii] * (1 - tt) + Tt.b[ii + 1] * tt) * 0.93;
        const zc = Tt.zc[ii] * (1 - tt) + Tt.zc[ii + 1] * tt,
          ox = P[j] / s + cc[0], oz = P[j + 2] / s + cc[2];
        const u = (ox / ellA) * (ox / ellA) + ((oz - zc) / ellB) * ((oz - zc) / ellB);
        if (u < 1 && u > 1e-6) { const f = 1 / Math.sqrt(u); P[j] = (ox * f - cc[0]) * s; P[j + 2] = (zc + (oz - zc) * f - cc[2]) * s; }
      }
    }
    this.asleep = maxV < 1e-4 * s;
  }

  computeNormals(): void {
    const N = this.normals, P = this.positions, I = this.idx; N.fill(0);
    for (let t = 0; t < I.length; t += 3) {
      const a = I[t] * 3, b = I[t + 1] * 3, c = I[t + 2] * 3;
      const ux = P[b] - P[a], uy = P[b + 1] - P[a + 1], uz = P[b + 2] - P[a + 2], vx = P[c] - P[a], vy = P[c + 1] - P[a + 1], vz = P[c + 2] - P[a + 2];
      const nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
      for (const o of [a, b, c]) { N[o] += nx; N[o + 1] += ny; N[o + 2] += nz; }
    }
    for (let i = 0; i < N.length; i += 3) { const l = Math.hypot(N[i], N[i + 1], N[i + 2]) || 1; N[i] /= l; N[i + 1] /= l; N[i + 2] /= l; }
  }

  /** Current measurements measured on the live mesh (cm) - used for the UI read-out. */
  get target(): LiveMeasurements { return this.measurements; }
}

