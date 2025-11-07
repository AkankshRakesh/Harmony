import { NextResponse } from 'next/server'

export async function POST() {
  // For client-managed tokens (option 2) logout is a client operation — server can optionally accept
  // a token revocation request. For now return ok and let client clear localStorage.
  return NextResponse.json({ ok: true })
}
