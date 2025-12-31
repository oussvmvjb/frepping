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
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

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
  @Input() addStreetBackground: boolean = true;

  @ViewChild('canvas', { static: false })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private model: THREE.Group | THREE.Mesh | null = null;
  private streetBackground: THREE.Group | null = null;
  private animationId = 0;
  isLoaded = false;
  private currentRotationEnabled = true;

  ngOnInit(): void {
    this.currentRotationEnabled = this.autoRotate;
    console.log('🎮 ModelViewerComponent - ngOnInit');
    console.log('📊 Input values:', {
      modelPath: this.modelPath,
      addStreetBackground: this.addStreetBackground,
      autoRotate: this.autoRotate
    });
  }

  ngAfterViewInit(): void {
    console.log('🚀 ModelViewerComponent - ngAfterViewInit');
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
    console.log('🔧 Initialisation ThreeJS...');
    const canvas = this.canvasRef.nativeElement;
    const width = canvas.clientWidth || 400;
    const height = canvas.clientHeight || 400;

    console.log('📏 Canvas dimensions:', { width, height });

    this.scene = new THREE.Scene();
    
    // Fond noir
    this.scene.background = new THREE.Color(0x000000);
    console.log('🎨 Fond noir défini');

    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.set(0, 3, 12);

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
    console.log('✅ ThreeJS initialisé');
  }

  private setupLighting(): void {
    console.log('💡 Configuration des lumières...');
    
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1);
    mainLight.position.set(10, 15, 10);
    mainLight.castShadow = true;
    this.scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
    fillLight.position.set(-10, 5, -5);
    this.scene.add(fillLight);
    
    console.log('✅ Lumières ajoutées');
  }

  private loadModel(): void {
    console.log('📦 Début du chargement...');
    console.log('📍 Chemin du modèle:', this.modelPath);
    console.log('🏙️ Ajout fond de rue:', this.addStreetBackground);

    if (this.addStreetBackground) {
      console.log('🏢 Tentative de chargement du fond de rue...');
      this.loadStreetBackground().then(() => {
        console.log('✅ Fond de rue chargé');
        this.loadMainModel();
      }).catch((error) => {
        console.error('❌ Erreur chargement fond:', error);
        this.createSimpleBackground();
        this.loadMainModel();
      });
    } else {
      console.log('⚫ Pas de fond demandé');
      this.loadMainModel();
    }
  }

  private async loadStreetBackground(): Promise<void> {
    console.log('🔍 Recherche du fichier GLB...');
    
    return new Promise((resolve, reject) => {
      const gltfLoader = new GLTFLoader();
      
      // Test de plusieurs chemins
      const paths = [
        'assets/shoot_background__graffiti_street.glb',
        './assets/shoot_background__graffiti_street.glb',
        '/assets/shoot_background__graffiti_street.glb'
      ];

      let currentPath = 0;

      const tryLoad = () => {
        if (currentPath >= paths.length) {
          console.error('❌ Tous les chemins ont échoué');
          reject(new Error('Fichier non trouvé'));
          return;
        }

        const path = paths[currentPath];
        console.log(`🔄 Test du chemin: ${path}`);

        gltfLoader.load(
          path,
          (gltf) => {
            console.log(`✅ Fichier trouvé à: ${path}`);
            console.log('📦 Contenu GLTF:', gltf);
            
            this.streetBackground = gltf.scene;
            this.streetBackground.position.set(0, -3, -20);
            this.streetBackground.scale.set(4, 4, 4);
            
            // Activer les ombres
            this.streetBackground.traverse((child) => {
              if (child instanceof THREE.Mesh) {
                child.castShadow = true;
                child.receiveShadow = true;
              }
            });
            
            this.scene.add(this.streetBackground);
            console.log('✅ Fond ajouté à la scène');
            resolve();
          },
          (progress) => {
            console.log(`📥 Progression: ${progress.loaded}/${progress.total}`);
          },
          (error) => {
            console.error(`❌ Erreur avec ${path}:`, error);
            currentPath++;
            setTimeout(tryLoad, 100);
          }
        );
      };

      tryLoad();
    });
  }

  private createSimpleBackground(): void {
    console.log('🎨 Création d\'un fond simple...');
    
    // Sol
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

    // Fond dégradé
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    
    const gradient = ctx.createLinearGradient(0, 0, 0, 256);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(1, '#0f3460');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);
    
    const texture = new THREE.CanvasTexture(canvas);
    this.scene.background = texture;
    
    console.log('✅ Fond simple créé');
  }

  private loadMainModel(): void {
    console.log('🎯 Chargement du modèle principal...');
    
    if (!this.modelPath) {
      console.log('⚠️ Pas de chemin de modèle, création placeholder');
      this.createPlaceholder();
      this.isLoaded = true;
      return;
    }

    console.log('📂 Chemin du modèle:', this.modelPath);
    
    // Vérifier si c'est un fichier .obj
    if (this.modelPath.toLowerCase().endsWith('.obj')) {
      console.log('🎯 Format: OBJ');
      this.loadOBJModel();
    } else {
      console.log('⚠️ Format non supporté, création placeholder');
      this.createPlaceholder();
      this.isLoaded = true;
    }
  }

  private loadOBJModel(): void {
    console.log('📦 Chargement OBJ...');
    
    const basePath = this.modelPath.substring(
      0,
      this.modelPath.lastIndexOf('/') + 1
    );
    const objFile = this.modelPath.split('/').pop()!;
    const mtlFile = objFile.replace('.obj', '.mtl');

    console.log('📁 Dossier:', basePath);
    console.log('📄 Fichier OBJ:', objFile);
    console.log('🎨 Fichier MTL:', mtlFile);

    const mtlLoader = new MTLLoader();
    mtlLoader.setPath(basePath);

    mtlLoader.load(
      mtlFile,
      (materials) => {
        console.log('✅ MTL chargé');
        materials.preload();

        const objLoader = new OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.setPath(basePath);

        objLoader.load(
          objFile,
          (object) => {
            console.log('✅ OBJ chargé:', object);
            this.model = object;
            
            // Activer les ombres
            object.traverse((child) => {
              if (child instanceof THREE.Mesh) {
                child.castShadow = true;
                child.receiveShadow = true;
              }
            });

            this.centerAndScale(object);
            this.scene.add(object);
            this.adjustCamera();
            this.isLoaded = true;
            console.log('🎉 Modèle chargé avec succès!');
          },
          (progress) => {
            console.log(`📥 Progression OBJ: ${progress.loaded}`);
          },
          (error) => {
            console.error('❌ Erreur chargement OBJ:', error);
            this.createPlaceholder();
            this.isLoaded = true;
          }
        );
      },
      (progress) => {
        console.log(`📥 Progression MTL: ${progress.loaded}`);
      },
      (error) => {
        console.error('❌ Erreur chargement MTL:', error);
        this.createPlaceholder();
        this.isLoaded = true;
      }
    );
  }

  private centerAndScale(object: THREE.Group): void {
    console.log('📐 Centrage et mise à l\'échelle...');
    
    const box = new THREE.Box3().setFromObject(object);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    console.log('📏 Taille:', size);
    console.log('🎯 Centre:', center);

    object.position.set(-center.x, -center.y, -center.z);

    if (this.autoScale) {
      const scale = this.targetSize / Math.max(size.x, size.y, size.z);
      console.log('⚖️ Échelle:', scale);
      object.scale.setScalar(scale);
    }
  }

  private adjustCamera(): void {
    if (!this.model) return;

    console.log('📷 Ajustement caméra...');
    
    const box = new THREE.Box3().setFromObject(this.model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    const dist = Math.max(size.x, size.y, size.z) * (this.addStreetBackground ? 3 : 2.5);
    console.log('📐 Distance caméra:', dist);

    this.camera.position.set(
      center.x, 
      center.y + size.y * 0.4, 
      center.z + dist
    );
    
    const lookAt = new THREE.Vector3(center.x, center.y + size.y * 0.2, center.z);
    this.camera.lookAt(lookAt);
    
    console.log('📍 Position caméra:', this.camera.position);
    console.log('👀 Regarde vers:', lookAt);
  }

  public changeColor(hex: number): void {
    console.log(`🎨 Changement couleur: #${hex.toString(16)}`);
    
    if (!this.model) return;

    this.model.traverse((child) => {
      if (
        child instanceof THREE.Mesh &&
        child.material instanceof THREE.MeshStandardMaterial
      ) {
        child.material.color.setHex(hex);
      }
    });
  }

  private createPlaceholder(): void {
    console.log('🎨 Création placeholder...');
    
    const geometry = new THREE.BoxGeometry(3, 4, 0.2);
    const material = new THREE.MeshStandardMaterial({ 
      color: 0xff3366,
      roughness: 0.4,
      metalness: 0.6
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    
    this.scene.add(mesh);
    this.model = mesh;
    
    console.log('✅ Placeholder créé');
  }

  private animate(): void {
    this.animationId = requestAnimationFrame(() => this.animate());

    if (this.model && this.currentRotationEnabled) {
      this.model.rotation.y += 0.005;
    }

    this.renderer.render(this.scene, this.camera);
  }
} 