import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { DesignDecal } from '../models/tshirt-customizer.models';
import { TshirtPrintService } from './tshirt-print.service';

/**
 * Backward-compatible bridge to the enhanced TshirtPrintService
 */
@Injectable({
  providedIn: 'root'
})
export class TshirtDesignService {
  constructor(public printService: TshirtPrintService) {}

  setTargetMesh(mesh: THREE.Mesh, fabricNormalMap?: THREE.Texture | null): void {
    this.printService.setTargetMesh(mesh, fabricNormalMap);
  }

  applyDecal(decal: DesignDecal, layerIndex = 0): void {
    this.printService.applyPrint(decal, layerIndex);
  }

  reprojectAllDecals(decals: DesignDecal[]): void {
    this.printService.reprojectAll(decals);
  }

  removeDecal(id: string): void {
    this.printService.removeDecal(id);
  }

  removeAllDecals(): void {
    this.printService.removeAllDecals();
  }

  dispose(): void {
    this.printService.dispose();
  }
}
