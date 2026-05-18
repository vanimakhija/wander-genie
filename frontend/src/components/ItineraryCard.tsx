'use client'
import { MapPin, Utensils, Lightbulb } from 'lucide-react'
import type { ItineraryDay } from '@/lib/types'

const ACT_ICONS = ['🌅','🗺️','🍽️','🌃','🏛️','🎭','🌊','🧘','🚴','🎪']
const MEAL_ICONS: Record<string, string> = { breakfast: '🥐', lunch: '🍱', dinner: '🍷' }

interface Props {
  day: ItineraryDay
  index: number
}

export default function ItineraryCard({ day, index }: Props) {
  return (
    <div
      className="glass grad-border animate-fade-up overflow-hidden rounded-2xl"
      style={{ animationDelay: `${index * 110}ms` }}
    >
      {/* Header */}
      <div className="border-b border-white/5 bg-gradient-to-r from-brand-500/15 to-indigo-500/10 px-5 pb-4 pt-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-indigo-500 shadow-glow-brand">
            <span className="font-mono text-sm font-bold text-white">{String(day.day).padStart(2,'0')}</span>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-brand-300">Day {day.day}</p>
            <h3 className="text-base font-semibold leading-tight text-white" style={{ fontFamily: 'var(--font-display)' }}>
              {day.title}
            </h3>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="space-y-5 p-5">
        {/* Activities */}
        <div>
          <div className="mb-2.5 flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 text-brand-400" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-white/35">Activities</span>
          </div>
          <div className="space-y-2">
            {day.activities.map((act, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[.03] p-3 transition-colors duration-200 hover:bg-white/[.06]"
              >
                <span className="mt-0.5 flex-shrink-0 text-base">{ACT_ICONS[i % ACT_ICONS.length]}</span>
                <span className="text-sm leading-relaxed text-white/65">{act}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Meals */}
        {day.meals && (
          <div>
            <div className="mb-2.5 flex items-center gap-2">
              <Utensils className="h-3.5 w-3.5 text-yellow-400" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-white/35">Meals</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(day.meals).map(([type, val]) => (
                <div key={type} className="rounded-xl border border-white/5 bg-white/[.03] p-2.5 text-center">
                  <span className="block text-base">{MEAL_ICONS[type] ?? '🍴'}</span>
                  <span className="mt-0.5 block font-mono text-[9px] uppercase tracking-wide text-white/28 capitalize">{type}</span>
                  <span className="mt-0.5 block text-[11px] leading-tight text-white/50">{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tip */}
        {day.tips && (
          <div className="flex items-start gap-2.5 rounded-xl border border-yellow-400/15 bg-yellow-400/8 p-3">
            <Lightbulb className="mt-0.5 h-4 w-4 flex-shrink-0 text-yellow-400" strokeWidth={1.5} />
            <p className="text-xs leading-relaxed text-white/55">
              <span className="font-medium text-yellow-300">Pro tip: </span>
              {day.tips}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
