import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { createUser, findByEmail } from '@/lib/userStore'
import getDb from '@/lib/mongo'
import { ObjectId } from 'mongodb'

const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret'

function signToken(user: { id: string; email: string; role?: string }) {
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' })
}

function slugify(str = '') {
  return String(str)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password, role = 'doctor', profile = {} } = body
    if (!email || !password) return NextResponse.json({ error: 'email and password required' }, { status: 400 })

    const existing = await findByEmail(email)
    if (existing) return NextResponse.json({ error: 'user already exists' }, { status: 409 })

    const user = await createUser({ email, password, role, profile })

    if (role === 'organization') {
      try {
        const db = await getDb()
        const orgName = profile?.organization || profile?.name || ''
        if (db && orgName) {
          const organizations = db.collection('organizations')
          const slug = slugify(orgName)
          const orgRes = await organizations.insertOne({ name: orgName, slug, admin: user.id, createdAt: new Date() })

          // attempt to update the user profile to reference the organization id
          try {
            const usersCol = db.collection('users')
            // use ObjectId filter when possible, otherwise fallback to id field
            let filter: any = { id: user.id }
            try {
              filter = { _id: new ObjectId(user.id) }
            } catch (e) {
              filter = { id: user.id }
            }
            await usersCol.updateOne(filter, { $set: { 'profile.organizationId': String(orgRes.insertedId) } })
            // reflect in the returned user object
            user.profile = { ...(user.profile || {}), organizationId: String(orgRes.insertedId) }
          } catch (e) {
            console.warn('failed to link user to organization', e)
          }
        }
      } catch (e) {
        console.warn('organization save skipped', e)
      }
    }

    const token = signToken(user)
    return NextResponse.json({ token, user: { id: user.id, email: user.email, role: user.role, profile: user.profile } }, { status: 201 })
  } catch (err) {
    console.error('signup error', err)
    return NextResponse.json({ error: 'signup failed' }, { status: 500 })
  }
}
