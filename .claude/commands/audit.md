# Auditoría completa del código

Lanza 3 agentes revisores en paralelo para una auditoría pre-deploy:

## Agente 1: Código muerto
Busca imports no usados, componentes huérfanos, exports sin consumir, CSS muerto, data fields no leídos, código inalcanzable.

## Agente 2: Integración end-to-end
Verifica que cada feature esté conectada: páginas accesibles desde nav, componentes usados, cart flow completo, SEO con JSON-LD, security headers, GSAP wired up.

## Agente 3: Calidad y build
Corre `tsc --noEmit` y `npm run build`. Revisa seguridad (secrets, CSP, XSS), performance (bundle size, lazy loading, Image optimization), console.logs, hardcoded values.

## Ejecución
Lanza los 3 agentes con `subagent_type: "feature-dev:code-reviewer"` en paralelo (background). Espera resultados. Presenta hallazgos consolidados al usuario. Arregla lo crítico antes de deployar.
