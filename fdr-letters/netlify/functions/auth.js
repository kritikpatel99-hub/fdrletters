// netlify/functions/auth.js
//
// Simple shared-password gate. The real password lives ONLY in the Netlify
// environment variable APP_PASSWORD (set it in Netlify dashboard ->
// Site configuration -> Environment variables). It is never shipped to the
// browser bundle, so it can't be read out of the compiled JS.
//
// On success we return a signed, time-limited token (HMAC-SHA256) that the
// frontend stores in sessionStorage and sends back on every PDF-generation
// request. The verify function checks the signature + expiry server-side.

const crypto = require('crypto')

const SESSION_HOURS = 10 // token valid for a work day

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
    return true
  } catch {
    return false
  }
}

exports.handler = async (event) => {
  const secret = process.env.SESSION_SECRET
  const appPassword = process.env.APP_PASSWORD

  if (!secret || !appPassword) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Server not configured. Set APP_PASSWORD and SESSION_SECRET in Netlify env vars.' }) }
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
    const b = Buffer.from(appPassword)
    const same = a.length === b.length && crypto.timingSafeEqual(a, b)
    if (!same) {
      return { statusCode: 401, body: JSON.stringify({ error: 'Incorrect password' }) }
    }
    const token = sign({ exp: Date.now() + SESSION_HOURS * 60 * 60 * 1000 }, secret)
    return { statusCode: 200, body: JSON.stringify({ token }) }
  }

  return { statusCode: 405, body: 'Method not allowed' }
}
