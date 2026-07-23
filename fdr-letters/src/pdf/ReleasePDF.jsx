import React from 'react'
import { Document, Page, View, Text, Image } from '@react-pdf/renderer'
import { styles } from './styles'
import { FDR_LOGO_DATA_URI } from './logoData'
import LetterFooter from './LetterFooter'
import { formatLongDate, formatShortDate } from '../utils/format'
import { amountToWords, formatMoney } from '../utils/numberToWords'

export default function ReleasePDF({ data }) {
  const {
    letterDate, debtorName, addressLines = [], fileNo,
    currentCreditor, originalCreditor, originalCreditorAccountMasked,
    amountOwing, considerationAmount, receiptDate,
    managerName, witnessName, licensePrefix, licenseNumber
  } = data

  const considerationWords = amountToWords(considerationAmount)

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.headerRow}>
          <Image src={FDR_LOGO_DATA_URI} style={styles.logo} />
          <Text style={styles.withoutPrejudice}>Without Prejudice</Text>
        </View>

        <Text style={styles.dateLine}>{formatLongDate(letterDate)}</Text>

        <View style={styles.addressBlock}>
          <Text style={styles.bold}>{debtorName}</Text>
          {addressLines.map((line, i) => <Text key={i} style={styles.bold}>{line}</Text>)}
        </View>

        <Text style={styles.fileNoLine}>FDR File No: {fileNo}</Text>

        <View style={styles.metaBlock}>
          <Text style={styles.metaLine}><Text style={styles.bold}>Current Creditor:</Text> {currentCreditor}</Text>
          <Text style={styles.metaLine}><Text style={styles.bold}>Original Creditor:</Text> {originalCreditor}</Text>
          <Text style={styles.metaLine}><Text style={styles.bold}>Original Creditor Account #:</Text> {originalCreditorAccountMasked}</Text>
          <Text style={styles.metaLine}><Text style={styles.bold}>AMOUNT OWING:</Text> ${formatMoney(amountOwing)}</Text>
        </View>

        <Text style={styles.title}>LETTER OF RELEASE</Text>

        <Text style={styles.paragraph}>
          <Text style={styles.bold}>IN CONSIDERATION</Text> of the sum <Text style={styles.bold}>$ {formatMoney(considerationAmount)} ({considerationWords}),</Text>{' '}
          the receipt of which is hereby acknowledged on <Text style={styles.bold}>{formatShortDate(receiptDate)}</Text>.
        </Text>

        <Text style={styles.paragraph}>
          Upon payment clearing the bank, <Text style={styles.bold}>FINANCIAL DEBT RECOVERY LIMITED</Text>, duly authorized agents for{' '}
          <Text style={styles.bold}>{currentCreditor}</Text> will hereby remise and release <Text style={styles.bold}>{debtorName}</Text> from any charges
          and all liabilities under this account only up to and including today's date, as your account is closed and{' '}
          <Text style={styles.bold}>paid in full.</Text> More particularly covering a certain debt owing <Text style={styles.bold}>{currentCreditor}</Text> by{' '}
          <Text style={styles.bold}>{debtorName}</Text> from of which the previous balance owing sum <Text style={styles.bold}>$ {formatMoney(considerationAmount)} ({considerationWords}),</Text>{' '}
          under-reference number <Text style={styles.bold}>{fileNo}</Text>.
        </Text>

        <Text style={styles.paragraph}>
          This payment will be noted on your credit bureau and the rating for this loan will be reflected as per credit reporting guidelines.
        </Text>

        <Text style={[styles.bold, { marginTop: 6, marginBottom: 20 }]}>AT FINANCIAL DEBT RECOVERY LIMITED</Text>

        <View style={styles.signatureBlock}>
          <Text style={styles.signatureName}>{managerName}</Text>
          <Text style={styles.signatureLabel}>MANAGER</Text>

          <Text style={styles.signatureName}>{witnessName}</Text>
          <Text style={[styles.signatureLabel, { textDecoration: 'underline' }]}>WITNESS</Text>
        </View>

        {licenseNumber ? (
          <Text style={styles.licenseLine}>{licensePrefix}:{licenseNumber}</Text>
        ) : null}

        <LetterFooter />
      </Page>
    </Document>
  )
}
