const express = require('express');
const router = express.Router();
const TimeSlot = require('../models/TimeSlot');
const auth = require('../middleware/authMiddleware');
const Home = require('../models/Home')
const Service =require('../models/Services');
const Professional = require('../models/Professional');
const User = require('../models/User');
const PDFDocument = require('pdfkit');
const Review = require('../models/Review');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const Notification = require('../models/Notification');

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
const PAYPAL_API = 'https://api-m.sandbox.paypal.com'; // Use live URL for production

// GET /api/bookings/available — available slots = future slots not booked
router.get('/available', async (req, res) => {
    try {
      const slots = await TimeSlot.find({ status: 'available' });
      res.json(slots);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  router.post('/add-slots', async (req, res) => {
    try {
      const { email, slots } = req.body;
  
      if (!email || !slots || !Array.isArray(slots) || slots.length === 0) {
        return res.status(400).json({ message: 'Invalid input' });
      }
  
      const gpId = req.user?.id || email;
  
      const timeSlotsToInsert = slots.map(slot => ({
        slotId: uuidv4(),
        startTime: new Date(slot.startTime),
        endTime: new Date(slot.endTime),
        gpId: email,
        gpEmail: email,
        status: 'available',
      }));
  
      await TimeSlot.insertMany(timeSlotsToInsert);
      return res.status(201).json({ message: 'Time slots added successfully' });
    } catch (error) {
      console.error('Error adding time slots:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  router.get('/available/:professionalId', async (req, res) => {
    try {
      const slots = await TimeSlot.find({ status: 'available' ,gpId: req.params.professionalId });
      res.json(slots);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  router.get('/available/:professionalId', async (req, res) => {
    try {
      const slots = await TimeSlot.find({ status: 'available' ,gpId: req.params.professionalId });
      res.json(slots);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  router.get('/available/:gpEmail', async (req, res) => {
    try {
      const slots = await TimeSlot.find({gpEmail: req.params.gpEmail });
      console.log(req.params.gpEmail)
      res.json(slots);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });

 router.get('/availablee/:email', async (req, res) => {
    try {
      const slots = await TimeSlot.find({bookedByEmail: req.params.email });
      console.log(req.params.email)
      res.json(slots);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  router.get('/home', async (req, res) => {
    try {
      const slots = await Home.findOne().select('description');
      res.json(slots);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  router.get('/service', async (req, res) => {
    try {
      const services = await Service.find();
      res.json(services);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  router.get('/service/:serviceId', async (req, res) => {
    try {
      const services = await Service.findOne({id: req.params.serviceId});
      res.json(services);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  router.get('/service/:serviceId/professionals', async (req, res) => {
    try {
      const services = await Professional.find({serviceId: req.params.serviceId});
      res.json(services);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });

router.get('/reminders/:email', async (req, res) => {
  const { email } = req.params;

  try {
    const now = new Date();
    const next24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const slots = await TimeSlot.find({
      $or: [{ bookedByEmail: email }, { gpEmail: email }],
      status: 'booked',
      startTime: { $gte: now, $lte: next24h },
    });

    res.json(slots);
  } catch (err) {
    res.status(500).json({ message: 'Reminder fetch failed', err });
  }
});


  router.get('/professionals/:professionalId', async (req, res) => {
    try {
      const services = await Professional.find({id: req.params.professionalId});
      res.json(services);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  router.get('/pending', async (req, res) => {
    try {
      const slots = await TimeSlot.find({ status: 'pending' });
      res.json(slots);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  router.get('/pdf/:email', async (req, res) => {
  const { email } = req.params;

  try {
    const slots = await TimeSlot.find({ gpEmail: email, status: 'booked' });

    const totalRevenue = slots.length * 50; // Assuming $50 per booking (or replace with actual value)
    const doc = new PDFDocument();
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=RevenueReport.pdf');

    doc.pipe(res);
    doc.fontSize(20).text('Revenue Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`GP Email: ${email}`);
    doc.text(`Total Bookings: ${slots.length}`);
    doc.text(`Total Revenue: $${totalRevenue}`);
    doc.end();
  } catch (err) {
    console.error('Error generating PDF:', err);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
});

  router.get('/gpending/:gpId', async (req, res) => {
    try {
      const slots = await TimeSlot.find({ status: 'pending', gpId: req.params.gpId });
      res.json(slots);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  

// GET /api/bookings/my-bookings
// router.get('/my-bookings', async (req, res) => {
//   try {
//     const bookings = await Booking.find({ user: req.user._id });
//     res.json(bookings);
//   } catch (err) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

router.get('/my-bookings', async (req, res) => {
   
    const { email } = req.query;
    console.log('my_booking_email',email);
    try {
      const myBookings = await TimeSlot.find({ bookedByEmail: email });
      res.json(myBookings);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching bookings' });
    }
  });
  router.post('/gp-bookings', async (req, res) => {
   
    const { email } = req.body;
    console.log('my_booking_email',email);
    try {
      const myBookings = await TimeSlot.find({ gpEmail: email });
      res.json(myBookings);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching bookings' });
    }
  });

  router.post('/member', async (req, res) => {
    const { email } = req.body;
    try {
      const slots = await User.find({ email: email });
      res.json(slots);
    } catch (err) {
      res.status(500).json({ message: 'Server error' ,err});
    }
  });



  router.post('/setmember', async (req, res) => {
    const { email } = req.body;
  
    try {
      const updatedUser = await User.findOneAndUpdate(
        { email: email },              // Match user by email
        { $set: { member: 1 } },       // Update `member` field to 1
        { new: true }                  // Return the updated document
      );
  
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json(updatedUser);
    } catch (err) {
      res.status(500).json({ message: 'Server error', err });
    }
  });
  



// GET revenue report for GP
router.post('/gp-revenue', async (req, res) => {
  const { email, startDate, endDate } = req.body;

  if (!email || !startDate || !endDate) {
    return res.status(400).json({ message: 'Missing parameters' });
  }

  try {
    const bookings = await TimeSlot.find({
      gpEmail: email,
      status: 'booked',
      startTime: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      }
    });

    const feePerBooking = 50;
    const totalRevenue = bookings.length * feePerBooking;

    res.json({
      count: bookings.length,
      revenue: totalRevenue,
      bookings
    });
  } catch (err) {
    res.status(500).json({ message: 'Error calculating revenue', err });
  }
});

router.post('/reviews', async (req, res) => {
  console.log('Incoming review payload:', req.body);  // <--- Add this

  const { slotId, gpEmail, userEmail, reviewerRole, rating, comment } = req.body;

  if (!slotId || !gpEmail || !userEmail || rating === undefined || !comment || !reviewerRole) {
    return res.status(400).json({ message: 'Missing required fields', received: req.body });
  }

  try {
    await Review.create({ slotId, gpEmail, userEmail, reviewerRole, rating, comment });
    res.status(201).json({ message: 'Review saved' });
  } catch (err) {
    console.error('Review save error:', err);
    res.status(500).json({ message: 'Server error', err });
  }
});
router.post('/add-slot', async (req, res) => {
  const { gpEmail, startTime, endTime, status } = req.body;

  if (!gpEmail || !startTime || !endTime) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newSlot = new TimeSlot({
      slotId: `gp-${Date.now()}`,
      gpEmail,
      startTime,
      endTime,
      status: status || 'available',
      createdBy: gpEmail,
    });

    await newSlot.save();
    res.status(201).json({ message: 'Slot created', slot: newSlot });
  } catch (err) {
    console.error('Error creating slot:', err);
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// 📌 Read all reviews (for admin panel)
router.get('/all-reviews', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews.map(r => ({
      type: r.reviewerRole === 'user' ? 'User → GP' : 'GP → User',
      reviewer: r.reviewerRole === 'user' ? r.userEmail : r.gpEmail,
      reviewee: r.reviewerRole === 'user' ? r.gpEmail : r.userEmail,
      rating: r.rating,
      comment: r.comment
    })));
  } catch (err) {
    res.status(500).json({ message: 'Error fetching reviews', err });
  }
});



// POST /api/bookings/book
router.post('/book', async (req, res) => {
  const { slotId, email, paypalOrderId } = req.body; // include paypalOrderId

  try {
    const slot = await TimeSlot.findOne({ slotId });
    if (!slot) return res.status(404).json({ message: 'Slot not found' });
    if (slot.status !== 'available') return res.status(400).json({ message: 'Slot already booked' });

    // Capture the payment
    let captureId = null;
    if (paypalOrderId) {
      captureId = await capturePayPalOrder(paypalOrderId);
    }

    slot.status = 'pending';
    slot.bookedByEmail = email;
    slot.captureId = captureId; // 🔐 store for refund
    await slot.save();

    res.json({ message: 'Slot booked and payment captured', captureId, slot });
  } catch (err) {
    console.error('Booking error:', err);
    res.status(500).json({ message: 'Server error', err });
  }
});


router.post('/gpbook', async (req, res) => {
    const { slotId } = req.body;
    console.log(slotId)
    try {
      const slot = await TimeSlot.findOne({slotId});
      console.log(res.body)
      if (!slot) return res.status(404).json({ message: 'Slot not found' });
      if (slot.status !== 'pending') return res.status(400).json({ message: 'Slot already booked' });
  
      slot.status = 'booked';
      // Ensure auth middleware sets req.user
    
      await slot.save();
  
      res.json({ message: 'Slot confirmed successfully', slot });
    } catch (err) {
      res.status(500).json({ message: 'Server error',err });
    }
  });

router.get('/notifications/count/:email', async (req, res) => {
  try {
    const count = await Notification.countDocuments({ email: req.params.email, read: false });
    res.json({ count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
router.post('/notifications/mark-read/:email', async (req, res) => {
  try {
    await Notification.updateMany({ email: req.params.email, read: false }, { read: true });
    res.json({ message: 'Marked as read' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

  router.get('/notifications/:email', async (req, res) => {
    try {
      const notifications = await Notification.find({ email: req.params.email, read: false }).sort({ createdAt: -1 });
      res.json(notifications);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });

router.post('/gpcancel', async (req, res) => {
  const { slotId } = req.body;

  if (!slotId) return res.status(400).json({ message: 'slotId is required' });

  try {
    const slot = await TimeSlot.findOne({ slotId });

    if (!slot) return res.status(404).json({ message: 'Slot not found' });

    if (slot.captureId) {
      try {
        await refundPayment(slot.captureId);
      } catch (refundErr) {
        console.error('PayPal refund failed:', refundErr.response?.data || refundErr);
        return res.status(500).json({ message: 'Refund failed', error: refundErr });
      }
    }

    slot.status = 'available';
    slot.bookedByEmail = null;
    slot.captureId = null; // Clear it after refund
    await slot.save();

    res.json({ message: 'Cancelled and refunded', slot });
  } catch (err) {
    console.error('Slot cancel error:', err);
    res.status(500).json({ message: 'Server error', err });
  }
});


async function getPayPalAccessToken() {
  const response = await axios({
    url: `${PAYPAL_API}/v1/oauth2/token`,
    method: 'post',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    auth: { username: PAYPAL_CLIENT_ID, password: PAYPAL_SECRET },
    data: 'grant_type=client_credentials',
  });

  return response.data.access_token;
}

async function capturePayPalOrder(orderId) {
  const accessToken = await getPayPalAccessToken();

  const res = await axios.post(
    `${PAYPAL_API}/v2/checkout/orders/${orderId}/capture`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  );

  const captureId = res.data?.purchase_units?.[0]?.payments?.captures?.[0]?.id;
  return captureId;
}

router.patch('/paypal', async (req, res) => {
  const { gpEmail, paypalAccountId } = req.body;

  if (!gpEmail || !paypalAccountId) {
    return res.status(400).json({ message: 'gpEmail and paypalAccountId are required.' });
  }

  try {
    const updated = await Professional.findOneAndUpdate(
      { gpEmail },
      { $set: { paypalAccountId } },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'GP not found.' });
    }

    res.json({ message: 'PayPal ID updated', professional: updated });
  } catch (err) {
    console.error('Error updating PayPal ID:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/store-capture', async (req, res) => {
  const { slotId, captureId } = req.body;

  if (!slotId || !captureId) {
    return res.status(400).json({ message: 'Missing slotId or captureId' });
  }

  try {
    const slot = await TimeSlot.findOneAndUpdate(
      { slotId },
      { $set: { captureId } },
      { new: true }
    );

    if (!slot) return res.status(404).json({ message: 'Slot not found' });

    res.json({ message: 'Capture ID stored successfully', slot });
  } catch (err) {
    res.status(500).json({ message: 'Failed to store capture ID', err });
  }
});

module.exports = router;
