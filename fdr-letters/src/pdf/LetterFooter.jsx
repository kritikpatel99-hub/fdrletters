import React from 'react'
import { View, Text } from '@react-pdf/renderer'
import { styles } from './styles'

export default function LetterFooter() {
  return (
    <View style={styles.footer} fixed>
      <View style={styles.footerCol}>
        <Text style={styles.footerBold}>FINANCIAL DEBT RECOVERY LIMITED</Text>
        <Text>40 West Wilmot Street, Unit 10</Text>
        <Text>Richmond Hill, Ontario L4B 1H8</Text>
        <Text>Toll Free: (800) 763-3328</Text>
      </View>
      <View style={styles.footerCol}>
        <Text style={styles.footerBold}>AGENCE DE RECOUVREMENT F.D.R. LTEE</Text>
        <Text>1117 rue Ste-Catherine ouest, Bur. 206</Text>
        <Text>Montreal (Quebec) H3B 1H9</Text>
        <Text>Sans Frais: (877) 354-6582</Text>
      </View>
    </View>
  )
}
