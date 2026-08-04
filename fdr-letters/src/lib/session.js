const KEY = 'fdr_session_token'

export async function login(password) {
  const res = await fetch('/.netlify/functions/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password })
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Login failed')
  sessionStorage.setItem(KEY, data.token)
  return data.token
}

export function getToken() {
  return sessionStorage.getItem(KEY)
}

export function logout() {
  sessionStorage.removeItem(KEY)
}

export async function hasValidSession() {
  const token = getToken()
  if (!token) return false
  try {
    const res = await fetch('/.netlify/functions/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'verify', token })
    })
    const data = await res.json()
    return !!data.valid
  } catch {
    return false
  }
}

// --- Release Letter tier (manager/supervisor only) ---------------------
// Separate password, separate token, separate storage key. Unlocking the
// general app does NOT unlock this — it's a distinct gate on top.

const RELEASE_KEY = 'fdr_release_session_token'

export async function releaseLogin(password) {
  const res = await fetch('/.netlify/functions/release-auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password })
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Login failed')
  sessionStorage.setItem(RELEASE_KEY, data.token)
  return data.token
}

export function getReleaseToken() {
  return sessionStorage.getItem(RELEASE_KEY)
}

export function releaseLogout() {
  sessionStorage.removeItem(RELEASE_KEY)
}

export async function hasValidReleaseSession() {
  const token = getReleaseToken()
  if (!token) return false
  try {
    const res = await fetch('/.netlify/functions/release-auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'verify', token })
    })
    const data = await res.json()
    return !!data.valid
  } catch {
    return false
  }
}
