'use client'
import { useRouter } from 'next/navigation'
import { ProgressProvider } from '@/store/ProgressContext'
import EligibilityFlow from '@/components/EligibilityFlow'

function EligibilityPage() {
  const router = useRouter()
  return (
    <div className="px-0 pt-5">
      <div className="px-5 pb-3 flex items-center gap-3 border-b border-gray-100">
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
