import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from './UserContext';
import PayPalBooking from '../components/PayPalBookingl';
export default function ProfessionalDetails() {
  
  const navigate = useNavigate();
  const { professionalId } = useParams();
  const [professional, setProfessional] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { userData, setUserData } = useUser();

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    if (!userData) {
      fetchUserProfile();
    }

    fetchData();
  }, [professionalId]);

  const fetchUserProfile = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/user/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserData(res.data);
    } catch (err) {
      console.error('User profile fetch failed', err);
      navigate('/login');
    }
  };

  const fetchData = async () => {
    try {
      const profRes = await axios.get(`http://localhost:5000/api/bookings/professionals/${professionalId}`);
      setProfessional(profRes.data[0]);

      const timeSlotRes = await axios.get(`http://localhost:5000/api/bookings/available/${professionalId}`);
      setTimeSlots(timeSlotRes.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch professional details or time slots.');
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (slotId, email) => {
    try {
      await axios.post('http://localhost:5000/api/bookings/book', { slotId, email });
      alert('Booked!');
      fetchData(); // Refresh slots
    } catch (err) {
      alert('Slot already booked or failed.\n' + err.message);
    }
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>;
  if (error) return <div style={{ padding: '2rem' }}>{error}</div>;
  if (!professional) return <div style={{ padding: '2rem' }}>No professional found.</div>;

  return (
    <div style={{ background: '#f3f4f6', minHeight: '100vh', padding: '2rem' }}>
      <div
        style={{
          background: '#ffffff',
          padding: '2rem',
          borderRadius: '1rem',
          boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
          maxWidth: '800px',
          margin: '0 auto',
        }}
      >
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginBottom: '1.5rem' }}>
          <img
            src={professional.photoUrl}
            alt={professional.name}
            style={{
              borderRadius: '10%',
              width: '120px',
              height: '120px',
              objectFit: 'cover',
              border: '3px solid #4f46e5',
            }}
          />
          <div>
            <h2 style={{ fontSize: '1.8rem', margin: 0 }}>{professional.name}</h2>
            <p style={{ fontStyle: 'italic', color: '#6b7280', marginTop: '0.3rem' }}>
              {professional.shortDescription}
            </p>
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: '1.25rem', color: '#4f46e5' }}>About</h3>
          <p style={{ color: '#374151' }}>{professional.detailedDescription}</p>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', color: '#4f46e5', marginBottom: '1rem' }}>Available Time Slots</h3>
          {timeSlots && timeSlots.length > 0 ? (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {userData &&
  timeSlots.map((slot) => (
    <div
      key={slot.slotId}
      style={{
        background: '#f9fafb',
        padding: '1rem',
        borderRadius: '0.75rem',
        boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}
    >
      <div>
        <strong style={{ color: '#111827' }}>
          {new Date(slot.startTime).toLocaleString()} –{' '}
          {new Date(slot.endTime).toLocaleString()}
        </strong>
        <span style={{ color: 'green', marginLeft: '0.75rem' }}>({slot.status})</span>
      </div>

      <div style={{ marginTop: '1rem' }}>
      <PayPalBooking
      amount="10.00" // or dynamically set price if needed
      onPaymentSuccess={() => handleBook(slot.slotId, userData.email)}
    />
      </div>
    </div>
  ))}
            </div>
          ) : (
            <p>No available slots.</p>
          )}
        </div>

      </div>
    </div>
  );
}
