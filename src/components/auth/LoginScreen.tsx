import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, User, ArrowRight } from "lucide-react"; // Removed Phone icon, added Mail icon

interface LoginScreenProps {
  onSubmit: (
    email: string,  // Use email for registration
    password: string,
    isNewUser: boolean
  ) => Promise<void>;
  loading: boolean;
  error: string;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onSubmit,
  loading,
  error,
}) => {
  const [isNewUser, setIsNewUser] = useState(false);
  const [email, setEmail] = useState(""); // Email only for identifier
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, password, isNewUser);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto px-4 py-8 md:py-0"
    >
      <div className="text-center mb-6 md:mb-8">
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="inline-flex items-center mb-4"
        >
          <User className="w-8 h-8 text-emerald-400 mr-2" />
          <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 text-transparent bg-clip-text">
            LessPay
          </span>
        </motion.div>
        <h2 className="text-3xl font-bold text-white mb-2">
          {isNewUser ? "Create Account" : "Welcome Back"}
        </h2>
        <p className="text-gray-400">
          {isNewUser ? "Sign up to get started" : "Sign in to continue"}
        </p>
      </div>

      <motion.div
        className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 md:p-8 shadow-xl border border-gray-700"
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
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"  // Always email input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white placeholder-gray-400"
                placeholder="Enter your email address"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white placeholder-gray-400"
                placeholder="Enter your password"
                required
              />
            </div>
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
                {isNewUser ? "Sign Up" : "Sign In"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </motion.button>

          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => setIsNewUser(!isNewUser)}
              className="text-emerald-400 hover:text-emerald-300 text-sm transition-colors"
            >
              {isNewUser
                ? "Already have an account? Sign in"
                : "Don't have an account? Sign up"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};
