// server.js — Big Breaking News India Backend Entry Point
// To be fully implemented during Phase 1

require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 5000

// --- Middleware ---
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'))

// --- Static file serving (uploaded images) ---
app.use('/uploads', express.static(path.join(__dirname, 'src/uploads')))

// --- API Routes ---
app.use('/api/auth',       require('./src/routes/auth'))
app.use('/api/articles',   require('./src/routes/articles'))
app.use('/api/categories', require('./src/routes/categories'))
app.use('/api/authors',    require('./src/routes/authors'))
app.use('/api/search',     require('./src/routes/search'))
app.use('/api/upload',     require('./src/routes/upload'))

// --- Health Check ---
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'BBN India API is running', timestamp: new Date().toISOString() })
})

// --- 404 Handler ---
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' })
})

// --- Error Handler ---
const errorHandler = require('./src/middleware/errorHandler');
app.use(errorHandler);

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`🔴 BBN India API running on http://localhost:${PORT}`)
})
