import React, { useState } from 'react'
import { buildEqualSchedule, scheduleTotal, scheduleToSentence } from '../utils/paymentTerms'
import { formatMoney } from '../utils/numberToWords'

export default function PaymentTermsBuilder({ totalAmount, rows, onChange }) {
  const [mode, setMode] = useState('quick')
  const [downPayment, setDownPayment] = useState('')
  const [downPaymentDate, setDownPaymentDate] = useState(new Date().toISOString().slice(0, 10))
  const [numInstallments, setNumInstallments] = useState(1)
  const [frequency, setFrequency] = useState('monthly')

  function applyQuick() {
    const schedule = buildEqualSchedule({
      totalAmount,
      downPayment,
      downPaymentDate,
      numInstallments,
      frequency
    })
    onChange(schedule)
  }

  function addManualRow() {
    onChange([...(rows || []), { amount: '', date: '', note: null }])
  }

  function updateRow(i, field, value) {
    const next = [...rows]
    next[i] = { ...next[i], [field]: value }
    onChange(next)
  }

  function removeRow(i) {
    onChange(rows.filter((_, idx) => idx !== i))
  }

  const total = scheduleTotal(rows || [])
  const target = Number(totalAmount) || 0
  const diff = Math.round((target - total) * 100) / 100

  return (
    <div className="terms-builder">
      <div className="mode-toggle">
        <button type="button" className={mode === 'quick' ? 'active' : ''} onClick={() => setMode('quick')}>Quick builder</button>
        <button type="button" className={mode === 'manual' ? 'active' : ''} onClick={() => setMode('manual')}>Custom / manual</button>
      </div>

      {mode === 'quick' ? (
        <div className="quick-grid">
          <label>Down payment amount
            <input type="number" step="0.01" value={downPayment} onChange={(e) => setDownPayment(e.target.value)} />
          </label>
          <label>Down payment date
            <input type="date" value={downPaymentDate} onChange={(e) => setDownPaymentDate(e.target.value)} />
          </label>
          <label># of remaining installments
            <input type="number" min="0" value={numInstallments} onChange={(e) => setNumInstallments(e.target.value)} />
          </label>
          <label>Frequency
            <select value={frequency} onChange={(e) => setFrequency(e.target.value)}>
              <option value="monthly">Monthly</option>
              <option value="biweekly">Biweekly</option>
              <option value="weekly">Weekly</option>
            </select>
          </label>
          <button type="button" className="secondary" onClick={applyQuick}>Build schedule</button>
          <p className="hint">For a simple two-payment split (e.g. $10,000 today, $9,000 next month), set installments to 1.</p>
        </div>
      ) : null}

      {(rows && rows.length > 0) ? (
        <div className="rows-editor">
          {rows.map((r, i) => (
            <div className="row-item" key={i}>
              <input
                type="number" step="0.01" placeholder="Amount"
                value={r.amount}
                onChange={(e) => updateRow(i, 'amount', e.target.value)}
              />
              <input
                type="date"
                value={r.date}
                onChange={(e) => updateRow(i, 'date', e.target.value)}
              />
              <input
                type="text" placeholder="Note (optional, e.g. 'due today')"
                value={r.note || ''}
                onChange={(e) => updateRow(i, 'note', e.target.value)}
              />
              <button type="button" className="remove" onClick={() => removeRow(i)}>✕</button>
            </div>
          ))}
        </div>
      ) : null}

      {mode === 'manual' ? (
        <button type="button" className="secondary" onClick={addManualRow}>+ Add payment</button>
      ) : null}

      {rows && rows.length > 0 ? (
        <div className="schedule-summary">
          <p><strong>Scheduled total:</strong> ${formatMoney(total)} {diff !== 0 ? <span className="diff-warning">({diff > 0 ? `$${formatMoney(diff)} short of settlement amount` : `$${formatMoney(-diff)} over settlement amount`})</span> : <span className="diff-ok">matches settlement amount</span>}</p>
          <p className="preview-sentence">"{scheduleToSentence(rows)}"</p>
        </div>
      ) : null}
    </div>
  )
}
