import { Metadata } from "next";
import { products } from "@/data/products";
import CollectionClient from "./CollectionClient";

export const metadata: Metadata = {
  title: "Colección",
  description:
    "Explora nuestra colección curada de perfumes nicho. Filtra por familia olfativa y estado de ánimo. Cada fragancia es una experiencia sensorial única.",
  alternates: { canonical: "/collection" },
  openGraph: {
    title: "Colección | Fur Eliza",
    description:
      "Explora nuestra colección curada de perfumes nicho. Cada fragancia es una experiencia.",
  },
};

export default function CollectionPage() {
  return <CollectionClient products={products} />;
}
