import {
  Component,
  ElementRef,
  Input,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ChangeDetectorRef,
  NgZone
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import {
  GarmentConfig,
  GarmentSize,
  FitStyle,
  ModelQuality,
  GarmentType,
  PresetAngle,
  CustomizerTab,
  DesignDecal,
  GarmentMeasurements,
  FabricPreset,
  SavedDesign,
  BodyMeasurements,
  AvatarFittingResult
} from './models/tshirt-customizer.models';

import {
  TshirtDeformationService,
  SIZE_PRESETS,
  FIT_MODIFIERS
} from './services/tshirt-deformation.service';
import { TshirtMaterialService } from './services/tshirt-material.service';
import { TshirtTextureService, FABRIC_PRESETS } from './services/tshirt-texture.service';
import { TshirtDesignService } from './services/tshirt-design.service';
import { TshirtPrintService } from './services/tshirt-print.service';
import { TshirtExportService } from './services/tshirt-export.service';
import { AvatarTryOnService } from './services/avatar-try-on.service';
import { TshirtFontService, CustomizerFont } from './services/tshirt-font.service';

@Component({
  selector: 'app-tshirt-customizer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tshirt-customizer.component.html',
  styleUrls: ['./tshirt-customizer.component.scss']
})
export class TshirtCustomizerComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('containerRef', { static: true }) containerRef!: ElementRef<HTMLDivElement>;
  @ViewChild('canvasRef', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('fileInputRef') fileInputRef!: ElementRef<HTMLInputElement>;
  @ViewChild('textureFileInputRef') textureFileInputRef!: ElementRef<HTMLInputElement>;

  // Asset configurations
  @Input() highModelPath = 'assets/t-shirt/Hi_T-shirt.fbx';
  @Input() lowModelPath = 'assets/t-shirt/Low_T-shirt.fbx';
  @Input() glbModelPath = 'assets/t-shirt/Hi_T-shirt_atlas.glb';
  @Input() useGlbModel = false;   // Default to Hi-Poly model (165k)
  @Input() texturesPath = 'assets/t-shirt/textures/';

  // Garment Active Model & Hoodie Assets
  @Input() activeGarment: GarmentType = 'tshirt';
  @Input() hoodieModelPath = 'assets/hoodie/hoodie.glb';
  @Input() hoodieFbxPath = 'assets/hoodie/hoodie.fbx';
  @Input() hoodieTexturesPath = 'assets/hoodie/';

  // UI Tabs & State
  activeTab: CustomizerTab = 'colors';
  tabs: { id: CustomizerTab; label: string; icon: string }[] = [
    { id: 'colors', label: 'Color', icon: 'palette' },
    { id: 'textures', label: 'Fabric Weave', icon: 'texture' },
    { id: 'designs', label: 'Artwork & Logo', icon: 'image' },
    { id: 'size', label: 'Size', icon: 'straighten' },
    { id: 'measurements', label: 'Measurements', icon: 'tune' },
    { id: 'fit', label: 'Fit Style', icon: 'checkroom' },
    { id: 'fabric', label: 'Material', icon: 'science' },
    { id: 'saved', label: 'Saved Designs', icon: 'bookmark' },
    { id: 'export', label: 'Export', icon: 'file_download' }
  ];

  // Mobile Responsive State
  isMobileFullscreen = false;

  // Garment Active Configuration State
  config: GarmentConfig = {
    version: '1.0',
    modelQuality: 'high',
    colorHex: '#ffffff',
    fabricPresetId: 'cotton',
    textureRepeat: 1.0,
    textureRotation: 0,
    size: 'L',
    fitStyle: 'regular',
    measurements: { ...SIZE_PRESETS.L },
    decals: [],
    wireframe: false,
    clothPhysicsEnabled: true,
    clothPhysicsIntensity: 1.0
  };

  // Color Swatches Palette
  colorPalette = [
    { name: 'Pure White', hex: '#ffffff' },
    { name: 'Onyx Black', hex: '#161618' },
    { name: 'Heather Grey', hex: '#8a8d93' },
    { name: 'Navy Blue', hex: '#1b2a4a' },
    { name: 'Royal Cobalt', hex: '#1d4ed8' },
    { name: 'Crimson Red', hex: '#dc2626' },
    { name: 'Sage Olive', hex: '#4d5d53' },
    { name: 'Sunset Coral', hex: '#f97316' },
    { name: 'Desert Sand', hex: '#d6c7b2' },
    { name: 'Dusty Lavender', hex: '#8b5cf6' }
  ];

  fabricPresets = FABRIC_PRESETS;
  activePreset: FabricPreset = FABRIC_PRESETS[0];

  // ── Texture Switcher (Default: Clean White Cotton) ────────────────────────
  textureSwatches: { id: string; label: string; thumb: string; url: string | null }[] = [
    {
      id: 'white-fabric',
      label: 'White Cotton',
      thumb: 'assets/t-shirt/textures/fabric-white.jpg',
      url: 'assets/t-shirt/textures/fabric-white.jpg'
    },
    {
      id: 'neon-waves',
      label: 'Neon Waves (Atlas)',
      thumb: 'assets/t-shirt/textures/fabric-neon-waves.jpg',
      url: 'assets/t-shirt/textures/fabric-neon-waves.jpg'
    },
    {
      id: 'solid',
      label: 'Solid Color',
      thumb: '',
      url: null
    }
  ];
  activeTextureId = 'white-fabric';
  private loadedSwatchTextures = new Map<string, THREE.Texture>();

  // Uploaded Custom Fabric Texture State
  isDraggingTextureFile = false;
  uploadedCustomTextureUrl: string | null = null;
  uploadedCustomTextureName = '';
  customTextureMode: 'atlas' | 'tile' = 'atlas';

  // Uploaded Decals / Logo Management & Text Stickers
  activeDecalIndex = -1;
  isDraggingFile = false;

  // Custom Text Sticker Studio
  artworkTab: 'text' | 'upload' = 'text';
  customText = 'FREPPING';
  selectedFont: CustomizerFont | null = null;
  textColor = '#39ff14';
  textStrokeColor = '#000000';
  textStrokeWidth = 6;
  textHasShadow = true;
  textPreviewDataUrl = '';
  isGeneratingText = false;
  fontCategoryFilter: 'all' | 'streetwear' | '3d' | 'graffiti' | 'bold' | 'techno' | 'script' = 'all';

  readonly textColorPresets: string[] = [
    '#ffffff', // Pure White
    '#39ff14', // Neon Green (Frepping)
    '#00ffff', // Cyber Cyan
    '#ff0055', // Hot Pink
    '#ffe600', // Electric Yellow
    '#ff6600', // Blaze Orange
    '#9900ff', // Cyber Purple
    '#000000', // Jet Black
    '#e2e8f0', // Silver
    '#d97706'  // Metallic Gold
  ];

  // Sizing & Measurements
  sizes: GarmentSize[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Custom'];
  fitStyles: { id: FitStyle; label: string; desc: string }[] = [
    { id: 'slim', label: 'Slim Fit', desc: 'Tapered waist, athletic contours, tailored silhouette' },
    { id: 'regular', label: 'Regular Fit', desc: 'Balanced classic drape, comfortable chest and sleeves' },
    { id: 'oversized', label: 'Oversized Fit', desc: 'Dropped shoulders, boxy street cut, relaxed chest' }
  ];

  // Virtual Fitting Simulation
  userBody: BodyMeasurements = {
    heightCm: 178,
    chestCircumferenceCm: 98,
    waistCircumferenceCm: 84,
    hipsCircumferenceCm: 96,
    shoulderWidthCm: 45,
    armLengthCm: 62,
    bodyType: 'average',
    gender: 'neutral'
  };
  fittingResult: AvatarFittingResult | null = null;

  // Saved Designs & Export
  designNameInput = 'My Custom Streetwear Tee';
  savedDesigns: SavedDesign[] = [];
  isExporting = false;
  exportSuccessMsg: string | null = null;

  // Viewport State
  isLoading = true;
  loadingProgress = 0;
  loadingStep = 'Initializing 3D workspace...';
  errorMessage: string | null = null;
  activeAngle: PresetAngle = 'front';
  autoRotate = false;
  vertexCount = 0;

  // Three.js Core
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private animationFrameId = 0;
  private resizeObserver?: ResizeObserver;
  private clock = new THREE.Clock();

  private mainGroup = new THREE.Group();
  private modelPivot = new THREE.Group();
  private tshirtMesh: THREE.Mesh | null = null;
  private contactShadow: THREE.Mesh | null = null;

  // Interaction dynamics
  private isPointerDown = false;
  private previousPointerPos = { x: 0, y: 0 };
  private initialPinchDist = 0;
  private isInteracting = false;
  private lastInteractionTime = 0;

  private currentAngleY = 0;
  private targetAngleY = 0;
  private currentAngleX = 0;
  private targetAngleX = 0;
  private angularVelocity = 0;
  private lastAngleY = 0;

  private currentCameraDist = 3.2;
  private targetCameraDist = 3.2;
  private swayZ = 0;
  private swayX = 0;

  constructor(
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    public deformationService: TshirtDeformationService,
    public materialService: TshirtMaterialService,
    public textureService: TshirtTextureService,
    public designService: TshirtDesignService,
    public printService: TshirtPrintService,
    public exportService: TshirtExportService,
    public tryOnService: AvatarTryOnService,
    public fontService: TshirtFontService
  ) {}

  ngOnInit(): void {
    this.savedDesigns = this.exportService.getSavedDesigns();
    this.updateFittingSimulation();
    this.updateTextureSwatchesForGarment();
    if (this.fontService.featuredFonts.length > 0) {
      this.selectedFont = this.fontService.featuredFonts[0];
      this.updateTextPreview();
    }
  }

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.initThree();
      this.initResizeObserver();
      this.initEventListeners();
      if (this.activeGarment === 'hoodie') {
        this.loadHoodieModel();
      } else {
        this.loadModelWithTextures('high');
      }
      this.animate();
    });
  }

  ngOnDestroy(): void {
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    if (this.resizeObserver) this.resizeObserver.disconnect();
    this.removeEventListeners();
    this.disposeThree();
  }

  /**
   * Initialize Three.js scene, camera, lights, and floor shadow
   */
  private initThree(): void {
    const canvas = this.canvasRef.nativeElement;
    const container = this.containerRef.nativeElement;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    this.camera.position.set(0, 0, this.currentCameraDist);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true // Required for snapshot captures and GLB export
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.08;

    this.modelPivot.add(this.mainGroup);
    this.scene.add(this.modelPivot);

    this.setupStudioLighting();
    this.setupContactShadow();
  }

  private setupStudioLighting(): void {
    // Hemisphere ambient light
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x333642, 0.75);
    this.scene.add(hemiLight);

    // Key light: warm directional
    const keyLight = new THREE.DirectionalLight(0xfffaf0, 1.4);
    keyLight.position.set(3.8, 4.5, 4.2);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    this.scene.add(keyLight);

    // Fill light: cool soft from left
    const fillLight = new THREE.DirectionalLight(0xe8f0fe, 0.8);
    fillLight.position.set(-4.2, 2.8, 3.2);
    this.scene.add(fillLight);

    // Rim back light: sharp silhouette definition
    const rimLight = new THREE.DirectionalLight(0xffffff, 1.35);
    rimLight.position.set(0, 3.5, -4.5);
    this.scene.add(rimLight);

    // Ground bounce
    const bounceLight = new THREE.DirectionalLight(0x4a4f5f, 0.35);
    bounceLight.position.set(0, -3.0, 1.5);
    this.scene.add(bounceLight);
  }

  private setupContactShadow(): void {
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const ctx = shadowCanvas.getContext('2d')!;

    const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 120);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0.52)');
    grad.addColorStop(0.35, 'rgba(0, 0, 0, 0.28)');
    grad.addColorStop(0.7, 'rgba(0, 0, 0, 0.08)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);

    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowGeo = new THREE.PlaneGeometry(2.4, 2.4);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.75
    });

    this.contactShadow = new THREE.Mesh(shadowGeo, shadowMat);
    this.contactShadow.rotation.x = -Math.PI / 2;
    this.contactShadow.position.y = -1.45;
    this.scene.add(this.contactShadow);
  }

  /**
   * Load FBX model and PBR texture channels
   */
  loadModelWithTextures(quality: ModelQuality): void {
    // Route to GLB loader when useGlbModel flag is set
    if (this.useGlbModel) {
      this.loadGlbModel();
      return;
    }

    this.config.modelQuality = 'high';
    this.isLoading = true;
    this.loadingProgress = 15;
    this.loadingStep = 'Loading High-Poly (165k) Garment Model...';
    this.errorMessage = null;
    this.cdr.detectChanges();

    if (this.tshirtMesh) {
      this.mainGroup.remove(this.tshirtMesh);
      this.tshirtMesh.geometry.dispose();
      this.tshirtMesh = null;
    }

    const modelUrl = this.highModelPath;
    const basePath = this.texturesPath.endsWith('/') ? this.texturesPath : this.texturesPath + '/';

    const diffuseUrl = basePath + 'fabric-white.jpg'; // Default white fabric texture
    const normalUrl = basePath + 'FuseModel_Body_Normal.png';
    const glossUrl = basePath + 'FuseModel_Body_Gloss.png';
    const opacityUrl = basePath + 'FuseModel_Body_Opacity.png';
    const specularUrl = basePath + 'FuseModel_Body_Specular.png';

    Promise.all([
      this.textureService.loadTexture(diffuseUrl, true),
      this.textureService.loadTexture(normalUrl, false),
      this.textureService.loadTexture(glossUrl, false),
      this.textureService.loadTexture(opacityUrl, false),
      this.textureService.loadTexture(specularUrl, false)
    ])
      .then(([diffuseTex, normalTex, glossTex, opacityTex, specularTex]) => {
        this.loadingProgress = 55;
        this.loadingStep = 'Generating PBR roughness & fabric channels...';
        this.cdr.detectChanges();

        const roughnessTex = this.textureService.createRoughnessFromGloss(glossTex);

        this.materialService.setBaseTextures({
          diffuse: diffuseTex,
          normal: normalTex,
          roughness: roughnessTex,
          opacity: opacityTex,
          specular: specularTex
        });

        const fbxLoader = new FBXLoader();
        this.loadingStep = 'Processing FBX geometry...';

        fbxLoader.load(
          modelUrl,
          (fbx) => {
            this.setupGarmentMesh(fbx);
          },
          (xhr) => {
            if (xhr.lengthComputable && xhr.total > 0) {
              this.loadingProgress = 60 + Math.round((xhr.loaded / xhr.total) * 35);
              this.cdr.detectChanges();
            }
          },
          (err) => {
            console.error('FBX Load Error:', err);
            this.isLoading = false;
            this.errorMessage = `Failed to load 3D model: ${err.message || 'Check asset paths'}`;
            this.cdr.detectChanges();
          }
        );
      })
      .catch((err) => {
        console.error('Texture load error:', err);
        this.isLoading = false;
        this.errorMessage = `Error loading textures: ${err.message || 'Check texture folder'}`;
        this.cdr.detectChanges();
      });
  }

  private setupGarmentMesh(fbx: THREE.Group): void {
    let foundMesh: THREE.Mesh | null = null;
    fbx.traverse((c) => {
      if ((c as THREE.Mesh).isMesh && !foundMesh) foundMesh = c as THREE.Mesh;
    });

    if (!foundMesh) {
      this.isLoading = false;
      this.errorMessage = 'No mesh found in FBX file';
      this.cdr.detectChanges();
      return;
    }

    const mesh = foundMesh as THREE.Mesh;
    const geometry = mesh.geometry.clone();

    // Preserve original raw UVs
    if (geometry.attributes['uv']) {
      geometry.userData['rawUV'] = (geometry.attributes['uv'] as THREE.BufferAttribute).clone();
      if (this.activeGarment === 'hoodie') {
        geometry.userData['atlasUV'] = (geometry.attributes['uv'] as THREE.BufferAttribute).clone();
      } else if (this.useGlbModel) {
        // The GLB has baked sewing-pattern atlas UVs
        geometry.userData['atlasUV'] = (geometry.attributes['uv'] as THREE.BufferAttribute).clone();
      } else {
        // Generate garment atlas UVs before center/scale so 3D coordinates reflect original FBX geometry
        const atlasUV = this.textureService.generateGarmentAtlasUV(geometry);
        geometry.userData['atlasUV'] = atlasUV;
      }

      if (this.activeTextureId === 'neon-waves' || this.useGlbModel || this.activeGarment === 'hoodie') {
        geometry.attributes['uv'] = geometry.userData['atlasUV'];
      }
    }

    geometry.computeVertexNormals();
    geometry.center();

    // Normalize model scale comfortably inside viewport (~1.82 units so it's smaller and nicely framed)
    geometry.computeBoundingBox();
    if (geometry.boundingBox) {
      const size = new THREE.Vector3();
      geometry.boundingBox.getSize(size);
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 1.82 / maxDim;
      geometry.scale(scale, scale, scale);
    }

    mesh.geometry = geometry;

    // Register mesh with deformation service to store base positions
    this.deformationService.registerMesh(mesh);

    // Create PBR materials with cloth vertex shader
    this.materialService.createMaterialsForMesh(mesh, this.config.colorHex);
    mesh.castShadow = true;
    mesh.receiveShadow = false;

    this.tshirtMesh = mesh;
    this.mainGroup.clear();
    this.mainGroup.add(this.tshirtMesh);

    // Register target mesh with print service for surface-conforming decals
    const normalTex = this.materialService.getBaseNormalTexture();
    this.printService.setTargetMesh(this.tshirtMesh, normalTex);

    // Re-apply active customizations (color, size, fit, decals, fabric)
    this.applyAllCustomizations();

    // Apply the active texture swatch (e.g. Neon Waves on Atlas GLB)
    const initialSwatch = this.textureSwatches.find((s) => s.id === this.activeTextureId) || this.textureSwatches[0];
    if (initialSwatch) {
      this.switchTexture(initialSwatch);
    }

    this.vertexCount = geometry.attributes['position']?.count || 0;
    this.isLoading = false;
    this.loadingProgress = 100;
    this.cdr.detectChanges();
  }

  /**
   * Load the GLB atlas model (Hi_T-shirt_atlas.glb) for testing.
   * Shares the same setupGarmentMesh pipeline after loading.
   */
  private loadGlbModel(): void {
    this.isLoading = true;
    this.loadingProgress = 10;
    this.loadingStep = 'Loading GLB Atlas Model...';
    this.errorMessage = null;
    this.cdr.detectChanges();

    if (this.tshirtMesh) {
      this.mainGroup.remove(this.tshirtMesh);
      this.tshirtMesh.geometry.dispose();
      this.tshirtMesh = null;
    }

    const basePath = this.texturesPath.endsWith('/') ? this.texturesPath : this.texturesPath + '/';
    const diffuseUrl = basePath + 'fabric-white.jpg';
    const normalUrl  = basePath + 'FuseModel_Body_Normal.png';
    const glossUrl   = basePath + 'FuseModel_Body_Gloss.png';
    const opacityUrl = basePath + 'FuseModel_Body_Opacity.png';
    const specularUrl = basePath + 'FuseModel_Body_Specular.png';

    // Load PBR textures in parallel with the GLB
    Promise.all([
      this.textureService.loadTexture(diffuseUrl, true).catch(() => null),
      this.textureService.loadTexture(normalUrl, false).catch(() => null),
      this.textureService.loadTexture(glossUrl, false).catch(() => null),
      this.textureService.loadTexture(opacityUrl, false).catch(() => null),
      this.textureService.loadTexture(specularUrl, false).catch(() => null)
    ]).then(([diffuseTex, normalTex, glossTex, opacityTex, specularTex]) => {
      this.loadingProgress = 45;
      this.loadingStep = 'Parsing GLB geometry...';
      this.cdr.detectChanges();

      const roughnessTex = glossTex
        ? this.textureService.createRoughnessFromGloss(glossTex as THREE.Texture)
        : null;

      if (diffuseTex) {
        this.materialService.setBaseTextures({
          diffuse: diffuseTex as THREE.Texture,
          normal: normalTex as THREE.Texture | null,
          roughness: roughnessTex,
          opacity: opacityTex as THREE.Texture | null,
          specular: specularTex as THREE.Texture | null
        });
      }

      const loader = new GLTFLoader();
      loader.load(
        this.glbModelPath,
        (gltf) => {
          this.loadingProgress = 80;
          this.loadingStep = 'Setting up GLB mesh...';
          this.cdr.detectChanges();

          // Find the first mesh in the GLB scene
          let foundMesh: THREE.Mesh | null = null;
          gltf.scene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh && !foundMesh) {
              foundMesh = child as THREE.Mesh;
            }
          });

          if (!foundMesh) {
            this.isLoading = false;
            this.errorMessage = 'No mesh found in GLB file';
            this.cdr.detectChanges();
            return;
          }

          // Reuse the same FBX setup pipeline — it clones & centers the geometry
          this.setupGarmentMesh(gltf.scene as unknown as THREE.Group);
        },
        (xhr) => {
          if (xhr.lengthComputable && xhr.total > 0) {
            this.loadingProgress = 45 + Math.round((xhr.loaded / xhr.total) * 35);
            this.cdr.detectChanges();
          }
        },
        (err) => {
          console.error('GLB Load Error:', err);
          this.isLoading = false;
          this.errorMessage = `Failed to load GLB model: ${(err as unknown as Error).message || 'Check asset path'}`;
          this.cdr.detectChanges();
        }
      );
    });
  }

  /**
   * Load the 3D Streetwear Hoodie Model & PBR Materials
   */
  loadHoodieModel(): void {
    this.activeGarment = 'hoodie';
    this.isLoading = true;
    this.loadingProgress = 15;
    this.loadingStep = 'Loading Streetwear Hoodie 3D Assets & PBR Materials...';
    this.errorMessage = null;
    this.cdr.detectChanges();

    if (this.tshirtMesh) {
      this.mainGroup.remove(this.tshirtMesh);
      this.tshirtMesh.geometry.dispose();
      this.tshirtMesh = null;
    }

    const basePath = this.hoodieTexturesPath.endsWith('/') ? this.hoodieTexturesPath : this.hoodieTexturesPath + '/';
    const diffuseUrl = basePath + 'texture_diffuse.png';
    const normalUrl = basePath + 'texture_normal.png';
    const roughnessUrl = basePath + 'texture_roughness.png';
    const metallicUrl = basePath + 'texture_metallic.png';

    Promise.all([
      this.textureService.loadTexture(diffuseUrl, true).catch(() => null),
      this.textureService.loadTexture(normalUrl, false).catch(() => null),
      this.textureService.loadTexture(roughnessUrl, false).catch(() => null),
      this.textureService.loadTexture(metallicUrl, false).catch(() => null)
    ]).then(([diffuseTex, normalTex, roughnessTex, metallicTex]) => {
      this.loadingProgress = 50;
      this.loadingStep = 'Parsing Hoodie 3D Geometry...';
      this.cdr.detectChanges();

      if (diffuseTex) {
        this.materialService.setBaseTextures({
          diffuse: diffuseTex,
          normal: normalTex,
          roughness: roughnessTex,
          opacity: null,
          specular: metallicTex
        });
      }

      const loader = new GLTFLoader();
      loader.load(
        this.hoodieModelPath,
        (gltf) => {
          this.loadingProgress = 85;
          this.loadingStep = 'Setting up Hoodie Mesh & Decals...';
          this.cdr.detectChanges();

          let foundMesh: THREE.Mesh | null = null;
          gltf.scene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh && !foundMesh) {
              foundMesh = child as THREE.Mesh;
            }
          });

          if (!foundMesh) {
            this.isLoading = false;
            this.errorMessage = 'No mesh found in Hoodie model';
            this.cdr.detectChanges();
            return;
          }

          const mesh = foundMesh as THREE.Mesh;
          mesh.updateMatrixWorld(true);
          const geometry = mesh.geometry.clone();
          // Apply node transform so hoodie stands upright Y-up
          geometry.applyMatrix4(mesh.matrixWorld);

          const group = new THREE.Group();
          const cleanMesh = new THREE.Mesh(geometry, mesh.material);
          group.add(cleanMesh);

          this.setupGarmentMesh(group);
        },
        (xhr) => {
          if (xhr.lengthComputable && xhr.total > 0) {
            this.loadingProgress = 50 + Math.round((xhr.loaded / xhr.total) * 40);
            this.cdr.detectChanges();
          }
        },
        (err) => {
          console.error('Hoodie GLB load failed, trying FBX fallback:', err);
          this.loadHoodieFbxFallback();
        }
      );
    }).catch((err) => {
      console.error('Hoodie texture load failed:', err);
      this.loadHoodieFbxFallback();
    });
  }

  private loadHoodieFbxFallback(): void {
    const fbxLoader = new FBXLoader();
    fbxLoader.load(
      this.hoodieFbxPath,
      (fbx) => {
        this.setupGarmentMesh(fbx);
      },
      undefined,
      (err) => {
        this.isLoading = false;
        this.errorMessage = `Failed to load Hoodie: ${err.message || 'Check asset paths'}`;
        this.cdr.detectChanges();
      }
    );
  }

  /**
   * Re-evaluates and applies all active customizations to the 3D model
   */
  applyAllCustomizations(): void {
    if (!this.tshirtMesh) return;

    // 1. Color
    this.materialService.setColor(this.config.colorHex);

    // 2. Fabric Preset
    const preset = this.fabricPresets.find((p) => p.id === this.config.fabricPresetId) || this.fabricPresets[0];
    this.activePreset = preset;
    this.materialService.applyFabricPreset(preset);

    // 3. Texture repeats & rotation
    this.materialService.updateFabricProperties({
      repeat: this.config.textureRepeat,
      rotation: this.config.textureRotation,
      wireframe: this.config.wireframe
    });

    // 4. Parametric Deformation (Size, Measurements, Fit Style)
    this.deformationService.applyDeformation(this.config.measurements);

    // 5. Decals / Logos
    this.printService.reprojectAll(this.config.decals);

    // 6. Virtual try-on simulation
    this.updateFittingSimulation();
  }

  // ================= UI Customization Actions =================

  setTab(tab: CustomizerTab): void {
    this.activeTab = tab;
    // On mobile, if in fullscreen mode, selecting a tab switches back to controls view
    if (this.isMobileFullscreen) {
      this.isMobileFullscreen = false;
    }
  }

  toggleMobileFullscreen(): void {
    this.isMobileFullscreen = !this.isMobileFullscreen;
    setTimeout(() => {
      if (this.containerRef?.nativeElement && this.renderer && this.camera) {
        const { clientWidth, clientHeight } = this.containerRef.nativeElement;
        this.camera.aspect = clientWidth / clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(clientWidth, clientHeight);
      }
    }, 150);
  }
  

  // --- Model / Garment Switching ---
  toggleGarment(): void {
    this.switchGarment(this.activeGarment === 'tshirt' ? 'hoodie' : 'tshirt');
  }

  switchGarment(type: GarmentType): void {
    if (this.activeGarment === type && !this.errorMessage) return;
    this.activeGarment = type;
    this.config.garmentType = type;
    this.updateTextureSwatchesForGarment();

    if (type === 'hoodie') {
      this.loadHoodieModel();
    } else {
      this.useGlbModel = false;
      this.config.modelQuality = 'high';
      this.loadModelWithTextures('high');
    }
  }

  updateTextureSwatchesForGarment(): void {
    if (this.activeGarment === 'hoodie') {
      this.textureSwatches = [
        {
          id: 'white-fabric',
          label: 'Clean White',
          thumb: 'assets/t-shirt/textures/fabric-white.jpg',
          url: 'assets/t-shirt/textures/fabric-white.jpg'
        },
        {
          id: 'hoodie-default',
          label: 'Original Fleece',
          thumb: 'assets/hoodie/texture_diffuse.png',
          url: 'assets/hoodie/texture_diffuse.png'
        },
        {
          id: 'neon-waves',
          label: 'Neon Streetwear',
          thumb: 'assets/t-shirt/textures/fabric-neon-waves.jpg',
          url: 'assets/t-shirt/textures/fabric-neon-waves.jpg'
        },
        {
          id: 'solid',
          label: 'Solid Color',
          thumb: '',
          url: null
        }
      ];
      this.activeTextureId = 'white-fabric';
    } else {
      this.textureSwatches = [
        {
          id: 'white-fabric',
          label: 'White Cotton',
          thumb: 'assets/t-shirt/textures/fabric-white.jpg',
          url: 'assets/t-shirt/textures/fabric-white.jpg'
        },
        {
          id: 'neon-waves',
          label: 'Neon Waves (Atlas)',
          thumb: 'assets/t-shirt/textures/fabric-neon-waves.jpg',
          url: 'assets/t-shirt/textures/fabric-neon-waves.jpg'
        },
        {
          id: 'solid',
          label: 'Solid Color',
          thumb: '',
          url: null
        }
      ];
      this.activeTextureId = 'white-fabric';
    }
  }

  // --- 1. Color ---
  onColorChange(newColor: string): void {
    this.config.colorHex = newColor;
    this.materialService.setColor(newColor);
  }

  // --- 2. Textures / Fabric Weaves ---
  selectFabricPreset(preset: FabricPreset): void {
    this.config.fabricPresetId = preset.id;
    this.activePreset = preset;
    this.materialService.applyFabricPreset(preset);
    const normalTex = this.materialService.getBaseNormalTexture();
    this.printService.setFabricNormalMap(normalTex);
  }

  /** Switch the full-body diffuse texture from a swatch click */
  switchTexture(swatch: { id: string; label: string; thumb: string; url: string | null }): void {
    this.activeTextureId = swatch.id;

    if (!swatch.url) {
      // Solid color mode — clear diffuse map
      if (this.tshirtMesh && this.tshirtMesh.geometry?.userData['rawUV']) {
        this.tshirtMesh.geometry.attributes['uv'] = this.tshirtMesh.geometry.userData['rawUV'];
        this.tshirtMesh.geometry.attributes['uv'].needsUpdate = true;
      }
      this.materialService.setDiffuseTexture(null);
      return;
    }

    const isAtlas = swatch.id === 'neon-waves' || swatch.id === 'hoodie-default' || (swatch.id === 'custom-upload' && this.customTextureMode === 'atlas');

    // Switch geometry UV attribute to match the texture format
    if (this.tshirtMesh && this.tshirtMesh.geometry) {
      const geom = this.tshirtMesh.geometry;
      if (isAtlas && geom.userData['atlasUV']) {
        geom.attributes['uv'] = geom.userData['atlasUV'];
        geom.attributes['uv'].needsUpdate = true;
        // Reset base color to pure white so vivid neon artwork renders at full natural brightness
        this.config.colorHex = '#ffffff';
        this.materialService.setColor('#ffffff');
      } else if (geom.userData['rawUV']) {
        geom.attributes['uv'] = geom.userData['rawUV'];
        geom.attributes['uv'].needsUpdate = true;
      }
    }

    // Return cached texture if already loaded
    if (this.loadedSwatchTextures.has(swatch.id)) {
      const tex = this.loadedSwatchTextures.get(swatch.id)!;
      if (isAtlas) {
        tex.wrapS = THREE.ClampToEdgeWrapping;
        tex.wrapT = THREE.ClampToEdgeWrapping;
        tex.repeat.set(1, 1);
        tex.offset.set(0, 0);
      }
      this.materialService.setDiffuseTexture(tex);
      return;
    }

    // Load fresh, cache, then apply
    const loader = new THREE.TextureLoader();
    loader.load(
      swatch.url,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = 8;
        if (isAtlas) {
          tex.wrapS = THREE.ClampToEdgeWrapping;
          tex.wrapT = THREE.ClampToEdgeWrapping;
          tex.repeat.set(1, 1);
          tex.offset.set(0, 0);
        } else {
          tex.wrapS = THREE.RepeatWrapping;
          tex.wrapT = THREE.RepeatWrapping;
        }
        this.loadedSwatchTextures.set(swatch.id, tex);
        this.materialService.setDiffuseTexture(tex);
      },
      undefined,
      (err) => console.warn('Texture swatch load failed:', err)
    );
  }

  onTextureRepeatChange(repeat: number): void {
    this.config.textureRepeat = repeat;
    this.materialService.updateFabricProperties({ repeat });
  }

  onTextureRotationChange(rotation: number): void {
    this.config.textureRotation = rotation;
    this.materialService.updateFabricProperties({ rotation });
  }

  onNormalScaleChange(normalScale: number): void {
    this.config.fabricCustomNormalScale = normalScale;
    this.materialService.updateFabricProperties({ normalScale });
  }

  // ── Upload Custom Fabric Texture ──────────────────────────────────────────
  triggerTextureFileInput(): void {
    if (this.textureFileInputRef?.nativeElement) {
      this.textureFileInputRef.nativeElement.click();
    }
  }

  onTextureFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.processTextureFile(input.files[0]);
    }
  }

  onTextureFileDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDraggingTextureFile = false;
    if (event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
      this.processTextureFile(event.dataTransfer.files[0]);
    }
  }

  private processTextureFile(file: File): void {
    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        // Auto-detect if image is a 16:9 sewing atlas (aspect > 1.4) or square/tileable pattern
        const aspect = img.width && img.height ? img.width / img.height : 1.0;
        this.customTextureMode = aspect > 1.35 ? 'atlas' : 'tile';

        this.uploadedCustomTextureUrl = dataUrl;
        this.uploadedCustomTextureName = file.name;

        // Upsert custom swatch into textureSwatches list
        const customSwatch = {
          id: 'custom-upload',
          label: file.name.replace(/\.[^/.]+$/, '').slice(0, 14),
          thumb: dataUrl,
          url: dataUrl
        };

        // Clear any previous cached instance so the new upload applies immediately
        this.loadedSwatchTextures.delete('custom-upload');

        const existingIdx = this.textureSwatches.findIndex((s) => s.id === 'custom-upload');
        if (existingIdx >= 0) {
          this.textureSwatches[existingIdx] = customSwatch;
        } else {
          // Insert after white-fabric and neon-waves
          this.textureSwatches.splice(2, 0, customSwatch);
        }

        // Apply immediately
        this.switchTexture(customSwatch);
        this.cdr.detectChanges();
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  }

  setCustomTextureMode(mode: 'atlas' | 'tile'): void {
    this.customTextureMode = mode;
    const customSwatch = this.textureSwatches.find((s) => s.id === 'custom-upload');
    if (customSwatch && this.activeTextureId === 'custom-upload') {
      // Re-apply with the chosen mode
      this.switchTexture(customSwatch);
      if (mode === 'tile') {
        this.materialService.updateFabricProperties({
          repeat: this.config.textureRepeat,
          rotation: this.config.textureRotation
        });
      }
    }
  }

  removeCustomTexture(): void {
    this.uploadedCustomTextureUrl = null;
    this.uploadedCustomTextureName = '';
    this.loadedSwatchTextures.delete('custom-upload');
    this.textureSwatches = this.textureSwatches.filter((s) => s.id !== 'custom-upload');

    // Revert to default white cotton
    const whiteSwatch = this.textureSwatches.find((s) => s.id === 'white-fabric') || this.textureSwatches[0];
    this.switchTexture(whiteSwatch);
    this.cdr.detectChanges();
  }

  // --- 3. Upload Artwork & Decals ---
  triggerFileInput(): void {
    this.fileInputRef.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.handleImageFile(input.files[0]);
    }
  }

  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDraggingFile = false;
    if (event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
      this.handleImageFile(event.dataTransfer.files[0]);
    }
  }

  private handleImageFile(file: File): void {
    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const aspect = img.width && img.height ? img.width / img.height : 1.0;
        const baseWidth = 22.0;
        const baseHeight = Math.round((baseWidth / aspect) * 10) / 10;

        const newDecal: DesignDecal = {
          id: 'decal_' + Date.now(),
          name: file.name.replace(/\.[^/.]+$/, ''),
          dataUrl,
          image: img,
          side: 'front',
          x: 0,
          y: 0,
          scale: 1.0,
          widthCm: baseWidth,
          heightCm: baseHeight,
          aspectRatio: aspect,
          lockAspectRatio: true,
          rotation: 0,
          opacity: 1.0,
          zIndex: this.config.decals.length + 1
        };

        this.config.decals.push(newDecal);
        this.activeDecalIndex = this.config.decals.length - 1;
        this.printService.applyPrint(newDecal, this.config.decals.length - 1);
        this.cdr.detectChanges();
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  }

  selectDecal(index: number): void {
    this.activeDecalIndex = index;
    const decal = this.getActiveDecal();
    if (decal && decal.isTextDecal && decal.textContent) {
      this.customText = decal.textContent;
      if (decal.textColor) this.textColor = decal.textColor;
      if (decal.strokeColor) this.textStrokeColor = decal.strokeColor;
      if (decal.strokeWidth !== undefined) this.textStrokeWidth = decal.strokeWidth;
      const matchedFont = this.fontService.featuredFonts.find(
        (f) => f.fontFamily === decal.fontFamily
      );
      if (matchedFont) {
        this.selectedFont = matchedFont;
      }
      this.updateTextPreview();
    }
  }

  getActiveDecal(): DesignDecal | null {
    if (this.activeDecalIndex >= 0 && this.config.decals[this.activeDecalIndex]) {
      return this.config.decals[this.activeDecalIndex];
    }
    return null;
  }

  updateActiveDecal(): void {
    if (this.activeDecalIndex >= 0 && this.config.decals[this.activeDecalIndex]) {
      const decal = this.config.decals[this.activeDecalIndex];
      this.printService.applyPrint(decal, this.activeDecalIndex);
    }
  }

  removeActiveDecal(): void {
    if (this.activeDecalIndex >= 0 && this.config.decals[this.activeDecalIndex]) {
      const decal = this.config.decals[this.activeDecalIndex];
      this.printService.removeDecal(decal.id);
      this.config.decals.splice(this.activeDecalIndex, 1);
      this.activeDecalIndex = this.config.decals.length > 0 ? 0 : -1;
      this.cdr.detectChanges();
    }
  }

  onDecalWidthChange(width: number): void {
    const decal = this.getActiveDecal();
    if (!decal) return;
    decal.widthCm = width;
    if (decal.lockAspectRatio && decal.aspectRatio) {
      decal.heightCm = Math.round((width / decal.aspectRatio) * 10) / 10;
    }
    decal.scale = Math.round((width / 22.0) * 100) / 100;
    this.updateActiveDecal();
  }

  onDecalHeightChange(height: number): void {
    const decal = this.getActiveDecal();
    if (!decal) return;
    decal.heightCm = height;
    if (decal.lockAspectRatio && decal.aspectRatio) {
      decal.widthCm = Math.round((height * decal.aspectRatio) * 10) / 10;
      decal.scale = Math.round((decal.widthCm / 22.0) * 100) / 100;
    }
    this.updateActiveDecal();
  }

  onDecalScaleChange(scale: number): void {
    const decal = this.getActiveDecal();
    if (!decal) return;
    decal.scale = scale;
    if (decal.lockAspectRatio && decal.aspectRatio) {
      decal.widthCm = Math.round(22.0 * scale * 10) / 10;
      decal.heightCm = Math.round((decal.widthCm / decal.aspectRatio) * 10) / 10;
    }
    this.updateActiveDecal();
  }

  toggleAspectRatioLock(): void {
    const decal = this.getActiveDecal();
    if (!decal) return;
    decal.lockAspectRatio = !decal.lockAspectRatio;
    this.cdr.detectChanges();
  }

  centerActiveDecal(): void {
    const decal = this.getActiveDecal();
    if (!decal) return;
    this.printService.centerDesign(decal);
    this.cdr.detectChanges();
  }

  resetActiveDecalPosition(): void {
    const decal = this.getActiveDecal();
    if (!decal) return;
    this.printService.resetDesign(decal);
    this.cdr.detectChanges();
  }

  bringActiveDecalForward(): void {
    const decal = this.getActiveDecal();
    if (!decal) return;
    this.printService.bringForward(decal.id, this.config.decals);
    this.activeDecalIndex = this.config.decals.findIndex((d) => d.id === decal.id);
    this.cdr.detectChanges();
  }

  sendActiveDecalBackward(): void {
    const decal = this.getActiveDecal();
    if (!decal) return;
    this.printService.sendBackward(decal.id, this.config.decals);
    this.activeDecalIndex = this.config.decals.findIndex((d) => d.id === decal.id);
    this.cdr.detectChanges();
  }

  // --- Text Sticker Studio & Rotation / Scale Helpers ---
  get filteredFonts(): CustomizerFont[] {
    if (this.fontCategoryFilter === 'all') {
      return this.fontService.featuredFonts;
    }
    return this.fontService.featuredFonts.filter(
      (f) => f.category === this.fontCategoryFilter
    );
  }

  async selectFont(font: CustomizerFont): Promise<void> {
    this.selectedFont = font;
    await this.fontService.ensureFontLoaded(font.fontFamily, font.url);
    await this.updateTextPreview();
    const active = this.getActiveDecal();
    if (active && active.isTextDecal) {
      active.fontFamily = font.fontFamily;
      await this.updateActiveTextDecal();
    }
  }

  async updateTextPreview(): Promise<void> {
    if (!this.selectedFont || !this.customText.trim()) {
      this.textPreviewDataUrl = '';
      return;
    }
    try {
      this.isGeneratingText = true;
      const res = await this.fontService.renderTextSticker({
        text: this.customText,
        fontFamily: this.selectedFont.fontFamily,
        fontUrl: this.selectedFont.url,
        textColor: this.textColor,
        strokeColor: this.textStrokeWidth > 0 ? this.textStrokeColor : undefined,
        strokeWidth: this.textStrokeWidth,
        shadow: this.textHasShadow
      });
      this.textPreviewDataUrl = res.dataUrl;
    } catch (e) {
      console.warn('Text preview render error:', e);
    } finally {
      this.isGeneratingText = false;
      this.cdr.detectChanges();
    }
  }

  async onTextParamChange(): Promise<void> {
    await this.updateTextPreview();
    const active = this.getActiveDecal();
    if (active && active.isTextDecal) {
      await this.updateActiveTextDecal();
    }
  }

  async addTextSticker(): Promise<void> {
    if (!this.selectedFont || !this.customText.trim()) return;

    this.isGeneratingText = true;
    try {
      const res = await this.fontService.renderTextSticker({
        text: this.customText,
        fontFamily: this.selectedFont.fontFamily,
        fontUrl: this.selectedFont.url,
        textColor: this.textColor,
        strokeColor: this.textStrokeWidth > 0 ? this.textStrokeColor : undefined,
        strokeWidth: this.textStrokeWidth,
        shadow: this.textHasShadow
      });

      const img = new Image();
      img.onload = () => {
        const aspect = res.aspectRatio || (res.width / res.height);
        const baseWidth = Math.min(32.0, Math.max(14.0, this.customText.length * 2.2));
        const baseHeight = Math.round((baseWidth / aspect) * 10) / 10;

        const newDecal: DesignDecal = {
          id: 'text_decal_' + Date.now(),
          name: `Text: "${this.customText}"`,
          dataUrl: res.dataUrl,
          image: img,
          side: 'front',
          x: 0,
          y: 0.12,
          scale: 1.0,
          widthCm: baseWidth,
          heightCm: baseHeight,
          aspectRatio: aspect,
          lockAspectRatio: true,
          rotation: 0,
          opacity: 1.0,
          zIndex: this.config.decals.length + 1,
          isTextDecal: true,
          textContent: this.customText,
          fontFamily: this.selectedFont?.fontFamily,
          textColor: this.textColor,
          strokeColor: this.textStrokeColor,
          strokeWidth: this.textStrokeWidth
        };

        this.config.decals.push(newDecal);
        this.activeDecalIndex = this.config.decals.length - 1;
        this.printService.applyPrint(newDecal, this.activeDecalIndex);
        this.cdr.detectChanges();
      };
      img.src = res.dataUrl;
    } finally {
      this.isGeneratingText = false;
      this.cdr.detectChanges();
    }
  }

  async updateActiveTextDecal(): Promise<void> {
    const decal = this.getActiveDecal();
    if (!decal || !decal.isTextDecal || !this.selectedFont) return;

    decal.textContent = this.customText;
    decal.fontFamily = this.selectedFont.fontFamily;
    decal.textColor = this.textColor;
    decal.strokeColor = this.textStrokeColor;
    decal.strokeWidth = this.textStrokeWidth;
    decal.name = `Text: "${this.customText}"`;

    const res = await this.fontService.renderTextSticker({
      text: this.customText,
      fontFamily: this.selectedFont.fontFamily,
      fontUrl: this.selectedFont.url,
      textColor: this.textColor,
      strokeColor: this.textStrokeWidth > 0 ? this.textStrokeColor : undefined,
      strokeWidth: this.textStrokeWidth,
      shadow: this.textHasShadow
    });

    const img = new Image();
    img.onload = () => {
      decal.dataUrl = res.dataUrl;
      decal.image = img;
      decal.aspectRatio = res.aspectRatio;
      if (decal.lockAspectRatio && decal.widthCm) {
        decal.heightCm = Math.round((decal.widthCm / res.aspectRatio) * 10) / 10;
      }
      this.printService.applyPrint(decal, this.activeDecalIndex);
      this.cdr.detectChanges();
    };
    img.src = res.dataUrl;
  }

  rotateActiveDecalBy(deltaDegrees: number): void {
    const decal = this.getActiveDecal();
    if (!decal) return;
    let newRot = (decal.rotation || 0) + deltaDegrees;
    while (newRot > 180) newRot -= 360;
    while (newRot < -180) newRot += 360;
    decal.rotation = Math.round(newRot);
    this.updateActiveDecal();
    this.cdr.detectChanges();
  }

  setDecalRotation(angle: number): void {
    const decal = this.getActiveDecal();
    if (!decal) return;
    decal.rotation = angle;
    this.updateActiveDecal();
    this.cdr.detectChanges();
  }

  setDecalScalePreset(scale: number): void {
    const decal = this.getActiveDecal();
    if (!decal) return;
    this.onDecalScaleChange(scale);
    this.cdr.detectChanges();
  }

  // --- 4. Size ---
  selectSize(size: GarmentSize): void {
    this.config.size = size;
    const effective = this.deformationService.getEffectiveMeasurements(size, this.config.fitStyle);
    this.config.measurements = { ...effective };
    this.deformationService.applyDeformation(this.config.measurements);
    this.printService.reprojectAll(this.config.decals);
    this.updateFittingSimulation();
  }

  // --- 5. Measurements ---
  onMeasurementChange(): void {
    this.config.size = 'Custom';
    this.deformationService.applyDeformation(this.config.measurements);
    this.printService.reprojectAll(this.config.decals);
    this.updateFittingSimulation();
  }

  resetMeasurements(): void {
    this.selectSize(this.config.size === 'Custom' ? 'L' : this.config.size);
  }

  // --- 6. Fit Style ---
  selectFitStyle(fit: FitStyle): void {
    this.config.fitStyle = fit;
    const effective = this.deformationService.getEffectiveMeasurements(this.config.size, fit);
    this.config.measurements = { ...effective };
    this.deformationService.applyDeformation(this.config.measurements);
    this.printService.reprojectAll(this.config.decals);
    this.updateFittingSimulation();
  }

  // --- 7. Fabric Material Fine-Tuning ---
  onRoughnessChange(roughness: number): void {
    this.config.fabricCustomRoughness = roughness;
    this.materialService.updateFabricProperties({ roughness });
  }

  onSheenChange(sheen: number): void {
    this.config.fabricCustomSheen = sheen;
    this.materialService.updateFabricProperties({ sheen });
  }

  toggleWireframe(): void {
    this.config.wireframe = !this.config.wireframe;
    this.materialService.updateFabricProperties({ wireframe: this.config.wireframe });
  }

  toggleClothPhysics(): void {
    this.config.clothPhysicsEnabled = !this.config.clothPhysicsEnabled;
  }

  // --- 8. Virtual Fitting / Try-On Simulation ---
  updateFittingSimulation(): void {
    this.fittingResult = this.tryOnService.evaluateFit(this.userBody, this.config.measurements);
  }

  applyRecommendedSize(): void {
    if (this.fittingResult) {
      this.selectSize(this.fittingResult.recommendedSize);
    }
  }

  // --- 9. Saved Designs & Export ---
  saveCurrentDesign(): void {
    this.config.garmentType = this.activeGarment;
    const preview = this.exportService.captureCanvasImage(this.renderer, this.scene, this.camera);
    const saved = this.exportService.saveDesign(this.designNameInput, this.config, preview);
    this.savedDesigns.unshift(saved);
    this.exportSuccessMsg = `"${saved.name}" saved successfully!`;
    setTimeout(() => (this.exportSuccessMsg = null), 3500);
    this.cdr.detectChanges();
  }

  loadSavedDesign(design: SavedDesign): void {
    this.config = JSON.parse(JSON.stringify(design.config));
    this.designNameInput = design.name;
    const targetGarment = design.config.garmentType || 'tshirt';
    if (targetGarment !== this.activeGarment) {
      this.switchGarment(targetGarment);
    } else {
      this.applyAllCustomizations();
    }
    this.exportSuccessMsg = `Loaded "${design.name}"`;
    setTimeout(() => (this.exportSuccessMsg = null), 3500);
    this.cdr.detectChanges();
  }

  deleteSavedDesign(id: string): void {
    this.exportService.deleteSavedDesign(id);
    this.savedDesigns = this.savedDesigns.filter((d) => d.id !== id);
  }

  exportGLB(): void {
    this.isExporting = true;
    const filename = `${this.designNameInput.toLowerCase().replace(/\s+/g, '-')}.glb`;
    this.exportService
      .exportAsGLB(this.mainGroup, filename)
      .then(() => {
        this.isExporting = false;
        this.exportSuccessMsg = `Exported ${filename} successfully!`;
        setTimeout(() => (this.exportSuccessMsg = null), 4000);
        this.cdr.detectChanges();
      })
      .catch((err) => {
        this.isExporting = false;
        alert(`Failed to export GLB: ${err.message}`);
        this.cdr.detectChanges();
      });
  }

  exportSnapshot(): void {
    const preview = this.exportService.captureCanvasImage(this.renderer, this.scene, this.camera);
    const filename = `${this.designNameInput.toLowerCase().replace(/\s+/g, '-')}-preview.png`;
    this.exportService.downloadSnapshot(preview, filename);
  }

  exportJSONConfig(): void {
    const filename = `${this.designNameInput.toLowerCase().replace(/\s+/g, '-')}-config.json`;
    this.exportService.exportConfigAsJSON(this.config, filename);
  }

  resetAllToDefault(): void {
    this.config = {
      version: '1.0',
      modelQuality: 'high',
      colorHex: '#ffffff',
      fabricPresetId: 'cotton',
      textureRepeat: 1.0,
      textureRotation: 0,
      size: 'L',
      fitStyle: 'regular',
      measurements: { ...SIZE_PRESETS.L },
      decals: [],
      wireframe: false,
      clothPhysicsEnabled: true,
      clothPhysicsIntensity: 1.0
    };
    this.designService.removeAllDecals();
    this.activeDecalIndex = -1;
    this.applyAllCustomizations();
    this.resetCamera();
  }

  // --- Viewport Camera Controls ---
  setPresetAngle(angle: PresetAngle): void {
    this.activeAngle = angle;
    this.isInteracting = true;
    this.lastInteractionTime = performance.now();
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
  }

  zoomIn(): void {
    this.targetCameraDist = Math.max(1.8, this.targetCameraDist - 0.4);
  }

  zoomOut(): void {
    this.targetCameraDist = Math.min(6.0, this.targetCameraDist + 0.4);
  }

  switchToGlb(): void {
    if (this.useGlbModel && !this.errorMessage) return;
    this.useGlbModel = true;
    this.loadGlbModel();
  }

  switchQuality(quality: ModelQuality = 'high'): void {
    this.useGlbModel = false;
    this.config.modelQuality = 'high';
    this.loadModelWithTextures('high');
  }

  retry(): void {
    if (this.activeGarment === 'hoodie') {
      this.loadHoodieModel();
    } else {
      this.useGlbModel = false;
      this.loadModelWithTextures('high');
    }
  }

  // ================= Animation & Render Loop =================

  private animate = (): void => {
    this.animationFrameId = requestAnimationFrame(this.animate);

    const delta = Math.min(this.clock.getDelta(), 0.1);
    const elapsedTime = this.clock.getElapsedTime();

    if (this.autoRotate && !this.isInteracting) {
      this.targetAngleY += delta * 0.6;
    }

    const rotSpeed = 1.0 - Math.exp(-12 * delta);
    this.currentAngleY += (this.targetAngleY - this.currentAngleY) * rotSpeed;
    this.currentAngleX += (this.targetAngleX - this.currentAngleX) * rotSpeed;

    const diffAngleY = this.currentAngleY - this.lastAngleY;
    this.angularVelocity = diffAngleY / (delta || 0.016);
    this.lastAngleY = this.currentAngleY;

    // Secondary Garment Momentum & Sway
    const targetSwayZ = -THREE.MathUtils.clamp(this.angularVelocity * 0.035, -0.15, 0.15);
    const targetSwayX = THREE.MathUtils.clamp(Math.abs(this.angularVelocity) * 0.015, 0, 0.08);

    this.swayZ += (targetSwayZ - this.swayZ) * (delta * 8.0);
    this.swayX += (targetSwayX - this.swayX) * (delta * 8.0);

    this.modelPivot.rotation.y = this.currentAngleY;
    this.modelPivot.rotation.x = this.currentAngleX + this.swayX;
    this.modelPivot.rotation.z = this.swayZ;

    // Update Material Fabric Shader Uniforms
    this.materialService.customUniforms.uTime.value = elapsedTime;
    this.materialService.customUniforms.uAngularVelocity.value = this.angularVelocity;
    this.materialService.customUniforms.uFabricIntensity.value = this.config.clothPhysicsEnabled
      ? this.config.clothPhysicsIntensity
      : 0.0;
    this.materialService.customUniforms.uSway.value.set(this.swayZ, this.swayX);

    // Zoom interpolation
    const zoomSpeed = 1.0 - Math.exp(-10 * delta);
    this.currentCameraDist += (this.targetCameraDist - this.currentCameraDist) * zoomSpeed;
    this.camera.position.z = this.currentCameraDist;

    this.renderer.render(this.scene, this.camera);
  };

  // ================= Event Listeners =================

  private initEventListeners(): void {
    const el = this.canvasRef.nativeElement;

    el.addEventListener('mousedown', this.onPointerDown, { passive: false });
    window.addEventListener('mousemove', this.onPointerMove, { passive: false });
    window.addEventListener('mouseup', this.onPointerUp);

    el.addEventListener('touchstart', this.onTouchStart, { passive: false });
    window.addEventListener('touchmove', this.onTouchMove, { passive: false });
    window.addEventListener('touchend', this.onTouchEnd);

    el.addEventListener('wheel', this.onWheel, { passive: false });
  }

  private removeEventListeners(): void {
    const el = this.canvasRef?.nativeElement;
    if (el) {
      el.removeEventListener('mousedown', this.onPointerDown);
      el.removeEventListener('touchstart', this.onTouchStart);
      el.removeEventListener('wheel', this.onWheel);
    }
    window.removeEventListener('mousemove', this.onPointerMove);
    window.removeEventListener('mouseup', this.onPointerUp);
    window.removeEventListener('touchmove', this.onTouchMove);
    window.removeEventListener('touchend', this.onTouchEnd);
  }

  private onPointerDown = (e: MouseEvent): void => {
    if (e.button !== 0) return;
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

    const sensitivity = 0.007;
    this.targetAngleY += deltaX * sensitivity;
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
      this.previousPointerPos = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      };
    } else if (e.touches.length === 2) {
      this.initialPinchDist = Math.hypot(
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

      const sensitivity = 0.008;
      this.targetAngleY += deltaX * sensitivity;
      this.targetAngleX = THREE.MathUtils.clamp(
        this.targetAngleX + deltaY * sensitivity * 0.5,
        -0.28,
        0.28
      );
    } else if (e.touches.length === 2) {
      e.preventDefault();
      const currentDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const diff = this.initialPinchDist - currentDist;
      this.targetCameraDist = THREE.MathUtils.clamp(
        this.targetCameraDist + diff * 0.01,
        1.8,
        6.0
      );
      this.initialPinchDist = currentDist;
    }
  };

  private onTouchEnd = (e: TouchEvent): void => {
    if (e.touches.length === 0) {
      this.isPointerDown = false;
      this.isInteracting = false;
    }
  };

  private onWheel = (e: WheelEvent): void => {
    e.preventDefault();
    this.targetCameraDist = THREE.MathUtils.clamp(
      this.targetCameraDist + e.deltaY * 0.0025,
      1.8,
      6.0
    );
  };

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

  private disposeThree(): void {
    this.deformationService.dispose();
    this.materialService.dispose();
    this.textureService.dispose();
    this.designService.dispose();

    // Dispose cached swatch textures
    this.loadedSwatchTextures.forEach((tex) => tex.dispose());
    this.loadedSwatchTextures.clear();

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
