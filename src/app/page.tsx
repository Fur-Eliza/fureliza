import HeroScroll from "@/components/HeroScroll";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import Toast from "@/components/Toast";
import ProductCard from "@/components/ProductCard";
import AnimatedSection from "@/components/AnimatedSection";
import Footer from "@/components/Footer";
import { products } from "@/data/products";

export default function Home() {
  // Use first product as homepage hero
  const heroProduct = products[0];

  return (
    <>
      <Navbar />
      <CartDrawer />
      <Toast />

      <main>
        <HeroScroll product={heroProduct} />

        {/* Collection */}
        <section id="collection" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-24">
          <div className="text-center mb-10 md:mb-16">
            <AnimatedSection animation="blur-in">
              <p className="text-sm font-semibold tracking-widest uppercase text-[var(--color-gold)]/60 mb-2">
                Collection
              </p>
            </AnimatedSection>
            <AnimatedSection animation="fade-up" delay={0.1}>
              <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-5xl font-bold text-gold-gradient">
                Curated Fragrances
              </h2>
            </AnimatedSection>
            <AnimatedSection animation="fade-up" delay={0.2}>
              <p className="mt-4 text-[var(--color-ink-soft)] max-w-lg mx-auto">
                Each fragrance is an experience. Scroll through its world before you decide.
              </p>
            </AnimatedSection>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {products.map((product, index) => (
              <ProductCard key={product.slug} product={product} index={index} />
            ))}
          </div>
        </section>

        {/* About */}
        <section id="about" className="bg-[var(--color-bg-warm)] py-14 md:py-24 overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <AnimatedSection animation="blur-in">
              <p className="text-sm font-semibold tracking-widest uppercase text-[var(--color-gold)]/60 mb-2">
                Our Story
              </p>
            </AnimatedSection>
            <AnimatedSection animation="fade-up" delay={0.1}>
              <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-bold text-gold-gradient mb-6">
                The Light Within
              </h2>
            </AnimatedSection>
            <AnimatedSection animation="fade-up" delay={0.2}>
              <div className="space-y-4 text-[var(--color-ink-soft)] leading-relaxed max-w-2xl mx-auto">
                <p>
                  Fur Eliza was born from a promise: to translate the beauty of
                  music and devotion into unforgettable aromas. Named after
                  Beethoven&apos;s timeless composition, each fragrance in our
                  collection is a movement in an olfactory symphony.
                </p>
                <p>
                  We believe that choosing a perfume should be a sensory journey,
                  not a gamble. That&apos;s why every fragrance in our collection
                  comes with its own immersive experience — so you can feel it
                  before you wear it.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
