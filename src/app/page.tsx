/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { LoginScreen } from "@/components/auth/LoginScreen";
import { OTPScreen } from "@/components/auth/OTPScreen";
import { api } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const HomePage = () => {
  const { login, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState("login");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleLoginSubmit = async (
    email: string,
    password: string,
    isNewUser: boolean
  ) => {
    setError("");

    try {
      if (isNewUser) {
        await api.signUp(email, password);
        setEmail(email);
        setStep("otp");
      } else {
        const result = await api.login(email, password);
        if (result.token) {
          await login(result.token);
          router.push("/dashboard");
        } else {
          throw new Error("Invalid login response");
        }
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Authentication failed");
    }
  };

  const handleOTPVerify = async (otpValue: string) => {
    setError("");

    try {
      const result = await api.verifyOTP(email, otpValue);
      await login(result.token);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Invalid OTP");
    }
  };

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, loading, router]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-emerald-950">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
      </div>
    );
  }

  // Only show login if not authenticated and not loading
  if (!loading && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-emerald-950">
        <div className="w-full max-w-md p-4">
          {step === "login" && (
            <LoginScreen
              onSubmit={handleLoginSubmit}
              loading={loading}
              error={error}
            />
          )}
          {step === "otp" && (
            <OTPScreen
              email={email}
              onSubmit={handleOTPVerify}
              loading={loading}
              error={error}
            />
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default HomePage;
