import React, { useEffect } from 'react';
import { Check, XCircle, AlertTriangle } from 'lucide-react';

interface PaymentTableProps {
    paymentDetails: {
        transactionId: string;
        amount: number;
        status: 'completed' | 'failed' | 'pending';
        timestamp: string;
        recipient: string;
        description?: string;
    };
    onClose: () => void;
}

export const PaymentTable: React.FC<PaymentTableProps> = ({ paymentDetails, onClose }) => {
    useEffect(() => {
        // Automatically close the payment details after 3 seconds
        const timer = setTimeout(() => {
            onClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'failed':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = () => {
        switch (paymentDetails.status) {
            case 'completed':
                return <Check className="h-8 w-8 text-green-600" />;
            case 'failed':
                return <XCircle className="h-8 w-8 text-red-600" />;
            case 'pending':
                return <AlertTriangle className="h-8 w-8 text-yellow-600" />;
            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                <div className="flex justify-center mb-4">
                    <div className={`rounded-full p-3 ${
                        paymentDetails.status === 'completed' ? 'bg-green-100' :
                        paymentDetails.status === 'failed' ? 'bg-red-100' : 'bg-yellow-100'
                    }`}>
                        {getStatusIcon()}
                    </div>
                </div>

                <h3 className={`text-center text-xl font-semibold mb-6 ${
                    paymentDetails.status === 'completed' ? 'text-green-800' :
                    paymentDetails.status === 'failed' ? 'text-red-800' : 'text-yellow-800'
                }`}>
                    Payment {paymentDetails.status.charAt(0).toUpperCase() + paymentDetails.status.slice(1)}
                </h3>

                <div className="space-y-4">
                    <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Transaction ID</span>
                        <span className="font-medium">{paymentDetails.transactionId}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Amount</span>
                        <span className="font-medium text-lg">₹{paymentDetails.amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Recipient</span>
                        <span className="font-medium">{paymentDetails.recipient}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Date & Time</span>
                        <span className="font-medium">
                            {new Date(paymentDetails.timestamp).toLocaleString()}
                        </span>
                    </div>
                    {paymentDetails.description && (
                        <div className="flex justify-between py-2 border-b">
                            <span className="text-gray-600">Description</span>
                            <span className="font-medium">{paymentDetails.description}</span>
                        </div>
                    )}
                    <div className="flex justify-between py-2">
                        <span className="text-gray-600">Status</span>
                        <span className={`px-2 py-1 rounded-full text-sm font-semibold ${getStatusColor(paymentDetails.status)}`}>
                            {paymentDetails.status.toUpperCase()}
                        </span>
                    </div>
                </div>

                <div className="mt-8">
                    <button
                        onClick={onClose}
                        className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};
