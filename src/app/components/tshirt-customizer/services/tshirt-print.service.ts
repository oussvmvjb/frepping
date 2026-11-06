import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { DecalGeometry } from 'three/examples/jsm/geometries/DecalGeometry';
import { DesignDecal } from '../models/tshirt-customizer.models';
import { TshirtMaterialService } from './tshirt-material.service';

@Injectable({
  providedIn: 'root'
})
export class TshirtPrintService {
  private targetMesh: THREE.Mesh | null = null;
  private fabricNormalMap: THREE.Texture | null = null;
  private decalMeshes: Map<string, THREE.Mesh> = new Map();
  private decalTextures: Map<string, THREE.Texture> = new Map();

  // Raycaster for finding exact 3D surface points and surface normals
  private raycaster = new THREE.Raycaster();
  // Local proxy mesh for local-coordinate raycasting and projection (avoids double-transformations)
  private localProxyMesh = new THREE.Mesh();

  constructor(private materialService: TshirtMaterialService) {}

  /**
   * Set target T-shirt mesh for decal projection & fabric normal map
   */
  setTargetMesh(mesh: THREE.Mesh, fabricNormalMap?: THREE.Texture | null): void {
    this.targetMesh = mesh;
    this.localProxyMesh.geometry = mesh.geometry;
    this.localProxyMesh.matrixWorld.identity();
    this.localProxyMesh.matrix.identity();
    if (fabricNormalMap) {
      this.fabricNormalMap = fabricNormalMap;
    }
    this.removeAllDecals();
  }

  /**
   * Set or update the active fabric normal map so prints inherit fabric weave
   */
  setFabricNormalMap(normalMap: THREE.Texture | null): void {
    this.fabricNormalMap = normalMap;
    // Update existing decal materials
    this.decalMeshes.forEach((mesh) => {
      const mat = mesh.material as THREE.MeshPhysicalMaterial;
      if (mat) {
        mat.normalMap = normalMap;
        mat.needsUpdate = true;
      }
    });
  }

  /**
   * Create or update a surface-conforming decal on the 3D T-shirt
   */
  applyPrint(decal: DesignDecal, layerIndex = 0): void {
    if (!this.targetMesh) return;

    // 1. Calculate and lock aspect ratio and physical dimensions (cm)
    if (!decal.aspectRatio || decal.aspectRatio <= 0) {
      if (decal.image && decal.image.width > 0 && decal.image.height > 0) {
        decal.aspectRatio = decal.image.width / decal.image.height;
      } else {
        decal.aspectRatio = 1.0;
      }
    }

    if (decal.lockAspectRatio === undefined) {
      decal.lockAspectRatio = true;
    }

    // Default reference width: 22 cm for a standard graphic at 1.0x scale
    const baseWidthCm = 22.0;
    if (decal.lockAspectRatio) {
      decal.widthCm = Math.round(baseWidthCm * (decal.scale || 1.0) * 10) / 10;
      decal.heightCm = Math.round((decal.widthCm / decal.aspectRatio) * 10) / 10;
    } else {
      if (!decal.widthCm) decal.widthCm = Math.round(baseWidthCm * (decal.scale || 1.0) * 10) / 10;
      if (!decal.heightCm) decal.heightCm = Math.round((decal.widthCm / decal.aspectRatio) * 10) / 10;
    }

    // Scale factors: In our Three.js scene, height is 2.4 units, representing a 72 cm garment length
    // 1 cm = 2.4 / 72 = 0.03333 Three.js units
    const CM_TO_UNITS = 2.4 / 72.0;
    const printSizeX = Math.max(0.08, decal.widthCm * CM_TO_UNITS);
    const printSizeY = Math.max(0.08, decal.heightCm * CM_TO_UNITS);
    // Tight projection depth: 0.18 units (~5.4 cm) prevents clipping through to opposite side
    const printDepth = 0.18;
    const decalSize = new THREE.Vector3(printSizeX, printSizeY, printDepth);

    // 2. Exact Surface Sampling via Raycasting
    // Instead of hardcoding Z, we raycast onto the actual deformed mesh to find the exact surface point and normal
    const surfaceSample = this.sampleGarmentSurface(decal);
    if (!surfaceSample) {
      console.warn('Could not find surface intersection on garment for decal', decal.name);
      return;
    }

    const { hitPoint, hitNormal } = surfaceSample;

    // 3. Compute Projector Orientation
    // Orient projector frame to look directly along surface normal into the mesh
    const dummy = new THREE.Object3D();
    dummy.position.copy(hitPoint);
    dummy.lookAt(hitPoint.clone().add(hitNormal));

    // Apply rotation around the surface normal (Z axis in the projector local space)
    dummy.rotateZ(THREE.MathUtils.degToRad(-(decal.rotation || 0)));

    // 4. Remove previous decal mesh for this ID
    this.removeDecalMesh(decal.id);

    // 5. Load or retrieve high-quality texture with cache invalidation on dataUrl change
    let texture = this.decalTextures.get(decal.id);
    const cachedUrl = texture?.userData?.['dataUrl'];
    if (!texture || cachedUrl !== decal.dataUrl) {
      if (texture) {
        texture.dispose();
      }
      const loader = new THREE.TextureLoader();
      texture = loader.load(decal.dataUrl);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.generateMipmaps = true;
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.anisotropy = 8;
      texture.userData = { dataUrl: decal.dataUrl };
      this.decalTextures.set(decal.id, texture);
    }

    try {
      // 6. Generate Surface-Conforming Geometry in LOCAL space using localProxyMesh
      const decalGeometry = new DecalGeometry(
        this.localProxyMesh,
        hitPoint,
        dummy.rotation,
        decalSize
      );

      // Micro-offset along local surface normal (0.0008) to guarantee 100% surface adherence without z-fighting
      const posAttr = decalGeometry.attributes['position'] as THREE.BufferAttribute;
      const normAttr = decalGeometry.attributes['normal'] as THREE.BufferAttribute;
      if (posAttr && normAttr) {
        for (let i = 0; i < posAttr.count; i++) {
          posAttr.setXYZ(
            i,
            posAttr.getX(i) + normAttr.getX(i) * 0.0008,
            posAttr.getY(i) + normAttr.getY(i) * 0.0008,
            posAttr.getZ(i) + normAttr.getZ(i) * 0.0008
          );
        }
        posAttr.needsUpdate = true;
      }

      // 7. Realistic Fabric-Printed Material
      // - Uses fabric normal map so micro-creases and textile weave show through
      // - PolygonOffset ensures zero physical gap and zero z-fighting
      const layerRank = decal.zIndex !== undefined ? decal.zIndex : layerIndex + 1;
      const decalMaterial = new THREE.MeshPhysicalMaterial({
        map: texture,
        normalMap: this.fabricNormalMap,
        normalScale: new THREE.Vector2(0.55, 0.55),
        transparent: true,
        opacity: decal.opacity !== undefined ? decal.opacity : 1.0,
        depthTest: true,
        depthWrite: false,
        // Depth bias handles z-fighting sub-pixel
        polygonOffset: true,
        polygonOffsetFactor: -2.0 - layerRank * 0.5,
        polygonOffsetUnits: -2.0,
        // Textile ink properties (matte screenprint / DTG ink)
        roughness: 0.85,
        metalness: 0.0,
        sheen: 0.35,
        sheenRoughness: 0.65,
        sheenColor: new THREE.Color(0xf1f5f9)
      });

      // Inject fabric motion shader so decal vertices sway synchronously with garment
      this.materialService.injectFabricPhysicsShader(decalMaterial);

      const decalMesh = new THREE.Mesh(decalGeometry, decalMaterial);
      decalMesh.name = `Decal_${decal.id}`;
      decalMesh.renderOrder = layerRank;
      decalMesh.position.set(0, 0, 0);
      decalMesh.rotation.set(0, 0, 0);
      decalMesh.scale.set(1, 1, 1);

      this.targetMesh.add(decalMesh);
      this.decalMeshes.set(decal.id, decalMesh);
    } catch (e) {
      console.warn('Error creating surface-conforming decal geometry:', e);
    }
  }

  /**
   * Cast rays from outside the garment towards the target placement zone in LOCAL coordinate space.
   * Returns exact 3D surface point and surface normal on the actual deformed geometry.
   */
  private sampleGarmentSurface(
    decal: DesignDecal
  ): { hitPoint: THREE.Vector3; hitNormal: THREE.Vector3 } | null {
    if (!this.targetMesh) return null;

    // Ensure localProxyMesh geometry is in sync with targetMesh
    this.localProxyMesh.geometry = this.targetMesh.geometry;
    this.localProxyMesh.matrixWorld.identity();
    this.localProxyMesh.matrix.identity();

    const origin = new THREE.Vector3();
    const direction = new THREE.Vector3();

    // Normalized bounds mapping in the model's LOCAL space:
    // Garment normalized height ~1.82, centered around 0. Chest center is Y = 0.22.
    switch (decal.side) {
      case 'front': {
        // Front: Ray originates from local Z = +2.5 pointing backwards (0, 0, -1)
        const targetX = decal.x * 0.38;
        const targetY = 0.22 + decal.y * 0.38;
        origin.set(targetX, targetY, 2.5);
        direction.set(0, 0, -1);
        break;
      }
      case 'back': {
        // Back: Ray originates from local Z = -2.5 pointing forwards (0, 0, 1)
        const targetX = -decal.x * 0.38;
        const targetY = 0.22 + decal.y * 0.38;
        origin.set(targetX, targetY, -2.5);
        direction.set(0, 0, 1);
        break;
      }
      case 'sleeve-left': {
        // Left Sleeve (model's left): Ray originates from local X = +2.5 pointing inwards (-1, 0, 0)
        const targetY = 0.22 + decal.y * 0.18;
        const targetZ = 0.05 + decal.x * 0.12;
        origin.set(2.5, targetY, targetZ);
        direction.set(-1, 0, 0);
        break;
      }
      case 'sleeve-right': {
        // Right Sleeve (model's right): Ray originates from local X = -2.5 pointing inwards (+1, 0, 0)
        const targetY = 0.22 + decal.y * 0.18;
        const targetZ = 0.05 - decal.x * 0.12;
        origin.set(-2.5, targetY, targetZ);
        direction.set(1, 0, 0);
        break;
      }
    }

    this.raycaster.set(origin, direction.normalize());
    const intersections = this.raycaster.intersectObject(this.localProxyMesh, false);

    if (intersections.length > 0) {
      const hit = intersections[0];
      const hitPoint = hit.point.clone();
      const hitNormal = hit.face ? hit.face.normal.clone() : new THREE.Vector3(0, 0, 1);

      // Ensure normal faces the ray origin outwards
      if (hitNormal.dot(direction) > 0) {
        hitNormal.negate();
      }

      return { hitPoint, hitNormal };
    }

    // Fallback: If off the edge, project onto approximate curved bounding surface
    const fallbackPoint = origin.clone().addScaledVector(direction, 2.2);
    const fallbackNormal = direction.clone().negate();
    return { hitPoint: fallbackPoint, hitNormal: fallbackNormal };
  }

  /**
   * Re-project all active decals (called after garment resizing, measurement changes, or fit style switches)
   */
  reprojectAll(decals: DesignDecal[]): void {
    if (!this.targetMesh) return;
    decals.forEach((decal, index) => {
      this.applyPrint(decal, index);
    });
  }

  /**
   * Bring a decal forward in layer order
   */
  bringForward(decalId: string, decals: DesignDecal[]): void {
    const idx = decals.findIndex((d) => d.id === decalId);
    if (idx < decals.length - 1) {
      const temp = decals[idx];
      decals[idx] = decals[idx + 1];
      decals[idx + 1] = temp;
      this.updateZIndices(decals);
      this.reprojectAll(decals);
    }
  }

  /**
   * Send a decal backward in layer order
   */
  sendBackward(decalId: string, decals: DesignDecal[]): void {
    const idx = decals.findIndex((d) => d.id === decalId);
    if (idx > 0) {
      const temp = decals[idx];
      decals[idx] = decals[idx - 1];
      decals[idx - 1] = temp;
      this.updateZIndices(decals);
      this.reprojectAll(decals);
    }
  }

  private updateZIndices(decals: DesignDecal[]): void {
    decals.forEach((d, i) => {
      d.zIndex = i + 1;
    });
  }

  /**
   * Center a design on the chest or back
   */
  centerDesign(decal: DesignDecal): void {
    decal.x = 0;
    decal.y = 0;
    this.applyPrint(decal);
  }

  /**
   * Reset design transformations to default
   */
  resetDesign(decal: DesignDecal): void {
    decal.x = 0;
    decal.y = 0;
    decal.rotation = 0;
    decal.scale = 1.0;
    decal.lockAspectRatio = true;
    decal.opacity = 1.0;
    this.applyPrint(decal);
  }

  /**
   * Remove a single decal by ID
   */
  removeDecal(id: string): void {
    this.removeDecalMesh(id);
    const tex = this.decalTextures.get(id);
    if (tex) {
      tex.dispose();
      this.decalTextures.delete(id);
    }
  }

  private removeDecalMesh(id: string): void {
    const mesh = this.decalMeshes.get(id);
    if (mesh) {
      if (this.targetMesh) {
        this.targetMesh.remove(mesh);
      }
      mesh.geometry.dispose();
      (mesh.material as THREE.Material).dispose();
      this.decalMeshes.delete(id);
    }
  }

  /**
   * Remove all decals
   */
  removeAllDecals(): void {
    this.decalMeshes.forEach((mesh) => {
      if (this.targetMesh) {
        this.targetMesh.remove(mesh);
      }
      mesh.geometry.dispose();
      (mesh.material as THREE.Material).dispose();
    });
    this.decalMeshes.clear();
  }

  dispose(): void {
    this.removeAllDecals();
    this.decalTextures.forEach((t) => t.dispose());
    this.decalTextures.clear();
    this.targetMesh = null;
    this.fabricNormalMap = null;
  }
}

