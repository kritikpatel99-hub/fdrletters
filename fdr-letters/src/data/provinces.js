// Known collection-agency permit/license numbers per province, based on
// existing FDR letter templates. Add more as they're confirmed — anything
// not listed falls back to an editable blank field so nothing gets
// generated with a wrong number.
export const PROVINCE_LICENSES = {
  ON: { label: 'Ontario', licensePrefix: 'Permit ON', licenseNumber: '4007233' },
  BC: { label: 'British Columbia', licensePrefix: 'BC', licenseNumber: '17164' },
  AB: { label: 'Alberta', licensePrefix: 'AB', licenseNumber: '300871' },
  SK: { label: 'Saskatchewan', licensePrefix: '', licenseNumber: '' },
  MB: { label: 'Manitoba', licensePrefix: '', licenseNumber: '' },
  NS: { label: 'Nova Scotia', licensePrefix: '', licenseNumber: '' },
  NB: { label: 'New Brunswick', licensePrefix: '', licenseNumber: '' },
  NL: { label: 'Newfoundland and Labrador', licensePrefix: '', licenseNumber: '' },
  PE: { label: 'Prince Edward Island', licensePrefix: '', licenseNumber: '' },
  QC: { label: 'Quebec', licensePrefix: '', licenseNumber: '' },
  NT: { label: 'Northwest Territories', licensePrefix: '', licenseNumber: '' },
  NU: { label: 'Nunavut', licensePrefix: '', licenseNumber: '' },
  YT: { label: 'Yukon', licensePrefix: '', licenseNumber: '' }
}

// Provinces where employer contact is prohibited without consent —
// surfaced as an on-screen reminder only, not printed on the letter.
export const NO_EMPLOYER_CONTACT_PROVINCES = ['BC', 'AB', 'SK', 'NS', 'NT']

export const HIGH_ALERT_PROVINCES = ['AB', 'BC']
