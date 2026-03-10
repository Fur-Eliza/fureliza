import { Product } from "@/types/product";

export const products: Product[] = [
  {
    slug: "megamare",
    name: "Megamare",
    house: "Orto Parisi",
    notes: {
      top: ["sea salt", "seaweed"],
      heart: ["ambergris", "musk"],
      base: ["sea accord", "mineral"],
    },
    price: { cop: 850000, usd: 200 },
    type: "full",
    size: "50ml",
    family: "ocean-marine",
    mood: ["power", "mystery"],
    emotionalTags: ["powerful", "dark", "salty", "abyssal", "industrial", "bold"],
    description:
      "An abyss of salt that awakens beneath your skin. Megamare is not a perfume — it is a declaration of primitive force, a storm trapped in glass.",
    frames: {
      directory: "/frames/megamare",
      count: 120,
      format: "webp",
    },
    images: {
      card: "/products/megamare-card.webp",
      hero: "/products/megamare-hero.webp",
    },
  },
  {
    slug: "baccarat-rouge-540",
    name: "Baccarat Rouge 540",
    house: "Maison Francis Kurkdjian",
    notes: {
      top: ["saffron", "jasmine"],
      heart: ["ambergris", "cedar"],
      base: ["fir resin", "musk"],
    },
    price: { cop: 1200000, usd: 285 },
    type: "full",
    size: "70ml",
    family: "oriental-spiced",
    mood: ["seduction", "elegance"],
    emotionalTags: ["luminous", "warm", "crystalline", "magnetic", "iconic", "radiant"],
    description:
      "Light made liquid. Baccarat Rouge 540 wraps you in a golden halo of warmth — saffron, jasmine, and ambergris fused into pure magnetism.",
    frames: {
      directory: "/frames/baccarat-rouge-540",
      count: 120,
      format: "webp",
    },
    images: {
      card: "/products/baccarat-rouge-540-card.webp",
      hero: "/products/baccarat-rouge-540-hero.webp",
    },
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}
