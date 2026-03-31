import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { safeJsonLd } from "@/lib/constants";
import SmoothScroll from "@/components/SmoothScroll";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://fureliza.com"),
  title: {
    default: "Fur Eliza | Perfumería Nicho de Lujo",
    template: "%s | Fur Eliza",
  },
  description:
    "Siente la fragancia antes de usarla. Perfumes nicho curados a través de experiencias sensoriales inmersivas. Lux Intra.",
  keywords: [
    "perfume nicho",
    "perfumería de lujo",
    "niche perfume",
    "luxury fragrance",
    "Fur Eliza",
    "decant perfume Colombia",
    "perfumes originales",
  ],
  authors: [{ name: "Fur Eliza" }],
  openGraph: {
    title: "Fur Eliza | Perfumería Nicho de Lujo",
    description: "Siente la fragancia antes de usarla. Lux Intra.",
    type: "website",
    locale: "es_CO",
    siteName: "Fur Eliza",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fur Eliza | Perfumería Nicho de Lujo",
    description: "Siente la fragancia antes de usarla. Lux Intra.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: safeJsonLd({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Fur Eliza",
              url: "https://fureliza.com",
              description:
                "Perfumería nicho de lujo en Colombia. Fragancias curadas a través de experiencias sensoriales inmersivas.",
              sameAs: [],
            }),
          }}
        />
        <a href="#main-content" className="skip-nav">
          Saltar al contenido principal
        </a>
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
