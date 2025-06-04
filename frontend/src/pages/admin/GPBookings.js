import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar';

const GPBookings = () => {
  const [gplist, setGplist] = useState([]);
  const [selectedGP, setSelectedGP] = useState('');
  const [bookings, setBookings] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchGPs();
  }, []);

  const fetchGPs = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const gps = res.data.filter((user) => user.role === 'gp');
      setGplist(gps);
    } catch (err) {
      alert('Failed to load GPs');
    }
  };

  const fetchBookings = async (email) => {
    try {
      const res = await axios.post(
        'http://localhost:5000/api/bookings/gp-bookings',
        { email },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setBookings(res.data);
    } catch (err) {
      alert('Failed to fetch bookings');
    }
  };

  const handleGPSelect = (e) => {
    const email = e.target.value;
    setSelectedGP(email);
    fetchBookings(email);
  };

  return (
    <div style={{ padding: '2rem', background: '#f3f4f6', minHeight: '100vh' }}>
      <Navbar />
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>GP Bookings Overview</h1>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ marginRight: '1rem', fontWeight: 'bold' }}>Select GP:</label>
        <select value={selectedGP} onChange={handleGPSelect} style={{ padding: '0.5rem' }}>
          <option value="">-- Select --</option>
          {gplist.map((gp) => (
            <option key={gp.email} value={gp.email}>
              {gp.name} ({gp.email})
            </option>
          ))}
        </select>
      </div>

      {bookings.length === 0 ? (
        <p>No bookings found for this GP.</p>
      ) : (
        <table style={{ width: '100%', background: '#fff', borderRadius: '8px', padding: '1rem' }}>
          <thead>
            <tr>
              <th style={th}>Slot ID</th>
              <th style={th}>Booked By</th>
              <th style={th}>Time</th>
              <th style={th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.slotId}>
                <td style={td}>{b.slotId}</td>
                <td style={td}>{b.bookedByEmail || '-'}</td>
                <td style={td}>
                  {new Date(b.startTime).toLocaleString()} →{' '}
                  {new Date(b.endTime).toLocaleTimeString()}
                </td>
                <td style={td}>{b.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const th = {
  padding: '10px',
  textAlign: 'left',
  borderBottom: '1px solid #ddd',
};

const td = {
  padding: '10px',
  borderBottom: '1px solid #eee',
};

export default GPBookings;
