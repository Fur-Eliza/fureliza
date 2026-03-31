"use client";

import { useEffect, useRef } from "react";

/**
 * Global smooth scroll wrapper using GSAP ScrollSmoother.
 * Wraps all page content in #smooth-wrapper > #smooth-content.
 * Falls back to native scroll if GSAP fails to load.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Respect reduced motion preference
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let smoother: ScrollSmoother | null = null;

    async function init() {
      try {
        const { ScrollSmoother } = await import("gsap/ScrollSmoother");
        const { ScrollTrigger } = await import("gsap/ScrollTrigger");
        const { gsap } = await import("gsap");
        gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

        smoother = ScrollSmoother.create({
          wrapper: wrapperRef.current!,
          content: contentRef.current!,
          smooth: 1.2,
          effects: true,
          smoothTouch: 0.1,
        });
      } catch {
        // ScrollSmoother failed — native scroll works fine
      }
    }

    // Use type to avoid TS error with ScrollSmoother
    type ScrollSmoother = { kill: () => void };

    init();
    return () => {
      smoother?.kill();
    };
  }, []);

  return (
    <div id="smooth-wrapper" ref={wrapperRef}>
      <div id="smooth-content" ref={contentRef}>
        {children}
      </div>
    </div>
  );
}
