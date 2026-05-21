'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import TripForm from '@/components/TripForm'
import LoadingScreen from '@/components/LoadingScreen'
import FeaturesSection from '@/components/FeaturesSection'
import Footer from '@/components/Footer'
import { generateItinerary, TRIP_STORAGE_KEY, FORM_STORAGE_KEY } from '@/lib/api'
import type { TripRequest } from '@/lib/types'

export default function HomePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [destination, setDestination] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (data: TripRequest) => {
    setLoading(true)
    setDestination(data.destination)
    setError(null)

    try {
      const result = await generateItinerary(data)
      sessionStorage.setItem(TRIP_STORAGE_KEY, JSON.stringify(result))
      sessionStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(data))
      router.push('/results')
    } catch (err: unknown) {
      setLoading(false)
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  }

  if (loading) return <LoadingScreen destination={destination} />

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0" style={{ background: 'linear-gradient(135deg, #020817 0%, #0d1b3e 45%, #120e38 70%, #020c1f 100%)' }} />
      {/* Orbs */}
      <div className="pointer-events-none fixed left-1/4 top-1/3 h-96 w-96 animate-glow rounded-full bg-brand-500/7 blur-3xl" />
      <div className="pointer-events-none fixed right-1/4 top-1/4 h-80 w-80 animate-glow delay-500 rounded-full bg-indigo-500/7 blur-3xl" />
      <div className="pointer-events-none fixed bottom-1/4 left-1/3 h-72 w-72 animate-glow delay-300 rounded-full bg-yellow-400/4 blur-3xl" />
      {/* Dot grid */}
      <div className="dot-grid pointer-events-none fixed inset-0 opacity-[.035]" />

      <Navbar />

      <main className="relative z-10 px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            {/* Left: Logo and Heading */}
            <div className="w-full md:w-1/2 flex flex-col items-center md:items-start">
              <HeroSection />
            </div>
            {/* Right: Input Form */}
            <div className="w-full md:w-1/2 flex flex-col items-center">
              <TripForm onSubmit={handleSubmit} isLoading={loading} />
              {error && (
                <div className="mt-4 w-full rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-center">
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              )}
              {/* Popular destinations */}
              <div className="animate-fade-up delay-700 mt-6 text-center w-full">
                <p className="mb-3 text-xs text-white/25">Popular destinations</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {['🌴 Goa', '🏝️ Bali', '🗼 Paris', '🗾 Tokyo', '🌊 Maldives', '🏔️ Manali'].map((d) => (
                    <span key={d} className="glass rounded-full border border-white/[.06] px-3 py-1.5 text-xs text-white/30">
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <FeaturesSection />

      <Footer />
    </div>
  )
}
