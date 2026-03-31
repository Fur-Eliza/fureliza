import { Metadata } from "next";
import Accordion from "@/components/Accordion";
import AnimatedSection from "@/components/AnimatedSection";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import Toast from "@/components/Toast";
import Footer from "@/components/Footer";
import { safeJsonLd } from "@/lib/constants";

const FAQ_ITEMS = [
  {
    question: "¿Qué es un decant?",
    answer:
      "Un decant es una porción del perfume original trasvasada a un frasco más pequeño (generalmente 5ml o 10ml). Es la forma ideal de probar una fragancia nicho sin invertir en el frasco completo. Todos nuestros decants son 100% auténticos.",
  },
  {
    question: "¿Son perfumes originales?",
    answer:
      "Sí, absolutamente. Trabajamos exclusivamente con perfumes originales de casas reconocidas. Cada producto incluye garantía de autenticidad. Fur Eliza es una entidad independiente — no estamos afiliados ni patrocinados por las marcas que ofrecemos.",
  },
  {
    question: "¿Cómo compro?",
    answer:
      "Agrega los productos que deseas al carrito y finaliza tu compra a través de WhatsApp. Nuestro equipo te confirmará disponibilidad, te enviará los datos de pago y coordinará el envío.",
  },
  {
    question: "¿Cuánto tarda el envío?",
    answer:
      "Enviamos a todo Colombia. Los tiempos de entrega son: Bogotá 1-2 días hábiles, ciudades principales 2-4 días hábiles, otras ciudades 3-6 días hábiles. Recibirás un número de seguimiento una vez despachado tu pedido.",
  },
  {
    question: "¿Aceptan devoluciones?",
    answer:
      "Debido a la naturaleza de los productos (fragancias), no aceptamos devoluciones una vez abierto el producto. Si recibes un producto defectuoso o diferente al solicitado, contáctanos dentro de las primeras 48 horas para gestionarlo.",
  },
  {
    question: "¿Qué métodos de pago aceptan?",
    answer:
      "Aceptamos transferencia bancaria (Bancolombia, Davivienda, Nequi), PSE, y efectivo contra entrega en Bogotá. Los pagos se coordinan a través de WhatsApp para tu comodidad y seguridad.",
  },
  {
    question: "¿Hacen envíos a todo Colombia?",
    answer:
      "Sí, realizamos envíos a todas las ciudades y municipios de Colombia a través de transportadoras certificadas. El costo del envío se calcula según tu ubicación y se te informa antes de confirmar tu compra.",
  },
];

export const metadata: Metadata = {
  title: "Preguntas Frecuentes",
  description:
    "Resolvemos tus dudas sobre decants, envíos, pagos y devoluciones. Conoce cómo funciona Fur Eliza.",
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "Preguntas Frecuentes | Fur Eliza",
    description:
      "Todo lo que necesitas saber sobre comprar perfumes nicho en Fur Eliza.",
  },
};

export default function FAQPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <Navbar />
      <CartDrawer />
      <Toast />

      <main className="pt-24 pb-14 md:pb-24">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd) }}
        />

        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-10 md:mb-14">
            <AnimatedSection animation="blur-in">
              <p className="text-sm font-semibold tracking-widest uppercase text-[var(--color-gold)]/60 mb-2">
                Ayuda
              </p>
            </AnimatedSection>
            <AnimatedSection animation="fade-up" delay={0.1}>
              <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-bold text-gold-gradient mb-4">
                Preguntas Frecuentes
              </h1>
            </AnimatedSection>
            <AnimatedSection animation="fade-up" delay={0.2}>
              <p className="text-[var(--color-ink-soft)] max-w-md mx-auto">
                Encuentra respuestas a las dudas más comunes sobre nuestros productos y servicio.
              </p>
            </AnimatedSection>
          </div>

          {/* Accordion */}
          <AnimatedSection animation="fade-up" delay={0.3}>
            <Accordion items={FAQ_ITEMS} />
          </AnimatedSection>
        </section>
      </main>

      <Footer />
    </>
  );
}
