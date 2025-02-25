/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { User, Mail, Lock, Building } from "lucide-react";
import { motion } from "framer-motion";

interface UserProfileProps {
  onUpdateProfile: (data: any) => Promise<void>;
  onChangePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  onAddBankAccount: (data: any) => Promise<void>;
  loading: boolean;
  error: string;
  profile: any;
}


interface ProfileUpdateData {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  currentPassword?: string;
  newPassword?: string;
  bankDetails?: {
    accountHolder: string;
    accountNumber: string;
    ifscCode: string;
    bankName: string;
  };
}

interface BankAccountData {
  accountHolder: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  loading: externalLoading,
  error: externalError,
  profile,
}) => {
  const [activeTab, setActiveTab] = useState("personal");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(externalError || "");
  const [success, setSuccess] = useState("");

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 },
  };

  // Unified function to handle all profile updates
  const handleUpdateProfile = async (
    data: ProfileUpdateData,
    updateType: string
  ) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const userData = localStorage.getItem("userData");

      if (!userData) {
        throw new Error("User data not found in localStorage");
      }

      // Parse the data and get the user info from the user object
      const { user } = JSON.parse(userData);
      const phoneNumber = user.phone;

      const requestData: ProfileUpdateData = {
        phoneNumber,
        ...data,
      };



      const response = await fetch("http://localhost:5000/api/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || `Failed to update ${updateType}`);
      }

      setSuccess(
        `${
          updateType.charAt(0).toUpperCase() + updateType.slice(1)
        } updated successfully!`
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : `An error occurred while updating your ${updateType}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 xl:pt-28 pt-20">
      <motion.div
        {...fadeIn}
        className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 md:p-8 shadow-xl border border-gray-700"
      >
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg"
          >
            {error}
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg"
          >
            {success}
          </motion.div>
        )}

        <div className="flex flex-col md:flex-row md:items-center gap-4 md:space-x-4 mb-8">
          <div className="bg-emerald-500/10 p-4 rounded-full border border-emerald-500/20 w-fit">
            <User className="h-8 w-8 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 text-transparent bg-clip-text">
              Profile Settings
            </h1>
            <p className="text-gray-400 text-sm md:text-base">
              Manage your account settings and preferences
            </p>
          </div>
        </div>

        {/* Mobile Tabs */}
        <div className="md:hidden mb-6">
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
            className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 text-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            {["personal", "security", "bank"].map((tab) => (
              <option key={tab} value={tab}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Desktop Tabs */}
        <div className="hidden md:flex space-x-4 border-b border-gray-700 mb-6">
          {["personal", "security", "bank"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 px-4 transition-colors ${
                activeTab === tab
                  ? "border-b-2 border-emerald-500 text-emerald-400"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
          className="mt-6"
        >
          {activeTab === "personal" && (
            <PersonalInfoForm
              onSubmit={(data: any) => handleUpdateProfile(data, "profile")}
              loading={loading || externalLoading}
              initialData={profile}
            />
          )}
          {activeTab === "security" && (
            <SecurityForm
              onSubmit={(currentPassword, newPassword) =>
                handleUpdateProfile(
                  { currentPassword, newPassword },
                  "password"
                )
              }
              loading={loading || externalLoading}
            />
          )}
          {activeTab === "bank" && (
            <BankDetailsForm
              onSubmit={(bankData) =>
                handleUpdateProfile({ bankDetails: bankData }, "bank account")
              }
              loading={loading || externalLoading}
            />
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

// Update Input styles for all forms
const StyledInput = ({ leftIcon, label, ...props }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-2"
  >
    {label && (
      <label className="block text-sm font-medium text-gray-300">{label}</label>
    )}
    <div className="relative">
      {leftIcon && (
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          {leftIcon}
        </span>
      )}
      <input
        {...props}
        className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white placeholder-gray-400"
      />
    </div>
  </motion.div>
);

// Update button styles
const FormButton = ({ children, ...props }: any) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="w-full flex items-center justify-center py-3 px-4 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium hover:from-emerald-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 transition-all"
    {...props}
  >
    {children}
  </motion.button>
);

// Update form components to use new styled components
const PersonalInfoForm = ({ onSubmit, loading, initialData }: any) => {
  const [form, setForm] = useState({
    fullName: initialData?.fullName || "",
    email: initialData?.email || "",
  });

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
    >
      <StyledInput
        leftIcon={<User size={18} />}
        label="Full Name"
        placeholder="Enter your full name"
        value={form.fullName}
        onChange={(e: any) => setForm({ ...form, fullName: e.target.value })}
      />
      <StyledInput
        leftIcon={<Mail size={18} />}
        label="Email Address"
        placeholder="Enter your email address"
        type="email"
        value={form.email}
        onChange={(e: any) => setForm({ ...form, email: e.target.value })}
      />
      <FormButton type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save Changes"}
      </FormButton>
    </form>
  );
};

const SecurityForm: React.FC<{
  onSubmit: (oldPass: string, newPass: string) => void;
  loading?: boolean;
}> = ({ onSubmit, loading }) => {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");

    if (form.newPassword !== form.confirmPassword) {
      setPasswordError("New passwords don't match");
      return;
    }

    if (form.newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      return;
    }

    onSubmit(form.currentPassword, form.newPassword);
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {passwordError && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg">
          {passwordError}
        </div>
      )}
      <StyledInput
        leftIcon={<Lock size={18} />}
        type="password"
        label="Current Password"
        placeholder="Enter your current password"
        value={form.currentPassword}
        onChange={(e: any) =>
          setForm({ ...form, currentPassword: e.target.value })
        }
      />
      <StyledInput
        leftIcon={<Lock size={18} />}
        type="password"
        label="New Password"
        placeholder="Enter your new password"
        value={form.newPassword}
        onChange={(e: any) => setForm({ ...form, newPassword: e.target.value })}
      />
      <StyledInput
        leftIcon={<Lock size={18} />}
        type="password"
        label="Confirm New Password"
        placeholder="Confirm your new password"
        value={form.confirmPassword}
        onChange={(e: any) =>
          setForm({ ...form, confirmPassword: e.target.value })
        }
      />
      <FormButton type="submit" disabled={loading}>
        {loading ? "Changing..." : "Change Password"}
      </FormButton>
    </form>
  );
};

const BankDetailsForm: React.FC<{
  onSubmit: (data: BankAccountData) => void;
  loading?: boolean;
}> = ({ onSubmit, loading }) => {
  const [form, setForm] = useState<BankAccountData>({
    accountHolder: "",
    accountNumber: "",
    ifscCode: "",
    bankName: "",
  });

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
    >
      <StyledInput
        leftIcon={<User size={18} />}
        label="Account Holder Name"
        placeholder="Enter account holder name"
        value={form.accountHolder}
        onChange={(e: any) =>
          setForm({ ...form, accountHolder: e.target.value })
        }
      />
      <StyledInput
        leftIcon={<Building size={18} />}
        label="Account Number"
        placeholder="Enter account number"
        value={form.accountNumber}
        onChange={(e: any) =>
          setForm({ ...form, accountNumber: e.target.value })
        }
      />
      <StyledInput
        leftIcon={<Building size={18} />}
        label="IFSC Code"
        placeholder="Enter IFSC code"
        value={form.ifscCode}
        onChange={(e: any) => setForm({ ...form, ifscCode: e.target.value })}
      />
      <StyledInput
        leftIcon={<Building size={18} />}
        label="Bank Name"
        placeholder="Enter bank name"
        value={form.bankName}
        onChange={(e: any) => setForm({ ...form, bankName: e.target.value })}
      />
      <FormButton type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add Bank Account"}
      </FormButton>
    </form>
  );
};
