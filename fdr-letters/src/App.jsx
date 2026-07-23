import React, { useEffect, useState } from 'react'
import { pdf } from '@react-pdf/renderer'
import PasswordGate from './components/PasswordGate'
import PaymentTermsBuilder from './components/PaymentTermsBuilder'
import ReleasePDF from './pdf/ReleasePDF'
import SifPDF from './pdf/SifPDF'
import BalancePDF from './pdf/BalancePDF'
import { hasValidSession, logout } from './lib/session'
import { maskAccount } from './utils/format'
import { downloadBlob, openInMail } from './utils/mailShare'
import { PROVINCE_LICENSES, NO_EMPLOYER_CONTACT_PROVINCES } from './data/provinces'

const todayIso = () => new Date().toISOString().slice(0, 10)

const initialState = {
  letterType: 'release',
  letterDate: todayIso(),
  debtorName: '',
  addressLine1: '',
  addressLine2: '',
  fileNo: '',
  currentCreditor: 'FDR Asset Recovery Group Canada LTD',
  originalCreditor: '',
  originalCreditorAccount: '',
  amountOwing: '',
  managerName: 'K. Patel',
  witnessName: '',
  province: 'ON',
  considerationAmount: '',
  receiptDate: todayIso(),
  deadlineDate: '',
  paymentRows: [],
  acceptAmount: '',
  termsDate: todayIso()
}

export default function App() {
  const [authed, setAuthed] = useState(null)
  const [form, setForm] = useState(initialState)
  const [pdfUrl, setPdfUrl] = useState(null)
  const [pdfBlob, setPdfBlob] = useState(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    hasValidSession().then(setAuthed)
  }, [])

  if (authed === null) return <div className="loading-screen">Loading…</div>
  if (!authed) return <PasswordGate onSuccess={() => setAuthed(true)} />

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
    setPdfUrl(null)
  }

  function switchType(type) {
    setForm((f) => ({ ...initialState, letterType: type, managerName: f.managerName, province: f.province }))
    setPdfUrl(null)
  }

  function buildData() {
    const license = PROVINCE_LICENSES[form.province] || {}
    const addressLines = [form.addressLine1, form.addressLine2].filter(Boolean)
    const originalCreditorAccountMasked = maskAccount(form.originalCreditorAccount)

    const base = {
      letterDate: form.letterDate,
      debtorName: form.debtorName,
      addressLines,
      fileNo: form.fileNo,
      currentCreditor: form.currentCreditor,
      originalCreditor: form.originalCreditor,
      originalCreditorAccountMasked,
      amountOwing: form.amountOwing,
      managerName: form.managerName,
      witnessName: form.witnessName,
      licensePrefix: license.licensePrefix,
      licenseNumber: license.licenseNumber
    }

    if (form.letterType === 'release') {
      return { ...base, considerationAmount: form.considerationAmount, receiptDate: form.receiptDate }
    }
    if (form.letterType === 'sif') {
      return { ...base, considerationAmount: form.considerationAmount, deadlineDate: form.deadlineDate, paymentRows: form.paymentRows }
    }
    // balance
    return { ...base, acceptAmount: form.acceptAmount, termsDate: form.termsDate }
  }

  function getDocument() {
    const data = buildData()
    if (form.letterType === 'release') return <ReleasePDF data={data} />
    if (form.letterType === 'sif') return <SifPDF data={data} />
    return <BalancePDF data={data} />
  }

  async function generate() {
    setBusy(true)
    try {
      const blob = await pdf(getDocument()).toBlob()
      setPdfBlob(blob)
      setPdfUrl(URL.createObjectURL(blob))
    } finally {
      setBusy(false)
    }
  }

  function filename() {
    const typeLabel = { release: 'RELEASE_LETTER', sif: 'SIF_LETTER', balance: 'BALANCE_LETTER' }[form.letterType]
    return `${form.fileNo || 'FILE'}_-_${typeLabel}.pdf`
  }

  async function handleDownload() {
    if (!pdfBlob) return
    downloadBlob(pdfBlob, filename())
  }

  async function handleMail() {
    if (!pdfBlob) return
    const typeLabel = { release: 'Letter of Release', sif: 'Settlement Offer', balance: 'Balance Confirmation' }[form.letterType]
    await openInMail({
      blob: pdfBlob,
      filename: filename(),
      subject: `FDR File ${form.fileNo} - ${typeLabel}`,
      body: `Please find attached the ${typeLabel.toLowerCase()} for FDR file ${form.fileNo}.`
    })
  }

  const showEmployerWarning = NO_EMPLOYER_CONTACT_PROVINCES.includes(form.province)

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>FDR Letter Generator</h1>
        <button className="logout" onClick={() => { logout(); setAuthed(false) }}>Lock</button>
      </header>

      <div className="type-tabs">
        <button className={form.letterType === 'release' ? 'active' : ''} onClick={() => switchType('release')}>Release Letter</button>
        <button className={form.letterType === 'sif' ? 'active' : ''} onClick={() => switchType('sif')}>SIF Letter</button>
        <button className={form.letterType === 'balance' ? 'active' : ''} onClick={() => switchType('balance')}>Balance Letter</button>
      </div>

      <div className="main-grid">
        <form className="letter-form" onSubmit={(e) => { e.preventDefault(); generate() }}>
          <fieldset>
            <legend>Debtor &amp; File</legend>
            <label>Letter date
              <input type="date" value={form.letterDate} onChange={(e) => set('letterDate', e.target.value)} required />
            </label>
            <label>Debtor name (LAST, FIRST)
              <input value={form.debtorName} onChange={(e) => set('debtorName', e.target.value)} required />
            </label>
            <label>Address line 1
              <input value={form.addressLine1} onChange={(e) => set('addressLine1', e.target.value)} required />
            </label>
            <label>Address line 2 (City PROV Postal)
              <input value={form.addressLine2} onChange={(e) => set('addressLine2', e.target.value)} required />
            </label>
            <label>FDR file number (7 digits, no suffix)
              <input value={form.fileNo} onChange={(e) => set('fileNo', e.target.value)} required />
            </label>
            <label>Province (for permit/license line)
              <select value={form.province} onChange={(e) => set('province', e.target.value)}>
                {Object.entries(PROVINCE_LICENSES).map(([code, p]) => (
                  <option key={code} value={code}>{p.label}</option>
                ))}
              </select>
            </label>
            {showEmployerWarning ? (
              <p className="inline-warning">Reminder: employer contact requires consent in this province.</p>
            ) : null}
          </fieldset>

          <fieldset>
            <legend>Creditor</legend>
            <label>Current creditor
              <input value={form.currentCreditor} onChange={(e) => set('currentCreditor', e.target.value)} required />
            </label>
            <label>Original creditor
              <input value={form.originalCreditor} onChange={(e) => set('originalCreditor', e.target.value)} required />
            </label>
            <label>Original creditor account number
              <input value={form.originalCreditorAccount} onChange={(e) => set('originalCreditorAccount', e.target.value)} placeholder="Full number — will be masked automatically" />
            </label>
            <label>Amount owing
              <input type="number" step="0.01" value={form.amountOwing} onChange={(e) => set('amountOwing', e.target.value)} required />
            </label>
          </fieldset>

          {form.letterType === 'release' ? (
            <fieldset>
              <legend>Release details</legend>
              <label>Consideration amount received (settlement/PIF amount)
                <input type="number" step="0.01" value={form.considerationAmount} onChange={(e) => set('considerationAmount', e.target.value)} required />
              </label>
              <label>Receipt acknowledged date
                <input type="date" value={form.receiptDate} onChange={(e) => set('receiptDate', e.target.value)} required />
              </label>
            </fieldset>
          ) : null}

          {form.letterType === 'sif' ? (
            <fieldset>
              <legend>Settlement details</legend>
              <label>Settlement amount offered
                <input type="number" step="0.01" value={form.considerationAmount} onChange={(e) => set('considerationAmount', e.target.value)} required />
              </label>
              <label>Deadline (funds must be received by)
                <input type="date" value={form.deadlineDate} onChange={(e) => set('deadlineDate', e.target.value)} required />
              </label>
              <div className="terms-section">
                <legend>Payment terms (optional)</legend>
                <PaymentTermsBuilder
                  totalAmount={form.considerationAmount}
                  rows={form.paymentRows}
                  onChange={(rows) => set('paymentRows', rows)}
                />
              </div>
            </fieldset>
          ) : null}

          {form.letterType === 'balance' ? (
            <fieldset>
              <legend>Balance confirmation details</legend>
              <label>Amount authorized to accept
                <input type="number" step="0.01" value={form.acceptAmount} onChange={(e) => set('acceptAmount', e.target.value)} required />
              </label>
              <label>Terms date
                <input type="date" value={form.termsDate} onChange={(e) => set('termsDate', e.target.value)} required />
              </label>
            </fieldset>
          ) : null}

          <fieldset>
            <legend>Signatures</legend>
            <label>Manager name
              <input value={form.managerName} onChange={(e) => set('managerName', e.target.value)} required />
            </label>
            {form.letterType !== 'balance' ? (
              <label>Witness name
                <input value={form.witnessName} onChange={(e) => set('witnessName', e.target.value)} required />
              </label>
            ) : null}
          </fieldset>

          <button type="submit" className="primary" disabled={busy}>{busy ? 'Generating…' : 'Generate PDF'}</button>
        </form>

        <div className="preview-pane">
          {pdfUrl ? (
            <>
              <iframe title="Letter preview" src={pdfUrl} className="pdf-frame" />
              <div className="action-row">
                <button className="secondary" onClick={handleDownload}>Download PDF</button>
                <button className="secondary" onClick={handleMail}>Open in Mail (attach PDF)</button>
              </div>
            </>
          ) : (
            <div className="preview-placeholder">Fill in the form and click Generate PDF to preview the letter here.</div>
          )}
        </div>
      </div>
    </div>
  )
}
