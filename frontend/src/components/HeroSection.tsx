'use client'

export default function HeroSection() {
  return (
    <div className="mb-10 text-center sm:mb-14">
      {/* Badge */}
      <div className="animate-fade-up delay-100 mb-6 inline-flex items-center gap-2 rounded-full border border-brand-400/20 bg-brand-500/10 px-4 py-2">
        <span>✨</span>
        <span className="font-mono text-xs font-medium tracking-widest text-brand-300 uppercase">
          AI Travel Intelligence
        </span>
      </div>

      {/* Headline */}
      <h1
        className="animate-fade-up delay-200 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        Plan Your{' '}
        <span className="gradient-text">Dream Trip</span>
        <br />
        <span className="text-white">with AI</span>
      </h1>

      {/* Subtitle */}
      <p className="animate-fade-up delay-300 mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/45 sm:text-lg">
        Enter your destination and preferences. Get a personalized day-by-day
        itinerary and weather-aware packing list in seconds.
      </p>

      {/* Social proof */}
      <div className="animate-fade-up delay-400 mt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10">
        {[
          { value: '10K+', label: 'Trips planned' },
          { value: '120+', label: 'Destinations' },
          { value: '4.9 ★', label: 'User rating' },
        ].map(({ value, label }) => (
          <div key={label} className="text-center">
            <p className="gradient-text text-lg font-bold sm:text-xl" style={{ fontFamily: 'var(--font-display)' }}>
              {value}
            </p>
            <p className="mt-0.5 text-xs text-white/30">{label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
