"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface Props {
  intensity: number;
  projection: number;
  longevity: number;
}

const LABELS: Record<string, string> = {
  intensity: "Intensidad",
  projection: "Proyección",
  longevity: "Longevidad",
};

function MeterBar({ label, value, index }: { label: string; value: number; index: number }) {
  const barRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const percentage = Math.min(Math.max(value, 0), 10) * 10;

  useGSAP(
    () => {
      if (!barRef.current || !containerRef.current) return;

      if (reduced) {
        gsap.set(barRef.current, { width: `${percentage}%` });
        return;
      }

      gsap.fromTo(
        barRef.current,
        { width: "0%" },
        {
          width: `${percentage}%`,
          duration: 1.2,
          delay: index * 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            once: true,
          },
        }
      );
    },
    { scope: containerRef, dependencies: [percentage, index, reduced] }
  );

  return (
    <div ref={containerRef} className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-widest uppercase text-[var(--color-ink-soft)]">
          {label}
        </span>
        <span className="text-xs font-bold text-[var(--color-gold)]">{value}/10</span>
      </div>
      <div className="h-2 rounded-full bg-[var(--color-border)] overflow-hidden">
        <div
          ref={barRef}
          className="h-full rounded-full"
          style={{
            background:
              "linear-gradient(90deg, var(--color-gold-dark), var(--color-gold), var(--color-gold-light))",
            width: reduced ? `${percentage}%` : "0%",
          }}
        />
      </div>
    </div>
  );
}

export default function FragranceMeter({ intensity, projection, longevity }: Props) {
  const meters = [
    { key: "intensity", value: intensity },
    { key: "projection", value: projection },
    { key: "longevity", value: longevity },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-xs font-semibold tracking-widest uppercase text-[var(--color-gold)]/40 mb-3">
        Perfil de Fragancia
      </h3>
      {meters.map((meter, index) => (
        <MeterBar
          key={meter.key}
          label={LABELS[meter.key]}
          value={meter.value}
          index={index}
        />
      ))}
    </div>
  );
}
