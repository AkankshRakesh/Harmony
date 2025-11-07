"use client"

import { useEffect, useState, PropsWithChildren } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthGuard({ children }: PropsWithChildren) {
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    let mounted = true

    async function check() {
      try {
        const token = typeof window !== 'undefined' ? (localStorage.getItem('hs_token') || sessionStorage.getItem('hs_token')) : null
        if (!token) {
          router.replace('/login')
          return
        }

        // Validate token server-side
        const res = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) {
          try {
            localStorage.removeItem('hs_token')
            sessionStorage.removeItem('hs_token')
          } catch (e) {}
          router.replace('/login')
          return
        }

        // all good
        if (mounted) setChecking(false)
      } catch (err) {
        try {
          localStorage.removeItem('hs_token')
          sessionStorage.removeItem('hs_token')
        } catch (e) {}
        router.replace('/login')
      }
    }

    check()
    return () => { mounted = false }
  }, [router])

  if (checking) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-sm text-muted-foreground">Checking session…</div>
      </div>
    )
  }

  return <>{children}</>
}
