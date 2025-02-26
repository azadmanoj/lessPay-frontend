/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  QrCode,
  CreditCard,
  X,
  Percent,
  Clock,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { withAuth } from "@/components/hoc/withAuth";
import { Transactions } from "@/components/transactions/Transactions";
import { Transaction, FeatureCardProps } from "../../../type";
import axios from "axios";

// Enhanced animation variants
const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const slideUp = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const pulseAnimation = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.02, 1],
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
  },
};

// Enhanced Feature Card with animation effects
const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  description,
}) => (
  <motion.div
    variants={slideUp}
    whileHover={{
      scale: 1.05,
      boxShadow: "0 20px 25px -5px rgba(16, 185, 129, 0.1)",
    }}
    className="bg-gray-800/50 p-4 justify-center text-center rounded-xl backdrop-blur-sm border items-center border-gray-700 transition-all transform hover:border-emerald-500/30 flex flex-col hover:bg-gray-800/70"
  >
    <div className="relative">
      <motion.div
        className="absolute -top-3 -left-3 w-16 h-16 rounded-full bg-gradient-to-r from-emerald-500/20 to-emerald-600/10 blur-xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          repeat: Infinity,
          duration: 3,
        }}
      />
      <Icon className="w-10 h-10 text-emerald-400 mb-4 relative z-10" />
    </div>
    <h3 className="text-lg md:text-xl font-semibold text-white mb-2">
      {title}
    </h3>
    <p className="text-gray-400 text-sm md:text-base">{description}</p>
  </motion.div>
);

const DashboardPage: React.FC = () => {
  const [amount, setAmount] = useState<string>("");
  const [id, setid] = useState<string>("");
  const [mobileNumber, setMobileNumber] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [paymentLink, setPaymentLink] = useState<string>("");
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [paymentStatus] = useState<"pending" | "completed" | "failed">(
    "pending"
  );
  const [formErrors, setFormErrors] = useState({
    amount: false,
    mobileNumber: false,
    email: false,
  });
  const userId = "7880001415";

  const ENDPOINT = "https://lesspay-backend-1.onrender.com"
  // const ENDPOINT = "http://localhost:5000";

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async (): Promise<void> => {
    try {
      const userData = localStorage.getItem("userData");

      if (!userData) {
        throw new Error("User data not found in localStorage");
      }

      // Parse the data and get the user id from the user object
      const user = JSON.parse(userData);
      if (!user || !user.id) {
        throw new Error("User ID not found in userData");
      }
      setid(user.id);

      const response = await fetch(
        `${ENDPOINT}/profile/user-transactions/${user.id}`
      );

      const data: Transaction[] = await response.json();
      setTransactions(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
      console.error("Error fetching transactions:", error);
    }
  };

  const validateForm = (): boolean => {
    const errors = {
      amount: !amount || Number(amount) <= 0,
      mobileNumber: !mobileNumber || !/^[6-9]\d{9}$/.test(mobileNumber),
      email: !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    };

    setFormErrors(errors);
    return !Object.values(errors).some((isError) => isError);
  };

  const handlePayment = async (): Promise<void> => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(
        `${ENDPOINT}/api/generate-payment-link`,
        {
          amount,
          mobileno: mobileNumber,
          email_id: email,
          invoice_id: Math.random().toString(36).substring(7),
          userId,
          id: id,
        }
      );

      if (response.data && response.data.smslink) {
        setPaymentLink(response.data.smslink);
        setShowPaymentModal(true);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error: any) {
      setError(
        error.response?.data?.message || "Failed to generate payment link"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-emerald-950 pt-16 md:pt-20 overflow-hidden"
    >
      {/* Animated Background Elements */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <motion.div
          className="absolute w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl"
          style={{ top: "10%", left: "5%" }}
          animate={{
            x: [0, 30, 0],
            y: [0, 20, 0],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            repeat: Infinity,
            duration: 15,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute w-96 h-96 bg-emerald-800/10 rounded-full blur-3xl"
          style={{ bottom: "10%", right: "5%" }}
          animate={{
            x: [0, -40, 0],
            y: [0, 30, 0],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            repeat: Infinity,
            duration: 20,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 md:py-12 relative z-10">
        {/* Header with User Section */}
        <motion.div
          variants={fadeIn}
          className="flex justify-end mb-6"
        ></motion.div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-6 md:space-y-8 relative"
        >
          <motion.div
            variants={pulseAnimation}
            initial="initial"
            animate="animate"
            className="inline-block bg-gradient-to-r from-emerald-500/20 to-emerald-500/10 text-emerald-400 px-4 md:px-6 py-2 rounded-full text-xs md:text-sm font-medium border border-emerald-500/20 shadow-lg shadow-emerald-500/10"
          >
            <motion.div
              className="absolute inset-0 rounded-full bg-emerald-500/5"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0, 0.3],
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
              }}
            />
            <span className="relative z-10 flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Smart Credit Card Payments
            </span>
          </motion.div>

          <motion.h1
            className="text-3xl md:text-7xl lg:text-8xl font-bold tracking-tight px-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 text-transparent bg-clip-text">
              Pay Less,{" "}
            </span>
            <motion.span
              className="bg-gradient-to-r from-emerald-400 to-emerald-600 text-transparent bg-clip-text inline-block"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{ backgroundSize: "200% 100%" }}
            >
              Save More
            </motion.span>
          </motion.h1>
        </motion.div>

        {/* Payment Form Section with Card Effect */}
        <motion.div
          variants={fadeIn}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.4 }}
          className="max-w-md mx-auto mt-12 mb-16 relative"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-emerald-600/5 rounded-2xl blur-xl"
            animate={{
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              repeat: Infinity,
              duration: 3,
              ease: "easeInOut",
            }}
          />

          <motion.div
            className="relative bg-gray-800/70 backdrop-blur-lg rounded-xl border border-gray-700 overflow-hidden shadow-2xl p-6 md:p-8"
            whileHover={{
              boxShadow:
                "0 20px 25px -5px rgba(16, 185, 129, 0.15), 0 10px 10px -5px rgba(16, 185, 129, 0.1)",
            }}
          >
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-white text-xl font-semibold flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-emerald-400" />
                  Make Payment
                </h2>
                <TrendingUp className="h-5 w-5 text-emerald-400" />
              </div>

              <div className="space-y-4">
                {/* Amount Input */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <input
                    type="number"
                    value={amount}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setAmount(e.target.value)
                    }
                    className={`w-full px-6 py-4 rounded-lg bg-gray-800/90 border ${
                      formErrors.amount ? "border-red-500" : "border-gray-700"
                    } text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300`}
                    placeholder="Enter amount (₹)"
                  />
                  {formErrors.amount && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-1 text-red-500 text-sm"
                    >
                      Please enter a valid amount
                    </motion.p>
                  )}
                </motion.div>

                {/* Mobile Number Input */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <input
                    type="tel"
                    value={mobileNumber}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setMobileNumber(e.target.value)
                    }
                    className={`w-full px-6 py-4 rounded-lg bg-gray-800/90 border ${
                      formErrors.mobileNumber
                        ? "border-red-500"
                        : "border-gray-700"
                    } text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300`}
                    placeholder="Mobile Number (10 digits)"
                    maxLength={10}
                  />
                  {formErrors.mobileNumber && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-1 text-red-500 text-sm"
                    >
                      Please enter a valid 10-digit mobile number
                    </motion.p>
                  )}
                </motion.div>

                {/* Email Input */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setEmail(e.target.value)
                    }
                    className={`w-full px-6 py-4 rounded-lg bg-gray-800/90 border ${
                      formErrors.email ? "border-red-500" : "border-gray-700"
                    } text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300`}
                    placeholder="Email Address"
                  />
                  {formErrors.email && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-1 text-red-500 text-sm"
                    >
                      Please enter a valid email address
                    </motion.p>
                  )}
                </motion.div>
              </div>

              <motion.button
                onClick={handlePayment}
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-8 py-4 rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all text-lg font-semibold shadow-lg shadow-emerald-500/20 disabled:opacity-50 w-full relative overflow-hidden"
              >
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-transparent"
                  animate={{
                    x: ["-100%", "100%"],
                    opacity: [0, 0.5, 0],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: "easeInOut",
                    repeatDelay: 0.5,
                  }}
                />
                <span className="relative z-10">
                  {loading ? "Processing..." : `Pay Now ₹${amount || "0"}`}
                </span>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-8 md:mt-16 max-w-6xl mx-auto"
        >
          <FeatureCard
            icon={Percent}
            title="Lowest Interest Just AT 1.85%"
            description="Save more on every payment"
          />
          <FeatureCard
            icon={Clock}
            title="Quick Payments WithIn 24 Hours"
            description="Fast and efficient transactions"
          />
          {/* <FeatureCard
            icon={Shield}
            title="Secure"
            description="Bank-grade security protocols"
          /> */}
          <FeatureCard
            icon={CreditCard}
            title="Smart Tracking"
            description="Monitor all your transactions"
          />
        </motion.div>

        {/* Transactions Table with enhanced styling */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-16 mb-10 bg-gray-800/50 rounded-xl backdrop-blur-sm border border-gray-700 overflow-hidden shadow-xl"
        >
          <div className="p-4 bg-gray-800/70 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
              Recent Transactions
            </h2>
          </div>
          <Transactions transactions={transactions} />
        </motion.div>

        {/* Payment Modal with enhanced effects */}
        <AnimatePresence>
          {showPaymentModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-gray-800/90 rounded-2xl p-6 w-full max-w-md relative border border-gray-700 shadow-2xl"
              >
                <motion.div
                  className="absolute inset-0 rounded-2xl overflow-hidden z-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-emerald-600/10 to-emerald-900/10" />
                </motion.div>

                <button
                  onClick={() => {
                    setShowPaymentModal(false);
                    location.reload(); // Reload the page
                  }}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white z-10"
                >
                  <X className="h-6 w-6" />
                </button>

                {paymentStatus === "pending" ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-8 relative z-10"
                  >
                    <motion.div
                      animate={{
                        boxShadow: [
                          "0 0 0 0 rgba(16, 185, 129, 0)",
                          "0 0 0 10px rgba(16, 185, 129, 0.1)",
                          "0 0 0 0 rgba(16, 185, 129, 0)",
                        ],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 2,
                      }}
                      className="w-20 h-20 bg-emerald-500/10 rounded-full mx-auto mb-6 flex items-center justify-center"
                    >
                      <QrCode className="h-10 w-10 text-emerald-400" />
                    </motion.div>

                    <h3 className="text-xl font-bold text-white mb-4">
                      Complete Your Payment
                    </h3>

                    <motion.a
                      href={paymentLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-block bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-3 rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all relative overflow-hidden"
                    >
                      <motion.span
                        className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-transparent"
                        animate={{
                          x: ["-100%", "100%"],
                          opacity: [0, 0.5, 0],
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 1.5,
                          ease: "easeInOut",
                          repeatDelay: 0.5,
                        }}
                      />
                      <span className="relative z-10">Proceed to Payment</span>
                    </motion.a>

                    <p className="mt-4 text-gray-400">
                      Click the button above to complete your payment now Or You
                      will get link on your mobile number and Email Address for
                      complete payment.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8 relative z-10"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1, rotate: [0, 360] }}
                      transition={{ type: "spring", duration: 0.5 }}
                      className={`w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center ${
                        paymentStatus === "completed"
                          ? "bg-emerald-500/20"
                          : "bg-red-500/20"
                      }`}
                    >
                      {paymentStatus === "completed" ? (
                        <motion.svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="40"
                          height="40"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-emerald-500"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </motion.svg>
                      ) : (
                        <X className="h-10 w-10 text-red-500" />
                      )}
                    </motion.div>

                    <div
                      className={`text-${
                        paymentStatus === "completed" ? "emerald" : "red"
                      }-500 text-xl font-bold mb-4`}
                    >
                      {paymentStatus === "completed"
                        ? "Payment Successful!"
                        : "Payment Failed"}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Message with animation */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="fixed top-4 right-4 bg-red-500/90 backdrop-blur-sm text-white px-6 py-3 rounded-lg shadow-lg border border-red-600/50 z-50"
            >
              <div className="flex items-center gap-2">
                <X className="h-5 w-5" />
                <span>{error}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default withAuth(DashboardPage);
