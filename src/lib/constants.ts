/** Central WhatsApp contact number — use env var in production */
export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "573004228021";

/** Max quantity per cart item */
export const MAX_CART_QUANTITY = 99;

/**
 * Safely serialize an object to JSON for injection into a <script> tag.
 * Escapes <, >, & to prevent XSS when used with dangerouslySetInnerHTML.
 */
export function safeJsonLd(obj: unknown): string {
  return JSON.stringify(obj)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}
