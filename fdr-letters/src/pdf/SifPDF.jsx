import React from 'react'
import { Document, Page, View, Text, Image } from '@react-pdf/renderer'
import { styles } from './styles'
import { FDR_LOGO_DATA_URI } from './logoData'
import LetterFooter from './LetterFooter'
import PaymentInstructions from './PaymentInstructions'
import { formatLongDate } from '../utils/format'
import { amountToWords, formatMoney } from '../utils/numberToWords'
import { scheduleToSentence } from '../utils/paymentTerms'

export default function SifPDF({ data }) {
  const {
    letterDate, debtorName, addressLines = [], fileNo,
    currentCreditor, originalCreditor, originalCreditorAccountMasked,
    amountOwing, considerationAmount, deadlineDate,
    paymentRows = [], managerName, witnessName, licensePrefix, licenseNumber
  } = data

  const considerationWords = amountToWords(considerationAmount)
  const scheduleSentence = paymentRows.length > 0 ? scheduleToSentence(paymentRows) : null

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <Image src={FDR_LOGO_DATA_URI} style={[styles.logo, { marginBottom: 4 }]} />
        <View style={[styles.headerRow, { marginBottom: 20 }]}>
          <Text>{formatLongDate(letterDate)}</Text>
          <Text style={styles.withoutPrejudice}>Without Prejudice</Text>
        </View>

        <View style={styles.addressBlock}>
          <Text style={styles.bold}>{debtorName}</Text>
          {addressLines.map((line, i) => <Text key={i} style={styles.bold}>{line}</Text>)}
        </View>

        <Text style={styles.fileNoLine}>FDR File No: {fileNo}</Text>

        <View style={styles.metaBlock}>
          <Text style={styles.metaLine}><Text style={styles.bold}>Current Creditor:</Text> {currentCreditor}</Text>
          <Text style={styles.metaLine}><Text style={styles.bold}>Original Creditor:</Text> {originalCreditor}</Text>
          <Text style={styles.metaLine}><Text style={styles.bold}>Original Creditor Account:</Text> {originalCreditorAccountMasked}</Text>
          <Text style={styles.metaLine}><Text style={styles.bold}>AMOUNT OWING:</Text> $ {formatMoney(amountOwing)}</Text>
        </View>

        <Text style={styles.title}>SETTLEMENT OFFER</Text>

        <Text style={styles.paragraph}>
          <Text style={styles.bold}>IN CONSIDERATION</Text> of the sum $<Text style={styles.bold}>{formatMoney(considerationAmount)} ({considerationWords}),</Text>{' '}
          the receipt of which is hereby anticipated.
        </Text>

        <Text style={styles.paragraph}>
          Upon payment clearing the bank, <Text style={styles.bold}>FINANCIAL DEBT RECOVERY LIMITED</Text>, duly authorized agents for{' '}
          <Text style={styles.bold}>{currentCreditor}</Text> will hereby remise, release and forever <Text style={styles.bold}>{debtorName}</Text> particularly
          covering a certain debt owing <Text style={styles.bold}>{currentCreditor}</Text> of which the present balance owing
          is $<Text style={styles.bold}>{formatMoney(amountOwing)} ({amountToWords(amountOwing)}),</Text> interest under reference
          number <Text style={styles.bold}>{fileNo}</Text>.
        </Text>

        {scheduleSentence ? (
          <Text style={styles.paragraph}>{scheduleSentence}</Text>
        ) : null}

        <PaymentInstructions fileNo={fileNo} />

        <Text style={styles.paragraph}>
          If funds are not received by <Text style={styles.bold}>{formatLongDate(deadlineDate)}</Text>, the arrangement stated herein shall become null and void and
          the full balance plus interest shall become due and payable upon demand.
        </Text>

        <Text style={styles.paragraph}>
          Once the funds have been received by <Text style={styles.bold}>FINANCIAL DEBT RECOVERY LIMITED</Text> as stated herein and
          successfully clear the bank, under the terms stated herein, and subject to audit, this letter will act as full
          and final discharge for the above party.
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
