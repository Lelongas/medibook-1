import { Link } from 'react-router-dom';

export default function ServiceCard({ service }) {
  return (
    <div
      style={{
        backgroundColor: '#f9f9ff',
        borderRadius: '1rem',
        padding: '1.5rem',
        textAlign: 'center',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.08)';
      }}
    >
      <div>
        <h3 style={{ marginBottom: '0.5rem', fontSize: '1.5rem', color: '#333' }}>{service.name}</h3>
        <p style={{ fontSize: '0.95rem', color: '#666' }}>{service.shortDescription}</p>
      </div>

      <Link
        to={`/services/${service.id}`}
        style={{
          marginTop: '1.5rem',
          padding: '0.6rem 1.2rem',
          backgroundColor: '#4F46E5',
          color: '#fff',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: 'bold',
          transition: 'background-color 0.2s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#4338CA')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#4F46E5')}
      >
        View Providers
      </Link>
    </div>
  );
}
