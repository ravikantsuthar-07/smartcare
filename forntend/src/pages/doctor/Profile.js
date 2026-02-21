import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiAward,
  FiClock,
  FiDollarSign,
  FiEdit2,
  FiSave,
  FiCamera,
} from "react-icons/fi";
import { doctorService } from "../../services/dataService";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const DoctorProfile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "",
    qualification: "",
    experience: "",
    clinicAddress: "",
    consultationFee: "",
    bio: "",
    availableDays: [],
    startTime: "",
    endTime: "",
    slotDuration: 30,
  });

  const [originalProfile, setOriginalProfile] = useState({});

  const weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      // Mock data
      const data = {
        name: user?.name || "Dr. Smith",
        email: user?.email || "dr.smith@email.com",
        phone: "9876543210",
        specialization: "Cardiology",
        qualification: "MBBS, MD (Cardiology)",
        experience: "10",
        clinicAddress: "123 Medical Center, Healthcare Street, City - 560001",
        consultationFee: "500",
        bio: "Experienced cardiologist with over 10 years of practice. Specialized in preventive cardiology and heart failure management.",
        availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        startTime: "09:00",
        endTime: "17:00",
        slotDuration: 30,
      };
      setProfile(data);
      setOriginalProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleDayToggle = (day) => {
    setProfile((prev) => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter((d) => d !== day)
        : [...prev.availableDays, day],
    }));
  };

  const handleCancel = () => {
    setProfile(originalProfile);
    setEditing(false);
  };

  const handleSave = async () => {
    if (!profile.name.trim() || !profile.phone.trim()) {
      toast.error("Name and phone are required");
      return;
    }

    if (profile.availableDays.length === 0) {
      toast.error("Please select at least one available day");
      return;
    }

    const result = await Swal.fire({
      title: "Save Changes?",
      text: "Are you sure you want to update your profile?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#0cce5d",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, save it!",
    });

    if (result.isConfirmed) {
      setSaving(true);
      try {
        // await doctorService.updateProfile(profile);
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

        setOriginalProfile(profile);
        setEditing(false);
        toast.success("Profile updated successfully");
        updateUser({ ...user, name: profile.name });
      } catch (error) {
        console.error("Error updating profile:", error);
        toast.error("Failed to update profile");
      } finally {
        setSaving(false);
      }
    }
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
    <div className="doctor-profile">
      {/* Profile Header */}
      <div className="card mb-4">
        <div
          style={{
            background: "linear-gradient(135deg, #0cce5d, #069494)",
            padding: "30px",
            borderRadius: "10px 10px 0 0",
          }}
        >
          <div className="d-flex align-items-center gap-4 flex-wrap">
            <div style={{ position: "relative" }}>
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  background: "rgba(255,255,255,0.2)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "36px",
                  border: "3px solid white",
                }}
              >
                <FiUser />
              </div>
              {editing && (
                <button
                  style={{
                    position: "absolute",
                    bottom: "0",
                    right: "0",
                    width: "32px",
                    height: "32px",
                    background: "white",
                    border: "none",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#0cce5d",
                    cursor: "pointer",
                  }}
                >
                  <FiCamera size={16} />
                </button>
              )}
            </div>
            <div style={{ color: "white" }}>
              <h3 style={{ margin: 0 }}>{profile.name}</h3>
              <p style={{ margin: "5px 0 0", opacity: 0.9 }}>
                {profile.specialization}
              </p>
              <p
                style={{ margin: "5px 0 0", opacity: 0.8, fontSize: "0.9rem" }}
              >
                {profile.qualification}
              </p>
            </div>
            <div style={{ marginLeft: "auto" }}>
              {!editing ? (
                <button
                  className="btn btn-light"
                  onClick={() => setEditing(true)}
                >
                  <FiEdit2 style={{ marginRight: "5px" }} />
                  Edit Profile
                </button>
              ) : (
                <div className="d-flex gap-2">
                  <button className="btn btn-light" onClick={handleCancel}>
                    Cancel
                  </button>
                  <button
                    className="btn btn-dark"
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? (
                      "Saving..."
                    ) : (
                      <>
                        <FiSave style={{ marginRight: "5px" }} />
                        Save
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="card-body">
          <div className="row">
            <div
              className="col-md-4 text-center py-3"
              style={{ borderRight: "1px solid #e9ecef" }}
            >
              <h3 style={{ color: "#0cce5d", marginBottom: "5px" }}>
                {profile.experience}+
              </h3>
              <p style={{ margin: 0, color: "#6c757d" }}>Years Experience</p>
            </div>
            <div
              className="col-md-4 text-center py-3"
              style={{ borderRight: "1px solid #e9ecef" }}
            >
              <h3 style={{ color: "#0cce5d", marginBottom: "5px" }}>
                ₹{profile.consultationFee}
              </h3>
              <p style={{ margin: 0, color: "#6c757d" }}>Consultation Fee</p>
            </div>
            <div className="col-md-4 text-center py-3">
              <h3 style={{ color: "#0cce5d", marginBottom: "5px" }}>
                {profile.slotDuration}
              </h3>
              <p style={{ margin: 0, color: "#6c757d" }}>Minutes per Slot</p>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="mb-4">
            <FiUser style={{ marginRight: "10px", color: "#0cce5d" }} />
            Personal Information
          </h5>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Full Name</label>
              {editing ? (
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={profile.name}
                  onChange={handleInputChange}
                />
              ) : (
                <p className="form-control-plaintext">{profile.name}</p>
              )}
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Email</label>
              <p className="form-control-plaintext">
                <FiMail style={{ marginRight: "5px", color: "#6c757d" }} />
                {profile.email}
              </p>
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Phone Number</label>
              {editing ? (
                <input
                  type="tel"
                  className="form-control"
                  name="phone"
                  value={profile.phone}
                  onChange={handleInputChange}
                />
              ) : (
                <p className="form-control-plaintext">
                  <FiPhone style={{ marginRight: "5px", color: "#6c757d" }} />
                  {profile.phone}
                </p>
              )}
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Clinic Address</label>
              {editing ? (
                <textarea
                  className="form-control"
                  name="clinicAddress"
                  value={profile.clinicAddress}
                  onChange={handleInputChange}
                  rows="2"
                ></textarea>
              ) : (
                <p className="form-control-plaintext">
                  <FiMapPin style={{ marginRight: "5px", color: "#6c757d" }} />
                  {profile.clinicAddress}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Professional Information */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="mb-4">
            <FiAward style={{ marginRight: "10px", color: "#0cce5d" }} />
            Professional Information
          </h5>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Specialization</label>
              {editing ? (
                <select
                  className="form-select"
                  name="specialization"
                  value={profile.specialization}
                  onChange={handleInputChange}
                >
                  <option value="Cardiology">Cardiology</option>
                  <option value="Dermatology">Dermatology</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Orthopedics">Orthopedics</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="General Medicine">General Medicine</option>
                </select>
              ) : (
                <p className="form-control-plaintext">
                  {profile.specialization}
                </p>
              )}
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Qualification</label>
              {editing ? (
                <input
                  type="text"
                  className="form-control"
                  name="qualification"
                  value={profile.qualification}
                  onChange={handleInputChange}
                />
              ) : (
                <p className="form-control-plaintext">
                  {profile.qualification}
                </p>
              )}
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Experience (Years)</label>
              {editing ? (
                <input
                  type="number"
                  className="form-control"
                  name="experience"
                  value={profile.experience}
                  onChange={handleInputChange}
                />
              ) : (
                <p className="form-control-plaintext">
                  {profile.experience} years
                </p>
              )}
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Consultation Fee (₹)</label>
              {editing ? (
                <input
                  type="number"
                  className="form-control"
                  name="consultationFee"
                  value={profile.consultationFee}
                  onChange={handleInputChange}
                />
              ) : (
                <p className="form-control-plaintext">
                  <FiDollarSign
                    style={{ marginRight: "5px", color: "#6c757d" }}
                  />
                  ₹{profile.consultationFee}
                </p>
              )}
            </div>
            <div className="col-12 mb-3">
              <label className="form-label">Bio</label>
              {editing ? (
                <textarea
                  className="form-control"
                  name="bio"
                  value={profile.bio}
                  onChange={handleInputChange}
                  rows="3"
                ></textarea>
              ) : (
                <p className="form-control-plaintext">{profile.bio}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Availability */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="mb-4">
            <FiClock style={{ marginRight: "10px", color: "#0cce5d" }} />
            Availability
          </h5>
          <div className="row">
            <div className="col-12 mb-3">
              <label className="form-label">Available Days</label>
              <div className="d-flex gap-2 flex-wrap">
                {weekDays.map((day) => (
                  <button
                    key={day}
                    type="button"
                    className={`btn btn-sm ${profile.availableDays.includes(day) ? "btn-primary" : "btn-outline-secondary"}`}
                    onClick={() => editing && handleDayToggle(day)}
                    disabled={!editing}
                    style={{ minWidth: "90px" }}
                  >
                    {day.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Start Time</label>
              {editing ? (
                <input
                  type="time"
                  className="form-control"
                  name="startTime"
                  value={profile.startTime}
                  onChange={handleInputChange}
                />
              ) : (
                <p className="form-control-plaintext">{profile.startTime}</p>
              )}
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">End Time</label>
              {editing ? (
                <input
                  type="time"
                  className="form-control"
                  name="endTime"
                  value={profile.endTime}
                  onChange={handleInputChange}
                />
              ) : (
                <p className="form-control-plaintext">{profile.endTime}</p>
              )}
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Slot Duration (minutes)</label>
              {editing ? (
                <select
                  className="form-select"
                  name="slotDuration"
                  value={profile.slotDuration}
                  onChange={handleInputChange}
                >
                  <option value="15">15 minutes</option>
                  <option value="20">20 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">60 minutes</option>
                </select>
              ) : (
                <p className="form-control-plaintext">
                  {profile.slotDuration} minutes
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
