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
    variants: [
      {
        id: "mm-full",
        type: "full",
        size: "50ml",
        price: { cop: 850000, usd: 200 },
        inStock: true,
      },
      {
        id: "mm-decant-10",
        type: "decant",
        size: "10ml",
        price: { cop: 180000, usd: 45 },
        inStock: true,
      },
      {
        id: "mm-decant-5",
        type: "decant",
        size: "5ml",
        price: { cop: 95000, usd: 25 },
        inStock: true,
      },
    ],
    family: "ocean-marine",
    mood: ["power", "mystery", "rebellion"],
    emotionalTags: ["powerful", "dark", "salty", "abyssal", "industrial", "bold"],
    description:
      "An abyss of salt that awakens beneath your skin. Megamare is not a perfume — it is a declaration of primitive force, a storm trapped in glass.",
    fragrance: {
      intensity: 9,
      projection: 8,
      longevity: 9,
    },
    occasions: ["evening", "formal", "statement"],
    season: ["fall", "winter"],
    related: ["baccarat-rouge-540"],
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
    variants: [
      {
        id: "br540-full",
        type: "full",
        size: "70ml",
        price: { cop: 1200000, usd: 285 },
        inStock: true,
      },
      {
        id: "br540-decant-10",
        type: "decant",
        size: "10ml",
        price: { cop: 220000, usd: 55 },
        inStock: true,
      },
      {
        id: "br540-decant-5",
        type: "decant",
        size: "5ml",
        price: { cop: 120000, usd: 30 },
        inStock: true,
      },
    ],
    family: "oriental-spiced",
    mood: ["seduction", "elegance"],
    emotionalTags: ["luminous", "warm", "crystalline", "magnetic", "iconic", "radiant"],
    description:
      "Light made liquid. Baccarat Rouge 540 wraps you in a golden halo of warmth — saffron, jasmine, and ambergris fused into pure magnetism.",
    fragrance: {
      intensity: 8,
      projection: 9,
      longevity: 10,
    },
    occasions: ["evening", "date-night", "formal"],
    season: ["fall", "winter", "spring"],
    related: ["megamare"],
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
