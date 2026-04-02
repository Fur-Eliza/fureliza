export type OlfactoryFamily =
  | "deep-woods"
  | "opulent-florals"
  | "vibrant-citrus"
  | "ocean-marine"
  | "oriental-spiced"
  | "gourmand-sweet"; // Added gourmand as it's common

export type Mood =
  | "power"
  | "seduction"
  | "energy"
  | "comfort"
  | "mystery"
  | "elegance"
  | "innocence" // Added for softer scents
  | "rebellion"; // Added for bold scents

type ProductVariantType = "decant" | "full" | "sample";

export interface ProductVariant {
  id: string;
  size: string; // "5ml", "10ml", "50ml", "100ml"
  type: ProductVariantType;
  price: {
    cop: number;
    usd: number;
  };
  inStock: boolean;
}

interface ProductInput {
  slug: string;
  name: string;
  house: string;
  notes: {
    top: string[];
    heart: string[];
    base: string[];
  };
  variants: ProductVariant[]; // Replaces single price/size
  retailPrice?: {            // Full bottle retail (for price anchoring)
    cop: number;
    usd: number;
    size: string;            // "100ml", "70ml"
  };
}

interface ProductGenerated {
  family: string; // Relaxed type for flexibility with CMS later
  mood: string[]; // Relaxed type
  emotionalTags: string[];
  description: string;
  fragrance: {
    intensity: number; // 1-10
    projection: number; // 1-10
    longevity: number; // 1-10
  };
  occasions: string[];
  season: string[];
  related: string[];
}

interface ProductAssets {
  frames: {
    directory: string;
    count: number;
    format: "avif" | "webp";
  };
  images: {
    card: string;
    hero: string;
  };
}

export type Product = ProductInput & ProductGenerated & ProductAssets;
