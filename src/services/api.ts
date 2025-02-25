/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "./axios";


export const api = {
  signUp: async (email: string, password: string) => {
    const { data } = await axios.post("/auth/signup", { email, password });
    return data;
  },

  login: async (email: string, password: string) => {
    try {
      const { data } = await axios.post("/auth/login", { email, password });
      if (!data.token) {
        throw new Error("Token not received from server");
      }

      localStorage.setItem("userData", JSON.stringify(data));
      return data;
    } catch (error: any) {
      throw new Error(error.message || "Login failed");
    }
  },

  verifyOTP: async (email: string, otp: string) => {
    try {
      const { data } = await axios.post("/auth/verify-otp", { email, otp });
      if (!data.token) {
        throw new Error("Token not received from server");
      }
      return data;
    } catch (error: any) {
      throw new Error(error.message || "OTP verification failed");
    }
  },

  // Forgot password endpoints
  requestPasswordReset: async (email: string) => {
    try {
      const { data } = await axios.post("/auth/forgot-password", { email });
      return data;
    } catch (error: any) {
      throw new Error(error.message || "Failed to request password reset");
    }
  },

  resetPassword: async (email: string, otp: string, newPassword: string) => {
    try {
      const { data } = await axios.post("/auth/reset-password", {
        email,
        otp,
        newPassword,
      });
      return data;
    } catch (error: any) {
      throw new Error(error.message || "Failed to reset password");
    }
  },

  // Profile endpoints
  getProfile: async () => {
    try {
      const { data } = await axios.get("/profile");
      if (!data) {
        throw new Error("No profile data received");
      }
      return data;
    } catch (error: any) {
      console.error("Profile fetch error:", error);
      throw new Error(error.message || "Failed to fetch profile");
    }
  },

  updatePersonalInfo: async (data: PersonalInfoData) => {
    const response = await axios.put("api/update-profile", data);
    return response.data;
  },

  updatePassword: async (oldPassword: string, newPassword: string) => {
    const response = await axios.put("api/update-profile", {
      oldPassword,
      newPassword,
    });
    return response.data;
  },

  updateBankDetails: async (data: BankAccountData) => {
    const response = await axios.put("api/update-profile", data);
    return response.data;
  },
};



interface BankAccountData {
  accountHolder: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
}



interface PersonalInfoData {
  fullName: string;
  email: string;
}
