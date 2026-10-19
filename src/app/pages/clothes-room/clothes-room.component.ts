import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClothesViewerComponent } from './components/clothes-viewer/clothes-viewer.component';
import { HandTrackingService, TrackingStatus } from './services/hand-tracking.service';
import { GestureControllerService, GestureState } from './services/gesture-controller.service';
import { CartService } from '../../services/cart.service';
import {
  CLOTHING_MODELS_REGISTRY,
  ClothingModelItem
} from './models/clothes-room.models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-clothes-room',
  standalone: true,
  imports: [CommonModule, RouterModule, ClothesViewerComponent],
  templateUrl: './clothes-room.component.html',
  styleUrls: ['./clothes-room.component.scss']
})
export class ClothesRoomComponent implements OnInit, OnDestroy {
  @ViewChild('viewer') viewer?: ClothesViewerComponent;

  // Multi-model clothing registry
  public readonly clothingModels: ClothingModelItem[] = CLOTHING_MODELS_REGISTRY;
  public selectedModelIndex = 0;

  public autoRotate = false;
  public trackingStatus: TrackingStatus = 'OFF';
  public gestureState: GestureState = 'NO_HANDS';
  public trackingError = '';
  public showGuide = true;
  public addedToCart = false;

  private subs = new Subscription();

  constructor(
    public handTracking: HandTrackingService,
    public gestureController: GestureControllerService,
    private cartService: CartService,
    private cdRef: ChangeDetectorRef
  ) {}

  public get selectedModel(): ClothingModelItem {
    return this.clothingModels[this.selectedModelIndex];
  }

  ngOnInit(): void {
    // Subscribe to tracking status
    this.subs.add(
      this.handTracking.status$.subscribe((status) => {
        this.trackingStatus = status;
        this.cdRef.markForCheck();
      })
    );

    // Subscribe to tracking errors
    this.subs.add(
      this.handTracking.errorMessage$.subscribe((err) => {
        this.trackingError = err;
        this.cdRef.markForCheck();
      })
    );

    // Subscribe to gesture state machine updates
    this.subs.add(
      this.gestureController.gestureState$.subscribe((state) => {
        this.gestureState = state;
        this.cdRef.markForCheck();
      })
    );
  }

  /**
   * Handle model change emitted from 3D carousel
   */
  public onModelChanged(newIndex: number): void {
    this.selectedModelIndex = newIndex;
    this.cdRef.markForCheck();
  }

  /**
   * Select model from UI list or carousel click
   */
  public selectModel(index: number): void {
    this.selectedModelIndex = index;
    if (this.viewer) {
      this.viewer.selectModelIndex(index);
    }
  }

  public nextModel(): void {
    if (this.viewer) {
      this.viewer.nextModel();
    }
  }

  public prevModel(): void {
    if (this.viewer) {
      this.viewer.prevModel();
    }
  }

  /**
   * Toggle Hand Tracking ON / OFF
   */
  public async toggleTracking(): Promise<void> {
    if (this.isTrackingActive) {
      this.handTracking.stopTracking();
      this.gestureController.resetTransforms();
    } else {
      await this.handTracking.startTracking();
    }
  }

  public get isTrackingActive(): boolean {
    return (
      this.trackingStatus === 'REQUESTING_PERMISSION' ||
      this.trackingStatus === 'INITIALIZING_MODEL' ||
      this.trackingStatus === 'SEARCHING' ||
      this.trackingStatus === 'TRACKING'
    );
  }

  public toggleAutoRotate(): void {
    this.autoRotate = !this.autoRotate;
  }

  public resetView(): void {
    if (this.viewer) {
      this.viewer.resetView();
    }
    this.autoRotate = false;
  }

  public toggleGuide(): void {
    this.showGuide = !this.showGuide;
  }

  public addToCart(): void {
    const item = this.selectedModel;
    this.cartService.addToCart(
      {
        id: item.id,
        name: item.name,
        price: item.price,
        image_url: '',
        category: { name: item.category }
      },
      1,
      { id: `${item.id}-M`, size: 'M' }
    );
    this.addedToCart = true;
    setTimeout(() => {
      this.addedToCart = false;
      this.cdRef.markForCheck();
    }, 2500);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    this.handTracking.stopTracking();
  }
}
