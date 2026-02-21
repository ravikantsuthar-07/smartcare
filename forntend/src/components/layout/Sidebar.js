import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FiGrid,
  FiCalendar,
  FiUsers,
  FiFileText,
  FiClock,
  FiBell,
  FiUser,
  FiLogOut,
  FiActivity,
  FiUpload,
  FiPlusCircle,
  FiList,
  FiHeart,
} from "react-icons/fi";
import { FaPills, FaStethoscope } from "react-icons/fa";

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const patientLinks = [
    { path: "/patient/dashboard", icon: <FiGrid />, label: "Dashboard" },
    {
      path: "/patient/appointments",
      icon: <FiCalendar />,
      label: "Appointments",
    },
    { path: "/patient/queue", icon: <FiClock />, label: "Queue Status" },
    {
      path: "/patient/prescriptions",
      icon: <FiFileText />,
      label: "Prescriptions",
    },
    {
      path: "/patient/medicine-reminder",
      icon: <FaPills />,
      label: "Medicine Reminder",
    },
    {
      path: "/patient/diet-precautions",
      icon: <FiHeart />,
      label: "Diet & Precautions",
    },
    {
      path: "/patient/medical-records",
      icon: <FiUpload />,
      label: "Medical Records",
    },
    {
      path: "/patient/notifications",
      icon: <FiBell />,
      label: "Notifications",
    },
    { path: "/patient/profile", icon: <FiUser />, label: "Profile" },
  ];

  const doctorLinks = [
    { path: "/doctor/dashboard", icon: <FiGrid />, label: "Dashboard" },
    { path: "/doctor/queue", icon: <FiUsers />, label: "Queue Management" },
    {
      path: "/doctor/appointments",
      icon: <FiCalendar />,
      label: "Appointments",
    },
    {
      path: "/doctor/prescriptions",
      icon: <FiFileText />,
      label: "Prescriptions",
    },
    { path: "/doctor/notifications", icon: <FiBell />, label: "Notifications" },
    { path: "/doctor/profile", icon: <FiUser />, label: "Profile" },
  ];

  const links = user?.role === "doctor" ? doctorLinks : patientLinks;

  const handleLogout = () => {
    logout();
    onClose();
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="logo-icon">
            <FaStethoscope />
          </div>
          <h2>
            <span>Smart</span>Care
          </h2>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <span className="nav-section-title">Main Menu</span>
          <ul
            className="nav-list"
            style={{ listStyle: "none", padding: 0, margin: 0 }}
          >
            {links.map((link) => (
              <li key={link.path} className="nav-item">
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active" : ""}`
                  }
                  onClick={onClose}
                >
                  <span className="icon">{link.icon}</span>
                  <span>{link.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="user-avatar">{getInitials(user?.name)}</div>
          <div className="user-info">
            <span className="user-name">{user?.name || "User"}</span>
            <span className="user-role">{user?.role || "Guest"}</span>
          </div>
        </div>
        <button
          className="btn btn-light btn-sm btn-block mt-3"
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          <FiLogOut /> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
