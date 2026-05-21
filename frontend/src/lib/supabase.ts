// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON)

// ── Types ──────────────────────────────────────────────────────────────────

export interface SavedTrip {
  id:           string
  user_id:      string
  destination:  string
  duration:     number
  budget:       number
  travel_month: string
  interests:    string[]
  result_json:  any
  created_at:   string
}

// ── Auth helpers ───────────────────────────────────────────────────────────

export async function getUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function signInWithEmail(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password })
}

export async function signUpWithEmail(email: string, password: string) {
  return supabase.auth.signUp({ email, password })
}

export async function signOut() {
  return supabase.auth.signOut()
}

// ── Trip helpers ───────────────────────────────────────────────────────────

export async function saveTrip(
  userId: string,
  form: { destination: string; duration: number; budget: number; travel_month: string; interests: string[] },
  result: any
) {
  const { data, error } = await supabase
    .from('saved_trips')
    .insert({
      user_id:      userId,
      destination:  form.destination,
      duration:     form.duration,
      budget:       form.budget,
      travel_month: form.travel_month,
      interests:    form.interests,
      result_json:  result,
    })
    .select()
    .single()

  return { data, error }
}

export async function getUserTrips(userId: string): Promise<SavedTrip[]> {
  const { data, error } = await supabase
    .from('saved_trips')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) { console.error('Error fetching trips:', error); return [] }
  return data ?? []
}

export async function deleteTrip(tripId: string) {
  return supabase.from('saved_trips').delete().eq('id', tripId)
}