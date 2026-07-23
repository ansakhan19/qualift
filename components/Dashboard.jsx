'use client'
import { useRouter } from 'next/navigation'
import { useProgress } from '@/store/ProgressContext'

const STAGES = [
  { n: 1, icon: 'ti-user',             label: 'Your profile',           sub: p => p.studentType === 'international' ? 'International student · F-1 visa' : 'NYC resident' },
  { n: 2, icon: 'ti-shield-check',     label: 'Eligibility check',      sub: p => p.eligibility?.status === 'eligible' ? 'Income ≤ 100% FPL · Qualified' : 'Pending' },
  { n: 3, icon: 'ti-list-check',       label: 'Your document list',     sub: p => `${docTotal(p)} documents required for your profile` },
  { n: 4, icon: 'ti-file-description', label: 'Document collection',    sub: p => `${docDone(p)} of ${docTotal(p)} documents ready` },
  { n: 5, icon: 'ti-checklist',        label: 'All docs verified',      sub: () => 'Proceed when all documents are ready' },
  { n: 6, icon: 'ti-clipboard-check',  label: 'Readiness review',       sub: () => 'Final eligibility confirmation' },
  { n: 7, icon: 'ti-pencil',           label: 'Fill your application',  sub: () => 'Field-by-field walkthrough of HRA form' },
  { n: 8, icon: 'ti-send',             label: 'Submit to HRA',          sub: () => 'Your guide + direct link to HRA ACCESS' },
]

const STAGE_ROUTES = {
  1: '/eligibility',
  2: '/eligibility',
  3: '/docs',
  4: '/docs',
  5: '/docs',
  6: '/review',
  7: '/walkthrough',
  8: '/guide',
}

function docKeys(p) {
  return p.studentType === 'international'
    ? ['id', 'addr', 'income', 'i20']
    : ['d_id', 'd_addr', 'd_income', 'd_ssn']
}
function docTotal(p) { return docKeys(p).length }
function docDone(p)  { return docKeys(p).filter(k => p.docs?.[k]).length }

function pillsForStage4(p) {
  const isIntl = p.studentType === 'international'
  const items = isIntl
    ? [{ key:'id', label:'Photo ID' }, { key:'addr', label:'NYC address' }, { key:'income', label:'Income proof' }, { key:'i20', label:'I-20 form' }]
    : [{ key:'d_id', label:'Photo ID' }, { key:'d_addr', label:'NYC address' }, { key:'d_income', label:'Income proof' }, { key:'d_ssn', label:'SSN' }]
  return items.map(({ key, label }) => ({ label, done: !!p.docs?.[key] }))
}

export default function Dashboard() {
  const { progress, reset } = useProgress()
  const router              = useRouter()
  const current      = progress.currentStage || 1
  const keys         = docKeys(progress)
  const done         = keys.filter(k => progress.docs?.[k]).length
  const total        = keys.length
  const pct          = total ? Math.round((done / total) * 100) : 0

  function handleStageClick(stage) {
    const route = STAGE_ROUTES[stage]
    if (route) router.push(route)
  }

  const activeStage = STAGES.find(s => s.n === current) || STAGES[0]

  return (
    <div className="pb-nav">
      {/* Header */}
      <div className="px-5 pt-5 pb-0 flex justify-between items-start">
        <div>
          <p className="text-xs text-gray-400">Fair Fares readiness</p>
          <h1 className="text-xl font-medium text-gray-900 mt-0.5">Pick up where you left off</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-purple-50 border border-purple-200 rounded-full px-3 py-1 text-xs text-purple-600 font-medium">
            {pct}% ready
          </div>
          <button
            onClick={() => { reset(); window.location.href = '/' }}
            className="text-xs text-gray-400 hover:text-coral-600 border border-gray-200 hover:border-coral-200 rounded-lg px-2.5 py-1.5 transition-colors flex items-center gap-1"
            title="Clear all data and start over"
          >
            <i className="ti ti-refresh" />
            Start fresh
          </button>
        </div>
      </div>

      {/* Progress card */}
      <div className="mx-5 mt-4 bg-gray-50 border border-gray-200 rounded-xl p-4">
        <p className="text-xs font-medium tracking-wide text-gray-400 mb-1">APPLICATION READINESS</p>
        <p className="text-sm font-medium text-gray-900 mb-3">Documents: {done} of {total} collected</p>
        <div className="bg-gray-200 rounded-full h-2">
          <div className="bg-purple-400 h-2 rounded-full bar-fill" style={{ width: `${pct}%` }} />
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1.5">
          <span>Stage {current} of 8</span>
          <span className="text-purple-600 font-medium">{done === total && total > 0 ? 'All docs ready!' : 'In progress'}</span>
        </div>
      </div>

      {/* Continue button */}
      <div className="mx-5 mt-3">
        <button
          onClick={() => handleStageClick(current)}
          className="w-full bg-purple-400 hover:bg-purple-600 text-white rounded-xl py-3.5 text-sm font-medium transition-colors"
        >
          Continue → {activeStage.label}
        </button>
      </div>

      {/* Stage path */}
      <p className="text-xs font-medium tracking-wide text-gray-400 px-5 pt-5 pb-2">YOUR JOURNEY</p>
      <div className="px-5 flex flex-col">
        {STAGES.map((stage, i) => {
          const isDone   = stage.n < current
          const isActive = stage.n === current
          const isLocked = stage.n > current
          return (
            <div key={stage.n} className="flex items-stretch gap-0">
              {/* Spine */}
              <div className="flex flex-col items-center w-10 flex-shrink-0">
                <div className={`w-0.5 flex-1 min-h-2 ${i === 0 ? 'bg-transparent' : isDone || isActive ? 'bg-purple-400' : 'bg-gray-200'}`} />
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${
                  isDone   ? 'bg-purple-400 text-white' :
                  isActive ? 'bg-purple-50 border-2 border-purple-400 text-purple-600' :
                             'bg-gray-100 border border-gray-200 text-gray-300'
                }`}>
                  {isDone ? <i className="ti ti-check" /> : <i className={`ti ${stage.icon}`} />}
                </div>
                <div className={`w-0.5 flex-1 min-h-2 ${i === STAGES.length - 1 ? 'bg-transparent' : isDone ? 'bg-purple-400' : 'bg-gray-200'}`} />
              </div>

              {/* Card */}
              <div
                onClick={() => handleStageClick(stage.n)}
                className={`flex-1 ml-3 mb-2 p-3 rounded-xl border transition-all cursor-pointer ${
                  isActive ? 'bg-purple-50 border-purple-300' :
                  isDone   ? 'bg-gray-50 border-gray-200 hover:bg-gray-100' :
                             'bg-gray-50 border-gray-100 hover:bg-gray-100'
                }`}
              >
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium text-gray-900">{stage.label}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    isDone   ? 'bg-teal-50 text-teal-700' :
                    isActive ? 'bg-purple-400 text-white' :
                               'bg-gray-100 text-gray-500 border border-gray-200'
                  }`}>
                    {isDone ? 'Done' : isActive ? 'In progress' : 'Up next'}
                  </span>
                </div>
                <p className="text-xs mt-1 text-gray-500">
                  {stage.sub(progress)}
                </p>

                {/* Doc pills for stage 4 */}
                {stage.n === 4 && isActive && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {pillsForStage4(progress).map(pill => (
                      <span key={pill.label} className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${pill.done ? 'bg-teal-50 text-teal-700' : 'bg-coral-50 text-coral-700'}`}>
                        <i className={`ti ti-${pill.done ? 'check' : 'x'} text-xs`} />
                        {pill.label}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Tip */}
      {current === 4 && done < total && (
        <div className="mx-5 mt-2 bg-purple-50 border border-purple-200 rounded-xl p-3 flex gap-2">
          <i className="ti ti-bulb text-purple-400 text-lg flex-shrink-0 mt-0.5" />
          <p className="text-xs text-purple-800 leading-relaxed">
            <strong>Up next:</strong> Collect your remaining documents — tap "Document collection" above to continue.
          </p>
        </div>
      )}
    </div>
  )
}
