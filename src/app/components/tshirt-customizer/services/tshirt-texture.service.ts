import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { FabricPreset } from '../models/tshirt-customizer.models';

export const FABRIC_PRESETS: FabricPreset[] = [
  {
    id: 'cotton',
    name: 'Ring-Spun Cotton',
    description: 'Soft, breathable everyday cotton with fine natural weave and soft sheen.',
    roughness: 0.88,
    sheen: 0.55,
    sheenRoughness: 0.65,
    sheenColor: '#e2e8f0',
    normalScale: 0.85,
    repeat: 1.0
  },
  {
    id: 'heavy-cotton',
    name: 'Heavyweight 240 GSM',
    description: 'Structured streetwear drop with dense yarn, deeper crease definition and minimal luster.',
    roughness: 0.95,
    sheen: 0.25,
    sheenRoughness: 0.8,
    sheenColor: '#cbd5e1',
    normalScale: 1.25,
    repeat: 1.0
  },
  {
    id: 'linen',
    name: 'Slub Linen Blend',
    description: 'Textured luxury weave with natural organic cross-hatch fibers.',
    roughness: 0.82,
    sheen: 0.40,
    sheenRoughness: 0.55,
    sheenColor: '#f1f5f9',
    normalScale: 1.45,
    repeat: 1.5
  },
  {
    id: 'silk-blend',
    name: 'Silk-Lustre Modal',
    description: 'High-drape luxury finish with radiant microfiber sheen and soft reflections.',
    roughness: 0.52,
    sheen: 0.92,
    sheenRoughness: 0.35,
    sheenColor: '#ffffff',
    normalScale: 0.65,
    repeat: 1.0
  },
  {
    id: 'tech-mesh',
    name: 'Athletic Cool-Dry',
    description: 'Performance technical knit with micro-perforated airflow texture.',
    roughness: 0.72,
    sheen: 0.65,
    sheenRoughness: 0.45,
    sheenColor: '#e0e7ff',
    normalScale: 1.6,
    repeat: 2.0
  }
];

@Injectable({
  providedIn: 'root'
})
export class TshirtTextureService {
  private textureLoader = new THREE.TextureLoader();
  private loadedTextures: Map<string, THREE.Texture> = new Map();

  /**
   * Load base asset texture with proper colorSpace and wrapping
   */
  loadTexture(url: string, isSRGB: boolean): Promise<THREE.Texture> {
    const cached = this.loadedTextures.get(url);
    if (cached) return Promise.resolve(cached);

    return new Promise((resolve) => {
      this.textureLoader.load(
        url,
        (tex) => {
          tex.colorSpace = isSRGB ? THREE.SRGBColorSpace : THREE.NoColorSpace;
          tex.wrapS = THREE.RepeatWrapping;
          tex.wrapT = THREE.RepeatWrapping;
          tex.generateMipmaps = true;
          tex.minFilter = THREE.LinearMipmapLinearFilter;
          tex.magFilter = THREE.LinearFilter;
          this.loadedTextures.set(url, tex);
          resolve(tex);
        },
        undefined,
        (err) => {
          console.warn(`Failed loading texture from ${url}`, err);
          // Fallback 1x1 data texture
          const fallback = new THREE.DataTexture(new Uint8Array([255, 255, 255, 255]), 1, 1);
          fallback.needsUpdate = true;
          this.loadedTextures.set(url, fallback);
          resolve(fallback);
        }
      );
    });
  }

  /**
   * Convert Gloss map into PBR Roughness map using offscreen canvas
   */
  createRoughnessFromGloss(glossTex: THREE.Texture, baseFloor = 0.45): THREE.Texture {
    if (!glossTex.image || !(glossTex.image instanceof HTMLImageElement)) {
      return glossTex;
    }

    try {
      const img = glossTex.image;
      const canvas = document.createElement('canvas');
      canvas.width = Math.min(img.width || 1024, 2048);
      canvas.height = Math.min(img.height || 1024, 2048);
      const ctx = canvas.getContext('2d');
      if (!ctx) return glossTex;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      // Invert gloss: Roughness = 1.0 - Gloss
      for (let i = 0; i < data.length; i += 4) {
        const gloss = data[i] / 255.0;
        const clothRoughness = Math.min(0.98, Math.max(baseFloor, (1.0 - gloss) * 0.85 + 0.15));
        const val = Math.round(clothRoughness * 255);
        data[i] = val;
        data[i + 1] = val;
        data[i + 2] = val;
      }

      ctx.putImageData(imgData, 0, 0);
      const roughnessTex = new THREE.CanvasTexture(canvas);
      roughnessTex.wrapS = THREE.RepeatWrapping;
      roughnessTex.wrapT = THREE.RepeatWrapping;
      roughnessTex.generateMipmaps = true;
      roughnessTex.needsUpdate = true;
      this.loadedTextures.set('generated-roughness', roughnessTex);
      return roughnessTex;
    } catch (e) {
      console.warn('Roughness conversion skipped', e);
      return glossTex;
    }
  }

  /**
   * Generate procedural fabric micro-weave normal pattern for specialized presets
   */
  generateProceduralWeaveNormal(presetId: string): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    const imgData = ctx.createImageData(512, 512);
    const data = imgData.data;

    for (let y = 0; y < 512; y++) {
      for (let x = 0; x < 512; x++) {
        const idx = (y * 512 + x) * 4;

        let nx = 0.5;
        let ny = 0.5;
        let nz = 1.0;

        if (presetId === 'linen') {
          // Cross-hatch slub linen fibers
          const waveX = Math.sin(x * 0.4) * Math.cos(y * 0.08);
          const waveY = Math.cos(y * 0.4) * Math.sin(x * 0.08);
          nx = 0.5 + waveX * 0.25;
          ny = 0.5 + waveY * 0.25;
        } else if (presetId === 'tech-mesh') {
          // Honeycomb / micro-perforation mesh
          const gridX = (x % 16) - 8;
          const gridY = (y % 16) - 8;
          const dist = Math.sqrt(gridX * gridX + gridY * gridY);
          const bump = dist < 5 ? -0.35 : 0.15;
          nx = 0.5 + (gridX / 8) * bump * 0.3;
          ny = 0.5 + (gridY / 8) * bump * 0.3;
        } else {
          // Fine twill / cotton jersey diagonal weave
          const twill = Math.sin((x + y * 1.5) * 0.6);
          nx = 0.5 + twill * 0.15;
          ny = 0.5 - twill * 0.15;
        }

        data[idx] = Math.round(nx * 255);
        data[idx + 1] = Math.round(ny * 255);
        data[idx + 2] = Math.round(nz * 255);
        data[idx + 3] = 255;
      }
    }

    ctx.putImageData(imgData, 0, 0);
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(8, 8);
    tex.needsUpdate = true;
    return tex;
  }

  /**
   * Generates a surface-conforming Garment Atlas UV attribute.
   * Maps 3D garment sections (front, back, left sleeve, right sleeve, collar, patch)
   * to their respective pattern pieces on a 16:9 texture atlas.
   */
  generateGarmentAtlasUV(geometry: THREE.BufferGeometry): THREE.BufferAttribute {
    const pos = geometry.attributes['position'] as THREE.BufferAttribute;
    const rawUV = geometry.attributes['uv'] as THREE.BufferAttribute;
    if (!pos || !rawUV) return rawUV;

    const count = pos.count;
    const atlasData = new Float32Array(count * 2);

    for (let i = 0; i < count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      const u = rawUV.getX(i);
      const v = rawUV.getY(i);

      let nu = u;
      let nv = v;

      if (v > 2.0) {
        // Collar / Neckband (Raw U: [0.58, 1.04], V: [2.20, 2.22])
        nu = ((u - 0.58) / 0.457) * (0.640 - 0.496) + 0.496;
        nv = ((v - 2.201) / 0.019) * (0.988 - 0.912) + 0.912;
      } else if (u < -0.5) {
        // Left Sleeve (Person's right, negative X)
        if (v > 1.326) {
          // Upper sleeve
          nu = ((u + 1.058) / 0.416) * (0.133 - 0.007) + 0.007;
          nv = ((v - 1.326) / 0.327) * (0.960 - 0.385) + 0.385;
        } else {
          // Cuff / Lower sleeve
          nu = ((u + 1.058) / 0.416) * (0.105 - 0.005) + 0.005;
          nv = ((v - 1.304) / 0.023) * (0.380 - 0.035) + 0.035;
        }
      } else if (x > 70 && (y > 1200 || y > 0)) {
        // Right Sleeve (Person's left, positive X)
        if (v > 0.055) {
          // Upper sleeve
          nu = ((u + 0.208) / 0.416) * (0.993 - 0.870) + 0.870;
          nv = ((v - 0.055) / 0.326) * (0.960 - 0.385) + 0.385;
        } else {
          // Cuff / Lower sleeve
          nu = ((u + 0.208) / 0.416) * (0.995 - 0.895) + 0.895;
          nv = Math.max(0.035, Math.min(0.380, ((v - 0.002) / 0.053) * (0.380 - 0.035) + 0.035));
        }
      } else if (u > 0.9 && v > 1.5) {
        // Neck Patch / Tag
        nu = ((u - 0.956) / 0.048) * (0.535 - 0.490) + 0.490;
        nv = ((v - 1.567) / 0.025) * (0.885 - 0.765) + 0.765;
      } else if (z >= -5) {
        // Front Body
        nu = ((u + 0.298) / 0.596) * (0.505 - 0.098) + 0.098;
        nv = ((v + 0.247) / 0.661) * (0.985 - 0.012) + 0.012;
      } else {
        // Back Body
        nu = ((u + 0.298) / 0.596) * (0.915 - 0.518) + 0.518;
        nv = ((v + 0.292) / 0.689) * (0.895 - 0.012) + 0.012;
      }

      atlasData[i * 2] = Math.max(0, Math.min(1, nu));
      atlasData[i * 2 + 1] = Math.max(0, Math.min(1, nv));
    }

    return new THREE.BufferAttribute(atlasData, 2);
  }

  dispose(): void {
    this.loadedTextures.forEach((tex) => tex.dispose());
    this.loadedTextures.clear();
  }
}

