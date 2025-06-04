import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProfessionalCard = ({ professional, serviceId }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/professionals/${professional.id}`);
  };

  return (
    <div
      onClick={handleClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        width: '70%',
        margin: '1rem auto',
        padding: '1rem',
        border: '1px solid #ccc',
        borderRadius: '10px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        cursor: 'pointer',
        backgroundColor: '#f9f9f9',
        transition: 'transform 0.2s ease',
      }}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
    >
      <img
        src={professional.photoUrl}
        alt={professional.name}
        style={{
          width: '120px',
          height: '100px',
          objectFit: 'cover',
          borderRadius: '10%',
          marginRight: '1.5rem'
        }}
      />
      <div>
        <h3 style={{ margin: '0 0 0.5rem 0' }}>{professional.name}</h3>
        <p style={{ margin: 0 }}>{professional.shortDescription}</p>
      </div>
    </div>
  );
};

export default ProfessionalCard;
