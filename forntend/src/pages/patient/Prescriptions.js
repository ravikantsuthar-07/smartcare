import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { FiDownload, FiEye, FiFileText } from "react-icons/fi";
import { prescriptionService } from "../../services/dataService";
import { toast } from "react-toastify";

const Prescriptions = () => {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      // Mock data
      setPrescriptions([
        {
          id: 1,
          doctorName: "Dr. Sarah Johnson",
          specialization: "Cardiologist",
          date: "2026-01-28",
          diagnosis: "Routine Cardiac Checkup",
          notes: "Blood pressure slightly elevated. Monitor regularly.",
          followUpDate: "2026-02-28",
          medicines: [
            {
              name: "Amlodipine",
              dosage: "5mg",
              frequency: "Once daily",
              duration: "30 days",
              timing: ["morning"],
            },
            {
              name: "Aspirin",
              dosage: "75mg",
              frequency: "Once daily",
              duration: "30 days",
              timing: ["afternoon"],
            },
          ],
        },
        {
          id: 2,
          doctorName: "Dr. Mike Brown",
          specialization: "General Physician",
          date: "2026-01-20",
          diagnosis: "Seasonal Flu",
          notes: "Get plenty of rest and stay hydrated.",
          followUpDate: null,
          medicines: [
            {
              name: "Paracetamol",
              dosage: "500mg",
              frequency: "Thrice daily",
              duration: "5 days",
              timing: ["morning", "afternoon", "night"],
            },
            {
              name: "Cetirizine",
              dosage: "10mg",
              frequency: "Once daily",
              duration: "7 days",
              timing: ["night"],
            },
            {
              name: "Vitamin C",
              dosage: "500mg",
              frequency: "Once daily",
              duration: "14 days",
              timing: ["morning"],
            },
          ],
        },
      ]);
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
      toast.error("Failed to load prescriptions");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (prescriptionId) => {
    try {
      toast.info("Downloading prescription...");
      // await prescriptionService.downloadPrescription(prescriptionId);
      toast.success("Prescription downloaded successfully");
    } catch (error) {
      toast.error("Failed to download prescription");
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
    <div className="prescriptions-page">
      <div className="row">
        {/* Prescription List */}
        <div className={`${selectedPrescription ? "col-lg-5" : "col-12"} mb-4`}>
          <div className="card">
            <div className="card-header">
              <h3>My Prescriptions</h3>
            </div>
            <div className="card-body p-0">
              {prescriptions.length > 0 ? (
                <div className="list-group list-group-flush">
                  {prescriptions.map((rx) => (
                    <div
                      key={rx.id}
                      className={`list-group-item list-group-item-action ${selectedPrescription?.id === rx.id ? "active" : ""}`}
                      style={{
                        cursor: "pointer",
                        padding: "20px",
                        background:
                          selectedPrescription?.id === rx.id
                            ? "#e8faf0"
                            : "white",
                        border: "none",
                        borderBottom: "1px solid #e9ecef",
                      }}
                      onClick={() => setSelectedPrescription(rx)}
                    >
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h5
                            style={{
                              fontSize: "1rem",
                              marginBottom: "5px",
                              color: "#1a1a2e",
                            }}
                          >
                            {rx.doctorName}
                          </h5>
                          <p
                            style={{
                              color: "#069494",
                              fontSize: "0.85rem",
                              marginBottom: "5px",
                            }}
                          >
                            {rx.specialization}
                          </p>
                          <p
                            style={{
                              color: "#6c757d",
                              fontSize: "0.8rem",
                              margin: 0,
                            }}
                          >
                            {formatDate(rx.date)}
                          </p>
                        </div>
                        <div className="text-end">
                          <span className="badge badge-primary">
                            {rx.medicines.length} medicines
                          </span>
                        </div>
                      </div>
                      <p
                        style={{
                          fontSize: "0.85rem",
                          color:
                            selectedPrescription?.id === rx.id
                              ? "#1a1a2e"
                              : "#6c757d",
                          marginTop: "10px",
                          marginBottom: 0,
                        }}
                      >
                        <strong>Diagnosis:</strong> {rx.diagnosis}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <FiFileText className="icon" />
                  <h3>No Prescriptions Yet</h3>
                  <p>Your prescriptions will appear here after consultations</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Prescription Detail */}
        {selectedPrescription && (
          <div className="col-lg-7 mb-4">
            <div className="prescription-card">
              <div className="prescription-header">
                <div>
                  <h3>{selectedPrescription.doctorName}</h3>
                  <p
                    style={{
                      color: "rgba(255,255,255,0.7)",
                      margin: 0,
                      fontSize: "0.9rem",
                    }}
                  >
                    {selectedPrescription.specialization}
                  </p>
                </div>
                <span className="rx-symbol">℞</span>
              </div>

              <div className="prescription-body">
                <div className="prescription-info">
                  <div>
                    <p>Patient Name</p>
                    <p>{user?.name}</p>
                  </div>
                  <div>
                    <p>Date</p>
                    <p>{formatDate(selectedPrescription.date)}</p>
                  </div>
                  <div>
                    <p>Diagnosis</p>
                    <p>{selectedPrescription.diagnosis}</p>
                  </div>
                  {selectedPrescription.followUpDate && (
                    <div>
                      <p>Follow-up</p>
                      <p>{formatDate(selectedPrescription.followUpDate)}</p>
                    </div>
                  )}
                </div>

                <div className="medicine-list">
                  <h4>
                    <FiFileText /> Prescribed Medicines
                  </h4>
                  {selectedPrescription.medicines.map((med, index) => (
                    <div key={index} className="medicine-item">
                      <div className="medicine-number">{index + 1}</div>
                      <div className="medicine-details">
                        <h5>{med.name}</h5>
                        <p>
                          {med.dosage} • {med.frequency} • {med.duration}
                        </p>
                        <div className="medicine-timing">
                          {med.timing.map((time) => (
                            <span key={time} className={`timing-badge ${time}`}>
                              {time.charAt(0).toUpperCase() + time.slice(1)}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {selectedPrescription.notes && (
                  <div
                    className="mt-4 p-3 rounded"
                    style={{ background: "#f8f9fa" }}
                  >
                    <h5 style={{ fontSize: "0.9rem", marginBottom: "10px" }}>
                      Doctor's Notes
                    </h5>
                    <p
                      style={{
                        margin: 0,
                        color: "#495057",
                        fontSize: "0.9rem",
                      }}
                    >
                      {selectedPrescription.notes}
                    </p>
                  </div>
                )}

                <button
                  className="btn btn-primary btn-lg w-100 mt-4"
                  onClick={() => handleDownload(selectedPrescription.id)}
                >
                  <FiDownload /> Download PDF
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Prescriptions;
