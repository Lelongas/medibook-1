import React, { useEffect, useState } from 'react';
import axios from 'axios';
import GPNavbar from '../components/GPNavbar';
import ReviewForm from '../components/ReviewForm';

function GPDashboard() {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [pendingSlots, setPendingSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [activeTab, setActiveTab] = useState('available');

  // New state for add timeslot inputs
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const token = localStorage.getItem('token');
  const name = localStorage.getItem('name');

  useEffect(() => {
    if (!token) return;
    fetchData();
  }, []);

  const fetchData = async () => {
    const user = await fetchUser();
    if (user) await fetchSlots(user.email);
  };

  const fetchUser = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/user/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userEmail = res.data.email;
      const userName = res.data.name;
      setEmail(userEmail);
      localStorage.setItem('email', userEmail);
      localStorage.setItem('name', userName);
      return res.data;
    } catch (err) {
      console.error('Failed to fetch user:', err);
      return null;
    }
  };

  const fetchSlots = async (userEmail) => {
    setLoading(true);
    try {
      const res = await axios.post(
        'http://localhost:5000/api/bookings/gp-bookings',
        { email: userEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const slots = res.data;
      setAvailableSlots(slots.filter((s) => s.status === 'available'));
      setPendingSlots(slots.filter((s) => s.status === 'pending'));
      setBookedSlots(slots.filter((s) => s.status === 'booked'));
    } catch (err) {
      console.error('Failed to fetch slots:', err);
    }
    setLoading(false);
  };

  const handleBook = async (slotId) => {
    try {
      await axios.post(
        'http://localhost:5000/api/bookings/gpbook',
        { slotId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Confirmed!');
      fetchSlots(email);
    } catch (err) {
      alert('Slot already booked or failed: ' + err);
    }
  };

  const handleCancel = async (slotId) => {
    try {
      await axios.post(
        'http://localhost:5000/api/bookings/gpcancel',
        { slotId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Cancelled!');
      fetchSlots(email);
    } catch (err) {
      alert('Cancel failed: ' + err);
    }
  };

  const handleAddSlot = async () => {
    try {
      if (new Date(startTime) >= new Date(endTime)) {
        alert('Start time must be before end time.');
        return;
      }
  
      await axios.post(
        'http://localhost:5000/api/bookings/add-slots',
        {
          email,
          slots: [  // wrap startTime and endTime inside slots array
            {
              startTime,
              endTime,
            },
          ],
        }
      );
  
      alert('Timeslot added successfully!');
      setStartTime('');
      setEndTime('');
      fetchSlots(email);
    } catch (err) {
      console.error('Add slot failed:', err);
      alert('Failed to add timeslot');
    }
  };
  

  const formatTime = (start, end) =>
    `${new Date(start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

  const styles = {
    container: {
      maxWidth: '900px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
    },
    header: {
      textAlign: 'center',
      marginBottom: '20px',
      color: '#333',
    },
    tabs: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: '10px',
      marginBottom: '20px',
    },
    tabButton: (active) => ({
      padding: '10px 20px',
      border: 'none',
      borderRadius: '5px',
      backgroundColor: active ? '#007bff' : '#eee',
      color: active ? '#fff' : '#333',
      cursor: 'pointer',
    }),
    slotList: {
      listStyle: 'none',
      padding: 0,
    },
    slotCard: {
      backgroundColor: '#f9f9f9',
      border: '1px solid #ccc',
      padding: '15px',
      borderRadius: '8px',
      marginBottom: '10px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    },
    timeText: {
      fontSize: '16px',
      fontWeight: 'bold',
      color: '#333',
    },
    actions: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '10px',
    },
    button: (type) => ({
      padding: '8px 16px',
      border: 'none',
      borderRadius: '4px',
      color: '#fff',
      backgroundColor:
        type === 'confirm' ? '#28a745' :
        type === 'cancel' ? '#dc3545' :
        '#6c757d',
      cursor: 'pointer',
    }),
  };

  const renderSlots = (slots, actions) => (
    <ul style={styles.slotList}>
      {slots.length === 0 ? (
        <p>No slots found</p>
      ) : (
        slots.map((slot) => (
          <li key={slot.slotId} style={styles.slotCard}>
            <div style={styles.timeText}>{formatTime(slot.startTime, slot.endTime)}</div>
            <div style={styles.actions}>
              {actions.includes('confirm') && (
                <button
                  style={styles.button('confirm')}
                  onClick={() => handleBook(slot.slotId)}
                >
                  Confirm
                </button>
              )}
              {actions.includes('cancel') && (
                <button
                  style={styles.button('cancel')}
                  onClick={() => handleCancel(slot.slotId)}
                >
                  Cancel
                </button>
              )}
            </div>
          </li>
        ))
      )}
    </ul>
  );

  return (
    <>
      <GPNavbar />
      <div style={styles.container}>
        <h2 style={styles.header}>Welcome, {name}</h2>

        <div style={styles.tabs}>
          <button
            style={styles.tabButton(activeTab === 'available')}
            onClick={() => setActiveTab('available')}
          >
            Available
          </button>
          <button
            style={styles.tabButton(activeTab === 'pending')}
            onClick={() => setActiveTab('pending')}
          >
            Pending
          </button>
          <button
            style={styles.tabButton(activeTab === 'booked')}
            onClick={() => setActiveTab('booked')}
          >
            Booked
          </button>
        </div>

        {/* Add Timeslot Form */}
        <h3>Add a New Timeslot</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddSlot();
          }}
          style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}
        >
          <div>
            <label>Start Time:&nbsp;</label>
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>
          <div>
            <label>End Time:&nbsp;</label>
            <input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </div>
          <button type="submit" style={styles.button('confirm')}>
            Add Slot
          </button>
        </form>

        {loading ? (
          <p>Loading...</p>
        ) : activeTab === 'available' ? (
          renderSlots(availableSlots, [])
        ) : activeTab === 'pending' ? (
          renderSlots(pendingSlots, ['confirm', 'cancel'])
        ) : (
          renderSlots(bookedSlots, ['cancel'])
        )}
      </div>
    </>
  );
}

export default GPDashboard;
