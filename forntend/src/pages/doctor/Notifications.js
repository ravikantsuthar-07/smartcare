import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { FiBell, FiCheck, FiCalendar, FiUser, FiClock } from "react-icons/fi";
import { notificationService } from "../../services/dataService";
import { toast } from "react-toastify";

const DoctorNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      // Mock data
      setNotifications([
        {
          id: 1,
          type: "appointment",
          title: "New Appointment",
          message:
            "John Doe has booked an appointment for Feb 1, 2026 at 10:00 AM",
          time: "10 minutes ago",
          read: false,
        },
        {
          id: 2,
          type: "queue",
          title: "Patient Arrived",
          message: "Jane Smith has checked in for her 11:00 AM appointment",
          time: "25 minutes ago",
          read: false,
        },
        {
          id: 3,
          type: "system",
          title: "Profile Verified",
          message: "Your doctor profile has been verified by the admin",
          time: "2 hours ago",
          read: true,
        },
        {
          id: 4,
          type: "appointment",
          title: "Appointment Cancelled",
          message:
            "Mike Johnson has cancelled his appointment for Jan 31, 2026",
          time: "3 hours ago",
          read: true,
        },
        {
          id: 5,
          type: "reminder",
          title: "Follow-up Reminder",
          message: "Sarah Williams is due for a follow-up appointment today",
          time: "5 hours ago",
          read: false,
        },
        {
          id: 6,
          type: "appointment",
          title: "New Appointment",
          message:
            "David Brown has booked an appointment for Feb 2, 2026 at 09:30 AM",
          time: "1 day ago",
          read: true,
        },
        {
          id: 7,
          type: "system",
          title: "Schedule Updated",
          message: "Your availability schedule has been updated successfully",
          time: "2 days ago",
          read: true,
        },
      ]);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
      );
      toast.success("Marked as read");
    } catch (error) {
      console.error("Error marking as read:", error);
      toast.error("Failed to mark as read");
    }
  };

  const markAllAsRead = async () => {
    try {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Error marking all as read:", error);
      toast.error("Failed to mark all as read");
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "appointment":
        return <FiCalendar />;
      case "queue":
        return <FiUser />;
      case "reminder":
        return <FiClock />;
      default:
        return <FiBell />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "appointment":
        return "#0cce5d";
      case "queue":
        return "#069494";
      case "reminder":
        return "#f57c00";
      default:
        return "#6c757d";
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "all") return true;
    if (filter === "unread") return !n.read;
    return n.type === filter;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="doctor-notifications">
      {/* Header */}
      <div className="card mb-4">
        <div className="card-body py-3">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div className="d-flex gap-2 flex-wrap">
              {[
                { key: "all", label: "All" },
                { key: "unread", label: `Unread (${unreadCount})` },
                { key: "appointment", label: "Appointments" },
                { key: "queue", label: "Queue" },
                { key: "reminder", label: "Reminders" },
              ].map((f) => (
                <button
                  key={f.key}
                  className={`btn btn-sm ${filter === f.key ? "btn-primary" : "btn-light"}`}
                  onClick={() => setFilter(f.key)}
                >
                  {f.label}
                </button>
              ))}
            </div>
            {unreadCount > 0 && (
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={markAllAsRead}
              >
                <FiCheck style={{ marginRight: "5px" }} />
                Mark all as read
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length > 0 ? (
        <div className="card">
          <div className="card-body p-0">
            {filteredNotifications.map((notification, index) => (
              <div
                key={notification.id}
                className={`notification-item ${!notification.read ? "unread" : ""}`}
                style={{
                  padding: "15px 20px",
                  borderBottom:
                    index < filteredNotifications.length - 1
                      ? "1px solid #e9ecef"
                      : "none",
                  background: !notification.read ? "#f0fff5" : "white",
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
                onClick={() =>
                  !notification.read && markAsRead(notification.id)
                }
              >
                <div className="d-flex gap-3">
                  <div
                    style={{
                      width: "45px",
                      height: "45px",
                      borderRadius: "50%",
                      background: `${getNotificationColor(notification.type)}15`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: getNotificationColor(notification.type),
                      flexShrink: 0,
                    }}
                  >
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="d-flex justify-content-between align-items-start">
                      <h6
                        style={{
                          margin: 0,
                          fontWeight: notification.read ? 400 : 600,
                        }}
                      >
                        {notification.title}
                        {!notification.read && (
                          <span
                            style={{
                              width: "8px",
                              height: "8px",
                              background: "#0cce5d",
                              borderRadius: "50%",
                              display: "inline-block",
                              marginLeft: "8px",
                            }}
                          ></span>
                        )}
                      </h6>
                      <span
                        style={{
                          fontSize: "0.8rem",
                          color: "#6c757d",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {notification.time}
                      </span>
                    </div>
                    <p
                      style={{
                        margin: "5px 0 0",
                        color: "#6c757d",
                        fontSize: "0.9rem",
                      }}
                    >
                      {notification.message}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="empty-state">
            <FiBell className="icon" />
            <h3>No Notifications</h3>
            <p>
              {filter === "unread"
                ? "You have read all your notifications"
                : "No notifications match the selected filter"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorNotifications;
