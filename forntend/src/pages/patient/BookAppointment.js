import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FiSearch,
  FiCalendar,
  FiClock,
  FiArrowLeft,
  FiCheck,
} from "react-icons/fi";
import { FaUserMd } from "react-icons/fa";
import { doctorService, appointmentService } from "../../services/dataService";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const BookAppointment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const specializations = [
    "All Specializations",
    "General Physician",
    "Cardiologist",
    "Dermatologist",
    "Orthopedic",
    "Pediatrician",
    "Neurologist",
    "Psychiatrist",
    "Gynecologist",
    "ENT Specialist",
    "Ophthalmologist",
    "Dentist",
  ];

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      // Mock data
      setDoctors([
        {
          id: 1,
          name: "Dr. Sarah Johnson",
          specialization: "Cardiologist",
          experience: "15 years",
          rating: 4.8,
        },
        {
          id: 2,
          name: "Dr. Mike Brown",
          specialization: "General Physician",
          experience: "10 years",
          rating: 4.6,
        },
        {
          id: 3,
          name: "Dr. Emily Davis",
          specialization: "Dermatologist",
          experience: "8 years",
          rating: 4.9,
        },
        {
          id: 4,
          name: "Dr. John Smith",
          specialization: "Orthopedic",
          experience: "20 years",
          rating: 4.7,
        },
        {
          id: 5,
          name: "Dr. Lisa Wilson",
          specialization: "Pediatrician",
          experience: "12 years",
          rating: 4.8,
        },
        {
          id: 6,
          name: "Dr. Robert Taylor",
          specialization: "Neurologist",
          experience: "18 years",
          rating: 4.5,
        },
      ]);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      toast.error("Failed to load doctors");
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableSlots = (date) => {
    // Mock available slots
    setAvailableSlots([
      { id: 1, time: "09:00 AM", available: true },
      { id: 2, time: "09:30 AM", available: true },
      { id: 3, time: "10:00 AM", available: false },
      { id: 4, time: "10:30 AM", available: true },
      { id: 5, time: "11:00 AM", available: true },
      { id: 6, time: "11:30 AM", available: true },
      { id: 7, time: "02:00 PM", available: true },
      { id: 8, time: "02:30 PM", available: false },
      { id: 9, time: "03:00 PM", available: true },
      { id: 10, time: "03:30 PM", available: true },
      { id: 11, time: "04:00 PM", available: true },
      { id: 12, time: "04:30 PM", available: true },
    ]);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setSelectedSlot(null);
    fetchAvailableSlots(e.target.value);
  };

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setStep(2);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // await appointmentService.createAppointment({
      //   patientId: user.id,
      //   doctorId: selectedDoctor.id,
      //   date: selectedDate,
      //   time: selectedSlot.time
      // });

      await Swal.fire({
        icon: "success",
        title: "Appointment Booked!",
        html: `
          <p>Your appointment with <strong>${selectedDoctor.name}</strong> has been confirmed.</p>
          <p><strong>Date:</strong> ${new Date(selectedDate).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
          <p><strong>Time:</strong> ${selectedSlot.time}</p>
        `,
        confirmButtonColor: "#0cce5d",
      });

      navigate("/patient/appointments");
    } catch (error) {
      toast.error("Failed to book appointment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpec =
      !selectedSpecialization ||
      selectedSpecialization === "All Specializations" ||
      doctor.specialization === selectedSpecialization;
    return matchesSearch && matchesSpec;
  });

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
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
    <div className="book-appointment">
      {/* Progress Steps */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-center align-items-center gap-4">
            <div
              className={`d-flex align-items-center gap-2 ${step >= 1 ? "text-primary" : "text-muted"}`}
            >
              <div
                className={`rounded-circle d-flex align-items-center justify-content-center`}
                style={{
                  width: "32px",
                  height: "32px",
                  background: step >= 1 ? "#0cce5d" : "#e9ecef",
                  color: step >= 1 ? "white" : "#6c757d",
                }}
              >
                {step > 1 ? <FiCheck /> : "1"}
              </div>
              <span style={{ fontWeight: 500 }}>Select Doctor</span>
            </div>
            <div
              style={{
                width: "60px",
                height: "2px",
                background: step >= 2 ? "#0cce5d" : "#e9ecef",
              }}
            ></div>
            <div
              className={`d-flex align-items-center gap-2 ${step >= 2 ? "text-primary" : "text-muted"}`}
            >
              <div
                className={`rounded-circle d-flex align-items-center justify-content-center`}
                style={{
                  width: "32px",
                  height: "32px",
                  background: step >= 2 ? "#0cce5d" : "#e9ecef",
                  color: step >= 2 ? "white" : "#6c757d",
                }}
              >
                {step > 2 ? <FiCheck /> : "2"}
              </div>
              <span style={{ fontWeight: 500 }}>Choose Slot</span>
            </div>
            <div
              style={{
                width: "60px",
                height: "2px",
                background: step >= 3 ? "#0cce5d" : "#e9ecef",
              }}
            ></div>
            <div
              className={`d-flex align-items-center gap-2 ${step >= 3 ? "text-primary" : "text-muted"}`}
            >
              <div
                className={`rounded-circle d-flex align-items-center justify-content-center`}
                style={{
                  width: "32px",
                  height: "32px",
                  background: step >= 3 ? "#0cce5d" : "#e9ecef",
                  color: step >= 3 ? "white" : "#6c757d",
                }}
              >
                3
              </div>
              <span style={{ fontWeight: 500 }}>Confirm</span>
            </div>
          </div>
        </div>
      </div>

      {/* Step 1: Select Doctor */}
      {step === 1 && (
        <>
          {/* Search & Filter */}
          <div className="card mb-4">
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-8">
                  <div className="input-group">
                    <span className="input-icon">
                      <FiSearch />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search doctors by name or specialization..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <select
                    className="form-select"
                    value={selectedSpecialization}
                    onChange={(e) => setSelectedSpecialization(e.target.value)}
                  >
                    {specializations.map((spec) => (
                      <option key={spec} value={spec}>
                        {spec}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Doctors List */}
          <div className="row">
            {filteredDoctors.map((doctor) => (
              <div key={doctor.id} className="col-md-6 col-lg-4 mb-4">
                <div
                  className="card h-100"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleDoctorSelect(doctor)}
                >
                  <div className="card-body text-center">
                    <div
                      className="mx-auto mb-3 d-flex align-items-center justify-content-center"
                      style={{
                        width: "80px",
                        height: "80px",
                        background: "#e6f5f5",
                        borderRadius: "50%",
                        fontSize: "2rem",
                        color: "#069494",
                      }}
                    >
                      <FaUserMd />
                    </div>
                    <h4 style={{ fontSize: "1.1rem", marginBottom: "5px" }}>
                      {doctor.name}
                    </h4>
                    <p
                      style={{
                        color: "#069494",
                        fontWeight: 500,
                        marginBottom: "5px",
                      }}
                    >
                      {doctor.specialization}
                    </p>
                    <p
                      style={{
                        color: "#6c757d",
                        fontSize: "0.85rem",
                        marginBottom: "10px",
                      }}
                    >
                      {doctor.experience} Experience
                    </p>
                    <div className="d-flex justify-content-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          style={{
                            color:
                              i < Math.floor(doctor.rating)
                                ? "#ffc107"
                                : "#e9ecef",
                          }}
                        >
                          ★
                        </span>
                      ))}
                      <span
                        style={{
                          color: "#6c757d",
                          fontSize: "0.85rem",
                          marginLeft: "5px",
                        }}
                      >
                        {doctor.rating}
                      </span>
                    </div>
                    <button className="btn btn-primary btn-sm w-100">
                      Book Appointment
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredDoctors.length === 0 && (
            <div className="card">
              <div className="empty-state">
                <FaUserMd className="icon" style={{ fontSize: "3rem" }} />
                <h3>No Doctors Found</h3>
                <p>Try adjusting your search or filter criteria</p>
              </div>
            </div>
          )}
        </>
      )}

      {/* Step 2: Choose Slot */}
      {step === 2 && (
        <>
          <button className="btn btn-light mb-4" onClick={() => setStep(1)}>
            <FiArrowLeft /> Back to Doctors
          </button>

          <div className="row">
            <div className="col-lg-4 mb-4">
              <div className="card">
                <div className="card-body text-center">
                  <div
                    className="mx-auto mb-3 d-flex align-items-center justify-content-center"
                    style={{
                      width: "80px",
                      height: "80px",
                      background: "#e6f5f5",
                      borderRadius: "50%",
                      fontSize: "2rem",
                      color: "#069494",
                    }}
                  >
                    <FaUserMd />
                  </div>
                  <h4>{selectedDoctor?.name}</h4>
                  <p style={{ color: "#069494", fontWeight: 500 }}>
                    {selectedDoctor?.specialization}
                  </p>
                  <p style={{ color: "#6c757d", fontSize: "0.85rem" }}>
                    {selectedDoctor?.experience} Experience
                  </p>
                </div>
              </div>
            </div>

            <div className="col-lg-8">
              <div className="card">
                <div className="card-header">
                  <h3>Select Date & Time</h3>
                </div>
                <div className="card-body">
                  <div className="form-group mb-4">
                    <label className="form-label">
                      <FiCalendar style={{ marginRight: "8px" }} />
                      Select Date
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      value={selectedDate}
                      onChange={handleDateChange}
                      min={getMinDate()}
                    />
                  </div>

                  {selectedDate && (
                    <>
                      <label className="form-label">
                        <FiClock style={{ marginRight: "8px" }} />
                        Available Slots
                      </label>
                      <div className="row g-2">
                        {availableSlots.map((slot) => (
                          <div key={slot.id} className="col-4 col-md-3">
                            <button
                              className={`btn w-100 ${
                                selectedSlot?.id === slot.id
                                  ? "btn-primary"
                                  : slot.available
                                    ? "btn-outline-primary"
                                    : "btn-light"
                              }`}
                              disabled={!slot.available}
                              onClick={() => setSelectedSlot(slot)}
                              style={{
                                opacity: slot.available ? 1 : 0.5,
                                textDecoration: slot.available
                                  ? "none"
                                  : "line-through",
                              }}
                            >
                              {slot.time}
                            </button>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {selectedSlot && (
                    <div className="mt-4">
                      <button
                        className="btn btn-primary btn-lg w-100"
                        onClick={() => setStep(3)}
                      >
                        Continue to Confirm
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Step 3: Confirm */}
      {step === 3 && (
        <>
          <button className="btn btn-light mb-4" onClick={() => setStep(2)}>
            <FiArrowLeft /> Back
          </button>

          <div className="card">
            <div className="card-header">
              <h3>Confirm Your Appointment</h3>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 mb-4">
                  <h5
                    style={{
                      color: "#6c757d",
                      fontSize: "0.85rem",
                      marginBottom: "5px",
                    }}
                  >
                    Doctor
                  </h5>
                  <p style={{ fontWeight: 500, marginBottom: "0" }}>
                    {selectedDoctor?.name}
                  </p>
                  <p style={{ color: "#069494" }}>
                    {selectedDoctor?.specialization}
                  </p>
                </div>
                <div className="col-md-6 mb-4">
                  <h5
                    style={{
                      color: "#6c757d",
                      fontSize: "0.85rem",
                      marginBottom: "5px",
                    }}
                  >
                    Patient
                  </h5>
                  <p style={{ fontWeight: 500, marginBottom: "0" }}>
                    {user?.name}
                  </p>
                  <p style={{ color: "#6c757d" }}>{user?.email}</p>
                </div>
                <div className="col-md-6 mb-4">
                  <h5
                    style={{
                      color: "#6c757d",
                      fontSize: "0.85rem",
                      marginBottom: "5px",
                    }}
                  >
                    Date
                  </h5>
                  <p style={{ fontWeight: 500 }}>
                    {new Date(selectedDate).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="col-md-6 mb-4">
                  <h5
                    style={{
                      color: "#6c757d",
                      fontSize: "0.85rem",
                      marginBottom: "5px",
                    }}
                  >
                    Time
                  </h5>
                  <p style={{ fontWeight: 500 }}>{selectedSlot?.time}</p>
                </div>
              </div>

              <div
                className="alert"
                style={{
                  background: "#e8faf0",
                  border: "none",
                  color: "#0cce5d",
                }}
              >
                <strong>Note:</strong> Please arrive 10 minutes before your
                scheduled appointment time.
              </div>

              <button
                className="btn btn-primary btn-lg w-100"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Booking...
                  </>
                ) : (
                  <>
                    <FiCheck /> Confirm Appointment
                  </>
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BookAppointment;
