/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import {
  CheckCircle2,
  X,
  Mail,
  Phone,
  User,
  Users,
  Award,
  Activity,
  CreditCard,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { BankDetails, Transaction } from "../../type";
import {
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  ChevronDown,
} from "react-feather";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "@/context/AuthContext";

// Define the UserData type
export interface UserData {
  _id: string;
  fullName: string;
  email: string;
  isVerified: boolean;
  profileImage?: string;
  age?: number;
  gender?: string;
  status?: string;
  userRole?: string;
  phoneNumber?: string;
  address?: string;
  transactions?: Transaction[];
  bankDetails: BankDetails;
}

// Activity interface
export interface Activity {
  id: string;
  user: string;
  action: string;
  target: string;
  date: string;
}

const UserModal = ({
  user,
  onClose,
}: {
  user: UserData | null;
  activities: Activity[];
  onClose: () => void;
}) => {
  const { logout } = useAuth();

  
   if (!user) {
          toast.error("User Not Found!");
          logout();
          return;
        }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: any) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const pulseAnimation = {
    initial: { scale: 1 },
    animate: {
      scale: [1, 1.02, 1],
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
    },
  };

  const waveAnimation = {
    initial: { pathLength: 0, pathOffset: 0 },
    animate: {
      pathLength: 1,
      pathOffset: 0,
      transition: { duration: 2, ease: "easeInOut" },
    },
  };

  const [transactionStatuses, setTransactionStatuses] = useState<
    Record<string, string>
  >({});

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const ENDPOINT = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (user && user._id) {
      fetchTransactions(user._id);
    }
  }, [user]);

  const fetchTransactions = async (userId: string): Promise<void> => {
    try {
      setLoading(true);
      const response = await fetch(
        `${ENDPOINT}/profile/user-transactions/${userId}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data: Transaction[] = await response.json();
      setTransactions(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  // Bank Holidays - example list (replace with actual dates)
  const bankHolidays = [
    new Date("2025-01-01"), // Example: New Year's Day
    new Date("2025-12-25"), // Example: Christmas Day
    // Add other holidays here
  ];

  const isSmsLinkExpired = (createdAt: string) => {
    const createdDate = new Date(createdAt);
    const currentDate = new Date();
    const timeDifference = currentDate.getTime() - createdDate.getTime();

    // Check if the link has expired (more than 24 hours)
    return timeDifference > 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  };

  // Function to check if the date is a weekend or holiday
  const isWeekendOrHoliday = (date: Date) => {
    const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    // Check if the date is a bank holiday
    const isHoliday = bankHolidays.some(
      (holiday) =>
        holiday.getDate() === date.getDate() &&
        holiday.getMonth() === date.getMonth() &&
        holiday.getFullYear() === date.getFullYear()
    );

    return isWeekend || isHoliday;
  };

  // Function to get the next working day
  const getNextWorkingDay = (date: Date) => {
    const nextWorkingDay = new Date(date);
    nextWorkingDay.setDate(nextWorkingDay.getDate() + 1); // Add 1 day

    // Loop until we find a non-weekend and non-holiday day
    while (isWeekendOrHoliday(nextWorkingDay)) {
      nextWorkingDay.setDate(nextWorkingDay.getDate() + 1);
    }

    return nextWorkingDay;
  };

  // In your component where the amount is shown
  const getFormattedNextWorkingDay = (createdAt: string) => {
    const transactionDate = new Date(createdAt);
    const nextWorkingDay = getNextWorkingDay(transactionDate);

    return nextWorkingDay.toLocaleString("en-GB", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour12: false,
    });
  };

  const safeTransactions = Array.isArray(transactions) ? transactions : [];

  const fetchPaymentStatus = async (paymentTransactionId: any) => {
    try {
      const response = await fetch(`${ENDPOINT}/api/payment-status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentTransactionId: paymentTransactionId,
        }),
      });

      if (!response.ok) {
        toast.error("Failed to fetch payment status");
      }

      const data = await response.json();
      if (data.status === "completed") {
        return "completed";
      } else if (data.status === "pending") {
        return "pending";
      } else {
        return "failed";
      }
    } catch (error) {
      console.error("Error fetching payment status:", error);
      return "failed"; // Default to failed if there's an error
    }
  };

  useEffect(() => {
    const fetchStatuses = async () => {
      setIsLoading(true);
      const newStatuses: Record<string, string> = {};
      for (const transaction of safeTransactions) {
        if (transaction?.paymentTransactionId) {
          const status = await fetchPaymentStatus(
            transaction.paymentTransactionId
          );
          newStatuses[transaction.paymentTransactionId] = status;
        }
      }
      if (newStatuses && Object.keys(newStatuses).length > 0) {
        setTransactionStatuses(newStatuses);
      }
      setIsLoading(false);
    };

    fetchStatuses();
  }, [safeTransactions]);

  const email = user.email;

  const handlePaymentTransfer = async (
    txn_id: string,
    paymentTransferStatus: string
  ) => {
    try {
      const response = await fetch(`${ENDPOINT}/api/update-transactions`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          txn_id, // Using txn_id here instead of transactionId
          paymentTransferStatus: paymentTransferStatus,
        }),
      });

      fetchTransactions(user._id);
      if (!response.ok) {
        const errorDetails = await response.json(); // Get additional error details from the server
        throw new Error(
          `Failed to update payment transfer status: ${
            errorDetails.message || response.statusText
          }`
        );
      }

      // Update the state to reflect the new status
      setTransactions((prevTransactions) =>
        prevTransactions.map((transaction) =>
          transaction.txn_id === txn_id // Compare using txn_id instead of transactionId
            ? { ...transaction, paymentTransferStatus: "completed" }
            : transaction
        )
      );
    } catch (error) {
      console.error("Error updating payment transfer status:", error);
    }
  };

  // Sort transactions by `createdAt` in descending order (latest first)
  const sortedTransactions = [...safeTransactions].sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA; // Sort in descending order
  });

  const getStatusColor = (status: string = "pending") => {
    switch (status) {
      case "completed":
        return "text-emerald-400";
      case "pending":
        return "text-yellow-400";
      case "failed":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const getBgGradient = (status: string = "pending") => {
    switch (status) {
      case "completed":
        return "from-emerald-900/30 to-gray-800/90 border-l-4 border-emerald-400";
      case "pending":
        return "from-amber-900/30 to-gray-800/90 border-l-4 border-yellow-400";
      case "failed":
        return "from-red-900/30 to-gray-800/90 border-l-4 border-red-400";
      default:
        return "from-gray-900/90 to-gray-800/90 border-l-4 border-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle size={20} className="mr-2" />;
      case "pending":
        return <Clock size={20} className="mr-2" />;
      case "failed":
        return <XCircle size={20} className="mr-2" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);

      // Get the hour in 12-hour format
      let hours = date.getHours();
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12; // Convert to 12-hour format
      if (hours === 0) hours = 12; // Handle midnight as 12 instead of 0

      return `${date.getDate()} ${date.toLocaleString("default", {
        month: "short",
      })}, ${date.getFullYear()}  ${hours.toString().padStart(2, "0")}:${date
        .getMinutes()
        .toString()
        .padStart(2, "0")} ${ampm}`;
    } catch (e) {
      console.error("Error formatting date:", e);
      return "Invalid Date"; // Return a fallback string instead of the error object
    }
  };

  const getTransactionKey = (transaction: any, index: number) => {
    if (transaction?.id) return transaction.id;
    return `transaction-${index}`;
  };

  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Dynamic Background Elements */}
        <div className="absolute inset-0 z-0 overflow-hidden">
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
            className="absolute w-96 h-96 bg-indigo-700/10 rounded-full blur-3xl"
            style={{ bottom: "15%", left: "25%" }}
            animate={{
              x: [0, -20, 0],
              y: [0, 15, 0],
              opacity: [0.15, 0.25, 0.15],
            }}
            transition={{
              repeat: Infinity,
              duration: 18,
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
          <motion.div
            className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-emerald-500/10 to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
          />
        </div>

        <motion.div
          className="bg-gray-900/90 h-[75vh] overflow-y-auto rounded-2xl shadow-2xl max-h-[90vh] w-full max-w-6xl overflow-hidden flex flex-col border border-gray-700"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with enhanced glass effect */}
          <div className="relative bg-gradient-to-r from-emerald-600/20 to-emerald-800/20 p-5 rounded-t-xl flex justify-between items-center backdrop-blur-md border-b border-emerald-500/20 overflow-hidden">
            {/* Animated background elements for header */}
            <motion.div
              className="absolute inset-0 opacity-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.2 }}
              transition={{ duration: 1.5 }}
            >
              <svg width="100%" height="100%">
                <motion.path
                  d="M 0 50 Q 200 10, 400 50 Q 600 90, 800 50"
                  fill="none"
                  stroke="rgba(16, 185, 129, 0.3)"
                  strokeWidth="2"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{
                    pathLength: 1,
                    opacity: 1,
                    transition: { duration: 2, ease: "easeOut" },
                  }}
                />
                <motion.path
                  d="M 0 70 Q 200 110, 400 70 Q 600 30, 800 70"
                  fill="none"
                  stroke="rgba(16, 185, 129, 0.3)"
                  strokeWidth="2"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{
                    pathLength: 1,
                    opacity: 1,
                    transition: { delay: 0.5, duration: 2, ease: "easeOut" },
                  }}
                />
              </svg>
            </motion.div>

            <motion.div
              className="flex items-center gap-3 relative z-10"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                variants={pulseAnimation}
                initial="initial"
                animate="animate"
                className="bg-emerald-500/20 text-emerald-400 p-2 rounded-full border border-emerald-500/30 shadow-lg shadow-emerald-500/10"
              >
                <User className="w-5 h-5" />
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {user.fullName.split(" ")[0]}'s Profile
                </h2>
                <motion.div
                  className="flex items-center text-xs text-emerald-300/70"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <Activity className="w-3 h-3 mr-1" />
                  Last updated: {new Date().toLocaleDateString()}
                </motion.div>
              </div>
            </motion.div>
            <motion.button
              onClick={onClose}
              className="text-white bg-gray-800/60 hover:bg-gray-700/80 p-2 rounded-full transition-colors duration-300 border border-gray-700 relative z-10 shadow-lg"
              whileHover={{ rotate: 90, scale: 1.1 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.button>
          </div>

          {/* Scrollable content */}
          <div className="overflow-y-auto flex-1 p-6 bg-gradient-to-b from-gray-900/80 to-gray-900/90">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Profile Section */}
              <motion.div
                className="bg-gray-800/50 rounded-xl shadow-xl p-6 flex-1 border border-gray-700 backdrop-blur-sm relative overflow-hidden"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                {/* Decorative elements */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/5 rounded-full blur-2xl" />
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-500/5 rounded-full blur-2xl" />

                <motion.div
                  className="flex flex-col sm:flex-row items-center mb-6 relative"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="relative mb-4 sm:mb-0 group">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      {user.profileImage ? (
                        <div className="relative">
                          <motion.div
                            className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-emerald-700 rounded-full blur-md opacity-70"
                            animate={{
                              opacity: [0.5, 0.8, 0.5],
                              scale: [1, 1.05, 1],
                            }}
                            transition={{
                              repeat: Infinity,
                              duration: 3,
                            }}
                          />
                          <Image
                            src={user.profileImage}
                            alt="Profile Picture"
                            width={100}
                            height={100}
                            className="rounded-full border-2 border-emerald-500 shadow-lg transition-all duration-300 relative z-10"
                          />
                        </div>
                      ) : (
                        <div className="relative">
                          <motion.div
                            className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-emerald-700 rounded-full blur-md opacity-70"
                            animate={{
                              opacity: [0.5, 0.8, 0.5],
                              scale: [1, 1.05, 1],
                            }}
                            transition={{
                              repeat: Infinity,
                              duration: 3,
                            }}
                          />
                          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg transition-all duration-300 relative z-10">
                            {user.fullName.charAt(0) || "NA"}
                          </div>
                        </div>
                      )}
                    </motion.div>
                    <motion.div
                      className="absolute bottom-0 right-0 bg-emerald-500 w-6 h-6 rounded-full border-2 border-gray-900 flex items-center justify-center shadow-lg"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5, type: "spring" }}
                    >
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </motion.div>
                  </div>
                  <div className="ml-0 sm:ml-6 text-center sm:text-left">
                    <motion.h1
                      className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 text-transparent bg-clip-text"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      {user.fullName}
                    </motion.h1>
                    <motion.p
                      className="text-gray-400 flex items-center justify-center sm:justify-start mt-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <span className="mr-1">🇮🇳</span>
                      {user.address || "Northridge, California(CA), 91326, USA"}
                    </motion.p>
                    <motion.div
                      className="mt-3 inline-flex bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-medium border border-emerald-500/20 shadow-md"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <Sparkles className="w-3 h-3 mr-1" />
                      {user.isVerified
                        ? "Verified User"
                        : "Pending Verification"}
                    </motion.div>
                  </div>
                </motion.div>

                <motion.div
                  className="space-y-4 divide-y divide-gray-700/50"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-3"
                    variants={cardVariants}
                    custom={0}
                  >
                    <motion.div
                      className="flex items-center p-3 bg-gray-800/80 rounded-lg border border-gray-700 hover:border-emerald-500/30 transition-colors duration-300 shadow-lg"
                      whileHover={{
                        y: -5,
                        boxShadow: "0 8px 16px rgba(16, 185, 129, 0.1)",
                      }}
                    >
                      <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center mr-3 shadow-md">
                        <User className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Age</p>
                        <p className="font-medium text-gray-300">
                          {user.age || "NA"}
                        </p>
                      </div>
                    </motion.div>
                    <motion.div
                      className="flex items-center p-3 bg-gray-800/80 rounded-lg border border-gray-700 hover:border-emerald-500/30 transition-colors duration-300 shadow-lg"
                      whileHover={{
                        y: -5,
                        boxShadow: "0 8px 16px rgba(16, 185, 129, 0.1)",
                      }}
                    >
                      <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center mr-3 shadow-md">
                        <Users className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Gender</p>
                        <p className="font-medium text-gray-300">
                          {user.gender || "NA"}
                        </p>
                      </div>
                    </motion.div>
                  </motion.div>

                  <motion.div
                    className="py-4 space-y-3"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <motion.div
                      className="flex items-center p-3 bg-gray-800/80 rounded-lg border border-gray-700 hover:border-emerald-500/30 transition-colors duration-300 shadow-lg"
                      variants={cardVariants}
                      custom={1}
                      whileHover={{
                        x: 5,
                        boxShadow: "0 4px 12px rgba(16, 185, 129, 0.1)",
                      }}
                    >
                      <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center mr-3 shadow-md">
                        <Activity className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Status</p>
                        <p className="font-medium text-emerald-400">
                          {user.status || "Active"}
                        </p>
                      </div>
                    </motion.div>

                    <motion.div
                      className="flex items-center p-3 bg-gray-800/80 rounded-lg border border-gray-700 hover:border-emerald-500/30 transition-colors duration-300 shadow-lg"
                      variants={cardVariants}
                      custom={2}
                      whileHover={{
                        x: 5,
                        boxShadow: "0 4px 12px rgba(16, 185, 129, 0.1)",
                      }}
                    >
                      <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center mr-3 shadow-md">
                        <Award className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Role</p>
                        <p className="font-medium text-gray-300">
                          {user?.userRole || "Administrator"}
                        </p>
                      </div>
                    </motion.div>

                    <motion.div
                      className="flex items-center p-3 bg-gray-800/80 rounded-lg border border-gray-700 hover:border-emerald-500/30 transition-colors duration-300 shadow-lg"
                      variants={cardVariants}
                      custom={3}
                      whileHover={{
                        x: 5,
                        boxShadow: "0 4px 12px rgba(16, 185, 129, 0.1)",
                      }}
                    >
                      <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center mr-3 shadow-md">
                        <Mail className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="font-medium text-gray-300">
                          {user.email}
                        </p>
                      </div>
                    </motion.div>

                    <motion.div
                      className="flex items-center p-3 bg-gray-800/80 rounded-lg border border-gray-700 hover:border-emerald-500/30 transition-colors duration-300 shadow-lg"
                      variants={cardVariants}
                      custom={4}
                      whileHover={{
                        x: 5,
                        boxShadow: "0 4px 12px rgba(16, 185, 129, 0.1)",
                      }}
                    >
                      <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center mr-3 shadow-md">
                        <Phone className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Contact</p>
                        <p className="font-medium text-gray-300">
                          {user.phoneNumber || "NA"}
                        </p>
                      </div>
                    </motion.div>

                    <motion.div
                      className="flex items-center p-3 bg-gray-800/80 rounded-lg border border-gray-700 hover:border-emerald-500/30 transition-colors duration-300"
                      variants={cardVariants}
                      custom={5}
                      whileHover={{ x: 5 }}
                    >
                      <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center mr-3 shadow-md">
                        <CreditCard className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">
                          Bank Account Details
                        </p>
                        <div className="mt-2 space-y-1 bg-gray-900/50 p-3 rounded-lg border border-gray-700">
                          <p className="font-medium text-sm text-gray-300 flex justify-between">
                            <span className="text-gray-500">
                              Account Holder:
                            </span>
                            <span>
                              {user.bankDetails?.accountHolder || "NA"}
                            </span>
                          </p>
                          <p className="font-medium text-sm text-gray-300 flex justify-between">
                            <span className="text-gray-500">
                              Account Number:
                            </span>
                            <span>
                              {user.bankDetails?.accountNumber ||
                                "XXXX-XXXX-XXXX-1234"}
                            </span>
                          </p>
                          <p className="font-medium text-sm text-gray-300 flex justify-between">
                            <span className="text-gray-500">Bank Name:</span>
                            <span>{user.bankDetails?.bankName || "NA"}</span>
                          </p>
                          <p className="font-medium text-sm text-gray-300 flex justify-between">
                            <span className="text-gray-500">IFSC Code:</span>
                            <span>{user.bankDetails?.ifscCode || "NA"}</span>
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Transactions Section */}
              <motion.div
                className="bg-gray-800/50 rounded-xl shadow-xl p-6 flex-1 border border-gray-700 backdrop-blur-sm relative overflow-hidden"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                {/* Decorative elements */}
                <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-500/5 rounded-full blur-2xl" />
                <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-emerald-500/5 rounded-full blur-2xl" />

                <motion.div
                  className="flex items-center gap-3 mb-6"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <motion.div
                    variants={pulseAnimation}
                    initial="initial"
                    animate="animate"
                    className="bg-indigo-500/20 text-indigo-400 p-2 rounded-full border border-indigo-500/30 shadow-lg shadow-indigo-500/10"
                  >
                    <CreditCard className="w-5 h-5" />
                  </motion.div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Transactions
                    </h2>
                    <motion.div
                      className="flex items-center text-xs text-indigo-300/70"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Last 30 days
                    </motion.div>
                  </div>
                </motion.div>

                <motion.div
                  className="space-y-4"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {loading ? (
                    <motion.div
                      className="flex items-center justify-center p-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
                    </motion.div>
                  ) : error ? (
                    <motion.div
                      className="flex items-center justify-center p-6 bg-red-900/20 rounded-lg border border-red-700/50"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <AlertTriangle className="w-5 h-5 text-red-400 mr-2" />
                      <p className="text-red-400">{error}</p>
                    </motion.div>
                  ) : (
                    sortedTransactions.map((transaction, index) => (
                      <motion.div
                        key={index}
                        className={`p-4 rounded-lg ${getBgGradient(
                          transactionStatuses[transaction.paymentTransactionId]
                        )} shadow-lg hover:shadow-xl transition-shadow duration-300`}
                        variants={cardVariants}
                        custom={index}
                        whileHover={{ y: -5 }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            {getStatusIcon(
                              transactionStatuses[
                                transaction.paymentTransactionId
                              ]
                            )}
                            <div>
                              <p className="text-xs text-gray-500">
                                {transaction?.createdAt
                                  ? formatDate(transaction.createdAt)
                                  : "N/A"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <p
                              className={`text-sm font-semibold ${getStatusColor(
                                transactionStatuses[
                                  transaction.paymentTransactionId
                                ]
                              )}`}
                            >
                              {transaction.receiveAmount
                                ? `$${transaction.receiveAmount.toFixed(2)}`
                                : "N/A"}
                            </p>
                            <div className="flex flex-col items-center gap-2">
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={
                                    transaction.paymentTransferStatus ===
                                    "completed"
                                  }
                                  onChange={() =>
                                    handlePaymentTransfer(
                                      transaction.txn_id,
                                      transaction.paymentTransferStatus ===
                                        "pending"
                                        ? "completed"
                                        : "pending"
                                    )
                                  }
                                  className="sr-only"
                                />
                                <div className="w-11 h-6  bg-gray-700 rounded-full border border-gray-600 toggle-bg">
                                  <div
                                    className={`absolute left-1 top-1 w-4 h-4 rounded-full transition-transform ${
                                      transaction.paymentTransferStatus ===
                                      "completed"
                                        ? "translate-x-5 bg-emerald-500"
                                        : "bg-gray-400"
                                    }`}
                                  />
                                </div>
                              </label>
                              <span className="text-sm  text-gray-400">
                                {transaction.paymentTransferStatus ===
                                "completed"
                                  ? "Completed"
                                  : "Pending"}
                              </span>
                            </div>
                            <button
                              onClick={() => toggleExpand(transaction._id)}
                              className="text-gray-400 hover:text-gray-200 transition-colors"
                            >
                              <ChevronDown
                                className={`w-4 h-4 transition-transform ${
                                  expandedId === transaction._id
                                    ? "rotate-180"
                                    : ""
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                        <AnimatePresence>
                          {expandedId === transaction._id && (
                            <motion.div
                              className="mt-4 pt-4 border-t border-gray-700/50"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                            >
                              <p className="text-xs text-gray-400">
                                Transaction ID:{" "}
                                {transaction.paymentTransactionId}
                              </p>
                              <p className="text-xs text-gray-400 mt-2">
                                Expected Completion:{" "}
                                {transaction?.createdAt
                                  ? getFormattedNextWorkingDay(
                                      transaction.createdAt
                                    )
                                  : "N/A"}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))
                  )}
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UserModal;
