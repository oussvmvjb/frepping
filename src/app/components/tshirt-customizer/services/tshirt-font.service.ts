import { Injectable } from '@angular/core';

export interface CustomizerFont {
  id: string;
  name: string;
  fontFamily: string;
  url: string;
  category: 'streetwear' | '3d' | 'graffiti' | 'script' | 'techno' | 'bold';
  featured?: boolean;
}

export interface TextStickerOptions {
  text: string;
  fontFamily: string;
  fontUrl?: string;
  fontSize?: number;
  textColor: string;
  strokeColor?: string;
  strokeWidth?: number;
  shadow?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TshirtFontService {
  private loadedFonts = new Set<string>();

  /**
   * Curated high-impact streetwear, GTA, graffiti, and display fonts
   */
  readonly featuredFonts: CustomizerFont[] = [
    {
      id: 'pricedown',
      name: 'Pricedown (GTA Street)',
      fontFamily: 'Pricedown',
      url: 'assets/fonts/Pricedown.otf',
      category: 'streetwear',
      featured: true
    },
    {
      id: 'bullpen3d',
      name: 'Bullpen 3D (Athletic)',
      fontFamily: 'bullpen3d',
      url: 'assets/fonts/bullpen3d.otf',
      category: '3d',
      featured: true
    },
    {
      id: 'crass-roots',
      name: 'Crass Roots (Grunge)',
      fontFamily: 'CrassRoots',
      url: 'assets/fonts/fonts/!CRASS ROOTS OFL.ttf',
      category: 'streetwear',
      featured: true
    },
    {
      id: 'bold-fade',
      name: 'Bold Fade (Modern)',
      fontFamily: 'BoldFade',
      url: 'assets/fonts/fonts/BoldFade-6R6Po.otf',
      category: 'bold',
      featured: true
    },
    {
      id: 'steelfish',
      name: 'Steelfish (Ultra Heavy)',
      fontFamily: 'Steelfish',
      url: 'assets/fonts/typodermic-free-fonts-2024d/Steelfish Bd.otf',
      category: 'bold',
      featured: true
    },
    {
      id: 'sofachrome',
      name: 'Sofachrome (Cyberpunk)',
      fontFamily: 'Sofachrome',
      url: 'assets/fonts/typodermic-free-fonts-2024d/Sofachrome Rg.otf',
      category: 'techno',
      featured: true
    },
    {
      id: 'broshk',
      name: 'BroshK (Distressed Stencil)',
      fontFamily: 'BroshK',
      url: 'assets/fonts/fonts/BroshK.otf',
      category: 'graffiti',
      featured: true
    },
    {
      id: 'calligraphy',
      name: 'Calligraphy (Old English Gothic)',
      fontFamily: 'Calligraphy',
      url: 'assets/fonts/fonts/Calligraphy-D4pm.ttf',
      category: 'script',
      featured: true
    },
    {
      id: 'agaste',
      name: 'Agaste (Luxury Street)',
      fontFamily: 'Agaste',
      url: 'assets/fonts/fonts/Agaste.ttf',
      category: 'streetwear',
      featured: true
    },
    {
      id: 'beauty-mountains',
      name: 'Beauty Mountains (Brush Script)',
      fontFamily: 'BeautyMountains',
      url: 'assets/fonts/fonts/BeautyMountainsPersonalUse-od7z.ttf',
      category: 'script',
      featured: true
    },
    {
      id: 'blackberry-jam',
      name: 'Blackberry Jam (Urban Tag)',
      fontFamily: 'BlackberryJam',
      url: 'assets/fonts/fonts/BlackberryJamPersonalUse-rXOB.ttf',
      category: 'graffiti',
      featured: true
    },
    {
      id: 'recharge',
      name: 'Recharge (Cyber Racing)',
      fontFamily: 'Recharge',
      url: 'assets/fonts/typodermic-free-fonts-2024d/Recharge Bd.otf',
      category: 'techno',
      featured: true
    },
    {
      id: 'venus-rising',
      name: 'Venus Rising (Sci-Fi Wide)',
      fontFamily: 'VenusRising',
      url: 'assets/fonts/typodermic-free-fonts-2024d/Venus Rising Rg.otf',
      category: 'techno',
      featured: true
    },
    {
      id: 'allessa',
      name: 'Allessa (Modern Sans)',
      fontFamily: 'Allessa',
      url: 'assets/fonts/fonts/Allessa Personal Use.ttf',
      category: 'bold',
      featured: true
    },
    {
      id: 'alliance',
      name: 'Alliance (Heavy Block)',
      fontFamily: 'Alliance',
      url: 'assets/fonts/fonts/AlliancePersonalUse-6z0o.ttf',
      category: 'bold',
      featured: true
    },
    {
      id: 'amplas',
      name: 'Amplas (Techno Box)',
      fontFamily: 'Amplas',
      url: 'assets/fonts/fonts/Amplas - 1.ttf',
      category: 'techno',
      featured: true
    },
    {
      id: 'brontide',
      name: 'Brontide (Street Display)',
      fontFamily: 'Brontide',
      url: 'assets/fonts/fonts/BrontidevpDemoStyle2-ZV8E3.otf',
      category: 'streetwear',
      featured: true
    },
    {
      id: 'art-typo',
      name: 'Art Typo (Geometric Poster)',
      fontFamily: 'ArtTypo',
      url: 'assets/fonts/fonts/ArtTypo.otf',
      category: 'streetwear',
      featured: true
    },
    {
      id: 'budmo',
      name: 'Budmo (Marquee Bulbs)',
      fontFamily: 'Budmo',
      url: 'assets/fonts/typodermic-free-fonts-2024d/budmo jiggler.otf',
      category: '3d',
      featured: true
    },
    {
      id: 'built-titling',
      name: 'Built Titling (Block Headline)',
      fontFamily: 'BuiltTitling',
      url: 'assets/fonts/typodermic-free-fonts-2024d/built titling bd.otf',
      category: 'bold',
      featured: true
    }
  ];

  constructor() {
    // Preload default fonts
    this.ensureFontLoaded('Pricedown', 'assets/fonts/Pricedown.otf');
    this.ensureFontLoaded('bullpen3d', 'assets/fonts/bullpen3d.otf');
  }

  /**
   * Load any font file into the document and font registry
   */
  async ensureFontLoaded(fontFamily: string, fontUrl: string): Promise<boolean> {
    if (this.loadedFonts.has(fontFamily)) return true;

    try {
      const doc = typeof document !== 'undefined' ? (document as any) : null;
      if (doc && doc.fonts && typeof (window as any).FontFace !== 'undefined') {
        // Check if already in doc.fonts
        for (const font of doc.fonts) {
          if (font.family === fontFamily) {
            this.loadedFonts.add(fontFamily);
            return true;
          }
        }

        const encodedUrl = encodeURI(fontUrl);
        const FontFaceConstructor = (window as any).FontFace;
        const fontFace = new FontFaceConstructor(fontFamily, `url("${encodedUrl}")`);
        const loaded = await fontFace.load();
        doc.fonts.add(loaded);
        this.loadedFonts.add(fontFamily);
        return true;
      } else if (doc && doc.createElement && doc.head) {
        // Fallback: inject dynamic style tag
        const style = doc.createElement('style');
        style.textContent = `
          @font-face {
            font-family: '${fontFamily}';
            src: url('${encodeURI(fontUrl)}');
            font-display: swap;
          }
        `;
        doc.head.appendChild(style);
        this.loadedFonts.add(fontFamily);
        return true;
      }
      return false;
    } catch (e) {
      console.warn(`Could not load font ${fontFamily} from ${fontUrl}:`, e);
      return false;
    }
  }

  /**
   * Render high-resolution text sticker onto transparent canvas and export as PNG dataUrl
   */
  async renderTextSticker(options: TextStickerOptions): Promise<{
    dataUrl: string;
    width: number;
    height: number;
    aspectRatio: number;
  }> {
    const text = options.text.trim();
    if (!text) {
      throw new Error('Text cannot be empty');
    }

    const fontFamily = options.fontFamily || 'Pricedown';
    if (options.fontUrl) {
      await this.ensureFontLoaded(fontFamily, options.fontUrl);
    }

    // Wait for font to be ready
    if ('fonts' in document) {
      try {
        await (document.fonts as any).ready;
      } catch (_) {}
    }

    const baseFontSize = options.fontSize || 120; // High resolution rendering
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');

    // Initial font setting to measure text
    ctx.font = `900 ${baseFontSize}px "${fontFamily}", -apple-system, sans-serif`;
    const metrics = ctx.measureText(text);

    const strokeWidth = options.strokeWidth || 0;
    const padding = Math.max(strokeWidth * 2 + 30, 40);

    const textWidth = Math.ceil(metrics.width);
    // Estimate height accurately with ascent and descent
    const ascent = metrics.actualBoundingBoxAscent || baseFontSize * 0.85;
    const descent = metrics.actualBoundingBoxDescent || baseFontSize * 0.25;
    const textHeight = Math.ceil(ascent + descent);

    canvas.width = Math.max(textWidth + padding * 2, 200);
    canvas.height = Math.max(textHeight + padding * 2, 100);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Re-apply font on resized canvas
    ctx.font = `900 ${baseFontSize}px "${fontFamily}", -apple-system, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    // 1. Drop shadow (if enabled)
    if (options.shadow) {
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.75)';
      ctx.shadowBlur = 16;
      ctx.shadowOffsetX = 6;
      ctx.shadowOffsetY = 6;

      if (strokeWidth > 0 && options.strokeColor) {
        ctx.strokeStyle = options.strokeColor;
        ctx.lineWidth = strokeWidth;
        ctx.lineJoin = 'round';
        ctx.miterLimit = 2;
        ctx.strokeText(text, cx, cy);
      }
      ctx.fillStyle = options.textColor;
      ctx.fillText(text, cx, cy);
      ctx.restore();
    }

    // 2. Stroke / Outline (clean vector-like stroke)
    if (strokeWidth > 0 && options.strokeColor) {
      ctx.strokeStyle = options.strokeColor;
      ctx.lineWidth = strokeWidth;
      ctx.lineJoin = 'round';
      ctx.miterLimit = 2;
      ctx.strokeText(text, cx, cy);
    }

    // 3. Fill text
    ctx.fillStyle = options.textColor;
    ctx.fillText(text, cx, cy);

    const dataUrl = canvas.toDataURL('image/png');
    const aspectRatio = canvas.width / canvas.height;

    return {
      dataUrl,
      width: canvas.width,
      height: canvas.height,
      aspectRatio
    };
  }
}
