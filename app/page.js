'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ProgressProvider } from '@/store/ProgressContext'
import Splash from '@/components/Splash'
import EligibilityFlow from '@/components/EligibilityFlow'

function Home() {
  const [view, setView] = useState('splash') // 'splash' | 'eligibility'
  const router = useRouter()

  function handleComplete() {
    router.push('/dashboard')
  }

  if (view === 'splash') return <Splash onStart={() => setView('eligibility')} />
  return <EligibilityFlow onComplete={handleComplete} />
}

export default function Page() {
  return (
    <ProgressProvider>
      <Home />
    </ProgressProvider>
  )
}
