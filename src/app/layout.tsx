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
  title: "Fur Eliza | Luxury Niche Perfumery",
  description: "Feel the fragrance before you wear it. Curated niche perfumes presented through immersive sensory experiences. Lux Intra.",
  keywords: ["niche perfume", "luxury fragrance", "perfumeria nicho", "Fur Eliza", "curated perfumes"],
  authors: [{ name: "Fur Eliza" }],
  openGraph: {
    title: "Fur Eliza | Luxury Niche Perfumery",
    description: "Feel the fragrance before you wear it. Lux Intra.",
    type: "website",
    locale: "es_CO",
    siteName: "Fur Eliza",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fur Eliza | Luxury Niche Perfumery",
    description: "Feel the fragrance before you wear it. Lux Intra.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
