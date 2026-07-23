export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 5000)
}

// Tries the native share sheet (works on most mobile browsers and some
// desktop browsers — the OS share sheet includes Mail/Outlook if installed
// and lets the file go along as a real attachment). If the browser can't
// share files, falls back to downloading the PDF and opening a prefilled
// mailto so the manager just has to drag the file in.
export async function openInMail({ blob, filename, subject, body, to = '' }) {
  const file = new File([blob], filename, { type: 'application/pdf' })

  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: subject, text: body })
      return { method: 'share' }
    } catch (err) {
      if (err?.name === 'AbortError') return { method: 'cancelled' }
      // fall through to mailto fallback
    }
  }

  downloadBlob(blob, filename)
  const mailto = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
    body + '\n\n(The letter PDF has been downloaded — please attach it before sending.)'
  )}`
  window.location.href = mailto
  return { method: 'fallback' }
}
