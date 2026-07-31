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
      setError('Something went wrong, try again')
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

        <p className="text-sm font-medium text-purple-600 mb-2">Hi there 👋</p>
        <h1 className="text-2xl font-medium text-gray-900 leading-tight mb-3">
          Let's get you 50% off every subway and bus ride
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed max-w-xs mb-4">
          Answer a few questions, about 10 minutes. We'll tell you if you qualify and walk you through the whole application.
        </p>

        {/* Savings, the TurboTax hook */}
        <div className="inline-flex items-center gap-2.5 bg-teal-50 rounded-full px-5 py-2.5 mb-5">
          <i className="ti ti-coin text-teal-600 text-lg" />
          <span className="text-sm text-teal-800">
            Most students save about <strong className="text-base">$780/year</strong>
          </span>
        </div>

        {/* Fare comparison */}
        <div className="flex gap-3 w-full mb-5">
          <div className="flex-1 bg-purple-50 rounded-xl p-3 text-center">
            <p className="text-lg font-medium text-purple-800">$1.50</p>
            <p className="text-xs text-purple-600">per ride, was $3.00</p>
          </div>
          <div className="flex-1 bg-purple-50 rounded-xl p-3 text-center">
            <p className="text-lg font-medium text-purple-800">$17.50</p>
            <p className="text-xs text-purple-600">weekly cap, was $35</p>
          </div>
          <div className="flex-1 bg-purple-50 rounded-xl p-3 text-center">
            <p className="text-lg font-medium text-purple-800">Any visa</p>
            <p className="text-xs text-purple-600">no public charge</p>
          </div>
        </div>

        <button
          onClick={onStart}
          className="w-full bg-purple-400 hover:bg-purple-600 text-white rounded-xl py-4 text-sm font-medium transition-colors mb-2"
        >
          See if I qualify
        </button>
        <p className="text-xs text-gray-400 mb-3">Free · no account needed · nothing is stored</p>

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
              <i className="ti ti-check" /> Link sent, check your inbox
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
