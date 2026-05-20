'use client'
import { useEffect, useRef } from 'react'
import { X, Copy, Check, Link2 } from 'lucide-react'

type Props = {
  url: string
  onClose: () => void
  copied: boolean
  onCopy: () => void
}

export default function ShareModal({ url, onClose, copied, onCopy }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.select()
  }, [url])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="glass grad-border w-full max-w-md rounded-2xl p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link2 className="h-5 w-5 text-brand-400" />
            <h3 className="text-lg font-semibold text-white" style={{ fontFamily: 'var(--font-display)' }}>
              Share trip
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-white/40 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mb-4 text-sm text-white/50">
          Anyone with this link can view your itinerary. Links expire when the backend restarts.
        </p>

        <div className="flex gap-2">
          <input
            ref={inputRef}
            readOnly
            value={url}
            className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 font-mono text-xs text-white/80 outline-none focus:border-brand-400/40"
          />
          <button
            onClick={onCopy}
            className="btn-primary flex shrink-0 items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>
    </div>
  )
}
