const express = require('express');
const router = express.Router();
const TimeSlot = require('../models/TimeSlot');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');


// Middleware to restrict access to admins only
const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied: Admins only' });
  }
  next();
};
// routes/admin.js
router.get('/gps', authMiddleware, adminOnly, async (req, res) => {
  try {
    const gps = await User.find({ role: 'gp' }, 'name email _id');
    res.json(gps);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch GPs' });
  }
});

router.post('/notify-gp', authMiddleware, adminOnly, async (req, res) => {
  const { gpEmail, message } = req.body;

  try {
    const notif = new Notification({
      recipientEmail: gpEmail,
      message,
      date: new Date(),
    });

    await notif.save();
    res.status(201).json({ message: 'Notification sent' });
  } catch (err) {
    console.error('Error sending notification:', err);
    res.status(500).json({ message: 'Failed to send notification' });
  }
});
// 
// lock a time slot (reserved)
router.post('/block', authMiddleware, adminOnly, async (req, res) => {
  const { gpId, gpEmail, startTime, endTime, status, createdBy } = req.body;

  if (!gpId || !gpEmail || !startTime || !endTime) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const newSlot = new TimeSlot({
      slotId: `admin-${Date.now()}`,
      gpId,
      gpEmail,
      startTime,
      endTime,
      status: status || 'reserved',
      createdBy: createdBy || req.user.email || 'admin',
    });

    await newSlot.save();
    res.status(201).json({ message: 'Reserved slot created', slot: newSlot });
  } catch (err) {
    console.error('Error creating slot:', err);
    res.status(500).json({ message: 'Server error', err });
  }
});


router.post('/schedules', async (req, res) => {
  const { gpEmail, startTime, endTime } = req.body;

  if (!gpEmail || !startTime || !endTime) {
    return res.status(400).send("Missing required fields");
  }

  try {
    // Example using a database model
    await Schedule.create({
      gpEmail,
      startTime,
      endTime,
    });
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to save schedule");
  }
});
// View reserved slots
router.get('/reserved', authMiddleware, adminOnly, async (req, res) => {
  try {
    const slots = await TimeSlot.find({ status: 'reserved' });
    res.json(slots);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch reserved slots', err });
  }
});

// Delete a reserved slot
router.delete('/reserved/:slotId', authMiddleware, adminOnly, async (req, res) => {
  try {
    const result = await TimeSlot.findOneAndDelete({ slotId: req.params.slotId });
    if (!result) {
      return res.status(404).json({ message: 'Slot not found' });
    }
    res.json({ message: 'Slot deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting slot', err });
  }
});

// List all users
router.get('/users', authMiddleware, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('name email role member');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', err });
  }
});

// Update user permissions
router.patch('/users/:email/permissions', authMiddleware, adminOnly, async (req, res) => {
  const { role, member } = req.body;

  try {
    const updated = await User.findOneAndUpdate(
      { email: req.params.email },
      { $set: { role, member } },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User updated', user: updated });
  } catch (err) {
    res.status(500).json({ message: 'Error updating user', err });
  }
});

// Get all pending GPs with full details
router.get('/pending-gps', async (req, res) => {
  try {
    const pendingGPs = await User.find({ role: 'gp', approved: false, declined: { $ne: true } });
    res.json(pendingGPs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching pending GPs', err });
  }
});

// Approve GP
router.patch('/approve-gp/:id', async (req, res) => {
  try {
    console.log('Approving GP ID:', req.params.id); // ✅ Add this

    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { approved: true, declined: false },
      { new: true }
    );

    console.log('Updated user:', updated); // ✅ Confirm update success

    if (!updated) return res.status(404).json({ message: 'GP not found' });

    res.json({ message: 'GP approved', user: updated });
  } catch (err) {
    console.error('Error in approve-gp:', err); // ❌ If something fails
    res.status(500).json({ message: 'Error approving GP', err });
  }
});


// Decline GP
router.patch('/decline-gp/:id', async (req, res) => {
  try {
    const declined = await User.findByIdAndUpdate(
      req.params.id,
      { declined: true, approved: false },
      { new: true }
    );
    if (!declined) return res.status(404).json({ message: 'GP not found' });
    res.json({ message: 'GP declined', user: declined });
  } catch (err) {
    res.status(500).json({ message: 'Error declining GP', err });
  }
});


module.exports = router;
