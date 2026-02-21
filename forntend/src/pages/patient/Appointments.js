import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FiCalendar, FiClock, FiPlus, FiX, FiRefreshCw } from "react-icons/fi";
import { appointmentService } from "../../services/dataService";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const Appointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      // Mock data
      setAppointments([
        {
          id: 1,
          doctorName: "Dr. Sarah Johnson",
          specialization: "Cardiologist",
          date: "2026-02-05",
          time: "10:30 AM",
          status: "confirmed",
        },
        {
          id: 2,
          doctorName: "Dr. Mike Brown",
          specialization: "General Physician",
          date: "2026-02-10",
          time: "02:00 PM",
          status: "pending",
        },
        {
          id: 3,
          doctorName: "Dr. Emily Davis",
          specialization: "Dermatologist",
          date: "2026-01-20",
          time: "11:00 AM",
          status: "completed",
        },
        {
          id: 4,
          doctorName: "Dr. John Smith",
          specialization: "Orthopedic",
          date: "2026-01-15",
          time: "09:30 AM",
          status: "cancelled",
        },
      ]);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (appointmentId) => {
    const result = await Swal.fire({
      title: "Cancel Appointment?",
      text: "Are you sure you want to cancel this appointment?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, Cancel it",
    });

    if (result.isConfirmed) {
      try {
        // await appointmentService.cancelAppointment(appointmentId);
        setAppointments((prev) =>
          prev.map((apt) =>
            apt.id === appointmentId ? { ...apt, status: "cancelled" } : apt,
          ),
        );
        toast.success("Appointment cancelled successfully");
      } catch (error) {
        toast.error("Failed to cancel appointment");
      }
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
    if (filter === "all") return true;
    if (filter === "upcoming")
      return ["confirmed", "pending"].includes(apt.status);
    if (filter === "past")
      return ["completed", "cancelled"].includes(apt.status);
    return apt.status === filter;
  });

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
    <div className="appointments-page">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>My Appointments</h2>
          <p style={{ color: "#6c757d", margin: 0 }}>
            Manage your upcoming and past appointments
          </p>
        </div>
        <Link to="/patient/book-appointment" className="btn btn-primary">
          <FiPlus /> Book Appointment
        </Link>
      </div>

      {/* Filters */}
      <div className="card mb-4">
        <div className="card-body py-3">
          <div className="d-flex gap-2 flex-wrap">
            {[
              { key: "all", label: "All" },
              { key: "upcoming", label: "Upcoming" },
              { key: "pending", label: "Pending" },
              { key: "confirmed", label: "Confirmed" },
              { key: "completed", label: "Completed" },
              { key: "cancelled", label: "Cancelled" },
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
      </div>

      {/* Appointments List */}
      {filteredAppointments.length > 0 ? (
        <div className="appointment-list">
          {filteredAppointments.map((appointment) => (
            <div key={appointment.id} className="appointment-card">
              <div className="appointment-date">
                <span className="day">{formatDate(appointment.date).day}</span>
                <span className="month">
                  {formatDate(appointment.date).month}
                </span>
              </div>
              <div className="appointment-info">
                <h4>{appointment.doctorName}</h4>
                <p>{appointment.specialization}</p>
                <div className="appointment-time">
                  <FiClock />
                  <span>{appointment.time}</span>
                </div>
              </div>
              <div className="d-flex align-items-center gap-3">
                <span className={`status-badge ${appointment.status}`}>
                  {appointment.status.charAt(0).toUpperCase() +
                    appointment.status.slice(1)}
                </span>
                {["confirmed", "pending"].includes(appointment.status) && (
                  <div className="appointment-actions">
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      title="Reschedule"
                    >
                      <FiRefreshCw />
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      title="Cancel"
                      onClick={() => handleCancel(appointment.id)}
                    >
                      <FiX />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card">
          <div className="empty-state">
            <FiCalendar className="icon" />
            <h3>No Appointments Found</h3>
            <p>You don't have any appointments matching this filter</p>
            <Link to="/patient/book-appointment" className="btn btn-primary">
              Book Your First Appointment
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
