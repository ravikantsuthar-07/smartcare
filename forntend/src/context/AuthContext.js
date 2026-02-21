import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setIsAuthenticated(true);
      // Get user from localStorage if available
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
    setLoading(false);
  };

  const sendOTP = async (mobile, purpose = "login") => {
    try {
      const response = await api.post("/auth/send", { mobile: Number(mobile) });

      // In development, show OTP in toast for testing
      if (response.data.dev_otp) {
        toast.info(`Dev OTP: ${response.data.dev_otp}`, { autoClose: 10000 });
      }

      toast.success("OTP sent to your mobile!");
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
      throw error;
    }
  };

  const verifyOTP = async (identifier, otp, userData = null) => {
    try {
      // Verify the OTP with mobile and otp
      const verifyResponse = await api.post("/auth/verify", {
        mobile: Number(identifier),
        otp: Number(otp),
      });

      // Get response data - handle both response.data and response.data.data structures
      const responseData = verifyResponse.data.data || verifyResponse.data;

      // Check if verification was successful
      if (!verifyResponse.data.success && !responseData.token) {
        throw new Error("OTP verification failed");
      }

      // Extract token and user from response
      // Handle backend response structure where user data might be in 'auth'
      const { token, user: responseUser, auth } = responseData;
      const loggedInUser = responseUser || auth;

      if (token) {
        localStorage.setItem("token", token);
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      if (loggedInUser) {
        localStorage.setItem("user", JSON.stringify(loggedInUser));
        setUser(loggedInUser);
        setIsAuthenticated(true);
      }

      // Show success notification
      const isRegistration = userData !== null;
      toast.success(isRegistration ? "Registration successful!" : "Login successful!");

      // Redirect to main dashboard to let App.js handle role-based routing
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 100);

      return verifyResponse.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP");
      throw error;
    }
  };

  const registerPatient = async (patientData) => {
    try {
      // First send OTP for registration
      await api.post("/auth/send-otp", {
        email: patientData.email,
        purpose: "register",
      });
      toast.success("OTP sent to your email!");
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
      throw error;
    }
  };

  const registerDoctor = async (doctorData) => {
    try {
      // First send OTP for registration
      await api.post("/auth/send-otp", {
        email: doctorData.email,
        purpose: "register",
      });
      toast.success("OTP sent to your email!");
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
    setIsAuthenticated(false);
    navigate("/");
    toast.info("Logged out successfully");
  };

  const updateUser = (updatedData) => {
    setUser((prev) => ({ ...prev, ...updatedData }));
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    sendOTP,
    verifyOTP,
    registerPatient,
    registerDoctor,
    logout,
    updateUser,
    checkAuth,
    setUser,
    setIsAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
