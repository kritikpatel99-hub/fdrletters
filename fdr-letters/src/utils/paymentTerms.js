import { formatLongDate } from './format'
import { formatMoney } from './numberToWords'

// Quick mode: down payment today + N equal monthly installments for the remainder.
// Handles uneven remainders (e.g. two payments like $10,000 + $9,000) just as
// easily as evenly-split ones, since it always puts any rounding leftover on
// the final installment rather than pretending it divides cleanly.
export function buildEqualSchedule({ totalAmount, downPayment, downPaymentDate, numInstallments, frequency }) {
  const total = Number(totalAmount) || 0
  const down = Number(downPayment) || 0
  const remainder = Math.round((total - down) * 100) / 100
  const n = Math.max(1, Number(numInstallments) || 1)

  const rows = []
  if (down > 0) {
    rows.push({ amount: down, date: downPaymentDate, note: 'due today' })
  }

  if (n > 0 && remainder > 0) {
    const base = Math.floor((remainder / n) * 100) / 100
    let runningTotal = 0
    const start = downPaymentDate ? new Date(downPaymentDate + 'T00:00:00') : new Date()

    for (let i = 0; i < n; i++) {
      const isLast = i === n - 1
      let amt = isLast ? Math.round((remainder - runningTotal) * 100) / 100 : base
      runningTotal += amt

      const due = new Date(start)
      if (frequency === 'weekly') due.setDate(due.getDate() + 7 * (i + 1))
      else if (frequency === 'biweekly') due.setDate(due.getDate() + 14 * (i + 1))
      else due.setMonth(due.getMonth() + (i + 1)) // monthly default

      rows.push({ amount: amt, date: due.toISOString().slice(0, 10), note: null })
    }
  }
  return rows
}

// Renders the schedule as the natural-language paragraph that gets inserted
// into the SIF / settlement letter body.
export function scheduleToSentence(rows) {
  if (!rows || rows.length === 0) return ''
  if (rows.length === 1) {
    return `The full amount of $${formatMoney(rows[0].amount)} is due on ${formatLongDate(rows[0].date)}.`
  }

  const parts = rows.map((r, i) => {
    const dateText = r.note === 'due today' ? `today (${formatLongDate(r.date)})` : formatLongDate(r.date)
    return `$${formatMoney(r.amount)} due ${dateText}`
  })

  const last = parts.pop()
  const body = parts.length ? `${parts.join(', ')}, and ${last}` : last

  return `Payment will be made as follows: ${body}, to settle this account in full.`
}

export function scheduleTotal(rows) {
  return rows.reduce((sum, r) => sum + (Number(r.amount) || 0), 0)
}
