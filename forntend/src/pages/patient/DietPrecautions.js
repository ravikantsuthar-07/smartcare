import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { FiCheckCircle, FiHeart, FiAlertCircle } from "react-icons/fi";
import { FaAppleAlt, FaBan, FaRunning } from "react-icons/fa";

const DietPrecautions = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkedItems, setCheckedItems] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Mock data
      setData({
        diet: {
          recommended: [
            "Fresh fruits and vegetables daily",
            "Whole grains like oats, brown rice",
            "Lean proteins - fish, chicken, legumes",
            "Low-fat dairy products",
            "Plenty of water (8-10 glasses/day)",
          ],
          avoid: [
            "Processed and fried foods",
            "Excessive salt and sugar",
            "Red meat in large quantities",
            "Carbonated beverages",
            "Alcohol consumption",
          ],
        },
        precautions: [
          {
            id: 1,
            text: "Take medicines on time as prescribed",
            priority: "high",
          },
          { id: 2, text: "Monitor blood pressure daily", priority: "high" },
          { id: 3, text: "Avoid stressful situations", priority: "medium" },
          {
            id: 4,
            text: "Get at least 7-8 hours of sleep",
            priority: "medium",
          },
          {
            id: 5,
            text: "Light exercise for 30 minutes daily",
            priority: "low",
          },
        ],
        lifestyle: [
          { id: 1, text: "Morning walk for 20-30 minutes", done: false },
          { id: 2, text: "Practice deep breathing exercises", done: false },
          { id: 3, text: "Avoid screen time before bed", done: false },
          { id: 4, text: "Maintain regular sleep schedule", done: false },
        ],
        doctorNotes:
          "Patient should focus on cardiovascular health. Regular monitoring recommended. Follow-up in 4 weeks.",
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheck = (itemId) => {
    setCheckedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
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

  if (!data) {
    return (
      <div className="card">
        <div className="empty-state">
          <FiHeart className="icon" />
          <h3>No Guidelines Available</h3>
          <p>
            Your doctor hasn't provided any diet or precaution guidelines yet
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="diet-precautions-page">
      {/* Doctor's Notes */}
      {data.doctorNotes && (
        <div
          className="card mb-4"
          style={{
            background: "linear-gradient(135deg, #1a1a2e, #2d2d44)",
            color: "white",
          }}
        >
          <div className="card-body">
            <h3 style={{ color: "white", marginBottom: "15px" }}>
              <FiAlertCircle style={{ marginRight: "10px" }} />
              Doctor's Instructions
            </h3>
            <p
              style={{
                margin: 0,
                fontSize: "1rem",
                color: "rgba(255,255,255,0.9)",
              }}
            >
              {data.doctorNotes}
            </p>
          </div>
        </div>
      )}

      <div className="row">
        {/* Diet Recommendations */}
        <div className="col-lg-6 mb-4">
          <div className="card h-100">
            <div className="card-header" style={{ background: "#e8faf0" }}>
              <h3
                style={{
                  color: "#0cce5d",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <FaAppleAlt /> Recommended Diet
              </h3>
            </div>
            <div className="card-body">
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {data.diet.recommended.map((item, index) => (
                  <li
                    key={index}
                    style={{
                      padding: "12px 0",
                      borderBottom:
                        index < data.diet.recommended.length - 1
                          ? "1px solid #e9ecef"
                          : "none",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "12px",
                    }}
                  >
                    <FiCheckCircle
                      style={{
                        color: "#0cce5d",
                        marginTop: "3px",
                        flexShrink: 0,
                      }}
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Foods to Avoid */}
        <div className="col-lg-6 mb-4">
          <div className="card h-100">
            <div className="card-header" style={{ background: "#ffebee" }}>
              <h3
                style={{
                  color: "#dc3545",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <FaBan /> Foods to Avoid
              </h3>
            </div>
            <div className="card-body">
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {data.diet.avoid.map((item, index) => (
                  <li
                    key={index}
                    style={{
                      padding: "12px 0",
                      borderBottom:
                        index < data.diet.avoid.length - 1
                          ? "1px solid #e9ecef"
                          : "none",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "12px",
                    }}
                  >
                    <FaBan
                      style={{
                        color: "#dc3545",
                        marginTop: "3px",
                        flexShrink: 0,
                      }}
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Precautions */}
        <div className="col-lg-6 mb-4">
          <div className="card h-100">
            <div className="card-header">
              <h3>
                <FiAlertCircle style={{ marginRight: "10px" }} /> Precautions
              </h3>
            </div>
            <div className="card-body">
              {data.precautions.map((item) => (
                <div
                  key={item.id}
                  style={{
                    padding: "15px",
                    background: "#f8f9fa",
                    borderRadius: "8px",
                    marginBottom: "10px",
                    display: "flex",
                    alignItems: "center",
                    gap: "15px",
                  }}
                >
                  <span
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      background:
                        item.priority === "high"
                          ? "#dc3545"
                          : item.priority === "medium"
                            ? "#ffc107"
                            : "#0cce5d",
                      flexShrink: 0,
                    }}
                  ></span>
                  <span style={{ flex: 1 }}>{item.text}</span>
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: "15px",
                      fontSize: "0.7rem",
                      fontWeight: 500,
                      textTransform: "uppercase",
                      background:
                        item.priority === "high"
                          ? "#ffebee"
                          : item.priority === "medium"
                            ? "#fff8e1"
                            : "#e8faf0",
                      color:
                        item.priority === "high"
                          ? "#dc3545"
                          : item.priority === "medium"
                            ? "#f57c00"
                            : "#0cce5d",
                    }}
                  >
                    {item.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Daily Lifestyle Checklist */}
        <div className="col-lg-6 mb-4">
          <div className="card h-100">
            <div className="card-header">
              <h3>
                <FaRunning style={{ marginRight: "10px" }} /> Daily Checklist
              </h3>
            </div>
            <div className="card-body">
              {data.lifestyle.map((item) => (
                <div
                  key={item.id}
                  style={{
                    padding: "15px",
                    background: checkedItems[item.id] ? "#e8faf0" : "#f8f9fa",
                    borderRadius: "8px",
                    marginBottom: "10px",
                    display: "flex",
                    alignItems: "center",
                    gap: "15px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onClick={() => handleCheck(item.id)}
                >
                  <div
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      border: checkedItems[item.id]
                        ? "none"
                        : "2px solid #ced4da",
                      background: checkedItems[item.id] ? "#0cce5d" : "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      flexShrink: 0,
                    }}
                  >
                    {checkedItems[item.id] && <FiCheckCircle size={14} />}
                  </div>
                  <span
                    style={{
                      flex: 1,
                      textDecoration: checkedItems[item.id]
                        ? "line-through"
                        : "none",
                      color: checkedItems[item.id] ? "#6c757d" : "#1a1a2e",
                    }}
                  >
                    {item.text}
                  </span>
                </div>
              ))}

              <div
                className="mt-3 p-3 rounded text-center"
                style={{ background: "#f8f9fa" }}
              >
                <p style={{ margin: 0, color: "#6c757d", fontSize: "0.9rem" }}>
                  Completed:{" "}
                  {Object.values(checkedItems).filter(Boolean).length} /{" "}
                  {data.lifestyle.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DietPrecautions;
