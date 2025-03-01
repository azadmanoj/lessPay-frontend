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
  if (!user) return null;

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
        throw new Error("Failed to fetch payment status");
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
        return "from-emerald-900/20 to-gray-800/90 border-l-4 border-emerald-400";
      case "pending":
        return "from-amber-900/20 to-gray-800/90 border-l-4 border-yellow-400";
      case "failed":
        return "from-red-900/20 to-gray-800/90 border-l-4 border-red-400";
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
      return `${date.getDate()} ${date.toLocaleString("default", {
        month: "short",
      })}, ${date.getFullYear()}  ${date
        .getHours()
        .toString()
        .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
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
        className="fixed inset-0  bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        {/* Animated Background Elements */}
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

        <motion.div
          className="bg-gray-900/90 h-[75vh]  overflow-y-auto rounded-2xl shadow-2xl max-h-[90vh] w-full max-w-6xl overflow-hidden flex flex-col border border-gray-700"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with glass effect */}
          <div className="bg-gradient-to-r  from-emerald-600/20 to-emerald-800/20 p-5 rounded-t-xl flex justify-between items-center backdrop-blur-md border-b border-emerald-500/20">
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                variants={pulseAnimation}
                initial="initial"
                animate="animate"
                className="bg-emerald-500/10 text-emerald-400 p-2 rounded-full border border-emerald-500/20"
              >
                <User className="w-5 h-5" />
              </motion.div>
              <h2 className="text-2xl font-bold text-white">
                {user.fullName.split(" ")[0]}'s Profile
              </h2>
            </motion.div>
            <motion.button
              onClick={onClose}
              className="text-white bg-gray-800/60 hover:bg-gray-700/80 p-2 rounded-full transition-colors duration-300 border border-gray-700"
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
                className="bg-gray-800/50 rounded-xl shadow-lg p-6 flex-1 border border-gray-700 backdrop-blur-sm"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                <motion.div
                  className="flex flex-col sm:flex-row items-center mb-6"
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
                      className="absolute bottom-0 right-0 bg-emerald-500 w-6 h-6 rounded-full border-2 border-gray-900 flex items-center justify-center"
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
                      className="mt-3 inline-flex bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-medium border border-emerald-500/20"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
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
                  className="space-y-4 divide-y divide-gray-700"
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
                      className="flex items-center p-3 bg-gray-800/80 rounded-lg border border-gray-700 hover:border-emerald-500/30 transition-colors duration-300"
                      whileHover={{
                        y: -5,
                        boxShadow: "0 4px 12px rgba(16, 185, 129, 0.1)",
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
                      className="flex items-center p-3 bg-gray-800/80 rounded-lg border border-gray-700 hover:border-emerald-500/30 transition-colors duration-300"
                      whileHover={{
                        y: -5,
                        boxShadow: "0 4px 12px rgba(16, 185, 129, 0.1)",
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
                      className="flex items-center p-3 bg-gray-800/80 rounded-lg border border-gray-700 hover:border-emerald-500/30 transition-colors duration-300"
                      variants={cardVariants}
                      custom={1}
                      whileHover={{ x: 5 }}
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
                      className="flex items-center p-3 bg-gray-800/80 rounded-lg border border-gray-700 hover:border-emerald-500/30 transition-colors duration-300"
                      variants={cardVariants}
                      custom={2}
                      whileHover={{ x: 5 }}
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
                      className="flex items-center p-3 bg-gray-800/80 rounded-lg border border-gray-700 hover:border-emerald-500/30 transition-colors duration-300"
                      variants={cardVariants}
                      custom={3}
                      whileHover={{ x: 5 }}
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
                      className="flex items-center p-3 bg-gray-800/80 rounded-lg border border-gray-700 hover:border-emerald-500/30 transition-colors duration-300"
                      variants={cardVariants}
                      custom={4}
                      whileHover={{ x: 5 }}
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6  h-[60vh]  overflow-y-auto"
    >
      {!user.bankDetails && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gradient-to-r from-blue-800/80 to-indigo-800/80 rounded-lg p-5 shadow-lg border-l-4 border-yellow-400"
        >
          <div className="flex items-start space-x-4">
            <motion.div
              className="p-2 bg-yellow-400 rounded-full"
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatDelay: 2,
              }}
            >
              <AlertTriangle size={24} className="text-blue-900" />
            </motion.div>
            <div>
              <h3 className="font-bold text-lg text-white mb-2">
                Bank Details Required
              </h3>
              <p className="text-gray-200 mb-3">
                Please add your bank account details from the profile section to
                get your amount credited.
              </p>
              <Link href="/profile" passHref>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-blue-800 px-4 py-2 rounded-md font-medium inline-flex items-center"
                >
                  <User size={16} className="mr-2" />
                  Update Profile
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-16">
          <motion.div
            className="flex flex-col items-center"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <motion.div
              className="h-12 w-12 rounded-full border-4 border-blue-400 border-t-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <div className="mt-4 text-gray-300">Loading transactions...</div>
          </motion.div>
        </div>
      ) : sortedTransactions.length > 0 ? (
        <AnimatePresence>
          {sortedTransactions.map((transaction: Transaction, index: number) => {
            const status =
              transactionStatuses[transaction.paymentTransactionId] ||
              "pending";
            const transactionId = getTransactionKey(transaction, index);
            const isExpanded = expandedId === transactionId;

            return (
              <motion.div
                key={transactionId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                layout
                className={`bg-gradient-to-br ${getBgGradient(
                  status
                )} rounded-lg p-6 shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 mb-4`}
                onClick={() => toggleExpand(transactionId)}
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="text-gray-300">
                    {transaction?.createdAt
                      ? formatDate(transaction.createdAt)
                      : "N/A"}
                  </div>
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-gray-400"
                  >
                    <ChevronDown size={18} />
                  </motion.div>
                </div>

                <motion.div className="mb-4">
                  <motion.h2
                    className="text-xl font-bold text-white mb-2"
                    initial={{ opacity: 0.8 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {user?.fullName || (
                      <span className="text-yellow-400 flex items-center">
                        <User size={16} className="mr-2" /> Account details
                        missing
                      </span>
                    )}
                  </motion.h2>

                  <motion.div
                    className={`flex items-center ${getStatusColor(status)}`}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    {getStatusIcon(status)}
                    <span className="text-lg font-medium">
                      {status === "completed"
                        ? "Your Order is success"
                        : status === "pending"
                        ? "Your Order is pending"
                        : "Your Order failed"}
                    </span>
                  </motion.div>
                </motion.div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, overflow: "hidden" }}
                      animate={{
                        opacity: 1,
                        height: "auto",
                        overflow: "visible",
                      }}
                      exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="space-y-2 text-gray-300 mb-4">
                        <div className="flex justify-between">
                          <span>Acc Holder Name</span>
                          <span className="font-medium">
                            {user?.bankDetails?.accountHolder || (
                              <span className="text-yellow-400">
                                Not provided
                              </span>
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Acc No</span>
                          <span className="font-medium">
                            {user?.bankDetails?.accountNumber || (
                              <span className="text-yellow-400">
                                Not provided
                              </span>
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>IFSC</span>
                          <span className="font-medium">
                            {user?.bankDetails?.ifscCode || (
                              <span className="text-yellow-400">
                                Not provided
                              </span>
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Order ID</span>
                          <span className="font-medium">
                            {transaction?.txn_id || "N/A"}
                          </span>
                        </div>
                      </div>

                      {status === "pending" &&
                        transaction.smslink &&
                        transaction.createdAt && (
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="mb-4"
                          >
                            {isSmsLinkExpired(transaction.createdAt) ? (
                              <span className="bg-gray-900/70 text-red-400 px-3 py-2 rounded-xl text-sm font-medium block w-1/4 text-center">
                                Link Expired
                              </span>
                            ) : (
                              <a
                                href={transaction.smslink}
                                className="bg-gray-900/70 text-emerald-400 px-3 py-2 rounded-xl text-sm font-medium block w-1/4 text-center"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                View Payment Link →
                              </a>
                            )}
                          </motion.div>
                        )}

                      <div className="mt-4 pt-4 border-t border-gray-700">
                        <div className="flex items-center">
                          <CreditCard
                            size={16}
                            className="mr-2 text-blue-400"
                          />
                          <span className="text-gray-300">
                            Payment will be processed within 24 hours of
                            completion
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm text-gray-300 max-w-sm">
                    {status === "completed" && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                      >
                        The Beneficiary will Receive the Amount of{" "}
                        <span className="text-emerald-400 font-medium">
                          ₹{transaction?.amount?.toFixed(2) || "0.00"}
                        </span>{" "}
                        on{" "}
                        {transaction?.createdAt
                          ? getFormattedNextWorkingDay(transaction.createdAt)
                          : "N/A"}
                      </motion.p>
                    )}
                  </div>
                  <motion.div
                    className="text-right"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="text-emerald-400 text-2xl font-bold">
                      ₹{transaction?.amount?.toFixed(2) || "0.00"}
                    </span>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center py-16 bg-gradient-to-br from-gray-900/70 to-gray-800/70 rounded-lg shadow-lg"
        >
          <motion.div
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "easeInOut",
            }}
            className="inline-block mb-4"
          >
            <Clock size={64} className="mx-auto text-gray-500" />
          </motion.div>
          <h3 className="text-xl font-medium text-white mb-2">
            No transactions found
          </h3>
          <p className="text-gray-400">
            Your transaction history will appear here
          </p>
        </motion.div>
      )}
    </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UserModal;
