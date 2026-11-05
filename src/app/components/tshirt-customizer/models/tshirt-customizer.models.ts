/**
 * Strong TypeScript types and interfaces for the Interactive 3D T-Shirt Customizer
 */

export type GarmentSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'Custom';
export type FitStyle = 'slim' | 'regular' | 'oversized';
export type ModelQuality = 'high' | 'low';
export type GarmentType = 'tshirt' | 'hoodie';
export type PresetAngle = 'front' | 'back' | 'left' | 'right';
export type DecalSide = 'front' | 'back' | 'sleeve-left' | 'sleeve-right';
export type CustomizerTab = 
  | 'colors'
  | 'textures'
  | 'designs'
  | 'size'
  | 'measurements'
  | 'fit'
  | 'fabric'
  | 'saved'
  | 'export';

/**
 * Uploaded logo / graphic decal configuration
 */
export interface DesignDecal {
  id: string;
  name: string;
  dataUrl: string;
  image?: HTMLImageElement;
  side: DecalSide;
  // Normalized positioning (0 to 1 range relative to placement zone)
  x: number;       // Horizontal offset (-1 to 1, 0 is center)
  y: number;       // Vertical offset (-1 to 1, 0 is center)
  scale: number;   // Scale factor (0.1 to 3.0)
  widthCm?: number;  // Print width in cm
  heightCm?: number; // Print height in cm
  aspectRatio?: number; // width / height
  lockAspectRatio?: boolean; // Maintain aspect ratio when scaling
  rotation: number;// Rotation in degrees (-180 to 180)
  opacity: number; // Opacity (0 to 1)
  zIndex?: number; // Layer order (for Bring Forward / Send Backward)
  blendMode?: 'normal' | 'multiply' | 'screen';
  // Text sticker metadata
  isTextDecal?: boolean;
  textContent?: string;
  fontFamily?: string;
  textColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
}

/**
 * Garment measurements in centimeters (real garment physical dimensions)
 */
export interface GarmentMeasurements {
  chest: number;       // Chest circumference (80 - 140 cm)
  waist: number;       // Waist circumference (70 - 130 cm)
  shoulder: number;    // Shoulder seam to shoulder seam (38 - 58 cm)
  length: number;      // Body length from high point shoulder to hem (60 - 85 cm)
  sleeveLength: number;// Sleeve length from shoulder seam to cuff (16 - 32 cm)
  sleeveWidth: number; // Sleeve bicep width (26 - 48 cm)
  neckOpening: number; // Neckline circumference (36 - 52 cm)
}

/**
 * Predefined fabric weave & material appearance
 */
export interface FabricPreset {
  id: string;
  name: string;
  description: string;
  roughness: number;
  sheen: number;
  sheenRoughness: number;
  sheenColor: string;
  normalScale: number;
  repeat: number;
  colorFilter?: string;
}

/**
 * Complete serializable T-Shirt configuration
 */
export interface GarmentConfig {
  version: string;
  garmentType?: GarmentType;
  modelQuality: ModelQuality;
  colorHex: string;
  fabricPresetId: string;
  fabricCustomRoughness?: number;
  fabricCustomSheen?: number;
  fabricCustomNormalScale?: number;
  textureRepeat: number;
  textureRotation: number;
  size: GarmentSize;
  fitStyle: FitStyle;
  measurements: GarmentMeasurements;
  decals: DesignDecal[];
  wireframe: boolean;
  clothPhysicsEnabled: boolean;
  clothPhysicsIntensity: number;
}

/**
 * Saved design entry for LocalStorage / JSON export
 */
export interface SavedDesign {
  id: string;
  name: string;
  createdAt: string;
  thumbnailUrl: string;
  config: GarmentConfig;
}

/**
 * Virtual Try-On and Human Avatar fitting interface preparation
 * Defines contract for future body avatar loading, morphing and garment draping
 */
export interface BodyMeasurements {
  heightCm: number;
  chestCircumferenceCm: number;
  waistCircumferenceCm: number;
  hipsCircumferenceCm: number;
  shoulderWidthCm: number;
  armLengthCm: number;
  bodyType: 'athletic' | 'average' | 'slim' | 'plus';
  gender: 'neutral' | 'masculine' | 'feminine';
}

export interface AvatarRigJoint {
  name: string;
  position: [number, number, number];
  rotation: [number, number, number, number];
}

export interface AvatarFittingResult {
  fitScore: number; // 0 to 100% fit score
  tightnessMap: {
    chest: 'loose' | 'optimal' | 'tight';
    waist: 'loose' | 'optimal' | 'tight';
    shoulders: 'loose' | 'optimal' | 'tight';
    length: 'short' | 'optimal' | 'long';
  };
  recommendedSize: GarmentSize;
  tensionPoints: string[];
}

