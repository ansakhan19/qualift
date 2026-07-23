'use client'
import { createContext, useContext, useState, useCallback, useEffect } from 'react'

const LS_KEY = 'qualift_progress_v3'

const DEFAULT_PROGRESS = {
  sessionId:   null,
  email:       null,
  studentType: null,        // 'international' | 'domestic'
  currentStage: 1,
  eligibility: {
    nycResident:     null,
    age18Plus:       null,
    cashAssist:      null,
    existingBenefit: null,
    householdSize:   null,
    annualIncome:    null,
    status:          null,  // 'eligible' | 'ineligible' | 'cash_assist'
    ineligReason:    null,  // 'residency' | 'age' | 'income' | 'existing'
  },
  docs: {
    // international
    id:       false,
    addr:     false,
    income:   false,
    i20:      false,
    incomeType: null,  // 'paystub'|'finaid'|'benefits'|'unemployment'|'zero'|'gig'|'family'|'alimony'
    // domestic-only
    d_id:     false,
    d_addr:   false,
    d_income: false,
    d_ssn:    false,
    d_incomeType: null,
  },
  application: {
    firstName: '', lastName: '', dob: '', ssn: '',
    phone: '', email: '',
    address: '', borough: '', zip: '', lengthAtAddress: '',
    visaType: 'F-1', sevisId: '', programEndDate: '', school: '',
    incomeSource: '', monthlyIncome: '', annualIncome: '', householdSize: '',
    hasReducedFare: false, hasHRABenefits: false,
    metroCardType: '7day',
  },
}

const ProgressContext = createContext(null)

export function ProgressProvider({ children, initialProgress }) {
  const [progress, setProgressState] = useState(() => {
    if (initialProgress) return { ...DEFAULT_PROGRESS, ...initialProgress }
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(LS_KEY)
        if (stored) return { ...DEFAULT_PROGRESS, ...JSON.parse(stored) }
      } catch {}
    }
    return DEFAULT_PROGRESS
  })

  // Persist to localStorage on every change
  useEffect(() => {
    try { localStorage.setItem(LS_KEY, JSON.stringify(progress)) } catch {}
  }, [progress])

  // Persist to backend (fire-and-forget) if we have a sessionId
  const syncToBackend = useCallback((p) => {
    if (!p.sessionId) return
    fetch('/api/save-progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: p.sessionId, progress: p }),
    }).catch(() => {})
  }, [])

  const setProgress = useCallback((updater) => {
    setProgressState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater }
      syncToBackend(next)
      return next
    })
  }, [syncToBackend])

  const updateEligibility = useCallback((patch) => {
    setProgress(p => ({ ...p, eligibility: { ...p.eligibility, ...patch } }))
  }, [setProgress])

  const updateDocs = useCallback((patch) => {
    setProgress(p => ({ ...p, docs: { ...p.docs, ...patch } }))
  }, [setProgress])

  const updateApplication = useCallback((patch) => {
    setProgress(p => ({ ...p, application: { ...p.application, ...patch } }))
  }, [setProgress])

  const advanceStage = useCallback((stage) => {
    setProgress(p => ({ ...p, currentStage: Math.max(p.currentStage, stage) }))
  }, [setProgress])

  const reset = useCallback(() => {
    setProgressState(DEFAULT_PROGRESS)
    try {
      // Clear every version of stored progress, past and present
      localStorage.removeItem('qualift_progress_v1')
      localStorage.removeItem('qualift_progress_v2')
      localStorage.removeItem(LS_KEY)
    } catch {}
  }, [])

  return (
    <ProgressContext.Provider value={{
      progress, setProgress,
      updateEligibility, updateDocs, updateApplication,
      advanceStage, reset,
    }}>
      {children}
    </ProgressContext.Provider>
  )
}

export function useProgress() {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider')
  return ctx
}
