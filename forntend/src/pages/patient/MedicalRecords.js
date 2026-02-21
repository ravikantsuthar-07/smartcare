import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  FiUpload,
  FiDownload,
  FiTrash2,
  FiEye,
  FiFile,
  FiImage,
} from "react-icons/fi";
import { medicalRecordService } from "../../services/dataService";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const MedicalRecords = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [filter, setFilter] = useState("all");
  const fileInputRef = useRef(null);

  const recordTypes = [
    { key: "all", label: "All Records" },
    { key: "blood_test", label: "Blood Tests" },
    { key: "scan", label: "Scans & X-rays" },
    { key: "report", label: "Medical Reports" },
    { key: "prescription", label: "Prescriptions" },
    { key: "other", label: "Other" },
  ];

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      // Mock data
      setRecords([
        {
          id: 1,
          name: "Blood Test Report",
          type: "blood_test",
          date: "2026-01-25",
          fileType: "pdf",
          size: "245 KB",
        },
        {
          id: 2,
          name: "Chest X-Ray",
          type: "scan",
          date: "2026-01-20",
          fileType: "image",
          size: "1.2 MB",
        },
        {
          id: 3,
          name: "ECG Report",
          type: "report",
          date: "2026-01-15",
          fileType: "pdf",
          size: "180 KB",
        },
        {
          id: 4,
          name: "Lipid Profile",
          type: "blood_test",
          date: "2026-01-10",
          fileType: "pdf",
          size: "156 KB",
        },
        {
          id: 5,
          name: "MRI Scan Brain",
          type: "scan",
          date: "2026-01-05",
          fileType: "image",
          size: "3.5 MB",
        },
        {
          id: 6,
          name: "Vaccination Record",
          type: "other",
          date: "2025-12-20",
          fileType: "pdf",
          size: "98 KB",
        },
      ]);
    } catch (error) {
      console.error("Error fetching records:", error);
      toast.error("Failed to load medical records");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/jpg",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload PDF or image files only");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size should be less than 10MB");
      return;
    }

    const { value: recordType } = await Swal.fire({
      title: "Select Record Type",
      input: "select",
      inputOptions: {
        blood_test: "Blood Test",
        scan: "Scan / X-ray",
        report: "Medical Report",
        prescription: "Prescription",
        other: "Other",
      },
      inputPlaceholder: "Select a category",
      showCancelButton: true,
      confirmButtonColor: "#0cce5d",
    });

    if (!recordType) return;

    setUploading(true);
    try {
      // Simulate upload
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const newRecord = {
        id: Date.now(),
        name: file.name,
        type: recordType,
        date: new Date().toISOString().split("T")[0],
        fileType: file.type.includes("pdf") ? "pdf" : "image",
        size: (file.size / 1024).toFixed(0) + " KB",
      };

      setRecords((prev) => [newRecord, ...prev]);
      toast.success("Record uploaded successfully!");
    } catch (error) {
      toast.error("Failed to upload record");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDelete = async (recordId) => {
    const result = await Swal.fire({
      title: "Delete Record?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it",
    });

    if (result.isConfirmed) {
      try {
        // await medicalRecordService.deleteRecord(recordId);
        setRecords((prev) => prev.filter((r) => r.id !== recordId));
        toast.success("Record deleted successfully");
      } catch (error) {
        toast.error("Failed to delete record");
      }
    }
  };

  const handleDownload = (record) => {
    toast.info(`Downloading ${record.name}...`);
    // Implement actual download
  };

  const handleView = (record) => {
    toast.info(`Opening ${record.name}...`);
    // Implement actual view
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getTypeLabel = (type) => {
    const typeObj = recordTypes.find((t) => t.key === type);
    return typeObj ? typeObj.label : type;
  };

  const filteredRecords =
    filter === "all" ? records : records.filter((r) => r.type === filter);

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
    <div className="medical-records-page">
      {/* Upload Section */}
      <div className="card mb-4">
        <div className="card-body">
          <div
            className="upload-zone"
            onClick={() => fileInputRef.current?.click()}
            style={{
              opacity: uploading ? 0.6 : 1,
              pointerEvents: uploading ? "none" : "auto",
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleUpload}
              style={{ display: "none" }}
            />
            {uploading ? (
              <>
                <div className="spinner-border text-primary mb-3" role="status">
                  <span className="visually-hidden">Uploading...</span>
                </div>
                <h4>Uploading...</h4>
                <p>Please wait while your file is being uploaded</p>
              </>
            ) : (
              <>
                <FiUpload className="icon" />
                <h4>Upload Medical Records</h4>
                <p>Drag & drop files here or click to browse</p>
                <p style={{ fontSize: "0.8rem", color: "#adb5bd" }}>
                  Supported: PDF, JPG, PNG (Max 10MB)
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="card mb-4">
        <div className="card-body py-3">
          <div className="d-flex gap-2 flex-wrap">
            {recordTypes.map((type) => (
              <button
                key={type.key}
                className={`btn btn-sm ${filter === type.key ? "btn-primary" : "btn-light"}`}
                onClick={() => setFilter(type.key)}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Records Grid */}
      {filteredRecords.length > 0 ? (
        <div className="records-grid">
          {filteredRecords.map((record) => (
            <div key={record.id} className="record-card">
              <div className="record-icon">
                {record.fileType === "pdf" ? <FiFile /> : <FiImage />}
              </div>
              <h4>{record.name}</h4>
              <span className="record-type">{getTypeLabel(record.type)}</span>
              <p>
                {formatDate(record.date)} • {record.size}
              </p>
              <div className="record-actions">
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => handleView(record)}
                  title="View"
                >
                  <FiEye />
                </button>
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => handleDownload(record)}
                  title="Download"
                >
                  <FiDownload />
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleDelete(record.id)}
                  title="Delete"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card">
          <div className="empty-state">
            <FiFile className="icon" />
            <h3>No Records Found</h3>
            <p>
              {filter === "all"
                ? "You haven't uploaded any medical records yet"
                : `No ${getTypeLabel(filter).toLowerCase()} found`}
            </p>
            <button
              className="btn btn-primary"
              onClick={() => fileInputRef.current?.click()}
            >
              <FiUpload /> Upload Record
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalRecords;
