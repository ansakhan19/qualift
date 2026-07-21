'use client'
import { useRouter } from 'next/navigation'
import { ProgressProvider } from '@/store/ProgressContext'
import EligibilityFlow from '@/components/EligibilityFlow'

function EligibilityPage() {
  const router = useRouter()
  return <EligibilityFlow onComplete={() => router.push('/dashboard')} />
}

export default function Page() {
  return (
    <ProgressProvider>
      <EligibilityPage />
    </ProgressProvider>
  )
}
