import { StyleSheet, Font } from '@react-pdf/renderer'

export const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    lineHeight: 1.28,
    paddingTop: 36,
    paddingBottom: 42,
    paddingHorizontal: 55,
    color: '#000'
  },
  logo: {
    width: 120,
    marginBottom: 4
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14
  },
  withoutPrejudice: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 10
  },
  dateLine: {
    marginBottom: 12
  },
  addressBlock: {
    marginBottom: 12
  },
  bold: {
    fontFamily: 'Helvetica-Bold'
  },
  fileNoLine: {
    textAlign: 'right',
    fontFamily: 'Helvetica-Bold',
    marginBottom: 10
  },
  metaBlock: {
    marginBottom: 10
  },
  metaLine: {
    marginBottom: 1
  },
  title: {
    textAlign: 'center',
    fontFamily: 'Helvetica-Bold',
    fontSize: 10.5,
    marginBottom: 10,
    textDecoration: 'underline'
  },
  paragraph: {
    marginBottom: 6,
    textAlign: 'justify'
  },
  signatureBlock: {
    marginTop: 10
  },
  signatureName: {
    fontFamily: 'Helvetica-Oblique',
    fontSize: 12,
    marginBottom: 2
  },
  signatureLabel: {
    fontFamily: 'Helvetica-Bold',
    marginBottom: 8
  },
  licenseLine: {
    fontFamily: 'Helvetica-Bold',
    textDecoration: 'underline',
    marginTop: 6,
    marginBottom: 6
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 55,
    right: 55,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 8,
    color: '#333'
  },
  footerCol: {
    width: '48%'
  },
  footerBold: {
    fontFamily: 'Helvetica-Bold',
    marginBottom: 2
  },
  paymentBox: {
    marginTop: 2,
    marginBottom: 10,
    padding: 7,
    borderWidth: 1,
    borderColor: '#999',
    borderStyle: 'solid'
  },
  paymentTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 10,
    marginBottom: 4,
    textDecoration: 'underline'
  },
  paymentLine: {
    marginBottom: 3,
    fontSize: 9.5
  }
})
