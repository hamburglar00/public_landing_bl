/** Devuelve el email normalizado o vacío; el campo nunca bloquea el CTA. */
export function validInlineEmail(value: string): string {
  const email = value.trim();
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)
    ? email.toLowerCase()
    : '';
}
