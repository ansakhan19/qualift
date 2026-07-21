'use client'
import { useRouter } from 'next/navigation'
import { useProgress } from '@/store/ProgressContext'

const INTL_DOCS  = [
  { key: 'id',     label: 'Government-issued photo ID', src: 'Passport' },
  { key: 'addr',   label: 'Proof of NYC address',       src: 'Lease / utility bill' },
  { key: 'income', label: 'Proof of income',            src: 'Award letter / pay stubs' },
  { key: 'i20',    label: 'I-20 form',                  src: 'University DSO' },
]
const DOM_DOCS = [
  { key: 'd_id',    label: 'Government-issued photo ID', src: 'State ID / passport' },
  { key: 'd_addr',  label: 'Proof of NYC address',       src: 'Lease / utility bill' },
  { key: 'd_income',label: 'Proof of income',            src: 'Pay stubs / award letter' },
  { key: 'd_ssn',   label: 'Social Security Number',     src: 'SSN card / SSA letter' },
]

export default function ReadinessReview() {
  const { progress, advanceStage } = useProgress()
  const router = useRouter()
  const isIntl = progress.studentType === 'international'
  const docs   = isIntl ? INTL_DOCS : DOM_DOCS

  function handleProceed() {
    advanceStage(7)
    router.push('/walkthrough')
  }

  return (
    <div className="fade-in pb-8">
      {/* Hero */}
      <div className="px-5 pt-8 pb-5 text-center">
        <div className="w-16 h-16 rounded-full bg-teal-50 border-2 border-teal-400 flex items-center justify-center text-teal-700 text-3xl mx-auto mb-4">
          <i className="ti ti-check" />
        </div>
        <h1 className="text-xl font-medium text-gray-900 mb-2">You're ready to apply</h1>
        <p className="text-sm text-gray-500 leading-relaxed">
          All documents collected and eligibility confirmed. Here's your full readiness summary.
        </p>
      </div>

      {/* Summary card */}
      <div className="mx-5 border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
          <p className="text-xs font-medium tracking-wide text-gray-400">YOUR PROFILE</p>
        </div>
        <div className="px-4 py-3 border-b border-gray-100">
          {[
            ['Student type', isIntl ? 'International · F-1 visa' : 'NYC resident'],
            ['NYC resident', '✓ Confirmed'],
            ['Eligibility', '✓ ≤ 100% FPL · Qualified'],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between py-1.5 text-sm">
              <span className="text-gray-500">{k}</span>
              <span className="font-medium text-gray-900">{v}</span>
            </div>
          ))}
        </div>

        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
          <p className="text-xs font-medium tracking-wide text-gray-400">DOCUMENTS COLLECTED — {docs.length} of {docs.length}</p>
        </div>
        <div className="px-4">
          {docs.map(doc => (
            <div key={doc.key} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
              <div className="w-7 h-7 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 flex-shrink-0">
                <i className="ti ti-check text-sm" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{doc.label}</p>
                <p className="text-xs text-gray-400">{doc.src}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="px-4 py-3 bg-gray-50">
          <p className="text-xs text-gray-500 leading-relaxed">
            <strong>What happens next:</strong> We'll walk you through every field of the HRA Fair Fares application with your answers pre-loaded where possible. Takes about 5 minutes.
          </p>
        </div>
      </div>

      <div className="px-5 mt-4">
        <button onClick={handleProceed}
          className="w-full bg-purple-400 hover:bg-purple-600 text-white rounded-xl py-3.5 text-sm font-medium transition-colors">
          Start application walkthrough →
        </button>
      </div>
    </div>
  )
}
