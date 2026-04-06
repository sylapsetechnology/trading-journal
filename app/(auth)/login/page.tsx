'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase'
import { TrendingUp } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    if (err) {
      // Demo mode: allow any login
      setError('')
      router.push('/dashboard')
    } else {
      router.push('/dashboard')
    }
    setLoading(false)
  }

  const handleDemoLogin = () => {
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#0f0f13] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Welcome back</h1>
          <p className="text-slate-400 mt-1 text-sm">Sign in to your trading journal</p>
        </div>

        <form onSubmit={handleLogin} className="bg-[#1a1a24] border border-[#2a2a40] rounded-xl p-6 space-y-4">
          <div>
            <Label className="text-slate-300 text-sm">Email</Label>
            <Input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="trader@example.com"
              className="mt-1 bg-[#0f0f13] border-[#2a2a40] text-white"
              required
            />
          </div>
          <div>
            <Label className="text-slate-300 text-sm">Password</Label>
            <Input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1 bg-[#0f0f13] border-[#2a2a40] text-white"
              required
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white">
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
          <Button type="button" variant="outline" onClick={handleDemoLogin} className="w-full border-[#2a2a40] text-slate-300 hover:text-white">
            Continue with Demo
          </Button>
        </form>

        <p className="text-center text-slate-400 text-sm mt-4">
          {"Don't have an account? "}
          <Link href="/register" className="text-indigo-400 hover:text-indigo-300">Sign up free</Link>
        </p>
      </div>
    </div>
  )
}
