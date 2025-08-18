const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Modelleri içe aktar
const { initializeDatabase } = require('./models');

// Route'ları içe aktar
const contactRoutes = require('./routes/contactRoutes');
const customerRoutes = require('./routes/customerRoutes');
const leadRoutes = require('./routes/leadRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const opportunityRoutes = require('./routes/opportunityRoutes');
const taskRoutes = require('./routes/taskRoutes');
const priceListRoutes = require('./routes/priceList');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`🌐 ${req.method} ${req.originalUrl} - ${new Date().toISOString()}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('📦 Request Body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

// Temel route
app.get('/', (req, res) => {
  res.json({
    message: 'MyBasicCRM Backend API',
    status: 'Server çalışıyor',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// API Routes
app.use('/api/contacts', contactRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/price-lists', priceListRoutes);
app.use('/api/auth', authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Sunucu hatası',
      status: err.status || 500
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: {
      message: 'Kaynak bulunamadı',
      status: 404
    }
  });
});

// Veritabanı bağlantısı ve sunucuyu başlat
initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Database initialization error:', err);
    process.exit(1);
  });

module.exports = app;