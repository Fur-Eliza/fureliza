# GSAP in Next.js — Rules

- **Always** use `"use client"` for any component with GSAP
- **Always** wrap GSAP in try/catch with fallback (adblockers can block GSAP)
- **Always** add `gsap-animated` CSS class for `prefers-reduced-motion` fallback
- **Always** clean up ScrollTrigger instances on unmount — capture `tween.scrollTrigger` and call `.kill()` in useEffect cleanup
- **Never** use `ScrollTrigger.killAll()` — kill only the component's own triggers
- Register plugins once in `src/lib/gsap.ts` with `typeof window !== "undefined"` guard
- Use `useGSAP()` from `@gsap/react` for automatic cleanup (see FragranceMeter.tsx)
- **ScrollSmoother** wraps all content via `SmoothScroll.tsx` in root layout
- **SplitText** used via `SplitTitle.tsx` — must call `split.revert()` on cleanup
- View Transitions enabled via `experimental.viewTransition: true` in `next.config.ts`
- All GSAP plugins (ScrollSmoother, SplitText, MorphSVG) are free since 2025

## Pattern reference
- Correct cleanup: `src/components/AnimatedSection.tsx`
- Correct useGSAP: `src/components/FragranceMeter.tsx`
- Correct try/catch: `src/components/HeroScroll.tsx`
