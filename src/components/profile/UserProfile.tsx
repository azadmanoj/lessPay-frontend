/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
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

  const ENDPOINT = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

  // const ENDPOINT = "http://localhost:5000";

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 },
  };

  // Request OTP for password reset
  const handleRequestOTP = async (email: string) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Using the actual API endpoint from the backend code
      const response = await fetch(`${ENDPOINT}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to send OTP");
      }

      setSuccess("OTP sent successfully to your email!");
      return result;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while sending OTP"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Handle password reset with OTP
  const handlePasswordReset = async (
    email: string,
    otp: string,
    newPassword: string
  ) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Using the actual API endpoint from the backend code
      const response = await fetch(`${ENDPOINT}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to reset password");
      }

      setSuccess(
        "Password reset successfully! Please login with your new password."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while resetting the password"
      );
      throw err;
    } finally {
      setLoading(false);
    }
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
      const user = JSON.parse(userData);
      const email = user.email;

      const requestData: ProfileUpdateData = {
        email,
        ...data,
      };

      const response = await fetch(`${ENDPOINT}/api/update-profile`, {
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
            <p className="text-gray-700 text-sm md:text-base">
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
            {["personal", "bank", "reset-password"].map((tab) => (
              <option key={tab} value={tab}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Desktop Tabs */}
        <div className="hidden md:flex space-x-4 border-b border-gray-700 mb-6">
          {["personal", "bank", "reset-password"].map((tab) => (
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

          {activeTab === "bank" && (
            <BankDetailsForm
              onSubmit={(bankData) =>
                handleUpdateProfile({ bankDetails: bankData }, "bank account")
              }
              initialBankDetails={profile?.bankDetails}
              loading={loading || externalLoading}
            />
          )}
          {activeTab === "reset-password" && (
            <ResetPasswordForm
              onRequestOTP={handleRequestOTP}
              onResetPassword={handlePasswordReset}
              loading={loading || externalLoading}
            />
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

// Styled Input Component
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

// Button Component
const FormButton = ({ children, variant = "primary", ...props }: any) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className={`w-full flex items-center justify-center py-3 px-4 rounded-lg ${
      variant === "primary"
        ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700"
        : "bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700"
    } font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 transition-all`}
    {...props}
  >
    {children}
  </motion.button>
);

// Personal Info Form Component
const PersonalInfoForm = ({ onSubmit, loading, initialData }: any) => {
  const [form, setForm] = useState({
    fullName: initialData?.fullName || "",
    email: initialData?.email || "",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        fullName: initialData.fullName || "",
        email: initialData.email || "",
      });
    }
  }, [initialData]);

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

// Bank Details Form Component
const BankDetailsForm: React.FC<{
  onSubmit: (data: BankAccountData) => void;
  initialBankDetails?: BankAccountData;
  loading?: boolean;
}> = ({ onSubmit, initialBankDetails, loading }) => {
  const [form, setForm] = useState<BankAccountData>({
    accountHolder: initialBankDetails?.accountHolder || "",
    accountNumber: initialBankDetails?.accountNumber || "",
    ifscCode: initialBankDetails?.ifscCode || "",
    bankName: initialBankDetails?.bankName || "",
  });

  // Update form when initialBankDetails changes
  useEffect(() => {
    if (initialBankDetails) {
      setForm({
        accountHolder: initialBankDetails.accountHolder || "",
        accountNumber: initialBankDetails.accountNumber || "",
        ifscCode: initialBankDetails.ifscCode || "",
        bankName: initialBankDetails.bankName || "",
      });
    }
  }, [initialBankDetails]);

  return (
    <form
      className="space-y-6 h-[40vh] lg:h-[50vh] overflow-y-auto"
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
        {loading ? "Saving..." : "Save Bank Details"}
      </FormButton>
    </form>
  );
};

// Export ResetPasswordForm component for use in other components
export const ResetPasswordForm: React.FC<{
  onRequestOTP: (email: string) => Promise<any>;
  onResetPassword: (
    email: string,
    otp: string,
    newPassword: string
  ) => Promise<void>;
  loading?: boolean;
  login?: boolean;
}> = ({ onRequestOTP, onResetPassword, loading, login = false }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [localLoading, setLocalLoading] = useState(false);

  useEffect(() => {
    // Get email from localStorage
    const userData = localStorage.getItem("userData");
    if (userData) {
      const user = JSON.parse(userData);
      setFormData((prev) => ({ ...prev, email: user.email || "" }));
    }
  }, []);

  // Step 1: Request OTP
  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLocalLoading(true);

    try {
      await onRequestOTP(formData.email);
      setSuccess("OTP sent successfully to your email!");
      setTimeout(() => {
        setStep(2);
        setSuccess("");
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Failed to send OTP");
    } finally {
      setLocalLoading(false);
    }
  };

  // Step 2: Verify OTP and Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.otp) {
      setError("OTP is required");
      return;
    }

    if (formData.newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (formData.newPassword !== formData.confirmNewPassword) {
      setError("New passwords don't match");
      return;
    }

    setLocalLoading(true);
    try {
      await onResetPassword(formData.email, formData.otp, formData.newPassword);
      setSuccess(
        "Password reset successfully! Please login with your new password."
      );
      // Clear the form after successful reset
      setFormData((prev) => ({
        ...prev,
        otp: "",
        newPassword: "",
        confirmNewPassword: "",
      }));

      // Go back to step 1 after a delay
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err: any) {
      setError(err.message || "Failed to reset password");
    } finally {
      setLocalLoading(false);
    }
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg">
          {success}
        </div>
      )}

      {step === 1 ? (
        // Step 1: Request OTP Form
        <div className="">
          <form className="space-y-6" onSubmit={handleRequestOTP}>
            <StyledInput
              leftIcon={<Mail size={18} />}
              type="email"
              name="email"
              label="Email Address"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleChange}
            />

            <FormButton type="submit" disabled={localLoading || loading}>
              {localLoading || loading ? "Sending OTP..." : "Send OTP"}
            </FormButton>
          </form>
          {login && (
            <div className="mt-3">
              <FormButton
                onClick={() => window.location.reload()} // Use window.location.reload() to reload the page
                disabled={localLoading || loading}
              >
                Back To Login
              </FormButton>
            </div>
          )}
        </div>
      ) : (
        // Step 2: Verify OTP and Reset Password Form
        <form className="space-y-6" onSubmit={handleResetPassword}>
          <StyledInput
            leftIcon={<Mail size={18} />}
            type="email"
            name="email"
            label="Email Address"
            placeholder="Enter your email address"
            value={formData.email}
            disabled
          />

          <StyledInput
            leftIcon={<Lock size={18} />}
            type="text"
            name="otp"
            label="OTP"
            placeholder="Enter the OTP sent to your email"
            value={formData.otp}
            onChange={handleChange}
          />

          <StyledInput
            leftIcon={<Lock size={18} />}
            type="password"
            name="newPassword"
            label="New Password"
            placeholder="Enter your new password"
            value={formData.newPassword}
            onChange={handleChange}
          />

          <StyledInput
            leftIcon={<Lock size={18} />}
            type="password"
            name="confirmNewPassword"
            label="Confirm New Password"
            placeholder="Confirm your new password"
            value={formData.confirmNewPassword}
            onChange={handleChange}
          />

          <div className="flex space-x-4">
            <FormButton
              type="button"
              variant="secondary"
              onClick={() => setStep(1)}
              disabled={localLoading || loading}
            >
              Back
            </FormButton>
            <FormButton type="submit" disabled={localLoading || loading}>
              {localLoading || loading
                ? "Resetting Password..."
                : "Reset Password"}
            </FormButton>
          </div>
        </form>
      )}
    </div>
  );
};
