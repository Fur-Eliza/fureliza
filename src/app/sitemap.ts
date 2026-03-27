import { MetadataRoute } from "next";
import { products } from "@/data/products";

const BASE_URL = "https://fureliza.com";

/** Use a fixed date to avoid signaling false "always changed" to crawlers */
const LAST_UPDATED = new Date("2026-03-26");

export default function sitemap(): MetadataRoute.Sitemap {
  const productRoutes = products.map((product) => ({
    url: `${BASE_URL}/perfume/${product.slug}`,
    lastModified: LAST_UPDATED,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const staticRoutes = [
    {
      url: BASE_URL,
      lastModified: LAST_UPDATED,
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      url: `${BASE_URL}/collection`,
      lastModified: LAST_UPDATED,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: LAST_UPDATED,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/faq`,
      lastModified: LAST_UPDATED,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/legal`,
      lastModified: LAST_UPDATED,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
  ];

  return [...staticRoutes, ...productRoutes];
}
