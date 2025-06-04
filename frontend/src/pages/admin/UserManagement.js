import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
import Navbar from '../../components/AdminNavbar';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [displayedUsers, setDisplayedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const token = localStorage.getItem('token');

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
      setDisplayedUsers(res.data);
    } catch (err) {
      alert('Failed to load users');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateUser = async (email, updatedFields) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/admin/users/${email}/permissions`,
        updatedFields,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchUsers();
    } catch (err) {
      alert('Update failed.');
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchTerm(query);

    const filtered = users.filter(
      (u) =>
        (u.name.toLowerCase().includes(query) ||
         u.email.toLowerCase().includes(query)) &&
        (roleFilter === '' || u.role === roleFilter)
    );

    setDisplayedUsers(filtered);
  };

  const handleRoleFilterChange = (e) => {
    const selectedRole = e.target.value;
    setRoleFilter(selectedRole);

    const filtered = users.filter(
      (u) =>
        (searchTerm === '' ||
         u.name.toLowerCase().includes(searchTerm) ||
         u.email.toLowerCase().includes(searchTerm)) &&
        (selectedRole === '' || u.role === selectedRole)
    );

    setDisplayedUsers(filtered);
  };

  const exportCSV = () => {
    const csv = Papa.unparse(displayedUsers);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'users.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ✅ Remove user from UI list only
  const removeFromList = (email) => {
    setDisplayedUsers((prev) => prev.filter((u) => u.email !== email));
  };

  return (
    <div style={{ background: '#f3f4f6', minHeight: '100vh', padding: '2rem' }}>
      <Navbar />
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#1f2937' }}>
        User Management
      </h1>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={handleSearch}
          style={{
            padding: '0.5rem',
            borderRadius: '6px',
            border: '1px solid #ccc',
            width: '300px',
          }}
        />

        <select
          value={roleFilter}
          onChange={handleRoleFilterChange}
          style={{
            padding: '0.5rem',
            borderRadius: '6px',
            border: '1px solid #ccc',
          }}
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="gp">GP</option>
          <option value="user">User</option>
        </select>

        <button
          onClick={exportCSV}
          style={{
            backgroundColor: '#10b981',
            color: '#fff',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          Export CSV
        </button>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: '1rem', padding: '2rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#e5e7eb' }}>
              <th style={th}>Name</th>
              <th style={th}>Email</th>
              <th style={th}>Role</th>
              <th style={th}>Member</th>
              <th style={th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedUsers.map((user) => (
              <tr key={user.email} style={{ borderBottom: '1px solid #eee' }}>
                <td style={td}>{user.name}</td>
                <td style={td}>{user.email}</td>
                <td style={td}>
                  <select
                    value={user.role}
                    onChange={(e) =>
                      updateUser(user.email, { role: e.target.value })
                    }
                  >
                    <option value="user">User</option>
                    <option value="gp">GP</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td style={td}>
                  <input
                    type="checkbox"
                    checked={user.member === 1}
                    onChange={(e) =>
                      updateUser(user.email, { member: e.target.checked ? 1 : 0 })
                    }
                  />
                </td>
                <td style={td}>
                  <button
                    onClick={() => removeFromList(user.email)}
                    style={{
                      backgroundColor: '#ef4444',
                      color: '#fff',
                      border: 'none',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const th = {
  textAlign: 'left',
  padding: '0.75rem',
  fontWeight: '600',
  color: '#111827',
};

const td = {
  padding: '0.75rem',
  color: '#374151',
};

export default UserManagement;
