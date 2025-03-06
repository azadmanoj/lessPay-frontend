/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Transaction, UserData } from "../../../type";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  User,
  CreditCard,
  ChevronDown,
} from "react-feather";
import { api } from "@/services/api";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";

interface TransactionsProps {
  transactions: Transaction[];
}

export const Transactions: React.FC<TransactionsProps> = ({
  transactions = [],
}) => {
  // Ensure transactions is always an array
  const ENDPOINT = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

  const safeTransactions = Array.isArray(transactions) ? transactions : [];

  const [transactionStatuses, setTransactionStatuses] = useState<
    Record<string, string>
  >({});

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Fetch payment status from API - keeping original logic
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

  const [user, setUser] = useState<UserData>();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [bankDetailsComplete, setBankDetailsComplete] =
    useState<boolean>(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          setIsAuthenticated(false);
          return;
        }

        const profile = await api.getProfile();
        setUser(profile);

        // Check if bank details are complete
        setBankDetailsComplete(
          !!(
            profile?.bankDetails?.accountHolder &&
            profile?.bankDetails?.accountNumber &&
            profile?.bankDetails?.ifscCode
          )
        );

        setIsAuthenticated(true);
      } catch (error) {
        console.error("Authentication failed:", error);
        handleAuthError();
      }
    };

    checkAuth();
  }, []);

  const handleAuthError = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
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

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6  h-[60vh]  overflow-y-auto"
    >
      {!bankDetailsComplete && (
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
                key={index}
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
                      initial={{ opacity: 0, height: 50, overflow: "hidden" }}
                      animate={{
                        opacity: 1,
                        height: "auto",
                        overflow: "visible",
                        marginTop: 20,
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
                    <div className="text-sm text-gray-300 max-w-sm">
                      {transaction?.paymentTransferStatus === "pending" &&
                        status === "completed" && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                          >
                            The Beneficiary will Receive the Amount of{" "}
                            <span className="text-emerald-400 font-medium">
                              ₹
                              {transaction?.receiveAmount?.toFixed(2) || "0.00"}
                            </span>{" "}
                            on{" "}
                            {transaction?.createdAt
                              ? getFormattedNextWorkingDay(
                                  transaction.createdAt
                                )
                              : "N/A"}
                          </motion.p>
                        )}

                      {transaction?.paymentTransferStatus === "completed" && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3, duration: 0.5 }}
                        >
                          The Amount of{" "}
                          <span className="text-emerald-400 font-medium">
                            ₹{transaction?.receiveAmount?.toFixed(2) || "0.00"}
                          </span>{" "}
                          is transferred successfully to the Beneficiary.
                        </motion.p>
                      )}

                      {status === "failed" && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3, duration: 0.5 }}
                        >
                          Transaction Failed.
                        </motion.p>
                      )}
                    </div>
                  </div>

                  <motion.div
                    className="text-right"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="text-emerald-400 text-2xl font-bold">
                      ₹{transaction?.receiveAmount?.toFixed(2) || "0.00"}
                    </span>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
      <ToastContainer />

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
      <ToastContainer />
    </motion.div>
  );
};
