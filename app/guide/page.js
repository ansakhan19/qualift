'use client'
import { ProgressProvider } from '@/store/ProgressContext'
import SubmissionGuide from '@/components/SubmissionGuide'
export default function Page() {
  return <ProgressProvider><div className="px-0 pt-5"><div className="px-5 pb-4 flex items-center gap-3 border-b border-gray-100"><a href="/dashboard" className="text-gray-400 text-xl"><i className="ti ti-arrow-left"/></a><p className="text-base font-medium text-gray-900">Submission guide</p></div><SubmissionGuide /></div></ProgressProvider>
}
