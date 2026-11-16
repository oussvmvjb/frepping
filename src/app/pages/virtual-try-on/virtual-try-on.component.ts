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
import { WebRTCStats } from '@decartai/sdk';
import { CameraService, CameraProfileMode } from '../../services/camera.service';
import { DecartRealtimeService, RealtimeGarment, RealtimeSpeedMode, RealtimeTokenInfo } from '../../services/decart-realtime.service';
import { RealtimeDiagnosticsService } from '../../services/realtime-diagnostics.service';
import { AuthService } from '../../services/auth.service';
import { ProductService } from '../../services/product.service';
import { environment } from '../../../environments/environment';

type SessionStatus =
  | 'idle'
  | 'initializingCamera'
  | 'cameraReady'
  | 'requestingAuthentication'
  | 'connecting'
  | 'establishingMedia'
  | 'waitingForTransformation'
  | 'receivingTransformedVideo'
  | 'renderingTransformedVideo'
  | 'connected'
  | 'generating'
  | 'reconnecting'
  | 'disconnected'
  | 'error';

@Component({
  selector: 'app-virtual-try-on',
  templateUrl: './virtual-try-on.component.html',
  styleUrls: ['./virtual-try-on.component.scss'],
})
export class VirtualTryOnComponent implements OnInit, OnDestroy {
  @ViewChild('cameraVideo') cameraVideo?: ElementRef<HTMLVideoElement>;
  @ViewChild('outputVideo') outputVideo?: ElementRef<HTMLVideoElement>;
  @ViewChild('garmentInput') garmentInput?: ElementRef<HTMLInputElement>;
  @ViewChild('debugCameraVideo') debugCameraVideo?: ElementRef<HTMLVideoElement>;

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
  private resourcesReleased = true;
  private activeRemoteStream: MediaStream | null = null;
  private firstFrameTimeout: ReturnType<typeof setTimeout> | null = null;
  private frameCallbackId: number | null = null;
  private frameProgressTimer: ReturnType<typeof setInterval> | null = null;
  private lastRemoteVideoTime = -1;
  private remoteFrameCount = 0;
  private garmentUpdatePending = false;
  private garmentRevision = 0;
  private readonly destroy$ = new Subject<void>();

  showTokenDetails = false;
  tokenCopied = false;
  isFetchingToken = false;
  tokenFetchError: string | null = null;
  credits: number | null = null;
  isFetchingCredits = false;
  creditFetchError: string | null = null;
  remoteVideoNeedsGesture = false;
  isRunningDebugTest = false;
  remoteVideoDimensions = 'not received';
  remoteDecodeFailureMessage: string | null = null;

  constructor(
    private readonly route: ActivatedRoute,
    readonly productService: ProductService,
    private readonly cameraService: CameraService,
    private readonly decartService: DecartRealtimeService,
    readonly authService: AuthService,
    private readonly zone: NgZone,
    private readonly changeDetector: ChangeDetectorRef,
    readonly diagnostics: RealtimeDiagnosticsService
  ) {}

  get isDebugPanelEnabled(): boolean {
    return this.diagnostics.enabled;
  }

  get sessionDurationSeconds(): number {
    return this.diagnostics.sessionStartedAt
      ? Math.floor((Date.now() - this.diagnostics.sessionStartedAt) / 1000)
      : 0;
  }

  get activeCameraProfile(): CameraProfileMode {
    return this.cameraService.activeProfile;
  }

  toggleCameraProfile(): void {
    const next: CameraProfileMode = this.activeCameraProfile === 'reduced' ? 'standard' : 'reduced';
    void this.cameraService.setProfile(next, 'user toolbar toggle');
    this.changeDetector.markForCheck();
  }

  get activeModelName(): string {
    return this.decartService.getModel().name.toUpperCase().replace(/-/g, ' ');
  }

  get tokenInfo(): RealtimeTokenInfo | null {
    return this.decartService.latestTokenInfo;
  }

  get userAccessToken(): string | null {
    return this.authService.getAccessToken();
  }

  toggleTokenDetails(): void {
    this.showTokenDetails = !this.showTokenDetails;
    if (this.showTokenDetails) void this.refreshCreditBalance();
  }

  async refreshCreditBalance(): Promise<void> {
    if (this.isFetchingCredits || !this.userAccessToken) return;
    this.isFetchingCredits = true;
    this.creditFetchError = null;
    try {
      this.credits = await this.decartService.fetchCredits();
    } catch (error) {
      this.creditFetchError = error instanceof Error ? error.message : 'Could not load Decart credits.';
    } finally {
      this.isFetchingCredits = false;
      this.changeDetector.markForCheck();
    }
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
    this.diagnostics.traceDisconnect('component.destroy', 'Angular component destruction');
    this.destroy$.next();
    this.destroy$.complete();
    this.stopSession('component destruction');
    this.releasePreviewUrl();
  }

  async startSession(): Promise<void> {
    if (this.isConnecting || this.isSessionActive) return;
    if (!this.prompt.trim() && !this.garmentImage) {
      this.errorMessage = 'Choose a garment or describe one before starting. This prevents a billable passthrough session.';
      return;
    }

    const generation = ++this.startGeneration;
    this.diagnostics.startSession();
    this.resourcesReleased = false;
    this.errorMessage = null;
    this.status = 'initializingCamera';
    this.diagnostics.connectionState = 'initializing camera';
    this.isConnecting = true;
    this.remoteVideoNeedsGesture = false;
    this.remoteVideoDimensions = 'not received';
    this.remoteDecodeFailureMessage = null;
    this.remoteFrameCount = 0;

    try {
      const stream = await this.cameraService.start(this.decartService.getModel());
      if (generation !== this.startGeneration) {
        this.diagnostics.traceDisconnect('camera.stale-result.stopped', 'stale start attempt');
        this.cameraService.stop(stream);
        return;
      }
      this.showCameraPreview(stream);
      this.status = 'cameraReady';
      this.diagnostics.connectionState = 'camera ready';
      this.garmentUpdatePending = false;
      this.status = 'requestingAuthentication';
      this.diagnostics.connectionState = 'requesting authentication';

      await this.decartService.connect(
        stream,
        this.currentGarment(),
        this.speed,
        {
          onRemoteStream: remoteStream => this.zone.run(() => {
            if (generation === this.startGeneration) this.showRemoteStream(remoteStream, generation);
          }),
          onConnectionChange: state => this.zone.run(() => {
            if (generation === this.startGeneration) this.onConnectionChange(state, generation);
          }),
          onRemoteVideoStats: stats => this.zone.run(() => {
            if (generation === this.startGeneration) this.onRemoteVideoStats(stats);
          }),
          onError: message => this.zone.run(() => {
            if (generation !== this.startGeneration || this.resourcesReleased) return;
            this.diagnostics.traceDisconnect('session.error-handler', 'Decart SDK error callback');
            this.errorMessage = this.describeRealtimeError(message);
            this.status = 'error';
            this.releaseSessionResources('Decart SDK error callback', generation);
          }),
        }
      );

      if (generation !== this.startGeneration || this.resourcesReleased) return;
      this.hasLiveSession = true;
      this.markClientReadyStatus();
      this.diagnostics.log('session.client-ready', {
        connected: this.decartService.isConnected,
        waitingForTransformedFrames: !this.hasRemoteVideo,
      });
      this.scheduleFirstFrameTimeout(generation);
      await this.applyGarmentIfConnected();
    } catch (error) {
      if (generation === this.startGeneration) {
        const message = error instanceof Error ? error.message : 'Unable to start the virtual try-on session.';
        this.diagnostics.traceDisconnect('session.start-failed', 'session start error handler');
        this.errorMessage = this.describeRealtimeError(message);
        this.status = 'error';
        this.releaseSessionResources('session start error handler', generation);
      }
    } finally {
      if (generation === this.startGeneration) {
        this.isConnecting = false;
      } else if (!this.decartService.isConnecting && !this.decartService.isConnected) {
        this.isConnecting = false;
      }
      this.changeDetector.markForCheck();
    }
  }

  stopSession(initiator = 'manual stop button'): void {
    this.diagnostics.traceDisconnect('session.stop-requested', initiator);
    this.startGeneration += 1;
    this.releaseSessionResources(initiator);
    this.isConnecting = false;
    this.isSwitchingGarment = false;
    this.hasLiveSession = false;
    this.hasCameraPreview = false;
    this.hasRemoteVideo = false;
    this.remoteVideoNeedsGesture = false;
    this.status = this.decartService.isConnecting ? 'disconnected' : 'idle';
  }

  toggleCamera(): void {
    this.cameraEnabled = !this.cameraEnabled;
    this.cameraService.setEnabled(this.cameraEnabled);
    this.diagnostics.log('camera.enabled.changed', { enabled: this.cameraEnabled });
  }

  async resumeRemoteVideo(): Promise<void> {
    const video = this.outputVideo?.nativeElement;
    if (!video) return;
    try {
      await video.play();
      this.remoteVideoNeedsGesture = false;
      this.diagnostics.videoStatus = 'playback resumed by user';
      this.diagnostics.log('remote-video.user-playback-resumed', this.videoInfo(video));
      this.startRemoteFrameMonitoring(video, this.startGeneration);
    } catch (error) {
      this.diagnostics.log('remote-video.user-playback-failed', this.videoInfo(video), error);
      this.errorMessage = 'Tap to play the transformed video, then allow playback in Safari.';
    }
  }

  async runCameraDiagnostic(): Promise<void> {
    if (this.isSessionActive || this.isRunningDebugTest) return;
    this.isRunningDebugTest = true;
    let stream: MediaStream | null = null;
    this.diagnostics.log('diagnostic.camera-test.started');
    try {
      stream = await this.cameraService.start(this.decartService.getModel());
      const video = this.debugCameraVideo?.nativeElement;
      if (video) {
        video.srcObject = stream;
        video.muted = true;
        video.playsInline = true;
        video.setAttribute('playsinline', '');
        video.setAttribute('webkit-playsinline', '');
        await video.play();
        this.diagnostics.log('diagnostic.camera-test.preview-playing', this.videoInfo(video));
        video.pause();
        video.srcObject = null;
      }
      this.diagnostics.log('diagnostic.camera-test.completed');
    } catch (error) {
      this.diagnostics.log('diagnostic.camera-test.failed', undefined, error);
      this.errorMessage = error instanceof Error ? error.message : 'Camera test failed.';
    } finally {
      if (stream) this.cameraService.stop(stream);
      const video = this.debugCameraVideo?.nativeElement;
      if (video) {
        video.pause();
        video.srcObject = null;
      }
      this.isRunningDebugTest = false;
      this.changeDetector.markForCheck();
    }
  }

  async runBackendDiagnostic(): Promise<void> {
    this.isRunningDebugTest = true;
    this.diagnostics.log('diagnostic.backend-test.started');
    const startedAt = Date.now();
    try {
      const response = await fetch(`${environment.apiUrl}/health`);
      this.diagnostics.log('diagnostic.backend-test.response', {
        status: response.status,
        durationMs: Date.now() - startedAt,
      });
      if (!response.ok) throw new Error(`Backend health returned HTTP ${response.status}.`);
    } catch (error) {
      this.diagnostics.log('diagnostic.backend-test.failed', undefined, error);
      this.errorMessage = error instanceof Error ? error.message : 'Backend test failed.';
    } finally {
      this.isRunningDebugTest = false;
      this.changeDetector.markForCheck();
    }
  }

  async runTokenDiagnostic(): Promise<void> {
    this.isRunningDebugTest = true;
    this.diagnostics.log('diagnostic.token-test.started');
    try {
      await this.decartService.fetchTokenInfo();
      this.diagnostics.log('diagnostic.token-test.completed', {
        tokenReceived: Boolean(this.tokenInfo),
        expiresAt: this.tokenInfo?.expiresAt ?? null,
      });
    } catch (error) {
      this.diagnostics.log('diagnostic.token-test.failed', undefined, error);
      this.errorMessage = error instanceof Error ? error.message : 'Decart token test failed.';
    } finally {
      this.isRunningDebugTest = false;
      this.changeDetector.markForCheck();
    }
  }

  async copyDiagnosticReport(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.diagnostics.report());
      this.diagnostics.log('diagnostic.report.copied');
    } catch (error) {
      this.diagnostics.log('diagnostic.report.copy-failed', undefined, error);
      this.errorMessage = 'Could not copy the diagnostic report. Check clipboard permission.';
    }
  }

  clearDiagnosticLogs(): void {
    this.diagnostics.clear();
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
    return this.isConnecting || this.decartService.isConnecting || this.hasLiveSession || this.status === 'connected' ||
      this.status === 'generating' || this.status === 'reconnecting';
  }

  get statusLabel(): string {
    const labels: Record<SessionStatus, string> = {
      idle: 'Ready to connect',
      initializingCamera: 'Initializing camera',
      cameraReady: 'Camera ready',
      requestingAuthentication: 'Requesting authentication',
      connecting: 'Connecting to Decart',
      establishingMedia: 'Establishing media connection',
      waitingForTransformation: 'Waiting for AI transformation',
      receivingTransformedVideo: 'Receiving transformed video',
      renderingTransformedVideo: 'Rendering transformed video',
      connected: 'Connected and transforming',
      generating: 'Applying garment',
      reconnecting: 'Connection interrupted',
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

  private onConnectionChange(state: string, generation: number): void {
    if (generation !== this.startGeneration) return;
    if (state === 'connecting') this.status = 'establishingMedia';
    else if (state === 'connected') {
      this.hasLiveSession = true;
      this.status = 'waitingForTransformation';
      this.scheduleFirstFrameTimeout(generation);
    } else if (state === 'generating') this.status = 'generating';
    else if (state === 'reconnecting') this.status = 'reconnecting';
    else if (state !== 'disconnected') return;
    this.diagnostics.connectionState = this.statusLabel;

    if (state === 'disconnected') {
      this.diagnostics.traceDisconnect('session.sdk-disconnected', 'Decart SDK connection state callback');
      this.errorMessage = this.hasRemoteVideo
        ? 'The Decart session disconnected after video started. Stop the session and manually retry if you want to continue.'
        : 'The Decart session disconnected before a transformed video frame was displayed. Credits may have been used; check the balance before manually retrying.';
      this.status = 'error';
      this.releaseSessionResources('Decart SDK connection state callback', generation);
      this.hasLiveSession = false;
      this.isConnecting = false;
      return;
    }
    if (state === 'connected' && this.garmentUpdatePending) {
      void this.applyGarmentIfConnected();
    }
  }

  onRemoteVideoMetadata(): void {
    const video = this.outputVideo?.nativeElement;
    if (!video) return;
    this.remoteVideoDimensions = `${video.videoWidth} × ${video.videoHeight}`;
    this.diagnostics.log('remote-video.metadata-loaded', this.videoInfo(video));
    if (video.videoWidth === 0 || video.videoHeight === 0) return;
    this.diagnostics.videoStatus = 'metadata loaded; waiting for rendered frame';
    this.status = 'receivingTransformedVideo';
    this.startRemoteFrameMonitoring(video, this.startGeneration);
    void video.play().then(() => {
      this.remoteVideoNeedsGesture = false;
      this.diagnostics.log('remote-video.playback-started', this.videoInfo(video));
    }).catch(error => {
      this.remoteVideoNeedsGesture = true;
      this.diagnostics.videoStatus = 'user interaction required';
      this.diagnostics.log('remote-video.autoplay-blocked', this.videoInfo(video), error);
      this.changeDetector.markForCheck();
    });
  }

  onRemoteVideoPlaying(): void {
    const video = this.outputVideo?.nativeElement;
    if (!video) return;
    this.diagnostics.log('remote-video.playing-event', this.videoInfo(video));
    this.startRemoteFrameMonitoring(video, this.startGeneration);
  }

  onRemoteVideoTimeUpdate(): void {
    const video = this.outputVideo?.nativeElement;
    if (!video || this.supportsVideoFrameCallback(video)) return;
    if (video.currentTime > this.lastRemoteVideoTime) {
      this.lastRemoteVideoTime = video.currentTime;
      this.onRemoteFrameRendered(video, this.startGeneration, 'timeupdate');
    }
  }

  private onRemoteVideoStats(stats: WebRTCStats['video']): void {
    if (!stats || stats.framesReceived === 0) return;
    if (stats.framesDecoded === 0) {
      if (!this.remoteDecodeFailureMessage) {
        this.remoteDecodeFailureMessage =
          'Remote video received, but the browser has not decoded any frames.';
        this.errorMessage = this.remoteDecodeFailureMessage;
        this.diagnostics.videoStatus = 'remote packets received; zero frames decoded';
        this.diagnostics.log('remote-video.received-no-decoded-frames', {
          framesReceived: stats.framesReceived,
          framesDecoded: stats.framesDecoded,
          keyFramesDecoded: stats.keyFramesDecoded,
          packetsReceived: stats.packetsReceived,
          packetsLost: stats.packetsLost,
          packetsLostDelta: stats.packetsLostDelta,
          jitter: stats.jitter,
          avgJitterBufferMs: stats.avgJitterBufferMs,
          jitterBufferTargetDelayMs: stats.jitterBufferTargetDelayMs,
          jitterBufferMinimumDelayMs: stats.jitterBufferMinimumDelayMs,
          decoderImplementation: stats.decoderImplementation,
          avgDecodeTimeMs: stats.avgDecodeTimeMs,
          avgProcessingDelayMs: stats.avgProcessingDelayMs,
          framesDropped: stats.framesDropped,
          framesDroppedDelta: stats.framesDroppedDelta,
          freezeCount: stats.freezeCount,
          totalFreezesDuration: stats.totalFreezesDuration,
          pliCount: stats.pliCount,
          firCount: stats.firCount,
          nackCount: stats.nackCount,
          nackCountDelta: stats.nackCountDelta,
          videoElement: this.outputVideo ? this.videoInfo(this.outputVideo.nativeElement) : null,
        }, new Error(this.remoteDecodeFailureMessage));
      }
      this.changeDetector.markForCheck();
      return;
    }

    if (this.remoteDecodeFailureMessage) {
      this.diagnostics.log('remote-video.decoding-started', {
        framesReceived: stats.framesReceived,
        framesDecoded: stats.framesDecoded,
        keyFramesDecoded: stats.keyFramesDecoded,
        decoderImplementation: stats.decoderImplementation,
      });
      this.remoteDecodeFailureMessage = null;
      if (this.errorMessage === 'Remote video received, but the browser has not decoded any frames.') {
        this.errorMessage = null;
      }
    }

    // Adaptive camera profile for mobile connections:
    // If running in standard (720p@30fps) on mobile and upload network congestion is detected
    // (repeated freezes, high jitter buffer delay, or packet loss delta), dynamically
    // step down to the reduced profile (540p@15fps) via applyConstraints without restarting the camera.
    if (
      this.cameraService.isMobileDevice() &&
      this.cameraService.activeProfile === 'standard' &&
      ((stats.freezeCount && stats.freezeCount >= 3) ||
       (stats.avgJitterBufferMs && stats.avgJitterBufferMs > 180) ||
       (stats.packetsLostDelta && stats.packetsLostDelta > 4))
    ) {
      this.diagnostics.log('camera.profile.auto-downgrade-triggered', {
        freezeCount: stats.freezeCount,
        avgJitterBufferMs: stats.avgJitterBufferMs,
        packetsLostDelta: stats.packetsLostDelta,
        reason: 'Network congestion detected on mobile; auto-adapting to 540p @ 15fps to eliminate bufferbloat and freezes',
      });
      void this.cameraService.setProfile('reduced', 'auto network congestion mitigation');
    }
  }

  private describeRealtimeError(message: string): string {
    if (/could not establish pc connection/i.test(message)) {
      return 'Decart signaling connected, but the WebRTC media connection could not be established. A VPN, firewall, or restricted network may be blocking WebRTC traffic. Try another network (such as a mobile hotspot) or ask your network administrator to allow WebRTC traffic, then start a new session.';
    }
    return message;
  }

  private showRemoteStream(stream: MediaStream, generation: number): void {
    const video = this.outputVideo?.nativeElement;
    if (!video) return;
    this.clearRemoteVideoMonitoring();
    this.activeRemoteStream = stream;
    const videoTracks = stream.getVideoTracks();
    if (videoTracks.length === 0) {
      const error = new Error('Decart returned a stream without a video track.');
      this.diagnostics.remoteStreamStatus = 'missing video track';
      this.diagnostics.log('webrtc.remote-stream.missing-video-track', {
        streamId: stream.id,
        audioTrackCount: stream.getAudioTracks().length,
      }, error);
      this.failSession(error.message, 'remote stream missing video track', generation);
      return;
    }
    this.status = 'receivingTransformedVideo';
    this.diagnostics.videoStatus = 'waiting for remote video metadata';
    video.srcObject = stream;
    video.muted = true;
    video.playsInline = true;
    video.autoplay = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.setAttribute('muted', '');
    this.diagnostics.log('remote-video.src-object-attached', {
      ...this.videoInfo(video),
      streamId: stream.id,
      videoTrackCount: videoTracks.length,
      audioTrackCount: stream.getAudioTracks().length,
    });
    videoTracks.forEach(track => {
      track.addEventListener('mute', () => this.diagnostics.log('webrtc.remote-video-track.muted', {
        readyState: track.readyState,
        enabled: track.enabled,
      }));
      track.addEventListener('unmute', () => this.diagnostics.log('webrtc.remote-video-track.unmuted', {
        readyState: track.readyState,
        enabled: track.enabled,
      }));
      track.addEventListener('ended', () => this.diagnostics.log('webrtc.remote-video-track.ended', {
        readyState: track.readyState,
      }));
    });
    this.hasRemoteVideo = false;
    this.remoteVideoNeedsGesture = false;
    void video.play().then(() => {
      if (generation !== this.startGeneration) return;
      this.diagnostics.videoStatus = 'play() succeeded; waiting for actual frames';
      this.diagnostics.log('remote-video.play-promise-resolved', this.videoInfo(video));
      this.startRemoteFrameMonitoring(video, generation);
    }).catch(error => {
      if (generation !== this.startGeneration) return;
      this.remoteVideoNeedsGesture = true;
      this.diagnostics.videoStatus = 'playback requires user interaction';
      this.diagnostics.log('remote-video.play-promise-rejected', this.videoInfo(video), error);
      this.errorMessage = 'The transformed video is ready but Safari blocked autoplay. Tap “Play transformed video” to continue.';
      this.changeDetector.markForCheck();
    });
  }

  private showCameraPreview(stream: MediaStream): void {
    const video = this.cameraVideo?.nativeElement;
    if (!video) return;
    video.srcObject = stream;
    video.muted = true;
    video.playsInline = true;
    video.autoplay = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.setAttribute('muted', '');
    this.hasCameraPreview = true;
    this.diagnostics.log('camera.preview.attached', {
      streamId: stream.id,
      trackCount: stream.getTracks().length,
      videoTrackCount: stream.getVideoTracks().length,
      readyState: stream.getVideoTracks()[0]?.readyState ?? 'missing',
    });
    void video.play().then(() => {
      this.diagnostics.videoStatus = 'camera preview playing';
      this.diagnostics.log('camera.preview.playback-succeeded', this.videoInfo(video));
    }).catch(error => {
      this.diagnostics.videoStatus = 'camera preview playback failed';
      this.diagnostics.log('camera.preview.playback-failed', this.videoInfo(video), error);
      this.errorMessage = error instanceof Error
        ? `The camera is active, but its preview could not start: ${error.message}`
        : 'The camera is active, but its preview could not start.';
      this.changeDetector.markForCheck();
    });
  }

  private scheduleFirstFrameTimeout(generation: number): void {
    if (this.hasRemoteVideo || generation !== this.startGeneration) return;
    if (this.firstFrameTimeout) clearTimeout(this.firstFrameTimeout);
    this.firstFrameTimeout = setTimeout(() => {
      if (generation !== this.startGeneration || this.hasRemoteVideo || !this.hasLiveSession) return;
      this.failSession(
        this.remoteDecodeFailureMessage
          ? `${this.remoteDecodeFailureMessage} The session was stopped to avoid ongoing charges.`
          : 'Decart connected but no transformed video frames arrived within 30 seconds. The session was stopped to avoid ongoing charges.',
        'transformed video first-frame timeout',
        generation
      );
    }, 30000);
  }

  private markClientReadyStatus(): void {
    if (
      this.status === 'connecting' ||
      this.status === 'requestingAuthentication' ||
      this.status === 'establishingMedia'
    ) {
      this.status = 'waitingForTransformation';
    }
  }

  private startRemoteFrameMonitoring(video: HTMLVideoElement, generation: number): void {
    if (generation !== this.startGeneration || video.srcObject !== this.activeRemoteStream) return;
    if (typeof video.requestVideoFrameCallback === 'function') {
      if (this.frameCallbackId !== null) return;
      const onFrame: VideoFrameRequestCallback = (_now, metadata) => {
        this.frameCallbackId = null;
        if (generation !== this.startGeneration || video.srcObject !== this.activeRemoteStream) return;
        this.lastRemoteVideoTime = metadata.mediaTime;
        this.onRemoteFrameRendered(video, generation, 'requestVideoFrameCallback');
        this.frameCallbackId = video.requestVideoFrameCallback!(onFrame);
      };
      this.frameCallbackId = video.requestVideoFrameCallback(onFrame);
      this.diagnostics.log('remote-video.frame-monitor.started', { method: 'requestVideoFrameCallback' });
      return;
    }

    if (this.frameProgressTimer !== null) return;
    this.lastRemoteVideoTime = video.currentTime;
    this.frameProgressTimer = setInterval(() => {
      if (generation !== this.startGeneration || video.srcObject !== this.activeRemoteStream) return;
      if (video.currentTime > this.lastRemoteVideoTime) {
        this.lastRemoteVideoTime = video.currentTime;
        this.onRemoteFrameRendered(video, generation, 'currentTime progression');
      }
    }, 500);
    this.diagnostics.log('remote-video.frame-monitor.started', { method: 'currentTime progression fallback' });
  }

  private onRemoteFrameRendered(
    video: HTMLVideoElement,
    generation: number,
    method: string
  ): void {
    if (generation !== this.startGeneration || video.srcObject !== this.activeRemoteStream ||
        video.videoWidth === 0 || video.videoHeight === 0) return;
    this.remoteFrameCount += 1;
    if (this.remoteFrameCount === 1) {
      this.hasCameraPreview = false;
      this.hasRemoteVideo = true;
      this.status = 'renderingTransformedVideo';
      this.remoteVideoDimensions = `${video.videoWidth} × ${video.videoHeight}`;
      this.diagnostics.videoStatus = 'transformed frames rendering';
      if (this.firstFrameTimeout) clearTimeout(this.firstFrameTimeout);
      this.firstFrameTimeout = null;
      this.diagnostics.log('remote-video.first-frame-rendered', {
        method,
        frameCount: this.remoteFrameCount,
        ...this.videoInfo(video),
      });
    } else if (this.remoteFrameCount === 2) {
      this.status = 'connected';
      this.diagnostics.videoStatus = 'transformed frames confirmed';
      this.diagnostics.log('remote-video.frames-confirmed', {
        method,
        frameCount: this.remoteFrameCount,
        ...this.videoInfo(video),
      });
    }
    this.changeDetector.markForCheck();
  }

  private supportsVideoFrameCallback(video: HTMLVideoElement): boolean {
    return typeof video.requestVideoFrameCallback === 'function';
  }

  private videoInfo(video: HTMLVideoElement): Record<string, unknown> {
    const stream = video.srcObject instanceof MediaStream ? video.srcObject : null;
    const style = getComputedStyle(video);
    return {
      isConnected: video.isConnected,
      hidden: video.hidden,
      display: style.display,
      visibility: style.visibility,
      opacity: style.opacity,
      clientWidth: video.clientWidth,
      clientHeight: video.clientHeight,
      readyState: video.readyState,
      paused: video.paused,
      currentTime: video.currentTime,
      width: video.videoWidth,
      height: video.videoHeight,
      autoplay: video.autoplay,
      playsInline: video.playsInline,
      muted: video.muted,
      requestVideoFrameCallbackAvailable: typeof video.requestVideoFrameCallback === 'function',
      srcObjectType: video.srcObject?.constructor?.name ?? null,
      streamActive: stream?.active ?? null,
      streamId: stream?.id ?? null,
      videoTracks: stream?.getVideoTracks().map(track => ({
        id: track.id,
        readyState: track.readyState,
        enabled: track.enabled,
        muted: track.muted,
      })) ?? [],
    };
  }

  private failSession(message: string, initiator: string, generation: number): void {
    if (generation !== this.startGeneration) return;
    this.diagnostics.traceDisconnect('session.failed', initiator);
    this.errorMessage = message;
    this.status = 'error';
    this.hasLiveSession = false;
    this.isConnecting = false;
    this.releaseSessionResources(initiator, generation);
    this.changeDetector.markForCheck();
  }

  private clearRemoteVideoMonitoring(): void {
    if (this.firstFrameTimeout) clearTimeout(this.firstFrameTimeout);
    this.firstFrameTimeout = null;
    if (this.frameProgressTimer !== null) clearInterval(this.frameProgressTimer);
    this.frameProgressTimer = null;
    const video = this.outputVideo?.nativeElement;
    if (video && this.frameCallbackId !== null) video.cancelVideoFrameCallback?.(this.frameCallbackId);
    this.frameCallbackId = null;
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

  private releaseSessionResources(initiator: string, expectedGeneration?: number): void {
    if (expectedGeneration !== undefined && expectedGeneration !== this.startGeneration) return;
    if (this.resourcesReleased) return;
    this.resourcesReleased = true;
    this.diagnostics.traceDisconnect('session.resources.release', initiator);
    this.clearRemoteVideoMonitoring();
    this.activeRemoteStream = null;
    this.decartService.disconnect(initiator);
    this.cameraService.stop();
    const cameraVideo = this.cameraVideo?.nativeElement;
    const outputVideo = this.outputVideo?.nativeElement;
    if (cameraVideo) cameraVideo.srcObject = null;
    if (outputVideo) outputVideo.srcObject = null;
    this.hasCameraPreview = false;
    this.hasRemoteVideo = false;
    this.remoteVideoNeedsGesture = false;
    this.cameraEnabled = true;
    this.diagnostics.connectionState = 'disconnected';
    this.diagnostics.remoteStreamStatus = this.activeRemoteStream ? 'received; stopped' : this.diagnostics.remoteStreamStatus;
    this.diagnostics.videoStatus = 'stopped';
  }
}
