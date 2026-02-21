import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FiUsers,
  FiCalendar,
  FiClock,
  FiFileText,
  FiArrowRight,
  FiCheckCircle,
} from "react-icons/fi";
import { dashboardService, queueService } from "../../services/dataService";

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Mock data
      setDashboardData({
        stats: {
          todayAppointments: 12,
          pendingConsultations: 5,
          completedToday: 7,
          totalPatients: 156,
        },
        currentQueue: [
          {
            id: 1,
            position: 1,
            patientName: "John Doe",
            age: 35,
            gender: "Male",
            time: "10:00 AM",
            status: "current",
          },
          {
            id: 2,
            position: 2,
            patientName: "Jane Smith",
            age: 28,
            gender: "Female",
            time: "10:30 AM",
            status: "waiting",
          },
          {
            id: 3,
            position: 3,
            patientName: "Mike Johnson",
            age: 45,
            gender: "Male",
            time: "11:00 AM",
            status: "waiting",
          },
        ],
        todaySchedule: [
          {
            id: 1,
            patientName: "John Doe",
            time: "10:00 AM",
            type: "Consultation",
            status: "in-progress",
          },
          {
            id: 2,
            patientName: "Jane Smith",
            time: "10:30 AM",
            type: "Follow-up",
            status: "pending",
          },
          {
            id: 3,
            patientName: "Mike Johnson",
            time: "11:00 AM",
            type: "Consultation",
            status: "pending",
          },
          {
            id: 4,
            patientName: "Sarah Williams",
            time: "11:30 AM",
            type: "Check-up",
            status: "pending",
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
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
    <div className="doctor-dashboard">
      {/* Welcome Message */}
      <div className="mb-4">
        <h2>Good Morning, Dr. {user?.name?.split(" ")[1] || "Doctor"}! 👋</h2>
        <p style={{ color: "#6c757d" }}>
          Here's your practice overview for today
        </p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon primary">
            <FiCalendar />
          </div>
          <div className="stat-content">
            <h4>{dashboardData?.stats?.todayAppointments || 0}</h4>
            <p>Today's Appointments</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon warning">
            <FiClock />
          </div>
          <div className="stat-content">
            <h4>{dashboardData?.stats?.pendingConsultations || 0}</h4>
            <p>Pending Consultations</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon secondary">
            <FiCheckCircle />
          </div>
          <div className="stat-content">
            <h4>{dashboardData?.stats?.completedToday || 0}</h4>
            <p>Completed Today</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon danger">
            <FiUsers />
          </div>
          <div className="stat-content">
            <h4>{dashboardData?.stats?.totalPatients || 0}</h4>
            <p>Total Patients</p>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Current Queue */}
        <div className="col-lg-6 mb-4">
          <div className="card h-100">
            <div className="card-header">
              <h3>Current Queue</h3>
              <Link
                to="/doctor/queue"
                className="btn btn-outline-primary btn-sm"
              >
                View All <FiArrowRight />
              </Link>
            </div>
            <div className="card-body p-0">
              {dashboardData?.currentQueue?.length > 0 ? (
                <div className="queue-list" style={{ padding: "15px" }}>
                  {dashboardData.currentQueue.map((patient) => (
                    <div
                      key={patient.id}
                      className="queue-item"
                      style={{
                        boxShadow: "none",
                        background:
                          patient.status === "current" ? "#e8faf0" : "#f8f9fa",
                        marginBottom: "10px",
                      }}
                    >
                      <div
                        className={`queue-position ${patient.status === "current" ? "current" : ""}`}
                      >
                        {patient.position}
                      </div>
                      <div className="queue-patient">
                        <h4>{patient.patientName}</h4>
                        <p>
                          {patient.age} yrs, {patient.gender} • {patient.time}
                        </p>
                      </div>
                      {patient.status === "current" && (
                        <span className="status-badge confirmed">Current</span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p style={{ color: "#6c757d" }}>No patients in queue</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="col-lg-6 mb-4">
          <div className="card h-100">
            <div className="card-header">
              <h3>Today's Schedule</h3>
              <Link
                to="/doctor/appointments"
                className="btn btn-outline-primary btn-sm"
              >
                View All <FiArrowRight />
              </Link>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table mb-0">
                  <thead>
                    <tr>
                      <th>Patient</th>
                      <th>Time</th>
                      <th>Type</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData?.todaySchedule?.map((appointment) => (
                      <tr key={appointment.id}>
                        <td>{appointment.patientName}</td>
                        <td>{appointment.time}</td>
                        <td>{appointment.type}</td>
                        <td>
                          <span
                            className={`status-badge ${appointment.status === "in-progress" ? "confirmed" : "pending"}`}
                          >
                            {appointment.status === "in-progress"
                              ? "In Progress"
                              : "Pending"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="card-header">
          <h3>Quick Actions</h3>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-3 col-6 mb-3">
              <Link to="/doctor/queue" className="btn btn-primary w-100 py-3">
                <FiUsers style={{ marginRight: "8px" }} />
                Manage Queue
              </Link>
            </div>
            <div className="col-md-3 col-6 mb-3">
              <Link
                to="/doctor/prescriptions"
                className="btn btn-secondary w-100 py-3"
              >
                <FiFileText style={{ marginRight: "8px" }} />
                Prescriptions
              </Link>
            </div>
            <div className="col-md-3 col-6 mb-3">
              <Link
                to="/doctor/appointments"
                className="btn btn-outline-primary w-100 py-3"
              >
                <FiCalendar style={{ marginRight: "8px" }} />
                Appointments
              </Link>
            </div>
            <div className="col-md-3 col-6 mb-3">
              <Link
                to="/doctor/notifications"
                className="btn btn-outline-secondary w-100 py-3"
              >
                <FiClock style={{ marginRight: "8px" }} />
                Notifications
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
