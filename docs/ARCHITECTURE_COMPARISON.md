# Arquitectura de Fur Eliza: Comparativa de Enfoques

Este documento detalla dos enfoques arquitectónicos de alto nivel para el ecosistema de Fur Eliza, analizando sus implicaciones técnicas, operativas y de rendimiento para un e-commerce de ultra-lujo.

---

## Opción A: Arquitectura de Microservicios Puros ("The Onyx Protocol")

**Filosofía:** "Divide y vencerás". Cada servicio es una isla independiente con su propio repositorio, base de datos y ciclo de vida.

### Estructura
*   **Repositorios:** Multi-repo. Un repo para `catalog-service`, otro para `order-service`, otro para `frontend`.
*   **Comunicación:** Totalmente a través de la red (HTTP/gRPC/RabbitMQ).
*   **Base de Datos:** "Database per Service". El servicio de catálogo tiene su PostgreSQL, el de pedidos tiene el suyo. Nadie toca la base de datos del otro.

### Diagrama Conceptual
```
[Frontend (Next.js)] 
       |
       v
[API Gateway (Kong/Traefik)]
       |
       +---> [Catalog Service (Rust)] ---> [DB Catalog]
       |
       +---> [Order Service (Go)] -------> [DB Orders]
       |
       +---> [AI Service (Python)] ------> [Vector DB]
```

### Ventajas
*   **Desacoplamiento Total:** Si el equipo de Python rompe el servicio de IA, el catálogo en Rust ni se entera.
*   **Libertad Tecnológica:** Puedes reescribir un servicio en Haskell mañana y a nadie le importa mientras mantengas la API.

### Desventajas (El "Impuesto" de los Microservicios)
*   **Complejidad Operativa:** Necesitas orquestar 5-10 despliegues distintos.
*   **Latencia de Red:** Cada llamada entre servicios añade milisegundos.
*   **Consistencia de Datos:** ¿Qué pasa si se crea un pedido (Order DB) pero falla al reservar stock (Catalog DB)? Necesitas "Sagas" o transacciones distribuidas complejas.
*   **Duplicación de Código:** Tienes que escribir los modelos de datos (ej: `Product`) en Rust, en Go, en Python y en TypeScript. Si cambia uno, tienes que actualizar 4 repositorios.

---

## Opción B: Monorepo de Servicios ("Google Style")

**Filosofía:** "Un solo árbol, muchas ramas". Todo el código vive junto, permitiendo compartir lógica y herramientas, pero se despliega como servicios independientes escalables.

### Estructura
*   **Repositorio:** Un solo repo gigante (`fureliza/`).
*   **Gestión:** Herramientas como **Turborepo** (JS/TS), **Cargo Workspaces** (Rust) o **Bazel** (Políglota).
*   **Código Compartido:**
    *   `packages/schema`: Definiciones de Protocol Buffers (Protobuf) o GraphQL que generan código automáticamente para Rust, Go y TS.
    *   `packages/ui`: Componentes de diseño compartidos.
    *   `lib/utils`: Lógica de negocio core compartida.

### Diagrama Conceptual
```
fureliza/ (Monorepo Root)
├── apps/
│   ├── web (Next.js)
│   ├── catalog-api (Rust)  <-- Se despliega independiente
│   ├── order-processor (Go) <-- Se despliega independiente
│   └── ai-worker (Python)
├── packages/
│   ├── protos (Definiciones .proto compartidas)
│   ├── db-schema (Migraciones SQL compartidas)
│   └── config (Eslint, TSConfig, Rust Clippy)
└── tools/
    └── ci-cd (Scripts de despliegue unificado)
```

### Ventajas (Por qué Google lo hace así)
*   **Atomic Commits:** Puedes cambiar una API en el Backend y actualizar el Frontend en el **mismo commit**. Adiós a "rompí el frontend porque cambié el backend".
*   **Reutilización de Código:** Escribes la definición del `Product` una vez en Protobuf, y se genera el código para Rust, Go y TS automáticamente.
*   **Productividad:** Una sola configuración de CI/CD, un solo linter, una sola forma de correr tests.
*   **Visibilidad:** Todo el equipo (tú y Elizabeth) ve todo el proyecto. Es más fácil entender cómo afecta un cambio.

### Desventajas
*   **Tooling:** Necesitas herramientas buenas (como Turborepo o Nx) para que el CI no sea lento (no quieres recompilar todo si solo cambiaste una línea de CSS).
*   **Disciplina:** Es tentador importar código "privado" de un servicio a otro, rompiendo la modularidad. Hay que ser estricto con los límites.

---

## Veredicto para Fur Eliza

El estilo **Monorepo (Google Style)** es superior para este proyecto.

1.  **Velocidad de Iteración:** Al ser un equipo pequeño, no puedes permitirte gestionar 5 repositorios y versiones. Quieres hacer `git push` y que todo se actualice.
2.  **Consistencia de Tipos:** Con un Monorepo, podemos usar herramientas para asegurar que el tipo `Product` en la base de datos sea idéntico al que recibe el Frontend. **End-to-End Type Safety**.
3.  **Escalabilidad Real:** Sigues teniendo microservicios. `catalog-api` es un binario de Rust independiente. Si mañana tienes 1 millón de visitas, escalas solo ese binario. Pero en el día a día, desarrollas como si fuera uno solo.

**Esta arquitectura te da la potencia de los microservicios sin el dolor de cabeza de la gestión distribuida.**
