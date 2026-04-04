# Accessibility Rules

- Skip-nav link in root layout targets `#main-content` — every page's `<main>` needs `id="main-content" tabIndex={-1}`
- `prefers-reduced-motion` CSS in globals.css kills all animations and makes GSAP elements visible
- All interactive elements have focus-visible outlines (gold color via globals.css)
- Canvas elements need `aria-label` and `role="img"`
- CartDrawer has focus trap (Escape to close, Tab cycles within drawer)
- Modals/drawers need `role="dialog"` and `aria-modal="true"`
