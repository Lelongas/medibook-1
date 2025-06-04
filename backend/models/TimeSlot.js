const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema({
  slotId: { type: String, unique: true },
  startTime: Date,
  endTime: Date,
  gpId: { type: String, required: true },       // ✅ fixed spelling: 'require' → 'required'
  gpEmail: { type: String, required: true },    // ✅ fixed spelling
  bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  bookedByEmail: { type: String, default: null },
  status: {
    type: String,
    enum: ['available', 'booked', 'pending', 'reserved'], // ✅ added 'reserved'
    default: 'available',
    required: true
  }
});

module.exports = mongoose.model('TimeSlot', timeSlotSchema);
