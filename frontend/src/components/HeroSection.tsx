'use client'
import Image from 'next/image'

export default function HeroSection() {
  return (
    <div className="mb-10 text-center">
      {/* Logo */}
      <div className="animate-fade-up delay-100 mb-10 flex justify-center">
        <div className="group relative w-fit">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-brand-400/30 to-indigo-500/30 blur-3xl transition-all duration-300 group-hover:from-brand-400/50 group-hover:to-indigo-500/50 group-hover:blur-4xl h-40 w-40" />
          <div className="relative overflow-hidden rounded-full border-2 border-brand-400/40 transition-all duration-300 group-hover:border-brand-400/70 group-hover:scale-125 h-40 w-40">
            <Image
              src="/logo.png"
              alt="WanderGenie Logo"
              width={160}
              height={160}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-125"
              priority
            />
          </div>
        </div>
      </div>

      {/* Headline */}
      <h1
        className="animate-fade-up delay-200 text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight text-white transition-all duration-300 hover:scale-105 hover:drop-shadow-[0_0_40px_rgba(79,70,229,0.5)]"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        Make Your{' '}
        <span className="gradient-text hover:animate-pulse">Dream Trip</span>
      </h1>

      {/* Subtitle */}
      <p className="animate-fade-up delay-300 mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/45 sm:text-lg">
        Enter your destination and preferences. Get a personalized day-by-day
        itinerary and weather-aware packing list in seconds.
      </p>
    </div>
  )
}
