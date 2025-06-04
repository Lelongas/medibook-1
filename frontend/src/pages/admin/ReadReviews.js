import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminNavbar from '../../components/AdminNavbar';

const ReadReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/bookings/all-reviews');
        setReviews(res.data);
      } catch (err) {
        console.error('Error fetching reviews:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  return (
    <>
      <AdminNavbar />
      <div style={{ background: '#f3f4f6', minHeight: '100vh', padding: '2rem' }}>
        <h1 style={{ fontSize: '2rem', color: '#1f2937', marginBottom: '1.5rem' }}>
          📋 User & GP Reviews
        </h1>

        {loading ? (
          <p>Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p>No reviews available.</p>
        ) : (
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            background: '#fff',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            overflow: 'hidden'
          }}>
            <thead style={{ background: '#e5e7eb' }}>
              <tr>
                <th style={styles.th}>Review Type</th>
                <th style={styles.th}>Reviewer Email</th>
                <th style={styles.th}>Reviewee Email</th>
                <th style={styles.th}>Rating</th>
                <th style={styles.th}>Comment</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={styles.td}>{review.type}</td>
                  <td style={styles.td}>{review.reviewer}</td>
                  <td style={styles.td}>{review.reviewee}</td>
                  <td style={styles.td}>{review.rating}</td>
                  <td style={styles.td}>{review.comment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

const styles = {
  th: {
    padding: '12px 16px',
    textAlign: 'left',
    fontWeight: 'bold',
    color: '#1f2937',
    borderBottom: '2px solid #d1d5db'
  },
  td: {
    padding: '12px 16px',
    color: '#374151',
    verticalAlign: 'top'
  }
};

export default ReadReviews;
