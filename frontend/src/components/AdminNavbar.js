import React from "react";

const AdminNavbar = () => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    window.location.href = "/login";
  };

  const handleProfile = () => {
    window.location.href = "/admin/profile";
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.logo}>MediBook Admin</div>
      <div style={styles.menu}>
        <div style={styles.avatarContainer}>
          <img
            src="https://github.com/shadcn.png"
            alt="Admin Avatar"
            style={styles.avatar}
            onClick={() => {
              const menu = document.getElementById("admin-dropdown-menu");
              menu.style.display =
                menu.style.display === "block" ? "none" : "block";
            }}
          />
          <div id="admin-dropdown-menu" style={styles.dropdown}>
            <div style={styles.dropdownItem} onClick={handleProfile}>
              Profile
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

export default AdminNavbar;