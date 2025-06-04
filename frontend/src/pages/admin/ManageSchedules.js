import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Navbar from '../../components/AdminNavbar';

const ManageSchedules = () => {
  const [gpId, setGpId] = useState('');
  const [gpEmail, setGpEmail] = useState('');
  const [gpList, setGpList] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const token = localStorage.getItem('token');

  // Fetch GPs
  useEffect(() => {
    const fetchGps = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/admin/gps', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("GP List Response:", res.data); // ✅ Debugging log
        setGpList(res.data);
      } catch (err) {
        console.error('Failed to fetch GP list:', err);
      }
    };

    fetchGps();
  }, []);

  const handleSubmit = async () => {
    if (!gpId || !gpEmail || !startDate || !endDate) {
      alert('Please select a GP and both start and end time.');
      return;
    }

    if (endDate <= startDate) {
      alert('End time must be after start time.');
      return;
    }

    const requestData = {
      gpId,
      gpEmail,
      startTime: startDate,
      endTime: endDate,
      status: 'reserved',
      createdBy: 'admin',
    };

    console.log('Submitting schedule with:', requestData); // ✅ Debugging log

    try {
      setSubmitting(true);
      await axios.post('http://localhost:5000/api/admin/block', requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert('Reserved period set successfully.');
      setGpId('');
      setGpEmail('');
      setStartDate(null);
      setEndDate(null);
    } catch (err) {
      console.error(err);
      alert('Failed to set schedule.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        background: '#f3f4f6',
        minHeight: '100vh',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        padding: '2rem',
      }}
    >
      <Navbar />
      <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#1f2937' }}>
        Manage Reserved Schedules
      </h1>

      <div
        style={{
          background: '#fff',
          padding: '2rem',
          borderRadius: '1rem',
          maxWidth: '600px',
          margin: 'auto',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        }}
      >
        {/* GP Selection */}
        <label style={{ marginBottom: '0.5rem', display: 'block', color: '#333' }}>
          Select GP:
        </label>
        <select
          onChange={(e) => {
            const selectedGp = gpList.find(gp => gp._id === e.target.value);
            if (selectedGp) {
              setGpId(selectedGp._id);
              setGpEmail(selectedGp.email);
            }
          }}
          value={gpId}
          required
          style={{
            padding: '0.5rem',
            marginBottom: '1rem',
            width: '100%',
            borderRadius: '6px',
            border: '1px solid #ccc',
          }}
        >
          <option value="">-- Select GP --</option>
          {gpList.map((gp) => (
            <option key={gp._id} value={gp._id}>
              {gp.name}
            </option>
          ))}
        </select>

        {/* Start Time */}
        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333' }}>
          Start Time
        </label>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          dateFormat="MMMM d, yyyy h:mm aa"
          placeholderText="Select start time"
        />

        {/* End Time */}
        <label style={{ display: 'block', margin: '1rem 0 0.5rem', color: '#333' }}>
          End Time
        </label>
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          dateFormat="MMMM d, yyyy h:mm aa"
          placeholderText="Select end time"
        />

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={submitting}
          style={{
            marginTop: '2rem',
            backgroundColor: '#4f46e5',
            color: '#fff',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            width: '100%',
            fontWeight: 600,
            fontSize: '1rem',
          }}
        >
          {submitting ? 'Submitting...' : 'Set Reserved Period'}
        </button>
      </div>
    </div>
  );
};

export default ManageSchedules;
