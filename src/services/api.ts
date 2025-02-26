/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "./axios";


  const ENDPOINT = `https://lesspay-backend-1.onrender.com`
  // const ENDPOINT = `http://localhost:5000`;

export const api = {
  signUp: async (email: string, password: string) => {
    const { data } = await axios.post(`${ENDPOINT}/auth/signup`, { email, password });
    return data;
  },

  login: async (email: string, password: string) => {
    try {
      const { data } = await axios.post(`${ENDPOINT}/auth/login`, { email, password });
      if (!data.token) {
        throw new Error(`Token not received from server`);
      }

      localStorage.setItem(`userData`, JSON.stringify(data));
      return data;
    } catch (error: any) {
      throw new Error(error.message || `Login failed`);
    }
  },

  verifyOTP: async (email: string, otp: string) => {
    try {
      const { data } = await axios.post(`${ENDPOINT}/auth/verify-otp`, { email, otp });
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
      const { data } = await axios.post(`${ENDPOINT}/auth/forgot-password`, { email });
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
      if (!data) {
        console.log("🚀 ~ getProfile: ~ data:", data)
        throw new Error(`No profile data received`);
      }
      return data;
    } catch (error: any) {
      console.error(`Profile fetch error:`, error);
      throw new Error(error.message || `Failed to fetch profile`);
    }
  },


  getUsers: async () => {
    try {
      const { data } = await axios.get(`${ENDPOINT}/api/users`);
      if (!data) {
        throw new Error(`No users data received`);
      }
      return data;
    } catch (error: any) {
      console.error(`users fetch error:`, error);
      throw new Error(error.message || `Failed to fetch users`);
    }
  },

  updatePersonalInfo: async (data: PersonalInfoData) => {
    const response = await axios.put(`${ENDPOINT}api/update-profile`, data);
    return response.data;
  },

  updatePassword: async (oldPassword: string, newPassword: string) => {
    const response = await axios.put(`${ENDPOINT}api/update-profile`, {
      oldPassword,
      newPassword,
    });
    return response.data;
  },

  updateBankDetails: async (data: BankAccountData) => {
    const response = await axios.put(`${ENDPOINT}api/update-profile`, data);
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
