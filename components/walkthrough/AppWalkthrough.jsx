'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useProgress } from '@/store/ProgressContext'

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

// Section definitions
function useIntlSections(app, update) {
  return [
    {
      title: 'Personal information',
      sub: 'Exactly as it appears on your government-issued ID.',
      fields: () => (
        <div className="flex flex-col gap-4">
          <Field label="LEGAL FIRST NAME" annotation="Must match your passport or state ID exactly.">
            <Input value={app.firstName} onChange={v => update({ firstName: v })} placeholder="e.g. Maria" />
          </Field>
          <Field label="LEGAL LAST NAME">
            <Input value={app.lastName} onChange={v => update({ lastName: v })} placeholder="e.g. Santos" />
          </Field>
          <Field label="DATE OF BIRTH" annotation="HRA uses DOB to verify identity. Format: MM/DD/YYYY.">
            <Input value={app.dob} onChange={v => update({ dob: v })} placeholder="MM/DD/YYYY" />
          </Field>
          <Field label="SSN OR ITIN (optional)" annotation="Fair Fares does not trigger public charge. If you have an ITIN, use it. You may leave this blank.">
            <Input value={app.ssn} onChange={v => update({ ssn: v })} placeholder="XXX-XX-XXXX or leave blank" />
          </Field>
          <Field label="PHONE NUMBER" refNote="HRA may call this number to verify your application.">
            <Input value={app.phone} onChange={v => update({ phone: v })} placeholder="(212) 555-0100" type="tel" />
          </Field>
          <Field label="EMAIL ADDRESS" refNote="Used for your ACCESS HRA account and status updates.">
            <Input value={app.email} onChange={v => update({ email: v })} placeholder="you@email.com" type="email" />
          </Field>
        </div>
      ),
    },
    {
      title: 'NYC address',
      sub: 'Must match your proof of address document exactly.',
      fields: () => (
        <div className="flex flex-col gap-4">
          <Field label="STREET ADDRESS" annotation="Pre-filled from your documents — confirm it's correct." refNote="From: lease or utility bill">
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
          <Field label="HOW LONG AT THIS ADDRESS?" annotation="If less than 3 months, you may need an additional address document.">
            <Select value={app.lengthAtAddress} onChange={v => update({ lengthAtAddress: v })} options={[
              { value: '', label: 'Select…' },
              { value: 'lt3', label: 'Less than 3 months' },
              { value: '3to12', label: '3–12 months' },
              { value: 'gt12', label: 'More than 1 year' },
            ]} />
          </Field>
        </div>
      ),
    },
    {
      title: 'Immigration & student status',
      sub: 'International students only. This section does not appear on domestic applications.',
      fields: () => (
        <div className="flex flex-col gap-4">
          <Field label="VISA TYPE" annotation="Select the visa type shown on your I-20.">
            <Select value={app.visaType} onChange={v => update({ visaType: v })} options={[
              { value: 'F-1', label: 'F-1 — Academic student' },
              { value: 'J-1', label: 'J-1 — Exchange visitor' },
              { value: 'Other', label: 'Other' },
            ]} />
          </Field>
          <Field label="I-20 SEVIS ID NUMBER" annotation="The 'Student ID' at the top of your I-20, starting with N. Example: N0012345678." refNote="I-20 form — top right corner">
            <Input value={app.sevisId} onChange={v => update({ sevisId: v })} placeholder="N0012345678" />
          </Field>
          <Field label="PROGRAM END DATE" annotation="The date your current I-20 program ends. If extended, use the most recent end date." refNote="I-20 field 5 — 'Program of Study'">
            <Input value={app.programEndDate} onChange={v => update({ programEndDate: v })} placeholder="MM/DD/YYYY" />
          </Field>
          <Field label="UNIVERSITY / SCHOOL NAME">
            <Input value={app.school} onChange={v => update({ school: v })} placeholder="e.g. City College of New York" />
          </Field>
        </div>
      ),
    },
    {
      title: 'Income',
      sub: 'Be accurate — HRA may verify against tax records.',
      fields: () => (
        <div className="flex flex-col gap-4">
          <Field label="PRIMARY INCOME SOURCE" annotation="Based on your document collection — change if needed.">
            <Select value={app.incomeSource} onChange={v => update({ incomeSource: v })} options={[
              { value: '', label: 'Select…' },
              { value: 'finaid', label: 'Financial aid / student stipend' },
              { value: 'employment', label: 'Employment' },
              { value: 'benefits', label: 'Government benefits' },
              { value: 'unemployment', label: 'Unemployment insurance' },
              { value: 'zero', label: 'No income' },
            ]} />
          </Field>
          <Field label="MONTHLY GROSS INCOME" annotation="Gross = before taxes. For annual aid, divide by 12. Example: $18,500 ÷ 12 = $1,542/month." refNote="From your income document">
            <Input value={app.monthlyIncome} onChange={v => update({ monthlyIncome: v, annualIncome: v ? String(Math.round(parseFloat(v.replace(/[^0-9.]/g,'')) * 12)) : '' })} placeholder="$0.00" prefilled={!!app.monthlyIncome} />
          </Field>
          <Field label="ANNUAL HOUSEHOLD INCOME" annotation="Auto-calculated from monthly × 12. Adjust if there are other household income sources." refNote="Must be ≤ 100% FPL for your household size">
            <Input value={app.annualIncome ? `$${parseInt(app.annualIncome).toLocaleString()}` : ''} onChange={v => update({ annualIncome: v })} placeholder="$0" prefilled={!!app.annualIncome} />
          </Field>
          <Field label="HOUSEHOLD SIZE" annotation="Number of people who live with you and share expenses — including yourself.">
            <Select value={String(app.householdSize || '')} onChange={v => update({ householdSize: v })} options={[
              { value: '', label: 'Select…' },
              { value: '1', label: '1 — Live alone' },
              { value: '2', label: '2 people' },
              { value: '3', label: '3 people' },
              { value: '4', label: '4 people' },
              { value: '5', label: '5 or more people' },
            ]} />
          </Field>
        </div>
      ),
    },
    {
      title: 'Current transit & benefit status',
      sub: 'HRA checks this to ensure you\'re not already receiving a conflicting transit benefit.',
      fields: () => (
        <div className="flex flex-col gap-5">
          <Field label="DO YOU CURRENTLY HAVE A REDUCED-FARE METROCARD OR OMNY BENEFIT?" annotation="This is the senior or disability transit discount — not a regular MetroCard. Most people select No.">
            <RadioGroup value={String(app.hasReducedFare)} onChange={v => update({ hasReducedFare: v === 'true' })} options={[
              { value: 'false', label: 'No' },
              { value: 'true', label: 'Yes — I currently have a Reduced-Fare benefit', sub: 'Note: you may need to cancel it before Fair Fares is approved' },
            ]} />
          </Field>
          <Field label="DO YOU CURRENTLY RECEIVE SNAP, MEDICAID, OR OTHER HRA BENEFITS?" annotation="If yes, your income is already verified with HRA — this can speed up your approval.">
            <RadioGroup value={String(app.hasHRABenefits)} onChange={v => update({ hasHRABenefits: v === 'true' })} options={[
              { value: 'false', label: 'No' },
              { value: 'true', label: 'Yes — I receive HRA benefits', sub: 'Your income verification may be waived' },
            ]} />
          </Field>
        </div>
      ),
    },
    {
      title: 'MetroCard preference',
      sub: 'Choose the type of Fair Fares MetroCard that best fits how you ride.',
      fields: () => (
        <div className="flex flex-col gap-3">
          <Field label="WHICH TYPE DO YOU WANT?">
            <RadioGroup value={app.metroCardType || '7day'} onChange={v => update({ metroCardType: v })} options={[
              { value: '7day', label: '7-Day Unlimited — $17', sub: 'Best if you ride more than 12 times a week (normally $34)' },
              { value: 'ppr', label: 'Pay-Per-Ride — $1.65 per trip', sub: 'Best if you ride occasionally (normally $2.90)' },
            ]} />
          </Field>
          <p className="text-xs text-gray-400 leading-relaxed bg-gray-50 rounded-lg px-3 py-2">
            You can change your MetroCard type after approval at any NYC subway station MetroCard machine.
          </p>
        </div>
      ),
    },
  ]
}

function useDomesticSections(app, update) {
  // Domestic: same as intl but no immigration section → 5 sections
  const all = useIntlSections(app, update)
  return [all[0], all[1], all[3], all[4], all[5]] // skip index 2 (immigration)
}

export default function AppWalkthrough() {
  const { progress, updateApplication, advanceStage } = useProgress()
  const router  = useRouter()
  const isIntl  = progress.studentType === 'international'
  const app     = progress.application || {}

  function update(patch) { updateApplication(patch) }

  const sections = isIntl ? useIntlSections(app, update) : useDomesticSections(app, update)
  const [step, setStep] = useState(0)
  const total = sections.length
  const pct   = Math.round(((step) / total) * 100)

  function next() {
    if (step < total - 1) { setStep(s => s + 1) }
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
          <button onClick={() => setStep(s => s - 1)}
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
