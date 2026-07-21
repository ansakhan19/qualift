'use client'
import { ProgressProvider } from '@/store/ProgressContext'
import ReadinessReview from '@/components/ReadinessReview'
export default function Page() {
  return <ProgressProvider><ReadinessReview /></ProgressProvider>
}
