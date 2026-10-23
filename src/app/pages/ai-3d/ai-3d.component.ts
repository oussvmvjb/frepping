import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  Ai3dGeneratorComponent,
  Generated3DEvent
} from '../../components/ai-3d-generator/ai-3d-generator.component';

@Component({
  selector: 'app-ai-3d-page',
  standalone: true,
  imports: [CommonModule, Ai3dGeneratorComponent],
  template: `
    <div class="ai-3d-page-wrapper">
      <app-ai-3d-generator
        [embeddedMode]="false"
        (modelGenerated)="onModelGenerated($event)"
      ></app-ai-3d-generator>
    </div>
  `,
  styles: [
    `
      .ai-3d-page-wrapper {
        min-height: 100vh;
        background: #090c0a;
        padding-top: 20px;
        padding-bottom: 60px;
      }
    `
  ]
})
export class Ai3dPageComponent {
  constructor(private router: Router) {}

  onModelGenerated(event: Generated3DEvent): void {
    console.log('[Ai3dPageComponent] New 3D model generated:', event);
  }
}
