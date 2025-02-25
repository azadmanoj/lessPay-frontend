/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from './axios';

interface TransactionPayload {
  amount: number;
  utrNumber: string;
  utrStatus: 'pending' | 'completed' | 'failed';
  paymentStatus: 'pending' | 'completed' | 'failed';
}

export const createTransaction = async ({ amount, utrNumber }: Pick<TransactionPayload, 'amount' | 'utrNumber'>) => {
  try {
    const payload: TransactionPayload = {
      amount,
      utrNumber,
      utrStatus: 'pending',
      paymentStatus: 'pending'
    };
    const { data } = await axios.post('/profile/transactions', payload);
    return data;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to create transaction');
  }
};

export const getTransactions = async () => {
  try {
    const { data } = await axios.get('/profile/transactions');
    return data;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch transactions');
  }
};
