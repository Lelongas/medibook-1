const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const timeSlotSchema = new mongoose.Schema({
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  status: { type: String, default: 'available' } // optional: 'available', 'booked', etc.
});

const professionalSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4 },
  name: { type: String, required: true },
  photoUrl: { type: String },
  shortDescription: { type: String },
  detailedDescription: { type: String },
  serviceId: { type: String, required: true }, // links to your Services schema by custom id
  paypalAccountId: { type: String }, // e.g., AVUAapKIkJ5GKqV...
  availableTimeSlots: [timeSlotSchema]
});

module.exports = mongoose.model('Professional', professionalSchema);
