import { StyleSheet, Font } from '@react-pdf/renderer'

export const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10.5,
    lineHeight: 1.4,
    paddingTop: 50,
    paddingBottom: 70,
    paddingHorizontal: 55,
    color: '#000'
  },
  logo: {
    width: 130,
    marginBottom: 4
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20
  },
  withoutPrejudice: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 10.5
  },
  dateLine: {
    marginBottom: 18
  },
  addressBlock: {
    marginBottom: 18
  },
  bold: {
    fontFamily: 'Helvetica-Bold'
  },
  fileNoLine: {
    textAlign: 'right',
    fontFamily: 'Helvetica-Bold',
    marginBottom: 16
  },
  metaBlock: {
    marginBottom: 14
  },
  metaLine: {
    marginBottom: 2
  },
  title: {
    textAlign: 'center',
    fontFamily: 'Helvetica-Bold',
    fontSize: 11,
    marginBottom: 14,
    textDecoration: 'underline'
  },
  paragraph: {
    marginBottom: 12,
    textAlign: 'justify'
  },
  signatureBlock: {
    marginTop: 22
  },
  signatureName: {
    fontFamily: 'Helvetica-Oblique',
    fontSize: 13,
    marginBottom: 2
  },
  signatureLabel: {
    fontFamily: 'Helvetica-Bold',
    marginBottom: 14
  },
  licenseLine: {
    fontFamily: 'Helvetica-Bold',
    textDecoration: 'underline',
    marginTop: 6,
    marginBottom: 6
  },
  footer: {
    position: 'absolute',
    bottom: 30,
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
  }
})
