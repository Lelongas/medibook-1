import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const email = localStorage.getItem('email');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/bookings/notifications/${email}`);
      setNotifications(res.data);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>🔔 Notifications</h2>
      {notifications.length === 0 ? (
        <p>No notifications yet.</p>
      ) : (
        notifications.map((note, index) => (
          <div
            key={index}
            style={{
              background: '#f9fafb',
              padding: '1rem',
              marginBottom: '1rem',
              borderRadius: '0.5rem',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}
          >
            <p>{note.message}</p>
            <small>{new Date(note.createdAt).toLocaleString()}</small>
          </div>
        ))
      )}
    </div>
  );
}
