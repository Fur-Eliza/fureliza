export type OlfactoryFamily =
  | "deep-woods"
  | "opulent-florals"
  | "vibrant-citrus"
  | "ocean-marine"
  | "oriental-spiced";

export type Mood =
  | "power"
  | "seduction"
  | "energy"
  | "comfort"
  | "mystery"
  | "elegance";

export interface ProductInput {
  slug: string;
  name: string;
  house: string;
  notes: {
    top: string[];
    heart: string[];
    base: string[];
  };
  price: {
    cop: number;
    usd: number;
  };
  type: "full" | "decant";
  size: string;
}

export interface ProductGenerated {
  family: OlfactoryFamily;
  mood: Mood[];
  emotionalTags: string[];
  description: string;
  fragrance: {
    intensity: number;
    projection: number;
    longevity: number;
  };
  occasions: string[];
  season: string[];
  related: string[];
}

export interface ProductAssets {
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
