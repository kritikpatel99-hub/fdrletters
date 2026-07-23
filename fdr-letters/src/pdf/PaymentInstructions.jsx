import React from 'react'
import { View, Text } from '@react-pdf/renderer'
import { styles } from './styles'

// Standard FDR payment instructions, in the required order:
// 1. Online bill payment  2. E-transfer  3. Phone
export default function PaymentInstructions({ fileNo }) {
  return (
    <View style={styles.paymentBox} wrap={false}>
      <Text style={styles.paymentTitle}>Online Bill Payment Instructions</Text>

      <Text style={styles.paymentLine}>1. Add Financial Debt Recovery Ltd as a bill payee</Text>
      <Text style={styles.paymentLine}>2. Account number - <Text style={styles.bold}>{fileNo}</Text></Text>
      <Text style={styles.paymentLine}>3. Call us back with the confirmation/reference number.</Text>

      <Text style={[styles.paymentLine, { marginTop: 4 }]}>
        <Text style={styles.bold}>E-transfer: </Text>
        Send to <Text style={styles.bold}>payments@fdr.on.ca</Text>
      </Text>

      <Text style={styles.paymentLine}>
        <Text style={styles.bold}>Phone payment: </Text>
        Call Toll-Free <Text style={styles.bold}>1-833-709-0873 Ext. 7500</Text> or Local{' '}
        <Text style={styles.bold}>905-771-7458</Text>
      </Text>
    </View>
  )
}
