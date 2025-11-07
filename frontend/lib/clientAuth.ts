// Minimal client-only auth helper (DEMO ONLY)
// WARNING: This is insecure and only intended for local prototyping. Do NOT use in production.

export type ClientUser = {
  id: string
  email: string
  password: string // stored in plaintext here for demo simplicity — insecure
  role?: string
  profile?: any
}

const USERS_KEY = 'hs_users'
const TOKEN_KEY = 'hs_token'
const CURRENT_KEY = 'hs_current_user'

function readUsers(): Record<string, ClientUser> {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '{}')
  } catch (e) {
    return {}
  }
}

function writeUsers(users: Record<string, ClientUser>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function makeToken() {
  return Math.random().toString(36).slice(2) + '.' + Date.now().toString(36)
}

export function signupClient(opts: { email: string; password: string; role?: string; profile?: any }, remember = true) {
  const { email, password, role, profile } = opts
  const users = readUsers()
  if (users[email]) throw new Error('User already exists')
  const id = 'user_' + Date.now().toString(36)
  const user: ClientUser = { id, email, password, role, profile }
  users[email] = user
  writeUsers(users)

  const token = makeToken()
  try {
    if (remember) localStorage.setItem(TOKEN_KEY, token)
    else sessionStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(CURRENT_KEY, JSON.stringify({ id: user.id, email: user.email, role: user.role, profile: user.profile }))
  } catch (e) {
    // ignore storage errors in demo
  }

  return { token, user: { id: user.id, email: user.email, role: user.role, profile: user.profile } }
}

export function loginClient(email: string, password: string, remember = false) {
  const users = readUsers()
  const u = users[email]
  if (!u || u.password !== password) throw new Error('Invalid credentials')

  const token = makeToken()
  try {
    if (remember) localStorage.setItem(TOKEN_KEY, token)
    else sessionStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(CURRENT_KEY, JSON.stringify({ id: u.id, email: u.email, role: u.role, profile: u.profile }))
  } catch (e) {
    // ignore
  }

  return { token, user: { id: u.id, email: u.email, role: u.role, profile: u.profile } }
}

export function logoutClient() {
  try {
    localStorage.removeItem(TOKEN_KEY)
    sessionStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(CURRENT_KEY)
  } catch (e) {
    // ignore
  }
}

export function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem(CURRENT_KEY) || 'null')
  } catch (e) {
    return null
  }
}

export async function authFetch(input: RequestInfo, init?: RequestInit) {
  // Attach demo token as Bearer header if present
  let token = null
  try { token = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY) } catch (e) { token = null }
  const headers = { ...(init?.headers as Record<string, string> | undefined), ...(token ? { Authorization: `Bearer ${token}` } : {}) }
  return fetch(input, { ...init, headers })
}

export default {
  signupClient,
  loginClient,
  logoutClient,
  getCurrentUser,
  authFetch,
}
