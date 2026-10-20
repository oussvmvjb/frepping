import {
  Component,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  OnInit,
  AfterViewInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ChangeDetectorRef,
  NgZone,
  HostListener
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { HandTrackingService } from '../../services/hand-tracking.service';
import {
  GestureControllerService,
  GestureState
} from '../../services/gesture-controller.service';
import {
  CLOTHING_MODELS_REGISTRY,
  ClothingModelItem
} from '../../models/clothes-room.models';

@Component({
  selector: 'app-clothes-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './clothes-viewer.component.html',
  styleUrls: ['./clothes-viewer.component.scss']
})
export class ClothesViewerComponent
  implements OnInit, AfterViewInit, OnChanges, OnDestroy
{
  @Input() selectedIndex: number = 0;
  @Input() autoRotate: boolean = false;
  @Output() modelChanged = new EventEmitter<number>();

  @ViewChild('containerRef', { static: true })
  containerRef!: ElementRef<HTMLDivElement>;

  @ViewChild('canvasRef', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  @ViewChild('cursorRef')
  cursorRef?: ElementRef<HTMLDivElement>;

  // Discovered Models Registry
  public readonly clothingModels: ClothingModelItem[] = CLOTHING_MODELS_REGISTRY;
  public currentIndex = 0;

  // Loading & Error States
  public isLoading = true;
  public loadingProgress = 0;
  public hasError = false;
  public errorMessage = '';

  // Interaction & Raycast states for UI
  public isCursorVisible = false;
  public cursorState: GestureState = 'NO_HANDS';
  public isHoveringObject = false;
  public hoveredSlotIndex = -1;
  public zoomLevelPercent = 100;
  public gestureNotification = '';
  private notificationTimer?: any;

  // Three.js Core
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private carouselRoot = new THREE.Group();
  private carouselSlots: THREE.Group[] = [];
  private loadedModelsMap = new Map<string, THREE.Group>();
  private meshToSlotMap = new Map<THREE.Mesh, number>();
  private raycaster = new THREE.Raycaster();
  private raycastMeshes: THREE.Mesh[] = [];

  // Carousel 3D Animation targets
  private targetCarouselOffset = 0;
  private currentCarouselOffset = 0;

  // Studio Lighting & Shadows
  private keyLight!: THREE.DirectionalLight;
  private fillLight!: THREE.DirectionalLight;
  private rimLight!: THREE.DirectionalLight;
  private ambientLight!: THREE.AmbientLight;
  private groundShadows: THREE.Mesh[] = [];

  // 3D Static Background Model
  private backgroundModel: THREE.Object3D | null = null;
  public readonly bgModelPath: string = encodeURI('assets/3dmodel/3d bg/dirty_street.glb');

  // Camera framing base variables
  private defaultCameraDistance = 10.5;
  private baseCameraPos = new THREE.Vector3(0, 0.25, 10.5);
  private cameraTarget = new THREE.Vector3(0, 0.85, 0);

  // Render loop & Subscriptions
  private animationId: number | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private trackingSub?: Subscription;
  private gestureStateSub?: Subscription;
  private carouselNavSub?: Subscription;

  // Mouse / Touch Fallback tracking
  private isPointerDown = false;
  private pointerStartX = 0;
  private pointerStartY = 0;
  private pointerStartTime = 0;
  private touchInitialDist = 0;
  private hasPointerMoved = false;

  constructor(
    public handTrackingService: HandTrackingService,
    public gestureController: GestureControllerService,
    private cdRef: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.currentIndex = this.selectedIndex;
    this.targetCarouselOffset = this.selectedIndex;
    this.currentCarouselOffset = this.selectedIndex;

    // Listen to gesture state updates
    this.gestureStateSub = this.gestureController.gestureState$.subscribe((state) => {
      this.cursorState = state;
      this.isCursorVisible = state !== 'NO_HANDS';
      this.cdRef.markForCheck();
    });

    // Listen to carousel navigation events from Open-Palm Swipes
    this.carouselNavSub = this.gestureController.carouselNavigation$.subscribe(
      (direction) => {
        if (direction === 'NEXT') {
          this.nextModel(true);
        } else if (direction === 'PREV') {
          this.prevModel(true);
        }
      }
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedIndex'] && !changes['selectedIndex'].firstChange) {
      if (this.selectedIndex !== this.currentIndex) {
        this.selectModelIndex(this.selectedIndex, false);
      }
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initThree();
      this.loadBackgroundStreet();
      this.initCarouselSlots();
      this.loadAllModels();
      this.setupFrameTrackingSubscription();
      this.setupResizeObserver();
      this.startRenderLoop();
    }, 60);
  }

  /**
   * 1. Initialize Three.js scene, camera, lights, and renderer
   */
  private initThree(): void {
    const container = this.containerRef.nativeElement;
    const canvas = this.canvasRef.nativeElement;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    this.gestureController.setCanvasDimensions(width, height);

    // Create Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0c0f0d);
    this.scene.fog = new THREE.FogExp2(0x0c0f0d, 0.022);

    // Camera setup (FOV 40 for distortion-free garment display)
    this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    this.camera.position.copy(this.baseCameraPos);
    this.camera.lookAt(this.cameraTarget);

    // Renderer setup
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance'
    });

    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Add carousel root group to scene
    this.scene.add(this.carouselRoot);

    // Setup Lighting & Showroom Floor
    this.setupStudioLighting();
    this.setupShowroomFloor();
  }

  /**
   * Studio lighting setup designed specifically for textured 3D clothing
   */
  private setupStudioLighting(): void {
    this.ambientLight = new THREE.AmbientLight(0xffffff, 1.15);
    this.scene.add(this.ambientLight);

    // Key Light
    this.keyLight = new THREE.DirectionalLight(0xffffff, 1.85);
    this.keyLight.position.set(6, 12, 9);
    this.keyLight.castShadow = true;
    this.keyLight.shadow.mapSize.width = 1024;
    this.keyLight.shadow.mapSize.height = 1024;
    this.keyLight.shadow.camera.near = 0.5;
    this.keyLight.shadow.camera.far = 30;
    this.keyLight.shadow.bias = -0.0005;
    this.scene.add(this.keyLight);

    // Fill Light
    this.fillLight = new THREE.DirectionalLight(0xaad4ff, 0.75);
    this.fillLight.position.set(-8, 5, 7);
    this.scene.add(this.fillLight);

    // Cyber Rim / Edge Light
    this.rimLight = new THREE.DirectionalLight(0x39ff14, 0.95);
    this.rimLight.position.set(0, 9, -9);
    this.scene.add(this.rimLight);
  }

  /**
   * Showroom floor with circular pedestal lines and soft contact shadows
   */
  private setupShowroomFloor(): void {
    // Subtle floor circular grid lines in center
    const ringGeo = new THREE.RingGeometry(3.0, 3.02, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x39ff14,
      transparent: true,
      opacity: 0.18,
      side: THREE.DoubleSide
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = -2.6;
    this.scene.add(ring);
  }

  /**
   * Load static 3D street background model behind the clothing carousel
   */
  private loadBackgroundStreet(): void {
    const loader = new GLTFLoader();
    loader.load(
      this.bgModelPath,
      (gltf) => {
        const bg = gltf.scene;
        this.backgroundModel = bg;

        // Traverse background meshes
        bg.traverse((node) => {
          if (node instanceof THREE.Mesh) {
            node.castShadow = false;
            node.receiveShadow = true;
            // Never add to raycastMeshes so the background is non-interactive

            if (node.material) {
              const materials = Array.isArray(node.material)
                ? node.material
                : [node.material];
              materials.forEach((mat) => {
                mat.side = THREE.DoubleSide;
                if (mat instanceof THREE.MeshStandardMaterial) {
                  mat.roughness = Math.max(0.68, mat.roughness);
                  mat.metalness = Math.min(0.2, mat.metalness);
                  mat.needsUpdate = true;
                }
              });
            }
          }
        });

        // Turn background model around (180 degrees)
        bg.rotation.y = Math.PI;

        // Compute bounds to position and scale the street environment
        let box = new THREE.Box3().setFromObject(bg);
        let size = box.getSize(new THREE.Vector3());

        // Target width to fill the showroom background behind all carousel models
        const maxHorizontal = Math.max(size.x, size.z);
        const targetWidth = 50.0;
        const scale = targetWidth / maxHorizontal;
        bg.scale.setScalar(scale);

        // Recompute bounds after rotation & scaling
        box = new THREE.Box3().setFromObject(bg);
        const newCenter = box.getCenter(new THREE.Vector3());

        // Ground floor at Y = -2.62 (aligned with the clothing ground level)
        // Center in X at 0, and push further back along -Z behind the clothing models
        bg.position.set(-newCenter.x, -box.min.y - 2.62, -newCenter.z - 8.5);

        // Add directly to the scene: completely static, never moves with carousel or gestures
        this.scene.add(bg);
      },
      undefined,
      (error) => {
        console.warn(
          '[ClothesViewer] Note: 3D street background model could not be loaded:',
          error
        );
      }
    );
  }

  /**
   * 2. Initialize slots for all 5 clothing models
   */
  private initCarouselSlots(): void {
    this.carouselSlots = [];
    this.clothingModels.forEach((_, idx) => {
      const slot = new THREE.Group();
      slot.name = `slot-${idx}`;
      this.carouselSlots.push(slot);
      this.carouselRoot.add(slot);
    });
  }

  /**
   * 3. Load all models, prioritizing the active one first
   */
  public async loadAllModels(): Promise<void> {
    this.isLoading = true;
    this.hasError = false;
    this.errorMessage = '';
    this.loadingProgress = 0;
    this.cdRef.markForCheck();

    // 1. Load active center model first
    try {
      await this.loadSingleModel(this.currentIndex, (pct) => {
        this.loadingProgress = pct;
        this.cdRef.markForCheck();
      });
      this.isLoading = false;
      this.cdRef.markForCheck();
    } catch (err) {
      console.error('[ClothesViewer] Failed to load initial model:', err);
      this.isLoading = false;
      this.hasError = true;
      this.errorMessage = 'Failed to load initial 3D clothing model.';
      this.cdRef.markForCheck();
    }

    // 2. Preload remaining models asynchronously
    this.clothingModels.forEach((_, idx) => {
      if (idx !== this.currentIndex) {
        this.loadSingleModel(idx).catch((e) => {
          console.warn(`[ClothesViewer] Background preload failed for model ${idx}:`, e);
        });
      }
    });
  }

  /**
   * Loads a single model by index, normalizes scale, and anchors it to its carousel slot
   */
  private loadSingleModel(
    index: number,
    progressCb?: (pct: number) => void
  ): Promise<THREE.Group> {
    const item = this.clothingModels[index];
    if (this.loadedModelsMap.has(item.path)) {
      return Promise.resolve(this.loadedModelsMap.get(item.path)!);
    }

    return new Promise((resolve, reject) => {
      const loader = new GLTFLoader();
      loader.load(
        item.path,
        (gltf) => {
          const model = gltf.scene;

          // Configure materials and gather raycast meshes
          model.traverse((node) => {
            if (node instanceof THREE.Mesh) {
              node.castShadow = true;
              node.receiveShadow = true;
              this.raycastMeshes.push(node);
              this.meshToSlotMap.set(node, index);

              if (node.material) {
                if (Array.isArray(node.material)) {
                  node.material.forEach((m) => this.enhanceMaterial(m));
                } else {
                  this.enhanceMaterial(node.material);
                }
              }
            }
          });

          // Normalize scale & center model
          this.normalizeModel(model, item.targetSize || 5.0);

          // Add contact shadow under model
          const shadow = this.createModelContactShadow();
          shadow.position.y = -2.55;
          const modelWrapper = new THREE.Group();
          modelWrapper.add(model);
          modelWrapper.add(shadow);

          // Mount into slot
          const slot = this.carouselSlots[index];
          if (slot) {
            slot.add(modelWrapper);
          }

          this.loadedModelsMap.set(item.path, modelWrapper);
          resolve(modelWrapper);
        },
        (xhr) => {
          if (xhr.total > 0 && progressCb) {
            const pct = Math.round((xhr.loaded / xhr.total) * 100);
            progressCb(pct);
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  private enhanceMaterial(mat: THREE.Material): void {
    if (mat instanceof THREE.MeshStandardMaterial) {
      mat.roughness = Math.max(0.65, mat.roughness);
      mat.metalness = Math.min(0.18, mat.metalness);
      mat.needsUpdate = true;
    }
  }

  private normalizeModel(object: THREE.Object3D, targetSize: number): void {
    const box = new THREE.Box3().setFromObject(object);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = targetSize / maxDim;
    object.scale.setScalar(scale);

    // Center geometry around (0, 0, 0)
    box.setFromObject(object);
    const center = box.getCenter(new THREE.Vector3());
    object.position.x = -center.x;
    object.position.y = -center.y;
    object.position.z = -center.z;
  }

  private createModelContactShadow(): THREE.Mesh {
    const shadowGeo = new THREE.PlaneGeometry(6.5, 6.5);
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;
    const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 60);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0.6)');
    grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.22)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);

    const shadowTex = new THREE.CanvasTexture(canvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.8,
      depthWrite: false
    });

    const mesh = new THREE.Mesh(shadowGeo, shadowMat);
    mesh.rotation.x = -Math.PI / 2;
    return mesh;
  }

  /**
   * 4. Carousel Navigation API
   */
  public selectModelIndex(index: number, emitEvent: boolean = true): void {
    const N = this.clothingModels.length;
    const validIndex = ((index % N) + N) % N;
    if (this.currentIndex === validIndex) return;

    // Calculate circular shortest path delta
    let diff = validIndex - this.currentIndex;
    if (diff > N / 2) diff -= N;
    if (diff < -N / 2) diff += N;

    this.currentIndex = validIndex;
    this.targetCarouselOffset += diff;

    // Reset center rotation for incoming model
    this.gestureController.resetTransforms();

    if (emitEvent) {
      this.modelChanged.emit(this.currentIndex);
    }

    this.showGestureNotice(`SELECTED: ${this.clothingModels[this.currentIndex].name.toUpperCase()}`);
    this.cdRef.markForCheck();
  }

  public nextModel(fromGesture: boolean = false): void {
    const nextIdx = (this.currentIndex + 1) % this.clothingModels.length;
    this.selectModelIndex(nextIdx, true);
    if (fromGesture) {
      this.showGestureNotice('SWIPE RIGHT ➔ NEXT MODEL');
    }
  }

  public prevModel(fromGesture: boolean = false): void {
    const prevIdx =
      (this.currentIndex - 1 + this.clothingModels.length) % this.clothingModels.length;
    this.selectModelIndex(prevIdx, true);
    if (fromGesture) {
      this.showGestureNotice('SWIPE LEFT ➔ PREVIOUS MODEL');
    }
  }

  private showGestureNotice(text: string): void {
    this.gestureNotification = text;
    if (this.notificationTimer) {
      clearTimeout(this.notificationTimer);
    }
    this.notificationTimer = setTimeout(() => {
      this.gestureNotification = '';
      this.cdRef.markForCheck();
    }, 1800);
  }

  /**
   * 5. Frame Tracking Subscription
   */
  private setupFrameTrackingSubscription(): void {
    this.trackingSub = this.handTrackingService.frame$.subscribe((frame) => {
      this.gestureController.processTrackingFrame(frame);
    });
  }

  /**
   * 6. Main 60fps Carousel & Transform Render Loop
   */
  private startRenderLoop(): void {
    this.ngZone.runOutsideAngular(() => {
      const render = () => {
        this.animationId = requestAnimationFrame(render);

        // Auto-rotate center model when enabled and idle
        if (
          this.autoRotate &&
          !this.gestureController.cursor.isPinching &&
          !this.isPointerDown
        ) {
          this.gestureController.addManualRotation(0.006, 0);
        }

        // Get smoothed rotation & zoom transforms
        const transforms = this.gestureController.updateInterpolatedTransforms(0.12);

        // Interpolate 3D carousel sliding offset
        this.currentCarouselOffset +=
          (this.targetCarouselOffset - this.currentCarouselOffset) * 0.12;

        // Position all models in 3D showroom carousel
        this.updateCarousel3DPositions(transforms);

        // Camera distance zoom & framing
        const currentDistance = this.defaultCameraDistance / transforms.zoomFactor;
        this.camera.position.set(this.baseCameraPos.x, this.baseCameraPos.y, currentDistance);
        this.camera.lookAt(this.cameraTarget);
        this.zoomLevelPercent = Math.round(transforms.zoomFactor * 100);

        // Raycasting for cursor hover / selection
        this.performRaycast();

        // Update cursor DOM overlay without triggering Angular CD
        this.updateCursorDOM();

        // Render Scene
        this.renderer.render(this.scene, this.camera);
      };

      this.animationId = requestAnimationFrame(render);
    });
  }

  /**
   * Arrange 3D models in an elegant showroom arc around center
   */
  private updateCarousel3DPositions(transforms: {
    rotationY: number;
    rotationX: number;
  }): void {
    const N = this.clothingModels.length;
    const arcSpacing = 0.65; // Angular spread
    const radius = 7.0;

    for (let i = 0; i < N; i++) {
      const slot = this.carouselSlots[i];
      if (!slot) continue;

      let delta = i - this.currentCarouselOffset;
      // Circular wrap around [-N/2, N/2]
      while (delta > N / 2) delta -= N;
      while (delta < -N / 2) delta += N;

      const absDelta = Math.abs(delta);

      // Hide models too far in the background
      if (absDelta > 2.3) {
        slot.visible = false;
        continue;
      }

      slot.visible = true;

      // 3D positioning along horseshoe curve
      const angle = delta * arcSpacing;
      const posX = Math.sin(angle) * radius;
      const posZ = -(1.0 - Math.cos(angle)) * radius - absDelta * 2.4;
      const posY = -absDelta * 0.35;

      slot.position.set(posX, posY, posZ);

      // Center model is full scale (1.0). Side models are scaled down in depth
      const targetScale = Math.max(0.38, 1.0 - absDelta * 0.36);
      slot.scale.setScalar(targetScale);

      // Rotation: Center model rotates 360° freely; side models face inwards
      if (absDelta < 0.18) {
        slot.rotation.y = transforms.rotationY;
        slot.rotation.x = transforms.rotationX;
      } else {
        slot.rotation.y = -delta * 0.3;
        slot.rotation.x = 0;
      }
    }
  }

  /**
   * Raycast from cursor NDC coordinates into scene
   */
  private performRaycast(): void {
    if (!this.isCursorVisible) {
      this.isHoveringObject = false;
      this.hoveredSlotIndex = -1;
      return;
    }

    const cursor = this.gestureController.cursor;
    this.raycaster.setFromCamera(
      new THREE.Vector2(cursor.normalizedX, cursor.normalizedY),
      this.camera
    );

    const intersects = this.raycaster.intersectObjects(this.raycastMeshes, false);
    if (intersects.length > 0) {
      const hitMesh = intersects[0].object as THREE.Mesh;
      this.hoveredSlotIndex = this.meshToSlotMap.get(hitMesh) ?? -1;
      this.isHoveringObject = true;
    } else {
      this.isHoveringObject = false;
      this.hoveredSlotIndex = -1;
    }
  }

  /**
   * Direct DOM update of cursor overlay
   */
  private updateCursorDOM(): void {
    if (!this.cursorRef || !this.cursorRef.nativeElement) return;
    const el = this.cursorRef.nativeElement;

    if (!this.isCursorVisible) {
      el.style.opacity = '0';
      return;
    }

    const cursor = this.gestureController.cursor;
    el.style.opacity = '1';
    el.style.transform = `translate3d(${cursor.x}px, ${cursor.y}px, 0)`;
  }

  /**
   * 7. Mouse, Touch & Keyboard Fallbacks
   */
  @HostListener('window:keydown', ['$event'])
  onKeyDown(e: KeyboardEvent): void {
    if (e.key === 'ArrowRight') {
      this.nextModel();
      e.preventDefault();
    } else if (e.key === 'ArrowLeft') {
      this.prevModel();
      e.preventDefault();
    }
  }

  public onPointerDown(e: MouseEvent | TouchEvent): void {
    if (this.isCursorVisible && this.gestureController.cursor.isPinching) {
      return;
    }

    this.isPointerDown = true;
    this.hasPointerMoved = false;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    this.pointerStartX = clientX;
    this.pointerStartY = clientY;
    this.pointerStartTime = performance.now();

    if ('touches' in e && e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      this.touchInitialDist = Math.sqrt(dx * dx + dy * dy);
    }
  }

  public onPointerMove(e: MouseEvent | TouchEvent): void {
    if (!this.isPointerDown) return;

    if ('touches' in e && e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (this.touchInitialDist > 0) {
        const factor = (dist - this.touchInitialDist) * 0.004;
        this.gestureController.setManualZoom(factor);
        this.touchInitialDist = dist;
      }
      return;
    }

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const deltaX = (clientX - this.pointerStartX) * 0.008;
    const deltaY = (clientY - this.pointerStartY) * 0.005;

    if (Math.abs(clientX - this.pointerStartX) > 8 || Math.abs(clientY - this.pointerStartY) > 8) {
      this.hasPointerMoved = true;
    }

    this.gestureController.addManualRotation(deltaX, deltaY);

    this.pointerStartX = clientX;
    this.pointerStartY = clientY;
  }

  public onPointerUp(e?: MouseEvent | TouchEvent): void {
    if (this.isPointerDown) {
      const elapsed = performance.now() - this.pointerStartTime;
      // If user clicked/tapped without substantial drag, check for raycast selection of side models
      if (!this.hasPointerMoved && elapsed < 350 && e) {
        const rect = this.canvasRef.nativeElement.getBoundingClientRect();
        const clientX = 'changedTouches' in e ? e.changedTouches[0].clientX : (e as MouseEvent).clientX;
        const clientY = 'changedTouches' in e ? e.changedTouches[0].clientY : (e as MouseEvent).clientY;
        const normX = ((clientX - rect.left) / rect.width) * 2 - 1;
        const normY = -((clientY - rect.top) / rect.height) * 2 + 1;

        this.raycaster.setFromCamera(new THREE.Vector2(normX, normY), this.camera);
        const intersects = this.raycaster.intersectObjects(this.raycastMeshes, false);
        if (intersects.length > 0) {
          const hitSlot = this.meshToSlotMap.get(intersects[0].object as THREE.Mesh);
          if (hitSlot !== undefined && hitSlot !== this.currentIndex) {
            this.selectModelIndex(hitSlot, true);
          }
        }
      }
    }

    this.isPointerDown = false;
    this.touchInitialDist = 0;
  }

  public onWheel(e: WheelEvent): void {
    e.preventDefault();
    const zoomDelta = -e.deltaY * 0.0012;
    this.gestureController.setManualZoom(zoomDelta);
  }

  public resetView(): void {
    this.gestureController.resetTransforms();
  }

  public zoomIn(): void {
    this.gestureController.setManualZoom(0.2);
  }

  public zoomOut(): void {
    this.gestureController.setManualZoom(-0.2);
  }

  /**
   * Responsive resizing
   */
  private setupResizeObserver(): void {
    const container = this.containerRef.nativeElement;
    this.resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          this.handleResize(width, height);
        }
      }
    });
    this.resizeObserver.observe(container);
  }

  private handleResize(width: number, height: number): void {
    if (!this.camera || !this.renderer) return;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.gestureController.setCanvasDimensions(width, height);
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    if (this.containerRef) {
      const container = this.containerRef.nativeElement;
      this.handleResize(container.clientWidth, container.clientHeight);
    }
  }

  /**
   * 8. WebGL and resource cleanup
   */
  ngOnDestroy(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

    if (this.notificationTimer) {
      clearTimeout(this.notificationTimer);
    }

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }

    if (this.trackingSub) this.trackingSub.unsubscribe();
    if (this.gestureStateSub) this.gestureStateSub.unsubscribe();
    if (this.carouselNavSub) this.carouselNavSub.unsubscribe();

    if (this.scene) {
      this.scene.traverse((node) => {
        if (node instanceof THREE.Mesh) {
          if (node.geometry) node.geometry.dispose();
          if (Array.isArray(node.material)) {
            node.material.forEach((m) => this.disposeMaterial(m));
          } else if (node.material) {
            this.disposeMaterial(node.material);
          }
        }
      });
    }

    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.forceContextLoss();
    }

    this.backgroundModel = null;
  }

  private disposeMaterial(mat: THREE.Material): void {
    for (const key of Object.keys(mat)) {
      const val = (mat as any)[key];
      if (val && typeof val === 'object' && 'minFilter' in val) {
        val.dispose();
      }
    }
    mat.dispose();
  }
}
