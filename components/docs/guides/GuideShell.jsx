'use client'
/** Reusable wrapper for all "how to get document X" guide screens */
export default function GuideShell({ badge, title, sub, steps, ctaLabel, onCta, onBack }) {
  return (
    <div className="fade-in pb-8">
      <div className="px-5 pt-5 border-b border-gray-100 pb-4">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-purple-600 font-medium mb-4 hover:text-purple-800 transition-colors">
          <i className="ti ti-arrow-left text-base" />
          Back to document list
        </button>
        <span className="inline-block text-xs px-2.5 py-1 rounded-full bg-coral-50 text-coral-700 mb-2">{badge}</span>
        <h2 className="text-lg font-medium text-gray-900 mb-1">{title}</h2>
        <p className="text-sm text-gray-500 leading-relaxed">{sub}</p>
      </div>
      <div className="px-5 pt-5 flex flex-col">
        {steps.map((step, i) => (
          <div key={i} className="flex gap-3">
            <div className="flex flex-col items-center w-7 flex-shrink-0">
              <div className="w-6 h-6 rounded-full bg-purple-400 text-white text-xs font-medium flex items-center justify-center flex-shrink-0">{i + 1}</div>
              {i < steps.length - 1 && <div className="w-0.5 flex-1 min-h-3 bg-purple-200 my-1" />}
            </div>
            <div className="flex-1 pb-5">
              <p className="text-sm font-medium text-gray-900 mb-1">{step.title}</p>
              <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
              {step.link && (
                <a href={step.link.url} target="_blank" rel="noopener noreferrer"
                  className="text-xs text-purple-600 underline mt-1.5 inline-block">
                  {step.link.label} →
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="px-5">
        <button onClick={onCta}
          className="w-full bg-teal-600 hover:bg-teal-800 text-white rounded-xl py-3.5 text-sm font-medium transition-colors">
          {ctaLabel}
        </button>
      </div>
    </div>
  )
}
