import React, { useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import GPNavbar from '../components/GPNavbar';

const GPRevenue = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');
  const email = localStorage.getItem('email');

  const fetchRevenue = async () => {
    if (!startDate || !endDate) {
      alert('Please select both start and end dates');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        'http://localhost:5000/api/bookings/gp-revenue',
        {
          email,
          startDate,
          endDate
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setReport(res.data);
    } catch (err) {
      alert('Failed to load revenue report');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/bookings/pdf/${email}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob',
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'RevenueReport.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Failed to download PDF', err);
      alert('Could not download report. Try again later.');
    }
  };

  return (
    <>
      <GPNavbar />
      <div style={{ padding: '2rem', maxWidth: '700px', margin: 'auto' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Revenue Report</h2>

        <div style={{ marginBottom: '1rem' }}>
          <label>Start Date:</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            dateFormat="yyyy-MM-dd"
            placeholderText="Select start date"
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>End Date:</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            dateFormat="yyyy-MM-dd"
            placeholderText="Select end date"
          />
        </div>

        <button
          onClick={fetchRevenue}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4f46e5',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            marginRight: '1rem'
          }}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Get Report'}
        </button>

        {/* 📄 Download Button */}
        <button
          onClick={handleDownloadPDF}
          style={{
            marginBottom: '20px',
            backgroundColor: '#4f46e5',
            color: '#fff',
            padding: '10px 20px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          📄 Download Revenue Report (PDF)
        </button>

        {report && (
          <div style={{
            marginTop: '2rem',
            backgroundColor: '#f9f9f9',
            padding: '1rem',
            borderRadius: '8px',
            border: '1px solid #ddd'
          }}>
            <h3 style={{ marginBottom: '1rem' }}>Summary</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#e5e7eb' }}>
                  <th style={cellHeader}>Start Date</th>
                  <th style={cellHeader}>End Date</th>
                  <th style={cellHeader}>Bookings</th>
                  <th style={cellHeader}>Total Revenue</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={cell}>{new Date(startDate).toLocaleDateString()}</td>
                  <td style={cell}>{new Date(endDate).toLocaleDateString()}</td>
                  <td style={cell}>{report.count}</td>
                  <td style={cell}>${report.revenue}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

const cellHeader = {
  padding: '10px',
  borderBottom: '1px solid #ccc',
  fontWeight: 'bold',
  textAlign: 'left'
};

const cell = {
  padding: '10px',
  borderBottom: '1px solid #eee',
};

export default GPRevenue;
