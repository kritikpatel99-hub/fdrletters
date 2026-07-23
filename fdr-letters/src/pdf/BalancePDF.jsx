import React from 'react'
import { Document, Page, View, Text, Image } from '@react-pdf/renderer'
import { styles } from './styles'
import { FDR_LOGO_DATA_URI } from './logoData'
import LetterFooter from './LetterFooter'
import PaymentInstructions from './PaymentInstructions'
import { formatLongDate } from '../utils/format'
import { amountToWords, formatMoney } from '../utils/numberToWords'

export default function BalancePDF({ data }) {
  const {
    letterDate, debtorName, addressLines = [], fileNo,
    currentCreditor, originalCreditor, originalCreditorAccountMasked,
    amountOwing, acceptAmount, termsDate,
    managerName, licensePrefix, licenseNumber
  } = data

  const acceptWords = amountToWords(acceptAmount)

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
          <Text style={styles.metaLine}><Text style={styles.bold}>Original Creditor Account:</Text> {originalCreditorAccountMasked}</Text>
          <Text style={styles.metaLine}><Text style={styles.bold}>AMOUNT OWING:</Text> $ {formatMoney(amountOwing)}</Text>
        </View>

        <Text style={{ marginBottom: 10 }}>Dear <Text style={styles.bold}>{debtorName}</Text></Text>

        <Text style={styles.paragraph}>
          This letter will confirm that Financial Debt Recovery Limited is an authorized agent for <Text style={styles.bold}>{currentCreditor}</Text>{' '}
          and as such, have the authority to accept the sum of <Text style={styles.bold}>$ {formatMoney(acceptAmount)} ({acceptWords}),</Text>{' '}
          as per the original terms of the agreement you had with <Text style={styles.bold}>{currentCreditor}</Text> as of{' '}
          <Text style={styles.bold}>{formatLongDate(termsDate)}.</Text> Full and final payment is required for the above noted account.
        </Text>

        <PaymentInstructions fileNo={fileNo} />

        <Text style={{ marginTop: 10, marginBottom: 14 }}>Yours sincerely,</Text>

        <View style={styles.signatureBlock}>
          <Text style={styles.signatureName}>{managerName}</Text>
          <Text style={styles.signatureLabel}>Manager</Text>

          <Text style={{ marginTop: 8 }}>AUTHORIZED AGENT FOR</Text>
          <Text style={[styles.bold, { marginBottom: 14 }]}>{currentCreditor}</Text>
        </View>

        {licenseNumber ? (
          <Text style={styles.licenseLine}>{licensePrefix}:{licenseNumber}</Text>
        ) : null}

        <LetterFooter />
      </Page>
    </Document>
  )
}
