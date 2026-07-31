'use client'
import { ProgressProvider } from '@/store/ProgressContext'
import Dashboard from '@/components/Dashboard'
export default function Page() {
  return <ProgressProvider><div className="w-full px-0 md:px-16 lg:px-32"><Dashboard /></div></ProgressProvider>
}
