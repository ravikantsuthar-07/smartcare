import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { FiClock, FiRefreshCw, FiUser } from "react-icons/fi";
import { queueService } from "../../services/dataService";

const QueueViewer = () => {
  const { user } = useAuth();
  const [queueData, setQueueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    fetchQueueData();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchQueueData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchQueueData = async () => {
    try {
      // Mock data
      setQueueData({
        position: 3,
        doctorName: "Dr. Sarah Johnson",
        specialization: "Cardiologist",
        estimatedTime: "15 mins",
        appointmentTime: "10:30 AM",
        currentPatient: 1,
        totalInQueue: 8,
        status: "in-queue",
      });
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching queue data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchQueueData();
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

  if (!queueData || queueData.status !== "in-queue") {
    return (
      <div className="card">
        <div className="empty-state">
          <FiClock className="icon" />
          <h3>No Active Queue</h3>
          <p>You're not currently in any queue. Book an appointment to join.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="queue-viewer">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Live Queue Status</h2>
          <p style={{ color: "#6c757d", margin: 0 }}>
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>
        <button className="btn btn-outline-primary" onClick={handleRefresh}>
          <FiRefreshCw /> Refresh
        </button>
      </div>

      <div className="row">
        {/* Main Queue Card */}
        <div className="col-lg-6 mb-4">
          <div className="card">
            <div className="card-body text-center py-5">
              <h4 style={{ color: "#6c757d", marginBottom: "20px" }}>
                Your Position
              </h4>
              <div className="queue-number" style={{ margin: "0 auto 25px" }}>
                {queueData.position}
              </div>
              <h3 style={{ marginBottom: "5px" }}>{queueData.doctorName}</h3>
              <p
                style={{
                  color: "#069494",
                  fontWeight: 500,
                  marginBottom: "20px",
                }}
              >
                {queueData.specialization}
              </p>

              <div className="d-flex justify-content-center gap-4 mb-4">
                <div>
                  <p
                    style={{
                      color: "#6c757d",
                      fontSize: "0.85rem",
                      marginBottom: "5px",
                    }}
                  >
                    Appointment
                  </p>
                  <p style={{ fontWeight: 600, margin: 0 }}>
                    {queueData.appointmentTime}
                  </p>
                </div>
                <div style={{ width: "1px", background: "#e9ecef" }}></div>
                <div>
                  <p
                    style={{
                      color: "#6c757d",
                      fontSize: "0.85rem",
                      marginBottom: "5px",
                    }}
                  >
                    Est. Wait
                  </p>
                  <p style={{ fontWeight: 600, margin: 0, color: "#069494" }}>
                    {queueData.estimatedTime}
                  </p>
                </div>
              </div>

              <div
                className="alert"
                style={{
                  background: "#fff8e1",
                  border: "none",
                  color: "#f57c00",
                }}
              >
                <strong>Tip:</strong> Stay near the clinic. You'll be notified
                when it's your turn!
              </div>
            </div>
          </div>
        </div>

        {/* Queue Details */}
        <div className="col-lg-6 mb-4">
          <div className="card h-100">
            <div className="card-header">
              <h3>Queue Overview</h3>
            </div>
            <div className="card-body">
              {/* Progress */}
              <div className="mb-4">
                <div className="d-flex justify-content-between mb-2">
                  <span style={{ fontSize: "0.85rem", color: "#6c757d" }}>
                    Queue Progress
                  </span>
                  <span style={{ fontSize: "0.85rem", fontWeight: 500 }}>
                    {queueData.currentPatient} of {queueData.totalInQueue}{" "}
                    patients
                  </span>
                </div>
                <div
                  className="progress"
                  style={{ height: "10px", borderRadius: "5px" }}
                >
                  <div
                    className="progress-bar"
                    role="progressbar"
                    style={{
                      width: `${(queueData.currentPatient / queueData.totalInQueue) * 100}%`,
                      background: "#0cce5d",
                    }}
                  ></div>
                </div>
              </div>

              {/* Stats */}
              <div className="row g-3">
                <div className="col-6">
                  <div
                    className="p-3 rounded"
                    style={{ background: "#e8faf0" }}
                  >
                    <p
                      style={{
                        color: "#6c757d",
                        fontSize: "0.8rem",
                        marginBottom: "5px",
                      }}
                    >
                      Current Patient
                    </p>
                    <p
                      style={{
                        fontSize: "1.5rem",
                        fontWeight: 600,
                        color: "#0cce5d",
                        margin: 0,
                      }}
                    >
                      #{queueData.currentPatient}
                    </p>
                  </div>
                </div>
                <div className="col-6">
                  <div
                    className="p-3 rounded"
                    style={{ background: "#e6f5f5" }}
                  >
                    <p
                      style={{
                        color: "#6c757d",
                        fontSize: "0.8rem",
                        marginBottom: "5px",
                      }}
                    >
                      Patients Ahead
                    </p>
                    <p
                      style={{
                        fontSize: "1.5rem",
                        fontWeight: 600,
                        color: "#069494",
                        margin: 0,
                      }}
                    >
                      {queueData.position - 1}
                    </p>
                  </div>
                </div>
                <div className="col-6">
                  <div
                    className="p-3 rounded"
                    style={{ background: "#fff8e1" }}
                  >
                    <p
                      style={{
                        color: "#6c757d",
                        fontSize: "0.8rem",
                        marginBottom: "5px",
                      }}
                    >
                      Your Position
                    </p>
                    <p
                      style={{
                        fontSize: "1.5rem",
                        fontWeight: 600,
                        color: "#f57c00",
                        margin: 0,
                      }}
                    >
                      #{queueData.position}
                    </p>
                  </div>
                </div>
                <div className="col-6">
                  <div
                    className="p-3 rounded"
                    style={{ background: "#f1f3f5" }}
                  >
                    <p
                      style={{
                        color: "#6c757d",
                        fontSize: "0.8rem",
                        marginBottom: "5px",
                      }}
                    >
                      Total in Queue
                    </p>
                    <p
                      style={{
                        fontSize: "1.5rem",
                        fontWeight: 600,
                        color: "#495057",
                        margin: 0,
                      }}
                    >
                      {queueData.totalInQueue}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div
                className="mt-4 p-3 rounded text-center"
                style={{ background: "#e8faf0" }}
              >
                <span className="status-badge confirmed">
                  <FiUser /> In Queue
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="card">
        <div className="card-body">
          <h4>How it works</h4>
          <div className="row mt-3">
            <div className="col-md-4 text-center mb-3">
              <div
                className="mx-auto mb-2 d-flex align-items-center justify-content-center"
                style={{
                  width: "50px",
                  height: "50px",
                  background: "#e8faf0",
                  borderRadius: "50%",
                  color: "#0cce5d",
                }}
              >
                1
              </div>
              <h5 style={{ fontSize: "0.95rem" }}>Real-time Updates</h5>
              <p style={{ color: "#6c757d", fontSize: "0.85rem" }}>
                Queue position updates automatically every 30 seconds
              </p>
            </div>
            <div className="col-md-4 text-center mb-3">
              <div
                className="mx-auto mb-2 d-flex align-items-center justify-content-center"
                style={{
                  width: "50px",
                  height: "50px",
                  background: "#e6f5f5",
                  borderRadius: "50%",
                  color: "#069494",
                }}
              >
                2
              </div>
              <h5 style={{ fontSize: "0.95rem" }}>Get Notified</h5>
              <p style={{ color: "#6c757d", fontSize: "0.85rem" }}>
                Receive a notification when you're next in line
              </p>
            </div>
            <div className="col-md-4 text-center mb-3">
              <div
                className="mx-auto mb-2 d-flex align-items-center justify-content-center"
                style={{
                  width: "50px",
                  height: "50px",
                  background: "#fff8e1",
                  borderRadius: "50%",
                  color: "#f57c00",
                }}
              >
                3
              </div>
              <h5 style={{ fontSize: "0.95rem" }}>Be Ready</h5>
              <p style={{ color: "#6c757d", fontSize: "0.85rem" }}>
                Arrive at the clinic when it's almost your turn
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueueViewer;
