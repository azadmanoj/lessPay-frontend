import React from "react";
import { FaCcVisa, FaCcMastercard, FaCcDiscover } from "react-icons/fa"; // import icons for Visa, MasterCard, and others
import { BsQrCode } from "react-icons/bs"; // QR code for UPI or mobile payment

const Footer = () => {
  return (
    <footer className="fixed  bottom-0 left-0 right-0 z-50 bg-gray-900/30 border-b border-gray-800/50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center gap-6 mb-4">
          <FaCcVisa size={30} className="text-white hover:text-gray-400" />
          <FaCcMastercard
            size={30}
            className="text-white hover:text-gray-400"
          />
          <FaCcDiscover size={30} className="text-white hover:text-gray-400" />

          <BsQrCode size={30} className="text-white hover:text-gray-400" />
        </div>
        <p className="text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} PaymentBuddy. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
