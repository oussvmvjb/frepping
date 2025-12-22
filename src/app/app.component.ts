import { Component, HostListener, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'FREPPING';
  
  // GTA UI Variables
  health = 100;
  armor = 75;
  money = 24500;
  wantedLevel =0;
  isAiming = false;
  mouseX = 0;
  mouseY = 0;
  
  // Cursor types
  cursorTypes = {
    default: 'gta-default',
    pointer: 'gta-pointer',
    grab: 'gta-grab',
    aiming: 'gta-aiming',
    loading: 'gta-loading'
  };
  currentCursor = 'gta-default';
  
  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    this.initializeGTAMode();
    this.startUIAnimations();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;
    this.updateCursorPosition();
    
    // Check if we're "aiming" (holding right click)
    this.checkAimingState(event);
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent): void {
    this.playClickSound();
    this.showClickEffect(event);
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    // Toggle aiming with right mouse button simulation
    if (event.code === 'ShiftRight' || event.code === 'ControlRight') {
      this.isAiming = true;
      this.setCursor(this.cursorTypes.aiming);
    }
    
    // Show wanted level with Tab (like in GTA)
    if (event.code === 'Tab') {
      this.toggleWantedLevel();
    }
  }

  @HostListener('window:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent): void {
    if (event.code === 'ShiftRight' || event.code === 'ControlRight') {
      this.isAiming = false;
      this.setCursor(this.cursorTypes.default);
    }
  }

  @HostListener('mouseover', ['$event'])
  onMouseOver(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    
    // Change cursor based on element type
    if (target.tagName === 'BUTTON' || target.closest('button')) {
      this.setCursor(this.cursorTypes.pointer);
    } else if (target.tagName === 'A' || target.closest('a')) {
      this.setCursor(this.cursorTypes.pointer);
    } else if (target.classList.contains('draggable') || target.closest('.draggable')) {
      this.setCursor(this.cursorTypes.grab);
    } else {
      this.setCursor(this.cursorTypes.default);
    }
  }

  initializeGTAMode(): void {
    // Hide default cursor
    this.renderer.setStyle(document.body, 'cursor', 'none');
    
    // Add GTA loading effect on init
    this.showLoadingEffect();
    
    // Start background music/ambience
    this.playGTAAmbience();
  }

  setCursor(cursorType: string): void {
    this.currentCursor = cursorType;
    const cursorElement = document.getElementById('gtaCursor');
    
    if (cursorElement) {
      // Remove all cursor classes
      Object.values(this.cursorTypes).forEach(type => {
        this.renderer.removeClass(cursorElement, type);
      });
      
      // Add current cursor class
      this.renderer.addClass(cursorElement, cursorType);
    }
  }

  updateCursorPosition(): void {
    const cursor = document.getElementById('gtaCursor');
    const aim = document.getElementById('gtaAim');
    
    if (cursor) {
      this.renderer.setStyle(cursor, 'left', `${this.mouseX}px`);
      this.renderer.setStyle(cursor, 'top', `${this.mouseY}px`);
    }
    
    if (aim && this.isAiming) {
      this.renderer.setStyle(aim, 'left', `${this.mouseX}px`);
      this.renderer.setStyle(aim, 'top', `${this.mouseY}px`);
    }
  }

  checkAimingState(event: MouseEvent): void {
    // Check if right mouse button is pressed
    if (event.buttons === 2) {
      this.isAiming = true;
      this.setCursor(this.cursorTypes.aiming);
    } else {
      this.isAiming = false;
      if (this.currentCursor === this.cursorTypes.aiming) {
        this.setCursor(this.cursorTypes.default);
      }
    }
  }

  toggleWantedLevel(): void {
    this.wantedLevel = this.wantedLevel === 5 ? 0 : this.wantedLevel + 1;
    
    // Play police siren sound when wanted level changes
    if (this.wantedLevel > 0) {
      this.playSirenSound();
    }
  }

  getWantedStars(): any[] {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push({ active: i <= this.wantedLevel });
    }
    return stars;
  }

  playClickSound(): void {
    // Play GTA-style click sound
    const audio = new Audio();
    audio.src = 'assets/sounds/gtaclick.wav';
    audio.volume = 0.3;
    audio.play().catch(() => {
      // Fallback to system beep if audio file not found
      console.log('\u0007'); // ASCII bell character
    });
  }

  playGTAAmbience(): void {
    // Play GTA ambient sound (optional)
    setTimeout(() => {
      const audio = new Audio();
      audio.src = 'assets/sounds/gta-ambience.mp3';
      audio.loop = true;
      audio.volume = 0.1;
      audio.play().catch(e => console.log('Ambient audio error:', e));
    });
  }

  playSirenSound(): void {
    const audio = new Audio();
    audio.src = 'assets/sounds/police-siren.mp3';
    audio.volume = 0.2;
    audio.play().catch(e => console.log('Siren audio error:', e));
  }

  showLoadingEffect(): void {
    this.setCursor(this.cursorTypes.loading);
    
    // Show loading effect for 1.5 seconds
    setTimeout(() => {
      this.setCursor(this.cursorTypes.default);
    }, 1500);
  }

  showClickEffect(event: MouseEvent): void {
    // Create ripple effect on click
    const ripple = this.renderer.createElement('div');
    this.renderer.addClass(ripple, 'gta-click-effect');
    this.renderer.setStyle(ripple, 'left', `${event.clientX}px`);
    this.renderer.setStyle(ripple, 'top', `${event.clientY}px`);
    this.renderer.appendChild(document.body, ripple);
    
    // Remove after animation
    setTimeout(() => {
      this.renderer.removeChild(document.body, ripple);
    }, 600);
  }

  startUIAnimations(): void {
    // Animate health/armor bars slightly
    setInterval(() => {
      if (this.health < 100) {
        this.health += 0.1; // Regenerate health slowly
      }
      if (this.armor < 100) {
        this.armor += 0.05; // Regenerate armor slower
      }
    }, 1000);
  }
}