import { Injectable } from '@angular/core';
import { ModelDefinition } from '@decartai/sdk';

@Injectable({ providedIn: 'root' })
export class CameraService {
  private stream: MediaStream | null = null;

  async start(model: Pick<ModelDefinition, 'fps' | 'width' | 'height'>): Promise<MediaStream> {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error('Camera access is not available in this browser. Use a secure HTTPS connection.');
    }

    if (this.stream?.active) return this.stream;

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          frameRate: model.fps,
          width: model.width,
          height: model.height,
        },
      });
      return this.stream;
    } catch (error) {
      if (error instanceof DOMException) {
        if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
          throw new Error('Camera permission was denied. Allow camera access in your browser and try again.');
        }
        if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
          throw new Error('No camera was found on this device.');
        }
        if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
          throw new Error('The camera is already in use by another application.');
        }
      }
      throw error;
    }
  }

  setEnabled(enabled: boolean): void {
    this.stream?.getVideoTracks().forEach(track => {
      track.enabled = enabled;
    });
  }

  stop(): void {
    this.stream?.getTracks().forEach(track => track.stop());
    this.stream = null;
  }
}
