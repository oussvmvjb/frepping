import {
  Component, Input, OnDestroy, AfterViewInit, OnChanges, SimpleChanges,
  ElementRef, ViewChild, HostListener, NgZone,
  ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// ── Public types ────────────────────────────────────────────────────────────

/**
 * Role of each piece drives real-world-size scaling:
 *  shoes  → scale so that max(size.x, size.z) = 0.30   (pair width)
 *  bottom → scale so that size.y                = 1.05   (leg inseam)
 *  top    → scale so that size.y                = 0.65   (torso height)
 */
export type OutfitRole = 'shoes' | 'bottom' | 'top';

export interface OutfitItem {
  path:  string;
  label: string;
  role:  OutfitRole;
  /** Fine-tune multiplier applied on top of the role scale (uniform, no stretch) */
  tweak?: number;
}

/** Real-world target sizes in scene units (1 unit ≈ 1 m) */
const ROLE_CONFIG: Record<OutfitRole, { targetSize: number; axis: 'y' | 'xz' }> = {
  shoes:  { targetSize: 0.30, axis: 'xz' },
  bottom: { targetSize: 1.05, axis: 'y'  },
  top:    { targetSize: 0.65, axis: 'y'  },
};

// ── Component ───────────────────────────────────────────────────────────────

@Component({
  selector: 'app-outfit-scene',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="outfit-wrapper">
      <canvas #canvas></canvas>

      <div class="outfit-loading" *ngIf="loadingCount > 0">
        <div class="loader-ring"></div>
        <span>Loading outfit… {{ loadedCount }}/{{ totalCount }}</span>
      </div>

      <div class="outfit-hint" *ngIf="loadingCount === 0">
        <i class="fas fa-hand-pointer"></i>
        <span>DRAG TO ROTATE &bull; SCROLL TO ZOOM</span>
      </div>
    </div>
  `,
  styleUrls: ['./outfit-scene.component.scss']
})
export class OutfitSceneComponent implements AfterViewInit, OnDestroy, OnChanges {

  @Input() items: OutfitItem[] = [];
  @Input() autoRotate  = true;
  @Input() rotateSpeed = 0.7;

  @ViewChild('canvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;

  loadingCount = 0;
  loadedCount  = 0;
  totalCount   = 0;

  // ── Three.js refs ──────────────────────────────────────────────────────────
  private scene!:    THREE.Scene;
  private camera!:   THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;
  private animId  = 0;
  private observer!: IntersectionObserver;
  private isVisible = false;

  /** Loaded groups keyed by role, preserved for layout & instant toggle */
  private groupByRole = new Map<OutfitRole, THREE.Group>();
  private loadingRoles = new Set<OutfitRole>();
  /** Floor disc mesh so we can resize after layout */
  private floorMesh!: THREE.Mesh;

  constructor(private ngZone: NgZone, private cdr: ChangeDetectorRef) {}

  // ── Lifecycle ──────────────────────────────────────────────────────────────

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['items'] && !changes['items'].isFirstChange()) {
      if (this.scene) {
        this.syncVisibleItems();
      }
    }
    if (changes['autoRotate'] && this.controls) {
      this.controls.autoRotate = this.autoRotate;
    }
    if (changes['rotateSpeed'] && this.controls) {
      this.controls.autoRotateSpeed = this.rotateSpeed;
    }
  }

  ngAfterViewInit(): void {
    this.observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        this.isVisible = e.isIntersecting;
        if (e.isIntersecting && !this.scene) {
          this.ngZone.runOutsideAngular(() => {
            this.initThree();
            this.loadAllModels();
            this.animate();
          });
        } else if (e.isIntersecting && this.scene) {
          this.ngZone.runOutsideAngular(() => this.animate());
        } else {
          cancelAnimationFrame(this.animId);
          this.animId = 0;
        }
      });
    }, { threshold: 0.05 });

    this.observer.observe(this.canvasRef.nativeElement);
  }

  // ── Three.js init ──────────────────────────────────────────────────────────

  private initThree(): void {
    const canvas = this.canvasRef.nativeElement;
    const w = canvas.clientWidth  || 600;
    const h = canvas.clientHeight || 700;

    this.scene = new THREE.Scene();
    this.scene.background = null;

    this.camera = new THREE.PerspectiveCamera(36, w / h, 0.01, 200);
    this.camera.position.set(0, 1, 6);
    this.camera.lookAt(0, 1, 0);

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace   = THREE.SRGBColorSpace;
    this.renderer.toneMapping        = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.shadowMap.enabled  = true;
    this.renderer.shadowMap.type     = THREE.PCFSoftShadowMap;

    this.setupLighting();

    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping   = true;
    this.controls.dampingFactor   = 0.06;
    this.controls.enableZoom      = true;
    this.controls.minDistance     = 1;
    this.controls.maxDistance     = 12;
    this.controls.minPolarAngle   = Math.PI * 0.05;
    this.controls.maxPolarAngle   = Math.PI * 0.88;
    this.controls.autoRotate      = this.autoRotate;
    this.controls.autoRotateSpeed = this.rotateSpeed;
    this.controls.target.set(0, 1, 0);
    this.controls.update();

    // Ghost floor disc (resized after layout)
    const floorGeo = new THREE.CircleGeometry(1, 64);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x39ff14, roughness: 1, metalness: 0,
      transparent: true, opacity: 0.12,
      side: THREE.DoubleSide
    });
    this.floorMesh = new THREE.Mesh(floorGeo, floorMat);
    this.floorMesh.rotation.x = -Math.PI / 2;
    this.floorMesh.position.y = 0.001;
    this.floorMesh.receiveShadow = true;
    this.scene.add(this.floorMesh);
  }

  private setupLighting(): void {
    this.scene.add(new THREE.AmbientLight(0xffffff, 1.0));

    const key = new THREE.DirectionalLight(0xffffff, 2.4);
    key.position.set(4, 8, 6);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.near = 0.5;
    key.shadow.camera.far  = 30;
    this.scene.add(key);

    const fill = new THREE.DirectionalLight(0x9ab4ff, 0.8);
    fill.position.set(-6, 5, -4);
    this.scene.add(fill);

    const rim = new THREE.DirectionalLight(0x39ff14, 0.55);
    rim.position.set(0, -2, -8);
    this.scene.add(rim);

    const top = new THREE.DirectionalLight(0xffffff, 0.6);
    top.position.set(0, 10, 2);
    this.scene.add(top);
  }

  // ── Model loading & caching ───────────────────────────────────────────────

  private loadSingleModel(item: OutfitItem): void {
    if (this.groupByRole.has(item.role) || this.loadingRoles.has(item.role)) {
      return;
    }

    this.loadingRoles.add(item.role);
    this.loadingCount++;
    this.cdr.markForCheck();

    const loader = new GLTFLoader();
    loader.load(
      item.path,
      gltf => {
        const group = gltf.scene;

        // Hide mannequin / dummy meshes
        const mannequinRe = /mannequin|dummy|stand|hanger|neck|collar_stand|display/i;
        group.traverse(child => {
          const mesh = child as THREE.Mesh;
          if (mesh.isMesh) {
            mesh.castShadow    = true;
            mesh.receiveShadow = true;
            if (mannequinRe.test(child.name)) {
              child.visible = false;
              console.warn(`[OutfitScene] Hidden mannequin mesh: "${child.name}"`);
            }
          }
        });

        // Real-world scale
        const cfg = ROLE_CONFIG[item.role];
        const box = new THREE.Box3().setFromObject(group);
        const size = box.getSize(new THREE.Vector3());

        let naturalSize: number;
        if (cfg.axis === 'xz') {
          naturalSize = Math.max(size.x, size.z);
        } else {
          naturalSize = size.y;
        }

        const scaleFactor = (cfg.targetSize / naturalSize) * (item.tweak ?? 1);
        group.scale.setScalar(scaleFactor);

        console.log(
          `[OutfitScene] ${item.role}: naturalSize(${cfg.axis})=${naturalSize.toFixed(4)}` +
          `  tweak=${item.tweak ?? 1}  → scale=${scaleFactor.toFixed(4)}`
        );

        this.scene.add(group);
        this.groupByRole.set(item.role, group);
        this.loadingRoles.delete(item.role);

        // Visibility based on current selection
        group.visible = this.items.some(it => it.role === item.role);

        this.loadedCount++;
        this.loadingCount--;
        this.cdr.markForCheck();

        this.layoutOutfit();
      },
      undefined,
      err => {
        console.error(`[OutfitScene] failed to load ${item.path}`, err);
        const ph = new THREE.Group();
        this.scene.add(ph);
        this.groupByRole.set(item.role, ph);
        this.loadingRoles.delete(item.role);
        this.loadedCount++;
        this.loadingCount--;
        this.cdr.markForCheck();
        this.layoutOutfit();
      }
    );
  }

  private loadAllModels(): void {
    if (!this.items.length) return;

    this.totalCount   = this.items.length;
    this.loadingCount = 0;
    this.loadedCount  = 0;

    this.items.forEach(item => this.loadSingleModel(item));
  }

  private syncVisibleItems(): void {
    if (!this.scene) return;

    // Load any item in this.items that isn't cached yet
    const missing = this.items.filter(
      it => !this.groupByRole.has(it.role) && !this.loadingRoles.has(it.role)
    );
    if (missing.length > 0) {
      this.totalCount += missing.length;
      missing.forEach(it => this.loadSingleModel(it));
    }

    // Set visibility on already loaded groups
    this.groupByRole.forEach((group, role) => {
      const active = this.items.some(it => it.role === role);
      group.visible = active;
    });

    this.layoutOutfit();
  }

  // ── Layout: dynamic real-world stacking for 1, 2, or 3 models ──────────────

  private layoutOutfit(): void {
    if (!this.scene) return;

    const isSelected = (role: OutfitRole) => this.items.some(it => it.role === role);
    const getVisibleGroup = (role: OutfitRole): THREE.Group | null => {
      const g = this.groupByRole.get(role);
      if (g && isSelected(role)) {
        g.visible = true;
        return g;
      }
      if (g) {
        g.visible = false;
      }
      return null;
    };

    const shoes  = getVisibleGroup('shoes');
    const bottom = getVisibleGroup('bottom');
    const top    = getVisibleGroup('top');

    const visibleGroups = [shoes, bottom, top].filter((g): g is THREE.Group => !!g);

    if (visibleGroups.length === 0) {
      if (this.floorMesh) this.floorMesh.visible = false;
      return;
    }
    if (this.floorMesh) this.floorMesh.visible = true;

    // Helper: calculate fresh bounding box
    const box = (g: THREE.Group) => new THREE.Box3().setFromObject(g);

    // STEP 1 — Reset positions
    visibleGroups.forEach(g => g.position.set(0, 0, 0));

    // STEP 2 — Center visible pieces on X/Z
    visibleGroups.forEach(g => {
      const b = box(g);
      const c = b.getCenter(new THREE.Vector3());
      g.position.x = -c.x;
      g.position.z = -c.z;
    });

    // STEP 3 — Vertical stacking
    let shoesTopY = 0;
    if (shoes) {
      const shoesBox = box(shoes);
      shoes.position.y = -shoesBox.min.y; // bottom of shoes at y = 0
      const shoesBoxF = box(shoes);
      shoesTopY = shoesBoxF.max.y;
    }

    let pantsTopY = 0;
    if (bottom) {
      const pantsBox0 = box(bottom);
      if (shoes) {
        // hem overlaps shoes by 15% of shoe height
        bottom.position.y = -pantsBox0.min.y + (shoesTopY * 0.85);
      } else {
        // no shoes: pants sit on ground y = 0
        bottom.position.y = -pantsBox0.min.y;
      }
      const pantsBoxF = box(bottom);
      pantsTopY = pantsBoxF.max.y;
    }

    if (top) {
      const shirtBox0 = box(top);
      if (bottom) {
        // shirt overlaps pants waist by 0.08
        top.position.y = (pantsTopY - 0.08) - shirtBox0.min.y;
      } else if (shoes) {
        // bottom absent: shirt sits at natural standing torso height above shoes (~1.05m pants)
        top.position.y = (shoesTopY * 0.85 + (1.05 - 0.08)) - shirtBox0.min.y;
      } else {
        // only shirt: sit on ground
        top.position.y = -shirtBox0.min.y;
      }
    }

    // STEP 4 — Center whole outfit vertically at origin (0, 0, 0)
    const allBox = new THREE.Box3();
    visibleGroups.forEach(g => allBox.expandByObject(g));

    const allCenter = allBox.getCenter(new THREE.Vector3());
    const allSize   = allBox.getSize(new THREE.Vector3());

    visibleGroups.forEach(g => {
      g.position.y -= allCenter.y;
    });

    // Recompute allBox after vertical centering
    allBox.makeEmpty();
    visibleGroups.forEach(g => allBox.expandByObject(g));

    // STEP 5 — Fit camera smoothly to visible outfit
    const fovRad  = this.camera.fov * (Math.PI / 180);
    const groupH  = Math.max(allSize.y, 0.25);
    const groupW  = Math.max(allSize.x, allSize.z, 0.25);
    const camDist = Math.max(
      (groupH / 2) / Math.tan(fovRad / 2) * 1.35,
      (groupW / 2) / Math.tan((fovRad * this.camera.aspect) / 2) * 1.35,
      1.1 // minimum distance
    );

    // Keep camera viewing direction, only update distance
    const currentDir = this.camera.position.clone().sub(this.controls.target).normalize();
    if (currentDir.lengthSq() < 0.01) {
      currentDir.set(0, 0, 1);
    }
    this.camera.position.copy(currentDir.multiplyScalar(camDist));
    this.controls.target.set(0, 0, 0);
    this.controls.minDistance = Math.max(camDist * 0.35, 0.5);
    this.controls.maxDistance = camDist * 3.0;
    this.controls.update();

    // STEP 6 — Resize floor disc
    const floorR = Math.max(groupW, 0.4) * 1.25;
    this.floorMesh.scale.setScalar(floorR);
    this.floorMesh.position.y = allBox.min.y - 0.005;

    console.group('[OutfitScene] Layout update');
    console.log(`  Visible count: ${visibleGroups.length}`);
    if (shoes)  console.log(`  shoes scale: ${shoes.scale.x.toFixed(4)}`);
    if (bottom) console.log(`  pants scale: ${bottom.scale.x.toFixed(4)}`);
    if (top)    console.log(`  shirt scale: ${top.scale.x.toFixed(4)}`);
    console.log(`  groupH: ${groupH.toFixed(3)}  camDist: ${camDist.toFixed(3)}`);
    console.groupEnd();
  }

  // ── Render loop ────────────────────────────────────────────────────────────

  private animate(): void {
    if (!this.isVisible) return;
    this.animId = requestAnimationFrame(() => this.animate());
    this.controls?.update();
    this.renderer.render(this.scene, this.camera);
  }

  @HostListener('window:resize')
  onResize(): void {
    if (!this.renderer || !this.camera || !this.canvasRef) return;
    const canvas = this.canvasRef.nativeElement;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (w > 0 && h > 0) {
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    }
  }

  // ── Cleanup ────────────────────────────────────────────────────────────────

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animId);
    this.observer?.disconnect();
    this.controls?.dispose();
    this.scene?.traverse(obj => {
      const mesh = obj as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.geometry?.dispose();
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        mats.forEach(m => m?.dispose());
      }
    });
    this.renderer?.dispose();
    this.renderer?.forceContextLoss();
  }
}
