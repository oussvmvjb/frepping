import { Injectable } from '@angular/core';
import {
  BodyMeasurements,
  AvatarFittingResult,
  GarmentMeasurements,
  GarmentSize
} from '../models/tshirt-customizer.models';
import { SIZE_PRESETS } from './tshirt-deformation.service';

@Injectable({
  providedIn: 'root'
})
export class AvatarTryOnService {
  /**
   * Evaluates garment fit against body measurements
   * Calculates ease values (Garment Dimension - Body Dimension)
   * Positive ease = comfort room. For regular T-shirt:
   * Chest ease: +8 to +16 cm (optimal)
   * Waist ease: +6 to +14 cm (optimal)
   * Shoulder ease: +1 to +4 cm (optimal)
   */
  evaluateFit(body: BodyMeasurements, garment: GarmentMeasurements): AvatarFittingResult {
    const chestEase = garment.chest - body.chestCircumferenceCm;
    const waistEase = garment.waist - body.waistCircumferenceCm;
    const shoulderEase = garment.shoulder - body.shoulderWidthCm;

    const tensionPoints: string[] = [];

    // Chest evaluation
    let chestFit: 'loose' | 'optimal' | 'tight' = 'optimal';
    if (chestEase < 4) {
      chestFit = 'tight';
      tensionPoints.push('Chest / Underarm compression');
    } else if (chestEase > 22) {
      chestFit = 'loose';
    }

    // Waist evaluation
    let waistFit: 'loose' | 'optimal' | 'tight' = 'optimal';
    if (waistEase < 3) {
      waistFit = 'tight';
      tensionPoints.push('Waist / Midriff strain');
    } else if (waistEase > 24) {
      waistFit = 'loose';
    }

    // Shoulders evaluation
    let shoulderFit: 'loose' | 'optimal' | 'tight' = 'optimal';
    if (shoulderEase < 0) {
      shoulderFit = 'tight';
      tensionPoints.push('Shoulder yoke tightness');
    } else if (shoulderEase > 7) {
      shoulderFit = 'loose';
    }

    // Compute Fit Score (0 to 100%)
    let score = 100;
    if (chestFit === 'tight') score -= 25;
    if (waistFit === 'tight') score -= 20;
    if (shoulderFit === 'tight') score -= 25;
    if (chestFit === 'loose') score -= 10;
    if (waistFit === 'loose') score -= 10;

    // Recommend optimal size
    const recommendedSize = this.findBestSize(body);

    return {
      fitScore: Math.max(10, score),
      tightnessMap: {
        chest: chestFit,
        waist: waistFit,
        shoulders: shoulderFit,
        length: 'optimal'
      },
      recommendedSize,
      tensionPoints
    };
  }

  /**
   * Suggests standard size based on user body chest & shoulder measurements
   */
  findBestSize(body: BodyMeasurements): GarmentSize {
    const chest = body.chestCircumferenceCm;

    if (chest < 90) return 'XS';
    if (chest < 96) return 'S';
    if (chest < 104) return 'M';
    if (chest < 112) return 'L';
    if (chest < 120) return 'XL';
    return 'XXL';
  }
}

