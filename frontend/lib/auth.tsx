"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type User = { id: string; email: string; role?: string; profile?: any } | null

type AuthContextType = {
  user: User
  loading: boolean
  login: (email: string, password: string, remember?: boolean) => Promise<User>
  signup: (payload: { email: string; password: string; role?: string; profile?: any }, remember?: boolean) => Promise<User>
  logout: () => Promise<void>
  authFetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function getStoredToken() {
  try {
    return localStorage.getItem('hs_token') || sessionStorage.getItem('hs_token')
  } catch (e) {
    return null
  }
}

function storeToken(token: string, remember = true) {
  try {
    if (remember) localStorage.setItem('hs_token', token)
    else sessionStorage.setItem('hs_token', token)
  } catch (e) {}
}

function clearToken() {
  try {
    localStorage.removeItem('hs_token')
    sessionStorage.removeItem('hs_token')
  } catch (e) {}
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    let mounted = true
    async function init() {
      setLoading(true)
      const token = getStoredToken()
      if (!token) {
        setLoading(false)
        return
      }
      try {
        const res = await fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
        if (!res.ok) {
          clearToken()
          if (mounted) setUser(null)
          setLoading(false)
          return
        }
        const data = await res.json()
        if (mounted) setUser(data.user || null)
      } catch (err) {
        clearToken()
        if (mounted) setUser(null)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    init()
    return () => { mounted = false }
  }, [])

  async function login(email: string, password: string, remember = false) {
    const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) })
    const data = await res.json()
    if (!res.ok) throw new Error(data?.error || 'Login failed')
    const token: string | undefined = data?.token
    if (token) storeToken(token, remember)
    setUser(data.user || null)
    return data.user || null
  }

  async function signup(payload: { email: string; password: string; role?: string; profile?: any }, remember = false) {
    const res = await fetch('/api/auth/signup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    const data = await res.json()
    if (!res.ok) throw new Error(data?.error || 'Signup failed')
    const token: string | undefined = data?.token
    if (token) storeToken(token, remember)
    setUser(data.user || null)
    return data.user || null
  }

  async function logout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch (e) {}
    clearToken()
    setUser(null)
    router.push('/login')
  }

  async function authFetch(input: RequestInfo, init?: RequestInit) {
    const token = getStoredToken()
    const headers = { ...(init?.headers as Record<string, string> | undefined), ...(token ? { Authorization: `Bearer ${token}` } : {}) }
    return fetch(input, { ...init, headers })
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, authFetch }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export default AuthProvider
