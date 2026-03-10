import { Product } from "@/types/product";

interface Props {
  product: Product;
}

export default function ProductJsonLd({ product }: Props) {
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
      "@type": "Offer",
      url: `https://fureliza.com/perfume/${product.slug}`,
      priceCurrency: "COP",
      price: product.price.cop,
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "Fur Eliza",
      },
    },
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Olfactory Family",
        value: product.family,
      },
      {
        "@type": "PropertyValue",
        name: "Size",
        value: product.size,
      },
      {
        "@type": "PropertyValue",
        name: "Type",
        value: product.type === "full" ? "Full Bottle" : "Decant",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
