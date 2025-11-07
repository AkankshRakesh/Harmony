import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { findById, findByEmail } from '@/lib/userStore'

const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret'

export async function GET(req: Request) {
  try {
    // Try Authorization header first
    const auth = req.headers.get('authorization')
    let token: string | null = null
    if (auth && auth.startsWith('Bearer ')) {
      token = auth.split(' ')[1]
    }

    if (!token) return NextResponse.json({ error: 'missing token' }, { status: 401 })

    let data: any
    try {
      data = jwt.verify(token, JWT_SECRET)
    } catch (err) {
      return NextResponse.json({ error: 'invalid token' }, { status: 401 })
    }

    let user = await findById(data.id)
    if (!user && data.email) user = await findByEmail(data.email)
    if (!user) return NextResponse.json({ error: 'user not found' }, { status: 404 })

    return NextResponse.json({ user: { id: user.id, email: user.email, role: user.role, profile: user.profile } })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('me error', err)
    return NextResponse.json({ error: 'failed to load user' }, { status: 500 })
  }
}
