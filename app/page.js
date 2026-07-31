'use client'
import { useRouter } from 'next/navigation'
import { ProgressProvider } from '@/store/ProgressContext'
import { useProgress } from '@/store/ProgressContext'
import Splash from '@/components/Splash'

function Home() {
  const { reset } = useProgress()
  const router = useRouter()

  function handleStart() {
    // Always reset before starting, critical for shared devices / event use
    reset()
    // Send everyone through the real eligibility page so they get the
    // journey rail, header, and back navigation on every question
    router.push('/eligibility')
  }

  return <div className="w-full md:px-16 lg:px-40"><Splash onStart={handleStart} /></div>
}

export default function Page() {
  return (
    <ProgressProvider>
      <Home />
    </ProgressProvider>
  )
}
