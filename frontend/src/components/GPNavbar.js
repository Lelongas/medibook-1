import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const GPNavbar = () => {
  const [reminders, setReminders] = useState([]);
  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/bookings/reminders/${email}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setReminders(res.data);
      } catch (err) {
        console.error("Failed to fetch reminders", err);
      }
    };
    fetchReminders();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const handleProfile = () => {
    window.location.href = "/gp/profile";
  };

  const handleRevenue = () => {
    window.location.href = "/gp/revenue";
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.logo}>MediBook</div>
      <div style={styles.menu}>
        {/* Notification Bell */}
        <div style={{ position: "relative", marginRight: "1rem" }}>
          <span
            style={{ cursor: "pointer", fontSize: "18px", color: "#4f46e5" }}
            onClick={() => {
              const dropdown = document.getElementById("notif-dropdown");
              dropdown.style.display =
                dropdown.style.display === "block" ? "none" : "block";
            }}
          >
            🔔
          </span>
          {reminders.length > 0 && (
            <div style={styles.badge}>{reminders.length}</div>
          )}
          <div id="notif-dropdown" style={styles.dropdown}>
            {reminders.length === 0 ? (
              <div style={styles.dropdownItem}>No upcoming appointments</div>
            ) : (
              reminders.map((r) => (
                <div key={r.slotId} style={styles.dropdownItem}>
                  {new Date(r.startTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  <br />
                  {r.bookedByEmail || r.gpEmail}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Avatar Dropdown */}
        <div style={styles.avatarContainer}>
          <img
            src="https://github.com/shadcn.png"
            alt="User Avatar"
            style={styles.avatar}
            onClick={() => {
              const menu = document.getElementById("dropdown-menu");
              menu.style.display =
                menu.style.display === "block" ? "none" : "block";
            }}
          />
          <div id="dropdown-menu" style={styles.dropdown}>
            <div style={styles.dropdownItem} onClick={handleProfile}>
              Profile
            </div>
            <div style={styles.dropdownItem} onClick={handleRevenue}>
              Revenue Report
            </div>
            <div
              style={styles.dropdownItem}
              onClick={() => {
                const role = localStorage.getItem("role");
                window.location.href = `/${role}/review`;
              }}
            >
              Write a Review
            </div>
            <div style={styles.dropdownItem} onClick={handleLogout}>
              Logout
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: "10px 20px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    position: "relative",
    zIndex: 10,
  },
  logo: {
    fontSize: "20px",
    fontWeight: "bold",
  },
  menu: {
    display: "flex",
    alignItems: "center",
  },
  badge: {
    position: "absolute",
    top: "-5px",
    right: "-5px",
    backgroundColor: "red",
    color: "white",
    borderRadius: "50%",
    padding: "2px 6px",
    fontSize: "12px",
  },
  avatarContainer: {
    position: "relative",
    cursor: "pointer",
  },
  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
  },
  dropdown: {
    display: "none",
    position: "absolute",
    top: "50px",
    right: "0",
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "6px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    width: "180px",
    zIndex: 100,
  },
  dropdownItem: {
    padding: "10px",
    cursor: "pointer",
    borderBottom: "1px solid #eee",
  },
};

export default GPNavbar;
