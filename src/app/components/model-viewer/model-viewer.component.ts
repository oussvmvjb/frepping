// model-viewer.component.ts
import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

@Component({
    selector: 'app-model-viewer',
    templateUrl: './model-viewer.component.html',
    styleUrls: ['./model-viewer.component.scss']
})
export class ModelViewerComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input() modelPath: string = '';
    @Input() autoRotate: boolean = true;
    @Input() autoScale: boolean = true;
    @Input() targetSize: number = 15;
    @Input() showHelpers: boolean = false;
    @Input() backgroundType: 'studio' | 'street' | 'showroom' | 'gradient' | 'custom' = 'studio'; // NEW
    @Input() customBackground: string = ''; // NEW: Custom image URL
    
    @ViewChild('canvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;

    private scene!: THREE.Scene;
    private camera!: THREE.PerspectiveCamera;
    private renderer!: THREE.WebGLRenderer;
    private model: THREE.Group | THREE.Mesh | null = null;
    private animationId: number = 0;
    private isLoaded = false;
    private currentRotationEnabled = true;
    private backgroundTexture: THREE.Texture | null = null;
    private backgroundMesh: THREE.Mesh | null = null;

    // Colors for different materials
    private readonly colors = [
        0xFF0000, 0x00FF00, 0x0000FF, 0xFFFF00,
        0xFF00FF, 0x00FFFF, 0xFF8800, 0x88FF00,
        0x0088FF, 0x8800FF
    ];

    constructor() { }

    ngOnInit(): void {
        this.currentRotationEnabled = this.autoRotate;
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.initThreeJS();
            this.loadModel();
            this.animate();
            this.setupResizeHandler();
        }, 100);
    }

    ngOnDestroy(): void {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.renderer) {
            this.renderer.dispose();
        }
        if (this.backgroundTexture) {
            this.backgroundTexture.dispose();
        }
        window.removeEventListener('resize', this.onWindowResize.bind(this));
    }

    @HostListener('window:resize')
    onWindowResize(): void {
        if (this.camera && this.renderer) {
            const canvas = this.canvasRef.nativeElement;
            const width = canvas.clientWidth;
            const height = canvas.clientHeight;
            
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(width, height);
        }
    }

    private setupResizeHandler(): void {
        window.addEventListener('resize', this.onWindowResize.bind(this));
    }

    private initThreeJS(): void {
        const canvas = this.canvasRef.nativeElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        
        console.log(`📐 Canvas dimensions: ${width}x${height}`);

        // Scene
        this.scene = new THREE.Scene();
        
        // SETUP BACKGROUND BASED ON TYPE
        this.setupBackground();

        // Camera
        this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
        this.camera.position.set(0, 2, 15);
        this.camera.lookAt(0, 1, 0);
        
        console.log('📷 Camera position:', this.camera.position);

        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: false,
            powerPreference: "high-performance"
        });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x000000, 1);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Lighting based on background type
        this.setupLighting();
    }

    private setupBackground(): void {
        switch(this.backgroundType) {
            case 'studio':
                this.createStudioBackground();
                break;
            case 'street':
                this.createStreetBackground();
                break;
            case 'showroom':
                this.createShowroomBackground();
                break;
            case 'gradient':
                this.createGradientBackground();
                break;
            case 'custom':
                if (this.customBackground) {
                    this.createCustomBackground(this.customBackground);
                } else {
                    this.createStudioBackground();
                }
                break;
            default:
                this.createStudioBackground();
        }
    }

    private createStudioBackground(): void {
        // Professional studio background
        const geometry = new THREE.SphereGeometry(500, 60, 40);
        geometry.scale(-1, 1, 1); // Invert for inside view
        
        const textureLoader = new THREE.TextureLoader();
        // You can replace this with your own studio HDR image
        const studioTexture = textureLoader.load('assets/textures/studio-background.jpg', 
            () => {
                console.log('✅ Studio background loaded');
            },
            undefined,
            (error) => {
                console.error('❌ Failed to load studio background:', error);
                this.createGradientBackground(); // Fallback
            }
        );
        
        const material = new THREE.MeshBasicMaterial({
            map: studioTexture,
            side: THREE.BackSide
        });
        
        this.backgroundMesh = new THREE.Mesh(geometry, material);
        this.scene.add(this.backgroundMesh);
        this.backgroundTexture = studioTexture;
    }

    private createStreetBackground(): void {
        // Street/urban background
        const geometry = new THREE.BoxGeometry(1000, 1000, 1000);
        geometry.scale(1, 1, -1); // Face inward
        
        const textureLoader = new THREE.TextureLoader();
        const streetTexture = textureLoader.load('assets/textures/street-background.jpg', 
            () => {
                console.log('✅ Street background loaded');
            },
            undefined,
            (error) => {
                console.error('❌ Failed to load street background:', error);
                this.createGradientBackground(); // Fallback
            }
        );
        
        streetTexture.wrapS = THREE.RepeatWrapping;
        streetTexture.wrapT = THREE.RepeatWrapping;
        streetTexture.repeat.set(4, 4);
        
        const material = new THREE.MeshBasicMaterial({
            map: streetTexture,
            side: THREE.BackSide
        });
        
        this.backgroundMesh = new THREE.Mesh(geometry, material);
        this.scene.add(this.backgroundMesh);
        this.backgroundTexture = streetTexture;
    }

    private createShowroomBackground(): void {
        // Modern showroom background
        const geometry = new THREE.PlaneGeometry(1000, 1000);
        geometry.rotateX(-Math.PI / 2);
        
        const floorTexture = new THREE.TextureLoader().load('assets/textures/floor-tiles.jpg');
        floorTexture.wrapS = THREE.RepeatWrapping;
        floorTexture.wrapT = THREE.RepeatWrapping;
        floorTexture.repeat.set(20, 20);
        
        const floorMaterial = new THREE.MeshStandardMaterial({
            map: floorTexture,
            roughness: 0.8,
            metalness: 0.2
        });
        
        const floor = new THREE.Mesh(geometry, floorMaterial);
        floor.position.y = -5;
        this.scene.add(floor);
        
        // Back wall
        const wallGeometry = new THREE.PlaneGeometry(1000, 500);
        wallGeometry.rotateY(Math.PI);
        
        const wallTexture = new THREE.TextureLoader().load('assets/textures/concrete-wall.jpg');
        wallTexture.wrapS = THREE.RepeatWrapping;
        wallTexture.wrapT = THREE.RepeatWrapping;
        wallTexture.repeat.set(4, 2);
        
        const wallMaterial = new THREE.MeshStandardMaterial({
            map: wallTexture,
            roughness: 0.7,
            metalness: 0.1
        });
        
        const wall = new THREE.Mesh(wallGeometry, wallMaterial);
        wall.position.z = -50;
        this.scene.add(wall);
        
        // Ceiling
        const ceilingGeometry = new THREE.PlaneGeometry(1000, 1000);
        ceilingGeometry.rotateX(Math.PI / 2);
        
        const ceilingMaterial = new THREE.MeshStandardMaterial({
            color: 0x222222,
            roughness: 0.9,
            metalness: 0.1
        });
        
        const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
        ceiling.position.y = 50;
        this.scene.add(ceiling);
    }

    private createGradientBackground(): void {
        // Fallback gradient background
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const context = canvas.getContext('2d')!;
        
        const gradient = context.createLinearGradient(0, 0, 256, 256);
        gradient.addColorStop(0, '#0a0a0a');
        gradient.addColorStop(0.5, '#1a1a1a');
        gradient.addColorStop(1, '#0a0a0a');
        
        context.fillStyle = gradient;
        context.fillRect(0, 0, 256, 256);
        
        const gradientTexture = new THREE.CanvasTexture(canvas);
        gradientTexture.wrapS = THREE.RepeatWrapping;
        gradientTexture.wrapT = THREE.RepeatWrapping;
        gradientTexture.repeat.set(4, 4);
        
        const geometry = new THREE.SphereGeometry(500, 60, 40);
        geometry.scale(-1, 1, 1);
        
        const material = new THREE.MeshBasicMaterial({
            map: gradientTexture,
            side: THREE.BackSide
        });
        
        this.backgroundMesh = new THREE.Mesh(geometry, material);
        this.scene.add(this.backgroundMesh);
        this.backgroundTexture = gradientTexture;
    }

    private createCustomBackground(imageUrl: string): void {
        const geometry = new THREE.SphereGeometry(500, 60, 40);
        geometry.scale(-1, 1, 1);
        
        const textureLoader = new THREE.TextureLoader();
        const customTexture = textureLoader.load(imageUrl,
            () => {
                console.log('✅ Custom background loaded:', imageUrl);
            },
            undefined,
            (error) => {
                console.error('❌ Failed to load custom background:', error);
                this.createGradientBackground(); // Fallback
            }
        );
        
        const material = new THREE.MeshBasicMaterial({
            map: customTexture,
            side: THREE.BackSide
        });
        
        this.backgroundMesh = new THREE.Mesh(geometry, material);
        this.scene.add(this.backgroundMesh);
        this.backgroundTexture = customTexture;
    }

    private setupLighting(): void {
        switch(this.backgroundType) {
            case 'studio':
                // Studio lighting
                const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
                this.scene.add(ambientLight);

                const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
                keyLight.position.set(10, 20, 15);
                keyLight.castShadow = true;
                this.scene.add(keyLight);

                const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
                fillLight.position.set(-10, 10, -10);
                this.scene.add(fillLight);

                const rimLight = new THREE.DirectionalLight(0xffffff, 0.8);
                rimLight.position.set(0, 5, -20);
                this.scene.add(rimLight);
                break;

            case 'street':
                // Street/urban lighting
                const streetAmbient = new THREE.AmbientLight(0x444444, 0.6);
                this.scene.add(streetAmbient);

                const streetLight1 = new THREE.DirectionalLight(0xffaa00, 0.8);
                streetLight1.position.set(20, 30, 10);
                this.scene.add(streetLight1);

                const streetLight2 = new THREE.PointLight(0x00aaff, 0.5, 100);
                streetLight2.position.set(-15, 10, -10);
                this.scene.add(streetLight2);
                break;

            case 'showroom':
                // Showroom lighting
                const showroomAmbient = new THREE.AmbientLight(0xffffff, 0.5);
                this.scene.add(showroomAmbient);

                const spotLight1 = new THREE.SpotLight(0xffffff, 1, 100, Math.PI / 6, 0.5);
                spotLight1.position.set(10, 30, 10);
                spotLight1.castShadow = true;
                this.scene.add(spotLight1);

                const spotLight2 = new THREE.SpotLight(0xffffff, 0.8, 100, Math.PI / 6, 0.5);
                spotLight2.position.set(-10, 30, 10);
                spotLight2.castShadow = true;
                this.scene.add(spotLight2);
                break;

            default:
                // Default lighting
                const defaultAmbient = new THREE.AmbientLight(0xffffff, 1.2);
                this.scene.add(defaultAmbient);

                const defaultDirectional = new THREE.DirectionalLight(0xffffff, 2.0);
                defaultDirectional.position.set(10, 20, 15);
                defaultDirectional.castShadow = true;
                this.scene.add(defaultDirectional);
        }
    }

    private loadModel(): void {
        if (!this.modelPath) {
            console.error('❌ No model path provided');
            this.createClothingPlaceholder();
            return;
        }
        
        console.log(`📁 Loading model from: ${this.modelPath}`);
        
        const loader = new OBJLoader();

        loader.load(
            this.modelPath,
            (object: THREE.Group) => {
                console.log('✅ Model loaded successfully!');
                
                this.model = object;
                this.isLoaded = true;

                // Calculate bounding box
                const box = new THREE.Box3().setFromObject(object);
                const center = box.getCenter(new THREE.Vector3());
                const size = box.getSize(new THREE.Vector3());
                
                console.log('📏 Original model size:', {
                    x: size.x.toFixed(2),
                    y: size.y.toFixed(2), 
                    z: size.z.toFixed(2),
                    max: Math.max(size.x, size.y, size.z).toFixed(2)
                });

                // Center the model
                object.position.x = -center.x;
                object.position.y = -center.y;
                object.position.z = -center.z;

                // AUTO SCALING
                let scale = 1;
                
                if (this.autoScale) {
                    const maxDim = Math.max(size.x, size.y, size.z);
                    
                    if (maxDim < 0.5) {
                        scale = 50;
                        console.log(`⚖️ Tiny model, scaling up 50x`);
                    } else if (maxDim < 2) {
                        scale = 20;
                        console.log(`⚖️ Small model, scaling up 20x`);
                    } else if (maxDim < 10) {
                        scale = 5;
                        console.log(`⚖️ Medium model, scaling up 5x`);
                    } else {
                        scale = this.targetSize / maxDim;
                        console.log(`⚖️ Scaling to target size: ${this.targetSize}`);
                    }
                }
                
                object.scale.setScalar(scale);
                
                console.log(`⚖️ Final scale: ${scale}`);

                // Apply materials
                this.applyClothingMaterials(object);

                this.scene.add(object);
                
                // Position camera
                const newBox = new THREE.Box3().setFromObject(object);
                const newSize = newBox.getSize(new THREE.Vector3());
                const newCenter = newBox.getCenter(new THREE.Vector3());
                
                const maxSize = Math.max(newSize.x, newSize.y, newSize.z);
                const cameraDistance = maxSize * 1.8;
                
                this.camera.position.set(
                    newCenter.x,
                    newCenter.y + maxSize * 0.3,
                    newCenter.z + cameraDistance
                );
                
                this.camera.lookAt(newCenter.x, newCenter.y, newCenter.z);
                
                console.log('✅ Model ready for display with background');
            },
            (xhr) => {
                const percent = (xhr.loaded / xhr.total * 100);
                console.log(`⏳ Loading: ${percent.toFixed(2)}%`);
            },
            (error) => {
                console.error('❌ Error loading model:', error);
                this.createClothingPlaceholder();
            }
        );
    }

    private applyClothingMaterials(object: THREE.Group): void {
        let colorIndex = 0;
        
        object.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                const color = this.colors[colorIndex % this.colors.length];
                colorIndex++;
                
                child.material = new THREE.MeshStandardMaterial({
                    color: color,
                    roughness: 0.3,
                    metalness: 0.2,
                    side: THREE.DoubleSide,
                    emissive: 0x000000,
                    emissiveIntensity: 0
                });
                
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
    }

    private createClothingPlaceholder(): void {
        console.log('👕 Creating clothing placeholder');
        
        this.isLoaded = true;
        
        // Simple placeholder model
        const geometry = new THREE.BoxGeometry(5, 8, 0.5);
        const material = new THREE.MeshStandardMaterial({ 
            color: 0xFF0000,
            roughness: 0.5,
            metalness: 0.1
        });
        
        const placeholder = new THREE.Mesh(geometry, material);
        this.scene.add(placeholder);
        this.model = placeholder;
        
        this.camera.position.set(0, 4, 15);
        this.camera.lookAt(0, 0, 0);
    }

    // Public methods
    public toggleRotation(): void {
        this.currentRotationEnabled = !this.currentRotationEnabled;
        console.log(`🌀 Rotation ${this.currentRotationEnabled ? 'ENABLED' : 'DISABLED'}`);
    }

    public changeColor(): void {
        if (!this.model) return;
        
        this.model.traverse((child) => {
            if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
                const currentColor = child.material.color.getHex();
                const currentIndex = this.colors.indexOf(currentColor);
                const nextIndex = (currentIndex + 1) % this.colors.length;
                child.material.color.setHex(this.colors[nextIndex]);
            }
        });
        
        console.log('🎨 Changed model colors');
    }

    public resetView(): void {
        if (this.model) {
            this.model.rotation.set(0, 0, 0);
            this.model.position.set(0, 0, 0);
            this.model.scale.setScalar(1);
        }
        
        this.camera.position.set(0, 2, 15);
        this.camera.lookAt(0, 1, 0);
        
        console.log('🔄 Reset model view');
    }

    public changeBackground(type: 'studio' | 'street' | 'showroom' | 'gradient'): void {
        if (this.backgroundMesh) {
            this.scene.remove(this.backgroundMesh);
            if (this.backgroundTexture) {
                this.backgroundTexture.dispose();
            }
        }
        
        this.backgroundType = type;
        this.setupBackground();
        this.setupLighting();
        
        console.log(`🎬 Changed background to: ${type}`);
    }

    public setCustomBackground(imageUrl: string): void {
        if (this.backgroundMesh) {
            this.scene.remove(this.backgroundMesh);
            if (this.backgroundTexture) {
                this.backgroundTexture.dispose();
            }
        }
        
        this.backgroundType = 'custom';
        this.customBackground = imageUrl;
        this.createCustomBackground(imageUrl);
        
        console.log(`🎬 Set custom background from: ${imageUrl}`);
    }

    private animate(): void {
        this.animationId = requestAnimationFrame(() => this.animate());

        // Rotate model if enabled
        if (this.isLoaded && this.model && this.currentRotationEnabled) {
            this.model.rotation.y += 0.005;
        }

        // Rotate background slowly for some types
        if (this.backgroundMesh && this.backgroundType === 'studio') {
            this.backgroundMesh.rotation.y += 0.0005;
        }

        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }
}