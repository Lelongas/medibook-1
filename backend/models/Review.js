const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  slotId: { type: String, required: true },
  gpEmail: { type: String, required: true },
  userEmail: { type: String, required: true },
  reviewerRole: { type: String, enum: ['gp', 'user'], required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', reviewSchema);
