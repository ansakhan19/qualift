'use client'
import { ProgressProvider } from '@/store/ProgressContext'
import AppWalkthrough from '@/components/walkthrough/AppWalkthrough'
export default function Page() {
  return <ProgressProvider><AppWalkthrough /></ProgressProvider>
}
