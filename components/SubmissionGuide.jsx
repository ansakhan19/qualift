'use client'
import { useState } from 'react'
import { useProgress } from '@/store/ProgressContext'

const INCOME_LABELS = {
  finaid: 'Financial aid / student stipend',
  employment: 'Employment',
  benefits: 'Government benefits',
  unemployment: 'Unemployment insurance',
  zero: 'No income (self-attestation)',
  gig: 'Gig / freelance work',
  family: 'Family support',
  alimony: 'Alimony / child support',
}

// Fair Fares now issues OMNY cards — $1.50/ride (50% off $3.00), weekly cap $17.50

function Section({ title, rows }) {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-200">
        <p className="text-xs font-medium tracking-wide text-gray-400">{title}</p>
      </div>
      {rows.map(([field, answer, ref]) => (
        <div key={field} className="flex justify-between items-start px-4 py-2.5 border-b border-gray-50 last:border-0 gap-4">
          <span className="text-xs text-gray-500 flex-1 leading-relaxed">{field}</span>
          <div className="text-right flex-1">
            <p className="text-xs font-medium text-gray-900">{answer || <span className="text-gray-300 italic">not filled</span>}</p>
            {ref && <p className="text-xs text-purple-500 mt-0.5">{ref}</p>}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function SubmissionGuide() {
  const { progress } = useProgress()
  const { application: a, studentType, docs } = progress
  const isIntl = studentType === 'international'
  const [sendState, setSendState] = useState('idle') // 'idle'|'sending'|'sent'|'error'

  async function handleSendGuide() {
    const email = progress.email || a?.email
    if (!email) return
    setSendState('sending')
    try {
      const res = await fetch('/api/send-guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, progress }),
      })
      const data = await res.json()
      setSendState(data.ok ? 'sent' : 'error')
    } catch {
      setSendState('error')
    }
  }

  const uploadDocs = isIntl
    ? [
        ['1 — Proof of identity', 'Passport', 'Upload both photo page + info page'],
        ['2 — Proof of address', 'Lease / utility bill', 'First page, must show your name'],
        ['3 — Proof of income', INCOME_LABELS[a?.incomeSource] || 'See your documents', 'Full document — all pages'],
        ['4 — I-20 form', 'I-20 (both pages)', 'Single PDF, both sides'],
      ]
    : [
        ['1 — Proof of identity', 'State ID / passport', 'Upload the front side clearly'],
        ['2 — Proof of address', 'Lease / utility bill', 'First page, must show your name'],
        ['3 — Proof of income', INCOME_LABELS[a?.incomeSource] || 'See your documents', 'Full document — all pages'],
        ['4 — Social Security Number', 'Provide your SSN number in the field', 'No card upload required'],
      ]

  return (
    <div className="fade-in pb-8">
      {/* Header */}
      <div className="bg-teal-50 border-b border-teal-100 px-5 py-5">
        <div className="flex items-start gap-3">
          <i className="ti ti-file-check text-teal-600 text-2xl flex-shrink-0 mt-0.5" />
          <div>
            <h2 className="text-base font-medium text-teal-900 mb-1">Your Fair Fares application guide</h2>
            <p className="text-xs text-teal-700 leading-relaxed">
              Use this as your reference when filling out the form on HRA ACCESS.
              Each field is listed in the order it appears on the form.
            </p>
          </div>
        </div>
      </div>

      <div className="px-5 py-5 flex flex-col gap-4">
        <Section title="PERSONAL INFORMATION" rows={[
          ['Legal first name', a?.firstName],
          ['Legal last name', a?.lastName],
          ['Date of birth', a?.dob],
          ['SSN / ITIN', a?.ssn || (isIntl ? 'Leave blank (F-1 visa)' : '— required')],
          ['Phone', a?.phone],
          ['Email', a?.email],
        ]} />

        <Section title="NYC ADDRESS" rows={[
          ['Street address', a?.address, 'From your lease'],
          ['Borough', a?.borough],
          ['Zip code', a?.zip, 'From your lease'],
        ]} />

        <Section title="INCOME" rows={[
          ['Income source', INCOME_LABELS[a?.incomeSource] || a?.incomeSource],
          ['Annual household income', a?.annualIncome ? `$${parseInt(a.annualIncome).toLocaleString()}` : null, 'Before taxes — must match your document'],
          ['Household size', a?.householdSize ? `${a.householdSize} ${a.householdSize == 1 ? 'person' : 'people'}` : null, "Roommates don't count"],
        ]} />

        <Section title="YOUR DISCOUNT (OMNY)" rows={[
          ['Per ride', '$1.50 (normally $3.00)'],
          ['Weekly fare cap', '$17.50 — after 12 paid rides in 7 days, the rest is free'],
          ['Card', 'OMNY card mailed to you after approval'],
        ]} />

        <Section title="DOCUMENTS TO UPLOAD" rows={uploadDocs} />

        {/* Email guide button */}
        {(progress.email || a?.email) && (
          <button
            onClick={handleSendGuide}
            disabled={sendState === 'sending' || sendState === 'sent'}
            className={`flex items-center justify-center gap-2 w-full rounded-xl py-3.5 text-sm font-medium transition-colors ${
              sendState === 'sent'
                ? 'bg-teal-50 text-teal-700 border border-teal-200 cursor-default'
                : sendState === 'error'
                ? 'bg-coral-50 text-coral-700 border border-coral-200'
                : 'bg-purple-400 hover:bg-purple-600 text-white'
            }`}
          >
            <i className={`ti ${sendState === 'sent' ? 'ti-check' : sendState === 'sending' ? 'ti-loader animate-spin' : 'ti-mail'}`} />
            {sendState === 'sent'
              ? `Guide sent to ${progress.email || a?.email}`
              : sendState === 'sending'
              ? 'Generating your guide…'
              : sendState === 'error'
              ? 'Failed — tap to retry'
              : 'Email me this guide as a PDF'}
          </button>
        )}

        {/* HRA link */}
        <a
          href="https://a069-access.nyc.gov/accesshra/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-teal-600 hover:bg-teal-800 text-white rounded-xl py-3.5 text-sm font-medium transition-colors"
        >
          <i className="ti ti-external-link" />
          Open HRA ACCESS to apply
        </a>

        <p className="text-xs text-gray-400 text-center leading-relaxed">
          Qualift is not affiliated with HRA or the MTA. This guide is for reference only.
          Always verify information directly with HRA.
        </p>
      </div>
    </div>
  )
}
