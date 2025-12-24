// test-viewer.component.ts
import { Component, OnInit } from '@angular/core';

@Component({
  
  selector: 'app-test-viewer',
  template: `
    <div class="test-container">
      <h1 class="test-title">3D MODEL VIEWER TEST</h1>
      
      <div class="test-controls">
        <div class="control-group">
          <label>Model URL:</label>
          <input 
            type="text" 
            [(ngModel)]="modelUrl" 
            placeholder="Enter model URL or use test models below"
            class="url-input"
            (keyup.enter)="loadModel()"
          />
          <button class="load-btn" (click)="loadModel()">LOAD</button>
        </div>
        
        <div class="test-buttons">
          <button 
            *ngFor="let model of testModels" 
            class="model-btn"
            (click)="loadTestModel(model.url)">
            {{model.name}}
          </button>
        </div>
        
        <div class="options">
          <label class="checkbox">
            <input type="checkbox" [(ngModel)]="autoRotate" />
            Auto Rotate
          </label>
          <label class="checkbox">
            <input type="checkbox" [(ngModel)]="showHelpers" />
            Show Grid/Axes
          </label>
        </div>
      </div>

      <div class="viewer-container">
        <div class="viewer-wrapper">
          <app-model-viewer 
            *ngIf="currentModelUrl"
            [modelPath]="currentModelUrl"
            [autoRotate]="autoRotate"
            >
          </app-model-viewer>
          
          <div *ngIf="!currentModelUrl" class="placeholder">
            <i class="fas fa-cube"></i>
            <p>Select a model to load</p>
          </div>
        </div>
      </div>

      <div class="debug-info">
        <h3><i class="fas fa-bug"></i> DEBUG CONSOLE</h3>
        <div class="console">
          <div *ngFor="let log of logs" class="log-entry" [class.error]="log.type === 'error'">
            <span class="timestamp">{{log.timestamp | date:'HH:mm:ss'}}</span>
            <span class="message">{{log.message}}</span>
          </div>
        </div>
        <button class="clear-btn" (click)="clearLogs()">
          <i class="fas fa-trash"></i> CLEAR LOGS
        </button>
      </div>

      <div class="test-info">
        <h3><i class="fas fa-info-circle"></i> TEST INFORMATION</h3>
        <div class="info-grid">
          <div class="info-card">
            <h4>Supported Formats</h4>
            <ul>
              <li>.obj (Wavefront)</li>
              <li>.mtl (Material)</li>
            </ul>
          </div>
          <div class="info-card">
            <h4>Public Test Models</h4>
            <ul>
              <li>Walt Head (Three.js example)</li>
              <li>Female 02 (Three.js example)</li>
              <li>Teapot (Classic test model)</li>
            </ul>
          </div>
          <div class="info-card">
            <h4>Troubleshooting</h4>
            <ul>
              <li>Check browser console</li>
              <li>Verify CORS headers</li>
              <li>Check model URL</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./test-viewer.component.scss']
})
export class TestViewerComponent implements OnInit {
  modelUrl: string = '';
  currentModelUrl: string = '';
  autoRotate: boolean = true;
  showHelpers: boolean = true;
  logs: any[] = [];
  
  testModels = [
    { name: 'Walt Head', url: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/obj/walt/WaltHead.obj' },
    { name: 'Female 02', url: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/obj/female02/female02.obj' },
    { name: 'Teapot', url: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/obj/teapot/teapot.obj' },
    { name: 'pant (Local Test)', url: 'assets/3dmodel/pant.obj' }
  ];

  constructor() {
    // Override console.log to capture logs
    this.overrideConsole();
  }

  ngOnInit(): void {
    this.addLog('Test viewer initialized', 'info');
    this.addLog('Ready to load 3D models', 'info');
  }

  overrideConsole(): void {
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;

    console.log = (...args) => {
      originalLog.apply(console, args);
      this.addLog(args.join(' '), 'log');
    };

    console.error = (...args) => {
      originalError.apply(console, args);
      this.addLog(args.join(' '), 'error');
    };

    console.warn = (...args) => {
      originalWarn.apply(console, args);
      this.addLog(args.join(' '), 'warn');
    };
  }

  addLog(message: string, type: 'log' | 'error' | 'warn' | 'info' = 'log'): void {
    this.logs.unshift({
      timestamp: new Date(),
      message: message,
      type: type
    });
    
    // Keep only last 100 logs
    if (this.logs.length > 100) {
      this.logs.pop();
    }
  }

  loadModel(): void {
    if (!this.modelUrl.trim()) {
      this.addLog('Please enter a model URL', 'error');
      return;
    }
    
    this.addLog(`Loading model: ${this.modelUrl}`, 'info');
    this.currentModelUrl = this.modelUrl;
  }

  loadTestModel(url: string): void {
    this.modelUrl = url;
    this.loadModel();
  }

  clearLogs(): void {
    this.logs = [];
    this.addLog('Logs cleared', 'info');
  }
}