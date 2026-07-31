'use client'
import { useRouter } from 'next/navigation'
import { ProgressProvider, useProgress } from '@/store/ProgressContext'
import EligibilityFlow from '@/components/EligibilityFlow'
import JourneyRail from '@/components/JourneyRail'
import SavingsTicker from '@/components/SavingsTicker'

function EligibilityPage() {
  const router = useRouter()
  const { reset, progress } = useProgress()

  function handleStartFresh() {
    reset()
    // Hard navigation guarantees every component remounts with clean state
    window.location.href = '/'
  }

  const railSection = progress.studentType ? 'qualify' : 'about'

  return (
    <div className="px-0 pt-5 flex flex-col min-h-dvh">
      <div className="px-5 pb-3 flex items-center justify-between gap-3 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <a href="/dashboard" className="flex items-center gap-1.5 text-sm text-purple-600 font-medium hover:text-purple-800 transition-colors">
            <i className="ti ti-arrow-left text-base" />
            Dashboard
          </a>
          <div className="h-4 w-px bg-gray-200" />
          <p className="text-sm font-medium text-gray-900">Do I qualify?</p>
        </div>
        <div className="flex items-center gap-2">
          <SavingsTicker />
          <button
            onClick={handleStartFresh}
            className="text-xs text-gray-400 hover:text-coral-600 border border-gray-200 hover:border-coral-200 rounded-lg px-2.5 py-1.5 transition-colors flex items-center gap-1"
            title="Clear all data and start over"
          >
            <i className="ti ti-refresh" />
            Start fresh
          </button>
        </div>
      </div>
      <div className="flex flex-1 items-stretch">
        <JourneyRail active={railSection} />
        <div className="flex-1 min-w-0">
          <div className="max-w-2xl mx-auto">
            <EligibilityFlow onComplete={() => router.push('/dashboard')} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <ProgressProvider>
      <EligibilityPage />
    </ProgressProvider>
  )
}
