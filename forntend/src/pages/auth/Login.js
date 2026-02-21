import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FiPhone,
  FiArrowRight,
  FiArrowLeft,
  FiCheck,
} from "react-icons/fi";
import { FaStethoscope } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

const API_BASE_URL = "http://edocly.xyz/api";

const Login = () => {
  const [mobile, setMobile] = useState("");
  const [step, setStep] = useState(1); // 1 = enter mobile, 2 = enter OTP
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);
  const { setUser, setIsAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (step === 2 && resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
  }, [step, resendTimer]);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError("");

    if (!mobile) {
      setError("Please enter your mobile number");
      return;
    }

    if (!/^[0-9]{10}$/.test(mobile)) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/auth/send`, { mobile: Number(mobile) });
      toast.success("OTP sent to your mobile!");
      setStep(2);
      setResendTimer(60);
      setCanResend(false);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to send OTP. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError("");

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const newOtp = pastedData
        .split("")
        .concat(Array(6 - pastedData.length).fill(""));
      setOtp(newOtp);
      inputRefs.current[Math.min(pastedData.length, 5)]?.focus();
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const otpString = otp.join("");

    if (otpString.length !== 6) {
      setError("Please enter the complete 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/verify`, {
        mobile: Number(mobile),
        otp: Number(otpString),
      });

      // Store token and user data
      const token = response.data.token;
      const user = response.data.auth;
      
      if (token) {
        localStorage.setItem("token", token);
      }
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
        setIsAuthenticated(true);
      }

      toast.success("Login successful!");

      // Redirect to patient dashboard
      setTimeout(() => {
        window.location.href = "/patient/dashboard";
      }, 100);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP. Please try again.");
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;

    try {
      await axios.post(`${API_BASE_URL}/auth/send`, { mobile: Number(mobile) });
      toast.success("OTP resent successfully!");
      setResendTimer(60);
      setCanResend(false);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError("Failed to resend OTP. Please try again.");
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
          <p>Healthcare at your fingertips</p>
        </div>

        {step === 1 ? (
          <>
            <div className="auth-title">
              <h2>Welcome Back</h2>
              <p>Enter your mobile number to receive a login OTP</p>
            </div>

            {error && (
              <div
                className="alert alert-danger"
                role="alert"
                style={{ fontSize: "0.875rem" }}
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSendOTP}>
              <div className="form-group">
                <label className="form-label">Mobile Number</label>
                <div className="input-group">
                  <span className="input-icon">
                    <FiPhone />
                  </span>
                  <input
                    type="tel"
                    className={`form-control ${error ? "is-invalid" : ""}`}
                    placeholder="Enter your 10-digit mobile number"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    disabled={loading}
                    maxLength={10}
                  />
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
                    Sending OTP...
                  </>
                ) : (
                  <>
                    Continue <FiArrowRight />
                  </>
                )}
              </button>
            </form>

            <div className="text-center mt-4">
              <p style={{ color: "#6c757d", fontSize: "0.875rem" }}>
                Don't have an account? <Link to="/">Register here</Link>
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="auth-title">
              <h2>Verify OTP</h2>
              <p>
                We've sent a 6-digit code to
                <br />
                <strong>{mobile}</strong>
              </p>
            </div>

            {error && (
              <div
                className="alert alert-danger"
                role="alert"
                style={{ fontSize: "0.875rem" }}
              >
                {error}
              </div>
            )}

            <form onSubmit={handleVerifyOTP}>
              <div className="otp-inputs" onPaste={handlePaste}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    className="otp-input"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    disabled={loading}
                    maxLength={1}
                  />
                ))}
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-block btn-lg"
                disabled={loading || otp.join("").length !== 6}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Verifying...
                  </>
                ) : (
                  <>
                    Verify OTP <FiCheck />
                  </>
                )}
              </button>

              <div
                className="resend-otp"
                style={{ textAlign: "center", marginTop: "1rem" }}
              >
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#0cce5d",
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                  >
                    Resend OTP
                  </button>
                ) : (
                  <p
                    style={{
                      color: "#6c757d",
                      fontSize: "0.875rem",
                      margin: 0,
                    }}
                  >
                    Resend OTP in <strong>{resendTimer}s</strong>
                  </p>
                )}
              </div>
            </form>

            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setOtp(["", "", "", "", "", ""]);
                  setError("");
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "#6c757d",
                  fontSize: "0.875rem",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  cursor: "pointer",
                }}
              >
                <FiArrowLeft /> Change mobile number
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
