import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import getDb from './mongo'
import { ObjectId } from 'mongodb'

type User = {
  id: string
  email: string
  passwordHash: string
  role?: string
  profile?: any
}

const usersMap: Map<string, User> = (globalThis as any).__HS_USERS ||= new Map()

async function findByEmail(email: string): Promise<User | null> {
  const db = await getDb()
  if (db) {
    const u = await db.collection('users').findOne({ email })
    if (!u) return null
    return { id: String(u._id), email: u.email, passwordHash: u.passwordHash, role: u.role, profile: u.profile }
  }
  for (const u of usersMap.values()) if (u.email === email) return u
  return null
}

async function findById(id: string): Promise<User | null> {
  const db = await getDb()
  if (db) {
    // mongodb _id is ObjectId; attempt to query by ObjectId and fallback to id field
    let filter: any
    try {
      filter = { $or: [{ _id: new ObjectId(id) }, { id }] }
    } catch (e) {
      filter = { id }
    }
    const u: any = await db.collection('users').findOne(filter as any)
    if (!u) return null
    return { id: String(u._id || u.id), email: u.email, passwordHash: u.passwordHash, role: u.role, profile: u.profile }
  }
  return usersMap.get(id) || null
}

async function createUser(payload: { email: string; password: string; role?: string; profile?: any }): Promise<User> {
  const { email, password, role, profile } = payload
  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)
  const db = await getDb()
  if (db) {
    const res = await db.collection('users').insertOne({ email, passwordHash: hash, role, profile, createdAt: new Date() })
    return { id: String(res.insertedId), email, passwordHash: hash, role, profile }
  }

  const id = uuidv4()
  const user = { id, email, passwordHash: hash, role, profile }
  usersMap.set(id, user)
  return user
}

export { findByEmail, findById, createUser }

export type { User }
