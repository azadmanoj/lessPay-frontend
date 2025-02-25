"use client";
import React, { useState, useEffect } from "react";
import {
  UserCircle,
  Search,
  Phone,
  CreditCard,
  Building2,
  AlertCircle,
  CheckCircle2,
  Clock,
  LogOut,
} from "lucide-react";
import { api } from '@/services/api';
import { motion } from "framer-motion";

// Types
interface User {
  id: number;
  name: string;
  phoneNumber: string;
  utrNumber: string;
  utrStatus: UTRStatus;
  accountHolder: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
}

type UTRStatus = "Pending" | "Approved" | "Rejected";

const AdminPage: React.FC = () => {
  // State
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Authentication check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        const profile = await api.getProfile();
        console.log("ppppppppppp",profile);
        
        setIsAuthenticated(true);
        await fetchUsers();
      } catch (error) {
        console.error("Authentication failed:", error);
        handleAuthError();
      }
    };

    checkAuth();
  }, []);

  // Error handling
  const handleAuthError = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
    setUsers([]);
    setError("Authentication failed. Please log in again.");
    setLoading(false);
  };

  // Fetch users
  const fetchUsers = async () => {
    try {
      const response = await api.getProfile();
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to fetch users data.");
    } finally {
      setLoading(false);
    }
  };

  // Handle status change
  // const handleStatusChange = async (id: number, newStatus: UTRStatus) => {
  //   try {
  //     await api.updatePersonalInfo(`/api/users/${id}/status`, { status: newStatus });
  //     const updatedUsers = users.map((user) =>
  //       user.id === id ? { ...user, utrStatus: newStatus } : user
  //     );
  //     setUsers(updatedUsers);
  //   } catch (error) {
  //     console.error("Error updating status:", error);
  //     setError("Failed to update user status.");
  //   }
  // };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
    setUsers([]);
  };

  // Status helpers
  const getStatusIcon = (status: UTRStatus) => {
    switch (status) {
      case "Approved":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case "Rejected":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: UTRStatus) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "Rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phoneNumber.includes(searchTerm) ||
      user.utrNumber.includes(searchTerm);

    if (selectedFilter === "all") return matchesSearch;
    return matchesSearch && user.utrStatus.toLowerCase() === selectedFilter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin absolute top-0 left-0 animation-delay-500" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
          <p className="text-gray-600">Please log in to access the admin dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <Building2 className="w-8 h-8 text-blue-500" />
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                Admin Dashboard
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative w-full md:w-64">
                <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users, UTR, phone..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 hover:shadow-md"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors duration-300"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {["all", "approved", "pending", "rejected"].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-4 py-2 rounded-lg capitalize transition-all duration-300 ${
                  selectedFilter === filter
                    ? "bg-blue-500 text-white shadow-md"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-500 to-purple-500">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                      User Details
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                      UTR Info
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                      Bank Details
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border-b border-gray-100 hover:bg-blue-50/50 transition-all duration-300"
                    >
                      {/* User Details Cell */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-200 to-purple-200 flex items-center justify-center">
                            <UserCircle className="w-6 h-6 text-blue-500" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                              <Phone className="w-4 h-4" /> {user.phoneNumber}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* UTR Info Cell */}
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <div className="text-sm text-gray-500">
                            UTR: {user.utrNumber}
                          </div>
                          <div
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                              user.utrStatus
                            )}`}
                          >
                            {getStatusIcon(user.utrStatus)}
                            {user.utrStatus}
                          </div>
                        </div>
                      </td>

                      {/* Bank Details Cell */}
                      <td className="px-6 py-4">
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">{user.accountNumber}</span>
                          </div>
                          <div className="text-gray-500">
                            <span className="font-medium">{user.accountHolder}</span>
                            <span className="mx-2">•</span>
                            {user.bankName}
                          </div>
                          <div className="text-gray-400 text-xs">
                            IFSC: {user.ifscCode}
                          </div>
                        </div>
                      </td>

                      {/* Actions Cell */}
                      <td className="px-6 py-4">
                        <select
                          value={user.utrStatus}
                          // onChange={(e) =>
                          //   handleStatusChange(
                          //     user.id,
                          //     e.target.value as UTRStatus
                          //   )
                          // }
                          className="w-full text-black px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 hover:border-blue-500 cursor-pointer"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Approved">Approved</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminPage;