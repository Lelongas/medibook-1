import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const ReviewPage = () => {
  const [email, setEmail] = useState(localStorage.getItem('email') || '');
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');
  const [selectedSlotId, setSelectedSlotId] = useState('');
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  // Fetch user's booked slots
  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/bookings/my-bookings?email=${email}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSlots(res.data);
      } catch (err) {
        console.error('Failed to load slots for review', err);
      }
    };
    fetchSlots();
  }, [email, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !rating || !comment || !selectedSlotId) {
      alert('Please fill in all fields and select a slot');
      return;
    }

    const selectedSlot = slots.find((s) => s.slotId === selectedSlotId);
    if (!selectedSlot) {
      alert('Invalid slot selected.');
      return;
    }

    const payload = {
      slotId: selectedSlotId,
      rating: Number(rating),
      comment: comment.trim(),
      reviewerRole: role,
      gpEmail: selectedSlot.gpEmail,
      userEmail: selectedSlot.bookedByEmail,
    };

    try {
      setLoading(true);
      await axios.post('http://localhost:5000/api/bookings/reviews', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert('Review submitted successfully!');
      setRating('');
      setComment('');
      setSelectedSlotId('');
    } catch (err) {
      console.error('Failed to submit review:', err);
      alert('Failed to submit review.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <Navbar />
      <div style={styles.container}>
        <form onSubmit={handleSubmit} style={styles.form}>
          <h2 style={styles.heading}>Submit Your Review</h2>

          <label style={styles.label}>Your Email</label>
          <input
            type="email"
            value={email}
            disabled
            style={styles.input}
          />

          <label style={styles.label}>Select a Slot to Review</label>
          <select
            value={selectedSlotId}
            onChange={(e) => setSelectedSlotId(e.target.value)}
            style={styles.input}
          >
            <option value="">-- Select a Slot --</option>
            {slots.map((slot) => {
              const counterpartEmail = role === 'gp' ? slot.bookedByEmail : slot.gpEmail;
              return (
                <option key={slot.slotId} value={slot.slotId}>
                  {new Date(slot.startTime).toLocaleString()} with {counterpartEmail}
                </option>
              );
            })}
          </select>

          <label style={styles.label}>Rating (1–5)</label>
          <input
            type="number"
            min="1"
            max="5"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            style={styles.input}
          />

          <label style={styles.label}>Comment</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            style={styles.textarea}
          />

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    background: '#f3f4f6',
    minHeight: '100vh',
    paddingBottom: '2rem',
  },
  container: {
    maxWidth: '600px',
    margin: '2rem auto',
    background: '#fff',
    padding: '2rem',
    borderRadius: '1rem',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.05)',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  heading: {
    fontSize: '1.5rem',
    color: '#1f2937',
    fontWeight: 600,
    marginBottom: '1rem',
  },
  label: {
    display: 'block',
    fontWeight: 500,
    color: '#1f2937',
    marginBottom: '0.5rem',
    marginTop: '1rem',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '1rem',
  },
  textarea: {
    width: '100%',
    padding: '0.75rem',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '1rem',
  },
  button: {
    marginTop: '1.5rem',
    backgroundColor: '#4f46e5',
    color: '#fff',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    fontSize: '1rem',
    border: 'none',
    cursor: 'pointer',
  },
};

export default ReviewPage;
