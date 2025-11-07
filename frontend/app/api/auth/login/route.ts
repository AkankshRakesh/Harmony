import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { findByEmail } from '@/lib/userStore'

const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret'

function signToken(user: { id: string; email: string; role?: string }) {
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' })
}

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) return NextResponse.json({ error: 'email and password required' }, { status: 400 })

    const found = await findByEmail(email)
    if (!found) return NextResponse.json({ error: 'invalid credentials' }, { status: 401 })

    const ok = await bcrypt.compare(password, found.passwordHash)
    if (!ok) return NextResponse.json({ error: 'invalid credentials' }, { status: 401 })

    const token = signToken(found)
    return NextResponse.json({ token, user: { id: found.id, email: found.email, role: found.role, profile: found.profile } })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('login error', err)
    return NextResponse.json({ error: 'login failed' }, { status: 500 })
  }
}
