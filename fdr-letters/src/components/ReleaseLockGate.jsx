import React, { useState } from 'react'
import { releaseLogin } from '../lib/session'

export default function ReleaseLockGate({ onSuccess }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await releaseLogin(password)
      setPassword('')
      onSuccess()
    } catch (err) {
      setError(err.message || 'Incorrect manager password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="gate-wrap release-gate-wrap">
      <form className="gate-card" onSubmit={handleSubmit}>
        <h1>Release Letter — Locked</h1>
        <p className="gate-sub">
          Manager/supervisor password required. Release letters may only be
          issued on files that have been confirmed paid in full or settled.
        </p>
        <input
          type="password"
          autoFocus
          placeholder="Enter manager password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error ? <div className="gate-error">{error}</div> : null}
        <button type="submit" disabled={loading || !password}>
          {loading ? 'Checking…' : 'Unlock Release Letter'}
        </button>
      </form>
    </div>
  )
}
