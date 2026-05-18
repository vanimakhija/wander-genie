'use client'
import { useState } from 'react'
import { Shirt, Package, Gem, Heart, Cloud, ChevronDown } from 'lucide-react'
import type { PackingSection } from '@/lib/types'

const SECTION_CONFIG: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  'Clothing':       { icon: Shirt,    color: 'text-brand-400',  bg: 'from-brand-500/15' },
  'Essentials':     { icon: Package,  color: 'text-indigo-400', bg: 'from-indigo-500/15' },
  'Accessories':    { icon: Gem,      color: 'text-yellow-400', bg: 'from-yellow-400/12' },
  'Health & Safety':{ icon: Heart,    color: 'text-red-400',    bg: 'from-red-500/15' },
  'Weather-based':  { icon: Cloud,    color: 'text-cyan-400',   bg: 'from-cyan-500/12' },
}
const FALLBACK = { icon: Package, color: 'text-white/50', bg: 'from-white/5' }

function Section({ section }: { section: PackingSection }) {
  const [checked, setChecked] = useState<Record<number, boolean>>({})
  const [open, setOpen] = useState(true)
  const cfg = SECTION_CONFIG[section.name] ?? FALLBACK
  const Icon = cfg.icon
  const done = Object.values(checked).filter(Boolean).length

  return (
    <div className="glass grad-border overflow-hidden rounded-2xl">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex w-full items-center justify-between border-b border-white/5 bg-gradient-to-r ${cfg.bg} to-transparent p-5 transition-colors hover:bg-white/[.02]`}
      >
        <div className="flex items-center gap-3">
          <div className="glass flex h-8 w-8 items-center justify-center rounded-lg">
            <Icon className={`h-4 w-4 ${cfg.color}`} strokeWidth={1.5} />
          </div>
          <span className="font-semibold text-white" style={{ fontFamily: 'var(--font-display)' }}>
            {section.name}
          </span>
          <span className="font-mono text-xs text-white/30">{done}/{section.items.length}</span>
        </div>
        <ChevronDown className={`h-4 w-4 text-white/30 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {/* Progress bar */}
      {open && (
        <div className="h-[2px] bg-white/5">
          <div
            className="h-full bg-gradient-to-r from-brand-400 to-indigo-500 transition-all duration-300"
            style={{ width: `${section.items.length ? (done / section.items.length) * 100 : 0}%` }}
          />
        </div>
      )}

      {open && (
        <div className="space-y-1 p-4">
          {section.items.map((item, i) => (
            <label
              key={i}
              className={`flex cursor-pointer items-center gap-3 rounded-xl p-3 transition-all duration-200 group
                ${checked[i] ? 'opacity-55' : 'hover:bg-white/5'}`}
            >
              <input
                type="checkbox"
                className="custom-check"
                checked={!!checked[i]}
                onChange={(e) => setChecked((c) => ({ ...c, [i]: e.target.checked }))}
              />
              <span className={`text-sm transition-all duration-200 ${checked[i] ? 'line-through text-white/30' : 'text-white/60 group-hover:text-white/80'}`}>
                {item}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  )
}

export default function PackingList({ packingList }: { packingList: PackingSection[] }) {
  return (
    <div className="space-y-4">
      {packingList.map((section) => (
        <Section key={section.name} section={section} />
      ))}
    </div>
  )
}
