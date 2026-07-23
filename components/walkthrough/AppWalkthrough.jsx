'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useProgress } from '@/store/ProgressContext'

/**
 * Mirrors the real ACCESS HRA Fair Fares application flow, based on the
 * official ACCESS HRA User Guide (nyc.gov/accesshra, 2026 edition).
 * Sections follow what HRA actually asks: age/personal info, residence &
 * mailing address, contact info, identity verification, household income —
 * then submission + document upload via the ACCESS HRA mobile app.
 */

// ── UI primitives ────────────────────────────────────────────────

function Field({ label, annotation, children, refNote }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-gray-700 tracking-wide">{label}</label>
      {annotation && (
        <div className="bg-purple-50 border border-purple-100 rounded-lg px-3 py-2 text-xs text-purple-800 leading-relaxed">
          {annotation}
        </div>
      )}
      {children}
      {refNote && <p className="text-xs text-gray-400 flex items-center gap-1"><i className="ti ti-file-text text-purple-400" />{refNote}</p>}
    </div>
  )
}

function Input({ value, onChange, placeholder, type = 'text', prefilled }) {
  return (
    <input
      type={type} value={value || ''} onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full border rounded-xl px-4 py-3 text-sm outline-none transition-colors ${
        prefilled
          ? 'bg-purple-50 border-purple-200 text-purple-900 focus:border-purple-400'
          : 'bg-white border-gray-200 text-gray-900 focus:border-purple-400'
      }`}
    />
  )
}

function Select({ value, onChange, options }) {
  return (
    <select value={value || ''} onChange={e => onChange(e.target.value)}
      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 bg-white outline-none focus:border-purple-400">
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  )
}

function RadioGroup({ options, value, onChange }) {
  return (
    <div className="flex flex-col gap-2">
      {options.map(o => (
        <button key={o.value} onClick={() => onChange(o.value)}
          className={`text-left flex items-start gap-3 border rounded-xl px-4 py-3 transition-all ${value === o.value ? 'border-purple-400 bg-purple-50' : 'border-gray-200 bg-gray-50 hover:border-purple-200'}`}>
          <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5 ${value === o.value ? 'border-purple-400 bg-purple-400' : 'border-gray-300'}`} />
          <div>
            <p className="text-sm font-medium text-gray-900">{o.label}</p>
            {o.sub && <p className="text-xs text-gray-500 mt-0.5">{o.sub}</p>}
          </div>
        </button>
      ))}
    </div>
  )
}

/**
 * "What you'll see" — a mockup frame styled like the ACCESS HRA portal,
 * so users recognize the real screen when they get there.
 */
function ScreenPreview({ title, children }) {
  return (
    <div className="rounded-xl overflow-hidden border border-gray-300 shadow-sm mb-5">
      {/* Browser chrome */}
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
      {/* ACCESS HRA header bar */}
      <div className="bg-[#1a3c6e] px-3 py-2 flex items-center justify-between">
        <span className="text-white text-xs font-semibold tracking-wide">ACCESS HRA</span>
        <span className="text-white/70 text-xs">Fair Fares NYC</span>
      </div>
      <div className="bg-white p-4">
        <p className="text-sm font-semibold text-gray-800 mb-3">{title}</p>
        {children}
      </div>
      <div className="bg-purple-50 border-t border-purple-100 px-3 py-1.5 text-center">
        <p className="text-xs text-purple-600 font-medium">↑ This is what the real screen looks like</p>
      </div>
    </div>
  )
}

/** A single mocked field row inside a ScreenPreview, showing the user's value */
function PreviewField({ label, value, hint }) {
  return (
    <div className="mb-3">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <div className={`border rounded-lg px-3 py-2 text-sm ${value ? 'border-teal-400 bg-teal-50 text-gray-900' : 'border-gray-300 bg-gray-50 text-gray-400'}`}>
        {value || hint || 'You will type this'}
      </div>
      {value && <p className="text-xs text-teal-700 mt-0.5 flex items-center gap-1"><i className="ti ti-check" />Your answer — copy it exactly</p>}
    </div>
  )
}

// ── Section definitions (mirror the real application order) ──────

function useSections(app, update, isIntl) {
  const sections = [
    {
      title: 'Before you start — ACCESS HRA account',
      sub: 'The Fair Fares application lives on the ACCESS HRA portal. You need a free account first.',
      fields: () => (
        <div className="flex flex-col gap-4">
          <ScreenPreview title="Create Account — ACCESS HRA">
            <PreviewField label="Email or username" value={app.email} hint="you@email.com" />
            <PreviewField label="Password" hint="You will choose one" />
            <PreviewField label="Security question" hint="You will pick one about yourself" />
          </ScreenPreview>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <p className="text-sm font-medium text-gray-900 mb-2">Steps</p>
            <ol className="text-sm text-gray-500 leading-relaxed list-decimal ml-4 flex flex-col gap-1">
              <li>Go to <strong>nyc.gov/accessfairfares</strong></li>
              <li>Click "Create Account" — use the email above</li>
              <li>When asked to connect an HRA case: if you've never received benefits, click <strong>"Skip"</strong></li>
              <li>From the Fair Fares homepage, click <strong>"Apply Now"</strong></li>
            </ol>
          </div>
          <Field label="EMAIL YOU'LL USE FOR ACCESS HRA" annotation="Use an email you check often — HRA sends application updates here.">
            <Input value={app.email} onChange={v => update({ email: v })} placeholder="you@email.com" type="email" prefilled={!!app.email} />
          </Field>
        </div>
      ),
    },
    {
      title: 'Personal information & age',
      sub: 'The application first confirms you are 18–64. Enter your name exactly as on your ID.',
      fields: () => (
        <div className="flex flex-col gap-4">
          <ScreenPreview title="Tell us about yourself">
            <PreviewField label="Legal first name" value={app.firstName} />
            <PreviewField label="Legal last name" value={app.lastName} />
            <PreviewField label="Date of birth" value={app.dob} hint="MM/DD/YYYY" />
          </ScreenPreview>
          <Field label="LEGAL FIRST NAME" annotation="Must match your passport, state ID, or IDNYC exactly.">
            <Input value={app.firstName} onChange={v => update({ firstName: v })} placeholder="e.g. Maria" prefilled={!!app.firstName} />
          </Field>
          <Field label="LEGAL LAST NAME">
            <Input value={app.lastName} onChange={v => update({ lastName: v })} placeholder="e.g. Santos" prefilled={!!app.lastName} />
          </Field>
          <Field label="DATE OF BIRTH" annotation="You must be 18 through 64 to qualify. Format: MM/DD/YYYY.">
            <Input value={app.dob} onChange={v => update({ dob: v })} placeholder="MM/DD/YYYY" prefilled={!!app.dob} />
          </Field>
          <Field label="SSN OR ITIN (optional)" annotation="Fair Fares does not trigger public charge and is open regardless of immigration status. If you have an ITIN, you can use it. You may leave this blank.">
            <Input value={app.ssn} onChange={v => update({ ssn: v })} placeholder="XXX-XX-XXXX or leave blank" />
          </Field>
        </div>
      ),
    },
    {
      title: 'Residence & mailing address',
      sub: 'You must live in one of the five boroughs. Your OMNY card will be mailed to the mailing address.',
      fields: () => (
        <div className="flex flex-col gap-4">
          <ScreenPreview title="Where do you live?">
            <PreviewField label="Residence address" value={app.address} hint="123 Main St, Apt 2A" />
            <PreviewField label="Borough" value={app.borough} />
            <PreviewField label="ZIP code" value={app.zip} />
            <PreviewField label="Mailing address" hint="Check 'Same as residence' if it matches" />
          </ScreenPreview>
          <Field label="STREET ADDRESS" annotation="Must match your proof-of-address document (lease, utility bill, or bank statement) exactly." refNote="From: lease or utility bill">
            <Input value={app.address} onChange={v => update({ address: v })} placeholder="123 Main St, Apt 2A" prefilled={!!app.address} />
          </Field>
          <Field label="BOROUGH">
            <Select value={app.borough} onChange={v => update({ borough: v })} options={[
              { value: '', label: 'Select borough…' },
              { value: 'Brooklyn', label: 'Brooklyn' },
              { value: 'Manhattan', label: 'Manhattan' },
              { value: 'Queens', label: 'Queens' },
              { value: 'Bronx', label: 'Bronx' },
              { value: 'Staten Island', label: 'Staten Island' },
            ]} />
          </Field>
          <Field label="ZIP CODE" refNote="From: lease or utility bill">
            <Input value={app.zip} onChange={v => update({ zip: v })} placeholder="10001" prefilled={!!app.zip} />
          </Field>
          <Field label="IS YOUR MAILING ADDRESS THE SAME?" annotation="Your Fair Fares OMNY card is mailed here — make sure you can receive mail at this address.">
            <RadioGroup value={String(app.mailingSame ?? 'true')} onChange={v => update({ mailingSame: v })} options={[
              { value: 'true', label: 'Yes — mail my card to my residence' },
              { value: 'false', label: 'No — I use a different mailing address', sub: 'You\'ll enter it on the real form' },
            ]} />
          </Field>
        </div>
      ),
    },
    {
      title: 'Contact information',
      sub: 'HRA uses this to reach you about your application status.',
      fields: () => (
        <div className="flex flex-col gap-4">
          <ScreenPreview title="How can we contact you?">
            <PreviewField label="Phone number" value={app.phone} hint="(212) 555-0100" />
            <PreviewField label="Email address" value={app.email} hint="you@email.com" />
          </ScreenPreview>
          <Field label="PHONE NUMBER" refNote="HRA may call or text this number about your application.">
            <Input value={app.phone} onChange={v => update({ phone: v })} placeholder="(212) 555-0100" type="tel" prefilled={!!app.phone} />
          </Field>
          <Field label="EMAIL ADDRESS" refNote="Status updates and e-notices arrive here.">
            <Input value={app.email} onChange={v => update({ email: v })} placeholder="you@email.com" type="email" prefilled={!!app.email} />
          </Field>
        </div>
      ),
    },
    {
      title: 'Identity verification',
      sub: 'The application offers to verify your identity, age, and address electronically — so you may not need to upload documents at all.',
      fields: () => (
        <div className="flex flex-col gap-4">
          <ScreenPreview title="Confirm your information">
            <p className="text-xs text-gray-600 leading-relaxed mb-3">
              "Would you like to use an authentication service to verify your identity, age and address?"
            </p>
            <div className="border border-teal-400 bg-teal-50 rounded-lg px-3 py-2 text-sm text-gray-900 mb-2">◉ Yes — verify me electronically</div>
            <div className="border border-gray-300 bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-400">○ No — I'll upload documents instead</div>
          </ScreenPreview>
          <Field label="DO YOU HAVE AN IDNYC CARD?" annotation="If yes, entering your IDNYC card number can verify your identity, age, AND address instantly — no document uploads needed for those categories. If no, the portal can verify you via your cell phone number.">
            <RadioGroup value={app.hasIdnyc || ''} onChange={v => update({ hasIdnyc: v })} options={[
              { value: 'yes', label: 'Yes — I have IDNYC', sub: 'Have your card number ready (front of card)' },
              { value: 'no', label: 'No IDNYC', sub: 'The portal will offer phone verification, or you can upload documents' },
            ]} />
          </Field>
          <div className="bg-purple-50 border border-purple-100 rounded-xl px-4 py-3">
            <p className="text-xs text-purple-800 leading-relaxed">
              <strong>Say yes if you can.</strong> Successful electronic verification means fewer documents to upload later — often just proof of income.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: 'Household & income',
      sub: 'Your pre-tax household income must be at or below 200% of the Federal Poverty Level.',
      fields: () => (
        <div className="flex flex-col gap-4">
          <ScreenPreview title="Household income">
            <PreviewField label="Household size" value={app.householdSize ? String(app.householdSize) : ''} />
            <PreviewField label="Annual household income (before taxes)" value={app.annualIncome ? `$${parseInt(app.annualIncome).toLocaleString()}` : ''} />
          </ScreenPreview>
          <Field label="HOUSEHOLD SIZE" annotation="Count yourself plus people you financially support. Roommates who are not related to you and not your dependents do NOT count.">
            <Select value={String(app.householdSize || '')} onChange={v => update({ householdSize: v })} options={[
              { value: '', label: 'Select…' },
              { value: '1', label: '1 — Just me' },
              { value: '2', label: '2 people' },
              { value: '3', label: '3 people' },
              { value: '4', label: '4 people' },
              { value: '5', label: '5 or more people' },
            ]} />
          </Field>
          <Field label="PRIMARY INCOME SOURCE" annotation="Match this to the income document you collected.">
            <Select value={app.incomeSource} onChange={v => update({ incomeSource: v })} options={[
              { value: '', label: 'Select…' },
              { value: 'finaid', label: 'Financial aid / student stipend' },
              { value: 'employment', label: 'Employment' },
              { value: 'benefits', label: 'Government benefits' },
              { value: 'unemployment', label: 'Unemployment insurance' },
              { value: 'zero', label: 'No income' },
            ]} />
          </Field>
          <Field label="ANNUAL HOUSEHOLD INCOME (BEFORE TAXES)" annotation="Report gross income. Do not include roommates' income." refNote="From your income document — must match what you upload">
            <Input value={app.annualIncome ? `$${parseInt(app.annualIncome).toLocaleString()}` : ''} onChange={v => update({ annualIncome: v.replace(/[^0-9]/g, '') })} placeholder="$0" prefilled={!!app.annualIncome} />
          </Field>
          <Field label="DO YOU RECEIVE SNAP OR CASH ASSISTANCE?" annotation="If yes, HRA already has your income verified — you may be fast-tracked and skip income documents entirely.">
            <RadioGroup value={String(app.hasHRABenefits)} onChange={v => update({ hasHRABenefits: v === 'true' })} options={[
              { value: 'false', label: 'No' },
              { value: 'true', label: 'Yes — I receive SNAP or Cash Assistance', sub: 'Look for the "Enroll Now" fast-track alert on your ACCESS HRA home page' },
            ]} />
          </Field>
        </div>
      ),
    },
    {
      title: 'Submit & upload documents',
      sub: 'After submitting, you have 10 calendar days to upload any required documents — using the ACCESS HRA mobile app.',
      fields: () => (
        <div className="flex flex-col gap-4">
          <ScreenPreview title="Confirmation — Application Submitted">
            <div className="bg-teal-50 border border-teal-400 rounded-lg px-3 py-2 mb-3">
              <p className="text-sm font-medium text-teal-800">✓ Your application has been submitted</p>
              <p className="text-xs text-teal-700 mt-0.5">Application ID: FF-XXXXXXXX</p>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed mb-2">
              "Would you like to see your required documents?"
            </p>
            <div className="border border-teal-400 bg-teal-50 rounded-lg px-3 py-2 text-sm text-gray-900">◉ YES, see my required documents</div>
          </ScreenPreview>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <p className="text-sm font-medium text-gray-900 mb-2">What happens next</p>
            <ol className="text-sm text-gray-500 leading-relaxed list-decimal ml-4 flex flex-col gap-1.5">
              <li><strong>Write down your Application ID</strong> from the confirmation page</li>
              <li>Click "YES, see my required documents" — this shows exactly what to upload</li>
              <li>Download the <strong>ACCESS HRA Mobile app</strong> — documents MUST be uploaded through the app, not the website</li>
              <li>Upload within <strong>10 calendar days</strong> — the documents you collected with Qualift are exactly what you need</li>
              <li>Decision within ~30 days; your OMNY card arrives by mail after approval</li>
            </ol>
          </div>
          <div className="bg-coral-50 border border-coral-100 rounded-xl px-4 py-3">
            <p className="text-xs text-coral-800 leading-relaxed">
              <strong>Don't miss the 10-day window.</strong> Applications without documents are denied automatically. Your docs are ready — upload them the same day you apply.
            </p>
          </div>
        </div>
      ),
    },
  ]

  // International students: add a note section about supporting documents (the
  // real form does NOT ask visa questions — status doesn't affect eligibility)
  if (isIntl) {
    sections.splice(6, 0, {
      title: 'For international students',
      sub: 'The application does not ask about your visa — Fair Fares is open regardless of immigration status.',
      fields: () => (
        <div className="flex flex-col gap-4">
          <div className="bg-teal-50 border border-teal-100 rounded-xl p-4">
            <p className="text-sm font-medium text-teal-800 mb-2">Good news — no immigration questions</p>
            <p className="text-sm text-gray-600 leading-relaxed">
              The Fair Fares application never asks your visa type or SEVIS ID. Your I-20 and passport
              are simply used as <strong>identity documents</strong> when you upload proof.
            </p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <p className="text-sm font-medium text-gray-900 mb-2">When uploading documents, use:</p>
            <ul className="text-sm text-gray-500 leading-relaxed flex flex-col gap-1.5 list-disc ml-4">
              <li><strong>Identity:</strong> your passport (or IDNYC if you have one)</li>
              <li><strong>NYC address:</strong> your lease, utility bill, or bank statement</li>
              <li><strong>Income:</strong> financial aid letter, stipend letter, or pay stubs</li>
            </ul>
          </div>
          <div className="bg-purple-50 border border-purple-100 rounded-xl px-4 py-3">
            <p className="text-xs text-purple-800 leading-relaxed">
              <strong>Public charge:</strong> Fair Fares is a city transit discount, not a federal benefit — it does not affect visa renewals or future immigration applications.
            </p>
          </div>
        </div>
      ),
    })
  }

  return sections
}

// ── Main component ───────────────────────────────────────────────

export default function AppWalkthrough() {
  const { progress, updateApplication, advanceStage } = useProgress()
  const router  = useRouter()
  const isIntl  = progress.studentType === 'international'
  const app     = progress.application || {}

  function update(patch) { updateApplication(patch) }

  const sections = useSections(app, update, isIntl)
  const [step, setStep] = useState(0)
  const total = sections.length

  function next() {
    if (step < total - 1) { setStep(s => s + 1); window.scrollTo(0, 0) }
    else {
      advanceStage(8)
      router.push('/guide')
    }
  }

  const section = sections[step]

  return (
    <div className="fade-in flex flex-col min-h-screen">
      {/* Progress header */}
      <div className="px-5 py-4 border-b border-gray-100 bg-white sticky top-0 z-10">
        <div className="flex justify-between text-xs text-gray-400 mb-2">
          <span>{section.title}</span>
          <span className="font-medium text-purple-600">Section {step + 1} of {total}</span>
        </div>
        <div className="bg-gray-100 rounded-full h-1.5">
          <div className="bg-purple-400 h-1.5 rounded-full bar-fill" style={{ width: `${((step + 1) / total) * 100}%` }} />
        </div>
        <div className="flex gap-1.5 mt-2">
          {sections.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full flex-1 ${i < step ? 'bg-purple-400' : i === step ? 'bg-purple-600' : 'bg-gray-200'}`} />
          ))}
        </div>
      </div>

      {/* Section content */}
      <div className="flex-1 px-5 py-5 pb-24">
        <p className="text-xs text-gray-400 mb-4 leading-relaxed">{section.sub}</p>
        {section.fields()}
      </div>

      {/* Nav */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] flex gap-3 px-5 py-4 bg-white border-t border-gray-100">
        {step > 0 && (
          <button onClick={() => { setStep(s => s - 1); window.scrollTo(0, 0) }}
            className="flex-1 border border-gray-200 rounded-xl py-3 text-sm text-gray-500 font-medium hover:border-purple-300 hover:text-purple-600 transition-colors">
            Back
          </button>
        )}
        <button onClick={next}
          className="flex-2 flex-1 bg-purple-400 hover:bg-purple-600 text-white rounded-xl py-3 text-sm font-medium transition-colors">
          {step === total - 1 ? 'Generate my guide →' : 'Continue →'}
        </button>
      </div>
    </div>
  )
}
