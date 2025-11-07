const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const path = require('path')
const mongoose = require('mongoose')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 4000

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret'

// Simple in-memory user store fallback when MongoDB is not configured
const memoryUsers = []

// Basic middleware
app.use(helmet())
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }))
app.use(express.json())

// Mongoose models
const featureSchema = new mongoose.Schema({
  icon: String,
  title: String,
  description: String,
}, { timestamps: true })
const Feature = mongoose.models.Feature || mongoose.model('Feature', featureSchema)

// User schema (optional via MongoDB)
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['doctor', 'organization', 'admin'], default: 'doctor' },
  profile: { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true })
const User = mongoose.models.User || mongoose.model('User', userSchema)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now(), db: mongoose.connection.readyState })
})

// GET features - prefer DB, fallback to static list
app.get('/api/features', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const items = await Feature.find().sort({ createdAt: 1 }).lean()
      if (items && items.length) return res.json({ features: items })
    }

    // fallback static features
    const features = [
      { icon: 'Users', title: 'Supportive Community', description: 'Connect with thousands of people who understand your journey and share similar experiences.' },
      { icon: 'MessageCircle', title: 'Peer Support Groups', description: 'Join moderated groups focused on specific mental health topics and challenges.' },
      { icon: 'BookOpen', title: 'Wellness Resources', description: 'Access curated articles, guides, and expert-backed content for mental wellness.' },
      { icon: 'Shield', title: 'Privacy & Safety', description: 'Your privacy is paramount. All conversations are encrypted and completely confidential.' }
    ]
    return res.json({ features })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error fetching features', err)
    return res.status(500).json({ error: 'failed to fetch features' })
  }
})

// POST feature - simple admin endpoint to add a feature (no auth)
app.post('/api/features', async (req, res) => {
  try {
    const { icon, title, description } = req.body
    const f = await Feature.create({ icon, title, description })
    return res.status(201).json({ feature: f })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err)
    return res.status(500).json({ error: 'failed to create feature' })
  }
})

// List organizations (mocked)
app.get('/api/organizations', (req, res) => {
  const orgs = [
    { id: 'org-1', name: 'Community Clinic A' },
    { id: 'org-2', name: 'General Hospital B' },
    { id: 'org-3', name: 'Independent Practice C' },
  ]
  res.json({ organizations: orgs })
})

// Helper to find user by email (mongo if connected, else memory)
async function findUserByEmail(email) {
  if (mongoose.connection.readyState === 1) {
    return User.findOne({ email }).lean()
  }
  return memoryUsers.find(u => u.email === email)
}

// Helper to create user
async function createUser({ email, passwordHash, role = 'doctor', profile = {} }) {
  if (mongoose.connection.readyState === 1) {
    const u = await User.create({ email, passwordHash, role, profile })
    return u.toObject()
  }
  const id = `mem-${Date.now()}-${Math.random().toString(36).slice(2,8)}`
  const u = { id, email, passwordHash, role, profile, createdAt: new Date(), updatedAt: new Date() }
  memoryUsers.push(u)
  return u
}

// Sign JWT
function signToken(user) {
  const payload = { id: user._id || user.id, email: user.email, role: user.role }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

// Auth middleware for protected routes
function requireAuth(req, res, next) {
  const auth = req.headers.authorization
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'missing token' })
  const token = auth.split(' ')[1]
  try {
    const data = jwt.verify(token, JWT_SECRET)
    req.user = data
    return next()
  } catch (err) {
    return res.status(401).json({ error: 'invalid token' })
  }
}

// Signup
app.post('/api/signup', async (req, res) => {
  try {
    const { email, password, role, profile } = req.body
    if (!email || !password) return res.status(400).json({ error: 'email and password required' })

    const existing = await findUserByEmail(email)
    if (existing) return res.status(409).json({ error: 'user already exists' })

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    const user = await createUser({ email, passwordHash: hash, role, profile })
    const token = signToken(user)
    return res.status(201).json({ user: { id: user._id || user.id, email: user.email, role: user.role, profile: user.profile }, token })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Signup error', err)
    return res.status(500).json({ error: 'signup failed' })
  }
})

// Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ error: 'email and password required' })

    const user = await findUserByEmail(email)
    if (!user) return res.status(401).json({ error: 'invalid credentials' })

    const hash = user.passwordHash || user.password
    const ok = await bcrypt.compare(password, hash)
    if (!ok) return res.status(401).json({ error: 'invalid credentials' })

    const token = signToken(user)
    return res.json({ user: { id: user._id || user.id, email: user.email, role: user.role, profile: user.profile }, token })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Login error', err)
    return res.status(500).json({ error: 'login failed' })
  }
})

// Current user
app.get('/api/me', requireAuth, async (req, res) => {
  try {
    const user = await findUserByEmail(req.user.email)
    if (!user) return res.status(404).json({ error: 'user not found' })
    return res.json({ user: { id: user._id || user.id, email: user.email, role: user.role, profile: user.profile } })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Me error', err)
    return res.status(500).json({ error: 'failed to load user' })
  }
})

// Serve static files (optional)
app.use('/static', express.static(path.join(__dirname, 'public')))

// Connect to MongoDB (if provided) then start server
const mongoUrl = process.env.MONGODB_URL || process.env.MONGODB_URI
if (mongoUrl) {
  mongoose.connect(mongoUrl, { autoIndex: true })
    .then(() => {
      // eslint-disable-next-line no-console
      console.log('Connected to MongoDB')
      app.listen(PORT, () => {
        // eslint-disable-next-line no-console
        console.log(`Harmony backend listening on http://localhost:${PORT}`)
      })
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error('MongoDB connection error:', err)
      // Start server even if DB fails, with limited functionality
      app.listen(PORT, () => {
        // eslint-disable-next-line no-console
        console.log(`Harmony backend listening on http://localhost:${PORT} (DB disconnected)`)
      })
    })
} else {
  // No Mongo URL provided — start server with fallback behaviour
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Harmony backend listening on http://localhost:${PORT} (no MongoDB configured)`)
  })
}
