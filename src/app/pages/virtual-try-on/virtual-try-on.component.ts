import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Product } from '../../models/api.models';
import { CameraService } from '../../services/camera.service';
import { DecartRealtimeService, RealtimeGarment, RealtimeSpeedMode, RealtimeTokenInfo } from '../../services/decart-realtime.service';
import { AuthService } from '../../services/auth.service';
import { ProductService } from '../../services/product.service';

type SessionStatus = 'idle' | 'connecting' | 'connected' | 'generating' | 'reconnecting' | 'disconnected' | 'error';

@Component({
  selector: 'app-virtual-try-on',
  templateUrl: './virtual-try-on.component.html',
  styleUrls: ['./virtual-try-on.component.scss'],
})
export class VirtualTryOnComponent implements OnInit, OnDestroy {
  @ViewChild('cameraVideo') cameraVideo?: ElementRef<HTMLVideoElement>;
  @ViewChild('outputVideo') outputVideo?: ElementRef<HTMLVideoElement>;
  @ViewChild('garmentInput') garmentInput?: ElementRef<HTMLInputElement>;

  products: Product[] = [];
  selectedProduct: Product | null = null;
  prompt = '';
  speed: RealtimeSpeedMode = 'standard';
  status: SessionStatus = 'idle';
  errorMessage: string | null = null;
  catalogError: string | null = null;
  isCatalogLoading = true;
  isConnecting = false;
  isSwitchingGarment = false;
  cameraEnabled = true;
  hasCameraPreview = false;
  hasRemoteVideo = false;
  hasLiveSession = false;
  garmentImage: File | string | null = null;
  garmentPreview: string | null = null;
  private previewObjectUrl: string | null = null;
  private startGeneration = 0;
  private garmentUpdatePending = false;
  private garmentRevision = 0;
  private readonly destroy$ = new Subject<void>();

  showTokenDetails = false;
  tokenCopied = false;
  isFetchingToken = false;
  tokenFetchError: string | null = null;

  constructor(
    private readonly route: ActivatedRoute,
    readonly productService: ProductService,
    private readonly cameraService: CameraService,
    private readonly decartService: DecartRealtimeService,
    readonly authService: AuthService,
    private readonly zone: NgZone,
    private readonly changeDetector: ChangeDetectorRef
  ) {}

  get tokenInfo(): RealtimeTokenInfo | null {
    return this.decartService.latestTokenInfo;
  }

  get userAccessToken(): string | null {
    return this.authService.getAccessToken();
  }

  toggleTokenDetails(): void {
    this.showTokenDetails = !this.showTokenDetails;
  }

  copyToken(token: string): void {
    if (!token) return;
    navigator.clipboard?.writeText(token).then(() => {
      this.tokenCopied = true;
      this.changeDetector.markForCheck();
      setTimeout(() => {
        this.tokenCopied = false;
        this.changeDetector.markForCheck();
      }, 2000);
    });
  }

  async checkOrFetchToken(): Promise<void> {
    this.isFetchingToken = true;
    this.tokenFetchError = null;
    try {
      await this.decartService.fetchTokenInfo();
    } catch (err) {
      this.tokenFetchError = err instanceof Error ? err.message : 'Could not fetch token';
    } finally {
      this.isFetchingToken = false;
      this.changeDetector.markForCheck();
    }
  }

  ngOnInit(): void {
    this.loadGarments();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.stopSession();
    this.releasePreviewUrl();
  }

  async startSession(): Promise<void> {
    if (this.isConnecting || this.isSessionActive) return;

    const generation = ++this.startGeneration;
    this.errorMessage = null;
    this.status = 'connecting';
    this.isConnecting = true;

    try {
      const stream = await this.cameraService.start(this.decartService.getModel());
      if (generation !== this.startGeneration) {
        this.cameraService.stop();
        return;
      }
      this.showCameraPreview(stream);
      this.garmentUpdatePending = false;

      await this.decartService.connect(
        stream,
        this.currentGarment(),
        this.speed,
        {
          onRemoteStream: remoteStream => this.zone.run(() => this.showRemoteStream(remoteStream)),
          onConnectionChange: state => this.zone.run(() => this.onConnectionChange(state)),
          onError: message => this.zone.run(() => {
            this.errorMessage = this.describeRealtimeError(message);
            this.status = 'error';
          }),
        }
      );

      if (generation !== this.startGeneration) return;
      this.hasLiveSession = true;
      await this.applyGarmentIfConnected();
    } catch (error) {
      if (generation === this.startGeneration) {
        const message = error instanceof Error ? error.message : 'Unable to start the virtual try-on session.';
        this.errorMessage = this.describeRealtimeError(message);
        this.status = 'error';
        this.releaseSessionResources();
      }
    } finally {
      if (generation === this.startGeneration) this.isConnecting = false;
    }
  }

  stopSession(): void {
    this.startGeneration += 1;
    this.releaseSessionResources();
    this.isConnecting = false;
    this.isSwitchingGarment = false;
    this.hasLiveSession = false;
    this.hasCameraPreview = false;
    this.hasRemoteVideo = false;
    this.status = 'idle';
  }

  toggleCamera(): void {
    this.cameraEnabled = !this.cameraEnabled;
    this.cameraService.setEnabled(this.cameraEnabled);
  }

  selectProduct(product: Product): void {
    if (this.isSwitchingGarment) return;
    this.selectedProduct = product;
    this.prompt = this.createProductPrompt(product);
    this.garmentImage = this.productService.getPrimaryImage(product);
    this.setPreview(this.garmentImage);
    this.queueGarmentUpdate();
    void this.applyGarmentIfConnected();
  }

  onPromptChange(): void {
    this.queueGarmentUpdate();
  }

  async applyPrompt(): Promise<void> {
    this.queueGarmentUpdate();
    await this.applyGarmentIfConnected();
  }

  openGarmentPicker(): void {
    this.garmentInput?.nativeElement.click();
  }

  onGarmentFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;

    const supportedTypes = ['image/png', 'image/jpeg', 'image/webp'];
    if (!supportedTypes.includes(file.type)) {
      this.errorMessage = 'Choose a PNG, JPG, or WebP garment image.';
      return;
    }

    this.errorMessage = null;
    this.selectedProduct = null;
    this.garmentImage = file;
    this.prompt = 'Wearing the garment shown in the reference image.';
    this.setPreview(file);
    this.queueGarmentUpdate();
    void this.applyGarmentIfConnected();
  }

  get isSessionActive(): boolean {
    return this.isConnecting || this.hasLiveSession || this.status === 'connected' ||
      this.status === 'generating' || this.status === 'reconnecting';
  }

  get statusLabel(): string {
    const labels: Record<SessionStatus, string> = {
      idle: 'Ready to connect',
      connecting: 'Connecting to Decart',
      connected: 'Connected',
      generating: 'Applying garment',
      reconnecting: 'Reconnecting',
      disconnected: 'Disconnected',
      error: 'Connection issue',
    };
    return labels[this.status];
  }

  private loadGarments(): void {
    const productId = this.route.snapshot.queryParamMap.get('productId');
    this.productService.getProducts({ page: 1, page_size: 24, in_stock_only: true })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: result => {
          this.products = result.items.filter(product => product.images?.length > 0);
          const matchingProduct = productId
            ? this.products.find(product => product.id === productId)
            : this.products[0];
          if (matchingProduct) {
            this.selectProduct(matchingProduct);
          } else if (productId) {
            this.loadRequestedProduct(productId);
          }
          this.isCatalogLoading = false;
        },
        error: (error: Error) => {
          this.catalogError = error.message;
          this.isCatalogLoading = false;
        },
      });
  }

  private loadRequestedProduct(productId: string): void {
    this.productService.getProductById(productId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: product => {
          if (product.images?.length) {
            this.products = [product, ...this.products];
            this.selectProduct(product);
          }
        },
        error: (error: Error) => {
          this.catalogError = error.message;
        },
      });
  }

  private createProductPrompt(product: Product): string {
    const details = product.description?.trim();
    return details
      ? `Wearing ${product.name}. ${details}`
      : `Wearing ${product.name}.`;
  }

  private currentGarment(): RealtimeGarment {
    return { prompt: this.prompt, image: this.garmentImage };
  }

  private queueGarmentUpdate(): void {
    this.garmentRevision += 1;
    this.garmentUpdatePending = true;
  }

  private async applyGarmentIfConnected(): Promise<void> {
    if (!this.garmentUpdatePending || !this.decartService.isConnected || this.isSwitchingGarment) return;

    this.isSwitchingGarment = true;
    this.errorMessage = null;
    try {
      while (this.garmentUpdatePending && this.decartService.isConnected) {
        const revision = this.garmentRevision;
        await this.decartService.setGarment(this.currentGarment());
        if (revision === this.garmentRevision) this.garmentUpdatePending = false;
      }
    } catch (error) {
      this.errorMessage = error instanceof Error ? error.message : 'Unable to update the garment.';
    } finally {
      this.isSwitchingGarment = false;
    }
  }

  private onConnectionChange(state: string): void {
    const validStates: SessionStatus[] = ['connecting', 'connected', 'generating', 'reconnecting', 'disconnected'];
    if (!validStates.includes(state as SessionStatus)) return;
    this.status = state as SessionStatus;
    if (state === 'disconnected') {
      this.errorMessage = this.hasRemoteVideo
        ? 'The Decart session disconnected. Start a new session to continue.'
        : 'The realtime media connection disconnected before Decart returned a transformed video. Check your network connection and try again.';
      this.releaseSessionResources();
      this.hasLiveSession = false;
      this.isConnecting = false;
      return;
    }
    if (state === 'connected' && this.garmentUpdatePending) {
      void this.applyGarmentIfConnected();
    }
  }

  onRemoteVideoReady(): void {
    const video = this.outputVideo?.nativeElement;
    if (!video || video.videoWidth === 0 || video.videoHeight === 0) return;
    this.hasCameraPreview = false;
    this.hasRemoteVideo = true;
    this.changeDetector.markForCheck();
  }

  private describeRealtimeError(message: string): string {
    if (/could not establish pc connection/i.test(message)) {
      return 'Decart signaling connected, but the WebRTC media connection could not be established. A VPN, firewall, or restricted network may be blocking WebRTC traffic. Try another network (such as a mobile hotspot) or ask your network administrator to allow WebRTC traffic, then start a new session.';
    }
    return message;
  }

  private showRemoteStream(stream: MediaStream): void {
    const video = this.outputVideo?.nativeElement;
    if (!video) return;
    video.srcObject = stream;
    video.muted = true;
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    this.hasRemoteVideo = false;
    video.play().catch(error => {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      this.errorMessage = error instanceof Error
        ? `The transformed video could not start: ${error.message}`
        : 'The transformed video could not start.';
      this.changeDetector.markForCheck();
    });
  }

  private showCameraPreview(stream: MediaStream): void {
    const video = this.cameraVideo?.nativeElement;
    if (!video) return;
    video.srcObject = stream;
    video.muted = true;
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    this.hasCameraPreview = true;
    video.play().catch(error => {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      this.errorMessage = error instanceof Error
        ? `The camera is active, but its preview could not start: ${error.message}`
        : 'The camera is active, but its preview could not start.';
      this.changeDetector.markForCheck();
    });
  }

  private setPreview(image: File | string | null): void {
    this.releasePreviewUrl();
    if (image instanceof File) {
      this.previewObjectUrl = URL.createObjectURL(image);
      this.garmentPreview = this.previewObjectUrl;
    } else {
      this.garmentPreview = image;
    }
  }

  private releasePreviewUrl(): void {
    if (this.previewObjectUrl) URL.revokeObjectURL(this.previewObjectUrl);
    this.previewObjectUrl = null;
  }

  private releaseSessionResources(): void {
    this.decartService.disconnect();
    this.cameraService.stop();
    const cameraVideo = this.cameraVideo?.nativeElement;
    const outputVideo = this.outputVideo?.nativeElement;
    if (cameraVideo) cameraVideo.srcObject = null;
    if (outputVideo) outputVideo.srcObject = null;
    this.hasCameraPreview = false;
    this.hasRemoteVideo = false;
    this.cameraEnabled = true;
  }
}
