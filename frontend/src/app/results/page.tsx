'use client'
import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ItineraryCard from '@/components/ItineraryCard'
import PackingList from '@/components/PackingList'
import WeatherCard from '@/components/WeatherCard'
import ShareModal from '@/components/ShareModal'
import { ArrowLeft, Map, Backpack, Download, Share2, MapPin, Calendar, Loader2 } from 'lucide-react'
import {
  TRIP_STORAGE_KEY,
  FORM_STORAGE_KEY,
  ApiError,
  createShareLink,
  fetchSharedTrip,
} from '@/lib/api'
import { exportTripPdf } from '@/lib/exportPdf'
import type { TripResponse, TripRequest } from '@/lib/types'

const TABS = [
  { id: 'itinerary', label: 'Itinerary',    icon: Map },
  { id: 'packing',   label: 'Packing List', icon: Backpack },
]

export default function ResultsPage() {
  const router = useRouter()
  const [result, setResult]   = useState<TripResponse | null>(null)
  const [form, setForm]       = useState<TripRequest | null>(null)
  const [tab, setTab]         = useState<'itinerary' | 'packing'>('itinerary')
  const [loading, setLoading] = useState(true)
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [linkCopied, setLinkCopied] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [sharing, setSharing] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  const persistTrip = useCallback((f: TripRequest, r: TripResponse) => {
    sessionStorage.setItem(TRIP_STORAGE_KEY, JSON.stringify(r))
    sessionStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(f))
    setForm(f)
    setResult(r)
  }, [])

  useEffect(() => {
    const load = async () => {
      const params = new URLSearchParams(window.location.search)
      const shareId = params.get('share')

      if (shareId) {
        try {
          const shared = await fetchSharedTrip(shareId)
          persistTrip(shared.form, shared.result)
        } catch {
          setActionError('Share link not found or expired.')
        } finally {
          setLoading(false)
        }
        return
      }

      const r = sessionStorage.getItem(TRIP_STORAGE_KEY)
      const f = sessionStorage.getItem(FORM_STORAGE_KEY)
      if (r) setResult(JSON.parse(r))
      if (f) setForm(JSON.parse(f))
      setLoading(false)
    }
    load()
  }, [persistTrip])

  const handleExportPdf = () => {
    if (!result || !form) return
    setActionError(null)
    setExporting(true)
    try {
      exportTripPdf(form, result)
    } catch {
      setActionError('Could not create PDF. Please try again.')
    } finally {
      setExporting(false)
    }
  }

  const handleShare = async () => {
    if (!result || !form) return
    setActionError(null)
    setSharing(true)
    setLinkCopied(false)
    try {
      const url = await createShareLink(form, result)
      setShareUrl(url)
    } catch (err) {
      const msg =
        err instanceof ApiError && err.status === 404
          ? 'Share API missing — restart the backend (stop old terminal, run uvicorn again).'
          : 'Could not create share link. Make sure the backend is running on port 8000.'
      setActionError(msg)
    } finally {
      setSharing(false)
    }
  }

  const handleCopyLink = async () => {
    if (!shareUrl) return
    try {
      await navigator.clipboard.writeText(shareUrl)
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2500)
    } catch {
      setActionError('Copy failed — select the link and copy manually.')
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-400" />
      </div>
    )
  }

  if (!result) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          <p className="mb-2 text-5xl">🗺️</p>
          <h2 className="mb-4 text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
            {actionError || 'No trip found'}
          </h2>
          <button onClick={() => router.push('/')} className="btn-primary flex items-center gap-2 rounded-xl px-6 py-3 text-sm mx-auto">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </button>
        </div>
      </div>
    )
  }

  const totalItems = result.packing_list.reduce((s, p) => s + p.items.length, 0)

  return (
    <div className="relative min-h-screen">
      {shareUrl && (
        <ShareModal
          url={shareUrl}
          onClose={() => setShareUrl(null)}
          copied={linkCopied}
          onCopy={handleCopyLink}
        />
      )}

      {/* Background */}
      <div className="fixed inset-0" style={{ background: 'linear-gradient(135deg, #020817 0%, #0d1b3e 45%, #120e38 70%, #020c1f 100%)' }} />
      <div className="pointer-events-none fixed right-1/4 top-1/4 h-96 w-96 animate-glow rounded-full bg-indigo-500/6 blur-3xl" />
      <div className="pointer-events-none fixed bottom-1/3 left-1/4 h-80 w-80 animate-glow delay-300 rounded-full bg-brand-500/6 blur-3xl" />
      <div className="dot-grid pointer-events-none fixed inset-0 opacity-[.025]" />

      <Navbar />

      <main className="relative z-10 px-4 pb-16 pt-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          {/* Top bar */}
          <div className="animate-fade-up mb-6 flex items-center justify-between">
            <button
              onClick={() => router.push('/')}
              className="group flex items-center gap-2 text-sm text-white/40 transition-colors hover:text-white/80"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
              Plan another trip
            </button>
            <div className="flex flex-col items-end gap-2">
              <div className="flex gap-2">
                <button
                  onClick={handleShare}
                  disabled={sharing || !form}
                  className="glass flex items-center gap-1.5 rounded-lg border border-white/8 px-3 py-2 text-xs text-white/45 transition-all hover:bg-white/8 hover:text-white/80 disabled:opacity-50"
                >
                  {sharing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Share2 className="h-3.5 w-3.5" />}
                  Share
                </button>
                <button
                  onClick={handleExportPdf}
                  disabled={exporting || !form}
                  className="glass flex items-center gap-1.5 rounded-lg border border-white/8 px-3 py-2 text-xs text-white/45 transition-all hover:bg-white/8 hover:text-white/80 disabled:opacity-50"
                >
                  {exporting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
                  Export PDF
                </button>
              </div>
              {actionError && (
                <p className="max-w-[220px] text-right text-[10px] text-red-400/90">{actionError}</p>
              )}
            </div>
          </div>

          {/* Title */}
          <div className="animate-fade-up delay-100 mb-5">
            <h1 className="text-3xl font-bold text-white sm:text-4xl" style={{ fontFamily: 'var(--font-display)' }}>
              Your Trip to{' '}
              <span className="gradient-text capitalize">{form?.destination}</span>
            </h1>
            <p className="mt-1 text-sm text-white/35">
              AI-generated {form?.duration}-day itinerary · Ready to explore
            </p>
          </div>

          {/* Meta bar */}
          <div className="animate-fade-up delay-200 glass grad-border mb-7 rounded-2xl p-4 sm:p-5">
            <div className="flex flex-wrap items-center gap-5 sm:gap-7">
              {[
                { icon: MapPin,      label: 'Destination', value: form?.destination,                      color: 'text-brand-400' },
                { icon: Calendar,    label: 'Duration',    value: `${form?.duration} days`,               color: 'text-indigo-400' },
                { icon: null,        label: 'Budget',      value: `₹${Number(form?.budget).toLocaleString('en-IN')}`, color: 'text-yellow-400' },
              ].map(({ icon: I, label, value, color }) => (
                <div key={label} className="flex items-center gap-2">
                  {I && <I className={`h-4 w-4 ${color}`} strokeWidth={1.5} />}
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-white/30">{label}</p>
                    <p className="text-sm font-semibold capitalize text-white">{value}</p>
                  </div>
                </div>
              ))}
              <div className="flex flex-wrap gap-1.5">
                {form?.interests.map((t) => (
                  <span key={t} className="rounded-full border border-brand-400/22 bg-brand-500/12 px-3 py-1 font-mono text-[10px] capitalize text-brand-300">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Layout */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Main */}
            <div className="animate-fade-up delay-300 lg:col-span-2">
              {/* Tabs */}
              <div className="glass mb-5 flex w-fit gap-1 rounded-xl p-1">
                {TABS.map(({ id, label, icon: I }) => (
                  <button
                    key={id}
                    onClick={() => setTab(id as 'itinerary' | 'packing')}
                    className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                      tab === id
                        ? 'border border-brand-400/25 bg-gradient-to-r from-brand-500/28 to-indigo-500/18 text-white shadow-glow-brand'
                        : 'text-white/40 hover:text-white/70'
                    }`}
                  >
                    <I className="h-4 w-4" strokeWidth={1.5} />
                    {label}
                  </button>
                ))}
              </div>

              {tab === 'itinerary' && (
                <div className="space-y-4">
                  {result.itinerary.map((day, i) => (
                    <ItineraryCard key={day.day} day={day} index={i} />
                  ))}
                </div>
              )}
              {tab === 'packing' && (
                <div className="animate-fade-in">
                  <PackingList packingList={result.packing_list} />
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="animate-fade-up delay-400 space-y-5">
              {/* Weather */}
              <div>
                <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-white/35">Weather</p>
                <WeatherCard weather={result.weather} />
              </div>

              {/* Summary */}
              <div className="glass grad-border rounded-2xl p-5">
                <p className="mb-4 font-mono text-[10px] uppercase tracking-widest text-white/35">Trip Summary</p>
                <div className="space-y-3">
                  {[
                    { label: 'Days planned',   value: `${result.itinerary.length} days` },
                    { label: 'Packing items',  value: `${totalItems} items` },
                    { label: 'Budget',         value: `₹${Number(form?.budget).toLocaleString('en-IN')}` },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between border-b border-white/5 pb-3 last:border-0 last:pb-0">
                      <span className="text-xs text-white/35">{label}</span>
                      <span className="font-mono text-xs font-medium text-white/65">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Replan */}
              <button
                onClick={() => router.push('/')}
                className="glass flex w-full items-center justify-center gap-2 rounded-xl border border-white/8 py-3.5 text-sm text-white/45 transition-all hover:bg-white/5 hover:text-white/75"
              >
                <ArrowLeft className="h-4 w-4" />
                Replan this trip
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
