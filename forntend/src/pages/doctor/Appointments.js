import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { FiCalendar, FiClock, FiUser, FiCheck, FiX } from "react-icons/fi";
import { appointmentService } from "../../services/dataService";
import { toast } from "react-toastify";

const DoctorAppointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("today");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    fetchAppointments();
  }, [filter, date]);

  const fetchAppointments = async () => {
    try {
      // Mock data
      setAppointments([
        {
          id: 1,
          patientName: "John Doe",
          age: 35,
          gender: "Male",
          date: "2026-01-30",
          time: "10:00 AM",
          reason: "Chest pain",
          status: "completed",
        },
        {
          id: 2,
          patientName: "Jane Smith",
          age: 28,
          gender: "Female",
          date: "2026-01-30",
          time: "10:30 AM",
          reason: "Follow-up",
          status: "in-progress",
        },
        {
          id: 3,
          patientName: "Mike Johnson",
          age: 45,
          gender: "Male",
          date: "2026-01-30",
          time: "11:00 AM",
          reason: "General checkup",
          status: "pending",
        },
        {
          id: 4,
          patientName: "Sarah Williams",
          age: 52,
          gender: "Female",
          date: "2026-01-30",
          time: "11:30 AM",
          reason: "Blood pressure",
          status: "pending",
        },
        {
          id: 5,
          patientName: "David Brown",
          age: 38,
          gender: "Male",
          date: "2026-01-30",
          time: "12:00 PM",
          reason: "Headache",
          status: "pending",
        },
        {
          id: 6,
          patientName: "Emily Davis",
          age: 42,
          gender: "Female",
          date: "2026-01-31",
          time: "09:00 AM",
          reason: "Diabetes review",
          status: "pending",
        },
        {
          id: 7,
          patientName: "Robert Wilson",
          age: 55,
          gender: "Male",
          date: "2026-01-31",
          time: "09:30 AM",
          reason: "Heart checkup",
          status: "pending",
        },
      ]);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return {
      day: date.getDate(),
      month: date.toLocaleString("default", { month: "short" }),
      full: date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };
  };

  const filteredAppointments = appointments.filter((apt) => {
    const today = new Date().toISOString().split("T")[0];
    if (filter === "today") return apt.date === today;
    if (filter === "upcoming") return apt.date > today;
    if (filter === "past") return apt.date < today;
    if (filter === "date") return apt.date === date;
    return true;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "completed";
      case "in-progress":
        return "confirmed";
      case "pending":
        return "pending";
      case "cancelled":
        return "cancelled";
      default:
        return "pending";
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
    <div className="doctor-appointments">
      {/* Filters */}
      <div className="card mb-4">
        <div className="card-body py-3">
          <div className="row align-items-center">
            <div className="col-md-8">
              <div className="d-flex gap-2 flex-wrap">
                {[
                  { key: "today", label: "Today" },
                  { key: "upcoming", label: "Upcoming" },
                  { key: "past", label: "Past" },
                  { key: "all", label: "All" },
                  { key: "date", label: "By Date" },
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
            </div>
            {filter === "date" && (
              <div className="col-md-4 mt-3 mt-md-0">
                <input
                  type="date"
                  className="form-control"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Appointments Summary */}
      <div className="row mb-4">
        <div className="col-md-3 col-6 mb-3">
          <div className="card text-center">
            <div className="card-body py-3">
              <h3 style={{ color: "#0cce5d", marginBottom: "5px" }}>
                {appointments.filter((a) => a.status === "completed").length}
              </h3>
              <p style={{ color: "#6c757d", margin: 0, fontSize: "0.85rem" }}>
                Completed
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-6 mb-3">
          <div className="card text-center">
            <div className="card-body py-3">
              <h3 style={{ color: "#069494", marginBottom: "5px" }}>
                {appointments.filter((a) => a.status === "in-progress").length}
              </h3>
              <p style={{ color: "#6c757d", margin: 0, fontSize: "0.85rem" }}>
                In Progress
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-6 mb-3">
          <div className="card text-center">
            <div className="card-body py-3">
              <h3 style={{ color: "#f57c00", marginBottom: "5px" }}>
                {appointments.filter((a) => a.status === "pending").length}
              </h3>
              <p style={{ color: "#6c757d", margin: 0, fontSize: "0.85rem" }}>
                Pending
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-6 mb-3">
          <div className="card text-center">
            <div className="card-body py-3">
              <h3 style={{ color: "#dc3545", marginBottom: "5px" }}>
                {appointments.filter((a) => a.status === "cancelled").length}
              </h3>
              <p style={{ color: "#6c757d", margin: 0, fontSize: "0.85rem" }}>
                Cancelled
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Appointments Table */}
      {filteredAppointments.length > 0 ? (
        <div className="card">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table mb-0">
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Reason</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.map((appointment) => (
                    <tr key={appointment.id}>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <div
                            style={{
                              width: "40px",
                              height: "40px",
                              background: "#e8faf0",
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#0cce5d",
                            }}
                          >
                            <FiUser />
                          </div>
                          <div>
                            <p style={{ margin: 0, fontWeight: 500 }}>
                              {appointment.patientName}
                            </p>
                            <p
                              style={{
                                margin: 0,
                                fontSize: "0.8rem",
                                color: "#6c757d",
                              }}
                            >
                              {appointment.age} yrs, {appointment.gender}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td>{formatDate(appointment.date).full}</td>
                      <td>
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          <FiClock /> {appointment.time}
                        </span>
                      </td>
                      <td>{appointment.reason}</td>
                      <td>
                        <span
                          className={`status-badge ${getStatusColor(appointment.status)}`}
                        >
                          {appointment.status === "in-progress"
                            ? "In Progress"
                            : appointment.status.charAt(0).toUpperCase() +
                              appointment.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="empty-state">
            <FiCalendar className="icon" />
            <h3>No Appointments Found</h3>
            <p>No appointments match the selected filter</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorAppointments;
