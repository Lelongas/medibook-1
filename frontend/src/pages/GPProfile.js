import React from 'react';
import GPNavbar from '../components/GPNavbar';
import GPAddSlot from '../components/GPAddSlot';

const GPProfile = () => {
  const name = localStorage.getItem('name');
  const email = localStorage.getItem('email');

  return (
    <div style={{ background: '#f3f4f6', minHeight: '100vh' }}>
      <GPNavbar />
      <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
        {/* GP Info Card */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.05)',
            marginBottom: '2rem',
          }}
        >
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>
            GP Profile
          </h2>
          <p style={{ fontSize: '1rem', color: '#374151', marginBottom: '0.5rem' }}>
            <strong>Name:</strong> {name}
          </p>
          <p style={{ fontSize: '1rem', color: '#374151' }}>
            <strong>Email:</strong> {email}
          </p>
        </div>

        {/* Add Slot Form */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.05)',
          }}
        >
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>
            Add New Slot
          </h2>
          <GPAddSlot />
        </div>
      </div>
    </div>
  );
};

export default GPProfile;
