import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [reminders, setReminders] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [notifDropdownVisible, setNotifDropdownVisible] = useState(false);
  const [avatarDropdownVisible, setAvatarDropdownVisible] = useState(false);

  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (email && token) {
      fetchReminders();
      fetchNotifications();

      const interval = setInterval(() => {
        fetchNotifications();
      }, 15000); // 15 seconds

      return () => clearInterval(interval); // Cleanup
    }
  }, [email, token]);

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
      console.error("Failed to fetch user reminders", err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/bookings/notifications/${email}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNotifications(res.data);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  const markNotificationsAsRead = async () => {
    try {
      await axios.post(
        `http://localhost:5000/api/bookings/notifications/mark-read/${email}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error("Failed to mark notifications as read", err);
    }
  };

  const toggleNotifications = () => {
    const newState = !notifDropdownVisible;
    setNotifDropdownVisible(newState);
    if (newState) markNotificationsAsRead();
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const handleProfile = () => {
    if (role === "admin") {
      window.location.href = "/admin/profile";
    } else {
      window.location.href = "/profile";
    }
  };

  const handleBookings = () => {
    window.location.href = "/my-bookings";
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <nav style={styles.navbar}>
      <div style={styles.logo}>MediBook</div>

      <div style={styles.menu}>
        {/* 🔔 Notification Bell */}
        <div style={{ position: "relative", marginRight: "1rem" }}>
          <span
            style={{ cursor: "pointer", fontSize: "18px", color: "#4f46e5" }}
            onClick={toggleNotifications}
          >
            🔔
          </span>
          {unreadCount > 0 && <div style={styles.badge}>{unreadCount}</div>}
          {notifDropdownVisible && (
            <div id="user-notif-dropdown" style={styles.dropdown}>
              {notifications.length === 0 ? (
                <div style={styles.dropdownItem}>No notifications</div>
              ) : (
                notifications.map((n, idx) => (
                  <div key={idx} style={styles.dropdownItem}>
                    {n.message}
                    <br />
                    
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* 🧑 Avatar Dropdown */}
        <div style={styles.avatarContainer}>
          <img
            src="https://github.com/shadcn.png"
            alt="User Avatar"
            style={styles.avatar}
            onClick={() => setAvatarDropdownVisible((prev) => !prev)}
          />
          {avatarDropdownVisible && (
            <div style={styles.dropdown}>
              <div style={styles.dropdownItem} onClick={handleProfile}>
                Profile
              </div>
              <div style={styles.dropdownItem} onClick={handleBookings}>
                Bookings
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
          )}
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
    gap: "1rem",
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
    display: "block",
    position: "absolute",
    top: "50px",
    right: "0",
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "6px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    width: "220px",
    zIndex: 100,
  },
  dropdownItem: {
    padding: "10px",
    cursor: "pointer",
    borderBottom: "1px solid #eee",
    fontSize: "14px",
  },
};

export default Navbar;
