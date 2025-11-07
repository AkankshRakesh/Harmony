import { NextResponse } from 'next/server'
import getDb from '@/lib/mongo'

const seedOrgs = [
  { name: 'Community Clinic A', slug: 'community-clinic-a' },
  { name: 'General Hospital B', slug: 'general-hospital-b' },
  { name: 'Independent Practice C', slug: 'independent-practice-c' },
]

export async function GET() {
  try {
    const db = await getDb()
    if (!db) {
      // fallback to static list if DB not configured
      return NextResponse.json({ organizations: seedOrgs.map((o, i) => ({ id: `org-${i + 1}`, name: o.name })) })
    }

    const col = db.collection('organizations')
    const count = await col.countDocuments()
    if (count === 0) {
      // seed initial organizations
      await col.insertMany(seedOrgs.map(o => ({ name: o.name, slug: o.slug, createdAt: new Date() })))
    }

    const docs = await col.find().toArray()
    const organizations = docs.map((d: any) => ({ id: String(d._id), name: d.name }))
    return NextResponse.json({ organizations })
  } catch (err) {
    // fallback to static list on error
    // eslint-disable-next-line no-console
    console.error('organizations GET error', err)
    return NextResponse.json({ organizations: seedOrgs.map((o, i) => ({ id: `org-${i + 1}`, name: o.name })) })
  }
}
