'use client'
import { Sun, Cloud, CloudRain, Thermometer, Droplets } from 'lucide-react'
import type { WeatherInfo } from '@/lib/types'

const ICON_MAP = { sunny: Sun, hot: Sun, cloudy: Cloud, rainy: CloudRain }

export default function WeatherCard({ weather }: { weather: WeatherInfo }) {
  const { temperature, condition, rainPrediction, suggestion, humidity, icon } = weather
  const Icon = ICON_MAP[icon ?? 'cloudy'] ?? Cloud

  return (
    <div className="glass grad-border overflow-hidden rounded-2xl">
      <div className="bg-gradient-to-br from-brand-500/15 to-indigo-500/10 p-5 sm:p-6">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-white/35">Weather Forecast</span>
            <h3 className="mt-0.5 text-lg font-semibold text-white" style={{ fontFamily: 'var(--font-display)' }}>
              {condition}
            </h3>
          </div>
          <div className="glass flex items-center justify-center rounded-xl p-3">
            <Icon className="h-6 w-6 text-yellow-300" strokeWidth={1.5} />
          </div>
        </div>

        {/* Stats */}
        <div className="mb-4 grid grid-cols-3 gap-2.5">
          {[
            { icon: Thermometer, label: 'Temp', value: temperature, color: 'text-red-400' },
            { icon: Droplets,    label: 'Humidity', value: humidity ?? '—', color: 'text-brand-400' },
            { icon: CloudRain,   label: 'Rain', value: rainPrediction.replace('chance of ', ''), color: 'text-blue-400' },
          ].map(({ icon: I, label, value, color }) => (
            <div key={label} className="glass rounded-xl p-3 text-center">
              <I className={`mx-auto mb-1 h-4 w-4 ${color}`} strokeWidth={1.5} />
              <p className="text-[10px] text-white/35">{label}</p>
              <p className="mt-0.5 font-mono text-xs font-medium text-white">{value}</p>
            </div>
          ))}
        </div>

        {/* Advisory */}
        <div className="flex items-start gap-2.5 rounded-xl border border-white/8 bg-white/5 p-3">
          <span className="mt-0.5 flex-shrink-0 text-sm">💡</span>
          <p className="text-xs leading-relaxed text-white/55">{suggestion}</p>
        </div>
      </div>
    </div>
  )
}
