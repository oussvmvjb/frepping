import { Injectable } from '@angular/core';
import * as THREE from 'three';
import {
  GarmentMeasurements,
  GarmentSize,
  FitStyle
} from '../models/tshirt-customizer.models';

/**
 * Standard Garment Measurements Map (in cm)
 * Baseline is Size 'L' with Regular fit matching the original 3D model geometry.
 */
export const SIZE_PRESETS: Record<GarmentSize, GarmentMeasurements> = {
  XS: {
    chest: 90,
    waist: 84,
    shoulder: 42,
    length: 66,
    sleeveLength: 19.5,
    sleeveWidth: 31,
    neckOpening: 38
  },
  S: {
    chest: 96,
    waist: 90,
    shoulder: 44,
    length: 68,
    sleeveLength: 21,
    sleeveWidth: 33,
    neckOpening: 39.5
  },
  M: {
    chest: 102,
    waist: 96,
    shoulder: 46,
    length: 70,
    sleeveLength: 22,
    sleeveWidth: 35,
    neckOpening: 41
  },
  L: {
    chest: 108,
    waist: 102,
    shoulder: 48,
    length: 72,
    sleeveLength: 23,
    sleeveWidth: 37,
    neckOpening: 42
  },
  XL: {
    chest: 116,
    waist: 110,
    shoulder: 50,
    length: 75,
    sleeveLength: 24.5,
    sleeveWidth: 40,
    neckOpening: 44
  },
  XXL: {
    chest: 124,
    waist: 118,
    shoulder: 53,
    length: 78,
    sleeveLength: 26,
    sleeveWidth: 43,
    neckOpening: 46
  },
  Custom: {
    chest: 108,
    waist: 102,
    shoulder: 48,
    length: 72,
    sleeveLength: 23,
    sleeveWidth: 37,
    neckOpening: 42
  }
};

export const FIT_MODIFIERS: Record<FitStyle, Partial<GarmentMeasurements>> = {
  slim: {
    chest: -5,
    waist: -9,
    shoulder: -1.5,
    length: -1.5,
    sleeveWidth: -3.5,
    sleeveLength: -0.5,
    neckOpening: 0
  },
  regular: {
    chest: 0,
    waist: 0,
    shoulder: 0,
    length: 0,
    sleeveWidth: 0,
    sleeveLength: 0,
    neckOpening: 0
  },
  oversized: {
    chest: 12,
    waist: 12,
    shoulder: 6,
    length: 4.5,
    sleeveWidth: 5,
    sleeveLength: 3.5,
    neckOpening: 1.5
  }
};

export interface GeometryBounds {
  min: THREE.Vector3;
  max: THREE.Vector3;
  size: THREE.Vector3;
  center: THREE.Vector3;
}

@Injectable({
  providedIn: 'root'
})
export class TshirtDeformationService {
  // Pristine base geometry vertex positions buffer
  private basePositions: Float32Array | null = null;
  private currentMesh: THREE.Mesh | null = null;
  private baseMeasurements: GarmentMeasurements = { ...SIZE_PRESETS.L };
  private baseBounds: GeometryBounds | null = null;

  /**
   * Register mesh and capture un-deformed base vertex positions and real bounding box
   */
  registerMesh(mesh: THREE.Mesh): void {
    this.currentMesh = mesh;
    const posAttr = mesh.geometry.attributes['position'];
    if (!posAttr) return;

    const count = posAttr.count;
    this.basePositions = new Float32Array(posAttr.array.length);
    this.basePositions.set(posAttr.array);

    // Compute actual, pristine geometry bounding box from base vertex positions
    let minX = Infinity, minY = Infinity, minZ = Infinity;
    let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const x = this.basePositions[idx];
      const y = this.basePositions[idx + 1];
      const z = this.basePositions[idx + 2];

      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
      if (z < minZ) minZ = z;
      if (z > maxZ) maxZ = z;
    }

    this.baseBounds = {
      min: new THREE.Vector3(minX, minY, minZ),
      max: new THREE.Vector3(maxX, maxY, maxZ),
      size: new THREE.Vector3(maxX - minX, maxY - minY, maxZ - minZ),
      center: new THREE.Vector3((minX + maxX) / 2, (minY + maxY) / 2, (minZ + maxZ) / 2)
    };

    const triangleCount = mesh.geometry.index ? mesh.geometry.index.count / 3 : count / 3;
    console.log('[TshirtDeformationService] Registered mesh geometry:', {
      vertexCount: count,
      triangleCount,
      boundsMin: { x: +minX.toFixed(4), y: +minY.toFixed(4), z: +minZ.toFixed(4) },
      boundsMax: { x: +maxX.toFixed(4), y: +maxY.toFixed(4), z: +maxZ.toFixed(4) },
      boundsSize: { x: +(maxX - minX).toFixed(4), y: +(maxY - minY).toFixed(4), z: +(maxZ - minZ).toFixed(4) },
      boundsCenter: { x: +((minX + maxX) / 2).toFixed(4), y: +((minY + maxY) / 2).toFixed(4), z: +((minZ + maxZ) / 2).toFixed(4) }
    });
  }

  /**
   * Return the computed base geometry bounds
   */
  getBaseBounds(): GeometryBounds | null {
    return this.baseBounds;
  }

  /**
   * Reset to pristine original geometry (Size L Regular)
   */
  resetToBaseGeometry(): void {
    if (!this.currentMesh || !this.basePositions) return;
    const posAttr = this.currentMesh.geometry.attributes['position'];
    posAttr.array.set(this.basePositions);
    posAttr.needsUpdate = true;
    this.currentMesh.geometry.computeVertexNormals();
    this.currentMesh.geometry.computeBoundingBox();
    this.currentMesh.geometry.computeBoundingSphere();
  }

  /**
   * Get effective measurements combining size preset and fit style modifier
   */
  getEffectiveMeasurements(size: GarmentSize, fit: FitStyle, custom?: Partial<GarmentMeasurements>): GarmentMeasurements {
    const base = size === 'Custom' && custom ? { ...SIZE_PRESETS.L, ...custom } : { ...SIZE_PRESETS[size] };
    const mod = FIT_MODIFIERS[fit];

    return {
      chest: Math.max(75, Math.min(145, base.chest + (mod.chest || 0))),
      waist: Math.max(65, Math.min(135, base.waist + (mod.waist || 0))),
      shoulder: Math.max(36, Math.min(62, base.shoulder + (mod.shoulder || 0))),
      length: Math.max(55, Math.min(90, base.length + (mod.length || 0))),
      sleeveLength: Math.max(14, Math.min(35, base.sleeveLength + (mod.sleeveLength || 0))),
      sleeveWidth: Math.max(24, Math.min(52, base.sleeveWidth + (mod.sleeveWidth || 0))),
      neckOpening: Math.max(34, Math.min(54, base.neckOpening + (mod.neckOpening || 0)))
    };
  }

  /**
   * Apply anatomical parametric deformation to the 3D garment mesh
   */
  applyDeformation(measurements: GarmentMeasurements): void {
    if (!this.currentMesh || !this.basePositions || !this.baseBounds) return;

    const posAttr = this.currentMesh.geometry.attributes['position'];
    const currentPositions = posAttr.array as Float32Array;
    const base = this.basePositions;
    const count = posAttr.count;
    const bounds = this.baseBounds;

    const bSizeX = bounds.size.x;
    const bSizeY = bounds.size.y;
    const bMinY = bounds.min.y;
    const bCenterX = bounds.center.x;
    const bCenterZ = bounds.center.z;
    const halfW = bSizeX * 0.5;

    // Measurement delta ratios relative to base Model Size L
    const deltaChest = (measurements.chest - this.baseMeasurements.chest) / this.baseMeasurements.chest;
    const deltaWaist = (measurements.waist - this.baseMeasurements.waist) / this.baseMeasurements.waist;
    const deltaShoulder = (measurements.shoulder - this.baseMeasurements.shoulder) / this.baseMeasurements.shoulder;
    const deltaLength = (measurements.length - this.baseMeasurements.length) / this.baseMeasurements.length;
    const deltaSleeveLen = (measurements.sleeveLength - this.baseMeasurements.sleeveLength) / this.baseMeasurements.sleeveLength;
    const deltaSleeveWidth = (measurements.sleeveWidth - this.baseMeasurements.sleeveWidth) / this.baseMeasurements.sleeveWidth;
    const deltaNeck = (measurements.neckOpening - this.baseMeasurements.neckOpening) / this.baseMeasurements.neckOpening;

    // If exactly Size L Regular (baseline), restore pristine base positions directly
    const isBaseline =
      Math.abs(deltaChest) < 1e-5 &&
      Math.abs(deltaWaist) < 1e-5 &&
      Math.abs(deltaShoulder) < 1e-5 &&
      Math.abs(deltaLength) < 1e-5 &&
      Math.abs(deltaSleeveLen) < 1e-5 &&
      Math.abs(deltaSleeveWidth) < 1e-5 &&
      Math.abs(deltaNeck) < 1e-5;

    if (isBaseline) {
      currentPositions.set(base);
      posAttr.needsUpdate = true;
      this.currentMesh.geometry.computeVertexNormals();
      this.currentMesh.geometry.computeBoundingBox();
      this.currentMesh.geometry.computeBoundingSphere();
      return;
    }

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const x0 = base[idx];
      const y0 = base[idx + 1];
      const z0 = base[idx + 2];

      const relX = x0 - bCenterX;
      const relY = y0 - bMinY; // 0 at hem, bSizeY at shoulder/collar
      const relZ = z0 - bCenterZ;

      // Actual normalized coordinates derived from the real geometry bounds
      const normY = THREE.MathUtils.clamp(relY / bSizeY, 0, 1);
      const absRelX = Math.abs(relX);
      const normAbsX = THREE.MathUtils.clamp(absRelX / halfW, 0, 1);

      // Anatomical Regions with strictly ordered smoothstep thresholds (min < max):
      // 1. Sleeve vs Torso: Smooth blend across the armpit / shoulder seam (0.45 -> 0.68)
      const sleeveWeight = THREE.MathUtils.smoothstep(normAbsX, 0.45, 0.68) * THREE.MathUtils.smoothstep(normY, 0.38, 0.88);

      // 2. Waist / Hem Region (normY 0.0 to 0.55): Smooth falloff upward into chest
      const waistWeight = (1.0 - THREE.MathUtils.smoothstep(normY, 0.18, 0.55)) * (1.0 - sleeveWeight);

      // 3. Chest Region: Centered at normY = 0.62 with a smooth bell curve
      const chestWeight = Math.exp(-Math.pow((normY - 0.62) / 0.16, 2)) * (1.0 - sleeveWeight);

      // 4. Shoulder Yoke Region: Upper torso near the shoulder line
      const shoulderWeight = THREE.MathUtils.smoothstep(normY, 0.68, 0.94) * THREE.MathUtils.smoothstep(normAbsX, 0.15, 0.52);

      // 5. Collar / Neckline: Top center
      const collarWeight = THREE.MathUtils.smoothstep(normY, 0.76, 0.96) * (1.0 - THREE.MathUtils.smoothstep(normAbsX, 0.08, 0.26));

      // ---- Parametric Displacement Accumulator ----
      let dx = 0;
      let dy = 0;
      let dz = 0;

      // Chest expansion / contraction (radial in X & Z, preserving curvature)
      const chestFactor = deltaChest * chestWeight;
      dx += relX * chestFactor * 0.40;
      dz += relZ * chestFactor * 0.52;

      // Waist expansion / tapering (radial in X & Z)
      const waistFactor = deltaWaist * waistWeight;
      dx += relX * waistFactor * 0.42;
      dz += relZ * waistFactor * 0.46;

      // Shoulder width: smoothly broadens the upper yoke laterally
      const shoulderFactor = deltaShoulder * shoulderWeight;
      dx += Math.sign(relX) * shoulderFactor * (halfW * 0.35);

      // Smooth outer shoulder carry: sleeves smoothly follow the widening shoulder seam
      const sleeveCarry = THREE.MathUtils.smoothstep(normAbsX, 0.40, 0.70) * THREE.MathUtils.smoothstep(normY, 0.50, 0.92);
      dx += Math.sign(relX) * (deltaShoulder * sleeveCarry * halfW * 0.28);

      // Shirt length: hem extends downward, collar remains anchored to shoulders
      const lengthWeight = (1.0 - THREE.MathUtils.smoothstep(normY, 0.45, 0.88)) * (1.0 - sleeveWeight * 0.9);
      dy -= deltaLength * lengthWeight * (bSizeY * 0.32);

      // Sleeve length: extends smoothly along arm drape angle (outward in X, slightly downward in Y)
      const sleeveTipFactor = THREE.MathUtils.smoothstep(normAbsX, 0.48, 0.92) * THREE.MathUtils.smoothstep(normY, 0.45, 0.85);
      dx += Math.sign(relX) * deltaSleeveLen * sleeveTipFactor * (halfW * 0.30);
      dy -= deltaSleeveLen * sleeveTipFactor * (bSizeY * 0.16);

      // Sleeve width: radial circumference expansion around the sleeve axis
      const armCenterY = bMinY + bSizeY * 0.62;
      const distArmY = y0 - armCenterY;
      dy += distArmY * deltaSleeveWidth * sleeveWeight * 0.35;
      dz += relZ * deltaSleeveWidth * sleeveWeight * 0.40;

      // Neck opening: subtle radial adjustment around neckline
      const neckFactor = deltaNeck * collarWeight;
      dx += relX * neckFactor * 0.25;
      dz += relZ * neckFactor * 0.25;

      currentPositions[idx] = x0 + dx;
      currentPositions[idx + 1] = y0 + dy;
      currentPositions[idx + 2] = z0 + dz;
    }

    posAttr.needsUpdate = true;
    this.currentMesh.geometry.computeVertexNormals();
    this.currentMesh.geometry.computeBoundingBox();
    this.currentMesh.geometry.computeBoundingSphere();
  }

  dispose(): void {
    this.basePositions = null;
    this.baseBounds = null;
    this.currentMesh = null;
  }
}

