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

  if (view === 'splash') return <div className="max-w-xl mx-auto"><Splash onStart={handleStart} /></div>
  return <div className="max-w-2xl mx-auto"><EligibilityFlow onComplete={() => router.push('/dashboard')} /></div>
}

export default function Page() {
  return (
    <ProgressProvider>
      <Home />
    </ProgressProvider>
  )
}
