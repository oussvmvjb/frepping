import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
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
    @ViewChild('canvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;

    private scene!: THREE.Scene;
    private camera!: THREE.PerspectiveCamera;
    private renderer!: THREE.WebGLRenderer;
    private model!: THREE.Group;
    private animationId: number = 0;

    constructor() { }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        this.initThreeJS();
        this.loadModel();
        this.animate();
    }

    ngOnDestroy(): void {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.renderer) {
            this.renderer.dispose();
        }
    }

    private initThreeJS(): void {
        const canvas = this.canvasRef.nativeElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;

        // Scene
        this.scene = new THREE.Scene();
        // Transparent background instead of black
        this.scene.background = null;

        // Camera - positioned further back to see the whole model
        this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
        this.camera.position.set(0, 0, 8);
        this.camera.lookAt(0, 0, 0);

        // Renderer with alpha for transparency
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(window.devicePixelRatio);

        // Much brighter lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
        this.scene.add(ambientLight);

        const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1.5);
        directionalLight1.position.set(5, 5, 5);
        this.scene.add(directionalLight1);

        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1.0);
        directionalLight2.position.set(-5, 3, -5);
        this.scene.add(directionalLight2);

        const directionalLight3 = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight3.position.set(0, -5, 0);
        this.scene.add(directionalLight3);
    }

    private loadModel(): void {
        const loader = new OBJLoader();

        loader.load(
            this.modelPath,
            (object) => {
                this.model = object;

                // Center the model
                const box = new THREE.Box3().setFromObject(object);
                const center = box.getCenter(new THREE.Vector3());
                object.position.sub(center);

                // Scale the model to fit nicely in view
                const size = box.getSize(new THREE.Vector3());
                const maxDim = Math.max(size.x, size.y, size.z);
                const scale = 3 / maxDim; // Larger scale for better visibility
                object.scale.setScalar(scale);

                // Add bright white material to all meshes
                object.traverse((child) => {
                    if ((child as THREE.Mesh).isMesh) {
                        const mesh = child as THREE.Mesh;
                        // Use a bright white material with good reflectivity
                        mesh.material = new THREE.MeshPhongMaterial({
                            color: 0xffffff,
                            shininess: 50,
                            specular: 0x444444,
                            flatShading: false
                        });
                        mesh.castShadow = true;
                        mesh.receiveShadow = true;
                    }
                });

                this.scene.add(object);
                console.log('Model loaded and added to scene');
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            (error) => {
                console.error('Error loading model:', error);
            }
        );
    }

    private animate(): void {
        this.animationId = requestAnimationFrame(() => this.animate());

        // Rotate the model only if autoRotate is true
        if (this.model && this.autoRotate) {
            this.model.rotation.y += 0.01;
        }

        this.renderer.render(this.scene, this.camera);
    }

}
