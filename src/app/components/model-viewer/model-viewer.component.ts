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
    
    // FORCER LE CHEMIN SPÉCIFIQUE POUR TESTER
    if (!this.modelPath || this.modelPath === '') {
      console.log('⚠️ Pas de chemin fourni, utilisation du chemin de test spécifique');
      this.modelPath = 'assets/3dmodel/uploads_files_5109932_米白印花卫衣/米白印花卫衣.obj';
    }
    
    console.log('📍 Chemin final utilisé:', this.modelPath);
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
    this.camera.position.set(0, 3, 15);

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
    
    // PLUS de lumière pour bien voir
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
    mainLight.position.set(10, 20, 15);
    mainLight.castShadow = true;
    this.scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.6);
    fillLight.position.set(-15, 10, -10);
    this.scene.add(fillLight);
    
    // Lumière arrière
    const backLight = new THREE.DirectionalLight(0xffffff, 0.4);
    backLight.position.set(0, 10, -15);
    this.scene.add(backLight);
    
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
            this.streetBackground.position.set(0, -3, -25);
            this.streetBackground.scale.set(5, 5, 5);
            
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
    console.log('📂 Chemin spécifique utilisé:', this.modelPath);
    
    // Vérifier si c'est un fichier .obj
    if (this.modelPath.toLowerCase().endsWith('.obj')) {
      console.log('🎯 Format: OBJ');
      this.loadOBJModel();
    } else {
      console.log('⚠️ Format non supporté, création d\'un modèle 3D simple');
      this.createSimple3DModel();
      this.isLoaded = true;
    }
  }

  private loadOBJModel(): void {
    console.log('📦 Début du chargement OBJ...');
    
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

    console.log('🔄 Tentative de chargement MTL...');
    
    mtlLoader.load(
      mtlFile,
      (materials) => {
        console.log('✅ MTL chargé avec succès!');
        console.log('🎨 Matériaux:', materials);
        materials.preload();

        const objLoader = new OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.setPath(basePath);

        console.log('🔄 Tentative de chargement OBJ...');
        
        objLoader.load(
          objFile,
          (object) => {
            console.log('✅ OBJ chargé avec succès!');
            console.log('📦 Modèle:', object);
            
            this.model = object;
            
            // Activer les ombres
            object.traverse((child) => {
              if (child instanceof THREE.Mesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                
                // Optimiser les matériaux
                if (child.material instanceof THREE.MeshStandardMaterial) {
                  child.material.roughness = 0.5;
                  child.material.metalness = 0.5;
                  console.log(`🎨 Matériau optimisé: ${child.name || 'sans nom'}`);
                }
              }
            });

            this.centerAndScale(object);
            this.scene.add(object);
            this.adjustCamera();
            this.isLoaded = true;
            console.log('🎉 Modèle OBJ chargé avec succès!');
          },
          (progress) => {
            const percent = progress.total ? (progress.loaded / progress.total * 100).toFixed(1) : '0.0';
            console.log(`📥 Progression OBJ: ${percent}%`);
          },
          (error) => {
            console.error('❌ Erreur chargement OBJ:', error);
            console.log('⚠️ Création d\'un modèle 3D simple à la place');
            this.createSimple3DModel();
            this.isLoaded = true;
          }
        );
      },
      (progress) => {
        const percent = progress.total ? (progress.loaded / progress.total * 100).toFixed(1) : '0.0';
        console.log(`📥 Progression MTL: ${percent}%`);
      },
      (error) => {
        console.error('❌ Erreur chargement MTL:', error);
        console.log('⚠️ Tentative de chargement OBJ sans MTL...');
        this.loadOBJWithoutMTL();
      }
    );
  }

  private loadOBJWithoutMTL(): void {
    console.log('🔄 Tentative de chargement OBJ sans MTL...');
    
    const basePath = this.modelPath.substring(
      0,
      this.modelPath.lastIndexOf('/') + 1
    );
    const objFile = this.modelPath.split('/').pop()!;

    const objLoader = new OBJLoader();
    objLoader.setPath(basePath);

    objLoader.load(
      objFile,
      (object) => {
        console.log('✅ OBJ chargé sans MTL!');
        this.model = object;
        
        // Appliquer un matériau par défaut
        object.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            
            // Appliquer un matériau standard
            child.material = new THREE.MeshStandardMaterial({
              color: 0x39ff14,
              roughness: 0.5,
              metalness: 0.3
            });
          }
        });

        this.centerAndScale(object);
        this.scene.add(object);
        this.adjustCamera();
        this.isLoaded = true;
        console.log('🎉 Modèle chargé avec matériau par défaut');
      },
      (progress) => {
        const percent = progress.total ? (progress.loaded / progress.total * 100).toFixed(1) : '0.0';
        console.log(`📥 Progression OBJ (sans MTL): ${percent}%`);
      },
      (error) => {
        console.error('❌ Erreur chargement OBJ sans MTL:', error);
        console.log('⚠️ Création d\'un modèle 3D simple');
        this.createSimple3DModel();
        this.isLoaded = true;
      }
    );
  }

  private createSimple3DModel(): void {
    console.log('🎨 Création d\'un modèle 3D simple (hoodie)...');
    
    const modelGroup = new THREE.Group();
    
    // Corps du hoodie
    const bodyGeometry = new THREE.BoxGeometry(3, 4, 0.8);
    const bodyMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x39ff14,
      roughness: 0.4,
      metalness: 0.2
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0;
    body.castShadow = true;
    body.receiveShadow = true;
    modelGroup.add(body);
    
    // Capuche
    const hoodGeometry = new THREE.ConeGeometry(1.5, 2, 8);
    const hoodMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x39ff14,
      roughness: 0.5
    });
    const hood = new THREE.Mesh(hoodGeometry, hoodMaterial);
    hood.position.y = 2.5;
    hood.rotation.x = Math.PI;
    hood.castShadow = true;
    modelGroup.add(hood);
    
    // Manches
    const sleeveGeometry = new THREE.CylinderGeometry(0.4, 0.6, 2.5, 8);
    const sleeveMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x39ff14,
      roughness: 0.5
    });
    
    const leftSleeve = new THREE.Mesh(sleeveGeometry, sleeveMaterial);
    leftSleeve.position.set(-2, 0.5, 0);
    leftSleeve.rotation.z = Math.PI / 2;
    leftSleeve.castShadow = true;
    modelGroup.add(leftSleeve);
    
    const rightSleeve = new THREE.Mesh(sleeveGeometry, sleeveMaterial);
    rightSleeve.position.set(2, 0.5, 0);
    rightSleeve.rotation.z = Math.PI / 2;
    rightSleeve.castShadow = true;
    modelGroup.add(rightSleeve);
    
    // Poche
    const pocketGeometry = new THREE.BoxGeometry(2, 1.5, 0.1);
    const pocketMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xff3366,
      roughness: 0.3
    });
    const pocket = new THREE.Mesh(pocketGeometry, pocketMaterial);
    pocket.position.set(0, -0.8, 0.41);
    modelGroup.add(pocket);
    
    // Logo/text
    const logoGeometry = new THREE.PlaneGeometry(1.5, 0.5);
    const logoMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xffffff,
      roughness: 0.2,
      metalness: 0.8
    });
    const logo = new THREE.Mesh(logoGeometry, logoMaterial);
    logo.position.set(0, 0.5, 0.41);
    modelGroup.add(logo);
    
    this.model = modelGroup;
    this.scene.add(this.model);
    
    this.centerAndScale(modelGroup);
    this.adjustCamera();
    
    console.log('✅ Modèle 3D simple créé');
  }

private centerAndScale(object: THREE.Group): void {
  console.log('📐 Centrage et mise à léchelle...');
  
  const box = new THREE.Box3().setFromObject(object);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());

  console.log('📏 Taille originale:', size);
  console.log('🎯 Centre original:', center);

  // 1. Réinitialiser la position
  object.position.set(0, 0, 0);
  
  // 2. Mettre à l'échelle D'ABORD
  if (this.autoScale) {
    const scale = this.targetSize / Math.max(size.x, size.y, size.z);
    console.log('⚖️ Échelle nécessaire:', scale);
    object.scale.setScalar(scale);
    
    // Mettre à jour la boîte après mise à l'échelle
    box.setFromObject(object);
  }
  
  // 3. Obtenir les nouvelles dimensions
  const newSize = box.getSize(new THREE.Vector3());
  const min = box.min;
  const max = box.max;
  
  console.log('📏 Taille après échelle:', newSize);
  console.log('📍 Min/Max:', { min, max });
  
  // 4. Positionner pour que le bas soit au sol
  // Le fond de rue est à Y = -3 à -5
  object.position.y = -min.y; // Mettre le bas à Y=0
  
  // 5. Centrer sur X et Z seulement
  const newCenter = box.getCenter(new THREE.Vector3());
  object.position.x = -newCenter.x;
  object.position.z = -newCenter.z;
  
  console.log('✅ Position finale:', object.position);
}

private adjustCamera(): void {
  if (!this.model) return;

  console.log('📷 Ajustement caméra...');
  
  const box = new THREE.Box3().setFromObject(this.model);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());

  // La caméra doit être au DESSUS du modèle, pas en dessous
  const dist = Math.max(size.x, size.y, size.z) * 2.5;
  console.log('📐 Distance caméra:', dist);

  // Positionner la caméra AU-DESSUS du modèle
  this.camera.position.set(
    center.x, 
    center.y + size.y + 5, // Au-dessus du modèle
    center.z + dist
  );
  
  // Regarder le centre du modèle
  this.camera.lookAt(center);
  
  console.log('📍 Position caméra:', this.camera.position);
  console.log('👀 Regarde vers:', center);
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

  private animate(): void {
    this.animationId = requestAnimationFrame(() => this.animate());

    if (this.model && this.currentRotationEnabled) {
      this.model.rotation.y += 0.005;
    }

    this.renderer.render(this.scene, this.camera);
  }
}