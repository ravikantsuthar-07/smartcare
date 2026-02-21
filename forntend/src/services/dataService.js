import api from "./api";

// Appointment Services
export const appointmentService = {
  // Get all appointments for a user
  getAppointments: async (userId, params = {}) => {
    const response = await api.get(`/appointments/${userId}`, { params });
    return response.data;
  },

  // Get single appointment
  getAppointment: async (id) => {
    const response = await api.get(`/appointments/detail/${id}`);
    return response.data;
  },

  // Create new appointment
  createAppointment: async (data) => {
    const response = await api.post("/appointments", data);
    return response.data;
  },

  // Update appointment
  updateAppointment: async (id, data) => {
    const response = await api.put(`/appointments/${id}`, data);
    return response.data;
  },

  // Cancel appointment
  cancelAppointment: async (id) => {
    const response = await api.put(`/appointments/${id}/cancel`);
    return response.data;
  },

  // Complete appointment
  completeAppointment: async (id) => {
    const response = await api.put(`/appointments/${id}/complete`);
    return response.data;
  },

  // Get available slots
  getAvailableSlots: async (doctorId, date) => {
    const response = await api.get(`/appointments/slots/${doctorId}`, {
      params: { date },
    });
    return response.data;
  },
};

// Queue Services
export const queueService = {
  // Get queue for a doctor
  getDoctorQueue: async (doctorId) => {
    const response = await api.get(`/queue/${doctorId}`);
    return response.data;
  },

  // Get patient's position in queue
  getPatientQueuePosition: async (appointmentId) => {
    const response = await api.get(`/queue/position/${appointmentId}`);
    return response.data;
  },

  // Update queue position
  updateQueuePosition: async (id, position) => {
    const response = await api.put(`/queue/${id}`, { position });
    return response.data;
  },

  // Call next patient
  callNextPatient: async (doctorId) => {
    const response = await api.post(`/queue/${doctorId}/next`);
    return response.data;
  },
};

// Prescription Services
export const prescriptionService = {
  // Get prescriptions for a patient
  getPatientPrescriptions: async (patientId) => {
    const response = await api.get(`/prescriptions/${patientId}`);
    return response.data;
  },

  // Get single prescription
  getPrescription: async (id) => {
    const response = await api.get(`/prescriptions/detail/${id}`);
    return response.data;
  },

  // Create prescription
  createPrescription: async (data) => {
    const response = await api.post("/prescriptions", data);
    return response.data;
  },

  // Download prescription as PDF
  downloadPrescription: async (id) => {
    const response = await api.get(`/prescriptions/${id}/download`, {
      responseType: "blob",
    });
    return response.data;
  },
};

// Medical Records Services
export const medicalRecordService = {
  // Get patient records
  getPatientRecords: async (patientId) => {
    const response = await api.get(`/records/${patientId}`);
    return response.data;
  },

  // Upload record
  uploadRecord: async (formData) => {
    const response = await api.post("/records/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Delete record
  deleteRecord: async (id) => {
    const response = await api.delete(`/records/${id}`);
    return response.data;
  },

  // Download record
  downloadRecord: async (id) => {
    const response = await api.get(`/records/${id}/download`, {
      responseType: "blob",
    });
    return response.data;
  },
};

// Doctor Services
export const doctorService = {
  // Get all doctors
  getAllDoctors: async (params = {}) => {
    const response = await api.get("/doctors", { params });
    return response.data;
  },

  // Get doctor by ID
  getDoctor: async (id) => {
    const response = await api.get(`/doctors/${id}`);
    return response.data;
  },

  // Get doctor's patients
  getDoctorPatients: async (doctorId) => {
    const response = await api.get(`/doctors/${doctorId}/patients`);
    return response.data;
  },

  // Update doctor profile
  updateProfile: async (id, data) => {
    const response = await api.put(`/doctors/${id}`, data);
    return response.data;
  },
};

// Patient Services
export const patientService = {
  // Get patient by ID
  getPatient: async (id) => {
    const response = await api.get(`/patients/${id}`);
    return response.data;
  },

  // Get patient history
  getPatientHistory: async (patientId) => {
    const response = await api.get(`/patients/${patientId}/history`);
    return response.data;
  },

  // Update patient profile
  updateProfile: async (id, data) => {
    const response = await api.put(`/patients/${id}`, data);
    return response.data;
  },
};

// Notification Services
export const notificationService = {
  // Get user notifications
  getNotifications: async (userId) => {
    const response = await api.get(`/notifications/${userId}`);
    return response.data;
  },

  // Mark as read
  markAsRead: async (id) => {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
  },

  // Mark all as read
  markAllAsRead: async (userId) => {
    const response = await api.put(`/notifications/${userId}/read-all`);
    return response.data;
  },

  // Delete notification
  deleteNotification: async (id) => {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  },
};

// Medicine Reminder Services
export const reminderService = {
  // Get today's reminders
  getTodayReminders: async (patientId) => {
    const response = await api.get(`/reminders/${patientId}/today`);
    return response.data;
  },

  // Mark medicine as taken
  markAsTaken: async (reminderId) => {
    const response = await api.put(`/reminders/${reminderId}/taken`);
    return response.data;
  },

  // Get reminder history
  getReminderHistory: async (patientId, date) => {
    const response = await api.get(`/reminders/${patientId}/history`, {
      params: { date },
    });
    return response.data;
  },
};

// Dashboard Services
export const dashboardService = {
  // Get patient dashboard data
  getPatientDashboard: async (patientId) => {
    const response = await api.get(`/dashboard/patient/${patientId}`);
    return response.data;
  },

  // Get doctor dashboard data
  getDoctorDashboard: async (doctorId) => {
    const response = await api.get(`/dashboard/doctor/${doctorId}`);
    return response.data;
  },
};
