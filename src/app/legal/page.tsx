import { Metadata } from "next";
import AnimatedSection from "@/components/AnimatedSection";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import Toast from "@/components/Toast";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Información Legal",
  description:
    "Términos de uso, política de privacidad, política de devoluciones y aviso legal sobre decants de Fur Eliza.",
  alternates: { canonical: "/legal" },
  openGraph: {
    title: "Información Legal | Fur Eliza",
    description: "Términos y condiciones de Fur Eliza.",
  },
};

export default function LegalPage() {
  return (
    <>
      <Navbar />
      <CartDrawer />
      <Toast />

      <main id="main-content" tabIndex={-1} className="pt-24 pb-14 md:pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12 md:mb-16">
            <AnimatedSection animation="blur-in">
              <p className="text-sm font-semibold tracking-widest uppercase text-[var(--color-gold)]/60 mb-2">
                Fur Eliza
              </p>
            </AnimatedSection>
            <AnimatedSection animation="fade-up" delay={0.1}>
              <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-bold text-gold-gradient">
                Información Legal
              </h1>
            </AnimatedSection>
          </div>

          <div className="space-y-12 text-[var(--color-ink-soft)] leading-relaxed text-sm">
            {/* Decant disclaimer */}
            <AnimatedSection animation="fade-up">
              <section>
                <h2 className="font-[family-name:var(--font-playfair)] text-xl md:text-2xl font-bold text-[var(--color-ink)] mb-4">
                  Aviso sobre Decants
                </h2>
                <p className="mb-3">
                  Fur Eliza S.A.S. es una entidad independiente. Los productos tipo decant
                  ofrecidos en este sitio son re-envasados auténticos de perfumes originales.
                  Fur Eliza no está afiliada, patrocinada ni avalada por las casas de perfumería
                  cuyos productos comercializa.
                </p>
                <p>
                  Todos los nombres de marcas, logotipos y marcas comerciales mencionados en este
                  sitio son propiedad de sus respectivos titulares y se utilizan únicamente con
                  fines descriptivos e informativos, de acuerdo con la doctrina de primera venta
                  bajo el régimen andino de propiedad intelectual.
                </p>
              </section>
            </AnimatedSection>

            {/* Terms of use */}
            <AnimatedSection animation="fade-up" delay={0.1}>
              <section>
                <h2 className="font-[family-name:var(--font-playfair)] text-xl md:text-2xl font-bold text-[var(--color-ink)] mb-4">
                  Términos de Uso
                </h2>
                <p className="mb-3">
                  Al acceder y utilizar este sitio web, aceptas los siguientes términos y
                  condiciones. Si no estás de acuerdo con alguno de estos términos, te pedimos
                  que no utilices este sitio.
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>
                    Los precios publicados están sujetos a cambio sin previo aviso y dependen
                    de la disponibilidad del producto.
                  </li>
                  <li>
                    Las imágenes y descripciones de los productos son referencias visuales y
                    poéticas. El producto físico puede variar ligeramente en presentación.
                  </li>
                  <li>
                    Las compras se formalizan a través de WhatsApp. Un pedido no se considera
                    confirmado hasta que se verifique el pago.
                  </li>
                  <li>
                    Fur Eliza se reserva el derecho de cancelar pedidos en caso de agotamiento
                    de inventario, ofreciendo reembolso completo.
                  </li>
                </ul>
              </section>
            </AnimatedSection>

            {/* Privacy policy */}
            <AnimatedSection animation="fade-up" delay={0.15}>
              <section>
                <h2 className="font-[family-name:var(--font-playfair)] text-xl md:text-2xl font-bold text-[var(--color-ink)] mb-4">
                  Política de Privacidad
                </h2>
                <p className="mb-3">
                  Fur Eliza respeta tu privacidad. La información personal que compartes con
                  nosotros a través de WhatsApp (nombre, dirección, teléfono) se utiliza
                  exclusivamente para procesar y enviar tu pedido.
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>No vendemos, alquilamos ni compartimos tu información personal con terceros.</li>
                  <li>No almacenamos datos de pago en nuestro sitio web.</li>
                  <li>
                    Este sitio puede utilizar cookies anónimas para mejorar la experiencia de
                    navegación y analizar el tráfico.
                  </li>
                  <li>
                    Puedes solicitar la eliminación de tus datos personales contactándonos a
                    través de WhatsApp.
                  </li>
                </ul>
              </section>
            </AnimatedSection>

            {/* Return policy */}
            <AnimatedSection animation="fade-up" delay={0.2}>
              <section>
                <h2 className="font-[family-name:var(--font-playfair)] text-xl md:text-2xl font-bold text-[var(--color-ink)] mb-4">
                  Política de Devoluciones
                </h2>
                <p className="mb-3">
                  Debido a la naturaleza de nuestros productos (fragancias), aplicamos la
                  siguiente política:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>
                    <strong className="text-[var(--color-ink)]">Productos sellados:</strong>{" "}
                    Puedes solicitar devolución dentro de los 5 días calendario posteriores a la
                    recepción, siempre que el producto se encuentre sellado y en su empaque original.
                  </li>
                  <li>
                    <strong className="text-[var(--color-ink)]">Productos abiertos:</strong>{" "}
                    No se aceptan devoluciones de productos que hayan sido abiertos o utilizados.
                  </li>
                  <li>
                    <strong className="text-[var(--color-ink)]">Producto defectuoso:</strong>{" "}
                    Si recibes un producto defectuoso o diferente al solicitado, contáctanos
                    dentro de las primeras 48 horas con evidencia fotográfica para gestionar el
                    reemplazo o reembolso.
                  </li>
                  <li>
                    Los costos de envío de devolución corren por cuenta del comprador, excepto
                    en casos de error de Fur Eliza.
                  </li>
                </ul>
              </section>
            </AnimatedSection>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
