import {
  Component, Input, OnInit, OnDestroy, OnChanges, SimpleChanges,
  ElementRef, ViewChild, AfterViewInit, HostListener
} from '@angular/core';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

@Component({
  selector: 'app-model-viewer',
  templateUrl: './model-viewer.component.html',
  styleUrls: ['./model-viewer.component.scss']
})
export class ModelViewerComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @Input() modelPath: string = '';
  @Input() autoRotate: boolean = true;
  @Input() autoScale: boolean = true;
  @Input() targetSize: number = 5;
  @Input() enableControls: boolean = true;

  @ViewChild('canvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private model: THREE.Group | THREE.Mesh | null = null;
  private controls: OrbitControls | null = null;
  private animationId = 0;
  private observer!: IntersectionObserver; // ← جديد
  private isVisible = false;              // ← جديد
  isLoaded = false;

  ngOnInit(): void {
    if (!this.modelPath) {
      this.modelPath = 'assets/3dmodel/uploads_files_5109932_米白印花卫衣/米白印花卫衣.obj';
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['modelPath'] && !changes['modelPath'].firstChange) {
      if (this.scene && this.renderer) {
        this.reloadModel();
      }
    }
    if (changes['autoRotate'] && this.controls) {
      this.controls.autoRotate = this.autoRotate;
    }
  }

  ngAfterViewInit(): void {
    // ← لا تحمّل إلا إذا العنصر ظاهر على الشاشة
    this.setupIntersectionObserver();
  }

  // ✅ FIX 1: Intersection Observer - يشتغل فقط لما يظهر
  private setupIntersectionObserver(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          this.isVisible = entry.isIntersecting;

          if (entry.isIntersecting && !this.isLoaded) {
            // أول مرة يظهر → حمّل الموديل
            setTimeout(() => {
              this.initThreeJS();
              this.loadModel();
              this.animate();
            }, 100);
          } else if (!entry.isIntersecting) {
            // اختفى → وقّف الـ animation
            if (this.animationId) {
              cancelAnimationFrame(this.animationId);
              this.animationId = 0;
            }
          } else if (entry.isIntersecting && this.isLoaded) {
            // رجع للشاشة → استأنف
            this.animate();
          }
        });
      },
      { threshold: 0.1 } // 10% من العنصر ظاهر يكفي
    );

    this.observer.observe(this.canvasRef.nativeElement);
  }

  private initThreeJS(): void {
    const canvas = this.canvasRef.nativeElement;
    const width = canvas.clientWidth || 400;
    const height = canvas.clientHeight || 400;

    this.scene = new THREE.Scene();
    this.scene.background = null;

    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.set(0, 2, 10);

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'low-power'
    });

    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.shadowMap.enabled = false;

    if (this.enableControls) {
      this.controls = new OrbitControls(this.camera, canvas);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
      this.controls.enableZoom = true;
      this.controls.autoRotate = this.autoRotate;
      this.controls.autoRotateSpeed = 2.0;
    }

    this.setupLighting();
  }

  private setupLighting(): void {
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    this.scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.4);
    mainLight.position.set(10, 20, 15);
    mainLight.castShadow = false;
    this.scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.8);
    fillLight.position.set(-15, 10, -10);
    this.scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x39ff14, 0.5);
    rimLight.position.set(0, -10, -15);
    this.scene.add(rimLight);
  }

  public clearCurrentModel(): void {
    if (this.model && this.scene) {
      this.scene.remove(this.model);
      this.model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry?.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach(m => m.dispose());
          } else if (child.material) {
            child.material.dispose();
          }
        }
      });
      this.model = null;
    }
  }

  public reloadModel(): void {
    this.isLoaded = false;
    this.clearCurrentModel();
    if (this.scene) {
      this.loadModel();
    }
  }

  private loadModel(): void {
    this.loadMainModel();
  }

  private loadMainModel(): void {
    if (this.modelPath.toLowerCase().endsWith('.obj')) {
      this.loadOBJModel();
    } else if (this.modelPath.toLowerCase().endsWith('.glb') ||
               this.modelPath.toLowerCase().endsWith('.gltf')) {
      this.loadGLTFModel(); // ✅ دعم GLTF مضاف
    } else {
      this.createSimple3DModel();
      this.isLoaded = true;
    }
  }

  // ✅ FIX 5: دعم GLTF/GLB (أخف من OBJ)
  private loadGLTFModel(): void {
    const currentPath = this.modelPath;
    const loader = new GLTFLoader();
    loader.load(
      currentPath,
      (gltf) => {
        if (this.modelPath !== currentPath) return;
        this.clearCurrentModel();
        this.model = gltf.scene;
        this.centerAndScale(gltf.scene);
        this.scene.add(gltf.scene);
        this.adjustCamera();
        this.isLoaded = true;
      },
      undefined,
      (error) => {
        if (this.modelPath !== currentPath) return;
        console.error('Error loading GLTF model:', error);
        this.createSimple3DModel();
        this.isLoaded = true;
      }
    );
  }

  private loadOBJModel(): void {
    const basePath = this.modelPath.substring(0, this.modelPath.lastIndexOf('/') + 1);
    const objFile = this.modelPath.split('/').pop()!;
    const mtlFile = objFile.replace('.obj', '.mtl');

    const mtlLoader = new MTLLoader();
    mtlLoader.setPath(basePath);
    mtlLoader.load(
      mtlFile,
      (materials) => {
        materials.preload();
        const objLoader = new OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.setPath(basePath);
        objLoader.load(
          objFile,
          (object) => {
            this.model = object;
            // ✅ FIX 6: لا shadows في بطاقات المنتجات
            object.traverse((child) => {
              if (child instanceof THREE.Mesh) {
                child.castShadow = false;
                child.receiveShadow = false;
              }
            });
            this.centerAndScale(object);
            this.scene.add(object);
            this.adjustCamera();
            this.isLoaded = true;
          },
          undefined,
          () => { this.createSimple3DModel(); this.isLoaded = true; }
        );
      },
      undefined,
      () => this.loadOBJWithoutMTL()
    );
  }

  private loadOBJWithoutMTL(): void {
    const basePath = this.modelPath.substring(0, this.modelPath.lastIndexOf('/') + 1);
    const objFile = this.modelPath.split('/').pop()!;
    const objLoader = new OBJLoader();
    objLoader.setPath(basePath);
    objLoader.load(
      objFile,
      (object) => {
        this.model = object;
        object.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = false;
            child.material = new THREE.MeshStandardMaterial({
              color: 0x39ff14, roughness: 0.5, metalness: 0.3
            });
          }
        });
        this.centerAndScale(object);
        this.scene.add(object);
        this.adjustCamera();
        this.isLoaded = true;
      },
      undefined,
      () => { this.createSimple3DModel(); this.isLoaded = true; }
    );
  }

  private createSimple3DModel(): void {
    const modelGroup = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ color: 0x39ff14, roughness: 0.4 });

    const body = new THREE.Mesh(new THREE.BoxGeometry(3, 4, 0.8), mat);
    const hood = new THREE.Mesh(new THREE.ConeGeometry(1.5, 2, 8), mat);
    hood.position.y = 2.5; hood.rotation.x = Math.PI;
    const sleeveGeo = new THREE.CylinderGeometry(0.4, 0.6, 2.5, 8);
    const leftSleeve = new THREE.Mesh(sleeveGeo, mat);
    leftSleeve.position.set(-2, 0.5, 0); leftSleeve.rotation.z = Math.PI / 2;
    const rightSleeve = new THREE.Mesh(sleeveGeo, mat);
    rightSleeve.position.set(2, 0.5, 0); rightSleeve.rotation.z = Math.PI / 2;

    modelGroup.add(body, hood, leftSleeve, rightSleeve);
    this.model = modelGroup;
    this.scene.add(this.model);
    this.centerAndScale(modelGroup);
    this.adjustCamera();
  }

  private centerAndScale(object: THREE.Group): void {
    const box = new THREE.Box3().setFromObject(object);
    const size = box.getSize(new THREE.Vector3());

    if (this.autoScale) {
      const scale = this.targetSize / Math.max(size.x, size.y, size.z);
      object.scale.setScalar(scale);
      box.setFromObject(object);
    }

    const min = box.min;
    const newCenter = box.getCenter(new THREE.Vector3());
    object.position.set(-newCenter.x, -min.y, -newCenter.z);
  }

  public adjustCamera(): void {
    if (!this.model) return;
    const box = new THREE.Box3().setFromObject(this.model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const dist = maxDim * 2.0;
    this.camera.position.set(center.x, center.y + maxDim * 0.2, center.z + dist);
    this.camera.lookAt(center);

    if (this.controls) {
      this.controls.target.copy(center);
      this.controls.update();
      this.controls.saveState();
    }
  }

  public resetCamera(): void {
    if (this.controls) {
      this.controls.reset();
    } else {
      this.adjustCamera();
    }
  }

  public changeColor(hex: number): void {
    if (!this.model) return;
    this.model.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const materials = Array.isArray(child.material) ? child.material : [child.material];
        materials.forEach(mat => {
          if (mat && 'color' in mat && mat.color) {
            mat.color.setHex(hex);
          }
        });
      }
    });
  }

  private animate(): void {
    // ✅ FIX 7: لا تشتغل إذا مش ظاهر
    if (!this.isVisible) return;

    this.animationId = requestAnimationFrame(() => this.animate());

    if (this.controls) {
      this.controls.autoRotate = this.autoRotate;
      this.controls.update();
    } else if (this.model && this.autoRotate) {
      this.model.rotation.y += 0.005;
    }

    this.renderer.render(this.scene, this.camera);
  }

  @HostListener('window:resize')
  onResize(): void {
    if (!this.renderer || !this.camera || !this.canvasRef) return;
    const canvas = this.canvasRef.nativeElement;
    const width = canvas.clientWidth || 400;
    const height = canvas.clientHeight || 400;
    if (width > 0 && height > 0) {
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    }
  }

  ngOnDestroy(): void {
    // ✅ FIX 8: Cleanup كامل لمنع Memory Leaks
    if (this.animationId) cancelAnimationFrame(this.animationId);
    if (this.observer) this.observer.disconnect();
    if (this.controls) this.controls.dispose();

    if (this.scene) {
      this.scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach(m => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
    }

    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.forceContextLoss();
    }
  }
}