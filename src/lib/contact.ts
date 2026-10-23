/**
 * Single source of truth for Sukla Rugs business contact details (Next.js app).
 *
 * Import these constants and the `whatsappUrl()` helper anywhere the business
 * phone number or WhatsApp link is needed, instead of hardcoding the number.
 * Plain module (no `'use client'`) so both server and client components can use it.
 */

/** E.164 formatted phone number. */
export const PHONE_E164 = '+919625530731';

/** Human-readable display form of the business phone number. */
export const PHONE_DISPLAY = '+91 96255 30731';

/** `tel:` link target for the business phone number. */
export const PHONE_TEL = 'tel:+919625530731';

/** Phone number in the digits-only form expected by wa.me links. */
export const WHATSAPP_NUMBER = '919625530731';

/** Default prewritten message used for WhatsApp deep links. */
export const WHATSAPP_MESSAGE = "Hi Sukla Rugs, I'd like to know more about your rugs.";

/**
 * Build a WhatsApp deep link (wa.me) to the business number with a URL-encoded message.
 *
 * @param message - Prewritten message to prefill. Defaults to {@link WHATSAPP_MESSAGE}.
 * @returns A `https://wa.me/...` URL with the encoded `text` query parameter.
 */
export function whatsappUrl(message: string = WHATSAPP_MESSAGE): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
