'use client'
import { ProgressProvider } from '@/store/ProgressContext'
import DocCollection from '@/components/docs/DocCollection'
export default function Page() {
  return (
    <ProgressProvider>
      <div className="px-0 pt-5">
        <div className="px-5 pb-3 flex items-center gap-3 border-b border-gray-100">
          <a href="/dashboard" className="flex items-center gap-1.5 text-sm text-purple-600 font-medium hover:text-purple-800 transition-colors">
            <i className="ti ti-arrow-left text-base" />
            Dashboard
          </a>
          <div className="h-4 w-px bg-gray-200" />
          <div>
            <p className="text-sm font-medium text-gray-900">Document collection</p>
            <p className="text-xs text-gray-400">Stage 4 of 8</p>
          </div>
        </div>
        <DocCollection />
      </div>
    </ProgressProvider>
  )
}
