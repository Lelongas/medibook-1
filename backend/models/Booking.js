const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  gpId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  timeSlotId: { type: mongoose.Schema.Types.ObjectId, ref: 'TimeSlot' },
  timeSlot: Date,
  status: { type: String, enum: ['available','pending', 'confirmed', 'cancelled'], default: 'available' }
});

module.exports = mongoose.model('Booking', bookingSchema);
