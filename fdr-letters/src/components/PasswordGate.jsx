import React, { useState } from 'react'
import { login } from '../lib/session'

export default function PasswordGate({ onSuccess }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(password)
      onSuccess()
    } catch (err) {
      setError(err.message || 'Incorrect password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="gate-wrap">
      <form className="gate-card" onSubmit={handleSubmit}>
        <h1>FDR Letter Generator</h1>
        <p className="gate-sub">Authorized managers only</p>
        <input
          type="password"
          autoFocus
          placeholder="Enter access password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error ? <div className="gate-error">{error}</div> : null}
        <button type="submit" disabled={loading || !password}>
          {loading ? 'Checking…' : 'Unlock'}
        </button>
      </form>
    </div>
  )
}
