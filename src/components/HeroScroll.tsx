"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { Product } from "@/types/product";

const PRELOAD_COUNT = 30;

interface Props {
  product: Product;
  showTitle?: boolean;
}

function frameUrl(directory: string, index: number, total: number, format: string): string {
  const num = String(Math.min(Math.max(index, 1), total)).padStart(4, "0");
  return `${directory}/frame_${num}.${format}`;
}

export default function HeroScroll({ product, showTitle = true }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const [loaded, setLoaded] = useState(false);

  const { frames } = product;
  const TOTAL_FRAMES = frames.count;

  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = imagesRef.current[index];
    if (!img || !img.complete) return;

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
  }, []);

  useEffect(() => {
    let tl: gsap.core.Tween | null = null;

    async function init() {
      try {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const images: HTMLImageElement[] = [];
      for (let i = 0; i < TOTAL_FRAMES; i++) {
        images.push(new Image());
      }
      imagesRef.current = images;

      let loadedEager = 0;
      const onEagerLoad = () => {
        loadedEager++;
        if (loadedEager === 1) {
          drawFrame(0);
          setLoaded(true);
        }
      };

      const preloadCount = Math.min(PRELOAD_COUNT, TOTAL_FRAMES);
      for (let i = 0; i < preloadCount; i++) {
        images[i].onload = onEagerLoad;
        images[i].src = frameUrl(frames.directory, i + 1, TOTAL_FRAMES, frames.format);
      }
      // Lazy-load remaining frames with requestIdleCallback to avoid blocking
      const loadRemaining = () => {
        for (let i = preloadCount; i < TOTAL_FRAMES; i++) {
          images[i].src = frameUrl(frames.directory, i + 1, TOTAL_FRAMES, frames.format);
        }
      };
      if ("requestIdleCallback" in window) {
        requestIdleCallback(loadRemaining);
      } else {
        setTimeout(loadRemaining, 200);
      }

      // Frame scrubbing
      const obj = { frame: 0 };
      tl = gsap.to(obj, {
        frame: TOTAL_FRAMES - 1,
        snap: "frame",
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
        },
        onUpdate: () => {
          const idx = Math.round(obj.frame);
          if (idx !== currentFrameRef.current) {
            currentFrameRef.current = idx;
            drawFrame(idx);
          }
        },
      });

      // Fade-in on load (dark theme: from black, not white)
      gsap.set(".hero-canvas-wrap", {
        filter: "blur(40px) brightness(0) saturate(0)",
        scale: 1.12,
      });
      gsap.set(".hero-fadein-overlay", { opacity: 1 });

      const fadeInTL = gsap.timeline({ delay: 0.2 });
      fadeInTL
        .to(".hero-fadein-overlay", { opacity: 0, duration: 0.6, ease: "power2.out" })
        .to(".hero-canvas-wrap", {
          filter: "blur(16px) brightness(0.5) saturate(0.3)",
          scale: 1.06, duration: 0.8, ease: "power2.out",
        }, 0)
        .to(".hero-canvas-wrap", {
          filter: "blur(4px) brightness(0.8) saturate(0.7)",
          scale: 1.02, duration: 0.7, ease: "power2.out",
        }, 0.6)
        .to(".hero-canvas-wrap", {
          filter: "blur(0px) brightness(1) saturate(1)",
          scale: 1, duration: 0.8, ease: "power3.out",
        }, 1.1);

      // Title entrance
      if (showTitle) {
        gsap.fromTo(".hero-title",
          { opacity: 0, y: 40, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 1.4, ease: "power3.out", delay: 0.3 }
        );
        gsap.fromTo(".hero-subtitle",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.7 }
        );

        gsap.to(".hero-text-container", {
          opacity: 0, y: -80, scale: 0.9,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top", end: "15% top", scrub: true,
          },
        });
      }

      // Progressive dissolve to dark
      const dissolveTL = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "65% top", end: "bottom bottom", scrub: true,
        },
      });
      dissolveTL
        .to(".hero-canvas-wrap", {
          filter: "blur(4px) brightness(0.8) saturate(1)",
          scale: 1.02, duration: 0.28,
        }, 0)
        .to(".hero-dissolve-gradient", { y: "0%", duration: 0.56 }, 0.14)
        .to(".hero-canvas-wrap", {
          filter: "blur(16px) brightness(0.3) saturate(0.3)",
          scale: 1.06, duration: 0.28,
        }, 0.28)
        .to(".hero-dissolve-overlay", { opacity: 1, duration: 0.29 }, 0.56)
        .to(".hero-canvas-wrap", {
          filter: "blur(40px) brightness(0) saturate(0)",
          scale: 1.12, duration: 0.44,
        }, 0.56);

      // Scroll indicator
      gsap.to(".hero-scroll-indicator", {
        opacity: 0, y: 20,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top", end: "5% top", scrub: true,
        },
      });
      } catch {
        // GSAP failed (adblocker, etc.) — show static content
        setLoaded(true);
      }
    }

    init();
    return () => {
      if (tl) {
        // Kill only this component's ScrollTrigger, not all global ones
        const st = tl.scrollTrigger;
        if (st) st.kill();
        tl.kill();
      }
    };
  }, [drawFrame, TOTAL_FRAMES, frames, showTitle]);

  return (
    <div ref={containerRef} className="h-[500vh] relative">
      <div className="sticky top-0 h-dvh flex items-center justify-center overflow-hidden bg-[var(--color-bg)]">
        <div className="hero-canvas-wrap w-full h-full">
          <canvas
            ref={canvasRef}
            width={1920}
            height={1080}
            aria-label={`Experiencia visual inmersiva de ${product.name} por ${product.house}`}
            role="img"
            className={`w-full h-full object-cover transition-opacity duration-700 ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
            style={{ maxHeight: "100dvh" }}
          />
        </div>

        {/* Fade-in: dark overlay that fades out */}
        <div className="hero-fadein-overlay absolute inset-0 bg-[var(--color-bg)] pointer-events-none z-10" />

        {/* Fade-out: gradient wipe from bottom (dark) */}
        <div
          className="hero-dissolve-gradient absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(to top, #121212 0%, #121212 40%, rgba(18,18,18,0.8) 60%, rgba(18,18,18,0) 100%)",
            transform: "translateY(100%)",
          }}
        />
        <div className="hero-dissolve-overlay absolute inset-0 bg-[var(--color-bg)] opacity-0 pointer-events-none" />

        {/* Title overlay */}
        {showTitle && (
          <div className="hero-text-container absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="text-center px-4">
              <h1 className="hero-title font-[family-name:var(--font-playfair)] text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-4 opacity-0 text-gold-gradient">
                {product.name}
              </h1>
              <p className="hero-subtitle text-sm sm:text-lg md:text-2xl font-bold tracking-[0.25em] uppercase opacity-0 text-[var(--color-ink-soft)]">
                {product.house}
              </p>
            </div>
          </div>
        )}

        {/* Loading skeleton */}
        {!loaded && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[var(--color-bg)]">
            <span className="font-[family-name:var(--font-playfair)] text-xl font-bold tracking-[0.1em] uppercase text-[var(--color-gold)] opacity-30 animate-pulse">
              Fur Eliza
            </span>
            <div className="mt-6 w-32 h-0.5 rounded-full bg-[var(--color-border)] overflow-hidden">
              <div className="h-full w-1/3 rounded-full bg-[var(--color-gold)] animate-[shimmer_1.5s_ease-in-out_infinite]" />
            </div>
          </div>
        )}

        {/* Scroll indicator */}
        <div className="hero-scroll-indicator absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="flex flex-col items-center gap-2 text-[var(--color-ink-soft)]">
            <span className="text-[10px] tracking-widest uppercase opacity-60">Scroll</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="animate-bounce">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
