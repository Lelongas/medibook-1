import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function MyBookings() {
  const [isMember, setIsMember] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const email = localStorage.getItem('email');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchMembershipStatus();
    fetchBookings();
  }, [email]);

  const fetchMembershipStatus = async () => {
    const email = localStorage.getItem("email");
    if (!email) {
      alert("Email not found in localStorage.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/bookings/member", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const dataa = await response.json();
      const data = dataa[0];

      if (data && data.member === 0) {
        setIsMember(false);
      } else if (data && data.member === 1) {
        setIsMember(true);
      } else {
        console.error("Unexpected response:", data);
        setIsMember(false);
      }
    } catch (err) {
      console.error("Error fetching membership status:", err);
      setIsMember(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/bookings/availablee/${email}`);
      setBookings(res.data);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (isoString) => {
    return new Date(isoString).toLocaleString();
  };

  const handleReschedule = (slotId) => {
    navigate(`/reschedule/${slotId}`);
  };

  const handleCancel = async (slotId) => {
    try {
      await axios.post(
        'http://localhost:5000/api/bookings/gpcancel',
        { slotId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Cancelled!');
      fetchBookings();
    } catch (err) {
      alert('Cancel failed: ' + err);
    }
  };

  return (
    <div style={{ padding: '2rem', background: '#f9fafb', minHeight: '100vh' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>📅 My Bookings</h2>

      {loading ? (
        <p>Loading...</p>
      ) : bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        bookings.map((slot) => (
          <div
            key={slot.slotId}
            style={{
              background: '#fff',
              marginBottom: '1rem',
              padding: '1rem',
              borderRadius: '0.75rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            }}
          >
            <p><strong>GP:</strong> {slot.gpEmail.split('@')[0]}</p>
            <p><strong>Start:</strong> {formatDateTime(slot.startTime)}</p>
            <p><strong>End:</strong> {formatDateTime(slot.endTime)}</p>
            <p><strong>Status:</strong> {slot.status}</p>

            {slot.status === 'booked' && (
              <div style={{ marginTop: '0.5rem' }}>
                {isMember && (
                  <button
                    onClick={() => handleReschedule(slot.slotId)}
                    style={{
                      marginRight: '0.5rem',
                      padding: '0.5rem 1rem',
                      background: '#4f46e5',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                    }}
                  >
                    Reschedule
                  </button>
                )}

                <button
                  onClick={() => handleCancel(slot.slotId)}
                  style={{
                    padding: '0.5rem 1rem',
                    background: '#dc2626',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
