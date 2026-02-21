import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { FiUser, FiMail, FiPhone, FiEdit2, FiSave, FiX } from "react-icons/fi";
import { patientService } from "../../services/dataService";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const Profile = () => {
  const { user, updateUser, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    age: user?.age || "",
    gender: user?.gender || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // await patientService.updateProfile(user.id, formData);
      updateUser(formData);
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      age: user?.age || "",
      gender: user?.gender || "",
    });
    setIsEditing(false);
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Logout?",
      text: "Are you sure you want to logout?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#0cce5d",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, logout",
    });

    if (result.isConfirmed) {
      logout();
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="profile-page">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar">{getInitials(user?.name)}</div>
        <div className="profile-info">
          <h2>{user?.name || "User"}</h2>
          <p>{user?.email}</p>
          <div className="profile-badges">
            <span className="profile-badge">Patient</span>
            <span className="profile-badge" style={{ background: "#0cce5d" }}>
              Verified ✓
            </span>
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="card">
        <div className="card-header">
          <h3>Personal Information</h3>
          {!isEditing ? (
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() => setIsEditing(true)}
            >
              <FiEdit2 /> Edit
            </button>
          ) : (
            <div className="d-flex gap-2">
              <button
                className="btn btn-light btn-sm"
                onClick={handleCancel}
                disabled={loading}
              >
                <FiX /> Cancel
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? (
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                ) : (
                  <>
                    <FiSave /> Save
                  </>
                )}
              </button>
            </div>
          )}
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6 mb-4">
              <label className="form-label">Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleChange}
                />
              ) : (
                <p style={{ fontWeight: 500, margin: 0 }}>
                  {user?.name || "-"}
                </p>
              )}
            </div>
            <div className="col-md-6 mb-4">
              <label className="form-label">Email Address</label>
              <p style={{ fontWeight: 500, margin: 0, color: "#6c757d" }}>
                {user?.email || "-"}
                <span
                  style={{
                    fontSize: "0.75rem",
                    marginLeft: "10px",
                    color: "#0cce5d",
                  }}
                >
                  (Cannot be changed)
                </span>
              </p>
            </div>
            <div className="col-md-6 mb-4">
              <label className="form-label">Phone Number</label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  className="form-control"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                />
              ) : (
                <p style={{ fontWeight: 500, margin: 0 }}>
                  {user?.phone || "Not provided"}
                </p>
              )}
            </div>
            <div className="col-md-3 mb-4">
              <label className="form-label">Age</label>
              {isEditing ? (
                <input
                  type="number"
                  name="age"
                  className="form-control"
                  value={formData.age}
                  onChange={handleChange}
                  min="1"
                  max="120"
                />
              ) : (
                <p style={{ fontWeight: 500, margin: 0 }}>
                  {user?.age || "-"} years
                </p>
              )}
            </div>
            <div className="col-md-3 mb-4">
              <label className="form-label">Gender</label>
              {isEditing ? (
                <select
                  name="gender"
                  className="form-select"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              ) : (
                <p
                  style={{
                    fontWeight: 500,
                    margin: 0,
                    textTransform: "capitalize",
                  }}
                >
                  {user?.gender || "-"}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Account Stats */}
      <div className="card mt-4">
        <div className="card-header">
          <h3>Account Overview</h3>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-3 col-6 mb-3">
              <div
                className="text-center p-3 rounded"
                style={{ background: "#e8faf0" }}
              >
                <h4 style={{ color: "#0cce5d", marginBottom: "5px" }}>12</h4>
                <p style={{ color: "#6c757d", fontSize: "0.85rem", margin: 0 }}>
                  Appointments
                </p>
              </div>
            </div>
            <div className="col-md-3 col-6 mb-3">
              <div
                className="text-center p-3 rounded"
                style={{ background: "#e6f5f5" }}
              >
                <h4 style={{ color: "#069494", marginBottom: "5px" }}>8</h4>
                <p style={{ color: "#6c757d", fontSize: "0.85rem", margin: 0 }}>
                  Prescriptions
                </p>
              </div>
            </div>
            <div className="col-md-3 col-6 mb-3">
              <div
                className="text-center p-3 rounded"
                style={{ background: "#fff8e1" }}
              >
                <h4 style={{ color: "#f57c00", marginBottom: "5px" }}>6</h4>
                <p style={{ color: "#6c757d", fontSize: "0.85rem", margin: 0 }}>
                  Records
                </p>
              </div>
            </div>
            <div className="col-md-3 col-6 mb-3">
              <div
                className="text-center p-3 rounded"
                style={{ background: "#f1f3f5" }}
              >
                <h4 style={{ color: "#495057", marginBottom: "5px" }}>4</h4>
                <p style={{ color: "#6c757d", fontSize: "0.85rem", margin: 0 }}>
                  Doctors Visited
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <div className="card mt-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h4 style={{ marginBottom: "5px" }}>Logout</h4>
              <p style={{ color: "#6c757d", margin: 0, fontSize: "0.9rem" }}>
                Sign out of your account
              </p>
            </div>
            <button className="btn btn-danger" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
