'use client'

/**
 * TurboTax-style "refund ticker", for Qualift it counts transit savings.
 * 10 rides/week × $1.50 saved per ride × 52 weeks = $780/year.
 */
export default function SavingsTicker({ label = 'Your estimated savings' }) {
  return (
    <div className="flex items-center gap-2 bg-teal-50 rounded-full px-3.5 py-1.5 flex-shrink-0">
      <span className="text-xs text-teal-600 hidden sm:inline">{label}</span>
      <span className="text-sm font-medium text-teal-800">$780/yr</span>
    </div>
  )
}
