'use client'

export default function FeaturesSection() {
  const features = [
    {
      icon: '📅',
      title: 'Day-by-Day Itinerary',
      description: 'Detailed daily plans with activities, meals, and local tips — perfectly timed.',
    },
    {
      icon: '🎒',
      title: 'Smart Packing List',
      description: 'Weather-aware packing suggestions tailored to your destination and interests.',
    },
    {
      icon: '🌤️',
      title: 'Weather Intelligence',
      description: "Real-time weather insights with advisories so you're never caught off guard.",
    },
  ]

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <p className="mb-4 text-sm font-medium text-white/40 uppercase tracking-widest">
            Why WanderGenie
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6">
            Travel Smarter
            <br />
            <span className="gradient-text">With AI</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-white/50">
            From pristine beaches to mountain adventures, we make planning easy, fast, and personalized.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group rounded-2xl border border-white/10 bg-white/[.02] p-8 backdrop-blur transition-all duration-300 hover:border-white/20 hover:bg-white/[.05]"
            >
              <div className="mb-6 text-5xl">{feature.icon}</div>
              <h3 className="mb-4 text-xl font-bold text-white">{feature.title}</h3>
              <p className="text-base leading-relaxed text-white/60">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
