/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  MapPin,
  Send,
  MessageSquare,
  User,
  Sparkles,
} from "lucide-react";

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

import { toast, ToastContainer } from "react-toastify";


const ENDPOINT = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

const ContactPage = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Make the API call to the backend to send the email
    try {
      const response = await fetch(`${ENDPOINT}/auth/send-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(true);
        setFormData({ name: "", email: "", message: "" });
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      } else {
        toast.error("Failed to send Email");
      }
    } catch (error) {
      console.error("Error:", error);
      setSuccess(false); // You can display an error message here
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      details: "support@paymentBuddy.com",
      delay: 0.3,
    },
    {
      icon: MapPin,
      title: "Address",
      details: "Vijay Nagar, Indore, India",
      delay: 0.4,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen mb-20 bg-gradient-to-br from-black via-gray-900 to-emerald-950 pt-20 pb-12"
    >
      {/* Animated Background Elements */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <motion.div
          className="absolute w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl"
          style={{ top: "10%", left: "5%" }}
          animate={{
            x: [0, 30, 0],
            y: [0, 20, 0],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            repeat: Infinity,
            duration: 15,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute w-96 h-96 bg-emerald-800/10 rounded-full blur-3xl"
          style={{ bottom: "10%", right: "5%" }}
          animate={{
            x: [0, -40, 0],
            y: [0, 30, 0],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            repeat: Infinity,
            duration: 20,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-block bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-full text-sm font-medium border border-emerald-500/20 mb-4"
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="w-4 h-4 inline mr-2" />
            Get in Touch
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Contact Us
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Have questions about our payment solutions? We're here to help.
            Reach out to us and we'll get back to you as soon as possible.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            {contactInfo.map((info) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: info.delay }}
                className="bg-gray-800/50 p-6 rounded-xl backdrop-blur-sm border border-gray-700 hover:border-emerald-500/30 transition-all"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-emerald-500/10 p-3 rounded-full">
                    <info.icon className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{info.title}</h3>
                    <p className="text-gray-400">{info.details}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800/50 rounded-xl backdrop-blur-sm border border-gray-700 p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-400 mb-2">Your Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 mb-2">
                 Your Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 mb-2">Message</label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <textarea
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    rows={4}
                    className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white"
                    required
                  />
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 rounded-lg hover:from-emerald-600 hover:to-emerald-700 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : success ? (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Email Sent!</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Send Email</span>
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
      <ToastContainer />
    </motion.div>
  );
};

export default ContactPage;
