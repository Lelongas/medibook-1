import React from "react"
import Navbar from "../../components/AdminNavbar" // Adjust the path if needed

const AdminProfile = () => {
  const adminInfo = {
    name: "Admin User",
    email: localStorage.getItem("email") || "admin@example.com",
    role: "Administrator",
    permissions: [
      "Manage Users",
      "View Reports",
      "Edit System Settings",
      "Access All Profiles",
    ],
  }

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.title}>Admin Profile</h2>

        <div style={styles.card}>
          <h3 style={styles.cardTitle}>👤 Admin Details</h3>
          <p><strong>Name:</strong> {adminInfo.name}</p>
          <p><strong>Email:</strong> {adminInfo.email}</p>
          <p><strong>Role:</strong> {adminInfo.role}</p>
        </div>

        <div style={styles.featuresSection}>
          <h3 style={styles.sectionTitle}>Permissions</h3>
          <ul style={styles.featureList}>
            {adminInfo.permissions.map((perm, index) => (
              <li key={index}>✅ {perm}</li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}

const styles = {
  container: {
    padding: "20px",
    maxWidth: "600px",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    fontSize: "24px",
    marginBottom: "20px",
  },
  card: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    marginBottom: "20px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  },
  cardTitle: {
    fontSize: "20px",
    marginBottom: "10px",
  },
  featuresSection: {
    marginTop: "30px",
  },
  sectionTitle: {
    fontSize: "18px",
    marginBottom: "10px",
  },
  featureList: {
    listStyleType: "none",
    paddingLeft: "0",
  },
}

export default AdminProfile;
