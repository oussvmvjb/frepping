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
    @Input() backgroundType: 'studio' | 'street' | 'showroom' | 'gradient' | 'grid' | 'custom' = 'grid';
    @Input() customBackground: string = '';
    
    @ViewChild('canvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;

    private scene!: THREE.Scene;
    private camera!: THREE.PerspectiveCamera;
    private renderer!: THREE.WebGLRenderer;
    private model: THREE.Group | THREE.Mesh | null = null;
    private animationId: number = 0;
    private isLoaded = false;
    private currentRotationEnabled = true;
    private backgroundGroup: THREE.Group | null = null;

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

        // Scene with transparent background
        this.scene = new THREE.Scene();
        this.scene.background = null; // Transparent background

        // Camera
        this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
        this.camera.position.set(0, 2, 15);
        this.camera.lookAt(0, 1, 0);
        
        console.log('📷 Camera position:', this.camera.position);

        // Renderer with transparent background
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true, // Enable transparency
            powerPreference: "high-performance"
        });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x000000, 0); // Transparent black

        // Lighting
        this.setupLighting();
    }

    private setupBackground(): void {
        // Remove existing background
        if (this.backgroundGroup) {
            this.scene.remove(this.backgroundGroup);
            this.backgroundGroup = null;
        }

        // Create new background group
        this.backgroundGroup = new THREE.Group();
        
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
            case 'grid':
                this.createGridBackground();
                break;
            case 'gradient':
                this.createGradientBackground();
                break;
            case 'custom':
                if (this.customBackground) {
                    this.createCustomBackground(this.customBackground);
                } else {
                    this.createGridBackground();
                }
                break;
            default:
                this.createGridBackground();
        }

        if (this.backgroundGroup) {
            this.scene.add(this.backgroundGroup);
        }
    }

    private createStudioBackground(): void {
        if (!this.backgroundGroup) return;
        
        // Studio backdrop (circular)
        const backdropGeometry = new THREE.SphereGeometry(30, 32, 32);
        backdropGeometry.scale(-1, 1, 1); // Invert to see inside
        
        const backdropTexture = new THREE.TextureLoader().load(
            'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
        );
        
        const backdropMaterial = new THREE.MeshBasicMaterial({
            map: backdropTexture,
            side: THREE.BackSide,
            transparent: true,
            opacity: 0.8
        });
        
        const backdrop = new THREE.Mesh(backdropGeometry, backdropMaterial);
        backdrop.position.y = 5;
        this.backgroundGroup.add(backdrop);

        // Studio floor
        const floorGeometry = new THREE.PlaneGeometry(50, 50);
        floorGeometry.rotateX(-Math.PI / 2);
        
        const floorTexture = new THREE.TextureLoader().load(
            'https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
        );
        floorTexture.wrapS = THREE.RepeatWrapping;
        floorTexture.wrapT = THREE.RepeatWrapping;
        floorTexture.repeat.set(4, 4);
        
        const floorMaterial = new THREE.MeshStandardMaterial({
            map: floorTexture,
            roughness: 0.8,
            metalness: 0.2
        });
        
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.position.y = -5;
        this.backgroundGroup.add(floor);
    }

    private createStreetBackground(): void {
        if (!this.backgroundGroup) return;
        
        // Urban street backdrop
        const backdropGeometry = new THREE.BoxGeometry(60, 40, 1);
        const backdropTexture = new THREE.TextureLoader().load(
            'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
        );
        
        const backdropMaterial = new THREE.MeshBasicMaterial({
            map: backdropTexture,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.9
        });
        
        const backdrop = new THREE.Mesh(backdropGeometry, backdropMaterial);
        backdrop.position.z = -20;
        this.backgroundGroup.add(backdrop);

        // Street floor
        const floorGeometry = new THREE.PlaneGeometry(50, 50);
        floorGeometry.rotateX(-Math.PI / 2);
        
        const floorTexture = new THREE.TextureLoader().load(
            'https://images.unsplash.com/photo-1542310503-ff8da9c02372?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
        );
        floorTexture.wrapS = THREE.RepeatWrapping;
        floorTexture.wrapT = THREE.RepeatWrapping;
        floorTexture.repeat.set(8, 8);
        
        const floorMaterial = new THREE.MeshStandardMaterial({
            map: floorTexture,
            roughness: 0.9,
            metalness: 0.1
        });
        
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.position.y = -5;
        this.backgroundGroup.add(floor);
    }

    private createShowroomBackground(): void {
        if (!this.backgroundGroup) return;
        
        // Showroom walls (3 walls forming a corner)
        const wallGeometry = new THREE.PlaneGeometry(40, 25);
        
        // Back wall
        const backWall = new THREE.Mesh(wallGeometry, new THREE.MeshStandardMaterial({
            color: 0x333333,
            roughness: 0.7
        }));
        backWall.position.z = -15;
        backWall.position.y = 7.5;
        this.backgroundGroup.add(backWall);
        
        // Left wall
        const leftWall = new THREE.Mesh(wallGeometry, new THREE.MeshStandardMaterial({
            color: 0x222222,
            roughness: 0.8
        }));
        leftWall.rotation.y = Math.PI / 2;
        leftWall.position.x = -20;
        leftWall.position.y = 7.5;
        leftWall.position.z = -5;
        this.backgroundGroup.add(leftWall);
        
        // Right wall
        const rightWall = new THREE.Mesh(wallGeometry, new THREE.MeshStandardMaterial({
            color: 0x222222,
            roughness: 0.8
        }));
        rightWall.rotation.y = -Math.PI / 2;
        rightWall.position.x = 20;
        rightWall.position.y = 7.5;
        rightWall.position.z = -5;
        this.backgroundGroup.add(rightWall);

        // Showroom floor
        const floorGeometry = new THREE.PlaneGeometry(40, 30);
        floorGeometry.rotateX(-Math.PI / 2);
        
        const floorTexture = new THREE.TextureLoader().load(
            'https://images.unsplash.com/photo-1595428774223-ef52624120d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
        );
        floorTexture.wrapS = THREE.RepeatWrapping;
        floorTexture.wrapT = THREE.RepeatWrapping;
        floorTexture.repeat.set(4, 3);
        
        const floorMaterial = new THREE.MeshStandardMaterial({
            map: floorTexture,
            roughness: 0.6,
            metalness: 0.3
        });
        
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.position.y = -5;
        this.backgroundGroup.add(floor);

        // Ceiling
        const ceilingGeometry = new THREE.PlaneGeometry(40, 30);
        ceilingGeometry.rotateX(Math.PI / 2);
        
        const ceiling = new THREE.Mesh(ceilingGeometry, new THREE.MeshStandardMaterial({
            color: 0x111111,
            roughness: 0.9
        }));
        ceiling.position.y = 20;
        this.backgroundGroup.add(ceiling);
    }

    private createGridBackground(): void {
        if (!this.backgroundGroup) return;
        
        console.log('🎬 Creating grid background');
        
        // Create a GTA-style grid floor
        const floorSize = 40;
        const gridSize = 4;
        
        const floorGeometry = new THREE.PlaneGeometry(floorSize, floorSize);
        floorGeometry.rotateX(-Math.PI / 2);
        
        // Create grid texture
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d')!;
        
        // GTA-style dark background
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, 512, 512);
        
        // Grid lines (GTA green)
        ctx.strokeStyle = 'rgba(57, 255, 20, 0.3)';
        ctx.lineWidth = 2;
        
        // Vertical lines
        for (let i = 0; i <= 512; i += 32) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, 512);
            ctx.stroke();
        }
        
        // Horizontal lines
        for (let i = 0; i <= 512; i += 32) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(512, i);
            ctx.stroke();
        }
        
        // Center lines (brighter)
        ctx.strokeStyle = 'rgba(57, 255, 20, 0.6)';
        ctx.lineWidth = 3;
        
        // Center vertical line
        ctx.beginPath();
        ctx.moveTo(256, 0);
        ctx.lineTo(256, 512);
        ctx.stroke();
        
        // Center horizontal line
        ctx.beginPath();
        ctx.moveTo(0, 256);
        ctx.lineTo(512, 256);
        ctx.stroke();
        
        const gridTexture = new THREE.CanvasTexture(canvas);
        gridTexture.wrapS = THREE.RepeatWrapping;
        gridTexture.wrapT = THREE.RepeatWrapping;
        gridTexture.repeat.set(floorSize / gridSize, floorSize / gridSize);
        
        const floorMaterial = new THREE.MeshStandardMaterial({
            map: gridTexture,
            roughness: 0.9,
            metalness: 0.1,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.8
        });
        
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.position.y = -5;
        this.backgroundGroup.add(floor);
        
        // Add a subtle grid wall behind
        const wallGeometry = new THREE.PlaneGeometry(floorSize, 25);
        const wallMaterial = new THREE.MeshStandardMaterial({
            color: 0x0a0a0a,
            roughness: 0.8,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.7
        });
        
        const wall = new THREE.Mesh(wallGeometry, wallMaterial);
        wall.position.z = -15;
        wall.position.y = 7.5;
        this.backgroundGroup.add(wall);
        
        console.log('✅ Grid background created');
    }

    private createGradientBackground(): void {
        if (!this.backgroundGroup) return;
        
        // Circular gradient backdrop
        const backdropGeometry = new THREE.SphereGeometry(25, 32, 32);
        backdropGeometry.scale(-1, 1, 1);
        
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d')!;
        
        // Radial gradient
        const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
        gradient.addColorStop(0, '#39ff14');
        gradient.addColorStop(0.1, '#2bd600');
        gradient.addColorStop(0.3, '#1a3a26');
        gradient.addColorStop(0.7, '#0f1f14');
        gradient.addColorStop(1, '#0a0a0a');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 512, 512);
        
        const gradientTexture = new THREE.CanvasTexture(canvas);
        
        const backdropMaterial = new THREE.MeshBasicMaterial({
            map: gradientTexture,
            side: THREE.BackSide,
            transparent: true,
            opacity: 0.9
        });
        
        const backdrop = new THREE.Mesh(backdropGeometry, backdropMaterial);
        backdrop.position.y = 5;
        this.backgroundGroup.add(backdrop);
    }

    private createCustomBackground(imageUrl: string): void {
        if (!this.backgroundGroup) return;
        
        // Simple backdrop with custom image
        const backdropGeometry = new THREE.PlaneGeometry(40, 25);
        const textureLoader = new THREE.TextureLoader();
        
        const texture = textureLoader.load(
            imageUrl,
            () => console.log('✅ Custom background loaded'),
            undefined,
            (error) => {
                console.error('❌ Failed to load custom background:', error);
                this.createGridBackground();
            }
        );
        
        const backdropMaterial = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.8
        });
        
        const backdrop = new THREE.Mesh(backdropGeometry, backdropMaterial);
        backdrop.position.z = -15;
        backdrop.position.y = 7.5;
        this.backgroundGroup.add(backdrop);
    }

    private setupLighting(): void {
        // Clear existing lights
        const lights = this.scene.children.filter(child => child instanceof THREE.Light);
        lights.forEach(light => this.scene.remove(light));
        
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        // Main directional light
        const mainLight = new THREE.DirectionalLight(0xffffff, 1.0);
        mainLight.position.set(10, 20, 15);
        mainLight.castShadow = true;
        mainLight.shadow.mapSize.width = 2048;
        mainLight.shadow.mapSize.height = 2048;
        this.scene.add(mainLight);

        // Fill light
        const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
        fillLight.position.set(-10, 10, -10);
        this.scene.add(fillLight);

        // Rim light (GTA-style green)
        const rimLight = new THREE.DirectionalLight(0x39ff14, 0.3);
        rimLight.position.set(0, 5, -20);
        this.scene.add(rimLight);
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

                // Setup background AFTER model is loaded (to adjust scale)
                this.setupBackground();

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
                
                // Position camera based on model size
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
                
                console.log('✅ Model ready with background');
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
        this.setupBackground();
        
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

    public changeBackground(type: 'studio' | 'street' | 'showroom' | 'gradient' | 'grid'): void {
        this.backgroundType = type;
        this.setupBackground();
        
        console.log(`🎬 Changed background to: ${type}`);
    }

    public setCustomBackground(imageUrl: string): void {
        this.backgroundType = 'custom';
        this.customBackground = imageUrl;
        this.setupBackground();
        
        console.log(`🎬 Set custom background from: ${imageUrl}`);
    }

    private animate(): void {
        this.animationId = requestAnimationFrame(() => this.animate());

        // Rotate model if enabled
        if (this.isLoaded && this.model && this.currentRotationEnabled) {
            this.model.rotation.y += 0.005;
        }

        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }
}