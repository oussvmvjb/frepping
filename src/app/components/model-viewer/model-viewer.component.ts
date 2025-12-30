import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  AfterViewInit,
  HostListener
} from '@angular/core';

import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';

@Component({
  selector: 'app-model-viewer',
  templateUrl: './model-viewer.component.html',
  styleUrls: ['./model-viewer.component.scss']
})
export class ModelViewerComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() modelPath: string = '';
  @Input() autoRotate: boolean = true;
  @Input() autoScale: boolean = true;
  @Input() targetSize: number = 5;

  @ViewChild('canvas', { static: false })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private model: THREE.Group | THREE.Mesh | null = null;
  private animationId = 0;
  isLoaded = false;
  private currentRotationEnabled = true;

  ngOnInit(): void {
    this.currentRotationEnabled = this.autoRotate;
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initThreeJS();
      this.loadModel();
      this.animate();
    }, 100);
  }

  ngOnDestroy(): void {
    if (this.animationId) cancelAnimationFrame(this.animationId);
    if (this.renderer) this.renderer.dispose();
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    if (!this.camera || !this.renderer) return;

    const canvas = this.canvasRef.nativeElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  private initThreeJS(): void {
    const canvas = this.canvasRef.nativeElement;
    const width = canvas.clientWidth || 400;
    const height = canvas.clientHeight || 400;

    this.scene = new THREE.Scene();
    
    // Black background
    this.scene.background = new THREE.Color(0x000000);

    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.set(0, 2, 10);

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false // Changed to false for solid black background
    });

    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    this.setupLighting();
  }

  private setupLighting(): void {
    // Basic lighting for the model
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.6));

    const main = new THREE.DirectionalLight(0xffffff, 1);
    main.position.set(5, 10, 7);
    this.scene.add(main);

    const fill = new THREE.DirectionalLight(0xffffff, 0.4);
    fill.position.set(-5, 5, -5);
    this.scene.add(fill);
  }

  private loadModel(): void {
    if (!this.modelPath) {
      this.createPlaceholder();
      return;
    }

    const basePath = this.modelPath.substring(
      0,
      this.modelPath.lastIndexOf('/') + 1
    );
    const objFile = this.modelPath.split('/').pop()!;
    const mtlFile = objFile.replace('.obj', '.mtl');

    const mtlLoader = new MTLLoader();
    mtlLoader.setPath(basePath);

    mtlLoader.load(mtlFile, (materials) => {
      materials.preload();

      const objLoader = new OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.setPath(basePath);

      objLoader.load(objFile, (object) => {
        this.model = object;
        this.isLoaded = true;

        this.centerAndScale(object);
        this.scene.add(object);
        this.adjustCamera();
      });
    });
  }

  private centerAndScale(object: THREE.Group): void {
    const box = new THREE.Box3().setFromObject(object);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    object.position.set(-center.x, -center.y, -center.z);

    if (this.autoScale) {
      const scale = this.targetSize / Math.max(size.x, size.y, size.z);
      object.scale.setScalar(scale);
    }
  }

  private adjustCamera(): void {
    if (!this.model) return;

    const box = new THREE.Box3().setFromObject(this.model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    const dist = Math.max(size.x, size.y, size.z) * 2.5;
    this.camera.position.set(center.x, center.y + size.y * 0.3, center.z + dist);
    this.camera.lookAt(center);
  }

  public changeColor(hex: number): void {
    if (!this.model) return;

    this.model.traverse((child) => {
      if (
        child instanceof THREE.Mesh &&
        child.material instanceof THREE.MeshStandardMaterial &&
        child.material.map
      ) {
        child.material.color.setHex(hex);
      }
    });
  }

  private createPlaceholder(): void {
    const geo = new THREE.BoxGeometry(3, 4, 0.2);
    const mat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const mesh = new THREE.Mesh(geo, mat);
    this.scene.add(mesh);
    this.model = mesh;
    this.isLoaded = true;
  }

  private animate(): void {
    this.animationId = requestAnimationFrame(() => this.animate());

    if (this.model && this.currentRotationEnabled) {
      this.model.rotation.y += 0.005;
    }

    this.renderer.render(this.scene, this.camera);
  }
}