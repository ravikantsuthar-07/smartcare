import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FiMail,
  FiUser,
  FiPhone,
  FiArrowRight,
  FiArrowLeft,
  FiUpload,
  FiFileText,
} from "react-icons/fi";
import { FaStethoscope } from "react-icons/fa";

const API_BASE_URL = "http://edocly.xyz/api";

const DoctorRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "",
    registrationNo: "",
    certificate: null,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const specializations = [
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
    "Other",
  ];

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "certificate") {
      setFormData((prev) => ({ ...prev, certificate: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    if (!formData.specialization) {
      newErrors.specialization = "Specialization is required";
    }

    if (!formData.registrationNo.trim()) {
      newErrors.registrationNo = "Registration number is required";
    }

    if (!formData.certificate) {
      newErrors.certificate = "Please upload your registration certificate";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    try {
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("email", formData.email);
      submitData.append("mobile", formData.phone);
      submitData.append("specaialization", formData.specialization); // API expects this spelling
      submitData.append("registerNumber", formData.registrationNo);
      if (formData.certificate) {
        submitData.append("image", formData.certificate);
      }

      const response = await axios.post(
        `${API_BASE_URL}/auth/register?mode=doctor`,
        submitData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.data.success) {
        toast.success(response.data.message || "OTP sent successfully!");
        navigate("/verify-otp", {
          state: {
            userId: response.data.userId,
            mobile: formData.phone,
            email: formData.email,
            isLogin: false,
            userData: {
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              specialization: formData.specialization,
              registrationNo: formData.registrationNo,
              role: "doctor",
            },
          },
        });
      }
    } catch (err) {
      console.error("Registration error:", err);
      console.error("Response:", err.response);
      console.error("Response data:", err.response?.data);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Registration failed. Please try again.";
      toast.error(errorMessage);
      setErrors({
        submit: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: "520px" }}>
        <div className="auth-logo">
          <h1>
            <FaStethoscope style={{ marginRight: "10px", color: "#069494" }} />
            <span style={{ color: "#069494" }}>Smart</span>
            <span>Care</span>
          </h1>
        </div>

        <div className="auth-title">
          <h2>Doctor Registration</h2>
          <p>Join our healthcare network</p>
        </div>

        {errors.submit && (
          <div className="alert alert-danger" role="alert">
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <div className="input-group">
              <span className="input-icon">
                <FiUser />
              </span>
              <input
                type="text"
                name="name"
                className={`form-control ${errors.name ? "is-invalid" : ""}`}
                placeholder="Dr. John Doe"
                value={formData.name}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            {errors.name && (
              <div className="invalid-feedback" style={{ display: "block" }}>
                {errors.name}
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <div className="input-group">
              <span className="input-icon">
                <FiMail />
              </span>
              <input
                type="email"
                name="email"
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                placeholder="doctor@email.com"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            {errors.email && (
              <div className="invalid-feedback" style={{ display: "block" }}>
                {errors.email}
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number *</label>
            <div className="input-group">
              <span className="input-icon">
                <FiPhone />
              </span>
              <input
                type="tel"
                name="phone"
                className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                placeholder="Your 10-digit mobile number"
                value={formData.phone}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            {errors.phone && (
              <div className="invalid-feedback" style={{ display: "block" }}>
                {errors.phone}
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Specialization *</label>
            <select
              name="specialization"
              className={`form-select ${errors.specialization ? "is-invalid" : ""}`}
              value={formData.specialization}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="">Select your specialization</option>
              {specializations.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
            {errors.specialization && (
              <div className="invalid-feedback" style={{ display: "block" }}>
                {errors.specialization}
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Medical Registration Number *</label>
            <div className="input-group">
              <span className="input-icon">
                <FiFileText />
              </span>
              <input
                type="text"
                name="registrationNo"
                className={`form-control ${errors.registrationNo ? "is-invalid" : ""}`}
                placeholder="e.g., MCI/2024/12345"
                value={formData.registrationNo}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            {errors.registrationNo && (
              <div className="invalid-feedback" style={{ display: "block" }}>
                {errors.registrationNo}
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Registration Certificate *</label>
            <div
              className={`upload-zone ${errors.certificate ? "border-danger" : ""}`}
              style={{ padding: "20px", cursor: "pointer" }}
              onClick={() =>
                document.getElementById("certificate-input").click()
              }
            >
              <input
                type="file"
                id="certificate-input"
                name="certificate"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleChange}
                style={{ display: "none" }}
                disabled={loading}
              />
              <FiUpload
                style={{
                  fontSize: "2rem",
                  color: "#adb5bd",
                  marginBottom: "10px",
                }}
              />
              {formData.certificate ? (
                <p style={{ margin: 0, color: "#0cce5d", fontWeight: 500 }}>
                  {formData.certificate.name}
                </p>
              ) : (
                <p
                  style={{ margin: 0, color: "#6c757d", fontSize: "0.875rem" }}
                >
                  Click to upload your certificate (PDF, JPG, PNG)
                </p>
              )}
            </div>
            {errors.certificate && (
              <div className="invalid-feedback" style={{ display: "block" }}>
                {errors.certificate}
              </div>
            )}
          </div>

          <div
            className="alert alert-info"
            style={{
              background: "#e6f5f5",
              border: "none",
              color: "#069494",
              fontSize: "0.85rem",
            }}
          >
            <strong>Note:</strong> Your account will be verified within 24
            hours. You'll receive an email once approved.
          </div>

          <button
            type="submit"
            className="btn btn-secondary btn-block btn-lg"
            disabled={loading}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Registering...
              </>
            ) : (
              <>
                Submit for Verification <FiArrowRight />
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-4">
          <Link
            to="/"
            style={{
              color: "#6c757d",
              fontSize: "0.875rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <FiArrowLeft /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DoctorRegister;
