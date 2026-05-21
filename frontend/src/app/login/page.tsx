'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Globe, Sparkles, Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { signInWithEmail, signUpWithEmail } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [mode,     setMode]     = useState<'signin' | 'signup'>('signin')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPwd,  setShowPwd]  = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState<string | null>(null)
  const [success,  setSuccess]  = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      if (mode === 'signin') {
        const { error } = await signInWithEmail(email, password)
        if (error) throw error
        router.push('/')
      } else {
        const { error } = await signUpWithEmail(email, password)
        if (error) throw error
        setSuccess('Account created! Check your email to confirm, then sign in.')
        setMode('signin')
      }
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4">
      <div className="fixed inset-0" style={{ background: 'linear-gradient(135deg, #020817 0%, #0d1b3e 45%, #120e38 70%, #020c1f 100%)' }} />
      <div className="pointer-events-none fixed left-1/4 top-1/3 h-96 w-96 animate-glow rounded-full bg-brand-500/7 blur-3xl" />
      <div className="pointer-events-none fixed right-1/4 top-1/4 h-80 w-80 animate-glow delay-500 rounded-full bg-indigo-500/7 blur-3xl" />
      <div className="dot-grid pointer-events-none fixed inset-0 opacity-[.035]" />

      <div className="relative z-10 w-full max-w-md">
        <Link href="/" className="mb-6 flex items-center gap-2 text-sm text-white/40 transition-colors hover:text-white/70">
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>

        <div className="glass-strong grad-border overflow-hidden rounded-2xl p-8 shadow-glass">
          {/* Logo */}
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="relative mb-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 to-indigo-500 shadow-glow-brand">
                <Globe className="h-7 w-7 text-white" strokeWidth={2} />
              </div>
              <Sparkles className="absolute -right-1 -top-1 h-4 w-4 text-yellow-300" />
            </div>
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
              {mode === 'signin' ? 'Welcome back' : 'Create account'}
            </h1>
            <p className="mt-1 text-sm text-white/40">
              {mode === 'signin' ? 'Sign in to access your saved trips' : 'Start planning AI-powered trips'}
            </p>
          </div>

          {success && (
            <div className="mb-4 rounded-xl border border-green-500/20 bg-green-500/10 p-3 text-sm text-green-300">
              {success}
            </div>
          )}
          {error && (
            <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block font-mono text-[11px] font-medium uppercase tracking-widest text-white/40">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-400" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input-base w-full rounded-xl py-3.5 pl-10 pr-4 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block font-mono text-[11px] font-medium uppercase tracking-widest text-white/40">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-400" />
                <input
                  type={showPwd ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="input-base w-full rounded-xl py-3.5 pl-10 pr-10 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(p => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                >
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {mode === 'signup' && (
                <p className="mt-1.5 text-[11px] text-white/25">Minimum 6 characters</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary mt-2 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm disabled:opacity-60"
            >
              {loading ? (
                <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                {mode === 'signin' ? 'Signing in…' : 'Creating account…'}</>
              ) : (
                mode === 'signin' ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-white/35">
            {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => { setMode(m => m === 'signin' ? 'signup' : 'signin'); setError(null); setSuccess(null) }}
              className="font-medium text-brand-300 transition-colors hover:text-brand-200"
            >
              {mode === 'signin' ? 'Create one' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}