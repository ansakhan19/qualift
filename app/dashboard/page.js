'use client'
import { ProgressProvider } from '@/store/ProgressContext'
import Dashboard from '@/components/Dashboard'
export default function Page() {
  return <ProgressProvider><div className="max-w-2xl mx-auto"><Dashboard /></div></ProgressProvider>
}
