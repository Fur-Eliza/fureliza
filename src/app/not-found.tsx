import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-dvh flex flex-col items-center justify-center px-4 text-center bg-[var(--color-bg)]">
      <p className="text-sm font-semibold tracking-widest uppercase text-[var(--color-gold)]/60 mb-4">
        404
      </p>
      <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-6xl font-bold text-gold-gradient mb-4">
        Página no encontrada
      </h1>
      <p className="text-[var(--color-ink-soft)] max-w-md mb-8">
        La fragancia que buscas no existe aquí. Descubre nuestra colección completa.
      </p>
      <Link
        href="/collection"
        className="px-8 py-3 bg-[var(--color-gold)]/10 text-[var(--color-gold)] border border-[var(--color-gold)]/30 rounded-xl font-semibold text-sm hover:bg-[var(--color-gold)] hover:text-[var(--color-bg)] transition-all duration-300"
      >
        Ver Colección
      </Link>
    </main>
  );
}
