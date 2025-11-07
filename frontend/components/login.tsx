"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from '@/lib/auth'

export function Login() {
	const router = useRouter()
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [remember, setRemember] = useState(false)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const auth = useAuth()

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		setError(null)
		if (!email.trim() || !password.trim()) {
			setError("Please provide both email and password.")
			return
		}
		setLoading(true)

		try {
			await auth.login(email.trim(), password, remember)
			router.push('/dashboard')
		} catch (err: any) {
			setError(err?.message || 'Sign in failed')
		} finally {
			setLoading(false)
		}
	}

	return (
		<Card className="max-w-md md:max-w-lg lg:max-w-xl w-full mx-auto p-6">
			<h2 className="text-2xl font-semibold text-foreground mb-2">Welcome back</h2>
			<p className="text-sm text-muted-foreground mb-4">Sign in to continue to HealthSync EMR</p>

			<form onSubmit={handleSubmit} className="space-y-4">
				{error && <div className="text-sm text-destructive">{error}</div>}

				<div>
					<label className="text-sm text-muted-foreground block mb-1">Email</label>
					<Input
						type="email"
						placeholder="you@clinic.org"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
				</div>

				<div>
					<div className="flex items-center justify-between mb-1">
						<label className="text-sm text-muted-foreground">Password</label>
						<Link href="/forgot" className="text-sm text-primary underline-offset-2 hover:underline">
							Forgot?
						</Link>
					</div>
					<Input
						type="password"
						placeholder="••••••••"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</div>

				<div className="flex items-center justify-between">
					<label className="inline-flex items-center gap-2 text-sm text-muted-foreground">
						<input
							type="checkbox"
							checked={remember}
							onChange={(e) => setRemember(e.target.checked)}
							className="w-4 h-4 rounded border border-input bg-background"
						/>
						Remember me
					</label>
				</div>

				<div>
					<Button type="submit" className="w-full" disabled={loading}>
						{loading ? "Signing in…" : "Sign in"}
					</Button>
				</div>

				<div className="text-center text-sm text-muted-foreground">
					Don’t have an account?{' '}
					<Link href="/signup" className="text-primary hover:underline">
						Get started
					</Link>
				</div>
			</form>
		</Card>
	)
}

export default Login
