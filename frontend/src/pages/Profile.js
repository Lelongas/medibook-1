import React, { useState, useEffect } from "react"
import PayPalBooking from "../components/PayPalBookingl"
const Profile = () => {
  const [isMember, setIsMember] = useState(null) // null = loading, true/false = determined

  useEffect(() => {
    const fetchMembershipStatus = async () => {
      const email = localStorage.getItem("email")
      console.log(email)
      if (!email) {
        alert("Email not found in localStorage.")
        return
      }

      try {
        const response = await fetch("http://localhost:5000/api/bookings/member", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        })

        const dataa = await response.json()
        const data = dataa[0]; 
        if (data && data.member === 0) {
          setIsMember(false)
        } else if (data && data.member === 1) {
          setIsMember(true)
        } else {
          console.error("Unexpected response:", data)
          setIsMember(false)
        }
      } catch (err) {
        console.error("Error fetching membership status:", err)
        setIsMember(false)
      }
    }

    fetchMembershipStatus()
  }, [])

  const handleBuyMembership = async () => {
    const email = localStorage.getItem("email")
    if (!email) {
      alert("Email not found in localStorage.")
      return
    }

    try {
      const response = await fetch("http://localhost:5000/api/bookings/setmember", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        alert("Membership purchased!")
        setIsMember(true)
      } else {
        const error = await response.text()
        alert("Failed to purchase membership: " + error)
      }
    } catch (err) {
      console.error("Error purchasing membership:", err)
      alert("Error purchasing membership.")
    }
  }

  const memberFeatures = [
    "Unlimited Access to Premium Content",
    "Priority Customer Support",
    "Exclusive Discounts and Offers",
    "Early Access to New Features",
  ]

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Welcome to Your Profile</h2>

      {isMember === null && <p>Loading membership status...</p>}

      {isMember === false && (
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Become a Member</h3>
          <p style={styles.cardText}>Unlock premium features and benefits.</p>
          <PayPalBooking
      amount="10.00" // or dynamically set price if needed
      onPaymentSuccess={() => handleBuyMembership()}
    />
        </div>
      )}

      {isMember === true && (
        <div
          style={{
            ...styles.card,
            backgroundColor: "#d4edda",
            border: "1px solid #c3e6cb",
          }}
        >
          <h3 style={styles.cardTitle}>🎉 You are a Member!</h3>
          <p style={styles.cardText}>Enjoy your exclusive benefits below.</p>
        </div>
      )}

      <div style={styles.featuresSection}>
        <h3 style={styles.sectionTitle}>Membership Benefits</h3>
        <ul style={styles.featureList}>
          {memberFeatures.map((feature, index) => (
            <li key={index} style={{ opacity: isMember ? 1 : 0.4 }}>
              ✅ {feature}
            </li>
          ))}
        </ul>
      </div>
    </div>
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
  cardText: {
    marginBottom: "15px",
  },
  button: {
    padding: "10px 16px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
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

export default Profile
