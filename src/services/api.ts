/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "./axios";
import { toast } from "react-toastify";

const ENDPOINT = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

export const api = {
  signUp: async (email: string, password: string, fullName: string) => {
    const { data } = await axios.post(`${ENDPOINT}/auth/signup`, {
      email,
      password,
      fullName
    });
    return data;
  },

  login: async (email: string, password: string) => {
    try {
      const { data } = await axios.post(`${ENDPOINT}/auth/login`, {
        email,
        password,
      });
      if (!data) {
        toast.error(`Token not received from server`);
      }

      localStorage.setItem(`userData`, JSON.stringify(data));
      return data;
    } catch (error: any) {
      toast.error(`Login failed`);
      throw new Error(error.message || `Login Failed`);
    }
  },

  verifyOTP: async (email: string, otp: string) => {
    try {
      const { data } = await axios.post(`${ENDPOINT}/auth/verify-otp`, {
        email,
        otp,
      });
      if (!data.token) {
        throw new Error(`Token not received from server`);
      }
      return data;
    } catch (error: any) {
      throw new Error(error.message || `OTP verification failed`);
    }
  },





  // Forgot password endpoints
  requestPasswordReset: async (email: string) => {
    try {
      const { data } = await axios.post(`${ENDPOINT}/auth/forgot-password`, {
        email,
      });
      return data;
    } catch (error: any) {
      throw new Error(error.message || `Failed to request password reset`);
    }
  },

  resetPassword: async (email: string, otp: string, newPassword: string) => {
    try {
      const { data } = await axios.post(`${ENDPOINT}/auth/reset-password`, {
        email,
        otp,
        newPassword,
      });
      return data;
    } catch (error: any) {
      throw new Error(error.message || `Failed to reset password`);
    }
  },

  // Profile endpoints
  getProfile: async () => {
    try {
      const { data } = await axios.get(`${ENDPOINT}/profile`);
     
      return data;
    } catch (error: any) {
      console.error(`Profile fetch error:`, error);
      throw new Error(error.message || `Failed to fetch profile`);
    }
  },

  getUsers: async () => {
    try {
      const { data } = await axios.get(`${ENDPOINT}/auth/users`);
      if (!data) {
        throw new Error(`No users data received`);
      }
      return data;
    } catch (error: any) {
      console.error(`users fetch error:`, error);
      throw new Error(error.message || `Failed to fetch users`);
    }
  },

  updatePersonalInfo: async (data: any) => {
    const response = await axios.put(`${ENDPOINT}/auth/update-profile`, data);
    return response.data;
  },

  updatePassword: async (oldPassword: string, newPassword: string) => {
    const response = await axios.put(`${ENDPOINT}/auth/update-profile`, {
      oldPassword,
      newPassword,
    });
    return response.data;
  },

  updateBankDetails: async (data: BankAccountData) => {
    const response = await axios.put(`${ENDPOINT}/auth/update-profile`, data);
    return response.data;
  },


  updateTransactions: async (data: string) => {
    const response = await axios.put(`${ENDPOINT}/auth/update-transactions`, data);
    return response.data;
  },
};

interface BankAccountData {
  accountHolder: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
}



