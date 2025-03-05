"use client";

import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import { isAuthPage } from "@/utils/routes";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  LogOut,
  CreditCard,
  Menu,
  X,
  Building,
  ArrowRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import { UserData } from "../../../type";
import { api } from "@/services/api";
import { HiMail } from "react-icons/hi";
import { FaInfoCircle } from "react-icons/fa";

const Navbar = () => {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const [user, setUser] = useState<UserData>();

  const [animationStage, setAnimationStage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationStage((prev) => (prev + 1) % 4);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          setIsAuthenticated(false);
          return;
        }

        const profile = await api.getProfile();
        setUser(profile);

        setIsAuthenticated(true);
      } catch (error) {
        console.error("Authentication failed:", error);
        handleAuthError();
      }
    };

    checkAuth();
  }, []);

  if (isAuthPage(pathname)) return null;

  const handleAuthError = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
  };

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
      opacity: 50,
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
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-2 lg:hidden right-2 text-emerald-400 hover:text-emerald-600 transition-colors rounded-full p-2"
              aria-label="Close Menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <Link
              href="/dashboard"
              className="flex items-center space-x-2 px-4 py-2 text-emerald-400 hover:text-emerald-400 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <CreditCard className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
          </motion.div>

          {user && user?.userRole === "Admin" && (
            <motion.div whileHover="hover" variants={navItemVariants}>
              <Link
                href="/admin"
                className="flex items-center space-x-2 px-4 py-2 text-emerald-400 hover:text-emerald-400 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <CreditCard className="w-4 h-4" />
                <span>Admin</span>
              </Link>
            </motion.div>
          )}

          <motion.div whileHover="hover" variants={navItemVariants}>
            <Link
              href="/profile"
              className="flex items-center space-x-2 px-4 py-2 text-emerald-400 hover:text-emerald-400 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <User className="w-4 h-4" />
              <span>Profile</span>
            </Link>
          </motion.div>

          <motion.div whileHover="hover" variants={navItemVariants}>
            <Link
              href="/about"
              className="flex items-center space-x-2 px-4 py-2 text-emerald-400 hover:text-emerald-400 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <FaInfoCircle className="w-4 h-4" />{" "}
              {/* Updated Icon for About */}
              <span>About</span>
            </Link>
          </motion.div>

          <motion.div whileHover="hover" variants={navItemVariants}>
            <Link
              href="/contact"
              className="flex items-center space-x-2 px-4 py-2 text-emerald-400 hover:text-emerald-400 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <HiMail className="w-4 h-4" /> {/* Updated Icon for Contact */}
              <span>Contact</span>
            </Link>
          </motion.div>

          <motion.button
            whileHover="hover"
            variants={navItemVariants}
            onClick={() => {
              setIsMobileMenuOpen(false);
              logout();
            }}
            className="flex items-center space-x-2 px-4 py-2 text-emerald-400 hover:text-red-400 transition-colors w-full"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </motion.button>
        </>
      ) : (
        <motion.div whileHover="hover" variants={navItemVariants}>
          <Link
            href="/"
            className="flex items-center space-x-2 px-4 py-2 text-emerald-400 hover:text-emerald-400 transition-colors bg-gray-800/50 hover:bg-gray-700/50 rounded-lg"
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
            <Link href="/" className="flex items-center space-x-2 relative">
              {/* Animated icon sequence */}
              <div className="relative w-10 h-10 flex items-center justify-center">
                <CreditCard
                  className={`absolute w-8 h-8 text-emerald-400 transition-all duration-500 ease-in-out ${
                    animationStage === 0
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-75"
                  }`}
                />
                <ArrowRight
                  className={`absolute w-8 h-8 text-emerald-500 transition-all duration-500 ease-in-out ${
                    animationStage === 1
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-75"
                  }`}
                />
                <Building
                  className={`absolute w-8 h-8 text-emerald-600 transition-all duration-500 ease-in-out ${
                    animationStage === 2
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-75"
                  }`}
                />
                <div
                  className={`absolute flex items-center justify-center transition-all duration-500 ease-in-out ${
                    animationStage === 3
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-75"
                  }`}
                >
                  <span className="text-2xl font-extrabold bg-gradient-to-r from-emerald-400 to-emerald-600 text-transparent bg-clip-text">
                  ₹
                  </span>
                </div>
              </div>

              {/* PB Logo Text with shimmer effect */}
              <div className="h-6  overflow-hidden">
                <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 text-transparent bg-clip-text inline-block animate-typing">
                  PaymentBuddy
                </span>
              </div>

              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse opacity-70 mt-5" />
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
            <div className="flex flex-col py-4 space-y-1 bg-black rounded-s-2xl text-emerald-400 ">
              <NavItems />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
