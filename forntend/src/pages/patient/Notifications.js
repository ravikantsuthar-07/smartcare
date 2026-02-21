import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  FiBell,
  FiCalendar,
  FiClock,
  FiMessageSquare,
  FiX,
  FiCheck,
  FiTrash2,
} from "react-icons/fi";
import { FaPills } from "react-icons/fa";
import { notificationService } from "../../services/dataService";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const Notifications = () => {
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
          title: "Appointment Reminder",
          message:
            "Your appointment with Dr. Sarah Johnson is tomorrow at 10:30 AM",
          time: "2 hours ago",
          isRead: false,
        },
        {
          id: 2,
          type: "queue",
          title: "Queue Update",
          message:
            "You are now #3 in the queue. Estimated wait time: 15 minutes",
          time: "3 hours ago",
          isRead: false,
        },
        {
          id: 3,
          type: "medicine",
          title: "Medicine Reminder",
          message:
            "Time to take your afternoon medicines: Paracetamol, Aspirin",
          time: "5 hours ago",
          isRead: true,
        },
        {
          id: 4,
          type: "message",
          title: "Message from Dr. Mike Brown",
          message:
            "Your test results are normal. Continue with the prescribed medication.",
          time: "Yesterday",
          isRead: true,
        },
        {
          id: 5,
          type: "appointment",
          title: "Appointment Confirmed",
          message:
            "Your appointment with Dr. Emily Davis on Feb 10 at 2:00 PM has been confirmed",
          time: "2 days ago",
          isRead: true,
        },
        {
          id: 6,
          type: "queue",
          title: "Your Turn!",
          message:
            "It's your turn now. Please proceed to Dr. Sarah Johnson's office",
          time: "3 days ago",
          isRead: true,
        },
      ]);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      // await notificationService.markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n)),
      );
    } catch (error) {
      toast.error("Failed to update notification");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      // await notificationService.markAllAsRead(user.id);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      toast.success("All notifications marked as read");
    } catch (error) {
      toast.error("Failed to update notifications");
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      // await notificationService.deleteNotification(notificationId);
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
      toast.success("Notification deleted");
    } catch (error) {
      toast.error("Failed to delete notification");
    }
  };

  const handleClearAll = async () => {
    const result = await Swal.fire({
      title: "Clear All Notifications?",
      text: "This will remove all your notifications",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, clear all",
    });

    if (result.isConfirmed) {
      setNotifications([]);
      toast.success("All notifications cleared");
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "appointment":
        return <FiCalendar />;
      case "queue":
        return <FiClock />;
      case "medicine":
        return <FaPills />;
      case "message":
        return <FiMessageSquare />;
      default:
        return <FiBell />;
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "all") return true;
    if (filter === "unread") return !n.isRead;
    return n.type === filter;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

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
    <div className="notifications-page">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Notifications</h2>
          <p style={{ color: "#6c757d", margin: 0 }}>
            {unreadCount > 0
              ? `${unreadCount} unread notifications`
              : "All caught up!"}
          </p>
        </div>
        <div className="d-flex gap-2">
          {unreadCount > 0 && (
            <button
              className="btn btn-outline-primary"
              onClick={handleMarkAllAsRead}
            >
              <FiCheck /> Mark All Read
            </button>
          )}
          {notifications.length > 0 && (
            <button className="btn btn-outline-danger" onClick={handleClearAll}>
              <FiTrash2 /> Clear All
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-4">
        <div className="card-body py-3">
          <div className="d-flex gap-2 flex-wrap">
            {[
              { key: "all", label: "All" },
              { key: "unread", label: "Unread" },
              { key: "appointment", label: "Appointments" },
              { key: "queue", label: "Queue" },
              { key: "medicine", label: "Medicine" },
              { key: "message", label: "Messages" },
            ].map((f) => (
              <button
                key={f.key}
                className={`btn btn-sm ${filter === f.key ? "btn-primary" : "btn-light"}`}
                onClick={() => setFilter(f.key)}
              >
                {f.label}
                {f.key === "unread" && unreadCount > 0 && (
                  <span className="badge bg-danger ms-1">{unreadCount}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length > 0 ? (
        <div className="notification-list">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`notification-item ${!notification.isRead ? "unread" : ""}`}
              onClick={() =>
                !notification.isRead && handleMarkAsRead(notification.id)
              }
              style={{ cursor: !notification.isRead ? "pointer" : "default" }}
            >
              <div className={`notification-icon ${notification.type}`}>
                {getNotificationIcon(notification.type)}
              </div>
              <div className="notification-content">
                <h4>{notification.title}</h4>
                <p>{notification.message}</p>
                <span className="notification-time">{notification.time}</span>
              </div>
              <button
                className="notification-close"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(notification.id);
                }}
              >
                <FiX />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="card">
          <div className="empty-state">
            <FiBell className="icon" />
            <h3>No Notifications</h3>
            <p>
              {filter === "all"
                ? "You don't have any notifications yet"
                : `No ${filter} notifications`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
