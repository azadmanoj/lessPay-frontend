/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Phone, Lock, Eye, EyeOff } from 'lucide-react';
import { Input } from '../ui/Input';
import { api } from '@/services/api';

interface ForgotPasswordScreenProps {
    onBack: () => void;
    onSuccess: () => void;
}

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ onBack, onSuccess }) => {
    const [step, setStep] = useState<'phone' | 'otp' | 'newPassword'>('phone');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        if (input.startsWith('+91')) {
            const numbers = input.slice(3).replace(/\D/g, '');
            if (numbers.length <= 10) {
                setPhone('+91' + numbers);
            }
        } else {
            const numbers = input.replace(/\D/g, '');
            if (numbers.length <= 10) {
                setPhone('+91' + numbers);
            }
        }
    };

    const handleRequestOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!phone || phone.length < 13) {
            setError('Please enter a valid phone number');
            return;
        }

        setLoading(true);
        try {
            await api.requestPasswordReset(phone);
            setStep('otp');
            setError('');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = (e: React.FormEvent) => {
        e.preventDefault();
        if (!otp || otp.length !== 6) {
            setError('Please enter a valid OTP');
            return;
        }
        setStep('newPassword');
        setError('');
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPassword || newPassword.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            await api.resetPassword(phone, otp, newPassword);
            onSuccess();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-600 p-4 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
                <button
                    onClick={onBack}
                    className="text-gray-600 hover:text-gray-800 mb-6 flex items-center"
                >
                    ← Back to Login
                </button>

                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">Reset Password</h2>
                    <p className="text-gray-600 mt-2">
                        {step === 'phone' ? 'Enter your registered phone number' :
                            step === 'otp' ? 'Enter the OTP sent to your phone' :
                                'Create your new password'}
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                {step === 'phone' && (
                    <form onSubmit={handleRequestOTP} className="space-y-6">
                        <Input
                            type="text"
                            value={phone}
                            onChange={handlePhoneChange}
                            placeholder="+91 Enter mobile number"
                            leftIcon={<Phone size={18} />}
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {loading ? 'Sending OTP...' : 'Send OTP'}
                        </button>
                    </form>
                )}

                {step === 'otp' && (
                    <form onSubmit={handleVerifyOTP} className="space-y-6">
                        <Input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            placeholder="Enter 6-digit OTP"
                            maxLength={6}
                        />
                        <button
                            type="submit"
                            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700"
                        >
                            Verify OTP
                        </button>
                    </form>
                )}

                {step === 'newPassword' && (
                    <form onSubmit={handleResetPassword} className="space-y-6">
                        <Input
                            type={showPassword ? 'text' : 'password'}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
                            leftIcon={<Lock size={18} />}
                            rightIcon={
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            }
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {loading ? 'Resetting Password...' : 'Reset Password'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};
