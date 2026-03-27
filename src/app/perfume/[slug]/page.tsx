import { notFound } from "next/navigation";
import { products, getProductBySlug } from "@/data/products";
import ProductPageClient from "./ProductPageClient";
import ProductJsonLd from "@/components/ProductJsonLd";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};

  return {
    title: `${product.name} — ${product.house}`,
    description: product.description,
    alternates: {
      canonical: `/perfume/${product.slug}`,
    },
    openGraph: {
      title: `${product.name} — ${product.house} | Fur Eliza`,
      description: product.description,
      images: [{ url: product.images.hero, width: 1200, height: 630 }],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  return (
    <>
      <ProductJsonLd product={product} />
      <ProductPageClient product={product} />
    </>
  );
}
