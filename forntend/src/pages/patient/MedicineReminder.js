import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { FiSun, FiSunrise, FiMoon, FiCheck } from "react-icons/fi";
import { FaPills } from "react-icons/fa";
import { reminderService } from "../../services/dataService";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const MedicineReminder = () => {
  const { user } = useAuth();
  const [reminders, setReminders] = useState({
    morning: [],
    afternoon: [],
    night: [],
  });
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    fetchReminders();
  }, [date]);

  const fetchReminders = async () => {
    try {
      // Mock data
      setReminders({
        morning: [
          {
            id: 1,
            name: "Amlodipine",
            dosage: "5mg",
            time: "08:00 AM",
            taken: true,
            prescribedBy: "Dr. Sarah Johnson",
          },
          {
            id: 2,
            name: "Vitamin C",
            dosage: "500mg",
            time: "08:00 AM",
            taken: false,
            prescribedBy: "Dr. Mike Brown",
          },
        ],
        afternoon: [
          {
            id: 3,
            name: "Paracetamol",
            dosage: "500mg",
            time: "02:00 PM",
            taken: false,
            prescribedBy: "Dr. Mike Brown",
          },
          {
            id: 4,
            name: "Aspirin",
            dosage: "75mg",
            time: "02:00 PM",
            taken: false,
            prescribedBy: "Dr. Sarah Johnson",
          },
        ],
        night: [
          {
            id: 5,
            name: "Cetirizine",
            dosage: "10mg",
            time: "09:00 PM",
            taken: false,
            prescribedBy: "Dr. Mike Brown",
          },
          {
            id: 6,
            name: "Paracetamol",
            dosage: "500mg",
            time: "09:00 PM",
            taken: false,
            prescribedBy: "Dr. Mike Brown",
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching reminders:", error);
      toast.error("Failed to load medicine reminders");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkTaken = async (period, medicineId) => {
    try {
      // await reminderService.markAsTaken(medicineId);
      setReminders((prev) => ({
        ...prev,
        [period]: prev[period].map((med) =>
          med.id === medicineId ? { ...med, taken: true } : med,
        ),
      }));
      toast.success("Medicine marked as taken!");
    } catch (error) {
      toast.error("Failed to update");
    }
  };

  const handleMarkAllTaken = async (period) => {
    const result = await Swal.fire({
      title: "Mark All as Taken?",
      text: `Mark all ${period} medicines as taken?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#0cce5d",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, mark all",
    });

    if (result.isConfirmed) {
      setReminders((prev) => ({
        ...prev,
        [period]: prev[period].map((med) => ({ ...med, taken: true })),
      }));
      toast.success(`All ${period} medicines marked as taken!`);
    }
  };

  const getProgress = () => {
    const all = [
      ...reminders.morning,
      ...reminders.afternoon,
      ...reminders.night,
    ];
    const taken = all.filter((m) => m.taken).length;
    return {
      taken,
      total: all.length,
      percentage: all.length > 0 ? Math.round((taken / all.length) * 100) : 0,
    };
  };

  const progress = getProgress();

  const ReminderSection = ({
    title,
    icon,
    medicines,
    period,
    bgColor,
    iconColor,
  }) => (
    <div className="reminder-section">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className={period}>
          <span className="icon">{icon}</span>
          {title}
          <span
            style={{
              fontSize: "0.8rem",
              fontWeight: 400,
              color: "#6c757d",
              marginLeft: "10px",
            }}
          >
            ({medicines.filter((m) => m.taken).length}/{medicines.length} taken)
          </span>
        </h3>
        {medicines.some((m) => !m.taken) && (
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => handleMarkAllTaken(period)}
          >
            Mark All Taken
          </button>
        )}
      </div>

      {medicines.length > 0 ? (
        <div className="reminder-cards">
          {medicines.map((medicine) => (
            <div
              key={medicine.id}
              className={`reminder-card ${medicine.taken ? "taken" : ""}`}
            >
              <div
                className="medicine-icon"
                style={{ background: bgColor, color: iconColor }}
              >
                <FaPills />
              </div>
              <div className="medicine-info">
                <h4>{medicine.name}</h4>
                <p>
                  {medicine.dosage} • {medicine.time}
                </p>
                <p style={{ fontSize: "0.75rem", color: "#adb5bd" }}>
                  by {medicine.prescribedBy}
                </p>
              </div>
              {medicine.taken ? (
                <span
                  className="badge badge-success"
                  style={{ display: "flex", alignItems: "center", gap: "4px" }}
                >
                  <FiCheck /> Taken
                </span>
              ) : (
                <button
                  className="btn btn-primary btn-sm taken-btn"
                  onClick={() => handleMarkTaken(period, medicine.id)}
                >
                  Mark Taken
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-3" style={{ color: "#6c757d" }}>
          No medicines scheduled
        </div>
      )}
    </div>
  );

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
    <div className="medicine-reminder-page">
      {/* Header with Date Picker */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-md-6 mb-3 mb-md-0">
              <h2 style={{ marginBottom: "5px" }}>Medicine Tracker</h2>
              <p style={{ color: "#6c757d", margin: 0 }}>
                Track your daily medication intake
              </p>
            </div>
            <div className="col-md-6">
              <div className="d-flex align-items-center justify-content-md-end gap-3">
                <input
                  type="date"
                  className="form-control"
                  style={{ maxWidth: "200px" }}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Card */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-md-8 mb-3 mb-md-0">
              <h4 style={{ marginBottom: "15px" }}>Today's Progress</h4>
              <div
                className="progress"
                style={{ height: "20px", borderRadius: "10px" }}
              >
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{
                    width: `${progress.percentage}%`,
                    background: "linear-gradient(135deg, #0cce5d, #069494)",
                    borderRadius: "10px",
                  }}
                >
                  {progress.percentage}%
                </div>
              </div>
              <p
                style={{
                  color: "#6c757d",
                  marginTop: "10px",
                  marginBottom: 0,
                  fontSize: "0.9rem",
                }}
              >
                {progress.taken} of {progress.total} medicines taken
              </p>
            </div>
            <div className="col-md-4 text-md-end">
              <div
                style={{
                  display: "inline-block",
                  padding: "20px 30px",
                  background:
                    progress.percentage === 100 ? "#e8faf0" : "#fff8e1",
                  borderRadius: "12px",
                  textAlign: "center",
                }}
              >
                <p
                  style={{
                    fontSize: "2rem",
                    fontWeight: 700,
                    margin: 0,
                    color: progress.percentage === 100 ? "#0cce5d" : "#f57c00",
                  }}
                >
                  {progress.percentage}%
                </p>
                <p style={{ fontSize: "0.8rem", color: "#6c757d", margin: 0 }}>
                  Complete
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Morning Medicines */}
      <ReminderSection
        title="Morning"
        icon={<FiSunrise />}
        medicines={reminders.morning}
        period="morning"
        bgColor="#fff8e1"
        iconColor="#f57c00"
      />

      {/* Afternoon Medicines */}
      <ReminderSection
        title="Afternoon"
        icon={<FiSun />}
        medicines={reminders.afternoon}
        period="afternoon"
        bgColor="#e3f2fd"
        iconColor="#1976d2"
      />

      {/* Night Medicines */}
      <ReminderSection
        title="Night"
        icon={<FiMoon />}
        medicines={reminders.night}
        period="night"
        bgColor="#ede7f6"
        iconColor="#7b1fa2"
      />

      {progress.total === 0 && (
        <div className="card">
          <div className="empty-state">
            <FaPills className="icon" style={{ fontSize: "3rem" }} />
            <h3>No Medicines Scheduled</h3>
            <p>You don't have any medicines scheduled for this date</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicineReminder;
