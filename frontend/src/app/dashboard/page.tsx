'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useAuth } from '@/lib/auth-context'
import { getUserTrips, deleteTrip, type SavedTrip } from '@/lib/supabase'
import { TRIP_STORAGE_KEY, FORM_STORAGE_KEY } from '@/lib/api'
import {
  MapPin, Calendar, DollarSign, Trash2, Eye,
  Plus, Clock, Plane, LogIn,
} from 'lucide-react'

function TripCard({ trip, onDelete, onView }: {
  trip: SavedTrip
  onDelete: (id: string) => void
  onView: (trip: SavedTrip) => void
}) {
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm('Delete this trip?')) return
    setDeleting(true)
    await deleteTrip(trip.id)
    onDelete(trip.id)
  }

  const date = new Date(trip.created_at).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  })

  return (
    <div className="glass grad-border group relative cursor-pointer overflow-hidden rounded-2xl p-5 transition-all duration-200 hover:bg-white/[.06]"
      onClick={() => onView(trip)}
    >
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-indigo-500 shadow-glow-brand">
            <Plane className="h-5 w-5 text-white" strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="text-base font-bold capitalize text-white" style={{ fontFamily: 'var(--font-display)' }}>
              {trip.destination}
            </h3>
            <p className="text-xs text-white/35">{trip.travel_month}</p>
          </div>
        </div>

        <button
          onClick={handleDelete}
          disabled={deleting}
          className="rounded-lg border border-red-500/20 bg-red-500/10 p-2 text-red-400 opacity-0 transition-all group-hover:opacity-100 hover:bg-red-500/25 disabled:opacity-50"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Stats */}
      <div className="mb-4 grid grid-cols-3 gap-2">
        {[
          { icon: Calendar,   value: `${trip.duration} days`,                                    color: 'text-indigo-400' },
          { icon: DollarSign, value: `₹${Number(trip.budget).toLocaleString('en-IN')}`,          color: 'text-yellow-400' },
          { icon: MapPin,     value: `${trip.result_json?.itinerary?.length ?? 0} day plan`,     color: 'text-brand-400' },
        ].map(({ icon: I, value, color }, idx) => (
          <div key={idx} className="flex items-center gap-1.5">
            <I className={`h-3.5 w-3.5 flex-shrink-0 ${color}`} strokeWidth={1.5} />
            <span className="truncate text-xs text-white/50">{value}</span>
          </div>
        ))}
      </div>

      {/* Interests */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        {trip.interests.slice(0, 4).map((tag) => (
          <span key={tag} className="rounded-full border border-brand-400/20 bg-brand-500/10 px-2.5 py-0.5 font-mono text-[10px] capitalize text-brand-300">
            {tag}
          </span>
        ))}
        {trip.interests.length > 4 && (
          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[10px] text-white/30">
            +{trip.interests.length - 4}
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-white/5 pt-3">
        <div className="flex items-center gap-1.5 text-white/25">
          <Clock className="h-3 w-3" />
          <span className="text-xs">{date}</span>
        </div>
        <div className="flex items-center gap-1.5 text-brand-400 opacity-0 transition-opacity group-hover:opacity-100">
          <Eye className="h-3.5 w-3.5" />
          <span className="text-xs font-medium">View Trip</span>
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [trips,    setTrips]    = useState<SavedTrip[]>([])
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    if (!loading && !user) return
    if (!loading && user) {
      getUserTrips(user.id).then((data) => {
        setTrips(data)
        setFetching(false)
      })
    }
  }, [user, loading])

  const handleView = (trip: SavedTrip) => {
    sessionStorage.setItem(TRIP_STORAGE_KEY, JSON.stringify(trip.result_json))
    sessionStorage.setItem(FORM_STORAGE_KEY, JSON.stringify({
      destination:  trip.destination,
      duration:     trip.duration,
      budget:       trip.budget,
      travel_month: trip.travel_month,
      interests:    trip.interests,
    }))
    router.push('/results')
  }

  const handleDelete = (id: string) => {
    setTrips((prev) => prev.filter((t) => t.id !== id))
  }

  if (loading || fetching) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="fixed inset-0" style={{ background: 'linear-gradient(135deg, #020817 0%, #0d1b3e 45%, #120e38 70%, #020c1f 100%)' }} />
        <div className="relative z-10 text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-brand-400" />
          <p className="text-sm text-white/40">Loading your trips…</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="fixed inset-0" style={{ background: 'linear-gradient(135deg, #020817 0%, #0d1b3e 45%, #120e38 70%, #020c1f 100%)' }} />
        <div className="relative z-10 text-center">
          <p className="mb-2 text-5xl">🔒</p>
          <h2 className="mb-2 text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
            Sign in to see your trips
          </h2>
          <p className="mb-6 text-sm text-white/40">Your saved trips will appear here</p>
          <Link href="/login" className="btn-primary inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm">
            <LogIn className="h-4 w-4" /> Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0" style={{ background: 'linear-gradient(135deg, #020817 0%, #0d1b3e 45%, #120e38 70%, #020c1f 100%)' }} />
      <div className="pointer-events-none fixed right-1/4 top-1/4 h-96 w-96 animate-glow rounded-full bg-indigo-500/6 blur-3xl" />
      <div className="pointer-events-none fixed bottom-1/3 left-1/4 h-80 w-80 animate-glow delay-300 rounded-full bg-brand-500/6 blur-3xl" />
      <div className="dot-grid pointer-events-none fixed inset-0 opacity-[.025]" />

      <Navbar />

      <main className="relative z-10 px-4 pb-16 pt-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">

          {/* Header */}
          <div className="animate-fade-up mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white sm:text-4xl" style={{ fontFamily: 'var(--font-display)' }}>
                My <span className="gradient-text">Trips</span>
              </h1>
              <p className="mt-1 text-sm text-white/35">
                {trips.length > 0
                  ? `${trips.length} trip${trips.length > 1 ? 's' : ''} saved to your account`
                  : 'No trips saved yet'}
              </p>
            </div>

            <Link
              href="/"
              className="btn-primary flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm"
            >
              <Plus className="h-4 w-4" />
              New Trip
            </Link>
          </div>

          {/* Empty state */}
          {trips.length === 0 && (
            <div className="animate-fade-up glass grad-border rounded-2xl p-16 text-center">
              <p className="mb-4 text-6xl">✈️</p>
              <h2 className="mb-2 text-xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
                No trips yet
              </h2>
              <p className="mb-6 text-sm text-white/40">
                Generate your first AI trip and it will be saved here automatically
              </p>
              <Link href="/" className="btn-primary inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm">
                <Plus className="h-4 w-4" /> Plan your first trip
              </Link>
            </div>
          )}

          {/* Trip grid */}
          {trips.length > 0 && (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {trips.map((trip) => (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  onDelete={handleDelete}
                  onView={handleView}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}