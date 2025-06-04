import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../../components/AdminNavbar';


const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div style={{ background: '#f3f4f6', minHeight: '100vh', padding: '2rem' }}>
      <AdminNavbar />
      <h1 style={{ fontSize: '2rem', color: '#1f2937', marginBottom: '1.5rem' }}>
        Admin Dashboard
      </h1>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => navigate('/admin/schedules')}
          style={buttonStyle}
        >
          Manage Schedules
        </button>
        <button
          onClick={() => navigate('/admin/users')}
          style={buttonStyle}
        >
          User Management
        </button>
        <button
          onClick={() => navigate('/admin/bookings')}
          style={buttonStyle}
        >
          GP Bookings
        </button>
        
      <button
      onClick={() => navigate('/admin/pending-gps')}
      style={buttonStyle}
        >
  Approve GPs
</button>

        <button
          onClick={() => navigate('/admin/readreviews')} 
          style={buttonStyle}
        >
          Read Reviews
        </button>
      </div>
    </div>
  );
};

const buttonStyle = {
  padding: '0.75rem 1.5rem',
  borderRadius: '8px',
  border: 'none',
  backgroundColor: '#4f46e5',
  color: '#fff',
  fontWeight: '600',
  cursor: 'pointer',
};

export default AdminDashboard;
