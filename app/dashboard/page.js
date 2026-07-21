'use client'
import { ProgressProvider } from '@/store/ProgressContext'
import Dashboard from '@/components/Dashboard'
export default function Page() {
  return <ProgressProvider><Dashboard /></ProgressProvider>
}
