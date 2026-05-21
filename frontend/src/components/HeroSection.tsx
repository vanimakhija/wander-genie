'use client'
import Image from 'next/image'

export default function HeroSection() {
  return (
    <div className="mb-10 text-center sm:mb-14">
      {/* Logo */}
      <div className="animate-fade-up delay-100 mb-8 inline-flex items-center justify-center">
        <div className="group relative">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-brand-400/30 to-indigo-500/30 blur-2xl transition-all duration-300 group-hover:from-brand-400/50 group-hover:to-indigo-500/50 group-hover:blur-3xl h-40 w-40" />
          <div className="relative overflow-hidden rounded-full border-2 border-brand-400/40 transition-all duration-300 group-hover:border-brand-400/70 group-hover:scale-110 h-40 w-40">
            <Image
              src="/logo.png"
              alt="WanderGenie Logo"
              width={160}
              height={160}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
              priority
            />
          </div>
        </div>
      </div>

      {/* Headline */}
      <h1
        className="animate-fade-up delay-200 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        Plan Your{' '}
        <span className="gradient-text">Dream Trip</span>
      </h1>

      {/* Subtitle */}
      <p className="animate-fade-up delay-300 mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/45 sm:text-lg">
        Enter your destination and preferences. Get a personalized day-by-day
        itinerary and weather-aware packing list in seconds.
      </p>
    </div>
  )
}
