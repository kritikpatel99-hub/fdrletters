// "2026-07-22" -> "July 22, 2026"
export function formatLongDate(isoDate) {
  if (!isoDate) return ''
  const d = new Date(isoDate + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

// "2026-07-15" -> "07-15-26"
export function formatShortDate(isoDate) {
  if (!isoDate) return ''
  const d = new Date(isoDate + 'T00:00:00')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  const yy = String(d.getFullYear()).slice(-2)
  return `${mm}-${dd}-${yy}`
}

export function maskAccount(acct) {
  if (!acct) return ''
  const digits = acct.replace(/\D/g, '')
  const last = digits.slice(-4)
  return '*'.repeat(Math.max(digits.length - 4, 6)) + last
}
