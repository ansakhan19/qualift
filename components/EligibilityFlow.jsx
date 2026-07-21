'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useProgress } from '@/store/ProgressContext'
import { getFPL, isEligibleByIncome } from '@/lib/fpl'
import SaveProgress from './SaveProgress'

const INELIG = {
  residency: {
    title: 'Fair Fares is only for NYC residents',
    reason: "You need to live in one of the five NYC boroughs to qualify. If you recently moved, you can apply once you have proof of your NYC address.",
    tag: 'Residency requirement not met',
  },
  age: {
    title: 'Fair Fares requires applicants to be 18 or older',
    reason: "If you're under 18, you may be eligible for a free NYC DOE Student MetroCard through your school instead.",
    tag: 'Age requirement not met',
  },
  existing: {
    title: 'You already have a reduced-fare transit benefit',
    reason: "Fair Fares can't be combined with an MTA Reduced-Fare or OMNY reduced-fare benefit. If Fair Fares would save you more, cancel your current benefit first, then apply.",
    tag: 'Existing benefit conflict',
  },
  income: {
    title: 'Your income may be above the Fair Fares limit',
    reason: "Fair Fares is for households at or below 100% of the Federal Poverty Level. There are other programs that may still help.",
    tag: 'Income above 100% FPL',
  },
}

const ORGS = {
  residency: [
    { name: '211.org', desc: 'Find transit and benefit programs in your area by zip code.', tag: 'Local resources' },
    { name: 'Your local transit authority', desc: 'Most cities offer reduced-fare programs similar to Fair Fares.', tag: 'Transit help' },
  ],
  age: [
    { name: 'NYC DOE Student MetroCard', desc: "Enrolled in a NYC school? You may qualify for a free Student MetroCard.", tag: 'For students under 18' },
    { name: 'ACCESS NYC', desc: 'Find youth-specific benefit programs for New Yorkers under 18.', tag: 'Youth benefits' },
  ],
  existing: [
    { name: 'MTA Customer Service', desc: 'Call 511 to understand your current benefit and whether switching to Fair Fares makes sense.', tag: 'MTA help line' },
  ],
  income: [
    { name: 'ACCESS NYC', desc: 'Check every NYC benefit you may qualify for — housing, food, health, and transit.', tag: 'Benefits navigator', url: 'access.nyc.gov' },
    { name: 'NYC 311', desc: 'Call or text 311 to speak with a benefits counselor.', tag: 'Free hotline' },
    { name: 'Met Council', desc: 'Free benefits enrollment help regardless of background.', tag: 'In-person help' },
    { name: 'Legal Aid Society', desc: 'Free legal help for low-income New Yorkers, including benefits appeals.', tag: 'Legal support' },
  ],
}

// ── Sub-screens ──────────────────────────────────────────────────

function Question({ step, total, question, sub, options, onAnswer, onBack }) {
  return (
    <div className="fade-in flex flex-col h-full">
      <div className="px-5 pt-5">
        {onBack && (
          <button onClick={onBack} className="text-gray-400 text-xl mb-4 flex items-center">
            <i className="ti ti-arrow-left" />
          </button>
        )}
        <div className="bg-gray-100 rounded-full h-1 mb-1">
          <div className="bg-purple-400 h-1 rounded-full bar-fill" style={{ width: `${(step / total) * 100}%` }} />
        </div>
        <p className="text-xs text-gray-400 mt-1 mb-6">Question {step} of {total}</p>
        <h2 className="text-lg font-medium text-gray-900 leading-snug mb-2">{question}</h2>
        {sub && <p className="text-sm text-gray-500 leading-relaxed mb-6">{sub}</p>}
      </div>
      <div className="px-5 flex flex-col gap-3">
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={() => onAnswer(opt.value)}
            className="text-left border border-gray-200 rounded-xl p-4 bg-gray-50 hover:border-purple-400 hover:bg-purple-50 transition-all"
          >
            <p className="text-sm font-medium text-gray-900">{opt.label}</p>
            {opt.sub && <p className="text-xs text-gray-500 mt-1">{opt.sub}</p>}
          </button>
        ))}
      </div>
    </div>
  )
}

function IncomeSlider({ householdSize, onSubmit, onBack }) {
  const fpl  = getFPL(householdSize)
  const [val, setVal] = useState(Math.round(fpl * 0.7))
  const under = val <= fpl
  const pct   = Math.round((val / fpl) * 100)

  return (
    <div className="fade-in flex flex-col h-full px-5 pt-5">
      <button onClick={onBack} className="text-gray-400 text-xl mb-4 flex items-center">
        <i className="ti ti-arrow-left" />
      </button>
      <div className="bg-gray-100 rounded-full h-1 mb-1">
        <div className="bg-purple-400 h-1 rounded-full bar-fill" style={{ width: '100%' }} />
      </div>
      <p className="text-xs text-gray-400 mt-1 mb-6">Question 6 of 6</p>
      <h2 className="text-lg font-medium text-gray-900 mb-2">What is your approximate annual household income?</h2>
      <p className="text-sm text-gray-500 leading-relaxed mb-6">
        Include all income from all household members before taxes.
      </p>

      <input
        type="range" min="0" max={fpl * 3} step="500"
        value={val} onChange={e => setVal(Number(e.target.value))}
        className="w-full mb-4"
      />
      <div className="text-center mb-4">
        <p className="text-3xl font-medium text-gray-900">${val.toLocaleString()}</p>
        <p className="text-xs text-gray-400 mt-1">per year, before taxes</p>
      </div>
      <div className={`rounded-xl px-4 py-3 text-sm font-medium text-center mb-6 ${under ? 'bg-teal-50 text-teal-800' : 'bg-coral-50 text-coral-800'}`}>
        {under
          ? `✓ At or below 100% FPL for a household of ${householdSize} — you may qualify`
          : `↑ ${pct}% of FPL for a household of ${householdSize} — above the Fair Fares limit`}
      </div>
      <button
        onClick={() => onSubmit(val)}
        className="w-full bg-purple-400 hover:bg-purple-600 text-white rounded-xl py-3.5 text-sm font-medium transition-colors mt-auto"
      >
        See my result →
      </button>
    </div>
  )
}

function MetroCardReveal({ studentType, onContinue }) {
  return (
    <div className="fade-in px-5 pt-5">
      <div className={`rounded-2xl p-5 mb-5 ${studentType === 'international' ? 'bg-purple-50 border border-purple-200' : 'bg-teal-50 border border-teal-100'}`}>
        <p className="text-xs font-medium tracking-wide text-purple-600 mb-2">
          {studentType === 'international' ? 'INTERNATIONAL STUDENT PATH' : 'NYC RESIDENT PATH'}
        </p>
        <h2 className="text-lg font-medium text-gray-900 mb-1">Fair Fares — 50% off MetroCard</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          {studentType === 'international'
            ? 'As an international student, you can qualify for Fair Fares. It does not trigger public charge — your visa status is safe.'
            : 'As an NYC resident, you can qualify for Fair Fares based on your household income.'}
        </p>
      </div>
      <div className="flex gap-3 mb-5">
        <div className="flex-1 bg-white border border-gray-200 rounded-xl p-3 text-center">
          <p className="text-lg font-medium text-gray-900">$17</p>
          <p className="text-xs text-gray-500">7-Day Unlimited</p>
          <p className="text-xs text-gray-400">(was $34)</p>
        </div>
        <div className="flex-1 bg-white border border-gray-200 rounded-xl p-3 text-center">
          <p className="text-lg font-medium text-gray-900">$1.65</p>
          <p className="text-xs text-gray-500">Per trip</p>
          <p className="text-xs text-gray-400">(was $2.90)</p>
        </div>
      </div>
      <button
        onClick={onContinue}
        className="w-full bg-purple-400 hover:bg-purple-600 text-white rounded-xl py-3.5 text-sm font-medium transition-colors"
      >
        Check my eligibility →
      </button>
    </div>
  )
}

function IneligibleScreen({ reason, onRestart }) {
  const copy = INELIG[reason] || INELIG.income
  const orgs = ORGS[reason] || ORGS.income
  return (
    <div className="fade-in">
      <div className="px-5 pt-6 pb-4 border-b border-gray-100">
        <div className="w-12 h-12 rounded-full bg-coral-50 border border-coral-100 flex items-center justify-center text-coral-600 text-xl mb-3">
          <i className="ti ti-x" />
        </div>
        <h2 className="text-lg font-medium text-gray-900 mb-2">{copy.title}</h2>
        <p className="text-sm text-gray-500 leading-relaxed mb-3">{copy.reason}</p>
        <span className="inline-flex items-center gap-1.5 bg-coral-50 border border-coral-100 rounded-lg px-3 py-1.5 text-xs text-coral-800 font-medium">
          <i className="ti ti-info-circle" /> {copy.tag}
        </span>
      </div>
      <div className="px-5 py-4">
        <p className="text-xs font-medium tracking-wide text-gray-400 mb-3">
          {reason === 'income' ? 'OTHER PROGRAMS THAT MAY HELP' : 'ORGANIZATIONS THAT CAN HELP'}
        </p>
        <div className="flex flex-col gap-3">
          {orgs.map((o, i) => (
            <div key={i} className="bg-gray-50 border border-gray-200 rounded-xl p-3">
              <p className="text-sm font-medium text-gray-900">{o.name}</p>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">{o.desc}</p>
              <span className="inline-block mt-2 text-xs bg-purple-50 text-purple-600 rounded-full px-2 py-0.5">{o.tag}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="px-5 pb-6">
        <button onClick={onRestart} className="w-full border border-gray-200 rounded-xl py-3 text-sm text-gray-500 hover:border-purple-300 hover:text-purple-600 transition-colors">
          <i className="ti ti-refresh mr-1" /> Check again with different answers
        </button>
      </div>
    </div>
  )
}

function CashAssistScreen() {
  return (
    <div className="fade-in px-5 pt-8 text-center">
      <div className="w-16 h-16 rounded-full bg-teal-50 border-2 border-teal-400 flex items-center justify-center text-teal-700 text-2xl mx-auto mb-4">
        <i className="ti ti-credit-card" />
      </div>
      <h2 className="text-xl font-medium text-gray-900 mb-2">Good news — you already qualify for a free MetroCard</h2>
      <p className="text-sm text-gray-500 leading-relaxed mb-6">
        NYC Cash Assistance recipients get a free unlimited MetroCard through HRA. You don't need Fair Fares.
      </p>
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-left mb-4">
        <p className="text-sm font-medium text-gray-900 mb-2">How to get your HRA MetroCard</p>
        <p className="text-sm text-gray-500 leading-relaxed">
          Log into <strong>ACCESS HRA</strong> → "My Benefits." Your MetroCard benefit should appear there.
          If not, call your HRA caseworker or 718-557-1399.
        </p>
      </div>
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-left">
        <p className="text-sm font-medium text-gray-900 mb-2">Can't access online? Visit HRA in person</p>
        <p className="text-sm text-gray-500 leading-relaxed">
          Bring your EBT card and case number to any HRA Benefits Access Center — staff can issue or reactivate your MetroCard on the spot.
        </p>
      </div>
    </div>
  )
}

function EligibleScreen({ progress, onContinue }) {
  const { eligibility } = progress
  const fpl = getFPL(eligibility.householdSize || 1)
  return (
    <div className="fade-in px-5 pt-8 text-center">
      <div className="w-16 h-16 rounded-full bg-purple-50 border-2 border-purple-400 flex items-center justify-center text-purple-600 text-3xl mx-auto mb-4">
        <i className="ti ti-check" />
      </div>
      <h2 className="text-xl font-medium text-gray-900 mb-2">You qualify for Fair Fares</h2>
      <p className="text-sm text-gray-500 leading-relaxed mb-5">Based on your answers, you meet all eligibility requirements.</p>
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-left mb-6">
        <p className="text-xs font-medium tracking-wide text-purple-600 mb-2">YOUR ELIGIBILITY SUMMARY</p>
        {[
          ['NYC resident', '✓ Yes'],
          ['Age 18+', '✓ Yes'],
          ['Household size', `${eligibility.householdSize || 1} ${(eligibility.householdSize || 1) === 1 ? 'person' : 'people'}`],
          ['Annual income', `$${(eligibility.annualIncome || 0).toLocaleString()}`],
          [`FPL limit (${eligibility.householdSize || 1}-person)`, `$${fpl.toLocaleString()}`],
          ['No conflicting benefits', '✓ Confirmed'],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between py-1 text-sm">
            <span className="text-gray-500">{k}</span>
            <span className="font-medium text-purple-800">{v}</span>
          </div>
        ))}
      </div>
      <button onClick={onContinue} className="w-full bg-purple-400 hover:bg-purple-600 text-white rounded-xl py-3.5 text-sm font-medium transition-colors">
        Start my application →
      </button>
    </div>
  )
}

function CheckEmail({ email, onContinue }) {
  return (
    <div className="fade-in px-5 pt-10 text-center">
      <div className="w-16 h-16 rounded-full bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 text-2xl mx-auto mb-4">
        <i className="ti ti-mail" />
      </div>
      <h2 className="text-xl font-medium text-gray-900 mb-2">Check your email</h2>
      <p className="text-sm text-gray-500 mb-2">We sent a link to</p>
      <p className="text-sm font-medium text-purple-700 bg-purple-50 rounded-lg px-4 py-2 inline-block mb-6">{email}</p>
      <div className="flex flex-col gap-3 text-left mb-6">
        {[
          ['Open the email from Qualift', 'Check your spam folder if you don't see it within 2 minutes.'],
          ['Tap "Continue my application"', 'Works on any device, any browser.'],
          ['You'll land right back here', 'Progress is fully restored.'],
        ].map(([title, sub], i) => (
          <div key={i} className="flex gap-3 items-start bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
            <div className="w-6 h-6 rounded-full bg-purple-400 text-white text-xs font-medium flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</div>
            <div>
              <p className="text-sm font-medium text-gray-900">{title}</p>
              <p className="text-xs text-gray-500 mt-0.5">{sub}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-400 mb-4">Link expires in 7 days. You can always request a new one from the home screen.</p>
      <button onClick={onContinue} className="w-full bg-purple-400 hover:bg-purple-600 text-white rounded-xl py-3.5 text-sm font-medium transition-colors">
        Continue anyway →
      </button>
    </div>
  )
}

// ── Main EligibilityFlow ─────────────────────────────────────────

export default function EligibilityFlow({ onComplete }) {
  const { progress, updateEligibility, setProgress, advanceStage } = useProgress()
  const router = useRouter()

  // screen: 'studentType'|'metroReveal'|'savePrompt'|'checkEmail'|
  //         'q_age'|'q_cashAssist'|'q_existing'|'q_household'|'incomeSlider'|
  //         'eligible'|'ineligible'|'cashAssist'
  const [screen, setScreen]         = useState('studentType')
  const [ineligReason, setIneligReason] = useState(null)
  const [savedEmail, setSavedEmail]   = useState(null)

  function handleStudentType(type) {
    setProgress(p => ({ ...p, studentType: type, currentStage: 1 }))
    setScreen('metroReveal')
  }

  // After metro reveal → save prompt (first motivating moment)
  function handleMetroNext() {
    setScreen('savePrompt')
  }

  function handleSaved(email) {
    setSavedEmail(email)
    setScreen('checkEmail')
  }

  function handleSkipSave() {
    setScreen('q_age')
  }

  function handleCheckEmailContinue() {
    setScreen('q_age')
  }

  function handleAge(val) {
    updateEligibility({ age18Plus: val })
    if (!val) { setIneligReason('age'); setScreen('ineligible'); return }
    setScreen('q_cashAssist')
  }

  function handleCashAssist(val) {
    updateEligibility({ cashAssist: val })
    if (val) { setScreen('cashAssist'); return }
    setScreen('q_existing')
  }

  function handleExisting(val) {
    updateEligibility({ existingBenefit: val })
    if (val) { setIneligReason('existing'); setScreen('ineligible'); return }
    setScreen('q_household')
  }

  function handleHousehold(val) {
    updateEligibility({ householdSize: val })
    setScreen('incomeSlider')
  }

  function handleIncome(val) {
    const hhSize = progress.eligibility.householdSize || 1
    const eligible = isEligibleByIncome(val, hhSize)
    updateEligibility({ annualIncome: val, status: eligible ? 'eligible' : 'ineligible', ineligReason: eligible ? null : 'income' })
    if (!eligible) { setIneligReason('income'); setScreen('ineligible'); return }
    updateEligibility({ status: 'eligible' })
    advanceStage(2)
    setScreen('eligible')
  }

  function handleComplete() {
    advanceStage(2)
    onComplete()
  }

  const Q_TOTAL = 5  // age, cashAssist, existing, household, income

  if (screen === 'studentType') return (
    <div className="fade-in px-5 pt-6">
      <h2 className="text-xl font-medium text-gray-900 mb-2">Are you an international student?</h2>
      <p className="text-sm text-gray-500 leading-relaxed mb-6">
        This determines which documents you'll need and which MetroCard benefits you're eligible for.
      </p>
      <div className="flex flex-col gap-3">
        {[
          { label: 'Yes — I'm an international student', sub: 'F-1, J-1, or other student visa', val: 'international' },
          { label: 'No — I'm an NYC resident', sub: 'US citizen, green card, or other status', val: 'domestic' },
        ].map(o => (
          <button key={o.val} onClick={() => handleStudentType(o.val)}
            className="text-left border border-gray-200 rounded-xl p-4 bg-gray-50 hover:border-purple-400 hover:bg-purple-50 transition-all">
            <p className="text-sm font-medium text-gray-900">{o.label}</p>
            <p className="text-xs text-gray-500 mt-1">{o.sub}</p>
          </button>
        ))}
      </div>
    </div>
  )

  if (screen === 'metroReveal') return (
    <MetroCardReveal studentType={progress.studentType} onContinue={handleMetroNext} />
  )

  if (screen === 'savePrompt') return (
    <SaveProgress
      context={
        <div className="text-sm text-purple-800">
          <div className="flex justify-between py-0.5"><span>Student type</span><strong>{progress.studentType === 'international' ? 'International student' : 'NYC resident'}</strong></div>
          <div className="flex justify-between py-0.5"><span>NYC resident</span><strong>✓ Confirmed</strong></div>
        </div>
      }
      onSaved={handleSaved}
      onSkip={handleSkipSave}
    />
  )

  if (screen === 'checkEmail') return (
    <CheckEmail email={savedEmail} onContinue={handleCheckEmailContinue} />
  )

  if (screen === 'q_age') return (
    <Question step={1} total={Q_TOTAL}
      question="Are you 18 years old or older?"
      sub="Fair Fares requires applicants to be 18 or older. Under 18? Your school may provide a free Student MetroCard."
      options={[
        { label: 'Yes, I'm 18 or older', value: true },
        { label: 'No, I'm under 18', value: false },
      ]}
      onAnswer={handleAge}
      onBack={() => setScreen('savePrompt')}
    />
  )

  if (screen === 'q_cashAssist') return (
    <Question step={2} total={Q_TOTAL}
      question="Are you currently receiving Cash Assistance from HRA?"
      sub="Cash Assistance (Public Assistance) recipients already qualify for a free MetroCard — you may not need Fair Fares at all."
      options={[
        { label: 'No, I don't receive Cash Assistance', value: false },
        { label: 'Yes, I receive Cash Assistance', value: true },
      ]}
      onAnswer={handleCashAssist}
      onBack={() => setScreen('q_age')}
    />
  )

  if (screen === 'q_existing') return (
    <Question step={3} total={Q_TOTAL}
      question="Do you currently have an MTA Reduced-Fare or OMNY reduced-fare benefit?"
      sub="This is the senior or disability transit discount — not a regular MetroCard. Most people select No."
      options={[
        { label: 'No, I don't have a reduced-fare benefit', value: false },
        { label: 'Yes, I have an existing reduced-fare benefit', value: true },
      ]}
      onAnswer={handleExisting}
      onBack={() => setScreen('q_cashAssist')}
    />
  )

  if (screen === 'q_household') return (
    <Question step={4} total={Q_TOTAL}
      question="How many people live in your household?"
      sub="Include everyone who lives with you and shares expenses, including yourself."
      options={[1,2,3,4,5].map(n => ({
        label: n === 1 ? '1 — I live alone' : `${n} people`,
        value: n,
      }))}
      onAnswer={handleHousehold}
      onBack={() => setScreen('q_existing')}
    />
  )

  if (screen === 'incomeSlider') return (
    <IncomeSlider
      householdSize={progress.eligibility.householdSize || 1}
      onSubmit={handleIncome}
      onBack={() => setScreen('q_household')}
    />
  )

  if (screen === 'eligible') return <EligibleScreen progress={progress} onContinue={handleComplete} />
  if (screen === 'cashAssist') return <CashAssistScreen />
  if (screen === 'ineligible') return <IneligibleScreen reason={ineligReason} onRestart={() => setScreen('studentType')} />

  return null
}
