"use client";

import { useRef, useEffect } from "react";

interface Props {
  children: string;
  className?: string;
  as?: "h1" | "h2" | "h3";
  delay?: number;
}

/**
 * Animates text character-by-character using GSAP SplitText.
 * Falls back to static text if SplitText fails to load.
 */
export default function SplitTitle({
  children,
  className = "",
  as: Tag = "h2",
  delay = 0,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (ref.current) ref.current.style.opacity = "1";
      return;
    }

    let split: { revert: () => void } | null = null;

    async function init() {
      try {
        const { gsap } = await import("gsap");
        const { SplitText } = await import("gsap/SplitText");
        const { ScrollTrigger } = await import("gsap/ScrollTrigger");
        gsap.registerPlugin(SplitText, ScrollTrigger);

        if (!ref.current) return;

        split = new SplitText(ref.current, { type: "chars" });
        const chars = (split as unknown as { chars: HTMLElement[] }).chars;

        gsap.fromTo(
          chars,
          { opacity: 0, y: 30, rotateX: -40 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.6,
            stagger: 0.03,
            ease: "power3.out",
            delay,
            scrollTrigger: {
              trigger: ref.current,
              start: "top 85%",
              once: true,
            },
          }
        );
      } catch {
        // SplitText failed — show text normally
        if (ref.current) ref.current.style.opacity = "1";
      }
    }

    init();
    return () => {
      split?.revert();
    };
  }, [children, delay]);

  return (
    <Tag
      ref={ref as React.Ref<HTMLHeadingElement>}
      className={`gsap-animated opacity-0 ${className}`}
      style={{ perspective: "400px" }}
    >
      {children}
    </Tag>
  );
}
