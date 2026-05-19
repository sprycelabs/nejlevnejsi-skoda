export const DISCOUNT_CODES = [
  { code: 'BERU_SLEVU', type: 'fixed', value: 10000 },
  { code: 'KVETEN10', type: 'fixed', value: 10000 },
  { code: 'KVETEN-10-TAFY', type: 'fixed', value: 10000 },
  { code: 'KVETEN10-PREISSOVA', type: 'fixed', value: 10000 },
  { code: 'KVETEN10-AK21', type: 'fixed', value: 10000 },
  { code: 'KVETEN10-KHOR', type: 'fixed', value: 10000 },
  { code: 'KVETEN10-HOSTALEK', type: 'fixed', value: 10000 },
  { code: 'KVETEN10-MATKOWSKA', type: 'fixed', value: 10000 },
  { code: 'KVETEN10-ABRHAM', type: 'fixed', value: 10000 },
  { code: 'KVETEN10-RK23', type: 'fixed', value: 10000 },
  { code: 'KVETEN10-BLAJER', type: 'fixed', value: 10000 },
  { code: 'KVETEN10-MPAYMA', type: 'fixed', value: 10000 },
  { code: 'KVETEN10-JANER', type: 'fixed', value: 10000 },
  { code: 'KVETEN10-TOMASMIKA', type: 'fixed', value: 10000 },
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
