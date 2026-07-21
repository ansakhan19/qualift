'use client'
import { useState } from 'react'
import { useProgress } from '@/store/ProgressContext'

/**
 * Appears right after the first positive eligibility signal (NYC resident = yes).
 * onSaved(email) — called after email is confirmed sent
 * onSkip()       — user continues without saving
 */
export default function SaveProgress({ context, onSaved, onSkip }) {
  const { progress, setProgress } = useProgress()
  const [email, setEmail] = useState(progress.email || '')
  const [sending, setSending] = useState(false)
  const [error, setError]   = useState('')

  async function handleSend(e) {
    e.preventDefault()
    if (!email.includes('@')) { setError('Enter a valid email address'); return }
    setSending(true); setError('')
    try {
      const r = await fetch('/api/send-magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase().trim(), progress }),
      })
      const data = await r.json()
      if (!r.ok) throw new Error(data.error)
      setProgress(p => ({ ...p, email: email.toLowerCase().trim(), sessionId: data.sessionId }))
      onSaved(email)
    } catch (err) {
      setError(err.message || 'Something went wrong — try again')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="fade-in px-6 py-8 flex flex-col gap-5">
      {/* Context card — shows what they just confirmed */}
      {context && (
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
          <p className="text-xs font-medium tracking-wide text-purple-600 mb-2">JUST CONFIRMED</p>
          {context}
        </div>
      )}

      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-2">Save your progress</h2>
        <p className="text-sm text-gray-500 leading-relaxed">
          Getting your documents can take a few days. Enter your email and we'll send a link to pick up
          right here — on any device, no password needed.
        </p>
      </div>

      <form onSubmit={handleSend} className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-700 tracking-wide">YOUR EMAIL ADDRESS</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-purple-400 bg-white"
          />
          <p className="text-xs text-gray-400 leading-relaxed">
            We'll only use this to send your progress link. No spam, ever.
          </p>
        </div>

        {error && <p className="text-xs text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={sending}
          className="w-full bg-purple-400 hover:bg-purple-600 text-white rounded-xl py-3.5 text-sm font-medium transition-colors disabled:opacity-50"
        >
          {sending ? 'Sending…' : 'Send my progress link'}
        </button>
      </form>

      <button
        onClick={onSkip}
        className="text-sm text-gray-400 underline text-center"
      >
        Skip for now — continue without saving
      </button>
    </div>
  )
}
