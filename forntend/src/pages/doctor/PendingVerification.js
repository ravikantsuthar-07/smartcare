import React from "react";
import { Link } from "react-router-dom";
import { FiClock, FiCheckCircle, FiFileText, FiMail } from "react-icons/fi";

const PendingVerification = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f0fff5 0%, #e6f7f0 100%)",
        padding: "20px",
      }}
    >
      <div
        className="card"
        style={{ maxWidth: "500px", width: "100%", textAlign: "center" }}
      >
        <div className="card-body" style={{ padding: "50px 40px" }}>
          <div
            style={{
              width: "100px",
              height: "100px",
              background: "linear-gradient(135deg, #f57c00, #ff9800)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 30px",
              animation: "pulse 2s infinite",
            }}
          >
            <FiClock size={48} color="white" />
          </div>

          <h2 style={{ color: "#2d3748", marginBottom: "15px" }}>
            Verification Pending
          </h2>

          <p
            style={{
              color: "#6c757d",
              fontSize: "1.1rem",
              marginBottom: "30px",
            }}
          >
            Your doctor account is currently under review. Our team will verify
            your credentials and approve your account soon.
          </p>

          <div
            style={{
              background: "#fff8e6",
              border: "1px solid #f57c00",
              borderRadius: "10px",
              padding: "20px",
              marginBottom: "30px",
              textAlign: "left",
            }}
          >
            <h6 style={{ color: "#f57c00", marginBottom: "15px" }}>
              What happens next?
            </h6>
            <ul style={{ margin: 0, paddingLeft: "20px", color: "#6c757d" }}>
              <li style={{ marginBottom: "10px" }}>
                Our team will review your submitted documents
              </li>
              <li style={{ marginBottom: "10px" }}>
                Verification usually takes 24-48 hours
              </li>
              <li style={{ marginBottom: "10px" }}>
                You'll receive an email once verified
              </li>
              <li>After verification, you can start accepting appointments</li>
            </ul>
          </div>

          <div
            style={{
              background: "#e8faf0",
              borderRadius: "10px",
              padding: "20px",
              marginBottom: "30px",
            }}
          >
            <div className="row">
              <div className="col-4 text-center">
                <FiFileText size={24} color="#0cce5d" />
                <p
                  style={{
                    margin: "10px 0 0",
                    fontSize: "0.85rem",
                    color: "#6c757d",
                  }}
                >
                  Documents
                  <br />
                  Submitted
                </p>
              </div>
              <div className="col-4 text-center">
                <FiClock size={24} color="#f57c00" />
                <p
                  style={{
                    margin: "10px 0 0",
                    fontSize: "0.85rem",
                    color: "#6c757d",
                  }}
                >
                  Under
                  <br />
                  Review
                </p>
              </div>
              <div className="col-4 text-center">
                <FiCheckCircle size={24} color="#dee2e6" />
                <p
                  style={{
                    margin: "10px 0 0",
                    fontSize: "0.85rem",
                    color: "#6c757d",
                  }}
                >
                  Verified
                </p>
              </div>
            </div>
            <div
              style={{
                height: "4px",
                background: "#e9ecef",
                borderRadius: "2px",
                marginTop: "15px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: "50%",
                  height: "100%",
                  background: "linear-gradient(90deg, #0cce5d, #f57c00)",
                  borderRadius: "2px",
                }}
              ></div>
            </div>
          </div>

          <div className="d-flex flex-column gap-3">
            <a
              href="mailto:support@smartcare.com"
              className="btn btn-outline-primary"
            >
              <FiMail style={{ marginRight: "8px" }} />
              Contact Support
            </a>
            <Link to="/login" className="btn btn-light">
              Back to Login
            </Link>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes pulse {
            0% {
              box-shadow: 0 0 0 0 rgba(245, 124, 0, 0.4);
            }
            70% {
              box-shadow: 0 0 0 20px rgba(245, 124, 0, 0);
            }
            100% {
              box-shadow: 0 0 0 0 rgba(245, 124, 0, 0);
            }
          }
        `}
      </style>
    </div>
  );
};

export default PendingVerification;
