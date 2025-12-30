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
  @Input() backgroundColor: string = '#000000';
  
  // FORCER le chargement du fond de rue
  addStreetBackground: boolean = true;
  @Input() debugMode: boolean = true;

  @ViewChild('canvas', { static: false })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private model: THREE.Group | THREE.Mesh | null = null;
  private streetBackground: THREE.Group | THREE.Object3D | null = null;
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

  // Chemins à tester pour le fond
  backgroundPaths = [
    'assets/shoot_background__graffiti_street.glb',
    'assets/models/shoot_background__graffiti_street.glb',
    'assets/3d/shoot_background__graffiti_street.glb',
    'assets/backgrounds/shoot_background__graffiti_street.glb',
    'assets/textures/shoot_background__graffiti_street.glb',
    '/assets/shoot_background__graffiti_street.glb',
    './assets/shoot_background__graffiti_street.glb',
    'shoot_background__graffiti_street.glb'
  ];

  // UI state
  showDebugPanel = true;
  manualPath = 'assets/shoot_background__graffiti_street.glb';
children: any;

  constructor(private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.currentRotationEnabled = this.autoRotate;
    console.log('🎮 TestViewerComponent initialisé - FORCEMENT du fond de rue!');
    console.log('📍 Chemins à tester:', this.backgroundPaths);
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
    console.log('📦 Début du chargement - FORCEMENT du fond de rue!');
    
    try {
      // TOUJOURS charger le fond de rue
      console.log('🏙️ FORCEMENT du chargement du fond de rue...');
      await this.loadStreetBackground();

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

  private async loadStreetBackground(): Promise<void> {
    console.log('🔍 Recherche du fichier shoot_background__graffiti_street.glb...');
    
    // Vider les anciennes données
    this.debugInfo.testedPaths = [];
    this.debugInfo.foundPath = '';
    this.debugInfo.backgroundLoaded = false;

    // Tester tous les chemins
    for (const path of this.backgroundPaths) {
      console.log(`🔎 Test du chemin: ${path}`);
      this.debugInfo.testedPaths.push(path);
      
      const loaded = await this.tryLoadGLB(path);
      if (loaded) {
        this.debugInfo.foundPath = path;
        this.debugInfo.backgroundLoaded = true;
        console.log(`✅ FOND TROUVÉ ET CHARGÉ: ${path}`);
        return;
      }
    }

    // Si aucun chemin ne fonctionne
    console.warn('⚠️ Aucun chemin valide trouvé pour le fond');
    this.debugInfo.backgroundError = 'Fichier non trouvé';
    this.createDefaultBackground();
  }

  private tryLoadGLB(path: string): Promise<boolean> {
    return new Promise((resolve) => {
      const gltfLoader = new GLTFLoader();
      
      gltfLoader.load(
        path,
        (gltf) => {
          console.log(`🎉 SUCCÈS: Fichier trouvé à ${path}`);
          console.log('📦 Contenu du GLB:', gltf);
          
          this.streetBackground = gltf.scene;
          
          // Ajuster la position et l'échelle
          this.streetBackground.position.set(0, -2, -15);
          this.streetBackground.scale.set(3, 3, 3);
          
          // Activer les ombres
          this.streetBackground.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });
          
          this.scene.add(this.streetBackground);
          
          // Mettre à jour la caméra pour voir le fond
          this.camera.position.set(0, 3, 10);
          this.camera.lookAt(0, 0, -10);
          
          resolve(true);
        },
        (progress) => {
          if (progress.lengthComputable) {
            const percent = (progress.loaded / progress.total * 100).toFixed(1);
            console.log(`📥 ${path}: ${percent}%`);
          }
        },
        (error) => {
          console.log(`❌ ${path}: ${onmessage || 'Non trouvé'}`);
          resolve(false);
        }
      );
      
      // Timeout après 3 secondes
      setTimeout(() => {
        console.log(`⏱️ Timeout pour ${path}`);
        resolve(false);
      }, 3000);
    });
  }

  private createDefaultBackground(): void {
    console.log('🎨 Création d\'un fond par défaut');
    
    // Sol simple
    const floorGeometry = new THREE.PlaneGeometry(100, 100);
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0x333333,
      roughness: 0.9
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -5;
    floor.receiveShadow = true;
    this.scene.add(floor);

    // Mur avec couleur aléatoire
    const wallGeometry = new THREE.PlaneGeometry(80, 40);
    const wallMaterial = new THREE.MeshStandardMaterial({
      color: Math.random() * 0xffffff
    });
    const wall = new THREE.Mesh(wallGeometry, wallMaterial);
    wall.position.z = -30;
    wall.position.y = 15;
    this.scene.add(wall);
    
    console.log('✅ Fond par défaut créé');
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

  // Méthode pour tester un chemin manuel
  async testManualPath(): Promise<void> {
    console.log(`🧪 Test manuel du chemin: ${this.manualPath}`);
    
    // Supprimer l'ancien fond si présent
    if (this.streetBackground) {
      this.scene.remove(this.streetBackground);
      this.streetBackground = null;
    }
    
    // Tester le nouveau chemin
    const loaded = await this.tryLoadGLB(this.manualPath);
    
    if (loaded) {
      this.debugInfo.foundPath = this.manualPath;
      this.debugInfo.backgroundLoaded = true;
      alert(`✅ FOND CHARGÉ: ${this.manualPath}`);
    } else {
      alert(`❌ FOND NON TROUVÉ: ${this.manualPath}`);
    }
    
    this.cdRef.detectChanges();
  }

  // Méthode pour vérifier l'arborescence des assets
  checkAssetStructure(): void {
    console.log('📁 Structure des assets attendue:');
    console.log('src/assets/');
    console.log('├── shoot_background__graffiti_street.glb');
    console.log('├── models/');
    console.log('│   └── vos-modeles.glb');
    console.log('└── ...');
    
    // Vérifier avec une requête HTTP simple
    this.testAssetPaths();
  }

  private async testAssetPaths(): Promise<void> {
    console.log('🔍 Test HTTP des chemins...');
    
    for (const path of this.backgroundPaths) {
      try {
        const response = await fetch(path, { method: 'HEAD' });
        console.log(`${response.ok ? '✅' : '❌'} ${path}: ${response.status} ${response.statusText}`);
      } catch (error) {
        console.log(`❌ ${path}: ${onmessage || 'Erreur inconnue'}`);
      }
    }
  }

  printDebugInfo(): void {
    console.log('=== 📊 DEBUG INFO ===');
    console.log('État du chargement:', this.debugInfo);
    console.log('Objets dans la scène:', this.scene.children.length);
    this.scene.children.forEach((child, i) => {
      console.log(`  ${i}. ${child.constructor.name} "${child.name || 'sans nom'}"`);
    });
    console.log('====================');
  }

  private animate(): void {
    this.animationId = requestAnimationFrame(() => this.animate());
    this.renderer.render(this.scene, this.camera);
  }
}