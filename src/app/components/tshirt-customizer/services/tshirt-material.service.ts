import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { FabricPreset } from '../models/tshirt-customizer.models';

@Injectable({
  providedIn: 'root'
})
export class TshirtMaterialService {
  private materials: THREE.MeshPhysicalMaterial[] = [];
  private baseTextures = {
    diffuse: null as THREE.Texture | null,
    normal: null as THREE.Texture | null,
    roughness: null as THREE.Texture | null,
    opacity: null as THREE.Texture | null,
    specular: null as THREE.Texture | null
  };

  public customUniforms = {
    uTime: { value: 0 },
    uWindEnabled: { value: 1.0 },
    uWindIntensity: { value: 0.65 },
    uWindSpeed: { value: 1.8 },
    uWindDirection: { value: new THREE.Vector2(0.707, 0.707) },
    uBoundsMin: { value: new THREE.Vector3(-0.9, -0.9, -0.3) },
    uBoundsMax: { value: new THREE.Vector3(0.9, 0.9, 0.3) },
    uAngularVelocity: { value: 0 },
    uFabricIntensity: { value: 1.0 },
    uSway: { value: new THREE.Vector2(0, 0) }
  };

  /**
   * Set actual geometry bounds for normalized cloth physics displacement
   */
  setBounds(bounds: { min: THREE.Vector3; max: THREE.Vector3 } | null): void {
    if (!bounds) return;
    this.customUniforms.uBoundsMin.value.copy(bounds.min);
    this.customUniforms.uBoundsMax.value.copy(bounds.max);
  }

  setWindEnabled(enabled: boolean): void {
    this.customUniforms.uWindEnabled.value = enabled ? 1.0 : 0.0;
  }

  setWindIntensity(val: number): void {
    this.customUniforms.uWindIntensity.value = Math.max(0, val);
  }

  setWindSpeed(val: number): void {
    this.customUniforms.uWindSpeed.value = Math.max(0.1, val);
  }

  setWindDirection(deg: number): void {
    const rad = THREE.MathUtils.degToRad(deg);
    this.customUniforms.uWindDirection.value.set(Math.cos(rad), Math.sin(rad)).normalize();
  }

  /**
   * Initialize and register base textures
   */
  setBaseTextures(textures: {
    diffuse: THREE.Texture;
    normal: THREE.Texture | null;
    roughness: THREE.Texture | null;
    opacity: THREE.Texture | null;
    specular: THREE.Texture | null;
  }): void {
    this.baseTextures = textures as any;
  }

  /**
   * Create realistic PBR materials for FBX mesh groups
   */
  createMaterialsForMesh(mesh: THREE.Mesh, initialColor = '#ffffff'): THREE.MeshPhysicalMaterial[] {
    this.disposeMaterials();

    const existingMats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    const newMaterials: THREE.MeshPhysicalMaterial[] = [];

    existingMats.forEach((oldMat, index) => {
      const matName = oldMat?.name || `Tshirt_Material_${index}`;

      const physicalMat = new THREE.MeshPhysicalMaterial({
        name: matName,
        color: new THREE.Color(initialColor),
        map: this.baseTextures.diffuse, // Default white fabric texture
        normalMap: this.baseTextures.normal,
        normalScale: new THREE.Vector2(0.85, 0.85),
        roughnessMap: this.baseTextures.roughness,
        roughness: 0.88,
        metalness: 0.0,
        specularIntensityMap: this.baseTextures.specular,
        specularIntensity: 0.45,
        alphaMap: this.baseTextures.opacity,
        transparent: true,
        alphaTest: 0.02,
        depthWrite: true,
        side: THREE.DoubleSide,
        sheen: 0.55,
        sheenRoughness: 0.65,
        sheenColor: new THREE.Color(0xdde3ed),
        wireframe: false
      });

      this.injectFabricPhysicsShader(physicalMat);
      newMaterials.push(physicalMat);
    });

    this.materials = newMaterials;
    mesh.material = newMaterials.length === 1 ? newMaterials[0] : newMaterials;
    return newMaterials;
  }

  /**
   * Update base color in real-time preserving fabric normal details
   */
  setColor(hexColor: string): void {
    const color = new THREE.Color(hexColor);
    for (const mat of this.materials) {
      mat.color.copy(color);
      mat.needsUpdate = true;
    }
  }

  /**
   * Apply fabric preset parameters
   */
  applyFabricPreset(preset: FabricPreset): void {
    for (const mat of this.materials) {
      mat.roughness = preset.roughness;
      mat.sheen = preset.sheen;
      mat.sheenRoughness = preset.sheenRoughness;
      mat.sheenColor = new THREE.Color(preset.sheenColor);
      mat.normalScale = new THREE.Vector2(preset.normalScale, preset.normalScale);
      mat.needsUpdate = true;
    }
  }

  /**
   * Update fine-grain fabric parameters
   */
  updateFabricProperties(params: {
    roughness?: number;
    sheen?: number;
    normalScale?: number;
    wireframe?: boolean;
    repeat?: number;
    rotation?: number;
  }): void {
    for (const mat of this.materials) {
      if (params.roughness !== undefined) mat.roughness = params.roughness;
      if (params.sheen !== undefined) mat.sheen = params.sheen;
      if (params.normalScale !== undefined) {
        mat.normalScale = new THREE.Vector2(params.normalScale, params.normalScale);
      }
      if (params.wireframe !== undefined) mat.wireframe = params.wireframe;

      if (params.repeat !== undefined) {
        if (mat.map && mat.map.wrapS === THREE.RepeatWrapping) {
          mat.map.repeat.set(params.repeat, params.repeat);
        }
        if (mat.normalMap) mat.normalMap.repeat.set(params.repeat, params.repeat);
      }
      if (params.rotation !== undefined) {
        if (mat.map && mat.map.wrapS === THREE.RepeatWrapping) {
          mat.map.rotation = THREE.MathUtils.degToRad(params.rotation);
        }
        if (mat.normalMap) mat.normalMap.rotation = THREE.MathUtils.degToRad(params.rotation);
      }
      mat.needsUpdate = true;
    }
  }

  /**
   * Inject GPU vertex shader code for subtle secondary cloth movement and wave dynamics
   */
  public injectFabricPhysicsShader(material: THREE.MeshPhysicalMaterial): void {
    material.onBeforeCompile = (shader) => {
      shader.uniforms['uTime'] = this.customUniforms.uTime;
      shader.uniforms['uWindEnabled'] = this.customUniforms.uWindEnabled;
      shader.uniforms['uWindIntensity'] = this.customUniforms.uWindIntensity;
      shader.uniforms['uWindSpeed'] = this.customUniforms.uWindSpeed;
      shader.uniforms['uWindDirection'] = this.customUniforms.uWindDirection;
      shader.uniforms['uBoundsMin'] = this.customUniforms.uBoundsMin;
      shader.uniforms['uBoundsMax'] = this.customUniforms.uBoundsMax;
      shader.uniforms['uFabricIntensity'] = this.customUniforms.uFabricIntensity;
      shader.uniforms['uAngularVelocity'] = this.customUniforms.uAngularVelocity;
      shader.uniforms['uSway'] = this.customUniforms.uSway;

      shader.vertexShader = `
        uniform float uTime;
        uniform float uWindEnabled;
        uniform float uWindIntensity;
        uniform float uWindSpeed;
        uniform vec2 uWindDirection;
        uniform vec3 uBoundsMin;
        uniform vec3 uBoundsMax;
        uniform float uFabricIntensity;
        uniform float uAngularVelocity;
        uniform vec2 uSway;
        ${shader.vertexShader}
      `;

      const clothDisplacementCode = `
        #include <begin_vertex>

        if (uWindEnabled > 0.01 && uWindIntensity > 0.001) {
          // Normalize coordinates using actual geometry bounding box
          vec3 bMin = uBoundsMin;
          vec3 bSize = max(uBoundsMax - uBoundsMin, vec3(0.001));
          float normY = clamp((position.y - bMin.y) / bSize.y, 0.0, 1.0);
          float halfW = bSize.x * 0.5;
          float normAbsX = clamp(abs(position.x - (bMin.x + halfW)) / halfW, 0.0, 1.0);

          // 1. Bottom hem (normY 0.0 -> 0.38): highest natural freedom to sway
          float hemWeight = 1.0 - smoothstep(0.0, 0.38, normY);

          // 2. Sleeves (normAbsX > 0.42, normY between 0.30 and 0.85): natural sleeve flutter
          float sleeveWeight = smoothstep(0.42, 0.80, normAbsX) * smoothstep(0.28, 0.82, normY);

          // 3. Lower & mid torso: gentle organic breathing fabric waves
          float torsoWeight = (1.0 - smoothstep(0.12, 0.62, normY)) * (1.0 - smoothstep(normAbsX, 0.22, 0.52));

          // 4. Collar & Shoulder line: anatomical pinning (remains completely stable)
          float shoulderLine = smoothstep(0.68, 0.95, normY);
          float collarCenter = 1.0 - smoothstep(normAbsX, 0.10, 0.32);
          float pinFactor = clamp(shoulderLine * 0.92 + collarCenter * shoulderLine * 0.5, 0.0, 1.0);

          // Combined cloth flexibility: hem & sleeves move most, collar/shoulders stay pinned
          float clothFlex = clamp(hemWeight * 1.1 + sleeveWeight * 1.25 + torsoWeight * 0.55, 0.0, 1.0);
          clothFlex *= (1.0 - pinFactor * 0.96);

          // Multi-frequency organic wind simulation
          vec2 windDir = normalize(uWindDirection);
          float t = uTime * uWindSpeed;

          // Traveling wind gust wave along wind direction
          float spatialPhase = (position.x * windDir.x + position.z * windDir.y) * 2.8;
          float wave1 = sin(spatialPhase - t * 2.3) * 0.013;

          // Transverse ripple across fabric
          float wave2 = cos(position.y * 5.5 + position.x * 3.8 - t * 3.6) * 0.007;

          // Subtle fabric micro-crease wave
          float wave3 = sin(position.x * 9.0 + position.y * 7.5 + position.z * 11.0 + t * 4.9) * 0.003;

          // Aerodynamic sleeve edge flutter
          float sleeveFlutter = sin(position.x * 7.0 - t * 4.2) * 0.011 * sleeveWeight;

          // Natural bottom hem billow
          float hemBillow = (sin(position.x * 4.5 - t * 2.6) + cos(position.z * 4.0 - t * 3.1) * 0.5) * 0.012 * hemWeight;

          vec3 windDir3D = normalize(vec3(windDir.x, 0.08, windDir.y));
          float effectiveIntensity = uWindIntensity * (uFabricIntensity > 0.0 ? uFabricIntensity : 1.0);

          vec3 clothDisp = (
            windDir3D * (wave1 + hemBillow) +
            normal * (wave2 * 0.7 + wave3 * 1.1)
          ) * clothFlex * effectiveIntensity;

          clothDisp.x += sleeveFlutter * sign(position.x) * effectiveIntensity;
          clothDisp.y += abs(wave1 + hemBillow) * 0.22 * hemWeight * effectiveIntensity;

          transformed += clothDisp;
        }
      `;

      shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        clothDisplacementCode
      );
    };
  }

  /**
   * Swap the diffuse (base-color) texture in real-time.
   * Pass null to clear and revert to a solid color.
   */
  setDiffuseTexture(tex: THREE.Texture | null): void {
    for (const mat of this.materials) {
      mat.map = tex;
      mat.needsUpdate = true;
    }
  }

  getBaseNormalTexture(): THREE.Texture | null {
    return this.baseTextures.normal;
  }

  getMaterials(): THREE.MeshPhysicalMaterial[] {
    return this.materials;
  }

  disposeMaterials(): void {
    for (const mat of this.materials) {
      mat.dispose();
    }
    this.materials = [];
  }

  dispose(): void {
    this.disposeMaterials();
  }
}

