import { Metadata } from "next";
import { products } from "@/data/products";
import CollectionClient from "./CollectionClient";

export const metadata: Metadata = {
  title: "Coleccion",
  description:
    "Explora nuestra coleccion curada de perfumes nicho. Filtra por familia olfativa y estado de animo. Cada fragancia es una experiencia sensorial unica.",
  openGraph: {
    title: "Coleccion | Fur Eliza",
    description:
      "Explora nuestra coleccion curada de perfumes nicho. Cada fragancia es una experiencia.",
  },
};

export default function CollectionPage() {
  return <CollectionClient products={products} />;
}
