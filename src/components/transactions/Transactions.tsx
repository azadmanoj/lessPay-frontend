/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Transaction } from "../../../type";
import { motion } from "framer-motion";
import { CheckCircle, Clock, XCircle } from "react-feather"; // Icons for status

interface TransactionsProps {
  transactions: Transaction[];
}

export const Transactions: React.FC<TransactionsProps> = ({
  transactions = [],
}) => {
  // Ensure transactions is always an array
  const safeTransactions = Array.isArray(transactions) ? transactions : [];

  const [transactionStatuses, setTransactionStatuses] = useState<
    Record<string, string> // store status as "completed", "pending", "failed"
  >({});

  // Fetch payment status from API
  const fetchPaymentStatus = async (paymentTransactionId: any) => {
    console.log(
      "🚀 ~ fetchPaymentStatus ~ paymentTransactionId:",
      paymentTransactionId
    );

    try {
      const response = await fetch("http://localhost:5000/api/payment-status", {
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
      const newStatuses: Record<string, string> = {};
      for (const transaction of safeTransactions) {
        if (transaction?.paymentTransactionId) {
          const status = await fetchPaymentStatus(
            transaction.paymentTransactionId
          );
          newStatuses[transaction.paymentTransactionId] = status;
        }
      }
      setTransactionStatuses(newStatuses);
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
        return "bg-emerald-400/10 text-emerald-400";
      case "pending":
        return "bg-yellow-400/10 text-yellow-400";
      case "failed":
        return "bg-red-400/10 text-red-400";
      default:
        return "bg-gray-400/10 text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle size={16} className="mr-2" />;
      case "pending":
        return <Clock size={16} className="mr-2" />;
      case "failed":
        return <XCircle size={16} className="mr-2" />;
      default:
        return null;
    }
  };

  const getTransactionKey = (transaction: any, index: number) => {
    if (transaction?.id) return transaction.id;
    return `transaction-${index}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="rounded-lg backdrop-blur-sm"
    >
      {/* Desktop View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-800">
          <thead className="bg-gray-900/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Transaction Id
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Payment Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {sortedTransactions.length > 0 ? (
              sortedTransactions.map(
                (transaction: Transaction, index: number) => {
                  const status =
                    transactionStatuses[transaction.paymentTransactionId] ||
                    "pending";
                  return (
                    <motion.tr
                      key={getTransactionKey(transaction, index)}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {transaction?.createdAt
                          ? new Date(transaction.createdAt).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {transaction?.txn_id || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-emerald-400">
                        ₹{transaction?.amount?.toFixed(2) || "0.00"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                            status
                          )}`}
                        >
                          {getStatusIcon(status)}
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                      </td>
                    </motion.tr>
                  );
                }
              )
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-4 text-center text-sm text-gray-300"
                >
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        {sortedTransactions.map((transaction: Transaction, index: number) => {
          const status =
            transactionStatuses[transaction.paymentTransactionId] || "pending";
          return (
            <motion.div
              key={getTransactionKey(transaction, index)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="p-4 border-b border-gray-800 space-y-3"
            >
              <div className="flex justify-between items-start">
                <span className="text-sm text-gray-400">
                  {transaction?.createdAt
                    ? new Date(transaction.createdAt).toLocaleDateString()
                    : "N/A"}
                </span>
                <span className="font-medium text-emerald-400">
                  ₹{transaction?.amount?.toFixed(2) || "0.00"}
                </span>
              </div>

              <div className="text-sm text-gray-300">
                UTR: {transaction?.txn_id || "N/A"}
              </div>
              <div className="text-sm">
                <span
                  className={`px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                    status
                  )}`}
                >
                  {getStatusIcon(status)}
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
              </div>
            </motion.div>
          );
        })}

        {sortedTransactions.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            No transactions found
          </div>
        )}
      </div>
    </motion.div>
  );
};
