'use client'
import { useState } from 'react'

export default function Splash({ onStart, onReturnEmail }) {
  const [returnEmail, setReturnEmail] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleReturn(e) {
    e.preventDefault()
    if (!returnEmail.includes('@')) { setError('Enter a valid email'); return }
    setSending(true); setError('')
    try {
      const r = await fetch('/api/send-magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: returnEmail }),
      })
      if (!r.ok) throw new Error()
      setSent(true)
    } catch {
      setError('Something went wrong — try again')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-12 text-center">
        {/* Logo */}
        <div className="w-16 h-16 rounded-2xl bg-purple-400 flex items-center justify-center mb-5">
          <i className="ti ti-bolt text-white text-3xl" />
        </div>

        <h1 className="text-2xl font-medium text-gray-900 leading-tight mb-3">
          Get 50% off every subway and bus ride
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed max-w-xs mb-4">
          Qualift walks you through the Fair Fares application — from eligibility to submission — at your own pace.
        </p>

        {/* Fare comparison — the value, up front */}
        <div className="flex gap-3 w-full mb-4">
          <div className="flex-1 bg-purple-50 border border-purple-200 rounded-xl p-3 text-center">
            <p className="text-lg font-medium text-purple-800">$1.50</p>
            <p className="text-xs text-purple-600">per ride with Fair Fares</p>
            <p className="text-xs text-gray-400 line-through">$3.00 regular</p>
          </div>
          <div className="flex-1 bg-purple-50 border border-purple-200 rounded-xl p-3 text-center">
            <p className="text-lg font-medium text-purple-800">$17.50</p>
            <p className="text-xs text-purple-600">weekly fare cap</p>
            <p className="text-xs text-gray-400 line-through">$35 regular</p>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 bg-teal-50 border border-teal-400 rounded-full px-3 py-1.5 text-xs text-teal-800 mb-6">
          <i className="ti ti-shield-check" />
          Free · No account required · Takes ~10 min
        </div>

        <button
          onClick={onStart}
          className="w-full bg-purple-400 hover:bg-purple-600 text-white rounded-xl py-4 text-sm font-medium transition-colors mb-3"
        >
          Check if I qualify →
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 w-full my-2">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">already started?</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Returning user */}
        <div className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-left mt-2">
          <p className="text-xs font-medium text-gray-700 mb-1">Continue where you left off</p>
          <p className="text-xs text-gray-500 mb-3 leading-relaxed">
            Enter your email and we'll send a link to resume on any device.
          </p>
          {sent ? (
            <div className="flex items-center gap-2 text-teal-700 text-xs font-medium bg-teal-50 rounded-lg px-3 py-2">
              <i className="ti ti-check" /> Link sent — check your inbox
            </div>
          ) : (
            <form onSubmit={handleReturn} className="flex gap-2">
              <input
                type="email"
                value={returnEmail}
                onChange={e => setReturnEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple-400 bg-white"
              />
              <button
                type="submit"
                disabled={sending}
                className="bg-purple-400 hover:bg-purple-600 text-white rounded-lg px-3 py-2 text-sm font-medium transition-colors disabled:opacity-50"
              >
                {sending ? '…' : 'Send'}
              </button>
            </form>
          )}
          {error && <p className="text-xs text-coral-600 mt-2">{error}</p>}
        </div>
      </div>

      <p className="text-center text-xs text-gray-400 px-6 pb-6 leading-relaxed">
        Qualift is free and not affiliated with HRA or the MTA.
        Your email is only used to restore your progress.
      </p>
    </div>
  )
}
