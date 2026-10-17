import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModelViewerComponent } from '../../components/model-viewer/model-viewer.component';
import { CartService } from '../../services/cart.service';

export interface TryOnModelItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  path: string;
  targetSize: number;
  badge: string;
  icon: string;
  specs: { material: string; fit: string; season: string };
}

export interface Colorway {
  name: string;
  hex: number;
  css: string;
}

@Component({
  selector: 'app-try-on',
  templateUrl: './try-on.component.html',
  styleUrls: ['./try-on.component.scss']
})
export class TryOnComponent implements OnInit {
  @ViewChild('tryOnViewer') tryOnViewer?: ModelViewerComponent;

  tryOnModels: TryOnModelItem[] = [
    {
      id: 'prism-bomber',
      name: 'Prism Glow Bomber',
      category: 'OUTERWEAR',
      price: 189.0,
      description: 'Signature cyberpunk bomber jacket featuring iridescent high-tech fabrics, luminescent trims, and holographic prism reflections.',
      path: 'assets/3dmodel/new/Meshy_AI_Prism_Glow_Bomber_1017114106_texture.glb',
      targetSize: 7,
      badge: 'FEATURED',
      icon: 'fas fa-vest',
      specs: { material: 'Holographic Poly / Nylon', fit: 'Oversized Boxy', season: 'Cyber 2026' }
    },
    {
      id: 'street-hoodie',
      name: 'Siden-19 Street Hoodie',
      category: 'HOODIES',
      price: 129.0,
      description: 'Heavyweight drop-shoulder street hoodie crafted with relaxed cyberpunk silhouette, raw seams, and ribbed cuffs.',
      path: 'assets/3dmodel/new/Meshy_AI_Siden19_Gray_Hoodie_1017113713_texture.glb',
      targetSize: 7,
      badge: 'POPULAR',
      icon: 'fas fa-shirt',
      specs: { material: '450 GSM Loopback Cotton', fit: 'Drop Shoulder', season: 'All-Season' }
    },
    {
      id: 'rain-jacket',
      name: 'Techwear Rain Jacket',
      category: 'OUTERWEAR',
      price: 219.0,
      description: 'All-weather technical hooded shell featuring waterproof bonded seams, magnetic cargo pockets, and ergonomic articulation.',
      path: 'assets/3dmodel/new/Meshy_AI_Hooded_Rain_Jacket_1017114434_texture.glb',
      targetSize: 7,
      badge: 'TECHNICAL',
      icon: 'fas fa-cloud-showers-heavy',
      specs: { material: '3-Layer Ripstop GORE-TEX', fit: 'Ergonomic Shell', season: 'Storm Tech' }
    },
    {
      id: 'striped-polo',
      name: 'Red Striped Cyber Polo',
      category: 'TOPS',
      price: 89.0,
      description: 'Retro-futuristic knitted polo shirt with high-contrast vertical stripes, rib-knit collar, and breathable micro-mesh weave.',
      path: 'assets/3dmodel/new/Meshy_AI_Red_Striped_Polo_Shir_1017114802_texture.glb',
      targetSize: 7,
      badge: 'RETRO TECH',
      icon: 'fas fa-tshirt',
      specs: { material: 'Breathable Knit Cotton', fit: 'Regular Casual', season: 'Summer / Spring' }
    },
    {
      id: 'stealth-cap',
      name: 'Stealth Grey Baseball Cap',
      category: 'HEADWEAR',
      price: 49.0,
      description: 'Low-profile structured 6-panel cap featuring matte finish, embroidered micro-accents, and metallic hardware buckle.',
      path: 'assets/3dmodel/new/Meshy_AI_Grey_Baseball_Cap_1017113414_texture.glb',
      targetSize: 5,
      badge: 'ACCESSORY',
      icon: 'fas fa-hat-cowboy-side',
      specs: { material: 'Structured Cotton Twill', fit: 'Adjustable Metallic', season: 'Essential' }
    }
  ];

  activeModel: TryOnModelItem = this.tryOnModels[0];
  isRotating = true;
  activeColorIndex = 0;
  selectedSize = 'M';
  sizes: string[] = ['S', 'M', 'L', 'XL', 'XXL'];
  addedToCartFeedback = false;
  isModelSwitching = false;

  colorways: Colorway[] = [
    { name: 'Original', hex: 0xffffff, css: '#ffffff' },
    { name: 'Cyber Neon', hex: 0x39ff14, css: '#39ff14' },
    { name: 'Electric Cyan', hex: 0x00e5ff, css: '#00e5ff' },
    { name: 'Hyper Pink', hex: 0xff007f, css: '#ff007f' },
    { name: 'Liquid Gold', hex: 0xffd700, css: '#ffd700' }
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const modelId = params['model'] || params['productId'];
      if (modelId) {
        const found = this.tryOnModels.find(m => m.id === modelId || m.name.toLowerCase().includes(String(modelId).toLowerCase()));
        if (found) {
          this.activeModel = found;
        }
      }
    });
  }

  selectModel(model: TryOnModelItem): void {
    if (this.activeModel.id === model.id) return;
    this.activeModel = model;
    this.activeColorIndex = 0;
    this.isRotating = true;
    this.isModelSwitching = true;
    setTimeout(() => {
      this.isModelSwitching = false;
    }, 30);
  }

  toggleRotation(): void {
    this.isRotating = !this.isRotating;
  }

  resetCamera(): void {
    if (this.tryOnViewer) {
      this.tryOnViewer.resetCamera();
    }
    this.isRotating = true;
  }

  setColor(color: Colorway, index: number): void {
    this.activeColorIndex = index;
    if (this.tryOnViewer) {
      this.tryOnViewer.changeColor(color.hex);
    }
  }

  cycleColor(): void {
    this.activeColorIndex = (this.activeColorIndex + 1) % this.colorways.length;
    const selected = this.colorways[this.activeColorIndex];
    if (this.tryOnViewer) {
      this.tryOnViewer.changeColor(selected.hex);
    }
  }

  selectSize(size: string): void {
    this.selectedSize = size;
  }

  addToCart(): void {
    const item = {
      id: this.activeModel.id,
      name: this.activeModel.name,
      price: this.activeModel.price,
      image_url: '',
      category: { name: this.activeModel.category }
    };
    this.cartService.addToCart(item, 1, { id: `${this.activeModel.id}-${this.selectedSize}`, size: this.selectedSize });
    this.addedToCartFeedback = true;
    setTimeout(() => {
      this.addedToCartFeedback = false;
    }, 2500);
  }

  goToShop(): void {
    this.router.navigate(['/shop']);
  }
}
