'use client'
import { useState } from 'react'
import { useProgress } from '@/store/ProgressContext'
import GuideShell from './guides/GuideShell'

// ── Guide content ────────────────────────────────────────────────

const GUIDES = {
  paystub: {
    badge: 'Proof of income', title: 'Pay stubs — 4 most recent',
    sub: 'HRA requires your 4 most recent consecutive pay stubs showing employer name, pay period, and gross income.',
    steps: [
      { title: 'Check your employer\'s payroll portal', desc: 'Most employers use ADP, Gusto, Paychex, or Workday. Log in and download the last 4 pay statements as PDFs.' },
      { title: 'No portal? Ask HR directly', desc: 'Email or call HR requesting "the 4 most recent pay stubs for a benefits application." They\'re required to provide these.' },
      { title: 'Each stub needs: name, employer, pay period, gross income', desc: 'Missing any of these? Request a corrected copy before submitting.' },
      { title: 'Save as PDFs — not photos', desc: 'HRA prefers digital uploads. Photographed paper stubs are often rejected.' },
    ],
    ctaLabel: 'I have my pay stubs — mark as collected', docKey: 'income',
  },
  finaid: {
    badge: 'Proof of income', title: 'Financial aid or stipend letter',
    sub: 'HRA accepts an official letter from your institution showing aid amount and dates.',
    steps: [
      { title: 'Log into your student portal', desc: 'Go to the financial aid or bursar section. Download your current-year award letter as a PDF.' },
      { title: 'Receiving a research stipend?', desc: 'Contact your department admin. Request a letter on university letterhead stating your stipend amount and payment period.' },
      { title: 'Confirm it shows annual or monthly amount', desc: 'HRA needs to calculate your annual income. The letter must clearly state either the total annual award or the monthly amount.' },
    ],
    ctaLabel: 'I have my award letter — mark as collected', docKey: 'income',
  },
  benefits: {
    badge: 'Proof of income', title: 'Government benefit award letter',
    sub: 'HRA accepts a current benefit award letter from SSA, HRA, or DSS showing your monthly benefit amount.',
    steps: [
      { title: 'Log into ACCESS HRA', desc: 'Go to accesshra.nyc.gov → "My Benefits" → select your active benefit → "View Benefit Details." Download a current summary letter as PDF.', link: { label: 'Open ACCESS HRA', url: 'https://accesshra.nyc.gov' } },
      { title: 'Receiving SSI or SSDI from Social Security?', desc: 'Log into ssa.gov → "My Social Security" → "Benefits & Payments" → download a Benefit Verification Letter.', link: { label: 'Open My Social Security', url: 'https://www.ssa.gov/myaccount' } },
      { title: 'Can\'t access online? Call or visit HRA', desc: 'Call HRA Infoline at 718-557-1399 or visit your nearest HRA Benefits Access Center with your ID and case number.' },
      { title: 'Check: dated within 90 days, shows monthly amount', desc: 'A letter older than 90 days or showing $0 won\'t be accepted. Request a current one if yours is outdated.' },
    ],
    ctaLabel: 'I have my benefit letter — mark as collected', docKey: 'income',
  },
  unemployment: {
    badge: 'Proof of income', title: 'NYS Unemployment Insurance letter',
    sub: 'HRA accepts your UI determination letter or a current benefit statement showing your weekly benefit amount.',
    steps: [
      { title: 'Log into your NY.gov UI account', desc: 'Go to labor.ny.gov and log in. Navigate to "Payment History" or "Benefit Statements."', link: { label: 'Open NY UI portal', url: 'https://labor.ny.gov/ui/claimantinfo/beforeyouapply1.shtm' } },
      { title: 'Download your determination letter', desc: 'This shows your weekly benefit amount and effective dates. Download as PDF.' },
      { title: 'Can\'t find it? Request a benefit verification', desc: 'Call the NY UI Telephone Claims Center at 888-209-8124. Request a written benefit verification letter. Allow 7–10 business days.' },
      { title: 'Confirm it shows annual or weekly amount', desc: 'Multiply your weekly benefit by 52 if needed — this calculation is yours to show, not HRA\'s.' },
    ],
    ctaLabel: 'I have my UI letter — mark as collected', docKey: 'income',
  },
  zeroincome: {
    badge: 'Proof of income', title: 'Zero-income self-attestation',
    sub: 'If you have no income, HRA allows a signed self-attestation statement. We\'ll generate this letter for you at the application stage.',
    steps: [
      { title: 'A self-attestation is a signed written statement', desc: 'It declares you have zero income from any source. You sign and date it — no notary needed.' },
      { title: 'Qualift will generate this letter for you', desc: 'At the application walkthrough stage, we\'ll pre-fill a zero-income attestation with your information. You just review and sign it.' },
      { title: 'HRA may follow up', desc: 'If your zero-income claim is flagged, a caseworker may request additional documentation or a brief interview. This is normal and not a denial.' },
    ],
    ctaLabel: 'Understood — mark income as handled', docKey: 'income',
  },
  i20: {
    badge: 'Student visa document', title: 'I-20 — Certificate of eligibility',
    sub: 'Your I-20 was issued by your school\'s DSO when you enrolled. You need the most current, unexpired copy.',
    steps: [
      { title: 'Check your SEVIS account first', desc: 'Log into studyinthestates.dhs.gov — your most recent I-20 may be downloadable directly.', link: { label: 'Open SEVIS', url: 'https://studyinthestates.dhs.gov' } },
      { title: 'Contact your international student office', desc: 'Email your DSO requesting a reprint of your current I-20. This is routine — usually same-day or next-day.' },
      { title: 'Confirm it\'s signed and unexpired', desc: 'Must have your DSO\'s signature and a program end date that hasn\'t passed. An expired I-20 will be rejected even if your status was extended.' },
      { title: 'Scan both pages as one PDF', desc: 'HRA needs both pages. Scan as a single PDF or photograph both pages clearly.' },
    ],
    ctaLabel: 'I have my I-20 — mark as collected', docKey: 'i20',
  },
  ssn_lost: {
    badge: 'Social Security Number', title: 'You don\'t need the physical card',
    sub: 'HRA only needs your SSN as a number — you can provide it from memory or from another document that shows it.',
    steps: [
      { title: 'Check documents that may show your SSN', desc: 'Tax returns (W-2, 1040), SSA benefit letters, or some pay stubs display your full or partial SSN. Any of these work as a reference.' },
      { title: 'Need a replacement card?', desc: 'Apply at ssa.gov/ssnumber — free, and you can do it online in most states. Allow 10–14 business days.', link: { label: 'Replace SSN card', url: 'https://www.ssa.gov/ssnumber' } },
      { title: 'For the HRA application, enter the number directly', desc: 'The Fair Fares form has a field for your SSN. You type the number — no card upload required.' },
    ],
    ctaLabel: 'I have my SSN — mark as collected', docKey: 'd_ssn',
  },
  ssn_apply: {
    badge: 'Social Security Number', title: 'First-time SSN application',
    sub: 'You\'ll need to apply in person at a Social Security Administration office. Plan for 2–4 weeks.',
    steps: [
      { title: 'Gather required documents', desc: 'You need: proof of age (birth certificate or passport), proof of US citizenship or immigration status, and proof of identity. All must be originals — no photocopies.' },
      { title: 'Download and complete Form SS-5', desc: 'Fill out the Application for Social Security Card before your visit to save time.', link: { label: 'Download SS-5', url: 'https://www.ssa.gov/forms/ss-5.pdf' } },
      { title: 'Find your nearest SSA office', desc: 'Use the SSA office locator. Some accept walk-ins; others require appointments — call ahead.', link: { label: 'Find SSA office', url: 'https://www.ssa.gov/locator' } },
      { title: 'Card arrives by mail in 2–4 weeks', desc: 'Once approved, your card mails to your address. Come back and mark your SSN as collected when it arrives.' },
    ],
    ctaLabel: 'Got it — I\'ll return when my card arrives', docKey: 'd_ssn',
  },
}

// ── No-income branching screens ──────────────────────────────────

function NoIncomeQ1({ onAnswer, onBack }) {
  return (
    <div className="fade-in px-5 pt-5 pb-8">
      <button onClick={onBack} className="text-gray-400 text-xl mb-4 flex items-center"><i className="ti ti-arrow-left" /></button>
      <h2 className="text-lg font-medium text-gray-900 mb-2">Are you currently receiving unemployment benefits?</h2>
      <p className="text-sm text-gray-500 leading-relaxed mb-5">This includes NYS Unemployment Insurance (UI) or any federal unemployment assistance.</p>
      <div className="flex flex-col gap-3">
        {[
          { label: 'Yes — I\'m receiving unemployment', sub: 'We\'ll help you get your UI letter', value: 'unemployment' },
          { label: 'No — I\'m not receiving unemployment', sub: 'Let\'s check for other income sources', value: 'next' },
        ].map(o => (
          <button key={o.value} onClick={() => onAnswer(o.value)}
            className="text-left border border-gray-200 rounded-xl p-4 bg-gray-50 hover:border-purple-400 hover:bg-purple-50 transition-all">
            <p className="text-sm font-medium text-gray-900">{o.label}</p>
            <p className="text-xs text-gray-500 mt-1">{o.sub}</p>
          </button>
        ))}
      </div>
    </div>
  )
}

function NoIncomeQ2({ onAnswer, onBack }) {
  return (
    <div className="fade-in px-5 pt-5 pb-8">
      <button onClick={onBack} className="text-gray-400 text-xl mb-4 flex items-center"><i className="ti ti-arrow-left" /></button>
      <h2 className="text-lg font-medium text-gray-900 mb-2">Do you receive income from any of these sources?</h2>
      <p className="text-sm text-gray-500 leading-relaxed mb-5">Even irregular or informal income counts. Select the closest match.</p>
      <div className="flex flex-col gap-3">
        {[
          { label: 'Occasional gig, freelance, or cash work', sub: 'Bank statements or written statement may apply', value: 'gig' },
          { label: 'Family sends me money to live on', sub: 'Family support letter or bank deposit records', value: 'family' },
          { label: 'Alimony or child support', sub: 'Court order or payment records', value: 'alimony' },
          { label: 'None of these — I truly have no income', sub: 'Zero-income self-attestation path', value: 'zeroincome' },
        ].map(o => (
          <button key={o.value} onClick={() => onAnswer(o.value)}
            className="text-left border border-gray-200 rounded-xl p-4 bg-gray-50 hover:border-purple-400 hover:bg-purple-50 transition-all">
            <p className="text-sm font-medium text-gray-900">{o.label}</p>
            <p className="text-xs text-gray-500 mt-1">{o.sub}</p>
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Doc item row ─────────────────────────────────────────────────

function DocItem({ checked, name, hint, onToggle, children }) {
  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden">
      <button onClick={onToggle} className="w-full flex items-center gap-3 px-4 py-3.5 bg-gray-50 hover:bg-gray-100 transition-colors text-left">
        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${checked ? 'bg-purple-400 border-purple-400 text-white' : 'border-gray-300'}`}>
          {checked && <i className="ti ti-check text-xs" />}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">{name}</p>
          <p className="text-xs text-gray-500 mt-0.5">{hint}</p>
        </div>
        {!checked && children && <i className="ti ti-chevron-down text-gray-300 text-base" />}
      </button>
      {!checked && children && (
        <div className="bg-coral-50 border-t border-coral-100 p-4">{children}</div>
      )}
    </div>
  )
}

function BranchOpts({ label, opts, onSelect }) {
  return (
    <div>
      <p className="text-xs font-medium text-coral-800 mb-2">{label}</p>
      <div className="flex flex-col gap-2">
        {opts.map((o, i) => (
          <button key={i} onClick={() => onSelect(o.guide)}
            className="text-left bg-white border border-coral-200 rounded-xl px-3 py-2.5 hover:bg-coral-50 transition-colors">
            <p className="text-xs font-medium text-coral-800">{o.label}</p>
            {o.sub && <p className="text-xs text-coral-600 mt-0.5">{o.sub}</p>}
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Main component ───────────────────────────────────────────────

export default function DocCollection() {
  const { progress, updateDocs, advanceStage } = useProgress()
  const isIntl = progress.studentType === 'international'

  // screen: 'list' | 'noincomeQ1' | 'noincomeQ2' | guide key
  const [screen, setScreen] = useState('list')

  const docs = progress.docs || {}

  function toggle(key) {
    updateDocs({ [key]: !docs[key] })
    // If checking off income, clear incomeType branch
    if ((key === 'income' || key === 'd_income') && !docs[key]) {
      updateDocs({ incomeType: null, d_incomeType: null })
    }
  }

  function markCollected(docKey) {
    updateDocs({ [docKey]: true })
    setScreen('list')
    checkAdvance({ ...docs, [docKey]: true })
  }

  function checkAdvance(d) {
    const keys = isIntl ? ['id','addr','income','i20'] : ['d_id','d_addr','d_income','d_ssn']
    if (keys.every(k => d[k])) advanceStage(5)
  }

  // Guide screen
  if (screen !== 'list' && screen !== 'noincomeQ1' && screen !== 'noincomeQ2') {
    const guide = GUIDES[screen]
    if (guide) return (
      <GuideShell
        {...guide}
        onBack={() => setScreen('list')}
        onCta={() => markCollected(guide.docKey)}
      />
    )
  }

  if (screen === 'noincomeQ1') return (
    <NoIncomeQ1
      onBack={() => setScreen('list')}
      onAnswer={val => val === 'unemployment' ? setScreen('unemployment') : setScreen('noincomeQ2')}
    />
  )

  if (screen === 'noincomeQ2') return (
    <NoIncomeQ2
      onBack={() => setScreen('noincomeQ1')}
      onAnswer={val => {
        if (['gig','family','alimony'].includes(val)) {
          updateDocs({ incomeType: val, d_incomeType: val })
          setScreen('list') // these branch to chat in production
        } else {
          setScreen('zeroincome')
        }
      }}
    />
  )

  // ── Doc list ──
  if (isIntl) return (
    <div className="fade-in px-5 pt-5 pb-8 flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-1">Document collection</h2>
        <p className="text-sm text-gray-500 leading-relaxed">Check off what you have. For anything missing, we'll walk you through exactly how to get it.</p>
      </div>

      <DocItem checked={docs.id} name="Government-issued photo ID" hint="Passport, state ID, or driver's license" onToggle={() => toggle('id')} />

      <DocItem checked={docs.addr} name="Proof of NYC address" hint="Lease, utility bill, or bank statement" onToggle={() => toggle('addr')} />

      <DocItem checked={docs.income} name="Proof of income" hint="Pay stub, award letter, benefit letter, or self-attestation" onToggle={() => toggle('income')}>
        <BranchOpts label="What best describes your income situation?"
          opts={[
            { label: 'Employed — I have a job', sub: '4 most recent pay stubs required', guide: 'paystub' },
            { label: 'Student — stipend or financial aid', sub: 'Award letter or stipend confirmation', guide: 'finaid' },
            { label: 'Receiving government benefits', sub: 'Benefit award letter from SSA, HRA, or DSS', guide: 'benefits' },
            { label: 'No income', sub: 'We\'ll ask a few questions to find the right path', guide: '__noincomeQ1' },
          ]}
          onSelect={g => g === '__noincomeQ1' ? setScreen('noincomeQ1') : setScreen(g)}
        />
      </DocItem>

      <DocItem checked={docs.i20} name="I-20 form" hint="Certificate of eligibility — issued by your university" onToggle={() => toggle('i20')}>
        <BranchOpts label="Where are you with your I-20?"
          opts={[
            { label: 'I have it but can\'t find it', sub: 'Request a reprint from your DSO office', guide: 'i20' },
            { label: 'I need a current-year copy', sub: 'Must be the most recent, valid I-20', guide: 'i20' },
          ]}
          onSelect={g => setScreen(g)}
        />
      </DocItem>
    </div>
  )

  // Domestic
  return (
    <div className="fade-in px-5 pt-5 pb-8 flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-1">Document collection</h2>
        <p className="text-sm text-gray-500 leading-relaxed">Check off what you have. For anything missing, we'll walk you through exactly how to get it.</p>
      </div>

      <DocItem checked={docs.d_id} name="Government-issued photo ID" hint="State ID, driver's license, or US passport" onToggle={() => toggle('d_id')} />

      <DocItem checked={docs.d_addr} name="Proof of NYC address" hint="Lease, utility bill, or bank statement" onToggle={() => toggle('d_addr')} />

      <DocItem checked={docs.d_income} name="Proof of income" hint="Pay stub, tax return, benefit letter, or self-attestation" onToggle={() => toggle('d_income')}>
        <BranchOpts label="What best describes your income situation?"
          opts={[
            { label: 'Employed — I have a job', sub: '4 most recent pay stubs required', guide: 'paystub' },
            { label: 'Self-employed or gig work', sub: 'Most recent tax return or 3 months bank statements', guide: '__gig' },
            { label: 'Receiving government benefits', sub: 'Benefit award letter from SSA, HRA, or DSS', guide: 'benefits' },
            { label: 'No income', sub: 'We\'ll ask a few questions to find the right path', guide: '__noincomeQ1' },
          ]}
          onSelect={g => g === '__noincomeQ1' ? setScreen('noincomeQ1') : g === '__gig' ? setScreen('noincomeQ2') : setScreen(g)}
        />
      </DocItem>

      <DocItem checked={docs.d_ssn} name="Social Security Number (SSN)" hint="SSN card, or SSA award letter showing your SSN" onToggle={() => toggle('d_ssn')}>
        <BranchOpts label="What's your situation with your SSN?"
          opts={[
            { label: 'I have one but lost my card', sub: 'You don\'t need the physical card — your number is enough', guide: 'ssn_lost' },
            { label: 'I\'ve never had an SSN', sub: 'We\'ll walk you through applying at the SSA', guide: 'ssn_apply' },
          ]}
          onSelect={g => setScreen(g)}
        />
      </DocItem>
    </div>
  )
}
