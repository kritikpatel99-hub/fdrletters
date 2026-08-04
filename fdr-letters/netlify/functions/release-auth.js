// netlify/functions/release-auth.js
//
// Second-tier password gate for the Release Letter tab ONLY.
// Same pattern as auth.js: the real password lives ONLY in the Netlify
// environment variable RELEASE_PASSWORD (set it in Netlify dashboard ->
// Site configuration -> Environment variables), separate from the general
// app password. It is never shipped to the browser bundle.
//
// Purpose: agents can unlock the general app and use the Balance / SIF
// letters freely, but need this SEPARATE password (known only to managers
// and supervisors) to access the Release Letter tab. This prevents an
// agent from generating a Letter of Release on a file that hasn't
// actually been closed/paid in full.
//
// On success we return a signed, time-limited token (HMAC-SHA256) that the
// frontend stores in sessionStorage and checks before rendering the Release
// Letter form. The verify function checks the signature + expiry server-side.

const crypto = require('crypto')

const SESSION_HOURS = 10 // token valid for a work day, same as main session

function sign(payload, secret) {
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const hmac = crypto.createHmac('sha256', secret).update(data).digest('base64url')
  return `${data}.${hmac}`
}

function verify(token, secret) {
  try {
    const [data, hmac] = token.split('.')
    const expected = crypto.createHmac('sha256', secret).update(data).digest('base64url')
    if (!crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(expected))) return false
    const payload = JSON.parse(Buffer.from(data, 'base64url').toString())
    if (Date.now() > payload.exp) return false
    if (payload.scope !== 'release') return false
    return true
  } catch {
    return false
  }
}

exports.handler = async (event) => {
  // Uses its own secret so release tokens can never be confused with / forged
  // from a general-app session, even if one secret were ever compromised.
  const secret = process.env.RELEASE_SESSION_SECRET
  const releasePassword = process.env.RELEASE_PASSWORD

  if (!secret || !releasePassword) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Server not configured. Set RELEASE_PASSWORD and RELEASE_SESSION_SECRET in Netlify env vars.' }) }
  }

  if (event.httpMethod === 'POST' && JSON.parse(event.body || '{}').action === 'verify') {
    const { token } = JSON.parse(event.body)
    const ok = verify(token, secret)
    return { statusCode: 200, body: JSON.stringify({ valid: ok }) }
  }

  if (event.httpMethod === 'POST') {
    const { password } = JSON.parse(event.body || '{}')
    // Constant-time compare on password too
    const a = Buffer.from(password || '')
    const b = Buffer.from(releasePassword)
    const same = a.length === b.length && crypto.timingSafeEqual(a, b)
    if (!same) {
      return { statusCode: 401, body: JSON.stringify({ error: 'Incorrect manager password' }) }
    }
    const token = sign({ scope: 'release', exp: Date.now() + SESSION_HOURS * 60 * 60 * 1000 }, secret)
    return { statusCode: 200, body: JSON.stringify({ token }) }
  }

  return { statusCode: 405, body: 'Method not allowed' }
}
