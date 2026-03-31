import { Product } from "@/types/product";
import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import AnimatedSection from "@/components/AnimatedSection";

interface Props {
  currentSlug: string;
  relatedSlugs: string[];
  family: string;
  mood: string[];
}

export default function RelatedProducts({ currentSlug, relatedSlugs, family, mood }: Props) {
  // First: use explicit related slugs
  let related = relatedSlugs
    .map((slug) => products.find((p) => p.slug === slug))
    .filter((p): p is Product => p !== undefined && p.slug !== currentSlug);

  // Fallback: same family or overlapping mood
  if (related.length < 2) {
    const fallback = products.filter(
      (p) =>
        p.slug !== currentSlug &&
        !related.some((r) => r.slug === p.slug) &&
        (p.family === family || p.mood.some((m) => mood.includes(m)))
    );
    related = [...related, ...fallback].slice(0, 3);
  }

  if (related.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-24">
      <div className="text-center mb-10">
        <AnimatedSection animation="fade-up">
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl font-bold text-gold-gradient">
            Si te gusta esta, también
          </h2>
        </AnimatedSection>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {related.slice(0, 3).map((product, index) => (
          <ProductCard key={product.slug} product={product} index={index} />
        ))}
      </div>
    </section>
  );
}
