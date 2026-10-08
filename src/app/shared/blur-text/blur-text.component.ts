import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ElementRef,
  NgZone,
  ChangeDetectionStrategy,
  PLATFORM_ID,
  Inject,
  ChangeDetectorRef,
  HostBinding,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-blur-text',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      *ngFor="let seg of segments; let i = index; let last = last"
      class="bt-seg"
      aria-hidden="true"
      [class.in-view]="inView"
      [style.--i]="i"
      (animationend)="last && onAnimEnd($event)"
    >{{ seg === ' ' ? '\u00a0' : seg }}{{ animateBy === 'words' && !last ? '\u00a0' : '' }}</span>
  `,
  styleUrls: ['./blur-text.component.scss'],
})
export class BlurTextComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() text = '';
  @Input() delay = 200;
  @Input() animateBy: 'words' | 'letters' = 'words';
  @Input() direction: 'top' | 'bottom' = 'top';
  @Input() threshold = 0.1;
  @Input() rootMargin = '0px';
  @Input() stepDuration = 0.35;
  @Input() startDelay = 0;
  @Input() className = '';

  @Output() animationComplete = new EventEmitter<void>();

  @HostBinding('attr.aria-label') get ariaLabel() { return this.text; }
  @HostBinding('attr.role') role = 'text';
  @HostBinding('class.bt-dir-bottom') get isBottom() { return this.direction === 'bottom'; }

  // CSS custom props propagated to host
  @HostBinding('style.--bt-duration')    get cssDuration()   { return `${this.stepDuration * 2}s`; }
  @HostBinding('style.--bt-delay')       get cssDelay()      { return `${this.delay}ms`; }
  @HostBinding('style.--bt-start-delay') get cssStartDelay() { return `${this.startDelay}ms`; }

  segments: string[] = [];
  inView = false;

  private observer: IntersectionObserver | null = null;

  constructor(
    private el: ElementRef<HTMLElement>,
    private zone: NgZone,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {}

  ngOnInit(): void {
    this.segments =
      this.animateBy === 'words' ? this.text.split(' ') : this.text.split('');
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      // SSR: show immediately
      this.inView = true;
      return;
    }

    this.zone.runOutsideAngular(() => {
      this.observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            this.zone.run(() => {
              this.inView = true;
              this.cdr.markForCheck();
            });
            this.observer?.disconnect();
            this.observer = null;
          }
        },
        { threshold: this.threshold, rootMargin: this.rootMargin },
      );
      this.observer.observe(this.el.nativeElement);
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.observer = null;
  }

  onAnimEnd(_e: AnimationEvent): void {
    this.animationComplete.emit();
  }
}
