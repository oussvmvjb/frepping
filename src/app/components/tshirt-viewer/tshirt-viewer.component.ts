import {
  Component,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  HostListener,
  ChangeDetectorRef,
  NgZone
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import {
  LiveClothEngine,
  ClothMeta,
  FabricId,
  SizeId,
  FitId,
  FABRIC_PHYSICS
} from '../tshirt-customizer/services/tshirt-live-cloth.engine';

export type PresetAngle = 'front' | 'back' | 'left' | 'right';
export type ModelQuality = 'glb' | 'high' | 'low';

@Component({
  selector: 'app-tshirt-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tshirt-viewer.component.html',
  styleUrls: ['./tshirt-viewer.component.scss']
})
export class TshirtViewerComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('containerRef', { static: true }) containerRef!: ElementRef<HTMLDivElement>;
  @ViewChild('canvasRef', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  // Asset configurations
  @Input() highModelPath = 'assets/t-shirt/Hi_T-shirt.fbx';
  @Input() lowModelPath = 'assets/t-shirt/Low_T-shirt.fbx';
  @Input() glbModelPath = 'assets/t-shirt/Hi_T-shirt_atlas.glb';
  @Input() texturesPath = 'assets/t-shirt/textures/';
  @Input() initialQuality: ModelQuality = 'glb';
  @Input() useGlbModel = true;

  // Interaction options
  @Input() autoRotate = true;
  @Input() autoRotateSpeed = 0.6;
  @Input() autoReturn = false; // Smoothly return to front after dragging stops
  @Input() autoReturnDelay = 2500; // ms before returning if autoReturn is true
  @Input() enableZoom = true;
  @Input() enableFabricPhysics = true;
  @Input() fabricIntensity = 1.0;
  @Input() showControls = true;
  @Input() minZoomDistance = 1.8;
  @Input() maxZoomDistance = 6.0;

  @Output() modelLoaded = new EventEmitter<{ quality: ModelQuality; vertexCount: number }>();
  @Output() loadError = new EventEmitter<string>();

  // UI state
  currentQuality: ModelQuality = 'glb';
  isLoading = true;
  loadingProgress = 0;
  loadingStep = 'Initializing 3D environment...';
  errorMessage: string | null = null;
  activeAngle: PresetAngle = 'front';
  isWireframe = false;
  vertexCount = 0;
  isInteracting = false;

  // Live Cloth Engine & Garment State
  clothEngine: LiveClothEngine | null = null;
  selectedFabric: FabricId = 'cotton';
  selectedSize: SizeId = 'L';
  selectedFit: FitId = 'regular';
  activeTexture: 'neon-waves' | 'white-cotton' = 'neon-waves';
  fabricPresetsList = Object.keys(FABRIC_PHYSICS) as FabricId[];
  sizesList: SizeId[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  fitsList: FitId[] = ['slim', 'regular', 'oversized'];

  // Three.js core
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private animationFrameId = 0;
  private resizeObserver?: ResizeObserver;
  private clock = new THREE.Clock();

  // 3D Objects & Hierarchy
  private mainGroup = new THREE.Group();
  private modelPivot = new THREE.Group();
  private tshirtMesh: THREE.Mesh | null = null;
  private contactShadow: THREE.Mesh | null = null;

  // Material & Textures cache
  private materials: THREE.MeshPhysicalMaterial[] = [];
  private textures: THREE.Texture[] = [];
  private customUniforms = {
    uTime: { value: 0 },
    uAngularVelocity: { value: 0 },
    uFabricIntensity: { value: 1.0 },
    uSway: { value: new THREE.Vector2(0, 0) }
  };

  // Interaction dynamics & physics state
  private isPointerDown = false;
  private previousPointerPos = { x: 0, y: 0 };
  private initialPinchDistance = 0;
  private lastInteractionTime = 0;

  // Angles & Motion (in radians)
  private currentAngleY = 0;
  private targetAngleY = 0;
  private currentAngleX = 0; // subtle pitch tilt (-0.25 to 0.25 rad)
  private targetAngleX = 0;

  private angularVelocity = 0;
  private lastAngleY = 0;

  // Camera zoom distance
  private currentCameraDist = 3.2;
  private targetCameraDist = 3.2;

  // Garment sway momentum
  private swayZ = 0;
  private swayX = 0;

  constructor(
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.currentQuality = this.initialQuality;
  }

  ngAfterViewInit(): void {
    // Run outside Angular zone to avoid triggering change detection on every RAF frame
    this.ngZone.runOutsideAngular(() => {
      this.initThree();
      this.initResizeObserver();
      this.initEventListeners();
      this.loadModelWithTextures(this.currentQuality);
      this.animate();
    });
  }

  ngOnDestroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }

    this.removeEventListeners();
    this.disposeScene();
  }

  /**
   * Initialize Three.js scene, camera, lights, and studio backdrop
   */
  private initThree(): void {
    const canvas = this.canvasRef.nativeElement;
    const container = this.containerRef.nativeElement;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = null; // Transparent canvas so container CSS gradient shines through

    // Camera
    this.camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    this.camera.position.set(0, 0, this.currentCameraDist);
    this.camera.lookAt(0, 0, 0);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;

    // Build hierarchy
    this.modelPivot.add(this.mainGroup);
    this.scene.add(this.modelPivot);

    // Studio Lighting
    this.setupStudioLighting();

    // Soft Contact Floor Shadow
    this.setupContactShadow();
  }

  /**
   * Professional 4-point studio lighting for realistic fabric presentation
   */
  private setupStudioLighting(): void {
    // Ambient / Hemisphere light for soft ambient environment bounce
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x3a3d45, 0.7);
    this.scene.add(hemiLight);

    // Key Light: warm, directional top-right
    const keyLight = new THREE.DirectionalLight(0xfffaf4, 1.4);
    keyLight.position.set(3.5, 4.5, 4.0);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 15;
    keyLight.shadow.bias = -0.0005;
    this.scene.add(keyLight);

    // Fill Light: cool, soft from left
    const fillLight = new THREE.DirectionalLight(0xecf3ff, 0.75);
    fillLight.position.set(-4.0, 2.5, 3.0);
    this.scene.add(fillLight);

    // Rim / Back Light: sharp highlight to define garment contours and weave
    const rimLight = new THREE.DirectionalLight(0xffffff, 1.3);
    rimLight.position.set(0, 3.5, -4.5);
    this.scene.add(rimLight);

    // Gentle Bottom Bounce Light
    const bounceLight = new THREE.DirectionalLight(0x404555, 0.35);
    bounceLight.position.set(0, -3.0, 1.5);
    this.scene.add(bounceLight);
  }

  /**
   * Procedural soft contact shadow plane under the garment
   */
  private setupContactShadow(): void {
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const ctx = shadowCanvas.getContext('2d')!;

    const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 120);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.5)');
    gradient.addColorStop(0.35, 'rgba(0, 0, 0, 0.28)');
    gradient.addColorStop(0.7, 'rgba(0, 0, 0, 0.08)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);

    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    const shadowGeo = new THREE.PlaneGeometry(2.4, 2.4);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      depthWrite: false,
      opacity: 0.75
    });

    this.contactShadow = new THREE.Mesh(shadowGeo, shadowMat);
    this.contactShadow.rotation.x = -Math.PI / 2;
    this.contactShadow.position.y = -1.45;
    this.scene.add(this.contactShadow);
    this.textures.push(shadowTexture);
  }

  /**
   * Load Model and textures with correct PBR mappings and color spaces
   */
  loadModelWithTextures(quality: ModelQuality): void {
    this.currentQuality = quality;
    this.isLoading = true;
    this.loadingProgress = 10;
    this.loadingStep = `Loading ${quality === 'high' ? 'High-Definition' : 'Performance'} T-Shirt...`;
    this.errorMessage = null;
    this.cdr.detectChanges();

    // Clean up existing model
    if (this.tshirtMesh) {
      this.mainGroup.remove(this.tshirtMesh);
      this.tshirtMesh.geometry.dispose();
      this.tshirtMesh = null;
    }

    const modelUrl = quality === 'high' ? this.highModelPath : this.lowModelPath;
    const textureLoader = new THREE.TextureLoader();

    // Texture file paths
    const basePath = this.texturesPath.endsWith('/') ? this.texturesPath : this.texturesPath + '/';
    const diffuseUrl = basePath + 'fabric-white.jpg'; // Default fabric texture
    const normalUrl = basePath + 'FuseModel_Body_Normal.png';
    const glossUrl = basePath + 'FuseModel_Body_Gloss.png';
    const opacityUrl = basePath + 'FuseModel_Body_Opacity.png';
    const specularUrl = basePath + 'FuseModel_Body_Specular.png';

    // Helper to load textures with progress tracking
    let loadedTexturesCount = 0;
    const totalTextures = 5;

    const onTextureLoad = () => {
      loadedTexturesCount++;
      this.loadingProgress = 10 + Math.round((loadedTexturesCount / totalTextures) * 40);
      this.loadingStep = `Loading texture maps (${loadedTexturesCount}/${totalTextures})...`;
      this.cdr.detectChanges();
    };

    const loadTexture = (url: string, isSRGB = false): Promise<THREE.Texture> => {
      return new Promise((resolve) => {
        textureLoader.load(
          url,
          (tex) => {
            tex.colorSpace = isSRGB ? THREE.SRGBColorSpace : THREE.NoColorSpace;
            tex.wrapS = THREE.RepeatWrapping;
            tex.wrapT = THREE.RepeatWrapping;
            tex.generateMipmaps = true;
            tex.minFilter = THREE.LinearMipmapLinearFilter;
            tex.magFilter = THREE.LinearFilter;
            this.textures.push(tex);
            onTextureLoad();
            resolve(tex);
          },
          undefined,
          (err) => {
            console.warn(`Could not load texture from ${url}`, err);
            onTextureLoad();
            // Create fallback 1x1 white texture
            const fallback = new THREE.DataTexture(new Uint8Array([255, 255, 255, 255]), 1, 1);
            fallback.needsUpdate = true;
            resolve(fallback);
          }
        );
      });
    };

    // Load textures in parallel
    Promise.all([
      loadTexture(diffuseUrl, true),
      loadTexture(normalUrl, false),
      loadTexture(glossUrl, false),
      loadTexture(opacityUrl, false),
      loadTexture(specularUrl, false)
    ])
      .then(([diffuseTex, normalTex, glossTex, opacityTex, specularTex]) => {
        this.loadingProgress = 55;
        this.loadingStep = 'Processing fabric PBR roughness & maps...';
        this.cdr.detectChanges();

        // Convert Gloss map to PBR Roughness map
        const roughnessTex = this.createRoughnessMapFromGloss(glossTex);
        this.textures.push(roughnessTex);

        // Load FBX Model
        const fbxLoader = new FBXLoader();
        this.loadingStep = 'Parsing FBX 3D Geometry...';

        fbxLoader.load(
          modelUrl,
          (fbx) => {
            this.setupFBXMesh(
              fbx,
              diffuseTex,
              normalTex,
              roughnessTex,
              opacityTex,
              specularTex
            );
          },
          (xhr) => {
            if (xhr.lengthComputable && xhr.total > 0) {
              const fbxProgress = Math.round((xhr.loaded / xhr.total) * 35);
              this.loadingProgress = 60 + fbxProgress;
              this.cdr.detectChanges();
            }
          },
          (err) => {
            console.error('FBX Load Error:', err);
            this.isLoading = false;
            this.errorMessage = `Failed to load 3D model: ${err.message || 'Unknown error'}. Please verify asset paths.`;
            this.loadError.emit(this.errorMessage);
            this.cdr.detectChanges();
          }
        );
      })
      .catch((err) => {
        console.error('Texture Load Error:', err);
        this.isLoading = false;
        this.errorMessage = `Error loading textures: ${err.message || 'Check asset folder'}`;
        this.loadError.emit(this.errorMessage);
        this.cdr.detectChanges();
      });
  }

  /**
   * Converts Gloss texture into realistic physical fabric Roughness map
   */
  private createRoughnessMapFromGloss(glossTex: THREE.Texture): THREE.Texture {
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
      // For cloth/cotton weave, roughness floor is ~0.45 to maintain soft matte fabric sheen
      for (let i = 0; i < data.length; i += 4) {
        const gloss = data[i] / 255.0;
        const clothRoughness = Math.min(0.98, Math.max(0.45, (1.0 - gloss) * 0.85 + 0.15));
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
      return roughnessTex;
    } catch (e) {
      console.warn('Roughness conversion skipped, using direct gloss map', e);
      return glossTex;
    }
  }

  /**
   * Set up FBX Mesh, apply materials, calculate center, and configure custom fabric shader
   */
  private setupFBXMesh(
    fbx: THREE.Group,
    diffuseTex: THREE.Texture,
    normalTex: THREE.Texture,
    roughnessTex: THREE.Texture,
    opacityTex: THREE.Texture,
    specularTex: THREE.Texture
  ): void {
    let foundMesh: THREE.Mesh | null = null;

    fbx.traverse((child) => {
      if ((child as THREE.Mesh).isMesh && !foundMesh) {
        foundMesh = child as THREE.Mesh;
      }
    });

    if (!foundMesh) {
      this.isLoading = false;
      this.errorMessage = 'No valid mesh found in the FBX file.';
      this.loadError.emit(this.errorMessage);
      this.cdr.detectChanges();
      return;
    }

    const mesh = foundMesh as THREE.Mesh;
    const geometry = mesh.geometry.clone();

    // Ensure normals and bounding box are computed
    geometry.computeVertexNormals();
    geometry.computeBoundingBox();

    // Center geometry to origin
    if (geometry.boundingBox) {
      const center = new THREE.Vector3();
      geometry.boundingBox.getCenter(center);
      geometry.center();

      // Normalize scale so height is ~2.4 units for ideal viewing
      const size = new THREE.Vector3();
      geometry.boundingBox.getSize(size);
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 2.4 / maxDim;
      geometry.scale(scale, scale, scale);
    }

    // Prepare PBR Materials for each material group (Collar, Base, Patch)
    this.disposeMaterials();

    const existingMats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    const newMaterials: THREE.MeshPhysicalMaterial[] = [];

    existingMats.forEach((oldMat, index) => {
      const matName = oldMat?.name || `Tshirt_Material_${index}`;

      const physicalMat = new THREE.MeshPhysicalMaterial({
        name: matName,
        color: new THREE.Color(0xffffff),
        map: diffuseTex,
        normalMap: normalTex,
        normalScale: new THREE.Vector2(0.85, 0.85),
        roughnessMap: roughnessTex,
        roughness: 0.88, // Natural soft cotton roughness
        metalness: 0.0,
        specularIntensityMap: specularTex,
        specularIntensity: 0.45,
        alphaMap: opacityTex,
        transparent: true,
        alphaTest: 0.02,
        depthWrite: true,
        side: THREE.DoubleSide, // Render inside and outside of sleeves/collar
        // Fabric sheen for micro-fiber edge luminosity
        sheen: 0.55,
        sheenRoughness: 0.6,
        sheenColor: new THREE.Color(0xdde3ed),
        wireframe: this.isWireframe
      });

      // Hook vertex shader for subtle, realistic GPU fabric physics
      this.injectFabricPhysicsShader(physicalMat);

      newMaterials.push(physicalMat);
    });

    this.materials = newMaterials;
    mesh.geometry = geometry;
    mesh.material = newMaterials.length === 1 ? newMaterials[0] : newMaterials;
    mesh.castShadow = true;
    mesh.receiveShadow = false;

    this.tshirtMesh = mesh;
    this.mainGroup.clear();
    this.mainGroup.add(this.tshirtMesh);

    // Update state
    this.vertexCount = geometry.attributes['position']?.count || 0;
    this.isLoading = false;
    this.loadingProgress = 100;
    this.modelLoaded.emit({
      quality: this.currentQuality,
      vertexCount: this.vertexCount
    });

    this.cdr.detectChanges();
  }

  /**
   * Injects GPU vertex shader code for subtle secondary cloth movement and wave dynamics
   */
  private injectFabricPhysicsShader(material: THREE.MeshPhysicalMaterial): void {
    material.onBeforeCompile = (shader) => {
      // Connect uniforms
      shader.uniforms['uTime'] = this.customUniforms.uTime;
      shader.uniforms['uAngularVelocity'] = this.customUniforms.uAngularVelocity;
      shader.uniforms['uFabricIntensity'] = this.customUniforms.uFabricIntensity;
      shader.uniforms['uSway'] = this.customUniforms.uSway;

      // Add uniform definitions at top of vertex shader
      shader.vertexShader = `
        uniform float uTime;
        uniform float uAngularVelocity;
        uniform float uFabricIntensity;
        uniform vec2 uSway;
        ${shader.vertexShader}
      `;

      // Inject subtle cloth inertia & ripple displacement
      const clothDisplacementCode = `
        #include <begin_vertex>

        // Calculate flexibility based on garment geometry (sleeves & bottom hem)
        // position is model-space (height normalized to ~2.4)
        float sleeveWeight = smoothstep(0.35, 1.15, abs(position.x)); // Sleeves outer edge
        float hemWeight = smoothstep(-0.2, -1.1, position.y);         // Bottom edge hem
        float shoulderHold = smoothstep(0.4, 0.9, position.y);        // Shoulders are stiffer

        float clothFlexibility = clamp((sleeveWeight * 1.15 + hemWeight * 0.85) * (1.0 - shoulderHold * 0.6), 0.0, 1.0);

        // Secondary organic cloth breathing ripple
        float ripple1 = sin(uTime * 2.8 + position.y * 6.0 + position.x * 3.5) * 0.006 * clothFlexibility;
        float ripple2 = cos(uTime * 4.2 + position.x * 7.0) * 0.003 * sleeveWeight;

        vec3 fabricOffset = vec3(
          ripple2 + (uSway.x * 0.015 * clothFlexibility),
          0.0,
          ripple1 + (uSway.y * 0.015 * clothFlexibility)
        ) * uFabricIntensity;

        transformed += fabricOffset;
      `;

      shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        clothDisplacementCode
      );
    };
  }

  /**
   * Main Render Loop with smooth inertia, auto-return, and garment physics
   */
  private animate = (): void => {
    this.animationFrameId = requestAnimationFrame(this.animate);

    const delta = Math.min(this.clock.getDelta(), 0.1);
    const elapsedTime = this.clock.getElapsedTime();
    const now = performance.now();

    // 1. Idle Turntable Auto-Rotation (if not interacting and not returning)
    if (this.autoRotate && !this.isInteracting && !this.autoReturn) {
      this.targetAngleY += delta * this.autoRotateSpeed;
    }

    // 2. Smooth Auto-Return to Initial Position (if enabled and user stopped interacting)
    if (this.autoReturn && !this.isInteracting && now - this.lastInteractionTime > this.autoReturnDelay) {
      // Spring back to 0 (front)
      this.targetAngleY += (0 - this.targetAngleY) * (delta * 2.5);
      this.targetAngleX += (0 - this.targetAngleX) * (delta * 2.5);
    }

    // 3. Smooth Damping (Lerp) towards target angles
    const rotSpeed = 1.0 - Math.exp(-12 * delta);
    this.currentAngleY += (this.targetAngleY - this.currentAngleY) * rotSpeed;
    this.currentAngleX += (this.targetAngleX - this.currentAngleX) * rotSpeed;

    // Calculate instantaneous angular velocity for secondary cloth physics
    const diffAngleY = this.currentAngleY - this.lastAngleY;
    this.angularVelocity = diffAngleY / (delta || 0.016);
    this.lastAngleY = this.currentAngleY;

    // 4. Secondary Garment Momentum & Tilt Sway
    // The shirt tilts slightly in response to rotational acceleration
    const targetSwayZ = -THREE.MathUtils.clamp(this.angularVelocity * 0.035, -0.15, 0.15);
    const targetSwayX = THREE.MathUtils.clamp(Math.abs(this.angularVelocity) * 0.015, 0, 0.08);

    this.swayZ += (targetSwayZ - this.swayZ) * (delta * 8.0);
    this.swayX += (targetSwayX - this.swayX) * (delta * 8.0);

    // Apply rotation and sway to pivot
    this.modelPivot.rotation.y = this.currentAngleY;
    this.modelPivot.rotation.x = this.currentAngleX + this.swayX;
    this.modelPivot.rotation.z = this.swayZ;

    // 5. Update Custom Fabric Shader Uniforms
    this.customUniforms.uTime.value = elapsedTime;
    this.customUniforms.uAngularVelocity.value = this.angularVelocity;
    this.customUniforms.uFabricIntensity.value = this.enableFabricPhysics ? this.fabricIntensity : 0.0;
    this.customUniforms.uSway.value.set(this.swayZ, this.swayX);

    // 6. Smooth Camera Zoom Interpolation
    const zoomSpeed = 1.0 - Math.exp(-10 * delta);
    this.currentCameraDist += (this.targetCameraDist - this.currentCameraDist) * zoomSpeed;
    this.camera.position.z = this.currentCameraDist;

    // Render frame
    this.renderer.render(this.scene, this.camera);
  };

  /**
   * Event Listeners for smooth mouse drag, touch gestures, and wheel zoom
   */
  private initEventListeners(): void {
    const el = this.containerRef.nativeElement;

    el.addEventListener('mousedown', this.onPointerDown, { passive: false });
    window.addEventListener('mousemove', this.onPointerMove, { passive: false });
    window.addEventListener('mouseup', this.onPointerUp);

    el.addEventListener('touchstart', this.onTouchStart, { passive: false });
    window.addEventListener('touchmove', this.onTouchMove, { passive: false });
    window.addEventListener('touchend', this.onTouchEnd);

    el.addEventListener('wheel', this.onWheel, { passive: false });
  }

  private removeEventListeners(): void {
    const el = this.containerRef.nativeElement;
    if (!el) return;

    el.removeEventListener('mousedown', this.onPointerDown);
    window.removeEventListener('mousemove', this.onPointerMove);
    window.removeEventListener('mouseup', this.onPointerUp);

    el.removeEventListener('touchstart', this.onTouchStart);
    window.removeEventListener('touchmove', this.onTouchMove);
    window.removeEventListener('touchend', this.onTouchEnd);

    el.removeEventListener('wheel', this.onWheel);
  }

  private onPointerDown = (e: MouseEvent): void => {
    if (e.button !== 0) return; // Primary left button only
    this.isPointerDown = true;
    this.isInteracting = true;
    this.lastInteractionTime = performance.now();
    this.previousPointerPos = { x: e.clientX, y: e.clientY };
  };

  private onPointerMove = (e: MouseEvent): void => {
    if (!this.isPointerDown) return;
    e.preventDefault();

    const deltaX = e.clientX - this.previousPointerPos.x;
    const deltaY = e.clientY - this.previousPointerPos.y;

    this.previousPointerPos = { x: e.clientX, y: e.clientY };
    this.lastInteractionTime = performance.now();

    // Horizontal rotation: Drag left -> rotate left, Drag right -> rotate right
    const sensitivity = 0.007;
    this.targetAngleY += deltaX * sensitivity;

    // Subtle vertical pitch tilt (clamped between -0.28 and 0.28 radians)
    this.targetAngleX = THREE.MathUtils.clamp(
      this.targetAngleX + deltaY * sensitivity * 0.5,
      -0.28,
      0.28
    );
  };

  private onPointerUp = (): void => {
    if (this.isPointerDown) {
      this.isPointerDown = false;
      this.isInteracting = false;
      this.lastInteractionTime = performance.now();
    }
  };

  private onTouchStart = (e: TouchEvent): void => {
    if (e.touches.length === 1) {
      this.isPointerDown = true;
      this.isInteracting = true;
      this.lastInteractionTime = performance.now();
      this.previousPointerPos = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      };
    } else if (e.touches.length === 2 && this.enableZoom) {
      // Pinch zoom start
      this.initialPinchDistance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
    }
  };

  private onTouchMove = (e: TouchEvent): void => {
    if (e.touches.length === 1 && this.isPointerDown) {
      e.preventDefault();
      const deltaX = e.touches[0].clientX - this.previousPointerPos.x;
      const deltaY = e.touches[0].clientY - this.previousPointerPos.y;

      this.previousPointerPos = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      };
      this.lastInteractionTime = performance.now();

      const sensitivity = 0.008;
      this.targetAngleY += deltaX * sensitivity;
      this.targetAngleX = THREE.MathUtils.clamp(
        this.targetAngleX + deltaY * sensitivity * 0.5,
        -0.28,
        0.28
      );
    } else if (e.touches.length === 2 && this.enableZoom) {
      e.preventDefault();
      const currentDistance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const diff = this.initialPinchDistance - currentDistance;
      this.targetCameraDist = THREE.MathUtils.clamp(
        this.targetCameraDist + diff * 0.01,
        this.minZoomDistance,
        this.maxZoomDistance
      );
      this.initialPinchDistance = currentDistance;
    }
  };

  private onTouchEnd = (e: TouchEvent): void => {
    if (e.touches.length === 0) {
      this.isPointerDown = false;
      this.isInteracting = false;
      this.lastInteractionTime = performance.now();
    }
  };

  private onWheel = (e: WheelEvent): void => {
    if (!this.enableZoom) return;
    e.preventDefault();

    const zoomStep = e.deltaY * 0.0025;
    this.targetCameraDist = THREE.MathUtils.clamp(
      this.targetCameraDist + zoomStep,
      this.minZoomDistance,
      this.maxZoomDistance
    );
  };

  /**
   * Responsive canvas resize handling
   */
  private initResizeObserver(): void {
    const container = this.containerRef.nativeElement;
    this.resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          this.camera.aspect = width / height;
          this.camera.updateProjectionMatrix();
          this.renderer.setSize(width, height);
        }
      }
    });

    this.resizeObserver.observe(container);
  }

  // ================= Public UI Control Actions =================

  setPresetAngle(angle: PresetAngle): void {
    this.activeAngle = angle;
    this.isInteracting = true;
    this.lastInteractionTime = performance.now();

    // Reset pitch
    this.targetAngleX = 0;

    switch (angle) {
      case 'front':
        this.targetAngleY = 0;
        break;
      case 'back':
        this.targetAngleY = Math.PI;
        break;
      case 'right':
        this.targetAngleY = Math.PI / 2;
        break;
      case 'left':
        this.targetAngleY = -Math.PI / 2;
        break;
    }

    // Wrap angle smoothly to prevent multi-revolution spinning
    const twoPi = Math.PI * 2;
    this.currentAngleY = this.currentAngleY % twoPi;
    let diff = (this.targetAngleY - this.currentAngleY) % twoPi;
    if (diff < -Math.PI) diff += twoPi;
    if (diff > Math.PI) diff -= twoPi;
    this.targetAngleY = this.currentAngleY + diff;

    setTimeout(() => {
      this.isInteracting = false;
    }, 800);
  }

  resetCamera(): void {
    this.setPresetAngle('front');
    this.targetCameraDist = 3.2;
    this.targetAngleX = 0;
  }

  toggleAutoRotate(): void {
    this.autoRotate = !this.autoRotate;
    this.cdr.detectChanges();
  }

  toggleFabricPhysics(): void {
    this.enableFabricPhysics = !this.enableFabricPhysics;
    this.cdr.detectChanges();
  }

  toggleWireframe(): void {
    this.isWireframe = !this.isWireframe;
    for (const mat of this.materials) {
      mat.wireframe = this.isWireframe;
      mat.needsUpdate = true;
    }
    this.cdr.detectChanges();
  }

  switchQuality(quality: ModelQuality): void {
    if (quality === this.currentQuality && !this.errorMessage) return;
    this.loadModelWithTextures(quality);
  }

  zoomIn(): void {
    this.targetCameraDist = Math.max(this.minZoomDistance, this.targetCameraDist - 0.4);
  }

  zoomOut(): void {
    this.targetCameraDist = Math.min(this.maxZoomDistance, this.targetCameraDist + 0.4);
  }

  retry(): void {
    this.loadModelWithTextures(this.currentQuality);
  }

  /**
   * Proper disposal to prevent WebGL memory leaks
   */
  private disposeMaterials(): void {
    for (const mat of this.materials) {
      mat.dispose();
    }
    this.materials = [];
  }

  private disposeScene(): void {
    this.disposeMaterials();

    for (const tex of this.textures) {
      tex.dispose();
    }
    this.textures = [];

    if (this.tshirtMesh) {
      this.tshirtMesh.geometry.dispose();
      this.tshirtMesh = null;
    }

    if (this.contactShadow) {
      this.contactShadow.geometry.dispose();
      (this.contactShadow.material as THREE.Material).dispose();
      this.contactShadow = null;
    }

    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.forceContextLoss();
    }
  }
}

