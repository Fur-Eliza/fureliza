import { Metadata } from "next";
import Accordion from "@/components/Accordion";
import AnimatedSection from "@/components/AnimatedSection";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import Toast from "@/components/Toast";
import Footer from "@/components/Footer";

const FAQ_ITEMS = [
  {
    question: "Que es un decant?",
    answer:
      "Un decant es una porcion del perfume original trasvasada a un frasco mas pequeno (generalmente 5ml o 10ml). Es la forma ideal de probar una fragancia nicho sin invertir en el frasco completo. Todos nuestros decants son 100% autenticos.",
  },
  {
    question: "Son perfumes originales?",
    answer:
      "Si, absolutamente. Trabajamos exclusivamente con perfumes originales de casas reconocidas. Cada producto incluye garantia de autenticidad. Fur Eliza es una entidad independiente — no estamos afiliados ni patrocinados por las marcas que ofrecemos.",
  },
  {
    question: "Como compro?",
    answer:
      "Agrega los productos que deseas al carrito y finaliza tu compra a traves de WhatsApp. Nuestro equipo te confirmara disponibilidad, te enviara los datos de pago y coordinara el envio.",
  },
  {
    question: "Cuanto tarda el envio?",
    answer:
      "Enviamos a todo Colombia. Los tiempos de entrega son: Bogota 1-2 dias habiles, ciudades principales 2-4 dias habiles, otras ciudades 3-6 dias habiles. Recibiras un numero de seguimiento una vez despachado tu pedido.",
  },
  {
    question: "Aceptan devoluciones?",
    answer:
      "Debido a la naturaleza de los productos (fragancias), no aceptamos devoluciones una vez abierto el producto. Si recibes un producto defectuoso o diferente al solicitado, contáctanos dentro de las primeras 48 horas para gestionarlo.",
  },
  {
    question: "Que metodos de pago aceptan?",
    answer:
      "Aceptamos transferencia bancaria (Bancolombia, Davivienda, Nequi), PSE, y efectivo contra entrega en Bogota. Los pagos se coordinan a traves de WhatsApp para tu comodidad y seguridad.",
  },
  {
    question: "Hacen envios a todo Colombia?",
    answer:
      "Si, realizamos envios a todas las ciudades y municipios de Colombia a traves de transportadoras certificadas. El costo del envio se calcula segun tu ubicacion y se te informa antes de confirmar tu compra.",
  },
];

export const metadata: Metadata = {
  title: "Preguntas Frecuentes",
  description:
    "Resolvemos tus dudas sobre decants, envios, pagos y devoluciones. Conoce como funciona Fur Eliza.",
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
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
                Encuentra respuestas a las dudas mas comunes sobre nuestros productos y servicio.
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
