// types.ts
export interface Transaction {
  id: string;
  amount: number;
  txn_id: string;
  paymentStatus: "pending" | "completed" | "failed";
  paymentTransactionId: string;
  createdAt?: string;
  status?: "pending" | "completed" | "failed"; // Add this if needed for compatibility
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
interface TransactionsProps {
  transactions: Transaction[];
}
