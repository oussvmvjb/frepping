import { Component, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface SvgElementData {
  tag: string;
  attrs: Record<string, any>;
}

/**
 * Minimal icon renderer.
 * `icon` can be:
 *   - A HugeIcons data array: [tag, attrs, children?][]
 *   - A Font-Awesome class string: 'fas fa-home'
 *   - null/undefined -> nothing rendered
 */
@Component({
  selector: 'app-hugeicon',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- FA fallback -->
    <i *ngIf="faClass" [class]="faClass" aria-hidden="true"></i>

    <!-- HugeIcons SVG rendered from data array -->
    <svg *ngIf="!faClass && svgElements.length"
         viewBox="0 0 24 24"
         fill="none"
         stroke="currentColor"
         [attr.width]="size"
         [attr.height]="size"
         [attr.stroke-width]="strokeWidth"
         stroke-linecap="round"
         stroke-linejoin="round"
         aria-hidden="true">
      <ng-container *ngFor="let el of svgElements">
        <path *ngIf="el.tag === 'path'" [attr.d]="el.attrs['d']" [attr.fill]="el.attrs['fill'] || 'none'" [attr.stroke]="el.attrs['stroke'] || 'currentColor'"></path>
        <circle *ngIf="el.tag === 'circle'" [attr.cx]="el.attrs['cx']" [attr.cy]="el.attrs['cy']" [attr.r]="el.attrs['r']" [attr.fill]="el.attrs['fill'] || 'none'"></circle>
        <line *ngIf="el.tag === 'line'" [attr.x1]="el.attrs['x1']" [attr.y1]="el.attrs['y1']" [attr.x2]="el.attrs['x2']" [attr.y2]="el.attrs['y2']"></line>
        <rect *ngIf="el.tag === 'rect'" [attr.x]="el.attrs['x']" [attr.y]="el.attrs['y']" [attr.width]="el.attrs['width']" [attr.height]="el.attrs['height']" [attr.rx]="el.attrs['rx']" [attr.ry]="el.attrs['ry']" [attr.fill]="el.attrs['fill'] || 'none'"></rect>
        <polyline *ngIf="el.tag === 'polyline'" [attr.points]="el.attrs['points']"></polyline>
        <polygon *ngIf="el.tag === 'polygon'" [attr.points]="el.attrs['points']"></polygon>
      </ng-container>
    </svg>
  `,
})
export class IconComponent implements OnChanges {
  @Input() icon: any = null;
  @Input() size: number = 16;
  @Input() strokeWidth: number = 1.8;

  faClass: string | null = null;
  svgElements: SvgElementData[] = [];

  ngOnChanges(_: SimpleChanges): void {
    this.faClass = null;
    this.svgElements = [];

    if (!this.icon) return;

    // FA string: 'fas fa-home'
    if (typeof this.icon === 'string') {
      this.faClass = this.icon;
      return;
    }

    // HugeIcons data: array of [tag, attrs, children?]
    if (Array.isArray(this.icon)) {
      this.svgElements = this.icon
        .filter((el: any) => Array.isArray(el) && el.length >= 2)
        .map((el: any) => ({
          tag: (el[0] || 'path').toLowerCase(),
          attrs: el[1] || {},
        }));
    }
  }
}
