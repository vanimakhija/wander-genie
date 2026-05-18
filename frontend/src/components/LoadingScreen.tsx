'use client'
import { useEffect, useState } from 'react'
import { Globe } from 'lucide-react'

const STEPS = [
  { label: 'Analysing destination…',      pct: 12 },
  { label: 'Checking weather patterns…',  pct: 28 },
  { label: 'Crafting your itinerary…',    pct: 52 },
  { label: 'Curating packing list…',      pct: 72 },
  { label: 'Adding local insights…',      pct: 88 },
  { label: 'Almost ready!',               pct: 97 },
]

export default function LoadingScreen({ destination }: { destination: string }) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), 380)
    return () => clearInterval(id)
  }, [])

  const current = STEPS[step]

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        {/* Animated Globe */}
        <div className="mb-10 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 animate-ping rounded-full border border-brand-400/20 scale-150" style={{ animationDuration: '2.5s' }} />
            <div className="absolute inset-0 animate-ping rounded-full border border-indigo-400/15 scale-125" style={{ animationDuration: '3.2s', animationDelay: '0.5s' }} />
            <div className="glass-strong flex h-24 w-24 items-center justify-center rounded-full shadow-glow-brand">
              <Globe className="h-10 w-10 animate-spin-slow text-brand-300" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white sm:text-3xl" style={{ fontFamily: 'var(--font-display)' }}>
          Planning your trip to{' '}
          <span className="gradient-text">{destination || 'paradise'}</span>
        </h2>
        <p className="mt-2 text-sm text-white/40">
          AI is handcrafting your perfect experience
        </p>

        {/* Progress */}
        <div className="mt-8 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-400 to-indigo-500 transition-all duration-500 ease-out"
            style={{ width: `${current.pct}%` }}
          />
        </div>
        <p key={step} className="mt-3 animate-fade-in font-mono text-xs tracking-wide text-brand-300">
          {current.label}
        </p>

        {/* Skeleton preview */}
        <div className="mt-10 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass rounded-xl p-4 text-left" style={{ opacity: 1 - (i - 1) * 0.28 }}>
              <div className="skeleton mb-3 h-3 w-24 rounded-full" />
              <div className="skeleton mb-2 h-2.5 w-full rounded-full" />
              <div className="skeleton h-2.5 w-4/5 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
