/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { UserProfile } from '@/components/profile/UserProfile';
import { withAuth } from '@/components/hoc/withAuth';
import { api } from '@/services/api';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

const ProfilePage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const handleUpdateProfile = async (data: any) => {
    setLoading(true);
    try {
      await api.updatePersonalInfo(data);
      setError('Profile updated successfully!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (oldPassword: string, newPassword: string) => {
    setLoading(true);
    try {
      await api.updatePassword(oldPassword, newPassword);
      setError('Password updated successfully!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBankAccount = async (data: any) => {
    console.log("🚀 ~ handleAddBankAccount ~ data:", data)
    setLoading(true);
    try {
      await api.updateBankDetails(data);
      setError('Bank details updated successfully!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserProfile
      onUpdateProfile={handleUpdateProfile}
      onChangePassword={handleChangePassword}
      onAddBankAccount={handleAddBankAccount}
      loading={loading}
      error={error}
      profile={user}
    />
  );
};

export default withAuth(ProfilePage);
