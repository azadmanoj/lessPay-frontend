/* eslint-disable react/no-unescaped-entities */
"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Target,
  Award,
  Users,
  Shield,
  TrendingUp,
  Sparkles,
  Check,
} from "lucide-react";

const AboutPage = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const features = [
    {
      icon: Shield,
      title: "Secure Payments",
      description: "Bank-grade security for all your transactions",
    },
    {
      icon: TrendingUp,
      title: "Lowest Interest Rate",
      description: "Competitive rates starting at just 1.80%",
    },
    {
      icon: Users,
      title: "24/7 Support",
      description: "Round-the-clock customer assistance",
    },
  ];

  const stats = [
    { label: "Active Users", value: "10K+" },
    { label: "Transactions", value: "₹1M+" },
    { label: "Success Rate", value: "99.9%" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen mb-20 bg-gradient-to-br from-black via-gray-900 to-emerald-950 pt-20 pb-12"
    >
      {/* Animated Background Elements */}
      <div className="fixed  h inset-0 z-0 overflow-hidden">
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
            <Target className="w-4 h-4 inline mr-2" />
            Our Mission
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Revolutionizing Digital Payments
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            We're on a mission to make digital payments more accessible, secure,
            and cost-effective for everyone.
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          variants={fadeIn}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 text-center border border-gray-700"
            >
              <div className="text-3xl font-bold text-emerald-400 mb-2">
                {stat.value}
              </div>
              <div className="text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Section */}
        <motion.div
          variants={fadeIn}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
            >
              <feature.icon className="w-8 h-8 text-emerald-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Why Choose Us Section */}
        <motion.div
          variants={fadeIn}
          initial="initial"
          animate="animate"
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700 mb-16"
        >
          <div className="flex items-center gap-2 mb-6">
            <Award className="w-6 h-6 text-emerald-400" />
            <h2 className="text-2xl font-bold text-white">
              Why Choose PaymentBuddy
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              "Lowest interest rates in the market",
              "Quick and hassle-free payments",
              "Bank-grade security measures",
              "24/7 customer support",
              "No hidden charges",
              "Instant payment confirmation",
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="bg-emerald-500/10 p-2 rounded-full">
                  <Check className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="text-gray-300">{item}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          variants={fadeIn}
          initial="initial"
          animate="animate"
          className="text-center"
        >
          <motion.div
            className="inline-block bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-full text-sm font-medium border border-emerald-500/20 mb-4"
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="w-4 h-4 inline mr-2" />
            Get Started Today
          </motion.div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Experience Better Payments?
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied users who trust PaymentBuddy for their
            payment needs.
          </p>
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-8 py-3 rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all"
            href="/dashboard"
          >
            Start Now
          </motion.a>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AboutPage;
