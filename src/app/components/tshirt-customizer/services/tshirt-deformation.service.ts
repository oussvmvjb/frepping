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

@Injectable({
  providedIn: 'root'
})
export class TshirtDeformationService {
  // Pristine base geometry vertex positions buffer
  private basePositions: Float32Array | null = null;
  private currentMesh: THREE.Mesh | null = null;
  private baseMeasurements: GarmentMeasurements = { ...SIZE_PRESETS.L };

  /**
   * Register mesh and capture un-deformed base vertex positions
   */
  registerMesh(mesh: THREE.Mesh): void {
    this.currentMesh = mesh;
    const posAttr = mesh.geometry.attributes['position'];
    if (!posAttr) return;

    this.basePositions = new Float32Array(posAttr.array.length);
    this.basePositions.set(posAttr.array);
  }

  /**
   * Reset to pristine original geometry
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
    if (!this.currentMesh || !this.basePositions) return;

    const posAttr = this.currentMesh.geometry.attributes['position'];
    const currentPositions = posAttr.array as Float32Array;
    const base = this.basePositions;
    const count = posAttr.count;

    // Measurement delta ratios relative to base Model Size L
    const deltaChest = (measurements.chest - this.baseMeasurements.chest) / this.baseMeasurements.chest;
    const deltaWaist = (measurements.waist - this.baseMeasurements.waist) / this.baseMeasurements.waist;
    const deltaShoulder = (measurements.shoulder - this.baseMeasurements.shoulder) / this.baseMeasurements.shoulder;
    const deltaLength = (measurements.length - this.baseMeasurements.length) / this.baseMeasurements.length;
    const deltaSleeveLen = (measurements.sleeveLength - this.baseMeasurements.sleeveLength) / this.baseMeasurements.sleeveLength;
    const deltaSleeveWidth = (measurements.sleeveWidth - this.baseMeasurements.sleeveWidth) / this.baseMeasurements.sleeveWidth;
    const deltaNeck = (measurements.neckOpening - this.baseMeasurements.neckOpening) / this.baseMeasurements.neckOpening;

    // Center geometry normalization constants (normalized height ~2.4, Y in [-1.2, 1.2], X in [-1.25, 1.25])
    const minY = -1.2;
    const maxY = 1.2;
    const totalHeight = maxY - minY;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const x0 = base[idx];
      const y0 = base[idx + 1];
      const z0 = base[idx + 2];

      const normY = THREE.MathUtils.clamp((y0 - minY) / totalHeight, 0, 1);
      const absX = Math.abs(x0);
      const distXZ = Math.sqrt(x0 * x0 + z0 * z0);

      // Anatomical Regions:
      // 1. Torso Core vs Sleeves vs Collar
      const isSleeve = THREE.MathUtils.smoothstep(absX, 0.42, 0.95);
      const isCollar = THREE.MathUtils.smoothstep(normY, 0.82, 0.98) * (1.0 - THREE.MathUtils.smoothstep(distXZ, 0.18, 0.45));

      // 2. Chest Region (normY ~0.45 to ~0.78, within torso)
      const chestBell = Math.exp(-Math.pow((normY - 0.62) / 0.18, 2)) * (1.0 - isSleeve);

      // 3. Waist / Hem Region (normY ~0.0 to ~0.48)
      const waistBell = THREE.MathUtils.smoothstep(normY, 0.52, 0.08) * (1.0 - isSleeve);

      // 4. Shoulder Yoke Region (normY ~0.72 to ~0.95, mid to outer X)
      const shoulderWeight = THREE.MathUtils.smoothstep(normY, 0.70, 0.92) * THREE.MathUtils.smoothstep(absX, 0.25, 0.75);

      // 5. Sleeve Extension & Width
      const sleeveArmFactor = isSleeve;

      // ---- Apply Parametric Deformations ----
      let dx = 0;
      let dy = 0;
      let dz = 0;

      // Chest expansion (radial in X & Z)
      const chestRadial = chestBell * deltaChest * 0.42;
      dx += x0 * chestRadial;
      dz += z0 * chestRadial * 1.15; // Chest expands slightly more in front/back depth

      // Waist expansion/tapering (radial in X & Z)
      const waistRadial = waistBell * deltaWaist * 0.45;
      dx += x0 * waistRadial;
      dz += z0 * waistRadial * 1.05;

      // Shoulder width (horizontal X scaling with smooth sleeve origin displacement)
      dx += Math.sign(x0) * Math.abs(x0) * deltaShoulder * shoulderWeight * 0.45;
      // Also shift entire sleeve outward if shoulders widen
      if (absX > 0.45) {
        dx += Math.sign(x0) * (deltaShoulder * 0.18 * isSleeve);
      }

      // Shirt Length (moves lower vertices downward proportional to distance from chest)
      const lengthFalloff = THREE.MathUtils.smoothstep(normY, 0.70, 0.0);
      dy += deltaLength * 0.35 * lengthFalloff * (1.0 - isSleeve * 0.8);

      // Sleeve Length (displaces sleeve vertices along arm angle down and out)
      if (absX > 0.42) {
        const sleeveTipFactor = THREE.MathUtils.smoothstep(absX, 0.50, 1.15);
        dx += Math.sign(x0) * (deltaSleeveLen * 0.28 * sleeveTipFactor);
        dy -= deltaSleeveLen * 0.18 * sleeveTipFactor; // Sleeves angle slightly downward
        
        // Sleeve Width (thickens sleeve circumference radially)
        const armCenterY = 0.55;
        const armDistY = y0 - armCenterY;
        dy += armDistY * deltaSleeveWidth * 0.4 * sleeveTipFactor;
        dz += z0 * deltaSleeveWidth * 0.45 * sleeveTipFactor;
      }

      // Neck Opening
      if (isCollar > 0.01) {
        const neckRadial = isCollar * deltaNeck * 0.35;
        dx += x0 * neckRadial;
        dz += z0 * neckRadial;
      }

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
    this.currentMesh = null;
  }
}

