'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useProgress } from '@/store/ProgressContext'

/**
 * Application guide — mirrors the real ACCESS HRA Fair Fares application
 * (per the official ACCESS HRA User Guide, 2026).
 *
 * Design: two panels.
 *  LEFT  — "The real screen": a mockup of what ACCESS HRA shows at this step.
 *  RIGHT — "Your cheat sheet": your answers, ready to copy into the real form.
 * On mobile the panels stack. One place to edit, one place to look.
 */

// ── Copy-able answer row ─────────────────────────────────────────

function AnswerRow({ label, value, onChange, placeholder, tip, refNote, type = 'text' }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    if (!value) return
    try {
      await navigator.clipboard.writeText(String(value))
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {}
  }

  return (
    <div className="border border-gray-200 rounded-xl p-3.5 bg-white">
      <p className="text-xs font-medium text-gray-700 tracking-wide mb-1.5">{label}</p>
      <div className="flex gap-2">
        <input
          type={type}
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className={`flex-1 border rounded-lg px-3 py-2.5 text-sm outline-none transition-colors ${
            value ? 'bg-purple-50 border-purple-200 text-purple-900' : 'bg-gray-50 border-gray-200 text-gray-900'
          } focus:border-purple-400`}
        />
        <button
          onClick={copy}
          disabled={!value}
          title="Copy to clipboard"
          className={`px-3 rounded-lg border text-sm font-medium transition-colors flex items-center gap-1 ${
            copied
              ? 'bg-teal-50 border-teal-400 text-teal-700'
              : value
              ? 'bg-white border-gray-200 text-purple-600 hover:border-purple-300'
              : 'bg-gray-50 border-gray-200 text-gray-300 cursor-not-allowed'
          }`}
        >
          <i className={`ti ${copied ? 'ti-check' : 'ti-copy'}`} />
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      {tip && <p className="text-xs text-purple-700 mt-2 leading-relaxed bg-purple-50 rounded-lg px-2.5 py-1.5">{tip}</p>}
      {refNote && <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1"><i className="ti ti-file-text text-purple-400" />{refNote}</p>}
    </div>
  )
}

function ChoiceRow({ label, value, onChange, options, tip }) {
  return (
    <div className="border border-gray-200 rounded-xl p-3.5 bg-white">
      <p className="text-xs font-medium text-gray-700 tracking-wide mb-2">{label}</p>
      <div className="flex flex-col gap-2">
        {options.map(o => (
          <button key={o.value} onClick={() => onChange(o.value)}
            className={`text-left flex items-start gap-2.5 border rounded-lg px-3 py-2.5 transition-all ${value === o.value ? 'border-purple-400 bg-purple-50' : 'border-gray-200 bg-gray-50 hover:border-purple-200'}`}>
            <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5 ${value === o.value ? 'border-purple-400 bg-purple-400' : 'border-gray-300'}`} />
            <div>
              <p className="text-sm font-medium text-gray-900">{o.label}</p>
              {o.sub && <p className="text-xs text-gray-500 mt-0.5">{o.sub}</p>}
            </div>
          </button>
        ))}
      </div>
      {tip && <p className="text-xs text-purple-700 mt-2 leading-relaxed bg-purple-50 rounded-lg px-2.5 py-1.5">{tip}</p>}
    </div>
  )
}

function SelectRow({ label, value, onChange, options, tip }) {
  return (
    <div className="border border-gray-200 rounded-xl p-3.5 bg-white">
      <p className="text-xs font-medium text-gray-700 tracking-wide mb-1.5">{label}</p>
      <select value={value || ''} onChange={e => onChange(e.target.value)}
        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 bg-white outline-none focus:border-purple-400">
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {tip && <p className="text-xs text-purple-700 mt-2 leading-relaxed bg-purple-50 rounded-lg px-2.5 py-1.5">{tip}</p>}
    </div>
  )
}

// ── "The real screen" mockup ─────────────────────────────────────

function ScreenMock({ title, children }) {
  return (
    <div className="rounded-xl overflow-hidden border border-gray-300 shadow-sm">
      <div className="bg-gray-100 border-b border-gray-200 px-3 py-2 flex items-center gap-2">
        <div className="flex gap-1">
          <span className="w-2 h-2 rounded-full bg-gray-300" />
          <span className="w-2 h-2 rounded-full bg-gray-300" />
          <span className="w-2 h-2 rounded-full bg-gray-300" />
        </div>
        <div className="flex-1 bg-white rounded-md px-2 py-0.5 text-xs text-gray-400 truncate">
          a069-access.nyc.gov/accesshra/fairfares
        </div>
      </div>
      <div className="bg-[#1a3c6e] px-3 py-2 flex items-center justify-between">
        <span className="text-white text-xs font-semibold tracking-wide">ACCESS HRA</span>
        <span className="text-white/70 text-xs">Fair Fares NYC</span>
      </div>
      <div className="bg-white p-4">
        <p className="text-sm font-semibold text-gray-800 mb-3">{title}</p>
        {children}
      </div>
    </div>
  )
}

function MockField({ label, value, hint }) {
  return (
    <div className="mb-3">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <div className={`border rounded-lg px-3 py-2 text-sm ${value ? 'border-teal-400 bg-teal-50 text-gray-900' : 'border-gray-300 bg-gray-50 text-gray-400'}`}>
        {value || hint || '…'}
      </div>
    </div>
  )
}

function InfoCard({ tone = 'gray', title, children }) {
  const tones = {
    gray:   'bg-gray-50 border-gray-200',
    purple: 'bg-purple-50 border-purple-100',
    teal:   'bg-teal-50 border-teal-100',
    coral:  'bg-coral-50 border-coral-100',
  }
  return (
    <div className={`border rounded-xl p-4 ${tones[tone]}`}>
      {title && <p className="text-sm font-medium text-gray-900 mb-2">{title}</p>}
      {children}
    </div>
  )
}

// ── Main component ───────────────────────────────────────────────

export default function AppWalkthrough() {
  const { progress, updateApplication, advanceStage } = useProgress()
  const router  = useRouter()
  const isIntl  = progress.studentType === 'international'
  const app     = progress.application || {}
  const u       = updateApplication

  const [step, setStep] = useState(0)

  // ── Sections: mock (left) + guide (right) ──
  const sections = [
    {
      title: 'Create your ACCESS HRA account',
      mock: (
        <ScreenMock title="Create Account — ACCESS HRA">
          <MockField label="Email or username" value={app.email} hint="you@email.com" />
          <MockField label="Password" hint="Choose a password" />
          <MockField label="Security question" hint="Pick one about yourself" />
        </ScreenMock>
      ),
      guide: (
        <>
          <InfoCard title="Steps on the real site">
            <ol className="text-sm text-gray-500 leading-relaxed list-decimal ml-4 flex flex-col gap-1.5">
              <li>Go to <strong className="text-gray-800">nyc.gov/accessfairfares</strong></li>
              <li>Click <strong className="text-gray-800">"Create Account"</strong></li>
              <li>Asked to connect an HRA case? Never received benefits → click <strong className="text-gray-800">"Skip"</strong></li>
              <li>On the Fair Fares homepage, click <strong className="text-gray-800">"Apply Now"</strong></li>
            </ol>
          </InfoCard>
          <AnswerRow label="EMAIL FOR YOUR ACCOUNT" value={app.email} onChange={v => u({ email: v })}
            placeholder="you@email.com" type="email"
            tip="Use an email you check often — HRA sends application updates here." />
        </>
      ),
    },
    {
      title: 'Personal information & age',
      mock: (
        <ScreenMock title="Tell us about yourself">
          <MockField label="Legal first name" value={app.firstName} />
          <MockField label="Legal last name" value={app.lastName} />
          <MockField label="Date of birth" value={app.dob} hint="MM/DD/YYYY" />
          <MockField label="Social Security Number (optional)" value={app.ssn} hint="May be left blank" />
        </ScreenMock>
      ),
      guide: (
        <>
          <AnswerRow label="LEGAL FIRST NAME" value={app.firstName} onChange={v => u({ firstName: v })}
            placeholder="e.g. Maria" tip="Must match your passport, state ID, or IDNYC exactly." />
          <AnswerRow label="LEGAL LAST NAME" value={app.lastName} onChange={v => u({ lastName: v })}
            placeholder="e.g. Santos" />
          <AnswerRow label="DATE OF BIRTH" value={app.dob} onChange={v => u({ dob: v })}
            placeholder="MM/DD/YYYY" tip="You must be 18 through 64 to qualify." />
          <AnswerRow label="SSN OR ITIN (OPTIONAL)" value={app.ssn} onChange={v => u({ ssn: v })}
            placeholder="XXX-XX-XXXX or leave blank"
            tip="Fair Fares does not trigger public charge and is open regardless of immigration status." />
        </>
      ),
    },
    {
      title: 'Residence & mailing address',
      mock: (
        <ScreenMock title="Where do you live?">
          <MockField label="Residence address" value={app.address} hint="123 Main St, Apt 2A" />
          <MockField label="Borough" value={app.borough} />
          <MockField label="ZIP code" value={app.zip} />
          <MockField label="Mailing address" value={app.mailingSame !== 'false' ? 'Same as residence ✓' : 'Different address'} />
        </ScreenMock>
      ),
      guide: (
        <>
          <AnswerRow label="STREET ADDRESS" value={app.address} onChange={v => u({ address: v })}
            placeholder="123 Main St, Apt 2A"
            tip="Must match your proof-of-address document exactly." refNote="From: lease or utility bill" />
          <SelectRow label="BOROUGH" value={app.borough} onChange={v => u({ borough: v })} options={[
            { value: '', label: 'Select borough…' },
            { value: 'Brooklyn', label: 'Brooklyn' },
            { value: 'Manhattan', label: 'Manhattan' },
            { value: 'Queens', label: 'Queens' },
            { value: 'Bronx', label: 'Bronx' },
            { value: 'Staten Island', label: 'Staten Island' },
          ]} />
          <AnswerRow label="ZIP CODE" value={app.zip} onChange={v => u({ zip: v })} placeholder="10001" />
          <ChoiceRow label="MAILING ADDRESS" value={String(app.mailingSame ?? 'true')} onChange={v => u({ mailingSame: v })}
            options={[
              { value: 'true', label: 'Same as residence', sub: 'Your OMNY card is mailed here' },
              { value: 'false', label: 'Different mailing address', sub: "You'll enter it on the real form" },
            ]}
            tip="Make sure you can receive mail there — your Fair Fares OMNY card arrives by mail." />
        </>
      ),
    },
    {
      title: 'Contact information',
      mock: (
        <ScreenMock title="How can we contact you?">
          <MockField label="Phone number" value={app.phone} hint="(212) 555-0100" />
          <MockField label="Email address" value={app.email} hint="you@email.com" />
        </ScreenMock>
      ),
      guide: (
        <>
          <AnswerRow label="PHONE NUMBER" value={app.phone} onChange={v => u({ phone: v })}
            placeholder="(212) 555-0100" type="tel"
            tip="HRA may call or text about your application — answer unknown numbers while it's under review." />
          <AnswerRow label="EMAIL ADDRESS" value={app.email} onChange={v => u({ email: v })}
            placeholder="you@email.com" type="email" refNote="Status updates and e-notices arrive here" />
        </>
      ),
    },
    {
      title: 'Identity verification',
      mock: (
        <ScreenMock title="Confirm your information">
          <p className="text-xs text-gray-600 leading-relaxed mb-3">
            "Would you like to use an authentication service to verify your identity, age and address?"
          </p>
          <div className="border border-teal-400 bg-teal-50 rounded-lg px-3 py-2 text-sm text-gray-900 mb-2">◉ Yes — verify me electronically</div>
          <div className="border border-gray-300 bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-400">○ No — I'll upload documents instead</div>
        </ScreenMock>
      ),
      guide: (
        <>
          <InfoCard tone="purple" title="Answer YES if you can">
            <p className="text-sm text-gray-600 leading-relaxed">
              Successful electronic verification means <strong>fewer documents to upload</strong> — often just proof of income.
              With an <strong>IDNYC card number</strong> it verifies identity, age, AND address instantly. No IDNYC? The portal can verify via your cell phone number.
            </p>
          </InfoCard>
          <ChoiceRow label="DO YOU HAVE AN IDNYC CARD?" value={app.hasIdnyc || ''} onChange={v => u({ hasIdnyc: v })}
            options={[
              { value: 'yes', label: 'Yes — I have IDNYC', sub: 'Have your card number ready (front of card)' },
              { value: 'no', label: 'No IDNYC', sub: 'Choose phone verification, or upload documents' },
            ]} />
        </>
      ),
    },
    {
      title: 'Household & income',
      mock: (
        <ScreenMock title="Household income">
          <MockField label="Household size" value={app.householdSize ? String(app.householdSize) : ''} />
          <MockField label="Annual household income (before taxes)"
            value={app.annualIncome ? `$${parseInt(app.annualIncome).toLocaleString()}` : ''} />
          <MockField label="Do you receive SNAP or Cash Assistance?" value={app.hasHRABenefits === true ? 'Yes' : app.hasHRABenefits === false ? 'No' : ''} />
        </ScreenMock>
      ),
      guide: (
        <>
          <SelectRow label="HOUSEHOLD SIZE" value={String(app.householdSize || '')} onChange={v => u({ householdSize: v })}
            options={[
              { value: '', label: 'Select…' },
              { value: '1', label: '1 — Just me' },
              { value: '2', label: '2 people' },
              { value: '3', label: '3 people' },
              { value: '4', label: '4 people' },
              { value: '5', label: '5 or more people' },
            ]}
            tip="Roommates who are not related to you and not your dependents do NOT count." />
          <AnswerRow label="ANNUAL HOUSEHOLD INCOME (BEFORE TAXES)"
            value={app.annualIncome ? `$${parseInt(app.annualIncome).toLocaleString()}` : ''}
            onChange={v => u({ annualIncome: v.replace(/[^0-9]/g, '') })}
            placeholder="$0"
            tip="Must be at or below 200% of the Federal Poverty Level. Don't include roommates' income."
            refNote="Must match the income document you upload" />
          <ChoiceRow label="DO YOU RECEIVE SNAP OR CASH ASSISTANCE?" value={String(app.hasHRABenefits)} onChange={v => u({ hasHRABenefits: v === 'true' })}
            options={[
              { value: 'false', label: 'No' },
              { value: 'true', label: 'Yes', sub: 'Your income is already verified — look for the fast-track "Enroll Now" alert' },
            ]} />
        </>
      ),
    },
    ...(isIntl ? [{
      title: 'For international students',
      mock: (
        <ScreenMock title="Good news — no visa questions">
          <p className="text-xs text-gray-600 leading-relaxed">
            The real application never asks your visa type or SEVIS ID. Fair Fares is open regardless of immigration status.
          </p>
        </ScreenMock>
      ),
      guide: (
        <>
          <InfoCard tone="teal" title="Your documents, used as proof">
            <ul className="text-sm text-gray-500 leading-relaxed flex flex-col gap-1.5 list-disc ml-4">
              <li><strong>Identity:</strong> your passport (or IDNYC)</li>
              <li><strong>NYC address:</strong> lease, utility bill, or bank statement</li>
              <li><strong>Income:</strong> financial aid letter, stipend letter, or pay stubs</li>
            </ul>
          </InfoCard>
          <InfoCard tone="purple">
            <p className="text-xs text-purple-800 leading-relaxed">
              <strong>Public charge:</strong> Fair Fares is a city transit discount, not a federal benefit — it does not affect visa renewals or future immigration applications.
            </p>
          </InfoCard>
        </>
      ),
    }] : []),
    {
      title: 'Submit & upload documents',
      mock: (
        <ScreenMock title="Confirmation — Application Submitted">
          <div className="bg-teal-50 border border-teal-400 rounded-lg px-3 py-2 mb-3">
            <p className="text-sm font-medium text-teal-800">✓ Your application has been submitted</p>
            <p className="text-xs text-teal-700 mt-0.5">Application ID: FF-XXXXXXXX</p>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed mb-2">"Would you like to see your required documents?"</p>
          <div className="border border-teal-400 bg-teal-50 rounded-lg px-3 py-2 text-sm text-gray-900">◉ YES, see my required documents</div>
        </ScreenMock>
      ),
      guide: (
        <>
          <InfoCard title="What happens next">
            <ol className="text-sm text-gray-500 leading-relaxed list-decimal ml-4 flex flex-col gap-1.5">
              <li><strong className="text-gray-800">Write down your Application ID</strong> from the confirmation page</li>
              <li>Click "YES, see my required documents"</li>
              <li>Upload documents with the <strong className="text-gray-800">ACCESS HRA Mobile app</strong> — uploads only work through the app</li>
              <li>Upload within <strong className="text-gray-800">10 calendar days</strong> — your Qualift documents are exactly what's needed</li>
              <li>Decision in ~30 days; your OMNY card arrives by mail</li>
            </ol>
          </InfoCard>
          <InfoCard tone="coral">
            <p className="text-xs text-coral-800 leading-relaxed">
              <strong>Don't miss the 10-day window.</strong> Applications without documents are denied automatically. Upload the same day you apply.
            </p>
          </InfoCard>
        </>
      ),
    },
  ]

  const total = sections.length
  const section = sections[step]

  function next() {
    if (step < total - 1) { setStep(s => s + 1); window.scrollTo(0, 0) }
    else { advanceStage(8); router.push('/guide') }
  }
  function back() {
    if (step > 0) { setStep(s => s - 1); window.scrollTo(0, 0) }
  }

  return (
    <div className="fade-in flex flex-col min-h-screen">
      {/* Stepper */}
      <div className="px-5 py-4 border-b border-gray-100 bg-white sticky top-0 z-10">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-gray-900">{section.title}</p>
          <span className="text-xs font-medium text-purple-600">Step {step + 1} of {total}</span>
        </div>
        <div className="flex gap-1.5">
          {sections.map((s, i) => (
            <button key={i} onClick={() => { setStep(i); window.scrollTo(0, 0) }} title={s.title}
              className={`h-1.5 rounded-full flex-1 transition-colors ${i < step ? 'bg-purple-400' : i === step ? 'bg-purple-600' : 'bg-gray-200 hover:bg-gray-300'}`} />
          ))}
        </div>
      </div>

      {/* Two panels: the real screen | your cheat sheet */}
      <div className="flex-1 px-5 py-5 grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] gap-6 items-start">
        <div className="lg:sticky lg:top-24">
          <p className="text-xs font-semibold tracking-wide text-gray-400 mb-2">WHAT THE REAL SCREEN LOOKS LIKE</p>
          {section.mock}
        </div>
        <div>
          <p className="text-xs font-semibold tracking-wide text-gray-400 mb-2">YOUR CHEAT SHEET — EDIT & COPY</p>
          <div className="flex flex-col gap-3">
            {section.guide}
          </div>
        </div>
      </div>

      {/* Nav */}
      <div className="sticky bottom-0 bg-white border-t border-gray-100 px-5 py-4 flex gap-3">
        {step > 0 && (
          <button onClick={back}
            className="flex-1 lg:flex-none lg:px-8 border border-gray-200 rounded-xl py-3 text-sm text-gray-500 font-medium hover:border-purple-300 hover:text-purple-600 transition-colors">
            ← Back
          </button>
        )}
        <button onClick={next}
          className="flex-1 bg-purple-400 hover:bg-purple-600 text-white rounded-xl py-3 text-sm font-medium transition-colors">
          {step === total - 1 ? 'Finish — get my PDF guide →' : 'Next step →'}
        </button>
      </div>
    </div>
  )
}
