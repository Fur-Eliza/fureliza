import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

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
    default: "Fur Eliza | Perfumeria Nicho de Lujo",
    template: "%s | Fur Eliza",
  },
  description:
    "Siente la fragancia antes de usarla. Perfumes nicho curados a traves de experiencias sensoriales inmersivas. Lux Intra.",
  keywords: [
    "perfume nicho",
    "perfumeria de lujo",
    "niche perfume",
    "luxury fragrance",
    "Fur Eliza",
    "decant perfume Colombia",
    "perfumes originales",
  ],
  authors: [{ name: "Fur Eliza" }],
  openGraph: {
    title: "Fur Eliza | Perfumeria Nicho de Lujo",
    description: "Siente la fragancia antes de usarla. Lux Intra.",
    type: "website",
    locale: "es_CO",
    siteName: "Fur Eliza",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fur Eliza | Perfumeria Nicho de Lujo",
    description: "Siente la fragancia antes de usarla. Lux Intra.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans">
        <a href="#main-content" className="skip-nav">
          Saltar al contenido principal
        </a>
        <div id="main-content">
          {children}
        </div>
      </body>
    </html>
  );
}
