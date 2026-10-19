import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { FilesetResolver, HandLandmarker, HandLandmarkerResult } from '@mediapipe/tasks-vision';

export type TrackingStatus =
  | 'OFF'
  | 'REQUESTING_PERMISSION'
  | 'INITIALIZING_MODEL'
  | 'SEARCHING'
  | 'TRACKING'
  | 'ERROR';

export interface HandPoint {
  x: number; // 0 to 1 normalized
  y: number; // 0 to 1 normalized
  z: number;
}

export interface HandData {
  indexTip: HandPoint;
  thumbTip: HandPoint;
  wrist: HandPoint;
  palmCenter: HandPoint;
  pinchDistance: number;
  isPinching: boolean;
  isOpenPalm: boolean;
  rawLandmarks: HandPoint[];
}

export interface FrameTrackingResult {
  status: TrackingStatus;
  primaryHand: HandData | null;
  secondaryHand: HandData | null;
  handCount: number;
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class HandTrackingService implements OnDestroy {
  private statusSubject = new BehaviorSubject<TrackingStatus>('OFF');
  public status$: Observable<TrackingStatus> = this.statusSubject.asObservable();

  private errorMessageSubject = new BehaviorSubject<string>('');
  public errorMessage$: Observable<string> = this.errorMessageSubject.asObservable();

  // Observable for gesture frame updates (listened to by viewer outside/inside zone)
  private frameSubject = new Subject<FrameTrackingResult>();
  public frame$: Observable<FrameTrackingResult> = this.frameSubject.asObservable();

  private videoElement: HTMLVideoElement | null = null;
  private mediaStream: MediaStream | null = null;
  private handLandmarker: HandLandmarker | null = null;
  private animFrameId: number | null = null;
  private isRunning = false;
  private lastVideoTime = -1;

  // Pinch thresholds (hysteresis)
  private readonly PINCH_START = 0.075;
  private readonly PINCH_RELEASE = 0.105;
  private wasPrimaryPinching = false;

  constructor(private ngZone: NgZone) {}

  public get currentStatus(): TrackingStatus {
    return this.statusSubject.value;
  }

  /**
   * Start camera and initialize hand tracking model
   */
  public async startTracking(): Promise<boolean> {
    if (this.isRunning) return true;

    try {
      this.errorMessageSubject.next('');
      this.statusSubject.next('REQUESTING_PERMISSION');

      // 1. Request webcam access explicitly
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Webcam access is not supported by your browser or environment.');
      }

      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        },
        audio: false
      });

      // 2. Create offscreen/hidden video element
      if (!this.videoElement) {
        this.videoElement = document.createElement('video');
        this.videoElement.setAttribute('playsinline', 'true');
        this.videoElement.muted = true;
        this.videoElement.autoplay = true;
        this.videoElement.style.display = 'none';
        document.body.appendChild(this.videoElement);
      }

      this.videoElement.srcObject = this.mediaStream;
      await this.videoElement.play();

      // 3. Initialize MediaPipe HandLandmarker if not already done
      if (!this.handLandmarker) {
        this.statusSubject.next('INITIALIZING_MODEL');
        await this.initMediaPipe();
      }

      this.isRunning = true;
      this.statusSubject.next('SEARCHING');

      // 4. Start detection loop outside Angular zone to maintain 60fps without CD overhead
      this.ngZone.runOutsideAngular(() => {
        this.runDetectionLoop();
      });

      return true;
    } catch (err: any) {
      console.error('[HandTrackingService] Failed to start hand tracking:', err);
      this.stopTracking();

      let friendlyMessage = 'Could not access the webcam.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        friendlyMessage = 'Camera permission was denied. Please allow camera access in your browser settings to use hand gestures.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        friendlyMessage = 'No camera device found on this computer. You can still use mouse or touch controls!';
      } else if (err.message) {
        friendlyMessage = err.message;
      }

      this.errorMessageSubject.next(friendlyMessage);
      this.statusSubject.next('ERROR');
      return false;
    }
  }

  /**
   * Initialize MediaPipe HandLandmarker with Wasm fileset
   */
  private async initMediaPipe(): Promise<void> {
    const vision = await FilesetResolver.forVisionTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm'
    );

    this.handLandmarker = await HandLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath:
          'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
        delegate: 'GPU'
      },
      runningMode: 'VIDEO',
      numHands: 2,
      minHandDetectionConfidence: 0.5,
      minHandPresenceConfidence: 0.5,
      minTrackingConfidence: 0.5
    });
  }

  /**
   * Continual frame detection loop
   */
  private runDetectionLoop(): void {
    if (!this.isRunning) return;

    if (this.videoElement && this.videoElement.readyState >= 2 && this.handLandmarker) {
      const now = performance.now();
      if (this.videoElement.currentTime !== this.lastVideoTime) {
        this.lastVideoTime = this.videoElement.currentTime;

        try {
          const results: HandLandmarkerResult = this.handLandmarker.detectForVideo(
            this.videoElement,
            now
          );
          this.processLandmarks(results, now);
        } catch (e) {
          console.warn('[HandTrackingService] Detection error:', e);
        }
      }
    }

    this.animFrameId = requestAnimationFrame(() => this.runDetectionLoop());
  }

  /**
   * Process raw landmarks into structured hand data with pinch detection
   */
  private processLandmarks(results: HandLandmarkerResult, timestamp: number): void {
    const landmarksList = results.landmarks;
    const handCount = landmarksList ? landmarksList.length : 0;

    if (handCount === 0) {
      if (this.statusSubject.value !== 'SEARCHING' && this.statusSubject.value !== 'REQUESTING_PERMISSION' && this.statusSubject.value !== 'INITIALIZING_MODEL') {
        this.statusSubject.next('SEARCHING');
      }
      this.wasPrimaryPinching = false;
      this.frameSubject.next({
        status: 'SEARCHING',
        primaryHand: null,
        secondaryHand: null,
        handCount: 0,
        timestamp
      });
      return;
    }

    if (this.statusSubject.value !== 'TRACKING') {
      this.statusSubject.next('TRACKING');
    }

    // Process primary hand (index 0)
    const primaryHand = this.parseHandData(landmarksList[0], true);

    // Process secondary hand (index 1) if present
    const secondaryHand = handCount > 1 ? this.parseHandData(landmarksList[1], false) : null;

    this.frameSubject.next({
      status: 'TRACKING',
      primaryHand,
      secondaryHand,
      handCount,
      timestamp
    });
  }

  /**
   * Parse 21 landmarks for a single hand
   */
  private parseHandData(raw: { x: number; y: number; z: number }[], isPrimary: boolean): HandData {
    // Landmark 0: Wrist
    // Landmark 4: Thumb Tip
    // Landmark 8: Index Fingertip
    const wrist = raw[0];
    const thumbTip = raw[4];
    const indexTip = raw[8];

    // Compute distance between index tip and thumb tip
    const dx = thumbTip.x - indexTip.x;
    const dy = thumbTip.y - indexTip.y;
    const dz = (thumbTip.z || 0) - (indexTip.z || 0);
    const pinchDistance = Math.sqrt(dx * dx + dy * dy + dz * dz);

    let isPinching = false;
    if (isPrimary) {
      if (!this.wasPrimaryPinching) {
        if (pinchDistance < this.PINCH_START) {
          isPinching = true;
          this.wasPrimaryPinching = true;
        }
      } else {
        if (pinchDistance > this.PINCH_RELEASE) {
          isPinching = false;
          this.wasPrimaryPinching = false;
        } else {
          isPinching = true;
        }
      }
    } else {
      isPinching = pinchDistance < this.PINCH_START;
    }

    // Open Palm Detection:
    // Check if fingers (Index: 8, Middle: 12, Ring: 16, Pinky: 20) are extended from MCP/PIP joints
    const distSq = (a: { x: number; y: number }, b: { x: number; y: number }) => {
      const ddx = a.x - b.x;
      const ddy = a.y - b.y;
      return ddx * ddx + ddy * ddy;
    };

    const isIndexExt = distSq(wrist, raw[8]) > distSq(wrist, raw[6]) * 1.25;
    const isMiddleExt = distSq(wrist, raw[12]) > distSq(wrist, raw[10]) * 1.25;
    const isRingExt = distSq(wrist, raw[16]) > distSq(wrist, raw[14]) * 1.25;
    const isPinkyExt = distSq(wrist, raw[20]) > distSq(wrist, raw[18]) * 1.25;

    let extendedCount = 0;
    if (isIndexExt) extendedCount++;
    if (isMiddleExt) extendedCount++;
    if (isRingExt) extendedCount++;
    if (isPinkyExt) extendedCount++;

    const isOpenPalm = !isPinching && extendedCount >= 3;

    // Palm center estimation (midpoint between wrist and middle MCP)
    const palmCenter: HandPoint = {
      x: (wrist.x + raw[9].x) * 0.5,
      y: (wrist.y + raw[9].y) * 0.5,
      z: ((wrist.z || 0) + (raw[9].z || 0)) * 0.5
    };

    return {
      indexTip: { x: indexTip.x, y: indexTip.y, z: indexTip.z || 0 },
      thumbTip: { x: thumbTip.x, y: thumbTip.y, z: thumbTip.z || 0 },
      wrist: { x: wrist.x, y: wrist.y, z: wrist.z || 0 },
      palmCenter,
      pinchDistance,
      isPinching,
      isOpenPalm,
      rawLandmarks: raw.map(l => ({ x: l.x, y: l.y, z: l.z || 0 }))
    };
  }

  /**
   * Stop webcam tracking and release media tracks completely
   */
  public stopTracking(): void {
    this.isRunning = false;

    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => {
        track.stop();
      });
      this.mediaStream = null;
    }

    if (this.videoElement) {
      this.videoElement.srcObject = null;
      if (this.videoElement.parentElement) {
        this.videoElement.parentElement.removeChild(this.videoElement);
      }
      this.videoElement = null;
    }

    this.wasPrimaryPinching = false;
    this.statusSubject.next('OFF');
  }

  ngOnDestroy(): void {
    this.stopTracking();
    if (this.handLandmarker) {
      this.handLandmarker.close();
      this.handLandmarker = null;
    }
  }
}
