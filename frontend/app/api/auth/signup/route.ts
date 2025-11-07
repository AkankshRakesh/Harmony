import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { createUser, findByEmail } from '@/lib/userStore'

const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret'

function signToken(user: { id: string; email: string; role?: string }) {
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password, role = 'doctor', profile = {} } = body
    if (!email || !password) return NextResponse.json({ error: 'email and password required' }, { status: 400 })

    const existing = await findByEmail(email)
    if (existing) return NextResponse.json({ error: 'user already exists' }, { status: 409 })

    const user = await createUser({ email, password, role, profile })
    const token = signToken(user)
    return NextResponse.json({ token, user: { id: user.id, email: user.email, role: user.role, profile: user.profile } }, { status: 201 })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('signup error', err)
    return NextResponse.json({ error: 'signup failed' }, { status: 500 })
  }
}
