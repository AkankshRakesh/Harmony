const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 4000

// Basic middleware
app.use(helmet())
app.use(cors())
app.use(express.json())

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() })
})

// Simple features endpoint - mirrors frontend features list
app.get('/api/features', (req, res) => {
  const features = [
    {
      icon: 'Users',
      title: 'Supportive Community',
      description: 'Connect with thousands of people who understand your journey and share similar experiences.'
    },
    {
      icon: 'MessageCircle',
      title: 'Peer Support Groups',
      description: 'Join moderated groups focused on specific mental health topics and challenges.'
    },
    {
      icon: 'BookOpen',
      title: 'Wellness Resources',
      description: 'Access curated articles, guides, and expert-backed content for mental wellness.'
    },
    {
      icon: 'Shield',
      title: 'Privacy & Safety',
      description: 'Your privacy is paramount. All conversations are encrypted and completely confidential.'
    }
  ]
  res.json({ features })
})

// Serve static files (optional)
app.use('/static', express.static(path.join(__dirname, 'public')))

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Harmony backend listening on http://localhost:${PORT}`)
})
