const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const path = require('path')
const mongoose = require('mongoose')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 4000

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
