import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ProfessionalCard from '../components/ProfessionalCard';
import { motion } from 'framer-motion';

export default function ServiceDetails() {
  const { serviceId } = useParams();
  const [serviceName, setServiceName] = useState('');
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [serviceRes, professionalsRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/bookings/service/${serviceId}`),
          axios.get(`http://localhost:5000/api/bookings/service/${serviceId}/professionals`)
        ]);

        setServiceName(serviceRes.data.name);
        setProfessionals(professionalsRes.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load service details.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [serviceId]);

  const containerStyle = {
    padding: '2rem 1rem',
    maxWidth: '1200px',
    margin: '0 auto',
    fontFamily: "'Segoe UI', sans-serif",
  };

  const headingStyle = {
    textAlign: 'center',
    fontSize: '2.5rem',
    color: '#4F46E5',
    fontWeight: 'bold',
    marginBottom: '0.5rem',
  };

  const subheadingStyle = {
    textAlign: 'center',
    color: '#555',
    fontSize: '1.125rem',
    marginBottom: '2rem',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '1.5rem',
    
  };

  const loadingStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '50vh',
    fontSize: '1.25rem',
    color: '#666',
  };

  const errorStyle = {
    ...loadingStyle,
    color: '#D32F2F',
  };

  if (loading) return <div style={loadingStyle}>Loading...</div>;
  if (error) return <div style={errorStyle}>{error}</div>;

  return (
    <motion.div
      style={containerStyle}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 style={headingStyle}>{serviceName}</h2>
      <p style={subheadingStyle}>Meet our trusted professionals</p>

      <div style={gridStyle}>
        {professionals.map((prof, index) => (
          <motion.div
            key={prof.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * index, duration: 0.4 }}
          >
            <ProfessionalCard professional={prof} serviceId={serviceId} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
