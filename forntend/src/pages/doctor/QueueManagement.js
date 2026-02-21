import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FiUser,
  FiPhone,
  FiFileText,
  FiCheck,
  FiArrowRight,
  FiClock,
} from "react-icons/fi";
import { queueService } from "../../services/dataService";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const QueueManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPatient, setCurrentPatient] = useState(null);

  useEffect(() => {
    fetchQueue();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchQueue, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchQueue = async () => {
    try {
      // Mock data
      const mockQueue = [
        {
          id: 1,
          position: 1,
          patientId: 101,
          patientName: "John Doe",
          age: 35,
          gender: "Male",
          phone: "+1234567890",
          time: "10:00 AM",
          appointmentId: 1001,
          reason: "Chest pain",
          status: "current",
        },
        {
          id: 2,
          position: 2,
          patientId: 102,
          patientName: "Jane Smith",
          age: 28,
          gender: "Female",
          phone: "+1234567891",
          time: "10:30 AM",
          appointmentId: 1002,
          reason: "Follow-up",
          status: "waiting",
        },
        {
          id: 3,
          position: 3,
          patientId: 103,
          patientName: "Mike Johnson",
          age: 45,
          gender: "Male",
          phone: "+1234567892",
          time: "11:00 AM",
          appointmentId: 1003,
          reason: "General checkup",
          status: "waiting",
        },
        {
          id: 4,
          position: 4,
          patientId: 104,
          patientName: "Sarah Williams",
          age: 52,
          gender: "Female",
          phone: "+1234567893",
          time: "11:30 AM",
          appointmentId: 1004,
          reason: "Blood pressure",
          status: "waiting",
        },
        {
          id: 5,
          position: 5,
          patientId: 105,
          patientName: "David Brown",
          age: 38,
          gender: "Male",
          phone: "+1234567894",
          time: "12:00 PM",
          appointmentId: 1005,
          reason: "Headache",
          status: "waiting",
        },
      ];

      setQueue(mockQueue);
      setCurrentPatient(mockQueue.find((p) => p.status === "current") || null);
    } catch (error) {
      console.error("Error fetching queue:", error);
      toast.error("Failed to load queue");
    } finally {
      setLoading(false);
    }
  };

  const handleCallNext = async () => {
    const nextPatient = queue.find((p) => p.status === "waiting");
    if (!nextPatient) {
      toast.info("No more patients in queue");
      return;
    }

    const result = await Swal.fire({
      title: "Call Next Patient?",
      html: `<p>Call <strong>${nextPatient.patientName}</strong> for consultation?</p>`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#0cce5d",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, call patient",
    });

    if (result.isConfirmed) {
      setQueue((prev) =>
        prev.map((p) => ({
          ...p,
          status:
            p.id === nextPatient.id
              ? "current"
              : p.status === "current"
                ? "completed"
                : p.status,
        })),
      );
      setCurrentPatient(nextPatient);
      toast.success(`Calling ${nextPatient.patientName}`);
    }
  };

  const handleCompleteConsultation = async () => {
    if (!currentPatient) return;

    const result = await Swal.fire({
      title: "Complete Consultation?",
      html: `
        <p>Mark consultation with <strong>${currentPatient.patientName}</strong> as complete?</p>
        <p class="text-muted">You can create a prescription before completing.</p>
      `,
      icon: "question",
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonColor: "#0cce5d",
      denyButtonColor: "#069494",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Complete",
      denyButtonText: "Create Prescription First",
    });

    if (result.isConfirmed) {
      setQueue((prev) => prev.filter((p) => p.id !== currentPatient.id));
      const nextPatient = queue.find((p) => p.status === "waiting");
      setCurrentPatient(nextPatient || null);
      if (nextPatient) {
        setQueue((prev) =>
          prev.map((p) => ({
            ...p,
            status: p.id === nextPatient.id ? "current" : p.status,
          })),
        );
      }
      toast.success("Consultation completed!");
    } else if (result.isDenied) {
      navigate(`/doctor/create-prescription?patient=${currentPatient.patientId}`);
    }
  };

  const handleViewHistory = (patientId) => {
    navigate(`/doctor/patient-history?patient=${patientId}`);
  };

  const handleCreatePrescription = (patientId) => {
    navigate(`/doctor/create-prescription?patient=${patientId}`);
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

  const waitingPatients = queue.filter((p) => p.status === "waiting");

  return (
    <div className="queue-management">
      {/* Current Patient Card */}
      {currentPatient && (
        <div
          className="card mb-4"
          style={{
            background: "linear-gradient(135deg, #0cce5d, #0ab350)",
            color: "white",
          }}
        >
          <div className="card-body">
            <div className="row align-items-center">
              <div className="col-md-8">
                <span
                  style={{
                    padding: "4px 12px",
                    background: "rgba(255,255,255,0.2)",
                    borderRadius: "20px",
                    fontSize: "0.8rem",
                    marginBottom: "15px",
                    display: "inline-block",
                  }}
                >
                  Currently Consulting
                </span>
                <h2 style={{ color: "white", marginBottom: "5px" }}>
                  {currentPatient.patientName}
                </h2>
                <p style={{ opacity: 0.9, marginBottom: "10px" }}>
                  {currentPatient.age} years, {currentPatient.gender} •{" "}
                  {currentPatient.reason}
                </p>
                <div className="d-flex gap-3">
                  <span>
                    <FiPhone style={{ marginRight: "5px" }} />
                    {currentPatient.phone}
                  </span>
                  <span>
                    <FiClock style={{ marginRight: "5px" }} />
                    {currentPatient.time}
                  </span>
                </div>
              </div>
              <div className="col-md-4 text-md-end mt-3 mt-md-0">
                <div className="d-flex flex-column gap-2">
                  <button
                    className="btn btn-light"
                    onClick={() =>
                      handleCreatePrescription(currentPatient.patientId)
                    }
                  >
                    <FiFileText /> Create Prescription
                  </button>
                  <button
                    className="btn btn-outline-light"
                    onClick={() => handleViewHistory(currentPatient.patientId)}
                  >
                    <FiUser /> View History
                  </button>
                  <button
                    className="btn btn-dark"
                    onClick={handleCompleteConsultation}
                  >
                    <FiCheck /> Complete ✓
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Queue Actions */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Patient Queue</h2>
          <p style={{ color: "#6c757d", margin: 0 }}>
            {waitingPatients.length} patients waiting
          </p>
        </div>
        <button
          className="btn btn-primary btn-lg"
          onClick={handleCallNext}
          disabled={waitingPatients.length === 0}
        >
          Call Next Patient <FiArrowRight />
        </button>
      </div>

      {/* Waiting Queue */}
      {waitingPatients.length > 0 ? (
        <div className="queue-list">
          {waitingPatients.map((patient) => (
            <div key={patient.id} className="queue-item">
              <div className="queue-position">{patient.position}</div>
              <div className="queue-patient">
                <h4>{patient.patientName}</h4>
                <p>
                  {patient.age} yrs, {patient.gender} • {patient.time}
                </p>
                <p style={{ fontSize: "0.8rem", color: "#069494" }}>
                  {patient.reason}
                </p>
              </div>
              <div className="queue-actions">
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => handleViewHistory(patient.patientId)}
                  title="View History"
                >
                  <FiUser />
                </button>
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() =>
                    handleCreatePrescription(patient.patientId)
                  }
                  title="Create Prescription"
                >
                  <FiFileText />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card">
          <div className="empty-state">
            <FiClock className="icon" />
            <h3>Queue is Empty</h3>
            <p>No more patients waiting in the queue</p>
          </div>
        </div>
      )}

      {/* Queue Stats */}
      <div className="card mt-4">
        <div className="card-body">
          <div className="row text-center">
            <div className="col-4">
              <h3 style={{ color: "#0cce5d", marginBottom: "5px" }}>
                {queue.filter((p) => p.status === "completed").length}
              </h3>
              <p style={{ color: "#6c757d", margin: 0, fontSize: "0.9rem" }}>
                Completed
              </p>
            </div>
            <div className="col-4">
              <h3 style={{ color: "#f57c00", marginBottom: "5px" }}>
                {currentPatient ? 1 : 0}
              </h3>
              <p style={{ color: "#6c757d", margin: 0, fontSize: "0.9rem" }}>
                In Progress
              </p>
            </div>
            <div className="col-4">
              <h3 style={{ color: "#069494", marginBottom: "5px" }}>
                {waitingPatients.length}
              </h3>
              <p style={{ color: "#6c757d", margin: 0, fontSize: "0.9rem" }}>
                Waiting
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueueManagement;
