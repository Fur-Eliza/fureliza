import { Metadata } from "next";
import AnimatedSection from "@/components/AnimatedSection";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import Toast from "@/components/Toast";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Informacion Legal",
  description:
    "Terminos de uso, politica de privacidad, politica de devoluciones y aviso legal sobre decants de Fur Eliza.",
  openGraph: {
    title: "Informacion Legal | Fur Eliza",
    description: "Terminos y condiciones de Fur Eliza.",
  },
};

export default function LegalPage() {
  return (
    <>
      <Navbar />
      <CartDrawer />
      <Toast />

      <main className="pt-24 pb-14 md:pb-24">
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
                Informacion Legal
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
                  ofrecidos en este sitio son re-envasados autenticos de perfumes originales.
                  Fur Eliza no esta afiliada, patrocinada ni avalada por las casas de perfumeria
                  cuyos productos comercializa.
                </p>
                <p>
                  Todos los nombres de marcas, logotipos y marcas comerciales mencionados en este
                  sitio son propiedad de sus respectivos titulares y se utilizan unicamente con
                  fines descriptivos e informativos, de acuerdo con la doctrina de primera venta
                  bajo el regimen andino de propiedad intelectual.
                </p>
              </section>
            </AnimatedSection>

            {/* Terms of use */}
            <AnimatedSection animation="fade-up" delay={0.1}>
              <section>
                <h2 className="font-[family-name:var(--font-playfair)] text-xl md:text-2xl font-bold text-[var(--color-ink)] mb-4">
                  Terminos de Uso
                </h2>
                <p className="mb-3">
                  Al acceder y utilizar este sitio web, aceptas los siguientes terminos y
                  condiciones. Si no estas de acuerdo con alguno de estos terminos, te pedimos
                  que no utilices este sitio.
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>
                    Los precios publicados estan sujetos a cambio sin previo aviso y dependen
                    de la disponibilidad del producto.
                  </li>
                  <li>
                    Las imagenes y descripciones de los productos son referencias visuales y
                    poeticas. El producto fisico puede variar ligeramente en presentacion.
                  </li>
                  <li>
                    Las compras se formalizan a traves de WhatsApp. Un pedido no se considera
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
                  Politica de Privacidad
                </h2>
                <p className="mb-3">
                  Fur Eliza respeta tu privacidad. La informacion personal que compartes con
                  nosotros a traves de WhatsApp (nombre, direccion, telefono) se utiliza
                  exclusivamente para procesar y enviar tu pedido.
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>No vendemos, alquilamos ni compartimos tu informacion personal con terceros.</li>
                  <li>No almacenamos datos de pago en nuestro sitio web.</li>
                  <li>
                    Este sitio puede utilizar cookies anonimas para mejorar la experiencia de
                    navegacion y analizar el trafico.
                  </li>
                  <li>
                    Puedes solicitar la eliminacion de tus datos personales contactandonos a
                    traves de WhatsApp.
                  </li>
                </ul>
              </section>
            </AnimatedSection>

            {/* Return policy */}
            <AnimatedSection animation="fade-up" delay={0.2}>
              <section>
                <h2 className="font-[family-name:var(--font-playfair)] text-xl md:text-2xl font-bold text-[var(--color-ink)] mb-4">
                  Politica de Devoluciones
                </h2>
                <p className="mb-3">
                  Debido a la naturaleza de nuestros productos (fragancias), aplicamos la
                  siguiente politica:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>
                    <strong className="text-[var(--color-ink)]">Productos sellados:</strong>{" "}
                    Puedes solicitar devolucion dentro de los 5 dias calendario posteriores a la
                    recepcion, siempre que el producto se encuentre sellado y en su empaque original.
                  </li>
                  <li>
                    <strong className="text-[var(--color-ink)]">Productos abiertos:</strong>{" "}
                    No se aceptan devoluciones de productos que hayan sido abiertos o utilizados.
                  </li>
                  <li>
                    <strong className="text-[var(--color-ink)]">Producto defectuoso:</strong>{" "}
                    Si recibes un producto defectuoso o diferente al solicitado, contactanos
                    dentro de las primeras 48 horas con evidencia fotografica para gestionar el
                    reemplazo o reembolso.
                  </li>
                  <li>
                    Los costos de envio de devolucion corren por cuenta del comprador, excepto
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
