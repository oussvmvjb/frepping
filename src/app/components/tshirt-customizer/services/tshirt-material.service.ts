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
    uAngularVelocity: { value: 0 },
    uFabricIntensity: { value: 1.0 },
    uSway: { value: new THREE.Vector2(0, 0) }
  };

  /**
   * Initialize and register base textures
   */
  setBaseTextures(textures: {
    diffuse: THREE.Texture;
    normal: THREE.Texture;
    roughness: THREE.Texture;
    opacity: THREE.Texture;
    specular: THREE.Texture;
  }): void {
    this.baseTextures = textures;
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
        if (mat.map) mat.map.repeat.set(params.repeat, params.repeat);
        if (mat.normalMap) mat.normalMap.repeat.set(params.repeat, params.repeat);
      }
      if (params.rotation !== undefined) {
        if (mat.map) mat.map.rotation = THREE.MathUtils.degToRad(params.rotation);
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
      shader.uniforms['uAngularVelocity'] = this.customUniforms.uAngularVelocity;
      shader.uniforms['uFabricIntensity'] = this.customUniforms.uFabricIntensity;
      shader.uniforms['uSway'] = this.customUniforms.uSway;

      shader.vertexShader = `
        uniform float uTime;
        uniform float uAngularVelocity;
        uniform float uFabricIntensity;
        uniform vec2 uSway;
        ${shader.vertexShader}
      `;

      const clothDisplacementCode = `
        #include <begin_vertex>

        float sleeveWeight = smoothstep(0.35, 1.15, abs(position.x));
        float hemWeight = smoothstep(-0.2, -1.1, position.y);
        float shoulderHold = smoothstep(0.4, 0.9, position.y);

        float clothFlexibility = clamp((sleeveWeight * 1.15 + hemWeight * 0.85) * (1.0 - shoulderHold * 0.6), 0.0, 1.0);

        float rotationLag = -uAngularVelocity * 0.06 * clothFlexibility;
        float ripple1 = sin(uTime * 3.2 + position.y * 7.0 + position.x * 4.0) * 0.007 * clothFlexibility;
        float ripple2 = cos(uTime * 4.5 + position.x * 8.0) * 0.004 * sleeveWeight;
        float airLift = abs(uAngularVelocity) * 0.018 * hemWeight;

        vec3 fabricOffset = vec3(
          ripple2 + (uSway.x * 0.03 * clothFlexibility),
          airLift,
          rotationLag + ripple1 + (uSway.y * 0.03 * clothFlexibility)
        ) * uFabricIntensity;

        transformed += fabricOffset;
      `;

      shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        clothDisplacementCode
      );
    };
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

