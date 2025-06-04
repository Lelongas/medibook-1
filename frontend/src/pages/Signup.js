import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/signup', form);
      alert('Signup successful! Please log in.');
      navigate('/login');
    } catch (err) {
      alert('Signup failed. Please try again.');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(to right, #6366f1, #3b82f6)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: '12px',
          padding: '2.5rem',
          width: '100%',
          maxWidth: '450px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
        }}
      >
        <h1 style={{ textAlign: 'center', color: '#4f46e5', marginBottom: '0.5rem' }}>
          MediBook
        </h1>
        <p style={{ textAlign: 'center', color: '#555', marginBottom: '2rem' }}>
          Create a new account to get started.
        </p>

        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333' }}>Name</label>
        <input
          type="text"
          placeholder="Your full name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          style={{
            width: '100%',
            padding: '0.75rem',
            marginBottom: '1.25rem',
            border: '1px solid #ccc',
            borderRadius: '8px',
            fontSize: '1rem',
          }}
        />

        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333' }}>Email</label>
        <input
          type="email"
          placeholder="example@email.com"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          style={{
            width: '100%',
            padding: '0.75rem',
            marginBottom: '1.25rem',
            border: '1px solid #ccc',
            borderRadius: '8px',
            fontSize: '1rem',
          }}
        />

        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333' }}>Password</label>
        <input
          type="password"
          placeholder="••••••••"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          style={{
            width: '100%',
            padding: '0.75rem',
            marginBottom: '1.25rem',
            border: '1px solid #ccc',
            borderRadius: '8px',
            fontSize: '1rem',
          }}
        />

        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333' }}>Role</label>
        <select
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          value={form.role}
          style={{
            width: '100%',
            padding: '0.75rem',
            marginBottom: '2rem',
            border: '1px solid #ccc',
            borderRadius: '8px',
            fontSize: '1rem',
          }}
        >
          <option value="user">User</option>
          <option value="gp">GP</option>
        </select>

        <button
          onClick={handleSignup}
          style={{
            width: '100%',
            backgroundColor: '#4f46e5',
            color: '#fff',
            padding: '0.75rem',
            fontSize: '1rem',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'background 0.3s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#4338ca')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#4f46e5')}
        >
          Signup
        </button>

        <p style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>
          Already have an account?{' '}
          <span
            style={{ color: '#4f46e5', cursor: 'pointer' }}
            onClick={() => navigate('/login')}
          >
            Login here
          </span>
        </p>
      </div>
    </div>
  );
}

export default Signup;
