import React from 'react'
import { View, Text } from '@react-pdf/renderer'
import { styles } from './styles'

// Standard FDR payment instructions, in the required order:
// 1. Online bill payment  2. E-transfer  3. Phone
export default function PaymentInstructions({ fileNo }) {
  return (
    <View style={styles.paymentBox} wrap={false}>
      <Text style={styles.paymentTitle}>Payment Instructions</Text>

      <Text style={styles.paymentLine}>
        <Text style={styles.bold}>1. Online bill payment: </Text>
        Add "Financial Debt Recovery Ltd" as a payee through your bank's online bill payment,
        using <Text style={styles.bold}>{fileNo}</Text> as your account number. Please reply
        with your confirmation number once paid.
      </Text>

      <Text style={styles.paymentLine}>
        <Text style={styles.bold}>2. E-transfer: </Text>
        Send to <Text style={styles.bold}>payments@fdr.on.ca</Text>
      </Text>

      <Text style={styles.paymentLine}>
        <Text style={styles.bold}>3. Phone payment: </Text>
        Call Toll-Free <Text style={styles.bold}>1-833-709-0873 Ext. 7500</Text> or Local{' '}
        <Text style={styles.bold}>905-771-7458</Text>
      </Text>
    </View>
  )
}
