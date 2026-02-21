import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FiMenu, FiBell, FiSearch, FiUser } from "react-icons/fi";
import { notificationService } from "../../services/dataService";

const Topbar = ({ onMenuClick }) => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  const getPageTitle = () => {
    const path = location.pathname;
    const titles = {
      "/patient/dashboard": { title: "Dashboard", subtitle: "Welcome back!" },
      "/patient/appointments": {
        title: "Appointments",
        subtitle: "Manage your appointments",
      },
      "/patient/book-appointment": {
        title: "Book Appointment",
        subtitle: "Schedule a new appointment",
      },
      "/patient/queue": {
        title: "Queue Status",
        subtitle: "Track your position",
      },
      "/patient/prescriptions": {
        title: "Prescriptions",
        subtitle: "View your prescriptions",
      },
      "/patient/medicine-reminder": {
        title: "Medicine Reminder",
        subtitle: "Track your medications",
      },
      "/patient/diet-precautions": {
        title: "Diet & Precautions",
        subtitle: "Health guidelines",
      },
      "/patient/medical-records": {
        title: "Medical Records",
        subtitle: "Manage your records",
      },
      "/patient/notifications": {
        title: "Notifications",
        subtitle: "Stay updated",
      },
      "/patient/profile": { title: "Profile", subtitle: "Manage your account" },
      "/doctor/dashboard": {
        title: "Dashboard",
        subtitle: "Overview of your practice",
      },
      "/doctor/queue": {
        title: "Queue Management",
        subtitle: "Manage patient queue",
      },
      "/doctor/appointments": {
        title: "Appointments",
        subtitle: "View appointments",
      },
      "/doctor/prescriptions": {
        title: "Prescriptions",
        subtitle: "Prescription history",
      },
      "/doctor/notifications": {
        title: "Notifications",
        subtitle: "Stay updated",
      },
      "/doctor/profile": { title: "Profile", subtitle: "Manage your account" },
    };

    // Handle dynamic routes
    if (path.startsWith("/doctor/create-prescription")) {
      return {
        title: "Create Prescription",
        subtitle: "Write a new prescription",
      };
    }
    if (path.startsWith("/doctor/patient-history")) {
      return { title: "Patient History", subtitle: "View patient records" };
    }

    return titles[path] || { title: "SmartCare", subtitle: "" };
  };

  const { title, subtitle } = getPageTitle();

  useEffect(() => {
    // Fetch unread notification count
    const fetchUnreadCount = async () => {
      try {
        if (user?.id) {
          const notifications = await notificationService.getNotifications(
            user.id,
          );
          const unread = notifications.filter((n) => !n.is_read).length;
          setUnreadCount(unread);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchUnreadCount();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [user?.id]);

  const handleNotificationClick = () => {
    const basePath = user?.role === "doctor" ? "/doctor" : "/patient";
    navigate(`${basePath}/notifications`);
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="mobile-menu-btn" onClick={onMenuClick}>
          <FiMenu />
        </button>
        <div className="page-title">
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
        </div>
      </div>

      <div className="topbar-right">
        <button className="topbar-btn" onClick={handleNotificationClick}>
          <FiBell />
          {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
        </button>
      </div>
    </header>
  );
};

export default Topbar;
