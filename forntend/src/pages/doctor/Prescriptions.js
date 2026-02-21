import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FiFileText, FiPlus, FiUser, FiCalendar, FiEye } from "react-icons/fi";
import { prescriptionService } from "../../services/dataService";
import { toast } from "react-toastify";

const DoctorPrescriptions = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      // Mock data
      setPrescriptions([
        {
          id: 1,
          patientName: "John Doe",
          patientAge: 35,
          patientGender: "Male",
          diagnosis: "Viral Fever",
          date: "2026-01-30",
          medicines: [
            {
              name: "Paracetamol 500mg",
              dosage: "1 tablet",
              frequency: "Three times a day",
            },
            { name: "Vitamin C", dosage: "1 tablet", frequency: "Once a day" },
          ],
          followUp: "2026-02-05",
        },
        {
          id: 2,
          patientName: "Jane Smith",
          patientAge: 28,
          patientGender: "Female",
          diagnosis: "Migraine",
          date: "2026-01-29",
          medicines: [
            {
              name: "Sumatriptan 50mg",
              dosage: "1 tablet",
              frequency: "As needed",
            },
          ],
          followUp: null,
        },
        {
          id: 3,
          patientName: "Mike Johnson",
          patientAge: 45,
          patientGender: "Male",
          diagnosis: "Hypertension",
          date: "2026-01-28",
          medicines: [
            {
              name: "Amlodipine 5mg",
              dosage: "1 tablet",
              frequency: "Once a day",
            },
            {
              name: "Losartan 50mg",
              dosage: "1 tablet",
              frequency: "Once a day",
            },
          ],
          followUp: "2026-02-28",
        },
        {
          id: 4,
          patientName: "Sarah Williams",
          patientAge: 52,
          patientGender: "Female",
          diagnosis: "Type 2 Diabetes",
          date: "2026-01-25",
          medicines: [
            {
              name: "Metformin 500mg",
              dosage: "1 tablet",
              frequency: "Twice a day",
            },
          ],
          followUp: "2026-02-25",
        },
        {
          id: 5,
          patientName: "David Brown",
          patientAge: 38,
          patientGender: "Male",
          diagnosis: "Allergic Rhinitis",
          date: "2026-01-20",
          medicines: [
            {
              name: "Cetirizine 10mg",
              dosage: "1 tablet",
              frequency: "Once a day",
            },
            {
              name: "Fluticasone Nasal Spray",
              dosage: "2 sprays each nostril",
              frequency: "Twice a day",
            },
          ],
          followUp: null,
        },
      ]);
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
      toast.error("Failed to load prescriptions");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filteredPrescriptions = prescriptions.filter((rx) => {
    const matchesSearch =
      rx.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rx.diagnosis.toLowerCase().includes(searchTerm.toLowerCase());

    if (filter === "all") return matchesSearch;
    if (filter === "with-followup") return matchesSearch && rx.followUp;
    if (filter === "recent") {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return matchesSearch && new Date(rx.date) >= weekAgo;
    }
    return matchesSearch;
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
    <div className="doctor-prescriptions">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div className="d-flex gap-2 flex-wrap">
          <input
            type="text"
            className="form-control"
            placeholder="Search by patient or diagnosis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: "250px" }}
          />
          <select
            className="form-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ width: "150px" }}
          >
            <option value="all">All</option>
            <option value="recent">Last 7 Days</option>
            <option value="with-followup">With Follow-up</option>
          </select>
        </div>
        <Link to="/doctor/prescriptions/create" className="btn btn-primary">
          <FiPlus style={{ marginRight: "5px" }} />
          New Prescription
        </Link>
      </div>

      {/* Prescriptions List */}
      {filteredPrescriptions.length > 0 ? (
        <div className="row">
          {filteredPrescriptions.map((prescription) => (
            <div key={prescription.id} className="col-lg-6 mb-4">
              <div className="prescription-card" style={{ height: "100%" }}>
                <div className="prescription-header">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h5 style={{ margin: 0 }}>{prescription.patientName}</h5>
                      <p
                        style={{ margin: 0, fontSize: "0.85rem", opacity: 0.9 }}
                      >
                        {prescription.patientAge} yrs,{" "}
                        {prescription.patientGender}
                      </p>
                    </div>
                    <div className="text-end">
                      <span style={{ fontSize: "0.85rem", opacity: 0.9 }}>
                        <FiCalendar style={{ marginRight: "5px" }} />
                        {formatDate(prescription.date)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="prescription-body">
                  <div className="mb-3">
                    <h6 style={{ color: "#0cce5d", marginBottom: "10px" }}>
                      Diagnosis
                    </h6>
                    <p style={{ margin: 0 }}>{prescription.diagnosis}</p>
                  </div>

                  <div className="mb-3">
                    <h6 style={{ color: "#0cce5d", marginBottom: "10px" }}>
                      Medicines
                    </h6>
                    {prescription.medicines.slice(0, 2).map((med, idx) => (
                      <div
                        key={idx}
                        style={{
                          background: "#f8f9fa",
                          padding: "10px 12px",
                          borderRadius: "6px",
                          marginBottom: "8px",
                          borderLeft: "3px solid #0cce5d",
                        }}
                      >
                        <p style={{ margin: 0, fontWeight: 500 }}>{med.name}</p>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "0.8rem",
                            color: "#6c757d",
                          }}
                        >
                          {med.dosage} - {med.frequency}
                        </p>
                      </div>
                    ))}
                    {prescription.medicines.length > 2 && (
                      <p
                        style={{
                          margin: 0,
                          fontSize: "0.85rem",
                          color: "#6c757d",
                        }}
                      >
                        +{prescription.medicines.length - 2} more medicines
                      </p>
                    )}
                  </div>

                  {prescription.followUp && (
                    <div
                      style={{
                        background: "#e8faf0",
                        padding: "10px",
                        borderRadius: "6px",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ color: "#6c757d" }}>Follow-up:</span>
                      <span style={{ color: "#0cce5d", fontWeight: 500 }}>
                        {formatDate(prescription.followUp)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="prescription-footer">
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() =>
                      navigate(`/doctor/prescriptions/${prescription.id}`)
                    }
                  >
                    <FiEye style={{ marginRight: "5px" }} />
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card">
          <div className="empty-state">
            <FiFileText className="icon" />
            <h3>No Prescriptions Found</h3>
            <p>
              {searchTerm
                ? "No prescriptions match your search criteria"
                : "You haven't created any prescriptions yet"}
            </p>
            <Link
              to="/doctor/prescriptions/create"
              className="btn btn-primary mt-3"
            >
              <FiPlus style={{ marginRight: "5px" }} />
              Create Prescription
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorPrescriptions;
