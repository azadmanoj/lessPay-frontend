/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { BankDetails, Transaction } from "../../type";

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

  const listItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-lg shadow-lg max-h-[90vh] w-full max-w-6xl overflow-hidden flex flex-col"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with glass effect */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-5 rounded-t-xl flex justify-between items-center backdrop-blur-md">
            <motion.h2
              className="text-2xl font-bold text-white"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {user.fullName.split(" ")[0]}'s Profile
            </motion.h2>
            <motion.button
              onClick={onClose}
              className="text-white bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors duration-300"
              whileHover={{ rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.button>
          </div>

          {/* Scrollable content */}
          <div className="overflow-y-auto flex-1 p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Profile Section */}
              <motion.div
                className="bg-white rounded-lg shadow-lg p-6 flex-1 border border-gray-100"
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
                        <Image
                          src={user.profileImage}
                          alt="Profile Picture"
                          width={100}
                          height={100}
                          className="rounded-full border-4 border-blue-500 shadow-lg transition-all duration-300"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg transition-all duration-300">
                          {user.fullName.charAt(0)|| "NA"}
                        </div>
                      )}
                    </motion.div>
                    <motion.div
                      className="absolute bottom-0 right-0 bg-green-500 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5, type: "spring" }}
                    >
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </motion.div>
                  </div>
                  <div className="ml-0 sm:ml-6 text-center sm:text-left">
                    <motion.h1
                      className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      {user.fullName}
                    </motion.h1>
                    <motion.p
                      className="text-gray-600 flex items-center justify-center sm:justify-start"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <span className="mr-1">🇮🇳</span>
                      {user.address || "Northridge, California(CA), 91326, USA"}
                    </motion.p>
                  </div>
                </motion.div>

                <motion.div
                  className="space-y-4 divide-y divide-gray-100"
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
                      className="flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-300"
                      whileHover={{
                        y: -5,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                    >
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 shadow-md">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Age</p>
                        <p className="font-medium text-gray-800">
                          {user.age || "NA"}
                        </p>
                      </div>
                    </motion.div>
                    <motion.div
                      className="flex items-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors duration-300"
                      whileHover={{
                        y: -5,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                    >
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3 shadow-md">
                        <Users className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Gender</p>
                        <p className="font-medium text-gray-800">
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
                      className="flex items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-300"
                      variants={cardVariants}
                      custom={1}
                      whileHover={{ x: 5 }}
                    >
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3 shadow-md">
                        <Activity className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Status</p>
                        <p className="font-medium text-green-500">
                          {user.status || "Active"}
                        </p>
                      </div>
                    </motion.div>

                    <motion.div
                      className="flex items-center p-3 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors duration-300"
                      variants={cardVariants}
                      custom={2}
                      whileHover={{ x: 5 }}
                    >
                      <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-3 shadow-md">
                        <Award className="w-5 h-5 text-yellow-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Role</p>
                        <p className="font-medium text-gray-800">
                          {user?.userRole || "Administrator"}
                        </p>
                      </div>
                    </motion.div>

                    <motion.div
                      className="flex items-center p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-300"
                      variants={cardVariants}
                      custom={3}
                      whileHover={{ x: 5 }}
                    >
                      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3 shadow-md">
                        <Mail className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="font-medium text-gray-800">
                          {user.email}
                        </p>
                      </div>
                    </motion.div>

                    <motion.div
                      className="flex items-center p-3 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors duration-300"
                      variants={cardVariants}
                      custom={4}
                      whileHover={{ x: 5 }}
                    >
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3 shadow-md">
                        <Phone className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Contact</p>
                        <p className="font-medium text-gray-800">
                          {user.phoneNumber || "NA"}
                        </p>
                      </div>
                    </motion.div>

                    <motion.div
                      className="flex items-center p-3 bg-sky-50 rounded-lg hover:bg-sky-100 transition-colors duration-300"
                      variants={cardVariants}
                      custom={5}
                      whileHover={{ x: 5 }}
                    >
                      <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center mr-3 shadow-md">
                        <CreditCard className="w-5 h-5 text-sky-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">
                          Bank Account Details
                        </p>
                        <div className="mt-2 space-y-1 bg-white p-3 rounded-lg shadow-sm">
                          <p className="font-medium text-sm text-gray-800 flex justify-between">
                            <span className="text-gray-500">
                              Account Holder:
                            </span>
                            <span>
                              {user.bankDetails?.accountHolder || "NA"}
                            </span>
                          </p>
                          <p className="font-medium text-sm text-gray-800 flex justify-between">
                            <span className="text-gray-500">
                              Account Number:
                            </span>
                            <span>
                              {user.bankDetails?.accountNumber ||
                                "XXXX-XXXX-XXXX-1234"}
                            </span>
                          </p>
                          <p className="font-medium text-sm text-gray-800 flex justify-between">
                            <span className="text-gray-500">Bank Name:</span>
                            <span>{user.bankDetails?.bankName || "NA"}</span>
                          </p>
                          <p className="font-medium text-sm text-gray-800 flex justify-between">
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
                className="flex-1 flex flex-col gap-6"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <motion.div
                  className="bg-white rounded-lg shadow-lg p-6 border border-gray-100"
                  whileHover={{ boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className="flex items-center mb-6"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg mr-3 shadow-md">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-white"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                      Your Transactions
                    </h2>
                  </motion.div>

                  <motion.ul
                    className="space-y-3"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {user.transactions && user.transactions.length > 0 ? (
                      user.transactions.map((transaction, index) => (
                        <motion.li
                          key={transaction._id}
                          variants={listItemVariants}
                          custom={index}
                          whileHover={{ scale: 1.02 }}
                          className="border border-gray-100 rounded-lg p-4 hover:bg-purple-50 transition-colors duration-200 shadow-sm"
                        >
                          <div className="flex items-start">
                            <div className="bg-purple-100 rounded-full p-3 mr-4 shadow-md">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="text-purple-600 w-5 h-5"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                              </svg>
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <p>
                                  <span className="font-medium text-purple-700">
                                    {user.fullName}
                                  </span>
                                </p>
                                <motion.span
                                  className="font-bold text-gray-800 bg-yellow-100 px-2 py-1 rounded-md text-sm"
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: 0.1 * index + 0.5 }}
                                >
                                  ₹{transaction.amount}
                                </motion.span>
                              </div>
                              <div className="mt-2 grid grid-cols-2 gap-2">
                                <p className="text-xs bg-gray-100 p-1 rounded-md">
                                  <span className="text-gray-800">
                                    Transaction ID:
                                  </span>
                                  <br />
                                  <span className="font-medium text-gray-800">
                                    {transaction.txn_id}
                                  </span>
                                </p>
                                <p className="text-xs bg-gray-100 p-2 rounded-md">
                                  <span className="text-gray-500">
                                    Payment Status:
                                  </span>
                                  <br />
                                  <span
                                    className={`font-medium ${
                                      transaction.paymentStatus === "pending"
                                        ? "text-yellow-600"
                                        : "text-green-600"
                                    }`}
                                  >
                                    {transaction.paymentStatus}
                                  </span>
                                </p>
                              </div>
                              <motion.div
                                className="mt-2"
                                whileHover={{ scale: 1.03 }}
                              >
                                <a
                                  href={transaction.smslink}
                                  className="text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 transition-colors px-3 py-2 rounded-md text-sm font-medium inline-block w-full text-center"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  View Payment Link →
                                </a>
                              </motion.div>
                            </div>
                          </div>
                        </motion.li>
                      ))
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-center py-6 bg-gray-50 rounded-lg"
                      >
                        <p className="text-gray-500">No transactions found</p>
                      </motion.div>
                    )}
                  </motion.ul>
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
