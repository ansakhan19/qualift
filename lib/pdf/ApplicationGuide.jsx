import React from 'react'
import {
  Document, Page, Text, View, StyleSheet, Link,
} from '@react-pdf/renderer'

const C = {
  purple: '#7F77DD',
  purpleDark: '#3C3489',
  purpleLight: '#EEEDFE',
  teal: '#1D9E75',
  tealLight: '#E1F5EE',
  gray900: '#111827',
  gray600: '#4B5563',
  gray400: '#9CA3AF',
  gray100: '#F3F4F6',
  gray50: '#F9FAFB',
  coral: '#D85A30',
  white: '#FFFFFF',
}

const s = StyleSheet.create({
  page: { fontFamily: 'Helvetica', backgroundColor: C.white, paddingBottom: 48 },

  // Header
  header: { backgroundColor: C.purple, paddingHorizontal: 32, paddingVertical: 24 },
  headerTitle: { fontSize: 22, fontFamily: 'Helvetica-Bold', color: C.white, letterSpacing: -0.3 },
  headerSub: { fontSize: 11, color: 'rgba(255,255,255,0.8)', marginTop: 3 },

  // Info bar
  infoBar: { backgroundColor: C.purpleLight, paddingHorizontal: 32, paddingVertical: 14, flexDirection: 'row', gap: 24 },
  infoItem: { flex: 1 },
  infoLabel: { fontSize: 8, color: C.purple, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 },
  infoValue: { fontSize: 11, color: C.purpleDark, fontFamily: 'Helvetica-Bold' },

  body: { paddingHorizontal: 32, paddingTop: 24 },

  // Section headings
  sectionTitle: { fontSize: 13, fontFamily: 'Helvetica-Bold', color: C.gray900, marginBottom: 10, marginTop: 20, borderBottomWidth: 1, borderBottomColor: C.gray100, paddingBottom: 6 },

  // Doc checklist
  docRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: C.gray100 },
  docCheck: { width: 16, height: 16, borderRadius: 4, backgroundColor: C.teal, alignItems: 'center', justifyContent: 'center' },
  docCheckText: { fontSize: 9, color: C.white, fontFamily: 'Helvetica-Bold' },
  docName: { fontSize: 11, color: C.gray900, fontFamily: 'Helvetica-Bold', flex: 1 },
  docSrc: { fontSize: 10, color: C.gray400 },

  // Steps
  step: { flexDirection: 'row', gap: 12, marginBottom: 14 },
  stepNum: { width: 22, height: 22, borderRadius: 11, backgroundColor: C.purple, alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 },
  stepNumText: { fontSize: 10, color: C.white, fontFamily: 'Helvetica-Bold' },
  stepBody: { flex: 1 },
  stepTitle: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: C.gray900, marginBottom: 3 },
  stepDesc: { fontSize: 10, color: C.gray600, lineHeight: 1.5 },
  stepLink: { fontSize: 10, color: C.purple, marginTop: 3 },

  // Field guide table
  fieldRow: { flexDirection: 'row', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: C.gray100 },
  fieldName: { fontSize: 10, color: C.gray600, width: '35%' },
  fieldVal: { fontSize: 10, color: C.gray900, fontFamily: 'Helvetica-Bold', flex: 1 },
  fieldNote: { fontSize: 9, color: C.purple, width: '25%', textAlign: 'right' },

  // Note box
  noteBox: { backgroundColor: C.tealLight, borderRadius: 6, padding: 12, marginTop: 8, marginBottom: 4 },
  noteText: { fontSize: 10, color: '#0F6E56', lineHeight: 1.5 },

  // Warning box
  warnBox: { backgroundColor: '#FEF3C7', borderRadius: 6, padding: 10, marginTop: 6 },
  warnText: { fontSize: 10, color: '#92400E', lineHeight: 1.5 },

  // Footer
  footer: { position: 'absolute', bottom: 20, left: 32, right: 32, flexDirection: 'row', justifyContent: 'space-between' },
  footerText: { fontSize: 9, color: C.gray400 },
})

const INCOME_LABELS = {
  finaid: 'Financial aid / student stipend',
  employment: 'Employment',
  benefits: 'Government benefits',
  unemployment: 'Unemployment insurance',
  zero: 'No income (self-attestation)',
  gig: 'Gig / freelance',
  family: 'Family support',
  alimony: 'Alimony / child support',
}

// Fair Fares now issues OMNY cards — $1.50/ride (50% off $3.00), $17.50 weekly fare cap

function Step({ n, title, desc, link }) {
  return (
    <View style={s.step}>
      <View style={s.stepNum}><Text style={s.stepNumText}>{n}</Text></View>
      <View style={s.stepBody}>
        <Text style={s.stepTitle}>{title}</Text>
        <Text style={s.stepDesc}>{desc}</Text>
        {link && <Link src={link.url} style={s.stepLink}>{link.label} ↗</Link>}
      </View>
    </View>
  )
}

function FieldRow({ label, value, note }) {
  return (
    <View style={s.fieldRow}>
      <Text style={s.fieldName}>{label}</Text>
      <Text style={s.fieldVal}>{value || '—'}</Text>
      {note ? <Text style={s.fieldNote}>{note}</Text> : <Text style={s.fieldNote} />}
    </View>
  )
}

export function buildApplicationGuide(progress) {
  const { application: a = {}, studentType, docs = {}, email } = progress
  const isIntl = studentType === 'international'
  const name = [a.firstName, a.lastName].filter(Boolean).join(' ') || 'Applicant'

  const uploadDocs = isIntl
    ? [
        { name: 'Government-issued photo ID', src: 'Passport (photo page + info page)' },
        { name: 'Proof of NYC address', src: 'Lease or utility bill — first page' },
        { name: 'Proof of income', src: INCOME_LABELS[a.incomeSource] || 'See your collected document' },
        { name: 'I-20 form', src: 'Both pages as a single PDF' },
      ]
    : [
        { name: 'Government-issued photo ID', src: 'State ID or passport (front side)' },
        { name: 'Proof of NYC address', src: 'Lease or utility bill — first page' },
        { name: 'Proof of income', src: INCOME_LABELS[a.incomeSource] || 'See your collected document' },
        { name: 'Social Security Number', src: 'Enter number directly — no card upload' },
      ]

  return (
    <Document title="Qualift — Fair Fares Application Guide" author="Qualift">
      <Page size="A4" style={s.page}>

        {/* Header */}
        <View style={s.header}>
          <Text style={s.headerTitle}>Qualift</Text>
          <Text style={s.headerSub}>Your personal Fair Fares application guide</Text>
        </View>

        {/* Info bar */}
        <View style={s.infoBar}>
          <View style={s.infoItem}>
            <Text style={s.infoLabel}>Prepared for</Text>
            <Text style={s.infoValue}>{name}</Text>
          </View>
          <View style={s.infoItem}>
            <Text style={s.infoLabel}>Applicant type</Text>
            <Text style={s.infoValue}>{isIntl ? 'International student (F-1)' : 'NYC resident'}</Text>
          </View>
          <View style={s.infoItem}>
            <Text style={s.infoLabel}>Your discount</Text>
            <Text style={s.infoValue}>OMNY — $1.50/ride (50% off)</Text>
          </View>
        </View>

        <View style={s.body}>

          {/* Note */}
          <View style={s.noteBox}>
            <Text style={s.noteText}>
              This guide walks you through the complete Fair Fares application on your phone — from creating your HRA ACCESS account to submitting your documents. Keep this PDF open while you apply. Everything is pre-filled with your information.
            </Text>
          </View>

          {/* Part 1 — Create account */}
          <Text style={s.sectionTitle}>PART 1 — Create your HRA ACCESS account</Text>
          <Step n={1} title="Open HRA ACCESS on your phone" desc="Go to a069-access.nyc.gov in your browser. Tap 'Apply Now' on the home screen. The site works on any mobile browser — Chrome or Safari recommended." link={{ label: 'Open HRA ACCESS', url: 'https://a069-access.nyc.gov/accesshra/' }} />
          <Step n={2} title="Tap 'Create Account'" desc="On the login page, tap 'Create Account' at the bottom. Do not use a social login — create a new HRA account directly." />
          <Step n={3} title="Enter your basic info" desc={`Use the exact name on your government ID: ${name || '[your legal name]'}. For email, use the one you have access to on your phone.`} />
          <Step n={4} title="Verify your email" desc="HRA will send a verification code to your email. Open your email app, copy the code, and paste it back into HRA ACCESS. Check spam if it doesn't arrive within 2 minutes." />
          <Step n={5} title="Set a strong password and save it" desc="Use a password manager (iPhone Keychain, Google Password Manager) to save it — you'll need it for future logins and to check your application status." />

          {/* Part 2 — Start application */}
          <Text style={s.sectionTitle}>PART 2 — Start the Fair Fares application</Text>
          <Step n={6} title="Go to the Fair Fares portal and tap 'Apply Now'" desc="From nyc.gov/accessfairfares, log in and tap 'Apply Now' on the Fair Fares homepage. If asked to connect an HRA case and you've never received benefits, tap 'Skip'." />
          <Step n={7} title="Choose where your discount applies" desc="Select 'Subways and eligible buses' — you'll receive an OMNY card with the 50% discount ($1.50 per ride, $17.50 weekly fare cap). Access-A-Ride users can choose that instead." />

          {/* Part 3 — Fill the form */}
          <Text style={s.sectionTitle}>PART 3 — Fill in your information</Text>
          <Text style={{ fontSize: 10, color: C.gray600, marginBottom: 10 }}>Use these exact values — they match your collected documents.</Text>

          {/* Personal info */}
          <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold', color: C.gray400, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Personal information</Text>
          <FieldRow label="Legal first name" value={a.firstName} note="As on your ID" />
          <FieldRow label="Legal last name" value={a.lastName} note="As on your ID" />
          <FieldRow label="Date of birth" value={a.dob} note="MM/DD/YYYY" />
          <FieldRow label="SSN / ITIN" value={a.ssn || (isIntl ? 'Leave blank (F-1)' : '— required')} />
          <FieldRow label="Phone number" value={a.phone} />
          <FieldRow label="Email" value={a.email || email} />

          {/* Address */}
          <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold', color: C.gray400, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4, marginTop: 12 }}>NYC Address</Text>
          <FieldRow label="Street address" value={a.address} note="From lease" />
          <FieldRow label="Borough" value={a.borough} />
          <FieldRow label="Zip code" value={a.zip} note="From lease" />
          <FieldRow label="Time at address" value={a.lengthAtAddress === 'lt3' ? 'Less than 3 months' : a.lengthAtAddress === '3to12' ? '3–12 months' : 'More than 1 year'} />

        </View>

        {/* Footer */}
        <View style={s.footer} fixed>
          <Text style={s.footerText}>Qualift — Fair Fares Application Guide</Text>
          <Text style={s.footerText} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
        </View>
      </Page>

      {/* Page 2 */}
      <Page size="A4" style={s.page}>
        <View style={s.body}>

          {/* Immigration (intl only) */}
          {isIntl && (
            <>
              <Text style={s.sectionTitle}>Immigration & student status</Text>
              <View style={s.warnBox}>
                <Text style={s.warnText}>Fair Fares does not trigger public charge. Applying will not affect your visa status or future immigration applications.</Text>
              </View>
              <FieldRow label="Visa type" value={a.visaType || 'F-1'} />
              <FieldRow label="SEVIS ID" value={a.sevisId} note="I-20 top right" />
              <FieldRow label="Program end date" value={a.programEndDate} note="I-20 field 5" />
              <FieldRow label="School name" value={a.school} />
            </>
          )}

          {/* Income */}
          <Text style={s.sectionTitle}>Income information</Text>
          <FieldRow label="Income source" value={INCOME_LABELS[a.incomeSource] || a.incomeSource} />
          <FieldRow label="Monthly gross income" value={a.monthlyIncome} note="Before taxes" />
          <FieldRow label="Annual household income" value={a.annualIncome ? `$${parseInt(a.annualIncome).toLocaleString()}` : null} note="≤ 200% FPL" />
          <FieldRow label="Household size" value={a.householdSize ? `${a.householdSize} ${a.householdSize == 1 ? 'person' : 'people'}` : null} />

          {/* Part 4 — Upload docs */}
          <Text style={s.sectionTitle}>PART 4 — Upload your documents</Text>
          <Step n={8} title="Tap 'Upload Documents' in the application" desc="After filling the form fields, HRA will prompt you to upload supporting documents. Tap 'Add Document' for each one below." />
          <Step n={9} title="Use your phone's camera to scan each document" desc="Tap the upload button → choose 'Camera' → photograph each document clearly in good lighting. PDFs are preferred — use your Files app to attach pre-saved PDFs." />

          {uploadDocs.map((doc, i) => (
            <View key={i} style={s.docRow}>
              <View style={s.docCheck}><Text style={s.docCheckText}>✓</Text></View>
              <Text style={s.docName}>{doc.name}</Text>
              <Text style={s.docSrc}>{doc.src}</Text>
            </View>
          ))}

          {/* Part 5 — Submit */}
          <Text style={s.sectionTitle}>PART 5 — Review and submit</Text>
          <Step n={10} title="Review every section before submitting" desc="Scroll back through the form. Check that your name, address, and income exactly match your uploaded documents. Mismatches are the #1 reason for delays." />
          <Step n={11} title="Tap 'Submit Application'" desc="Once submitted, you'll receive a confirmation number. Screenshot it — you'll need it to check your status." />
          <Step n={12} title="Check your application status" desc="Log back into HRA ACCESS anytime to see your status. Processing takes 30–45 days. You may receive a call from an HRA caseworker — answer calls from unknown numbers during this period." />

          {/* After submission */}
          <View style={s.noteBox}>
            <Text style={s.noteText}>
              {'After approval, your Fair Fares OMNY card will be mailed to your address. Tap it at any subway turnstile or bus reader — the 50% discount is automatic. Register your card at omny.info to reload it and track free-ride progress.\n\nQuestions? Call HRA at 718-557-1399 (Mon–Fri, 8am–5pm) or OMNY at 877-789-6669.'}
            </Text>
          </View>

          <View style={[s.warnBox, { marginTop: 16 }]}>
            <Text style={s.warnText}>Qualift is not affiliated with HRA or the MTA. This guide is for informational purposes only. Always verify requirements directly with HRA before submitting.</Text>
          </View>

        </View>

        <View style={s.footer} fixed>
          <Text style={s.footerText}>Qualift — Fair Fares Application Guide</Text>
          <Text style={s.footerText} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
        </View>
      </Page>
    </Document>
  )
}
