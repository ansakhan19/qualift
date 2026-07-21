'use client'
import { ProgressProvider } from '@/store/ProgressContext'
import DocCollection from '@/components/docs/DocCollection'
export default function Page() {
  return <ProgressProvider><div className="px-0 pt-5"><div className="px-5 pb-2 flex items-center gap-3 border-b border-gray-100"><a href="/dashboard" className="text-gray-400 text-xl"><i className="ti ti-arrow-left"/></a><div><p className="text-base font-medium text-gray-900">Document collection</p><p className="text-xs text-gray-400">Stage 4 of 8</p></div></div><DocCollection /></div></ProgressProvider>
}
