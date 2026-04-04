# Deploy a producción

## Pre-deploy checks
1. `cd /home/jegx/jegx/desktop/work/org/fureliza && npx tsc --noEmit` — debe pasar limpio
2. `npm run build` — debe compilar todas las páginas sin errores
3. `git status` — no debe haber cambios sin commitear

## Deploy
```bash
cd /home/jegx/jegx/desktop/work/org/fureliza && npx vercel --prod --yes
```

## Post-deploy
1. Verifica que la URL de producción carga correctamente
2. Reporta la URL al usuario

## Notas
- Env var en Vercel: `NEXT_PUBLIC_WHATSAPP_NUMBER=573004228021`
- Dominio: fureliza.com (DNS debe apuntar a Vercel)
- Hosting: Vercel Hobby tier ($0)
