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
    // Always reset before starting, critical for shared devices / event use
    reset()
    setView('eligibility')
  }

  if (view === 'splash') return <div className="w-full md:px-16 lg:px-40"><Splash onStart={handleStart} /></div>
  return <div className="w-full md:px-12 lg:px-24"><EligibilityFlow onComplete={() => router.push('/dashboard')} /></div>
}

export default function Page() {
  return (
    <ProgressProvider>
      <Home />
    </ProgressProvider>
  )
}
