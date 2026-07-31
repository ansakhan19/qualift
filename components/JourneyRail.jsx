'use client'

/**
 * TurboTax-style section rail, the five friendly stops of the journey.
 * `active` = key of the current section; earlier sections render as complete.
 */
const SECTIONS = [
  { key: 'about',   label: 'About you' },
  { key: 'qualify', label: 'Do I qualify?' },
  { key: 'docs',    label: 'My documents' },
  { key: 'apply',   label: 'Apply' },
  { key: 'ride',    label: 'Ride for less' },
]

export default function JourneyRail({ active }) {
  const activeIdx = SECTIONS.findIndex(s => s.key === active)
  return (
    <nav className="hidden lg:block w-44 flex-shrink-0 border-r border-gray-200 bg-gray-50 py-4 self-stretch" aria-label="Your journey">
      {SECTIONS.map((s, i) => {
        const done = i < activeIdx
        const isActive = i === activeIdx
        return (
          <div key={s.key}
            className={`flex items-center gap-2.5 px-4 py-2.5 ${isActive ? 'bg-purple-50 border-r-2 border-purple-400' : ''}`}>
            {done ? (
              <span className="w-[18px] h-[18px] rounded-full bg-teal-400 flex items-center justify-center flex-shrink-0">
                <i className="ti ti-check text-white text-[10px]" />
              </span>
            ) : isActive ? (
              <span className="w-[18px] h-[18px] rounded-full border-2 border-purple-400 bg-white flex-shrink-0" />
            ) : (
              <span className="w-[18px] h-[18px] rounded-full border border-gray-300 flex-shrink-0" />
            )}
            <span className={`text-xs ${isActive ? 'text-purple-800 font-medium' : done ? 'text-gray-600' : 'text-gray-400'}`}>
              {s.label}
            </span>
          </div>
        )
      })}
    </nav>
  )
}
