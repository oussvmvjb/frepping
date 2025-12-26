import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

@Component({
    selector: 'app-model-viewer',
    templateUrl: './model-viewer.component.html',
    styleUrls: ['./model-viewer.component.scss']
})
export class ModelViewerComponent implements OnInit, AfterViewInit, OnDestroy {
changeBackground(arg0: string) {
throw new Error('Method not implemented.');
}
    @Input() modelPath: string = '';
    @Input() autoRotate: boolean = true;
    @Input() autoScale: boolean = true;
    @Input() targetSize: number = 5;
    @Input() showHelpers: boolean = false;
    @Input() showControls: boolean = true;
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
    private raycaster = new THREE.Raycaster();
    private mouse = new THREE.Vector2();

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
        }, 100);
    }

    ngOnDestroy(): void {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.renderer) {
            this.renderer.dispose();
        }
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

    private initThreeJS(): void {
        const canvas = this.canvasRef.nativeElement;
        const width = canvas.clientWidth || 400;
        const height = canvas.clientHeight || 400;
        
        // Scene with transparent background
        this.scene = new THREE.Scene();
        this.scene.background = null;

        // Camera
        this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        this.camera.position.set(0, 2, 10);
        this.camera.lookAt(0, 1, 0);

        // Renderer with transparent background
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
        });
        this.renderer.setSize(width, height, false);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x000000, 0);

        // Setup lighting
        this.setupLighting();

        // Add event listeners for interaction
        this.setupEventListeners(canvas);
    }

    private setupEventListeners(canvas: HTMLCanvasElement): void {
        let isDragging = false;
        let previousMousePosition = { x: 0, y: 0 };

        canvas.addEventListener('mousedown', (event) => {
            isDragging = true;
            previousMousePosition = { x: event.clientX, y: event.clientY };
        });

        canvas.addEventListener('mousemove', (event) => {
            if (!isDragging || !this.model) return;
            
            const deltaX = event.clientX - previousMousePosition.x;
            const deltaY = event.clientY - previousMousePosition.y;
            
            previousMousePosition = { x: event.clientX, y: event.clientY };
            
            this.model.rotation.y += deltaX * 0.01;
            this.model.rotation.x += deltaY * 0.01;
        });

        canvas.addEventListener('mouseup', () => {
            isDragging = false;
        });

        canvas.addEventListener('mouseleave', () => {
            isDragging = false;
        });

        // Touch support for mobile
        canvas.addEventListener('touchstart', (event) => {
            event.preventDefault();
            if (event.touches.length === 1) {
                isDragging = true;
                previousMousePosition = { 
                    x: event.touches[0].clientX, 
                    y: event.touches[0].clientY 
                };
            }
        });

        canvas.addEventListener('touchmove', (event) => {
            event.preventDefault();
            if (!isDragging || !this.model || event.touches.length !== 1) return;
            
            const deltaX = event.touches[0].clientX - previousMousePosition.x;
            const deltaY = event.touches[0].clientY - previousMousePosition.y;
            
            previousMousePosition = { 
                x: event.touches[0].clientX, 
                y: event.touches[0].clientY 
            };
            
            this.model.rotation.y += deltaX * 0.01;
            this.model.rotation.x += deltaY * 0.01;
        });

        canvas.addEventListener('touchend', () => {
            isDragging = false;
        });

        // Zoom with wheel
        canvas.addEventListener('wheel', (event) => {
            event.preventDefault();
            const zoomSpeed = 0.001;
            this.camera.position.z += event.deltaY * zoomSpeed * Math.abs(this.camera.position.z);
            
            // Limit zoom
            this.camera.position.z = Math.max(5, Math.min(50, this.camera.position.z));
        });
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
        mainLight.position.set(5, 10, 7);
        this.scene.add(mainLight);

        // Fill light
        const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
        fillLight.position.set(-5, 5, -5);
        this.scene.add(fillLight);

        // Rim light
        const rimLight = new THREE.DirectionalLight(0x39ff14, 0.2);
        rimLight.position.set(0, 3, -10);
        this.scene.add(rimLight);
    }

    private setupBackground(): void {
        // Remove existing background
        if (this.backgroundGroup) {
            this.scene.remove(this.backgroundGroup);
            this.backgroundGroup = null;
        }

        // Create simple grid background for shop view
        this.backgroundGroup = new THREE.Group();
        
        // Simple grid floor
        const floorGeometry = new THREE.PlaneGeometry(30, 30);
        floorGeometry.rotateX(-Math.PI / 2);
        
        const gridHelper = new THREE.GridHelper(30, 30, 0x39ff14, 0x0a0a0a);
        gridHelper.position.y = -5;
        this.backgroundGroup.add(gridHelper);

        if (this.backgroundGroup) {
            this.scene.add(this.backgroundGroup);
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

                // Setup background
                this.setupBackground();

                // Calculate bounding box
                const box = new THREE.Box3().setFromObject(object);
                const center = box.getCenter(new THREE.Vector3());
                const size = box.getSize(new THREE.Vector3());
                
                console.log('📏 Model size:', {
                    x: size.x.toFixed(2),
                    y: size.y.toFixed(2), 
                    z: size.z.toFixed(2)
                });

                // Center the model
                object.position.x = -center.x;
                object.position.y = -center.y;
                object.position.z = -center.z;

                // Scale model to fit view
                if (this.autoScale) {
                    const maxDim = Math.max(size.x, size.y, size.z);
                    const scale = this.targetSize / maxDim;
                    object.scale.setScalar(scale);
                    console.log(`⚖️ Scaled to: ${scale.toFixed(2)}`);
                }

                // Apply materials
                this.applyClothingMaterials(object);

                this.scene.add(object);
                
                // Adjust camera position
                this.adjustCamera();
                
                console.log('✅ Model ready');
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

    private adjustCamera(): void {
        if (!this.model) return;
        
        const box = new THREE.Box3().setFromObject(this.model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        
        const maxSize = Math.max(size.x, size.y, size.z);
        const cameraDistance = maxSize * 2.5;
        
        this.camera.position.set(
            center.x,
            center.y + maxSize * 0.3,
            center.z + cameraDistance
        );
        
        this.camera.lookAt(center.x, center.y, center.z);
    }

    private applyClothingMaterials(object: THREE.Group): void {
        let colorIndex = 0;
        
        object.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                const color = this.colors[colorIndex % this.colors.length];
                colorIndex++;
                
                child.material = new THREE.MeshStandardMaterial({
                    color: color,
                    roughness: 0.4,
                    metalness: 0.3,
                    side: THREE.DoubleSide
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
        
        // T-shirt placeholder
        const geometry = new THREE.BoxGeometry(3, 4, 0.2);
        const material = new THREE.MeshStandardMaterial({ 
            color: 0xFF0000,
            roughness: 0.5
        });
        
        const placeholder = new THREE.Mesh(geometry, material);
        this.scene.add(placeholder);
        this.model = placeholder;
        
        this.camera.position.set(0, 2, 8);
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
        
        this.camera.position.set(0, 2, 10);
        this.camera.lookAt(0, 1, 0);
        
        console.log('🔄 Reset model view');
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