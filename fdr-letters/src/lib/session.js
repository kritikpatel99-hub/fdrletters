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
