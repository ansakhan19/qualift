'use client'
import { useRouter } from 'next/navigation'
import { ProgressProvider, useProgress } from '@/store/ProgressContext'
import EligibilityFlow from '@/components/EligibilityFlow'

function EligibilityPage() {
  const router = useRouter()
  const { reset } = useProgress()

  function handleStartFresh() {
    reset()
    // Hard navigation guarantees every component remounts with clean state
    window.location.href = '/'
  }

  return (
    <div className="px-0 pt-5">
      <div className="px-5 pb-3 flex items-center justify-between gap-3 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <a href="/dashboard" className="flex items-center gap-1.5 text-sm text-purple-600 font-medium hover:text-purple-800 transition-colors">
            <i className="ti ti-arrow-left text-base" />
            Dashboard
          </a>
          <div className="h-4 w-px bg-gray-200" />
          <div>
            <p className="text-sm font-medium text-gray-900">Eligibility check</p>
            <p className="text-xs text-gray-400">Stage 2 of 8</p>
          </div>
        </div>
        <button
          onClick={handleStartFresh}
          className="text-xs text-gray-400 hover:text-coral-600 border border-gray-200 hover:border-coral-200 rounded-lg px-2.5 py-1.5 transition-colors flex items-center gap-1"
          title="Clear all data and start over"
        >
          <i className="ti ti-refresh" />
          Start fresh
        </button>
      </div>
      <EligibilityFlow onComplete={() => router.push('/dashboard')} />
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
