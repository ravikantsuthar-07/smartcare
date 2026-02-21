import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FiArrowLeft, FiCheck } from "react-icons/fi";
import { FaStethoscope } from "react-icons/fa";

const VerifyOTP = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { verifyOTP, sendOTP } = useAuth();

  const email = location.state?.email;
  const mobile = location.state?.mobile;
  const isLogin = location.state?.isLogin;
  const userData = location.state?.userData;

  useEffect(() => {
    if (!email && !mobile) {
      navigate("/login");
    }
    inputRefs.current[0]?.focus();
  }, [email, mobile, navigate]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError("");

    // Auto-focus next input
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join("");

    if (otpString.length !== 6) {
      setError("Please enter the complete 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      await verifyOTP(mobile || email, otpString, isLogin ? null : userData);
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
      await sendOTP(mobile || email, isLogin ? "login" : "register");
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
        </div>

        <div className="auth-title">
          <h2>Verify OTP</h2>
          <p>
            We've sent a 6-digit code to
            <br />
            <strong>{mobile || email}</strong>
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

        <form onSubmit={handleSubmit}>
          <div className="otp-inputs" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                className="otp-input"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
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

          <div className="resend-otp">
            {canResend ? (
              <button type="button" onClick={handleResendOTP}>
                Resend OTP
              </button>
            ) : (
              <p style={{ color: "#6c757d", fontSize: "0.875rem", margin: 0 }}>
                Resend OTP in <strong>{resendTimer}s</strong>
              </p>
            )}
          </div>
        </form>

        <div className="text-center mt-4">
          <Link
            to={isLogin ? "/login" : "/"}
            style={{
              color: "#6c757d",
              fontSize: "0.875rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <FiArrowLeft /> Back
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
