'use client'
import { useRouter } from 'next/navigation'

/**
 * TurboTax-style section rail, the five friendly stops of the journey.
 * `active` = key of the current section; earlier sections render as complete.
 * Every stop is clickable so students can move across phases freely.
 */
const SECTIONS = [
  { key: 'about',   label: 'About you',     route: '/eligibility' },
  { key: 'qualify', label: 'Do I qualify?', route: '/eligibility' },
  { key: 'docs',    label: 'My documents',  route: '/docs' },
  { key: 'apply',   label: 'Apply',         route: '/walkthrough' },
  { key: 'ride',    label: 'Ride for less', route: '/guide' },
]

export default function JourneyRail({ active }) {
  const router = useRouter()
  const activeIdx = SECTIONS.findIndex(s => s.key === active)
  return (
    <nav className="hidden lg:block w-48 flex-shrink-0 border-r border-gray-200 bg-gray-50 py-4 self-stretch" aria-label="Your journey">
      {SECTIONS.map((s, i) => {
        const done = i < activeIdx
        const isActive = i === activeIdx
        return (
          <button
            key={s.key}
            onClick={() => router.push(s.route)}
            title={`Go to ${s.label}`}
            className={`w-full text-left flex items-center gap-2.5 px-4 py-3 transition-colors ${
              isActive ? 'bg-purple-50 border-r-2 border-purple-400' : 'hover:bg-gray-100'
            }`}
          >
            {done ? (
              <span className="w-[18px] h-[18px] rounded-full bg-teal-400 flex items-center justify-center flex-shrink-0">
                <i className="ti ti-check text-white text-[10px]" />
              </span>
            ) : isActive ? (
              <span className="w-[18px] h-[18px] rounded-full border-2 border-purple-400 bg-white flex-shrink-0" />
            ) : (
              <span className="w-[18px] h-[18px] rounded-full border border-gray-300 flex-shrink-0" />
            )}
            <span className={`text-sm ${isActive ? 'text-purple-800 font-medium' : done ? 'text-gray-600' : 'text-gray-400'}`}>
              {s.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
