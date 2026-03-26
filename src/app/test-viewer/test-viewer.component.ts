import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  AfterViewInit,
  HostListener,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

@Component({
  selector: 'app-test-viewer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './test-viewer.component.html',
  styleUrls: ['./test-viewer.component.scss']
})
export class TestViewerComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() modelPath: string = '';
  @Input() autoRotate: boolean = true;
  @Input() autoScale: boolean = true;
  @Input() targetSize: number = 5;
  @Input() debugMode: boolean = true;

  @ViewChild('canvas', { static: false })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private model: THREE.Group | THREE.Mesh | null = null;
  private animationId = 0;
  
  isLoaded = false;
  isLoading = false;
  private currentRotationEnabled = true;
  
  // Informations de débogage
  debugInfo = {
    mainModelLoaded: false,
    backgroundLoaded: false,
    backgroundError: '',
    mainModelError: '',
    testedPaths: [] as string[],
    foundPath: ''
  };

  // UI state
  showDebugPanel = true;

  constructor(private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.currentRotationEnabled = this.autoRotate;
    console.log('🎮 TestViewerComponent initialisé');
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

  private initThreeJS(): void {
    try {
      const canvas = this.canvasRef.nativeElement;
      const width = canvas.clientWidth || 400;
      const height = canvas.clientHeight || 400;

      console.log('🚀 Initialisation ThreeJS:', { width, height });

      this.scene = new THREE.Scene();
      
      // Fond noir par défaut
      this.scene.background = new THREE.Color(0x000000);

      this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      this.camera.position.set(0, 2, 10);

      this.renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: false
      });

      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.renderer.outputColorSpace = THREE.SRGBColorSpace;
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      this.setupLighting();
      console.log('✅ ThreeJS initialisé avec succès');
    } catch (error) {
      console.error('❌ Erreur ThreeJS:', error);
    }
  }

  private setupLighting(): void {
    // Plus de lumière pour bien voir le fond
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
    mainLight.position.set(10, 20, 15);
    mainLight.castShadow = true;
    this.scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
    fillLight.position.set(-10, 10, -10);
    this.scene.add(fillLight);
  }

  private async loadModel(): Promise<void> {
    this.isLoading = true;
    console.log('📦 Début du chargement');
    
    try {
      // Charger le modèle principal si fourni
      if (this.modelPath) {
        await this.loadMainModel();
      } else {
        this.createPlaceholder();
      }
      
      this.isLoaded = true;
      this.isLoading = false;
      this.cdRef.detectChanges();
      
      console.log('🎉 Chargement terminé');
      this.printDebugInfo();
    } catch (error) {
      console.error('💥 Erreur:', error);
      this.isLoading = false;
      this.cdRef.detectChanges();
    }
  }

  private async loadMainModel(): Promise<void> {
    // Votre code existant pour charger le modèle principal
    console.log('🎯 Chargement du modèle principal:', this.modelPath);
    // ... code existant ...
  }

  private createPlaceholder(): void {
    const geometry = new THREE.BoxGeometry(2, 3, 2);
    const material = new THREE.MeshStandardMaterial({ 
      color: 0xff3366,
      roughness: 0.4
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, 0);
    mesh.castShadow = true;
    
    this.scene.add(mesh);
    this.model = mesh;
    this.debugInfo.mainModelLoaded = true;
    console.log('✅ Placeholder créé');
  }

  printDebugInfo(): void {
    console.log('=== 📊 DEBUG INFO ===');
    console.log('État du chargement:', this.debugInfo);
    console.log('Objets dans la scène:', this.scene.children.length);
    this.scene.children.forEach((child: any, i: number) => {
      console.log(`  ${i}. ${child.constructor.name} "${child.name || 'sans nom'}"`);
    });
    console.log('====================');
  }

  private animate(): void {
    this.animationId = requestAnimationFrame(() => this.animate());
    this.renderer.render(this.scene, this.camera);
  }
}