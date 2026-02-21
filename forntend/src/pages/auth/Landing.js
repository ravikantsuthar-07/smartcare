import React from "react";
import { Link } from "react-router-dom";
import { FiUser, FiUserPlus } from "react-icons/fi";
import { FaUserMd, FaUserInjured } from "react-icons/fa";

const Landing = () => {
  return (
    <div className="landing-container">
      <div className="landing-card">
        <div className="landing-logo">
          <h1>
            <span className="smart">Smart</span>
            <span className="care">Care</span>
          </h1>
        </div>

        <p className="landing-tagline">
          Your Unified Healthcare Platform for Seamless Patient-Doctor
          Interaction
        </p>

        <div className="role-selection">
          <h3>Register as</h3>
          <div className="role-cards">
            <Link to="/register/patient" className="role-card patient">
              <div className="icon">
                <FaUserInjured />
              </div>
              <h4>Patient</h4>
              <p>Book appointments & manage health</p>
            </Link>

            <Link to="/register/doctor" className="role-card doctor">
              <div className="icon">
                <FaUserMd />
              </div>
              <h4>Doctor</h4>
              <p>Manage patients & prescriptions</p>
            </Link>
          </div>
        </div>

        <div className="landing-footer">
          <p>
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
