# Arquitectura Fur Eliza: The Onyx Protocol (Google-Style Monorepo)

**Versión:** 1.0.0
**Filosofía:** "Lo Mejor sin importar la Dificultad".
**Objetivo:** Construir un sistema de e-commerce de ultra-lujo que sea escalable, seguro y técnicamente perfecto, utilizando las herramientas que definen el estado del arte en ingeniería de software.

---

## 1. El Núcleo: Monorepo Gestionado por Nx

No usaremos múltiples repositorios desconectados. Todo el ecosistema de Fur Eliza vivirá en un solo lugar, orquestado por **Nx**.

### ¿Por qué Nx?
*   **Caché de Computación:** Si compilas una librería de Rust y no la cambias, Nx nunca la volverá a compilar. La baja de la caché instantáneamente.
*   **Grafo de Dependencias:** Nx entiende que si tocas `packages/ui`, solo debe testear `apps/web` y no `apps/catalog`. Ahorra horas de CI.
*   **Políglota Real:** Soporta TypeScript (nativo), Rust (vía plugins de la comunidad), Go y Python.

### Estructura de Directorios Propuesta

```text
fureliza/
├── .nx/                  # Configuración del workspace
├── apps/                 # Aplicaciones desplegables
│   ├── web/              # Next.js 16 (Frontend)
│   ├── catalog/          # Rust (gRPC Server - Inventario)
│   ├── orders/           # Go (Temporal Workflow - Pedidos)
│   └── ai-worker/        # Python (RAG & Embeddings)
├── libs/                 # Código compartido
│   ├── ui/               # Componentes React (Botones, Inputs)
│   ├── utils/            # Funciones helper (Date formatting, Math)
│   └── generated/        # CÓDIGO AUTOGENERADO POR BUF
│       ├── ts/           # Interfaces TypeScript de los Protos
│       ├── rs/           # Structs Rust de los Protos
│       └── go/           # Structs Go de los Protos
├── tools/                # Scripts de infraestructura
│   ├── buf/              # Configuración de Protobuf
│   └── atlas/            # Migraciones de Base de Datos
└── docker-compose.yml    # Entorno local unificado
```

---

## 2. La Lengua Franca: Protobuf & gRPC (Connect)

Los servicios no hablarán JSON "a ciegas". Definiremos contratos estrictos usando **Protocol Buffers (v3)**.

### Tecnología: Buf + Connect
*   **Buf:** Herramienta moderna para gestionar Protobufs. Hace "Linting" (te regaña si rompes las reglas de estilo de Google) y "Breaking Change Detection" (te avisa si un cambio va a romper la app móvil).
*   **Connect (gRPC-Web):** Permite que el Frontend llame al Backend gRPC directamente desde el navegador, sin necesidad de proxies complejos (Envoy) ni traducciones manuales a JSON.

### Ejemplo de Contrato (`catalog.proto`)

```protobuf
syntax = "proto3";
package fureliza.catalog.v1;

service CatalogService {
  rpc GetProduct(GetProductRequest) returns (GetProductResponse);
  rpc ListProducts(ListProductsRequest) returns (ListProductsResponse);
}

message Product {
  string id = 1;
  string name = 2;
  repeated Variant variants = 3;
}

message Variant {
  string id = 1;
  string size = 2; // "50ml"
  int64 price_cop = 3;
}
```

---

## 3. La Base de Datos: Schema-as-Code con Atlas

No tocaremos SQL a mano. Trataremos la base de datos como código infraestructural.

### Tecnología: Atlas (Ariga)
*   **Declarativo:** Defines el estado deseado de tu base de datos en un archivo HCL (o SQL).
*   **Migraciones Automáticas:** Atlas inspecciona tu base de datos real, la compara con tu definición y genera el SQL exacto para sincronizarlas.
*   **CI/CD:** Atlas verifica en el Pull Request si tu migración es segura (ej: "Estás borrando una columna con datos, ¡cuidado!").

---

## 4. El Cerebro: IA con RAG Vectorial

Para la inteligencia, usaremos **Qdrant** (escrita en Rust) como base de datos vectorial y **Python** como orquestador de inferencia.

### Flujo de IA
1.  **Ingesta:** El servicio `catalog` (Rust) envía descripciones de productos a `ai-worker`.
2.  **Embedding:** `ai-worker` (Python) usa un modelo (ej: `text-embedding-3-small`) para convertir el texto en vectores.
3.  **Búsqueda:** Cuando el usuario busca "algo fresco para la mañana", `catalog` consulta a Qdrant vectores cercanos y devuelve los productos semánticamente relevantes.

---

## 5. Hoja de Ruta de Implementación (Next Steps)

1.  **Migración a Nx:** Mover el proyecto actual a la estructura `apps/web`.
2.  **Definición de Protos:** Crear el primer archivo `.proto` para el catálogo.
3.  **Generación de Código:** Configurar `Buf` para generar las interfaces de TS y Rust.
4.  **Implementación del Backend:** Conectar el servicio Rust a las interfaces generadas.
5.  **Conexión Frontend:** Hacer que Next.js consuma los datos vía gRPC-Web (Connect).

**Este es el camino del ingeniero de élite. Es difícil, pero el resultado es una obra de arte técnica.**
