import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FiCalendar,
  FiClock,
  FiFileText,
  FiBell,
  FiPlus,
  FiArrowRight,
} from "react-icons/fi";
import { FaPills } from "react-icons/fa";
import { dashboardService, reminderService } from "../../services/dataService";

const PatientDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Mock data for demonstration
      setDashboardData({
        upcomingAppointment: {
          id: 1,
          doctorName: "Dr. Sarah Johnson",
          specialization: "Cardiologist",
          date: "2026-02-05",
          time: "10:30 AM",
          queuePosition: 3,
        },
        stats: {
          totalAppointments: 12,
          pendingPrescriptions: 2,
          unreadNotifications: 5,
          recordsUploaded: 8,
        },
        recentPrescriptions: [
          {
            id: 1,
            doctorName: "Dr. Sarah Johnson",
            date: "2026-01-28",
            diagnosis: "Routine Checkup",
          },
          {
            id: 2,
            doctorName: "Dr. Mike Brown",
            date: "2026-01-20",
            diagnosis: "Seasonal Flu",
          },
        ],
      });

      setReminders([
        {
          id: 1,
          name: "Paracetamol",
          dosage: "500mg",
          time: "Morning",
          taken: false,
        },
        {
          id: 2,
          name: "Vitamin D",
          dosage: "1000 IU",
          time: "Morning",
          taken: true,
        },
        {
          id: 3,
          name: "Omeprazole",
          dosage: "20mg",
          time: "Afternoon",
          taken: false,
        },
      ]);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return {
      day: date.getDate(),
      month: date.toLocaleString("default", { month: "short" }),
    };
  };

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
    <div className="dashboard">
      {/* Welcome Message */}
      <div className="mb-4">
        <h2>Hello, {user?.name?.split(" ")[0] || "Patient"}! 👋</h2>
        <p style={{ color: "#6c757d" }}>
          Here's an overview of your health management
        </p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon primary">
            <FiCalendar />
          </div>
          <div className="stat-content">
            <h4>{dashboardData?.stats?.totalAppointments || 0}</h4>
            <p>Total Appointments</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon secondary">
            <FiFileText />
          </div>
          <div className="stat-content">
            <h4>{dashboardData?.stats?.pendingPrescriptions || 0}</h4>
            <p>Active Prescriptions</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon warning">
            <FiBell />
          </div>
          <div className="stat-content">
            <h4>{dashboardData?.stats?.unreadNotifications || 0}</h4>
            <p>New Notifications</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon danger">
            <FaPills />
          </div>
          <div className="stat-content">
            <h4>{reminders.filter((r) => !r.taken).length}</h4>
            <p>Pending Medicines</p>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Upcoming Appointment */}
        <div className="col-lg-6 mb-4">
          <div className="card h-100">
            <div className="card-header">
              <h3>Upcoming Appointment</h3>
              <Link
                to="/patient/book-appointment"
                className="btn btn-primary btn-sm"
              >
                <FiPlus /> Book New
              </Link>
            </div>
            <div className="card-body">
              {dashboardData?.upcomingAppointment ? (
                <div
                  className="appointment-card"
                  style={{ boxShadow: "none", padding: 0 }}
                >
                  <div className="appointment-date">
                    <span className="day">
                      {formatDate(dashboardData.upcomingAppointment.date).day}
                    </span>
                    <span className="month">
                      {formatDate(dashboardData.upcomingAppointment.date).month}
                    </span>
                  </div>
                  <div className="appointment-info">
                    <h4>{dashboardData.upcomingAppointment.doctorName}</h4>
                    <p>{dashboardData.upcomingAppointment.specialization}</p>
                    <div className="appointment-time">
                      <FiClock />
                      <span>{dashboardData.upcomingAppointment.time}</span>
                    </div>
                  </div>
                  <div className="text-end">
                    <span className="status-badge in-queue">
                      Queue: #{dashboardData.upcomingAppointment.queuePosition}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="empty-state" style={{ padding: "30px" }}>
                  <FiCalendar className="icon" style={{ fontSize: "3rem" }} />
                  <h3>No Upcoming Appointments</h3>
                  <p>Schedule your next appointment now</p>
                  <Link
                    to="/patient/book-appointment"
                    className="btn btn-primary"
                  >
                    Book Appointment
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Queue Status */}
        <div className="col-lg-6 mb-4">
          <div className="card h-100">
            <div className="card-header">
              <h3>Current Queue Status</h3>
              <Link
                to="/patient/queue"
                className="btn btn-outline-primary btn-sm"
              >
                View Details <FiArrowRight />
              </Link>
            </div>
            <div className="card-body">
              {dashboardData?.upcomingAppointment?.queuePosition ? (
                <div className="queue-card" style={{ boxShadow: "none" }}>
                  <div className="queue-number">
                    {dashboardData.upcomingAppointment.queuePosition}
                  </div>
                  <div className="queue-info">
                    <h3>Your Position in Queue</h3>
                    <p>with {dashboardData.upcomingAppointment.doctorName}</p>
                    <div className="queue-time">
                      <FiClock />
                      <span>Est. Wait: ~15 mins</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p style={{ color: "#6c757d" }}>No active queue</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Today's Medicine Reminders */}
        <div className="col-lg-6 mb-4">
          <div className="card h-100">
            <div className="card-header">
              <h3>Today's Medicines</h3>
              <Link
                to="/patient/medicine-reminder"
                className="btn btn-outline-primary btn-sm"
              >
                View All <FiArrowRight />
              </Link>
            </div>
            <div className="card-body">
              {reminders.length > 0 ? (
                <div
                  className="reminder-cards"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  {reminders.slice(0, 3).map((reminder) => (
                    <div
                      key={reminder.id}
                      className={`reminder-card ${reminder.taken ? "taken" : ""}`}
                      style={{ boxShadow: "none", background: "#f8f9fa" }}
                    >
                      <div className="medicine-icon">
                        <FaPills />
                      </div>
                      <div className="medicine-info">
                        <h4>{reminder.name}</h4>
                        <p>
                          {reminder.dosage} • {reminder.time}
                        </p>
                      </div>
                      {reminder.taken ? (
                        <span className="badge badge-success">Taken ✓</span>
                      ) : (
                        <button className="btn btn-primary btn-sm taken-btn">
                          Mark Taken
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p style={{ color: "#6c757d" }}>
                    No medicines scheduled for today
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Prescriptions */}
        <div className="col-lg-6 mb-4">
          <div className="card h-100">
            <div className="card-header">
              <h3>Recent Prescriptions</h3>
              <Link
                to="/patient/prescriptions"
                className="btn btn-outline-primary btn-sm"
              >
                View All <FiArrowRight />
              </Link>
            </div>
            <div className="card-body">
              {dashboardData?.recentPrescriptions?.length > 0 ? (
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Doctor</th>
                        <th>Diagnosis</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData.recentPrescriptions.map((rx) => (
                        <tr key={rx.id}>
                          <td>{rx.doctorName}</td>
                          <td>{rx.diagnosis}</td>
                          <td>{new Date(rx.date).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p style={{ color: "#6c757d" }}>No prescriptions yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
