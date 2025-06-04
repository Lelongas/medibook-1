const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const bookingRoutes = require('./routes/bookings');
const authRoutes = require('./routes/auth');  // ✅ Add this import
const authMiddleware = require('./middleware/authMiddleware')
const adminRoutes = require('./routes/admin');


const app = express();
app.use(cors());
app.use(express.json());


mongoose.connect('mongodb://localhost:27017/gpbooking');

app.use('/api/bookings', bookingRoutes);
app.use('/api/auth', authRoutes);  // ✅ Add this line to use auth routes
app.use('/api/admin', adminRoutes);

  app.get('/api/user/profile', authMiddleware, (req, res) => {
    res.json({ email: req.user.email, role: req.user.role, name: req.user.name });
  });
  // Export io to use in routes

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
