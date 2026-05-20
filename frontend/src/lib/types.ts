// src/lib/types.ts

export interface TripRequest {
  destination: string
  budget: number
  duration: number
  interests: string[]
  travel_month: string   // e.g. "January", "June"
}

export interface ItineraryDay {
  day: number
  title: string
  activities: string[]
  meals?: { breakfast: string; lunch: string; dinner: string }
  tips?: string
}

export interface PackingSection {
  name: string
  items: string[]
}

export interface WeatherInfo {
  temperature: string
  condition: string
  rainPrediction: string
  suggestion: string
  humidity?: string
  icon?: 'sunny' | 'cloudy' | 'rainy' | 'hot'
}

export interface TripResponse {
  destination?: string
  itinerary: ItineraryDay[]
  packing_list: PackingSection[]
  weather: WeatherInfo
}