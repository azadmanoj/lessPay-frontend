"use client";

import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import { isAuthPage } from "@/utils/routes";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut, CreditCard, Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (isAuthPage(pathname)) return null;

  const navItemVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
  };

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      x: "100%",
      transition: {
        duration: 0.2,
      },
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.2,
      },
    },
  };

  const NavItems = () => (
    <>
      {isAuthenticated ? (
        <>
          <motion.div whileHover="hover" variants={navItemVariants}>
            <Link
              href="/dashboard"
              className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-emerald-400 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <CreditCard className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
          </motion.div>

          <motion.div whileHover="hover" variants={navItemVariants}>
            <Link
              href="/admin"
              className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-emerald-400 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <CreditCard className="w-4 h-4" />
              <span>Admin</span>
            </Link>
          </motion.div>

          <motion.div whileHover="hover" variants={navItemVariants}>
            <Link
              href="/profile"
              className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-emerald-400 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <User className="w-4 h-4" />
              <span>Profile</span>
            </Link>
          </motion.div>

          <motion.button
            whileHover="hover"
            variants={navItemVariants}
            onClick={() => {
              setIsMobileMenuOpen(false);
              logout();
            }}
            className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-red-400 transition-colors w-full"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </motion.button>
        </>
      ) : (
        <motion.div whileHover="hover" variants={navItemVariants}>
          <Link
            href="/"
            className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-emerald-400 transition-colors bg-gray-800/50 hover:bg-gray-700/50 rounded-lg"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <User className="w-4 h-4" />
            <span>Login</span>
          </Link>
        </motion.div>
      )}
    </>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/30 border-b border-gray-800/50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <CreditCard className="w-8 h-8 text-emerald-400" />
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 text-transparent bg-clip-text">
                LessPay
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <NavItems />
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-300 hover:text-emerald-400 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={mobileMenuVariants}
            className="fixed inset-y-0 right-0 w-64 bg-gray-900/95 backdrop-blur-lg border-l border-gray-800/50 md:hidden"
          >
            <div className="flex flex-col py-4 space-y-1">
              <NavItems />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
