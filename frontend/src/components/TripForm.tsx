'use client'
import { useState } from 'react'
import { MapPin, DollarSign, Calendar, Zap, ChevronRight, CalendarDays } from 'lucide-react'
import type { TripRequest } from '@/lib/types'

const INTERESTS = [
  { id: 'beaches',     emoji: '🏖️', label: 'Beaches' },
  { id: 'cafes',       emoji: '☕', label: 'Cafés' },
  { id: 'nightlife',   emoji: '🌙', label: 'Nightlife' },
  { id: 'adventure',   emoji: '🧗', label: 'Adventure' },
  { id: 'mountains',   emoji: '⛰️', label: 'Mountains' },
  { id: 'culture',     emoji: '🏛️', label: 'Culture' },
  { id: 'shopping',    emoji: '🛍️', label: 'Shopping' },
  { id: 'food',        emoji: '🍜', label: 'Food' },
  { id: 'nature',      emoji: '🌿', label: 'Nature' },
  { id: 'photography', emoji: '📸', label: 'Photography' },
]

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

interface Props {
  onSubmit: (data: TripRequest) => void
  isLoading: boolean
}

interface FormState {
  destination: string
  budget: string
  duration: string
  travel_month: string
  interests: string[]
}

export default function TripForm({ onSubmit, isLoading }: Props) {
  const currentMonth = MONTHS[new Date().getMonth()]
  const [form, setForm] = useState<FormState>({
    destination: '',
    budget: '',
    duration: '',
    travel_month: currentMonth,
    interests: [],
  })
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})

  const validate = () => {
    const e: typeof errors = {}
    if (!form.destination.trim())          e.destination    = 'Please enter a destination'
    if (!form.budget || +form.budget <= 0) e.budget         = 'Enter a valid budget'
    if (!form.duration || +form.duration < 1 || +form.duration > 30)
                                           e.duration       = '1–30 days allowed'
    if (!form.travel_month)                e.travel_month   = 'Select a travel month'
    if (!form.interests.length)            e.interests      = 'Pick at least one interest'
    setErrors(e)
    return !Object.keys(e).length
  }

  const toggle = (id: string) => {
    setForm((p) => ({
      ...p,
      interests: p.interests.includes(id)
        ? p.interests.filter((x) => x !== id)
        : [...p.interests, id],
    }))
    if (errors.interests) setErrors((e) => ({ ...e, interests: undefined }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      onSubmit({
        destination:   form.destination.trim(),
        budget:        +form.budget,
        duration:      +form.duration,
        travel_month:  form.travel_month,
        interests:     form.interests,
      })
    }
  }

  const field = (key: keyof FormState) => ({
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((p) => ({ ...p, [key]: e.target.value }))
      if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }))
    },
  })

  return (
    <form onSubmit={handleSubmit} className="animate-fade-up delay-500 mx-auto w-full max-w-2xl">
      <div className="glass-strong grad-border relative overflow-hidden rounded-2xl p-6 shadow-glass sm:p-8">
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-500/5 via-transparent to-indigo-500/5" />

        <div className="relative space-y-6">

          {/* Destination */}
          <div>
            <label className="mb-2 block font-mono text-[11px] font-medium uppercase tracking-widest text-white/40">
              Destination
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-400" />
              <input
                type="text"
                placeholder="e.g. Goa, Bali, Paris, Tokyo…"
                value={form.destination}
                {...field('destination')}
                className={`input-base w-full rounded-xl py-3.5 pl-10 pr-4 text-sm ${errors.destination ? 'border-red-500/60' : ''}`}
              />
            </div>
            {errors.destination && <p className="mt-1.5 text-xs text-red-400">{errors.destination}</p>}
          </div>

          {/* Budget + Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block font-mono text-[11px] font-medium uppercase tracking-widest text-white/40">
                Budget (₹)
              </label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="e.g. 20000"
                  min={1}
                  value={form.budget}
                  {...field('budget')}
                  className={`input-base w-full rounded-xl py-3.5 px-4 text-sm ${errors.budget ? 'border-red-500/60' : ''}`}
                />
              </div>
              {errors.budget && <p className="mt-1.5 text-xs text-red-400">{errors.budget}</p>}
            </div>

            <div>
              <label className="mb-2 block font-mono text-[11px] font-medium uppercase tracking-widest text-white/40">
                Duration (days)
              </label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-400" />
                <input
                  type="number"
                  placeholder="e.g. 5"
                  min={1} max={30}
                  value={form.duration}
                  {...field('duration')}
                  className={`input-base w-full rounded-xl py-3.5 pl-10 pr-4 text-sm ${errors.duration ? 'border-red-500/60' : ''}`}
                />
              </div>
              {errors.duration && <p className="mt-1.5 text-xs text-red-400">{errors.duration}</p>}
            </div>
          </div>

          {/* Travel Month */}
          <div>
            <label className="mb-2 block font-mono text-[11px] font-medium uppercase tracking-widest text-white/40">
              Travel Month
            </label>
            <div className="relative">
              <CalendarDays className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-400 pointer-events-none z-10" />
              <select
                value={form.travel_month}
                onChange={(e) => {
                  setForm((p) => ({ ...p, travel_month: e.target.value }))
                  if (errors.travel_month) setErrors((er) => ({ ...er, travel_month: undefined }))
                }}
                className={`input-base w-full rounded-xl py-3.5 pl-10 pr-4 text-sm appearance-none cursor-pointer ${errors.travel_month ? 'border-red-500/60' : ''}`}
              >
                {MONTHS.map((month) => (
                  <option key={month} value={month} className="bg-[#0d1b3e] text-white">
                    {month}
                  </option>
                ))}
              </select>
              {/* Dropdown arrow */}
              <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2">
                <svg className="h-4 w-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {errors.travel_month && <p className="mt-1.5 text-xs text-red-400">{errors.travel_month}</p>}
            <p className="mt-1.5 text-[11px] text-white/25">
              Helps us give accurate weather & packing recommendations
            </p>
          </div>

          {/* Interests */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <label className="font-mono text-[11px] font-medium uppercase tracking-widest text-white/40">
                Interests
              </label>
              <span className="text-xs text-white/25">{form.interests.length} selected</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {INTERESTS.map(({ id, emoji, label }) => {
                const active = form.interests.includes(id)
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => toggle(id)}
                    className={`flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-medium transition-all duration-200 ${
                      active
                        ? 'border-brand-400/50 bg-gradient-to-r from-brand-500/25 to-indigo-500/20 text-white shadow-glow-brand'
                        : 'border-white/10 bg-white/5 text-white/50 hover:border-white/20 hover:bg-white/8 hover:text-white/75'
                    }`}
                  >
                    <span className="text-base leading-none">{emoji}</span>
                    {label}
                  </button>
                )
              })}
            </div>
            {errors.interests && <p className="mt-2 text-xs text-red-400">{errors.interests}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary flex w-full items-center justify-center gap-2.5 rounded-xl py-4 text-sm"
          >
            {isLoading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Generating your trip…
              </>
            ) : (
              <>
                <Zap className="h-4 w-4" />
                Generate Trip
                <ChevronRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  )
}