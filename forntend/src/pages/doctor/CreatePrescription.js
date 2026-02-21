import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FiPlus, FiTrash2, FiSave, FiUser, FiFileText } from "react-icons/fi";
import {
  prescriptionService,
  patientService,
} from "../../services/dataService";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const CreatePrescription = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get("patient");

  const [loading, setLoading] = useState(false);
  const [loadingPatient, setLoadingPatient] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const [prescription, setPrescription] = useState({
    patientId: patientId || "",
    diagnosis: "",
    notes: "",
    followUpDate: "",
    medicines: [
      { name: "", dosage: "", frequency: "", duration: "", instructions: "" },
    ],
  });

  useEffect(() => {
    if (!patientId) {
      toast.error("Please select a patient first");
      navigate("/doctor/queue");
      return;
    }
    fetchPatientDetails();
  }, [patientId]);

  const fetchPatientDetails = async () => {
    setLoadingPatient(true);
    try {
      // Mock data - replace with actual API call
      const patients = [
        {
          id: 101,
          name: "John Doe",
          age: 35,
          gender: "Male",
          phone: "+1234567890",
        },
        {
          id: 102,
          name: "Jane Smith",
          age: 28,
          gender: "Female",
          phone: "+1234567891",
        },
        {
          id: 103,
          name: "Mike Johnson",
          age: 45,
          gender: "Male",
          phone: "+1234567892",
        },
        {
          id: 104,
          name: "Sarah Williams",
          age: 52,
          gender: "Female",
          phone: "+1234567893",
        },
        {
          id: 105,
          name: "David Brown",
          age: 38,
          gender: "Male",
          phone: "+1234567894",
        },
      ];
      
      const patient = patients.find((p) => p.id === parseInt(patientId));
      if (patient) {
        setSelectedPatient(patient);
        setPrescription((prev) => ({ ...prev, patientId: patient.id.toString() }));
      } else {
        toast.error("Patient not found");
        navigate("/doctor/queue");
      }
    } catch (error) {
      console.error("Error fetching patient:", error);
      toast.error("Failed to load patient details");
      navigate("/doctor/queue");
    } finally {
      setLoadingPatient(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPrescription((prev) => ({ ...prev, [name]: value }));
  };

  const handleMedicineChange = (index, field, value) => {
    const updatedMedicines = [...prescription.medicines];
    updatedMedicines[index][field] = value;
    setPrescription((prev) => ({ ...prev, medicines: updatedMedicines }));
  };

  const addMedicine = () => {
    setPrescription((prev) => ({
      ...prev,
      medicines: [
        ...prev.medicines,
        { name: "", dosage: "", frequency: "", duration: "", instructions: "" },
      ],
    }));
  };

  const removeMedicine = (index) => {
    if (prescription.medicines.length === 1) {
      toast.warning("At least one medicine is required");
      return;
    }
    const updatedMedicines = prescription.medicines.filter(
      (_, i) => i !== index,
    );
    setPrescription((prev) => ({ ...prev, medicines: updatedMedicines }));
  };

  const validateForm = () => {
    if (!prescription.patientId) {
      toast.error("Please select a patient");
      return false;
    }
    if (!prescription.diagnosis.trim()) {
      toast.error("Please enter diagnosis");
      return false;
    }
    for (let i = 0; i < prescription.medicines.length; i++) {
      const med = prescription.medicines[i];
      if (
        !med.name.trim() ||
        !med.dosage.trim() ||
        !med.frequency.trim() ||
        !med.duration.trim()
      ) {
        toast.error(`Please fill all required fields for medicine ${i + 1}`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const result = await Swal.fire({
      title: "Create Prescription",
      text: `Are you sure you want to create this prescription for ${selectedPatient?.name}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#0cce5d",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, create it!",
    });

    if (result.isConfirmed) {
      setLoading(true);
      try {
        // await prescriptionService.create(prescription);
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

        toast.success("Prescription created successfully");
        navigate("/doctor/prescriptions");
      } catch (error) {
        console.error("Error creating prescription:", error);
        toast.error("Failed to create prescription");
      } finally {
        setLoading(false);
      }
    }
  };

  const frequencyOptions = [
    "Once a day",
    "Twice a day",
    "Three times a day",
    "Four times a day",
    "Every 4 hours",
    "Every 6 hours",
    "Every 8 hours",
    "Before meals",
    "After meals",
    "At bedtime",
    "As needed",
  ];

  const durationOptions = [
    "3 days",
    "5 days",
    "7 days",
    "10 days",
    "14 days",
    "21 days",
    "1 month",
    "2 months",
    "3 months",
    "Continuous",
  ];

  return (
    <div className="create-prescription">
      {loadingPatient ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading patient details...</p>
        </div>
      ) : (
      <form onSubmit={handleSubmit}>
        {/* Patient Information */}
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="mb-3">
              <FiUser style={{ marginRight: "10px", color: "#0cce5d" }} />
              Patient Information
            </h5>
            {selectedPatient && (
              <div
                style={{
                  background: "#e8faf0",
                  padding: "20px",
                  borderRadius: "8px",
                  borderLeft: "4px solid #0cce5d",
                }}
              >
                <p style={{ margin: 0, fontWeight: 600, fontSize: "1.1rem" }}>
                  {selectedPatient.name}
                </p>
                <p
                  style={{
                    margin: "5px 0 0 0",
                    fontSize: "0.9rem",
                    color: "#6c757d",
                  }}
                >
                  {selectedPatient.age} years, {selectedPatient.gender} | Phone: {selectedPatient.phone}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Diagnosis */}
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="mb-3">
              <FiFileText style={{ marginRight: "10px", color: "#0cce5d" }} />
              Diagnosis & Notes
            </h5>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Diagnosis *</label>
                <input
                  type="text"
                  className="form-control"
                  name="diagnosis"
                  value={prescription.diagnosis}
                  onChange={handleInputChange}
                  placeholder="Enter diagnosis"
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Follow-up Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="followUpDate"
                  value={prescription.followUpDate}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
              <div className="col-12 mb-3">
                <label className="form-label">Notes / Instructions</label>
                <textarea
                  className="form-control"
                  name="notes"
                  value={prescription.notes}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Additional notes or instructions for the patient"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        {/* Medicines */}
        <div className="card mb-4">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">Medicines</h5>
              <button
                type="button"
                className="btn btn-outline-primary btn-sm"
                onClick={addMedicine}
              >
                <FiPlus /> Add Medicine
              </button>
            </div>

            {prescription.medicines.map((medicine, index) => (
              <div
                key={index}
                style={{
                  background: "#f8f9fa",
                  padding: "20px",
                  borderRadius: "8px",
                  marginBottom: "15px",
                }}
              >
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 style={{ margin: 0, color: "#0cce5d" }}>
                    Medicine {index + 1}
                  </h6>
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => removeMedicine(index)}
                  >
                    <FiTrash2 />
                  </button>
                </div>
                <div className="row">
                  <div className="col-md-6 col-lg-4 mb-3">
                    <label className="form-label">Medicine Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={medicine.name}
                      onChange={(e) =>
                        handleMedicineChange(index, "name", e.target.value)
                      }
                      placeholder="e.g., Paracetamol 500mg"
                      required
                    />
                  </div>
                  <div className="col-md-6 col-lg-2 mb-3">
                    <label className="form-label">Dosage *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={medicine.dosage}
                      onChange={(e) =>
                        handleMedicineChange(index, "dosage", e.target.value)
                      }
                      placeholder="e.g., 1 tablet"
                      required
                    />
                  </div>
                  <div className="col-md-6 col-lg-3 mb-3">
                    <label className="form-label">Frequency *</label>
                    <select
                      className="form-select"
                      value={medicine.frequency}
                      onChange={(e) =>
                        handleMedicineChange(index, "frequency", e.target.value)
                      }
                      required
                    >
                      <option value="">Select frequency</option>
                      {frequencyOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6 col-lg-3 mb-3">
                    <label className="form-label">Duration *</label>
                    <select
                      className="form-select"
                      value={medicine.duration}
                      onChange={(e) =>
                        handleMedicineChange(index, "duration", e.target.value)
                      }
                      required
                    >
                      <option value="">Select duration</option>
                      {durationOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-12 mb-0">
                    <label className="form-label">Special Instructions</label>
                    <input
                      type="text"
                      className="form-control"
                      value={medicine.instructions}
                      onChange={(e) =>
                        handleMedicineChange(
                          index,
                          "instructions",
                          e.target.value,
                        )
                      }
                      placeholder="e.g., Take with food, Avoid dairy"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="d-flex justify-content-end gap-3">
          <button
            type="button"
            className="btn btn-light"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Creating...
              </>
            ) : (
              <>
                <FiSave style={{ marginRight: "5px" }} />
                Create Prescription
              </>
            )}
          </button>
        </div>
      </form>
      )}
    </div>
  );
};

export default CreatePrescription;
