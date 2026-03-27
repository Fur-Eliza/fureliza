import { Metadata } from "next";
import Link from "next/link";
import AnimatedSection from "@/components/AnimatedSection";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import Toast from "@/components/Toast";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Nuestra Historia",
  description:
    "Fur Eliza nació de una promesa: traducir la belleza de la música y la devoción en aromas inolvidables. Lux Intra — la luz interior.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "Nuestra Historia | Fur Eliza",
    description:
      "Nacida de una promesa, cada fragancia es un movimiento en una sinfonía olfativa.",
  },
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <CartDrawer />
      <Toast />

      <main className="pt-24 pb-14 md:pb-24">
        {/* Hero */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16 md:mb-24">
          <AnimatedSection animation="blur-in">
            <h1 className="font-[family-name:var(--font-playfair)] text-5xl md:text-7xl lg:text-8xl font-bold text-gold-gradient mb-4">
              Fur Eliza
            </h1>
          </AnimatedSection>
          <AnimatedSection animation="fade-up" delay={0.2}>
            <p className="text-lg md:text-xl tracking-[0.2em] uppercase text-[var(--color-ink-soft)]">
              Lux Intra
            </p>
          </AnimatedSection>
        </section>

        {/* Story */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 md:mb-24">
          <AnimatedSection animation="fade-up">
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl font-bold text-gold-gradient mb-6">
              La Historia
            </h2>
          </AnimatedSection>
          <div className="space-y-5 text-[var(--color-ink-soft)] leading-relaxed">
            <AnimatedSection animation="fade-up" delay={0.1}>
              <p>
                En 1810, Ludwig van Beethoven compuso una pieza que trascenderia siglos. La
                llamo &quot;Fur Elise&quot; — para Elisa. Una carta de amor convertida en
                musica, un regalo que sobrevivio al tiempo.
              </p>
            </AnimatedSection>
            <AnimatedSection animation="fade-up" delay={0.15}>
              <p>
                Fur Eliza nacio de esa misma intencion: crear algo tan intimo y poderoso que
                no necesite explicacion. Cada fragancia en nuestra coleccion es un movimiento
                en una sinfonia olfativa — compuesta no para impresionar, sino para
                conmover.
              </p>
            </AnimatedSection>
            <AnimatedSection animation="fade-up" delay={0.2}>
              <p>
                No vendemos perfumes. Curamos experiencias sensoriales. Antes de elegir, te
                invitamos a sentir — a cerrar los ojos y dejar que la fragancia hable.
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* Philosophy */}
        <section className="bg-[var(--color-bg-warm)] py-14 md:py-24 mb-16 md:mb-24">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection animation="fade-up">
              <h2 className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl font-bold text-gold-gradient mb-6">
                Filosofia
              </h2>
            </AnimatedSection>
            <div className="space-y-5 text-[var(--color-ink-soft)] leading-relaxed">
              <AnimatedSection animation="fade-up" delay={0.1}>
                <p>
                  <strong className="text-[var(--color-ink)]">Sin genero.</strong> Organizamos
                  nuestras fragancias por familia olfativa y emocion, nunca por genero. Un
                  aroma no tiene sexo — tiene caracter.
                </p>
              </AnimatedSection>
              <AnimatedSection animation="fade-up" delay={0.15}>
                <p>
                  <strong className="text-[var(--color-ink)]">Curado por emocion.</strong> Cada
                  perfume fue seleccionado no solo por su calidad, sino por lo que te hace
                  sentir. Poder, seduccion, energia, confort — elige tu estado de animo.
                </p>
              </AnimatedSection>
              <AnimatedSection animation="fade-up" delay={0.2}>
                <p>
                  <strong className="text-[var(--color-ink)]">Experiencia antes de compra.</strong>{" "}
                  Creemos que elegir un perfume no debe ser una apuesta. Por eso cada fragancia
                  tiene su propia experiencia inmersiva — para que la sientas antes de llevarla.
                </p>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection animation="scale">
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl font-bold text-gold-gradient mb-4">
              Explora la Coleccion
            </h2>
            <p className="text-[var(--color-ink-soft)] mb-8 max-w-md mx-auto">
              Cada fragancia tiene su propio mundo. Entra y descubre cual es la tuya.
            </p>
            <Link
              href="/collection"
              className="inline-block px-8 py-4 font-semibold rounded-xl bg-[var(--color-gold)]/10 text-[var(--color-gold)] border border-[var(--color-gold)]/30 hover:bg-[var(--color-gold)] hover:text-[var(--color-bg)] transition-all duration-300 active:scale-95"
            >
              Ver Coleccion
            </Link>
          </AnimatedSection>
        </section>
      </main>

      <Footer />
    </>
  );
}
