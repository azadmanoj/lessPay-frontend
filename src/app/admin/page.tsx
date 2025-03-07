/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, AlertCircle, Eye, ArrowLeft } from "lucide-react";
import { api } from "@/services/api";
import { motion } from "framer-motion";
import UserModal, { UserData, Activity } from "../../components/userModal";

// Define Transaction interface
interface Transaction {
  _id: string;
  amount: number;
  txn_id: string;
  paymentTransactionId: string;
  smslink: string;
  email?: string;
  paymentStatus: string;
  createdAt?: string;
}

const AdminPage: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [userActivities, setUserActivities] = useState<Activity[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showAllTransactions, setShowAllTransactions] =
    useState<boolean>(false);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.getUsers();
        setUsers(response || []);
        setFilteredUsers(response || []);

        // Extract all transactions from all users
        const transactions: Transaction[] = [];
        response?.forEach((user: UserData) => {
          if (user.transactions && user.transactions.length > 0) {
            // Add user information to each transaction
            const userTransactions = user.transactions.map(
              (txn: Transaction) => ({
                ...txn,
                userFullName: user.fullName,
                userEmail: user.email,
                createdAt: txn.createdAt as string, // Type assertion
              })
            );

            // Push the modified transactions to the transactions array
            transactions.push(...userTransactions);
          }
        });

        transactions.sort((a, b) => {
          const dateA = new Date(a.createdAt || "").getTime(); // Provide fallback date
          const dateB = new Date(b.createdAt || "").getTime(); // Provide fallback date
          return dateB - dateA;
        });

        setAllTransactions(transactions);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to fetch users data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    // Filter users by email based on the search query
    if (searchQuery && !showAllTransactions) {
      setFilteredUsers(
        users.filter((user) =>
          user.email.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else if (!showAllTransactions) {
      setFilteredUsers(users); // Reset to all users when search query is cleared
    }
  }, [searchQuery, users, showAllTransactions]);

  const handleViewUser = (user: UserData) => {
    setSelectedUser(user);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setUserActivities([]);
  };

  const toggleTransactionsView = () => {
    setShowAllTransactions(!showAllTransactions);
    setSearchQuery(""); // Clear search when switching views
  };

  // Function to get appropriate status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading user data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg max-w-md">
          <div className="flex items-center">
            <AlertCircle className="w-6 h-6 mr-2" />
            <p className="font-bold">Error</p>
          </div>
          <p className="mt-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-emerald-950 pt-20 overflow-hidden"
    >
      <div className="container mx-auto p-6">
        {/* Header Section */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-4">
            Admin Dashboard
          </h1>
          <div className="flex gap-2 items-center justify-between mb-6">
            {!showAllTransactions ? (
              <input
                type="text"
                className="px-4 py-2 w-full max-w-sm bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="Search by email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            ) : (
              <button
                onClick={toggleTransactionsView}
                className="flex items-center px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg hover:bg-gray-700 transition-all"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Users
              </button>
            )}
            <button
              onClick={toggleTransactionsView}
              className="px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all flex items-center justify-center"
            >
              {!showAllTransactions ? (
                <>
                  <span className="flex items-center">
                    <span className="w-4 h-6 ">₹</span> All Transactions
                  </span>
                </>
              ) : (
                "Refresh Transactions"
              )}
            </button>
          </div>
        </motion.div>

        {/* Content Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-900/50 rounded-lg backdrop-blur-sm p-6"
        >
          {!showAllTransactions ? (
            // Users Table
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-800">
                <thead className="bg-gray-900/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Full Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Verified
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user, index) => (
                      <motion.tr
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + index * 0.05 }}
                        className="hover:bg-gray-800/50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
                                {user.fullName ? user.fullName.charAt(0) : "U"}
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-white">
                                {user.fullName || "Unknown"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              user.isVerified
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {user.isVerified ? (
                              <CheckCircle2 className="w-4 h-4 mr-1" />
                            ) : (
                              <AlertCircle className="w-4 h-4 mr-1" />
                            )}
                            {user.isVerified ? "Verified" : "Unverified"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleViewUser(user)}
                            className="text-blue-600 hover:text-blue-900 flex items-center gap-1 bg-blue-100 hover:bg-blue-200 px-3 py-2 rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4" /> View Details
                          </button>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-4 text-center text-sm text-gray-300"
                      >
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            // All Transactions Table
            <div className="overflow-x-auto max-w-full">
              <div className="overflow-y-auto max-h-[500px]">
                {" "}
                {/* Add vertical scrolling */}
                <table className="min-w-full divide-y divide-gray-800">
                  <thead className="bg-gray-900/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        View User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Transaction ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Email
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {allTransactions.length > 0 ? (
                      // Inside the transactions table mapping
                      allTransactions.map((transaction, index) => {
                        // Find the user associated with this transaction
                        const user = users.find(
                          (u) =>
                            u.email === transaction.email ||
                            u.email === (transaction as any).userEmail
                        );

                        return (
                          <motion.tr
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + index * 0.05 }}
                            className="hover:bg-gray-800/50 transition-colors"
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => user && handleViewUser(user)} // Only call if user is found
                                className="text-blue-600 hover:text-blue-900 flex items-center gap-1 bg-blue-100 hover:bg-blue-200 px-3 py-2 rounded-lg transition-colors"
                              >
                                <Eye className="w-4 h-4" /> View Details
                              </button>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              {transaction.txn_id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-white">
                                ₹{transaction.amount}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              {(transaction as any).userFullName || "Unknown"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              {transaction.createdAt
                                ? formatDate(transaction.createdAt)
                                : "N/A"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                  transaction.paymentStatus
                                )}`}
                              >
                                {transaction.paymentStatus === "completed" ? (
                                  <CheckCircle2 className="w-4 h-4 mr-1" />
                                ) : transaction.paymentStatus === "pending" ? (
                                  <AlertCircle className="w-4 h-4 mr-1" />
                                ) : (
                                  <AlertCircle className="w-4 h-4 mr-1" />
                                )}
                                {transaction.paymentStatus
                                  .charAt(0)
                                  .toUpperCase() +
                                  transaction.paymentStatus.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              {transaction.email ||
                                (transaction as any).userEmail ||
                                "Unknown"}
                            </td>
                          </motion.tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-6 py-4 text-center text-sm text-gray-300"
                        >
                          No transactions found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <UserModal
          user={selectedUser}
          activities={userActivities}
          onClose={handleCloseModal}
        />
      )}
    </motion.div>
  );
};

export default AdminPage;
