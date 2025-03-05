import React, { useState } from "react";
import { motion } from "framer-motion";
import { Shield, ArrowRight } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";

interface OTPScreenProps {
  email: string; // Changed from phone to email
  onSubmit: (otp: string) => Promise<void>;
  loading: boolean;
  error: string;
}

const ENDPOINT = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

export const OTPScreen: React.FC<OTPScreenProps> = ({
  email,
  onSubmit,
  loading,
  error,
}) => {
  const [otp, setOtp] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(otp);
  };

  const handleRequestOTP = async (email: string) => {
    try {
      // Using the actual API endpoint from the backend code
      const response = await fetch(`${ENDPOINT}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to send OTP");
      }

      toast.success("OTP sent successfully to your email!");
      return result;
    } catch (err) {
      throw err;
    } finally {
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="text-center mb-8">
        <motion.div className="inline-block mb-4">
          <Shield className="w-12 h-12 text-emerald-400" />
        </motion.div>
        <h2 className="text-3xl font-bold text-white mb-2">Verify OTP</h2>
        <p className="text-gray-400">
          Enter the verification code sent to {email}
        </p>
      </div>

      <motion.div
        className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 shadow-xl border border-gray-700"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
      >
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white placeholder-gray-400 text-center text-2xl tracking-widest"
              placeholder="Enter OTP"
              maxLength={6}
              required
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center py-3 px-4 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium hover:from-emerald-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 transition-all"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Verify OTP
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            // type="submit"
            disabled={loading}
            onClick={() => handleRequestOTP(email)}
            className="w-full flex items-center justify-center py-3 px-4 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium hover:from-emerald-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 transition-all"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Resend OTP
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
      <ToastContainer />
    </motion.div>
  );
};
