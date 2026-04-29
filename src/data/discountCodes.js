export const DISCOUNT_CODES = [
  { code: 'SKODA10',   type: 'percent', value: 10 },
  { code: 'VITEJTE',   type: 'percent', value: 5  },
  { code: 'SLEVA5000', type: 'fixed',   value: 5000 },
]

/**
 * Ověří slevový kód a vrátí objekt slevy, nebo null pokud kód neexistuje.
 * @param {string} code   — zadaný kód (case-insensitive)
 * @param {number} total  — celková cena bez slevy (Kč)
 * @returns {{ code, type, value, amount } | null}
 */
export function applyDiscount(code, total) {
  const found = DISCOUNT_CODES.find(
    c => c.code === code.trim().toUpperCase()
  )
  if (!found) return null

  const amount =
    found.type === 'percent'
      ? Math.round(total * found.value / 100)
      : Math.min(found.value, total)

  return { ...found, amount }
}
