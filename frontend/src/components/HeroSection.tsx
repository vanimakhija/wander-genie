'use client'
import Image from 'next/image'

export default function HeroSection() {
  return (
    <div className="mb-10 text-center sm:mb-14">
      {/* Logo */}
      <div className="animate-fade-up delay-100 mb-8 inline-flex items-center justify-center">
        <div className="group relative h-32 w-32 transition-all duration-300 hover:scale-110">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-brand-400/20 to-indigo-500/20 blur-xl transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-brand-400/40 group-hover:to-indigo-500/40" />
          <div className="relative flex h-full w-full items-center justify-center rounded-full border border-brand-400/30 bg-brand-500/5 backdrop-blur transition-all duration-300 group-hover:border-brand-400/60 group-hover:bg-brand-500/10">
            <Image
              src="/logo.png"
              alt="WanderGenie Logo"
              width={128}
              height={128}
              className="h-28 w-28 transition-transform duration-300 group-hover:scale-110"
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
