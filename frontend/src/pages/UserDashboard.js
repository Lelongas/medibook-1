import React, { useEffect, useState } from 'react';
import axios from 'axios';

function UserDashboard() {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const user = await fetchUser(); // fetch user first
      if (user?.email) {
        await Promise.all([
          fetchAvailableSlots(),
          fetchMyBookings(user.email),
        ]);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    }
    setLoading(false);
  };

  const fetchUser = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/user/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserData(res.data);
      localStorage.setItem('namee',res.data.name)
      console.log('name',localStorage.getItem('namee'));

      return res.data;
    } catch (err) {
      console.error('Failed to fetch user:', err);
      return null;
    }
  };

  const fetchAvailableSlots = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/bookings/available', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAvailableSlots(res.data);
    } catch (err) {
      console.error('Failed to fetch available slots:', err);
    }
  };

  const fetchMyBookings = async (email) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/bookings/my-bookings?email=${email}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyBookings(res.data);
    } catch (err) {
      console.error('Failed to fetch your bookings:', err);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Welcome{userData ? `, ${userData.name}` : ''}!</h2>

      <h3>My Bookings</h3>
      {loading ? (
        <p>Loading...</p>
      ) : myBookings.length === 0 ? (
        <p>No bookings yet</p>
      ) : (
        <ul>
          {myBookings.map((booking) => (
            <li key={booking._id}>
              {new Date(booking.startTime).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}{' '}
              -{' '}
              {new Date(booking.endTime).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default UserDashboard;
