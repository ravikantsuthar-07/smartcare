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
} from "react-icons/fi";
import { FaStethoscope } from "react-icons/fa";

const API_BASE_URL = "http://edocly.xyz/api";

const PatientRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: 0,
    age: 0,
    gender: 0,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

    if (!formData.age) {
      newErrors.age = "Age is required";
    } else if (formData.age < 1 || formData.age > 120) {
      newErrors.age = "Please enter a valid age";
    }

    if (!formData.gender) {
      newErrors.gender = "Please select your gender";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/register?mode=user`,
        {
          name: formData.name,
          email: formData.email,
          mobile: Number(formData.phone),
          age: Number(formData.age),
          gender: Number(formData.gender),
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
            userData: { ...formData, role: "patient" },
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
      <div className="auth-card">
        <div className="auth-logo">
          <h1>
            <FaStethoscope style={{ marginRight: "10px", color: "#0cce5d" }} />
            <span style={{ color: "#0cce5d" }}>Smart</span>
            <span>Care</span>
          </h1>
        </div>

        <div className="auth-title">
          <h2>Patient Registration</h2>
          <p>Create your account to get started</p>
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
                placeholder="Enter your full name"
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
                placeholder="Enter your email"
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
                placeholder="Enter your 10-digit mobile number"
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

          <div className="row">
            <div className="col-6">
              <div className="form-group">
                <label className="form-label">Age *</label>
                <input
                  type="number"
                  name="age"
                  className={`form-control ${errors.age ? "is-invalid" : ""}`}
                  placeholder="Age"
                  value={formData.age}
                  onChange={handleChange}
                  disabled={loading}
                  min="1"
                  max="120"
                />
                {errors.age && (
                  <div
                    className="invalid-feedback"
                    style={{ display: "block" }}
                  >
                    {errors.age}
                  </div>
                )}
              </div>
            </div>
            <div className="col-6">
              <div className="form-group">
                <label className="form-label">Gender *</label>
                <select
                  name="gender"
                  className={`form-select ${errors.gender ? "is-invalid" : ""}`}
                  value={formData.gender}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="">Select</option>
                  <option value="1">Male</option>
                  <option value="2">Female</option>
                  <option value="3">Other</option>
                </select>
                {errors.gender && (
                  <div
                    className="invalid-feedback"
                    style={{ display: "block" }}
                  >
                    {errors.gender}
                  </div>
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block btn-lg"
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
                Continue <FiArrowRight />
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

export default PatientRegister;
