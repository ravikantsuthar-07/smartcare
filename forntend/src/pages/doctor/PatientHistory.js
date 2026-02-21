import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FiUser,
  FiFileText,
  FiCalendar,
  FiActivity,
  FiClipboard,
} from "react-icons/fi";
import {
  patientService,
  medicalRecordService,
} from "../../services/dataService";
import { toast } from "react-toastify";

const PatientHistory = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get("patient");

  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [history, setHistory] = useState({
    prescriptions: [],
    medicalRecords: [],
    appointments: [],
  });
  const [activeTab, setActiveTab] = useState("prescriptions");

  useEffect(() => {
    if (!patientId) {
      toast.error("Please select a patient first");
      navigate("/doctor/queue");
      return;
    }
    fetchPatientDetails();
  }, [patientId]);

  const fetchPatientDetails = async () => {
    setLoading(true);
    try {
      // Mock data - replace with actual API call
      const patients = [
        {
          id: 101,
          name: "John Doe",
          age: 35,
          gender: "Male",
          phone: "+1234567890",
          bloodGroup: "O+",
        },
        {
          id: 102,
          name: "Jane Smith",
          age: 28,
          gender: "Female",
          phone: "+1234567891",
          bloodGroup: "A+",
        },
        {
          id: 103,
          name: "Mike Johnson",
          age: 45,
          gender: "Male",
          phone: "+1234567892",
          bloodGroup: "B+",
        },
        {
          id: 104,
          name: "Sarah Williams",
          age: 52,
          gender: "Female",
          phone: "+1234567893",
          bloodGroup: "AB+",
        },
        {
          id: 105,
          name: "David Brown",
          age: 38,
          gender: "Male",
          phone: "+1234567894",
          bloodGroup: "B-",
        },
      ];

      const patient = patients.find((p) => p.id === parseInt(patientId));
      if (patient) {
        setSelectedPatient(patient);
        fetchPatientHistory(patientId);
      } else {
        toast.error("Patient not found");
        navigate("/doctor/queue");
      }
    } catch (error) {
      console.error("Error fetching patient:", error);
      toast.error("Failed to load patient details");
      navigate("/doctor/queue");
    } finally {
      setLoading(false);
    }
  };

  const fetchPatientHistory = async (id) => {
    try {
      // Mock data
      setHistory({
        prescriptions: [
          {
            id: 1,
            date: "2026-01-30",
            diagnosis: "Viral Fever",
            medicines: ["Paracetamol 500mg", "Vitamin C"],
            followUp: "2026-02-05",
          },
          {
            id: 2,
            date: "2025-12-15",
            diagnosis: "Common Cold",
            medicines: ["Cetirizine 10mg", "Cough Syrup"],
            followUp: null,
          },
          {
            id: 3,
            date: "2025-10-20",
            diagnosis: "General Checkup",
            medicines: ["Multivitamins"],
            followUp: "2026-04-20",
          },
        ],
        medicalRecords: [
          {
            id: 1,
            title: "Blood Test Report",
            date: "2026-01-28",
            type: "Lab Report",
            description: "Complete blood count - All values normal",
          },
          {
            id: 2,
            title: "X-Ray Chest",
            date: "2025-11-10",
            type: "Imaging",
            description: "No abnormalities detected",
          },
        ],
        appointments: [
          {
            id: 1,
            date: "2026-01-30",
            time: "10:00 AM",
            reason: "Follow-up",
            status: "completed",
          },
          {
            id: 2,
            date: "2025-12-15",
            time: "11:30 AM",
            reason: "Cold & Cough",
            status: "completed",
          },
          {
            id: 3,
            date: "2025-10-20",
            time: "09:00 AM",
            reason: "General Checkup",
            status: "completed",
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching patient history:", error);
      toast.error("Failed to load patient history");
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading patient history...</p>
      </div>
    );
  }

  return (
    <div className="patient-history">
      {/* Patient Information */}
      <div className="card mb-4">
        <div className="card-body">
          {selectedPatient && (
            <div
              style={{
                background: "linear-gradient(135deg, #0cce5d, #069494)",
                color: "white",
                padding: "20px",
                borderRadius: "10px",
              }}
            >
              <div className="d-flex align-items-center gap-3">
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    background: "rgba(255,255,255,0.2)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FiUser size={28} />
                </div>
                <div>
                  <h4 style={{ margin: 0 }}>{selectedPatient.name}</h4>
                  <p
                    style={{ margin: "5px 0 0 0", fontSize: "0.95rem", opacity: 0.9 }}
                  >
                    {selectedPatient.age} years, {selectedPatient.gender} | Blood Group: {selectedPatient.bloodGroup} | Phone: {selectedPatient.phone}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="card mb-4">
        <div className="card-body py-2">
          <div className="d-flex gap-2 flex-wrap">
            {[
              {
                key: "prescriptions",
                label: "Prescriptions",
                icon: FiFileText,
              },
              {
                key: "records",
                label: "Medical Records",
                icon: FiClipboard,
              },
              {
                key: "appointments",
                label: "Appointment History",
                icon: FiCalendar,
              },
            ].map((tab) => (
              <button
                key={tab.key}
                    className={`btn ${activeTab === tab.key ? "btn-primary" : "btn-light"}`}
                    onClick={() => setActiveTab(tab.key)}
                  >
                    <tab.icon style={{ marginRight: "5px" }} />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === "prescriptions" && (
            <div className="card">
              <div className="card-body">
                <h5 className="mb-3">Prescription History</h5>
                {history.prescriptions.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Diagnosis</th>
                          <th>Medicines</th>
                          <th>Follow-up</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {history.prescriptions.map((rx) => (
                          <tr key={rx.id}>
                            <td>{formatDate(rx.date)}</td>
                            <td>{rx.diagnosis}</td>
                            <td>
                              {rx.medicines.slice(0, 2).join(", ")}
                              {rx.medicines.length > 2 &&
                                ` +${rx.medicines.length - 2} more`}
                            </td>
                            <td>
                              {rx.followUp ? (
                                <span style={{ color: "#0cce5d" }}>
                                  {formatDate(rx.followUp)}
                                </span>
                              ) : (
                                "-"
                              )}
                            </td>
                            <td>
                              <button className="btn btn-outline-primary btn-sm">
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-muted">
                    No prescriptions found for this patient
                  </p>
                )}
              </div>
            </div>
          )}

          {activeTab === "records" && (
            <div className="card">
              <div className="card-body">
                <h5 className="mb-3">Medical Records</h5>
                {history.medicalRecords.length > 0 ? (
                  <div className="row">
                    {history.medicalRecords.map((record) => (
                      <div key={record.id} className="col-md-6 mb-3">
                        <div
                          className="medical-record-card"
                          style={{
                            border: "1px solid #e9ecef",
                            borderRadius: "10px",
                            padding: "15px",
                            background: "#f8f9fa",
                          }}
                        >
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <h6 style={{ margin: 0, color: "#0cce5d" }}>
                              {record.title}
                            </h6>
                            <span className="badge bg-secondary">
                              {record.type}
                            </span>
                          </div>
                          <p
                            style={{
                              margin: 0,
                              fontSize: "0.85rem",
                              color: "#6c757d",
                            }}
                          >
                            <FiCalendar style={{ marginRight: "5px" }} />
                            {formatDate(record.date)}
                          </p>
                          <p style={{ margin: "10px 0 0", fontSize: "0.9rem" }}>
                            {record.description}
                          </p>
                          <button className="btn btn-outline-primary btn-sm mt-2">
                            View Document
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted">
                    No medical records found for this patient
                  </p>
                )}
              </div>
            </div>
          )}

          {activeTab === "appointments" && (
            <div className="card">
              <div className="card-body">
                <h5 className="mb-3">Appointment History</h5>
                {history.appointments.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Time</th>
                          <th>Reason</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {history.appointments.map((apt) => (
                          <tr key={apt.id}>
                            <td>{formatDate(apt.date)}</td>
                            <td>{apt.time}</td>
                            <td>{apt.reason}</td>
                            <td>
                              <span className={`status-badge ${apt.status}`}>
                                {apt.status.charAt(0).toUpperCase() +
                                  apt.status.slice(1)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-muted">
                    No appointments found for this patient
                  </p>
                )}
              </div>
            </div>
          )}
    </div>
  );
};

export default PatientHistory;
