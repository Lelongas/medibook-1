const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  email: String,           // Recipient user email
  message: String,         // Notification message
  read: { type: Boolean, default: false }, // Optional
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);
