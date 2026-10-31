import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';
import { GarmentConfig, SavedDesign } from '../models/tshirt-customizer.models';

const STORAGE_KEY = 'frepping_custom_tshirts_v1';

@Injectable({
  providedIn: 'root'
})
export class TshirtExportService {
  private exporter = new GLTFExporter();

  /**
   * Export the 3D model and all its textures/decals as binary GLB
   */
  exportAsGLB(rootObject: THREE.Object3D, fileName = 'custom-tshirt.glb'): Promise<void> {
    return new Promise((resolve, reject) => {
      // Options to ensure all textures and materials are embedded
      const options = {
        binary: true,
        embedImages: true,
        onlyVisible: true,
        includeCustomExtensions: true
      };

      this.exporter.parse(
        rootObject,
        (gltf) => {
          try {
            const blob = new Blob([gltf as ArrayBuffer], { type: 'model/gltf-binary' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName.endsWith('.glb') ? fileName : `${fileName}.glb`;
            link.click();
            URL.revokeObjectURL(url);
            resolve();
          } catch (e) {
            reject(e);
          }
        },
        (error) => {
          console.error('Error exporting GLB:', error);
          reject(error);
        },
        options
      );
    });
  }

  /**
   * Capture current WebGL canvas as a high-res PNG image
   */
  captureCanvasImage(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera): string {
    renderer.render(scene, camera);
    return renderer.domElement.toDataURL('image/png', 0.95);
  }

  /**
   * Download a captured canvas snapshot
   */
  downloadSnapshot(dataUrl: string, fileName = 'tshirt-preview.png'): void {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = fileName.endsWith('.png') ? fileName : `${fileName}.png`;
    link.click();
  }

  /**
   * Download configuration as JSON file
   */
  exportConfigAsJSON(config: GarmentConfig, fileName = 'tshirt-config.json'): void {
    const jsonStr = JSON.stringify(config, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  }

  /**
   * LocalStorage design persistence
   */
  getSavedDesigns(): SavedDesign[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  saveDesign(name: string, config: GarmentConfig, thumbnailUrl: string): SavedDesign {
    const designs = this.getSavedDesigns();
    const newDesign: SavedDesign = {
      id: 'design_' + Date.now(),
      name: name.trim() || 'Untitled Custom T-Shirt',
      createdAt: new Date().toISOString(),
      thumbnailUrl,
      config: JSON.parse(JSON.stringify(config))
    };

    designs.unshift(newDesign);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(designs));
    return newDesign;
  }

  deleteSavedDesign(id: string): void {
    const designs = this.getSavedDesigns().filter((d) => d.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(designs));
  }
}

