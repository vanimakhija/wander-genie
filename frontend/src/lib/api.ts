// src/lib/api.ts
import type { TripRequest, TripResponse } from './types'

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message)
    this.name = 'ApiError'
  }
}

// ─── Mock builder (used as fallback if backend is down) ───────────────────────
function buildMockResponse(req: TripRequest): TripResponse {
  const { destination, duration, interests } = req

  const dayTitles = [
    'Arrival & First Impressions',
    'Culture & Exploration',
    'Adventure Day',
    'Hidden Gems',
    'Leisure & Local Life',
    'Off the Beaten Path',
    'Farewell & Highlights',
  ]

  const activitySets = [
    [
      `Morning walk through ${destination}'s old quarter`,
      `Visit the central market and try local snacks`,
      `Sunset at the iconic waterfront viewpoint`,
    ],
    [
      'Guided heritage walk with a local expert',
      'Authentic cooking class — hands-on local cuisine',
      'Evening rooftop dinner with city views',
    ],
    [
      'Day trip to a nearby nature reserve or national park',
      interests.includes('adventure') ? 'Kayaking / hiking trail' : 'Leisurely bike tour',
      'Stargazing session at a scenic hilltop',
    ],
    [
      'Explore artisan workshops and craft markets',
      'Street food tour through the local bazaar',
      interests.includes('nightlife') ? 'Jazz bar & live music night' : 'Quiet evening at a riverside café',
    ],
    [
      'Slow morning — spa, yoga, or beach walk',
      interests.includes('shopping') ? 'Boutique shopping in the design district' : 'Museum or gallery afternoon',
      'Farewell dinner at a top-rated local restaurant',
    ],
  ]

  const mealSets = [
    { breakfast: 'Café breakfast or hotel buffet',   lunch: 'Street food market',         dinner: 'Waterfront restaurant' },
    { breakfast: 'Fresh fruit smoothie bowl',        lunch: 'Traditional local cuisine',  dinner: 'Rooftop bistro' },
    { breakfast: 'Bakery croissant & coffee',        lunch: 'Trailhead picnic',            dinner: 'Farm-to-table experience' },
    { breakfast: 'Hole-in-the-wall noodle stall',   lunch: 'Night market preview',        dinner: 'Fine-dining splurge' },
    { breakfast: 'Brunch at an artisan café',       lunch: 'Beachside snacks',            dinner: 'Farewell feast' },
  ]

  const tips = [
    'Book popular restaurants at least 2 days ahead.',
    'Carry local cash — many vendors do not accept cards.',
    'Start early to beat the midday heat and crowds.',
    'Download an offline map before heading out.',
    'Ask your hotel for a local SIM card recommendation.',
  ]

  const itinerary = Array.from({ length: duration }, (_, i) => ({
    day: i + 1,
    title: dayTitles[i % dayTitles.length],
    activities: activitySets[i % activitySets.length],
    meals: mealSets[i % mealSets.length],
    tips: tips[i % tips.length],
  }))

  const clothingItems = [
    'Lightweight breathable shirts (5–6)',
    'Comfortable walking shorts / pants',
    'Smart-casual outfit for dinners',
    'Compact travel jacket or cardigan',
  ]
  if (interests.includes('beaches'))   clothingItems.push('Swimwear (2 sets)', 'Water-resistant sandals')
  if (interests.includes('mountains')) clothingItems.push('Moisture-wicking trekking socks', 'Sturdy hiking boots')
  if (interests.includes('nightlife')) clothingItems.push('One formal / party outfit')
  if (interests.includes('culture'))   clothingItems.push('Modest cover-up for temples / churches')

  const weatherBasedItems = [
    'SPF 50 sunscreen',
    'Waterproof footwear',
    'Compact travel umbrella',
    'Insect repellent (DEET-based)',
  ]

  return {
    destination,
    itinerary,
    packing_list: [
      { name: 'Clothing',       items: clothingItems },
      { name: 'Essentials',     items: ['Universal travel adapter', 'Portable power bank', 'Copies of passport & ID', 'Reusable water bottle', 'Noise-cancelling earbuds'] },
      { name: 'Accessories',    items: ['Polarised sunglasses', 'Compact travel umbrella', 'Day backpack (20–25 L)', 'Travel neck pillow'] },
      { name: 'Health & Safety',items: ['Basic first-aid kit', 'Hand sanitiser', 'Prescription medications (2× supply)', 'Face masks'] },
      { name: 'Weather-based',  items: weatherBasedItems },
    ],
    weather: {
      temperature: '28°C',
      condition: 'Partly cloudy with a pleasant breeze',
      rainPrediction: '30% chance of light rain',
      suggestion: 'Rain expected at times. Carry waterproof footwear and a compact umbrella.',
      humidity: '68%',
      icon: 'cloudy',
    },
  }
}

// ─── Main export ──────────────────────────────────────────────────────────────
export async function generateItinerary(request: TripRequest): Promise<TripResponse> {
  const useMock = process.env.NEXT_PUBLIC_USE_MOCK === 'true'

  if (useMock) {
    await new Promise((r) => setTimeout(r, 2200))
    return buildMockResponse(request)
  }

  try {
    const res = await fetch(`${API_BASE}/generate-itinerary`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    })

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new ApiError(text || `Request failed (${res.status})`, res.status)
    }

    return (await res.json()) as TripResponse
  } catch (err) {
    // If the real backend is unreachable, fall back to mock
    if (err instanceof ApiError) throw err
    console.warn('Backend unreachable — using mock data', err)
    await new Promise((r) => setTimeout(r, 1400))
    return buildMockResponse(request)
  }
}

export const TRIP_STORAGE_KEY = 'wander-genie-trip'
export const FORM_STORAGE_KEY = 'wander-genie-form'

export interface ShareTripPayload {
  form: TripRequest
  result: TripResponse
}

export interface ShareLinkResponse {
  share_id: string
  share_path: string
}

export async function createShareLink(form: TripRequest, result: TripResponse): Promise<string> {
  const payload: ShareTripPayload = {
    form,
    result: { ...result, destination: form.destination },
  }

  const res = await fetch(`${API_BASE}/share-trip`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new ApiError(text || `Share failed (${res.status})`, res.status)
  }

  const data = (await res.json()) as ShareLinkResponse
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  return `${origin}${data.share_path}`
}

export async function fetchSharedTrip(shareId: string): Promise<ShareTripPayload> {
  const res = await fetch(`${API_BASE}/share-trip/${shareId}`)

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new ApiError(text || `Share not found (${res.status})`, res.status)
  }

  return (await res.json()) as ShareTripPayload
}
