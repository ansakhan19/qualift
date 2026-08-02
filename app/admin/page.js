'use client'
import { useEffect, useState, useCallback } from 'react'

const KEY_STORAGE = 'qualift_admin_key'

export default function AdminPage() {
  const [key, setKey] = useState('')
  const [keyInput, setKeyInput] = useState('')
  const [students, setStudents] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem(KEY_STORAGE) : null
    if (saved) {
      setKey(saved)
      setKeyInput(saved)
    }
  }, [])

  const load = useCallback(async (k) => {
    if (!k) return
    setLoading(true); setError('')
    try {
      const r = await fetch(`/api/admin/emails?key=${encodeURIComponent(k)}`)
      const data = await r.json()
      if (!r.ok) {
        setStudents(null)
        setError(data.error || 'Something went wrong')
        return
      }
      setStudents(data.students)
      localStorage.setItem(KEY_STORAGE, k)
    } catch {
      setError('Could not reach the server, try again')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { if (key) load(key) }, [key, load])

  function handleUnlock(e) {
    e.preventDefault()
    setKey(keyInput.trim())
  }

  function handleSignOut() {
    localStorage.removeItem(KEY_STORAGE)
    setKey(''); setKeyInput(''); setStudents(null)
  }

  if (!key || (error && error === 'Unauthorized')) {
    return (
      <div className="min-h-dvh flex items-center justify-center px-6 bg-gray-50">
        <form onSubmit={handleUnlock} className="w-full max-w-sm bg-white border border-gray-200 rounded-2xl p-8">
          <h1 className="text-xl font-medium text-gray-900 mb-2">Qualift admin</h1>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            Enter your admin key to see the emails Qualift has collected. This is the same value as the
            ADMIN_KEY environment variable set on Railway.
          </p>
          <input
            type="password"
            value={keyInput}
            onChange={e => setKeyInput(e.target.value)}
            placeholder="Admin key"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-purple-400 bg-white mb-3"
          />
          {error && error !== 'Unauthorized' ? null : error === 'Unauthorized' && (
            <p className="text-sm text-red-500 mb-3">That key didn't match. Check the ADMIN_KEY value in Railway and try again.</p>
          )}
          <button type="submit" className="w-full bg-purple-400 hover:bg-purple-600 text-white rounded-xl py-3 text-sm font-medium transition-colors">
            Unlock
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-gray-50 px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-medium text-gray-900">Student emails</h1>
            <p className="text-sm text-gray-500">Everyone who has entered an email in Qualift</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => load(key)} disabled={loading}
              className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50">
              {loading ? 'Refreshing…' : 'Refresh'}
            </button>
            <a href={`/api/admin/emails?key=${encodeURIComponent(key)}&format=csv`}
              className="bg-purple-400 hover:bg-purple-600 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors">
              Download CSV
            </a>
            <button onClick={handleSignOut}
              className="text-sm text-gray-400 underline px-2">
              Sign out
            </button>
          </div>
        </div>

        {error && error !== 'Unauthorized' && (
          <div className="bg-coral-50 border border-coral-200 rounded-xl p-4 mb-6 text-sm text-coral-700">
            {error}
            {error.includes('not configured') && (
              <p className="mt-2">
                Set an ADMIN_KEY variable in your Railway project's Variables tab, then redeploy and unlock again
                with that same value.
              </p>
            )}
          </div>
        )}

        {students && (
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-200 text-sm text-gray-500">
              {students.length} {students.length === 1 ? 'student' : 'students'} tracked
            </div>
            {students.length === 0 ? (
              <p className="px-5 py-10 text-center text-sm text-gray-400">No emails yet. They'll show up here as students use the app.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-400 text-xs uppercase tracking-wide">
                      <th className="px-5 py-3 font-medium">Email</th>
                      <th className="px-5 py-3 font-medium">Student type</th>
                      <th className="px-5 py-3 font-medium">Eligibility</th>
                      <th className="px-5 py-3 font-medium">Stage</th>
                      <th className="px-5 py-3 font-medium">First seen</th>
                      <th className="px-5 py-3 font-medium">Last active</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s, i) => (
                      <tr key={s.email + i} className="border-b border-gray-100 last:border-0">
                        <td className="px-5 py-3 text-gray-900">{s.email}</td>
                        <td className="px-5 py-3 text-gray-600">{s.studentType || '—'}</td>
                        <td className="px-5 py-3">
                          {s.eligibility === 'eligible' ? (
                            <span className="bg-teal-50 text-teal-700 rounded-full px-2.5 py-1 text-xs font-medium">Eligible</span>
                          ) : s.eligibility ? (
                            <span className="bg-gray-100 text-gray-600 rounded-full px-2.5 py-1 text-xs font-medium">{s.eligibility}</span>
                          ) : '—'}
                        </td>
                        <td className="px-5 py-3 text-gray-600">{s.stage ?? '—'}</td>
                        <td className="px-5 py-3 text-gray-400">{new Date(s.firstSeen).toLocaleDateString()}</td>
                        <td className="px-5 py-3 text-gray-400">{new Date(s.lastActive).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
