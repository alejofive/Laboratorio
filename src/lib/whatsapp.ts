export function normalizePhoneToE164(phone: string): string | null {
  const digits = phone.replace(/\D/g, '')

  if (!digits) return null

  if (digits.startsWith('0') && digits.length >= 10 && digits.length <= 11) {
    return `58${digits.slice(1)}`
  }

  return digits
}

export function buildWhatsAppLink(phone: string, message: string): string | null {
  const normalized = normalizePhoneToE164(phone)

  if (!normalized) return null

  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`
}
