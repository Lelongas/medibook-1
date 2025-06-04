import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminNavbar from '../../components/AdminNavbar';

const PendingGPApproval = () => {
  const [pendingGPs, setPendingGPs] = useState([]);

  const fetchPendingGPs = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/pending-gps');
      setPendingGPs(res.data);
    } catch (err) {
      console.error('Error fetching pending GPs:', err);
    }
  };

  useEffect(() => {
    fetchPendingGPs();
  }, []);

  const handleApprove = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/admin/approve-gp/${id}`);
      fetchPendingGPs();
    } catch (err) {
      console.error('Error approving GP:', err);
    }
  };

  const handleDecline = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/admin/decline-gp/${id}`);
      fetchPendingGPs();
    } catch (err) {
      console.error('Error declining GP:', err);
    }
  };

  return (
    <>
      <AdminNavbar />
      <div style={{ padding: '2rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>📝 Pending GP Approvals</h2>
        {pendingGPs.length === 0 ? (
          <p>No pending GPs at the moment.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f0f0f0' }}>
              <tr>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingGPs.map((gp) => (
                <tr key={gp._id} style={{ borderBottom: '1px solid #ccc' }}>
                  <td style={styles.td}>{gp.name}</td>
                  <td style={styles.td}>{gp.email}</td>
                  <td style={styles.td}>
                    <button style={styles.buttonApprove} onClick={() => handleApprove(gp._id)}>Verify</button>
                    <button style={styles.buttonDecline} onClick={() => handleDecline(gp._id)}>Decline</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

const styles = {
  th: {
    padding: '12px',
    textAlign: 'left'
  },
  td: {
    padding: '12px'
  },
  buttonApprove: {
    marginRight: '1rem',
    backgroundColor: '#22c55e',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    padding: '0.5rem 1rem',
    cursor: 'pointer'
  },
  buttonDecline: {
    backgroundColor: '#ef4444',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    padding: '0.5rem 1rem',
    cursor: 'pointer'
  }
};

export default PendingGPApproval;
