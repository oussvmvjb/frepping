export interface ClothingModelItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  path: string;
  targetSize: number;
  badge: string;
  icon: string;
  specs: {
    material: string;
    fit: string;
    season: string;
  };
}

export const CLOTHING_MODELS_REGISTRY: ClothingModelItem[] = [
  {
    id: 'siden19-hoodie',
    name: 'Siden-19 Street Hoodie',
    category: 'HOODIES',
    price: 129.0,
    description:
      'Heavyweight drop-shoulder street hoodie crafted with relaxed cyberpunk silhouette, raw seams, and ribbed cuffs.',
    path: 'assets/3dmodel/new/Meshy_AI_Siden19_Gray_Hoodie_1017113713_texture.glb',
    targetSize: 5.2,
    badge: 'SIGNATURE',
    icon: 'fas fa-shirt',
    specs: {
      material: '450 GSM Loopback Cotton',
      fit: 'Drop Shoulder Oversized',
      season: 'All-Season Essential'
    }
  },
  {
    id: 'prism-bomber',
    name: 'Prism Glow Bomber',
    category: 'OUTERWEAR',
    price: 189.0,
    description:
      'Signature cyberpunk bomber jacket featuring iridescent high-tech fabrics, luminescent trims, and holographic prism reflections.',
    path: 'assets/3dmodel/new/Meshy_AI_Prism_Glow_Bomber_1017114106_texture.glb',
    targetSize: 5.2,
    badge: 'FEATURED',
    icon: 'fas fa-vest',
    specs: {
      material: 'Holographic Poly / Nylon',
      fit: 'Oversized Boxy',
      season: 'Cyber 2026'
    }
  },
  {
    id: 'rain-jacket',
    name: 'Techwear Rain Jacket',
    category: 'OUTERWEAR',
    price: 219.0,
    description:
      'All-weather technical hooded shell featuring waterproof bonded seams, magnetic cargo pockets, and ergonomic articulation.',
    path: 'assets/3dmodel/new/Meshy_AI_Hooded_Rain_Jacket_1017114434_texture.glb',
    targetSize: 5.2,
    badge: 'TECHNICAL',
    icon: 'fas fa-cloud-showers-heavy',
    specs: {
      material: '3-Layer Ripstop GORE-TEX',
      fit: 'Ergonomic Shell',
      season: 'Storm Tech'
    }
  },
  {
    id: 'striped-polo',
    name: 'Red Striped Cyber Polo',
    category: 'TOPS',
    price: 89.0,
    description:
      'Retro-futuristic knitted polo shirt with high-contrast vertical stripes, rib-knit collar, and breathable micro-mesh weave.',
    path: 'assets/3dmodel/new/Meshy_AI_Red_Striped_Polo_Shir_1017114802_texture.glb',
    targetSize: 5.0,
    badge: 'RETRO TECH',
    icon: 'fas fa-tshirt',
    specs: {
      material: 'Breathable Knit Cotton',
      fit: 'Regular Casual Fit',
      season: 'Summer / Spring'
    }
  },
  {
    id: 'stealth-cap',
    name: 'Stealth Grey Baseball Cap',
    category: 'HEADWEAR',
    price: 49.0,
    description:
      'Low-profile structured 6-panel cap featuring matte finish, embroidered micro-accents, and metallic hardware buckle.',
    path: 'assets/3dmodel/new/Meshy_AI_Grey_Baseball_Cap_1017113414_texture.glb',
    targetSize: 4.0,
    badge: 'ACCESSORY',
    icon: 'fas fa-hat-cowboy-side',
    specs: {
      material: 'Structured Cotton Twill',
      fit: 'Adjustable Metallic Strap',
      season: 'Core Collection'
    }
  }
];
