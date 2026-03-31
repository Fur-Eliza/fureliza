# Fur Eliza — Master Plan & Strategy 2026

## 1. El Alma del Proyecto
Fur Eliza es una curaduría de perfumería de autor (nicho) creada como un tributo a **Elizabeth**. La marca no vende fragancias; vende **Lux Intra** (La luz interior) a través de experiencias sensoriales inmersivas.

## 2. Estrategia de Negocio: El Lujo "Hacker"
Para destacar en un mercado saturado, Fur Eliza utiliza tres pilares:
*   **Discovery Decants:** Venta de muestras de lujo (5ml/10ml) en atomizadores de cristal con estuches de diseño. Es el puente para que el cliente confíe y luego compre la botella completa.
*   **Unboxing de Alta Costura:** Cajas negras "Soft Touch", espuma EVA cortada a láser, sellos de lacre real y papel de algodón.
*   **Secretos Digitales:** Inclusión de tarjetas NFC o códigos QR únicos en cada pedido que desbloquean contenido exclusivo (videos, guías olfativas personalizadas).

## 3. Arquitectura Técnica (Propuesta)

Para que el sistema sea "Súper Bueno" y escalable, propongo la siguiente estructura:

### **A. Frontend (La Fachada de Lujo)**
*   **Lenguaje:** **TypeScript** (Seguridad y robustez).
*   **Framework:** **Next.js 16+** (App Router). Es el estándar para SEO y carga instantánea.
*   **Animaciones:** **GSAP** (ScrollTrigger) y **Three.js** (si pasamos de 2D a 3D real en el futuro).
*   **Estilos:** **Tailwind CSS 4** (Modicidad y variables nativas).

### **B. Backend & Datos (El Sistema Nervioso)**
*   **Headless CMS:** **Sanity.io**. 
    *   *Por qué:* Es visualmente increíble para Elizabeth. Ella podrá arrastrar y soltar notas olfativas, subir fotos y editar descripciones sin tocar una línea de código.
*   **Base de Datos:** **Supabase (PostgreSQL)**. 
    *   *Por qué:* Es ultra-rápida, segura y maneja "Realtime". Si alguien compra, Elizabeth recibe una notificación al instante.
*   **Almacenamiento:** **Vercel Blob** o **Cloudinary** para las imágenes de los frames de animación.

### **C. Capa de Inteligencia (El Mayordomo Digital)**
*   **Motor:** **OpenClaw (Node.js)**.
*   **Función:** Automatización total. Recepción de pedidos, atención vía WhatsApp, gestión de inventario y briefing matutino para la fundadora.
*   **Seguridad:** Local-first. Las llaves API y datos sensibles viven en tu servidor privado, no en nubes públicas.

## 4. Hoja de Ruta (Roadmap)
1.  **Fase 1 (Completada):** Soporte técnico para Variantes y Decants. Número de WhatsApp real integrado.
2.  **Fase 2 (En curso):** Implementación de OpenClaw y configuración del System Prompt del Mayordomo.
3.  **Fase 3:** Integración con Sanity.io para que Elizabeth empiece a poblar el catálogo.
4.  **Fase 4:** Diseño del empaque físico y prototipado del QR/NFC.

---
*Documento generado por Gemini CLI para el proyecto Fur Eliza.*
