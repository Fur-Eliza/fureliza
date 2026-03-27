import { Product } from "@/types/product";
import { safeJsonLd } from "@/lib/constants";

interface Props {
  product: Product;
}

export default function ProductJsonLd({ product }: Props) {
  const prices = product.variants.map((v) => v.price.cop);
  const hasStock = product.variants.some((v) => v.inStock);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: `https://fureliza.com${product.images.hero}`,
    brand: {
      "@type": "Brand",
      name: product.house,
    },
    offers: {
      "@type": "AggregateOffer",
      url: `https://fureliza.com/perfume/${product.slug}`,
      priceCurrency: "COP",
      lowPrice: Math.min(...prices),
      highPrice: Math.max(...prices),
      offerCount: product.variants.length,
      availability: hasStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "Fur Eliza",
      },
    },
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Familia Olfativa",
        value: product.family,
      },
      ...product.variants.map((v) => ({
        "@type": "PropertyValue",
        name: "Presentacion",
        value: `${v.size} — ${v.type === "full" ? "Botella Completa" : "Decant"}`,
      })),
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
    />
  );
}
