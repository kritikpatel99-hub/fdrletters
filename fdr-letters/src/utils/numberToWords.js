const ONES = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen',
  'Eighteen', 'Nineteen']
const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']
const SCALE = ['', 'Thousand', 'Million', 'Billion']

function chunkToWords(n) {
  let str = ''
  if (n >= 100) {
    str += ONES[Math.floor(n / 100)] + ' Hundred'
    n %= 100
    if (n) str += ' '
  }
  if (n >= 20) {
    str += TENS[Math.floor(n / 10)]
    if (n % 10) str += '-' + ONES[n % 10]
  } else if (n > 0) {
    str += ONES[n]
  }
  return str
}

function intToWords(num) {
  if (num === 0) return 'Zero'
  let chunks = []
  let i = 0
  while (num > 0) {
    const chunk = num % 1000
    if (chunk) {
      chunks.unshift(chunkToWords(chunk) + (SCALE[i] ? ' ' + SCALE[i] : ''))
    }
    num = Math.floor(num / 1000)
    i++
  }
  return chunks.join(' ')
}

// 16358.33 -> "Sixteen Thousand Three Hundred Fifty-Eight Dollars and Thirty-Three Cents"
export function amountToWords(amount) {
  const rounded = Math.round((Number(amount) || 0) * 100) / 100
  const dollars = Math.floor(rounded)
  const cents = Math.round((rounded - dollars) * 100)
  const dollarsWords = intToWords(dollars)
  const centsWords = cents === 0 ? 'Zero' : intToWords(cents)
  return `${dollarsWords} Dollar${dollars === 1 ? '' : 's'} and ${centsWords} Cent${cents === 1 ? '' : 's'}`
}

export function formatMoney(amount) {
  const n = Number(amount) || 0
  return n.toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
