# Agregar nuevo producto al catálogo

Usa El Compositor pipeline para crear un producto completo.

## Pasos

1. Ejecuta el pipeline: `cd /home/jegx/jegx/desktop/work/org/fureliza && npm run pipeline "$ARGUMENTS"`
2. Si el pipeline genera un archivo TypeScript de producto, revísalo y agrégalo a `src/data/products.ts`
3. Verifica que el producto aparece en la colección: `npm run build`
4. Si hay una foto disponible, genera el video y los frames
5. Agrega el producto al sitemap si no se agrega automáticamente

## Notas
- El pipeline necesita al mínimo: nombre y casa. Ejemplo: `"Layton" "Parfums de Marly"`
- Opcional: foto del frasco y estilo de video (hero|orbit|macro|mood|transform|floating|water)
- Env requeridas: `OPENROUTER_API_KEY` (texto), `FAL_KEY` (video)
