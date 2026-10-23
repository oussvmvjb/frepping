import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ChangeDetectorRef,
  NgZone
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import {
  Trellis3dService,
  TrellisJobResponse,
  GeneratedModelMeta
} from '../../services/trellis-3d.service';

export interface Generated3DEvent {
  jobId: string;
  modelUrl: string;
  name: string;
  category: string;
  previewUrl?: string;
}

@Component({
  selector: 'app-ai-3d-generator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ai-3d-generator.component.html',
  styleUrls: ['./ai-3d-generator.component.scss']
})
export class Ai3dGeneratorComponent implements OnInit, OnDestroy {
  @Input() embeddedMode = false;
  @Output() modelGenerated = new EventEmitter<Generated3DEvent>();
  @Output() close = new EventEmitter<void>();

  @ViewChild('viewportCanvas', { static: false })
  canvasRef?: ElementRef<HTMLCanvasElement>;

  @ViewChild('viewportContainer', { static: false })
  containerRef?: ElementRef<HTMLDivElement>;

  // Upload state
  selectedFile: File | null = null;
  imagePreviewUrl: string | null = null;
  fileError: string | null = null;
  clothingName: string = 'Custom Streetwear';
  clothingCategory: string = 'HOODIES';
  resolution: string = '1024';
  seed: number | null = null;

  // Generation state
  isGenerating = false;
  currentJob: TrellisJobResponse | null = null;
  generationError: string | null = null;
  elapsedSeconds = 0;
  private timerInterval: any = null;
  private pollSub?: Subscription;

  // 3D Three.js scene state
  hasModelLoaded = false;
  isModelLoading = false;
  autoRotate = true;
  wireframeMode = false;

  private scene?: THREE.Scene;
  private camera?: THREE.PerspectiveCamera;
  private renderer?: THREE.WebGLRenderer;
  private controls?: OrbitControls;
  private currentMeshGroup?: THREE.Group;
  private animId = 0;

  // Recent completed job cache
  recentJobId: string | null = null;
  savedModels: GeneratedModelMeta[] = [];
  activeModelJobId: string | null = null;
  isLoadingSavedModels = false;

  constructor(
    private trellisService: Trellis3dService,
    private cdRef: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    // Check backend health silently
    this.trellisService.getHealth().subscribe({
      next: (h) => {
        console.log('[Trellis3D] Backend service connected:', h);
      },
      error: (e) => {
        console.warn('[Trellis3D] Backend health check warning:', e);
      }
    });

    // Fetch all existing generated models from server
    this.fetchSavedModels();

    // Check if there is a recently generated job in localStorage
    const storedJobId = localStorage.getItem('last_trellis_job_id');
    if (storedJobId) {
      this.trellisService.getJobStatus(storedJobId).subscribe({
        next: (job) => {
          if (job.status === 'completed') {
            this.recentJobId = job.job_id;
            this.cdRef.markForCheck();
          }
        },
        error: () => {}
      });
    }
  }

  fetchSavedModels(): void {
    this.isLoadingSavedModels = true;
    this.trellisService.getGeneratedModels().subscribe({
      next: (res) => {
        this.savedModels = res.models || [];
        this.isLoadingSavedModels = false;
        // If no model loaded yet and models exist, auto-select the latest one's ID as ready
        if (!this.recentJobId && this.savedModels.length > 0) {
          this.recentJobId = this.savedModels[0].job_id;
        }
        this.cdRef.markForCheck();
      },
      error: (err) => {
        console.warn('[Trellis3D] Could not fetch saved models:', err);
        this.isLoadingSavedModels = false;
        this.cdRef.markForCheck();
      }
    });
  }

  previewSavedModel(model: GeneratedModelMeta): void {
    this.activeModelJobId = model.job_id;
    this.clothingName = `Garment ${model.job_id.slice(0, 8)}`;
    this.currentJob = {
      job_id: model.job_id,
      status: 'completed',
      progress: 100,
      message: `Model loaded from storage (${model.size_mb} MB)`,
      status_url: `/api/generate-3d/${model.job_id}`,
      model_url: this.trellisService.getModelUrl(model.job_id),
      created_at: model.created_at,
      updated_at: model.created_at
    };
    const fullModelUrl = this.trellisService.getModelUrl(model.job_id);
    setTimeout(() => {
      this.initThree();
      this.loadGLBModel(fullModelUrl);
    }, 100);
    this.cdRef.markForCheck();
  }

  sendSavedModelToShowroom(model: GeneratedModelMeta): void {
    const fullModelUrl = this.trellisService.getModelUrl(model.job_id);
    this.modelGenerated.emit({
      jobId: model.job_id,
      modelUrl: fullModelUrl,
      name: `AI Garment ${model.job_id.slice(0, 6)}`,
      category: 'AI CUSTOM'
    });
  }

  downloadSavedModel(jobId: string): void {
    const downloadUrl = this.trellisService.getModelUrl(jobId, true);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `trellis_${jobId.slice(0, 8)}.glb`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  ngOnDestroy(): void {
    this.cleanTimer();
    this.pollSub?.unsubscribe();
    this.disposeThree();
  }

  // ─── File Selection & Validation ──────────────────────────────────────────

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.handleFile(event.dataTransfer.files[0]);
    }
  }

  private handleFile(file: File): void {
    this.fileError = null;
    this.generationError = null;

    // Validate type
    const validTypes = ['image/png', 'image/jpeg', 'image/webp'];
    const validExts = ['.png', '.jpg', '.jpeg', '.webp'];
    const name = file.name.toLowerCase();
    const hasValidExt = validExts.some((ext) => name.endsWith(ext));

    if (!validTypes.includes(file.type) && !hasValidExt) {
      this.fileError = 'Invalid format. Please upload a PNG, JPEG, or WebP image.';
      this.selectedFile = null;
      this.imagePreviewUrl = null;
      return;
    }

    // Validate size (15MB max)
    const maxBytes = 15 * 1024 * 1024;
    if (file.size > maxBytes) {
      this.fileError = 'File is too large. Maximum size is 15MB.';
      this.selectedFile = null;
      this.imagePreviewUrl = null;
      return;
    }

    this.selectedFile = file;

    // Set garment name suggestion based on filename
    const baseName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
    if (baseName.length > 2) {
      this.clothingName = baseName.charAt(0).toUpperCase() + baseName.slice(1);
    }

    // Create thumbnail preview
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreviewUrl = reader.result as string;
      this.cdRef.markForCheck();
    };
    reader.readAsDataURL(file);
  }

  clearSelectedFile(): void {
    this.selectedFile = null;
    this.imagePreviewUrl = null;
    this.fileError = null;
    this.generationError = null;
  }

  loadSampleImage(sampleType: 'hoodie' | 'tshirt' | 'jacket' | 'pants'): void {
    // Generate a high-contrast canvas garment graphic as a quick-test sample
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Transparent background
    ctx.clearRect(0, 0, 512, 512);

    // Draw stylized streetwear garment silhouette
    ctx.fillStyle = sampleType === 'hoodie' ? '#1f2421' : sampleType === 'jacket' ? '#0d1b2a' : '#2b2d42';
    ctx.strokeStyle = '#39ff14';
    ctx.lineWidth = 6;

    if (sampleType === 'hoodie' || sampleType === 'jacket') {
      // Body & sleeves
      ctx.beginPath();
      ctx.moveTo(180, 100);
      ctx.lineTo(120, 150);
      ctx.lineTo(80, 260);
      ctx.lineTo(130, 280);
      ctx.lineTo(160, 200);
      ctx.lineTo(160, 420);
      ctx.lineTo(352, 420);
      ctx.lineTo(352, 200);
      ctx.lineTo(382, 280);
      ctx.lineTo(432, 260);
      ctx.lineTo(392, 150);
      ctx.lineTo(332, 100);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Cyber graphic print in center
      ctx.fillStyle = '#39ff14';
      ctx.font = 'bold 28px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('FREEPPING', 256, 260);
      ctx.font = '16px monospace';
      ctx.fillText('TRELLIS 2.0', 256, 290);
    } else {
      // T-shirt / Pants
      ctx.beginPath();
      ctx.moveTo(190, 110);
      ctx.lineTo(130, 150);
      ctx.lineTo(100, 220);
      ctx.lineTo(140, 240);
      ctx.lineTo(170, 190);
      ctx.lineTo(170, 420);
      ctx.lineTo(342, 420);
      ctx.lineTo(342, 190);
      ctx.lineTo(372, 240);
      ctx.lineTo(412, 220);
      ctx.lineTo(382, 150);
      ctx.lineTo(322, 110);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#00f0ff';
      ctx.font = 'bold 24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('AI STUDIO', 256, 270);
    }

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `${sampleType}_sample.png`, { type: 'image/png' });
        this.clothingCategory = sampleType === 'hoodie' ? 'HOODIES' : 'OUTERWEAR';
        this.clothingName = `Cyber ${sampleType.toUpperCase()} Specimen`;
        this.handleFile(file);
      }
    }, 'image/png');
  }

  // ─── 3D Model Generation Execution ────────────────────────────────────────

  startGeneration(): void {
    if (!this.selectedFile || this.isGenerating) return;

    this.isGenerating = true;
    this.generationError = null;
    this.currentJob = null;
    this.elapsedSeconds = 0;
    this.cleanTimer();

    this.timerInterval = setInterval(() => {
      this.elapsedSeconds++;
      this.cdRef.markForCheck();
    }, 1000);

    const options = {
      resolution: this.resolution,
      seed: this.seed ?? undefined,
      wait: false // Async polling avoids gateway timeouts
    };

    this.trellisService.generate3D(this.selectedFile, options).subscribe({
      next: (job) => {
        this.currentJob = job;
        try {
          localStorage.setItem('last_trellis_job_id', job.job_id);
        } catch (_) {}
        this.cdRef.markForCheck();
        this.pollForCompletion(job.job_id);
      },
      error: (err) => {
        this.isGenerating = false;
        this.cleanTimer();
        const msg = err.error?.detail || err.message || 'Failed to submit 3D generation request.';
        this.generationError = msg;
        this.cdRef.markForCheck();
      }
    });
  }

  public loadExistingJob(jobId: string): void {
    if (!jobId) return;
    this.isGenerating = true;
    this.generationError = null;
    this.trellisService.getJobStatus(jobId).subscribe({
      next: (job) => {
        this.currentJob = job;
        this.isGenerating = false;
        if (job.status === 'completed') {
          this.onGenerationFinished(job);
        } else if (job.status === 'failed') {
          this.generationError = job.error || 'Job failed on Hugging Face.';
        } else {
          // Job still in progress, continue polling
          this.pollForCompletion(jobId);
        }
        this.cdRef.markForCheck();
      },
      error: (err) => {
        this.isGenerating = false;
        this.generationError = 'Could not find job ' + jobId;
        this.cdRef.markForCheck();
      }
    });
  }

  private pollForCompletion(jobId: string): void {
    this.pollSub?.unsubscribe();
    // 0 = no timeout (indefinite polling until completed or failed)
    this.pollSub = this.trellisService.pollJob(jobId, 2500, 0).subscribe({
      next: (status) => {
        this.currentJob = status;
        this.cdRef.markForCheck();

        if (status.status === 'completed' && status.model_url) {
          this.isGenerating = false;
          this.cleanTimer();
          this.recentJobId = status.job_id;
          try {
            localStorage.setItem('last_trellis_job_id', status.job_id);
          } catch (_) {}
          this.onGenerationFinished(status);
        } else if (status.status === 'failed') {
          this.isGenerating = false;
          this.cleanTimer();
          this.generationError = status.error || 'Generation failed on Hugging Face Space.';
        }
      },
      error: (err) => {
        this.isGenerating = false;
        this.cleanTimer();
        this.generationError = err.message || 'Status polling encountered a network error.';
        this.cdRef.markForCheck();
      }
    });
  }

  private onGenerationFinished(job: TrellisJobResponse): void {
    const fullModelUrl = this.trellisService.getModelUrl(job.job_id);
    this.modelGenerated.emit({
      jobId: job.job_id,
      modelUrl: fullModelUrl,
      name: this.clothingName,
      category: this.clothingCategory,
      previewUrl: this.imagePreviewUrl || undefined
    });

    // Render in Three.js viewport
    setTimeout(() => {
      this.initThree();
      this.loadGLBModel(fullModelUrl);
      this.fetchSavedModels();
    }, 150);
  }

  private cleanTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  // ─── Three.js Viewport & GLTFLoader ───────────────────────────────────────

  private initThree(): void {
    if (this.renderer) return; // already initialized

    const canvas = this.canvasRef?.nativeElement;
    const container = this.containerRef?.nativeElement;
    if (!canvas || !container) return;

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 450;

    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0d0b);

    // Camera
    this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    this.camera.position.set(0, 1.2, 5.5);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;

    // Orbit Controls
    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.autoRotate = this.autoRotate;
    this.controls.autoRotateSpeed = 2.0;
    this.controls.minDistance = 1.5;
    this.controls.maxDistance = 12.0;
    this.controls.target.set(0, 0, 0);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    this.scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.8);
    dirLight1.position.set(5, 10, 7);
    this.scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x88ccff, 0.8);
    dirLight2.position.set(-6, 4, -4);
    this.scene.add(dirLight2);

    const rimLight = new THREE.DirectionalLight(0x39ff14, 0.7);
    rimLight.position.set(0, -5, -6);
    this.scene.add(rimLight);

    // Ground circle
    const ringGeo = new THREE.RingGeometry(2.0, 2.02, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x39ff14,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = -1.8;
    this.scene.add(ring);

    this.startAnimationLoop();
  }

  private loadGLBModel(url: string): void {
    if (!this.scene) return;

    this.isModelLoading = true;
    this.hasModelLoaded = false;
    this.cdRef.markForCheck();

    // Clean previous model if any
    if (this.currentMeshGroup) {
      this.scene.remove(this.currentMeshGroup);
      this.currentMeshGroup.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry?.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach((m) => m.dispose());
          } else if (child.material) {
            child.material.dispose();
          }
        }
      });
      this.currentMeshGroup = undefined;
    }

    const loader = new GLTFLoader();
    loader.load(
      url,
      (gltf) => {
        const root = gltf.scene;
        this.currentMeshGroup = root;

        // Auto-center and normalize size
        const box = new THREE.Box3().setFromObject(root);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);

        const targetScale = 3.2 / (maxDim || 1);
        root.scale.setScalar(targetScale);

        // Re-center
        root.position.x = -center.x * targetScale;
        root.position.y = -center.y * targetScale;
        root.position.z = -center.z * targetScale;

        // Enhance materials
        root.traverse((node) => {
          if (node instanceof THREE.Mesh) {
            node.castShadow = true;
            node.receiveShadow = true;
            if (node.material) {
              const mats = Array.isArray(node.material) ? node.material : [node.material];
              mats.forEach((m) => {
                m.side = THREE.DoubleSide;
                if (m instanceof THREE.MeshStandardMaterial) {
                  m.roughness = Math.max(0.4, m.roughness);
                  m.wireframe = this.wireframeMode;
                  m.needsUpdate = true;
                }
              });
            }
          }
        });

        this.scene?.add(root);
        this.isModelLoading = false;
        this.hasModelLoaded = true;
        this.cdRef.markForCheck();
      },
      undefined,
      (err) => {
        console.error('[Trellis3D] Failed to load generated GLB into Three.js:', err);
        this.isModelLoading = false;
        this.generationError = 'Failed to render GLB file in Three.js viewer.';
        this.cdRef.markForCheck();
      }
    );
  }

  private startAnimationLoop(): void {
    const loop = () => {
      this.animId = requestAnimationFrame(loop);
      this.controls?.update();
      if (this.renderer && this.scene && this.camera) {
        this.renderer.render(this.scene, this.camera);
      }
    };
    this.ngZone.runOutsideAngular(() => loop());
  }

  private disposeThree(): void {
    if (this.animId) cancelAnimationFrame(this.animId);
    this.controls?.dispose();
    this.renderer?.dispose();
    this.renderer = undefined;
    this.scene = undefined;
    this.camera = undefined;
  }

  // ─── UI Viewer Interactions ───────────────────────────────────────────────

  toggleAutoRotate(): void {
    this.autoRotate = !this.autoRotate;
    if (this.controls) {
      this.controls.autoRotate = this.autoRotate;
    }
  }

  toggleWireframe(): void {
    this.wireframeMode = !this.wireframeMode;
    if (this.currentMeshGroup) {
      this.currentMeshGroup.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          const mats = Array.isArray(child.material) ? child.material : [child.material];
          mats.forEach((m) => {
            if (m instanceof THREE.MeshStandardMaterial) {
              m.wireframe = this.wireframeMode;
              m.needsUpdate = true;
            }
          });
        }
      });
    }
  }

  resetCamera(): void {
    if (this.camera && this.controls) {
      this.camera.position.set(0, 1.2, 5.5);
      this.controls.target.set(0, 0, 0);
      this.controls.update();
    }
  }

  downloadGlb(): void {
    if (!this.currentJob?.job_id) return;
    const downloadUrl = this.trellisService.getModelUrl(this.currentJob.job_id, true);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `${this.clothingName.toLowerCase().replace(/\s+/g, '_')}_trellis.glb`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  onCloseClicked(): void {
    this.close.emit();
  }
}
