// server.js — Big Breaking News India Backend Entry Point
// To be fully implemented during Phase 1

require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const path = require('path')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')

const app = express()
const PORT = process.env.PORT || 5000

// Rate limiting policies
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 100 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // Limit each IP to 15 login/register attempts per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many attempts. Please try again after 15 minutes.' }
});

// --- Middleware ---
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "*"],
      connectSrc: ["'self'", process.env.FRONTEND_URL || 'http://localhost:5173']
    }
  },
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }))
app.use(express.json({ limit: '2mb' })) // Reduced from 10mb to prevent DoS
app.use(express.urlencoded({ extended: true, limit: '2mb' }))

// Apply rate limiting policies
app.use('/api/', globalLimiter)
app.use('/api/auth/login', authLimiter)
app.use('/api/auth/register', authLimiter)

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'))

// --- Static file serving (uploaded images) ---
app.use('/uploads', express.static(path.join(__dirname, 'src/uploads')))

// --- API Routes ---
app.use('/api/auth', require('./src/routes/auth'))
app.use('/api/articles', require('./src/routes/articles'))
app.use('/api/categories', require('./src/routes/categories'))
app.use('/api/authors', require('./src/routes/authors'))
app.use('/api/search', require('./src/routes/search'))
app.use('/api/upload', require('./src/routes/upload'))
app.use('/api/sliders', require('./src/routes/sliders'))
app.use('/api/settings', require('./src/routes/settings'))
app.use('/api/users', require('./src/routes/users'))

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
const { sequelize } = require('./src/models');

app.listen(PORT, () => {
  console.log(`🔴 BBN India API running on http://localhost:${PORT}`);

  // Perform database synchronization asynchronously in the background
  console.log('🔄 Initiating database sync...');
  sequelize.sync({ alter: true })
    .then(() => {
      console.log('✅ Database sync completed successfully (alter: true).');
    })
    .catch(err => {
      console.error('❌ Failed to sync db:');
      console.error('Error message:', err.message || err);
      if (err.original) {
        console.error('Original database error:', err.original);
      }
      if (err.sql) {
        console.error('Executed SQL query:', err.sql);
      }
    });
});

