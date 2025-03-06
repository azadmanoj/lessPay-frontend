/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-wrapper-object-types */
// types.ts
export interface Transaction {
  _id: string;
  amount: number;
  receiveAmount:number;
  smslink: string;
  txn_id: string;
  paymentStatus: "pending" | "completed" | "failed";
  paymentTransferStatus: "pending" | "completed" | "failed";
  paymentTransactionId: string;
  createdAt?: string;
  status?: "pending" | "completed" | "failed"; // Add this if needed for compatibility
}

export interface BankDetails {
  accountHolder: String;
  accountNumber: String;
  ifscCode: String;
  bankName: String;
}

export interface PaymentResponse {
  message: string;
  paymentLink: string;
  transactionId: string;
}

export interface StatusResponse {
  status: Transaction["status"];
  details: any; // Type this based on actual status response
}

export interface FeatureCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

export type UTRStatus = "Pending" | "Approved" | "Rejected";

export interface UserData {
  _id: string;
  name: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  userRole: string;
  utrNumber: string;
  utrStatus: UTRStatus;
  accountHolder: string;
  accountNumber: string;
  ifscCode: string;
  bankDetails: BankDetails;
  transaction: Transaction;
}
