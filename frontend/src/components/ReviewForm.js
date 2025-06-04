import React, { useState } from 'react';
import axios from 'axios';

const ReviewForm = ({ slotId, type, onReviewSubmitted }) => {
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !comment) return alert('Please fill all fields');

    try {
      setLoading(true);
      const endpoint =
        type === 'user' ? '/api/bookings/reviews/user' : '/api/bookings/reviews/gp';

      await axios.post(
        `http://localhost:5000${endpoint}`,
        { slotId, rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('Review submitted!');
      setRating('');
      setComment('');
      if (onReviewSubmitted) onReviewSubmitted();
    } catch (err) {
      alert('Failed to submit review.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
      <h4>Leave a Review</h4>
      <div>
        <label>Rating (1–5): </label>
        <input
          type="number"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          min="1"
          max="5"
          required
        />
      </div>
      <div>
        <label>Comment: </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
          rows={3}
        />
      </div>
      <button type="submit" disabled={loading} style={{ marginTop: '0.5rem' }}>
        {loading ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
};

export default ReviewForm;
