import { Component, HostListener, OnInit, Renderer2, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { of, Subscription } from 'rxjs';
import { catchError, filter, switchMap } from 'rxjs/operators';
import { AuthService } from './services/auth.service';
import { CartService } from './services/cart.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'FREPPING';

  // GTA UI Variables
  showIntro = true;
  health = 100;
  armor = 75;
  money = 24500;
  wantedLevel = 0;
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

  // Audio handling
  private ambienceAudio: HTMLAudioElement | null = null;

  // Cursor state
  cursorHideTimeout: any;
  isCursorActive = true;
  isAmbiencePlaying = false;

  // Router subscription
  private routerSubscription: Subscription;
  private cartSubscription?: Subscription;

  isSidebarHidden = false;

  constructor(
    private renderer: Renderer2,
    private router: Router,
    public authService: AuthService,
    public cartService: CartService
  ) {
    // Subscribe to router events
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Scroll to top on navigation
        window.scrollTo({ top: 0, behavior: 'smooth' });

        this.updateSidebarVisibility(event.urlAfterRedirects || event.url);

      }
    });
  }

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      const p = window.location.pathname;
      this.updateSidebarVisibility(p);
      if (p.includes('/login') || p.includes('/register') || p.includes('/admin')) {
        this.showIntro = false;
      }
    }
    this.cartSubscription = this.authService.isAuthenticated$.pipe(
      filter(isAuthenticated => isAuthenticated),
      switchMap(() => this.cartService.load().pipe(catchError(() => of(null))))
    ).subscribe();
    this.authService.initAuth().subscribe();
    this.initializeGTAMode();
    this.startUIAnimations();

    // Initialize audio system
    this.initializeAudio();
  }

  private updateSidebarVisibility(url: string): void {
    const cleanUrl = url.split('#')[0];
    this.isSidebarHidden = ['/login', '/register', '/admin'].some(p => cleanUrl.startsWith(p));
  }

  ngOnDestroy(): void {
    // Clean up subscriptions
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    this.cartSubscription?.unsubscribe();

    // Clean up audio
    if (this.ambienceAudio) {
      this.ambienceAudio.pause();
      this.ambienceAudio = null;
    }
  }

  initializeAudio(): void {
    // Create audio element but don't play yet
    this.ambienceAudio = new Audio();
    this.ambienceAudio.src = 'assets/sounds/gta-ambience1.mp3';
    this.ambienceAudio.loop = true;
    this.ambienceAudio.volume = 0.1;
    this.ambienceAudio.preload = 'auto';

    // Set up audio event listeners
    this.ambienceAudio.addEventListener('playing', () => {
      this.isAmbiencePlaying = true;
      console.log('Ambience started playing');
    });

    this.ambienceAudio.addEventListener('pause', () => {
      this.isAmbiencePlaying = false;
      console.log('Ambience paused');
    });

  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;
    this.updateCursorPosition();

    // Show cursor on move
    this.isCursorActive = true;
    clearTimeout(this.cursorHideTimeout);

    // Hide after 3 seconds of inactivity
    this.cursorHideTimeout = setTimeout(() => {
      this.isCursorActive = false;
    }, 3000);

    // Check if we're "aiming" (holding right click)
    this.checkAimingState(event);

  }

  toggleAmbience(): void {
    if (!this.ambienceAudio) {
      this.initializeAudio();
    }

    if (this.ambienceAudio!.paused) {
      this.playGTAAmbience();
    } else {
      this.ambienceAudio!.pause();
    }
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent): void {
    this.playClickSound();
    this.showClickEffect(event);

  }

  async playGTAAmbience(): Promise<void> {
    if (!this.ambienceAudio) {
      this.initializeAudio();
    }

    if (this.ambienceAudio && this.ambienceAudio.paused) {
      try {
        await this.ambienceAudio.play();
        console.log('Ambience playback started successfully');
      } catch (error) {
        console.warn('Ambience playback failed:', error);
      }
    }
  }

  // Rest of your existing methods remain the same...
  // Keep all your existing methods from the original code below

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
   

  onLoadingFinished() {
    this.showIntro = false;
  }

}