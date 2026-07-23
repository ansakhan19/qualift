'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ProgressProvider } from '@/store/ProgressContext'
import { useProgress } from '@/store/ProgressContext'
import Splash from '@/components/Splash'
import EligibilityFlow from '@/components/EligibilityFlow'

function Home() {
  const { reset } = useProgress()
  const [view, setView] = useState('splash')
  const router = useRouter()

  function handleStart() {
    // Always reset before starting — critical for shared devices / event use
    reset()
    setView('eligibility')
  }

  if (view === 'splash') return <Splash onStart={handleStart} />
  return <EligibilityFlow onComplete={() => router.push('/dashboard')} />
}

export default function Page() {
  return (
    <ProgressProvider>
      <Home />
    </ProgressProvider>
  )
}
