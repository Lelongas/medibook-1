import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import axios from 'axios';
import 'react-datepicker/dist/react-datepicker.css';

const GPAddSlot = ({ onSlotAdded }) => {
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');
  const gpEmail = localStorage.getItem('email');

  const handleAdd = async () => {
    if (!start || !end || end <= start) {
      alert('Please pick valid times.');
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        'http://localhost:5000/api/bookings/add-slot',
        {
          gpEmail,
          startTime: start,
          endTime: end,
          status: 'available',
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('Slot added!');
      setStart(null);
      setEnd(null);

      // 👉 Call parent refresh if available
      if (onSlotAdded) onSlotAdded();
    } catch (err) {
      alert('Failed to add slot.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: '1rem',
        background: '#fff',
        borderRadius: '8px',
        maxWidth: 500,
        margin: '1rem auto',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      }}
    >
      <h3>Add New Slot</h3>

      <label>Start Time</label>
      <DatePicker
        selected={start}
        onChange={(date) => setStart(date)}
        showTimeSelect
        dateFormat="Pp"
        placeholderText="Start time"
        className="input"
      />

      <label style={{ marginTop: '1rem' }}>End Time</label>
      <DatePicker
        selected={end}
        onChange={(date) => setEnd(date)}
        showTimeSelect
        dateFormat="Pp"
        placeholderText="End time"
        className="input"
      />

      <button
        onClick={handleAdd}
        disabled={loading}
        style={{
          marginTop: '1rem',
          backgroundColor: '#4f46e5',
          color: '#fff',
          padding: '0.5rem 1.5rem',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: '600',
        }}
      >
        {loading ? 'Adding...' : 'Add Slot'}
      </button>
    </div>
  );
};

export default GPAddSlot;
