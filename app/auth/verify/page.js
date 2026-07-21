'use client'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ProgressProvider, useProgress } from '@/store/ProgressContext'

function VerifyInner() {
  const params   = useSearchParams()
  const router   = useRouter()
  const { setProgress } = useProgress()
  const [status, setStatus] = useState('verifying') // 'verifying'|'ok'|'error'
  const [error,  setError]  = useState('')

  useEffect(() => {
    const token = params.get('token')
    if (!token) { setStatus('error'); setError('No token found in link.'); return }
    fetch(`/api/verify-token?token=${token}`)
      .then(r => r.json())
      .then(data => {
        if (!data.ok) throw new Error(data.error || 'Invalid link')
        setProgress(p => ({ ...p, ...data.progress, sessionId: data.sessionId, email: data.email }))
        setStatus('ok')
        setTimeout(() => router.push('/dashboard'), 1200)
      })
      .catch(err => { setStatus('error'); setError(err.message) })
  }, [])

  if (status === 'verifying') return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
      <div className="w-12 h-12 rounded-full border-2 border-purple-400 border-t-transparent animate-spin mb-4" />
      <p className="text-sm text-gray-500">Restoring your progress…</p>
    </div>
  )

  if (status === 'ok') return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
      <div className="w-16 h-16 rounded-full bg-teal-50 border-2 border-teal-400 flex items-center justify-center text-teal-700 text-3xl mb-4">
        <i className="ti ti-check" />
      </div>
      <h1 className="text-xl font-medium text-gray-900 mb-2">Welcome back</h1>
      <p className="text-sm text-gray-500">Your progress is restored. Taking you to your dashboard…</p>
    </div>
  )

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
      <div className="w-16 h-16 rounded-full bg-coral-50 border-2 border-coral-100 flex items-center justify-center text-coral-600 text-3xl mb-4">
        <i className="ti ti-x" />
      </div>
      <h1 className="text-xl font-medium text-gray-900 mb-2">This link has expired</h1>
      <p className="text-sm text-gray-500 mb-6 leading-relaxed">{error || 'Magic links expire after 7 days. Request a new one from the home screen.'}</p>
      <a href="/" className="bg-purple-400 text-white rounded-xl px-6 py-3 text-sm font-medium">Back to home</a>
    </div>
  )
}

export default function VerifyPage() {
  return <ProgressProvider><VerifyInner /></ProgressProvider>
}
