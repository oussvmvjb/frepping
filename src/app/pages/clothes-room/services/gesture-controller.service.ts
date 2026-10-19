import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { FrameTrackingResult, HandData } from './hand-tracking.service';

export type GestureState =
  | 'NO_HANDS'
  | 'CURSOR_HOVER'
  | 'OPEN_PALM_READY'
  | 'GRABBED_ROTATING'
  | 'TWO_HAND_ZOOMING';

export interface CursorPosition {
  x: number; // In canvas pixels
  y: number; // In canvas pixels
  normalizedX: number; // -1 to +1 for Three.js raycasting
  normalizedY: number; // -1 to +1 for Three.js raycasting
  isPinching: boolean;
  isOpenPalm: boolean;
  pinchDistance: number;
}

export interface ModelTransformUpdate {
  rotationY: number; // Radians
  rotationX: number; // Radians
  zoomFactor: number; // 0.5 to 2.5
  isGrabbed: boolean;
  isZooming: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class GestureControllerService {
  private gestureStateSubject = new BehaviorSubject<GestureState>('NO_HANDS');
  public gestureState$: Observable<GestureState> = this.gestureStateSubject.asObservable();

  // Observable for carousel model navigation triggered by open-palm swipes or buttons
  public carouselNavigation$ = new Subject<'PREV' | 'NEXT'>();

  // Smoothing parameter (0 to 1, higher = faster, lower = smoother)
  private readonly SMOOTH_ALPHA = 0.38;

  // Screen cursor position
  private currentCursor: CursorPosition = {
    x: 0,
    y: 0,
    normalizedX: 0,
    normalizedY: 0,
    isPinching: false,
    isOpenPalm: false,
    pinchDistance: 1
  };

  // Model transform targets
  private targetRotY = 0;
  private targetRotX = 0;
  private currentRotY = 0;
  private currentRotX = 0;

  // Zoom targets
  private currentZoom = 1.0;
  private targetZoom = 1.0;
  private readonly MIN_ZOOM = 0.6;
  private readonly MAX_ZOOM = 2.4;

  // Grab state anchors
  private isGrabbed = false;
  private grabStartX = 0;
  private grabStartY = 0;
  private grabInitialRotY = 0;
  private grabInitialRotX = 0;

  // Second hand zoom anchors
  private isSecondHandActive = false;
  private zoomInitialHand2Y = 0;
  private zoomInitialLevel = 1.0;

  // Open-palm carousel swipe navigation state machine
  private isSwipeArmed = false;
  private swipeAnchorX = 0.5;
  private swipeCooldownUntil = 0;
  private readonly SWIPE_THRESHOLD = 0.12; // Minimum normalized displacement
  private readonly SWIPE_COOLDOWN_MS = 750; // Prevent rapid repeated switches

  // Canvas viewport dimensions
  private canvasWidth = 800;
  private canvasHeight = 600;

  public setCanvasDimensions(width: number, height: number): void {
    if (width > 0 && height > 0) {
      this.canvasWidth = width;
      this.canvasHeight = height;
    }
  }

  public get cursor(): CursorPosition {
    return this.currentCursor;
  }

  public get state(): GestureState {
    return this.gestureStateSubject.value;
  }

  /**
   * Reset rotation and zoom to default
   */
  public resetTransforms(): void {
    this.targetRotY = 0;
    this.targetRotX = 0;
    this.currentRotY = 0;
    this.currentRotX = 0;
    this.targetZoom = 1.0;
    this.currentZoom = 1.0;
    this.isGrabbed = false;
    this.isSecondHandActive = false;
    this.isSwipeArmed = false;
    this.gestureStateSubject.next('NO_HANDS');
  }

  /**
   * Manual adjustments from mouse / touch / UI buttons
   */
  public addManualRotation(deltaX: number, deltaY: number): void {
    this.targetRotY += deltaX;
    this.targetRotX = Math.max(-0.6, Math.min(0.6, this.targetRotX + deltaY));
  }

  public setManualZoom(deltaZoom: number): void {
    this.targetZoom = Math.max(this.MIN_ZOOM, Math.min(this.MAX_ZOOM, this.targetZoom + deltaZoom));
  }

  public setTargetZoom(zoom: number): void {
    this.targetZoom = Math.max(this.MIN_ZOOM, Math.min(this.MAX_ZOOM, zoom));
  }

  public navigateNext(): void {
    this.carouselNavigation$.next('NEXT');
  }

  public navigatePrev(): void {
    this.carouselNavigation$.next('PREV');
  }

  /**
   * Main per-frame ingestion of tracking data
   */
  public processTrackingFrame(frame: FrameTrackingResult): void {
    const primary = frame.primaryHand;
    const secondary = frame.secondaryHand;

    if (!primary) {
      if (this.isGrabbed) {
        this.isGrabbed = false;
      }
      this.isSecondHandActive = false;
      this.isSwipeArmed = false;
      if (this.gestureStateSubject.value !== 'NO_HANDS') {
        this.gestureStateSubject.next('NO_HANDS');
      }
      return;
    }

    // 1. Compute smoothed cursor screen coordinates (Mirrored X for natural selfie feel)
    const rawX = (1.0 - primary.indexTip.x) * this.canvasWidth;
    const rawY = primary.indexTip.y * this.canvasHeight;

    this.currentCursor.x += (rawX - this.currentCursor.x) * this.SMOOTH_ALPHA;
    this.currentCursor.y += (rawY - this.currentCursor.y) * this.SMOOTH_ALPHA;

    // Normalized Device Coordinates (-1 to +1) for Three.js raycasting
    this.currentCursor.normalizedX = (this.currentCursor.x / this.canvasWidth) * 2 - 1;
    this.currentCursor.normalizedY = -(this.currentCursor.y / this.canvasHeight) * 2 + 1;
    this.currentCursor.isPinching = primary.isPinching;
    this.currentCursor.isOpenPalm = primary.isOpenPalm;
    this.currentCursor.pinchDistance = primary.pinchDistance;

    const now = performance.now();
    // User hand X in mirrored coordinates [0 to 1] (0 = left, 1 = right from user perspective)
    const userHandX = 1.0 - (primary.palmCenter ? primary.palmCenter.x : primary.indexTip.x);

    // 2. State Machine Logic
    if (primary.isPinching) {
      // Disarm swipe immediately when grabbing
      this.isSwipeArmed = false;

      if (!this.isGrabbed) {
        // Transition: IDLE -> GRABBED
        this.isGrabbed = true;
        this.grabStartX = this.currentCursor.x;
        this.grabStartY = this.currentCursor.y;
        this.grabInitialRotY = this.targetRotY;
        this.grabInitialRotX = this.targetRotX;
      }

      // Check for two-hand zoom
      if (secondary) {
        if (!this.isSecondHandActive) {
          this.isSecondHandActive = true;
          this.zoomInitialHand2Y = secondary.indexTip.y;
          this.zoomInitialLevel = this.targetZoom;
        }

        // Raising 2nd hand (lower y in screen coords) -> zoom IN
        const deltaY2 = this.zoomInitialHand2Y - secondary.indexTip.y;
        this.targetZoom = Math.max(
          this.MIN_ZOOM,
          Math.min(this.MAX_ZOOM, this.zoomInitialLevel + deltaY2 * 3.5)
        );

        if (this.gestureStateSubject.value !== 'TWO_HAND_ZOOMING') {
          this.gestureStateSubject.next('TWO_HAND_ZOOMING');
        }
      } else {
        if (this.isSecondHandActive) {
          this.isSecondHandActive = false;
        }

        if (this.gestureStateSubject.value !== 'GRABBED_ROTATING') {
          this.gestureStateSubject.next('GRABBED_ROTATING');
        }
      }

      // Calculate horizontal and vertical rotation from primary hand movement
      const deltaX = (this.currentCursor.x - this.grabStartX) / this.canvasWidth;
      const deltaY = (this.currentCursor.y - this.grabStartY) / this.canvasHeight;

      // Rotate full 360 degrees horizontally
      this.targetRotY = this.grabInitialRotY + deltaX * (Math.PI * 2.8);
      // Safe secondary axis tilt clamped
      this.targetRotX = Math.max(
        -0.5,
        Math.min(0.5, this.grabInitialRotX + deltaY * 1.5)
      );
    } else {
      // Not pinching: can be OPEN PALM or general CURSOR HOVER
      if (this.isGrabbed) {
        this.isGrabbed = false;
      }
      this.isSecondHandActive = false;

      // Check for Open-Palm Swipe Navigation
      if (primary.isOpenPalm) {
        if (this.gestureStateSubject.value !== 'OPEN_PALM_READY') {
          this.gestureStateSubject.next('OPEN_PALM_READY');
        }

        // Swipe Gesture Detection with Cooldown and Neutral Re-arming
        if (now >= this.swipeCooldownUntil) {
          if (!this.isSwipeArmed) {
            // Hand must be in neutral center band to arm the swipe
            if (userHandX >= 0.32 && userHandX <= 0.68) {
              this.isSwipeArmed = true;
              this.swipeAnchorX = userHandX;
            }
          } else {
            const dx = userHandX - this.swipeAnchorX;

            // Open hand moves to the RIGHT -> Next Model
            if (dx > this.SWIPE_THRESHOLD) {
              this.carouselNavigation$.next('NEXT');
              this.isSwipeArmed = false;
              this.swipeCooldownUntil = now + this.SWIPE_COOLDOWN_MS;
            }
            // Open hand moves to the LEFT -> Previous Model
            else if (dx < -this.SWIPE_THRESHOLD) {
              this.carouselNavigation$.next('PREV');
              this.isSwipeArmed = false;
              this.swipeCooldownUntil = now + this.SWIPE_COOLDOWN_MS;
            }
          }
        }
      } else {
        // Not open palm, normal hover cursor
        this.isSwipeArmed = false;
        if (this.gestureStateSubject.value !== 'CURSOR_HOVER') {
          this.gestureStateSubject.next('CURSOR_HOVER');
        }
      }
    }
  }

  /**
   * Called in Three.js render loop to retrieve interpolated transforms
   */
  public updateInterpolatedTransforms(lerpFactor: number = 0.14): ModelTransformUpdate {
    this.currentRotY += (this.targetRotY - this.currentRotY) * lerpFactor;
    this.currentRotX += (this.targetRotX - this.currentRotX) * lerpFactor;
    this.currentZoom += (this.targetZoom - this.currentZoom) * lerpFactor;

    return {
      rotationY: this.currentRotY,
      rotationX: this.currentRotX,
      zoomFactor: this.currentZoom,
      isGrabbed: this.isGrabbed,
      isZooming: this.isSecondHandActive
    };
  }
}
