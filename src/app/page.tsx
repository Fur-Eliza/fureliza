import Link from "next/link";
import HeroScroll from "@/components/HeroScroll";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import Toast from "@/components/Toast";
import ProductCard from "@/components/ProductCard";
import AnimatedSection from "@/components/AnimatedSection";
import CTAWhatsApp from "@/components/CTAWhatsApp";
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
                Coleccion
              </p>
            </AnimatedSection>
            <AnimatedSection animation="fade-up" delay={0.1}>
              <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-5xl font-bold text-gold-gradient">
                Fragancias Curadas
              </h2>
            </AnimatedSection>
            <AnimatedSection animation="fade-up" delay={0.2}>
              <p className="mt-4 text-[var(--color-ink-soft)] max-w-lg mx-auto">
                Cada fragancia es una experiencia. Navega su mundo antes de decidir.
              </p>
            </AnimatedSection>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {products.map((product, index) => (
              <ProductCard key={product.slug} product={product} index={index} />
            ))}
          </div>

          <AnimatedSection animation="fade-up" delay={0.3}>
            <div className="text-center mt-10">
              <Link
                href="/collection"
                className="inline-block text-sm font-semibold text-[var(--color-gold)] underline underline-offset-4 decoration-[var(--color-gold)]/30 hover:decoration-[var(--color-gold)] transition-all duration-300"
              >
                Ver toda la coleccion
              </Link>
            </div>
          </AnimatedSection>
        </section>

        {/* WhatsApp CTA */}
        <CTAWhatsApp />

        {/* About teaser */}
        <section id="about" className="bg-[var(--color-bg-warm)] py-14 md:py-24 overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <AnimatedSection animation="blur-in">
              <p className="text-sm font-semibold tracking-widest uppercase text-[var(--color-gold)]/60 mb-2">
                Nuestra Historia
              </p>
            </AnimatedSection>
            <AnimatedSection animation="fade-up" delay={0.1}>
              <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-bold text-gold-gradient mb-6">
                La Luz Interior
              </h2>
            </AnimatedSection>
            <AnimatedSection animation="fade-up" delay={0.2}>
              <div className="space-y-4 text-[var(--color-ink-soft)] leading-relaxed max-w-2xl mx-auto">
                <p>
                  Fur Eliza nacio de una promesa: traducir la belleza de la musica y
                  la devocion en aromas inolvidables. Cada fragancia en nuestra
                  coleccion es un movimiento en una sinfonia olfativa.
                </p>
                <p>
                  Creemos que elegir un perfume debe ser un viaje sensorial, no una
                  apuesta. Por eso cada fragancia viene con su propia experiencia
                  inmersiva — para que la sientas antes de llevarla.
                </p>
              </div>
            </AnimatedSection>
            <AnimatedSection animation="fade-up" delay={0.3}>
              <div className="mt-8">
                <Link
                  href="/about"
                  className="inline-block text-sm font-semibold text-[var(--color-gold)] underline underline-offset-4 decoration-[var(--color-gold)]/30 hover:decoration-[var(--color-gold)] transition-all duration-300"
                >
                  Conoce nuestra historia
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
