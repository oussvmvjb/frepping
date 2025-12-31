import { Component, EventEmitter, OnInit, Output, HostListener } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('600ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('500ms ease-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class IntroComponent implements OnInit {

  @Output() loadingFinished = new EventEmitter<void>();

  // Loading progress
  progress = 0;
  progressPercentage = '0%';
  
  // Skip functionality
  canSkip = false;

  ngOnInit(): void {
    this.startLoading();
    this.enableSkip();
  }

  @HostListener('window:keydown', ['$event'])
  @HostListener('window:click', ['$event'])
  skipIntro(event: Event): void {
    if (this.canSkip) {
      event.preventDefault();
      this.completeLoading();
    }
  }

  enableSkip(): void {
    setTimeout(() => {
      this.canSkip = true;
    }, 2000);
  }

  startLoading(): void {
    const loadingInterval = setInterval(() => {
      this.progress += Math.random() * 3;
      this.progressPercentage = `${Math.floor(this.progress)}%`;
      
      if (this.progress >= 100) {
        this.progress = 100;
        this.progressPercentage = '100%';
        clearInterval(loadingInterval);
        
        setTimeout(() => {
          this.completeLoading();
        }, 500);
      }
    }, 100);
  }

  completeLoading(): void {
    this.loadingFinished.emit();
  }
}