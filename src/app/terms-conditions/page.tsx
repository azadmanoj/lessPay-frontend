/* eslint-disable react/no-unescaped-entities */
import React from 'react'

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="px-6 py-8 sm:p-10">
          <h1 className="text-3xl font-extrabold text-center text-emerald-600 mb-8">
            PaymentBuddy Terms and Conditions
          </h1>

          <div className="prose prose-emerald max-w-none">
            <section className="mb-6">
              <h2 className="text-xl font-semibold text-emerald-700 border-b-2 border-emerald-200 pb-2 mb-4">
                1. Acceptance of Terms
              </h2>
              <p className="text-gray-700">
                Welcome to PaymentBuddy . By creating an account and using our services, you agree to these Terms and Conditions.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold text-emerald-700 border-b-2 border-emerald-200 pb-2 mb-4">
                2. User Eligibility
              </h2>
              <p className="text-gray-700">To use PaymentBuddy, you must:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Be at least 18 years old</li>
                <li>Have legal capacity to enter into a contract</li>
                <li>Provide accurate and current information</li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold text-emerald-700 border-b-2 border-emerald-200 pb-2 mb-4">
                3. Account Responsibilities
              </h2>
              <p className="text-gray-700">You are responsible for:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Maintaining the confidentiality of your account</li>
                <li>All activities conducted under your account</li>
                <li>Ensuring the accuracy of your personal information</li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold text-emerald-700 border-b-2 border-emerald-200 pb-2 mb-4">
                4. Payment Services
              </h2>
              <p className="text-gray-700">
                We provide digital payment and money transfer services subject to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Transaction limits</li>
                <li>Verification processes</li>
                <li>Compliance with financial regulations</li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold text-emerald-700 border-b-2 border-emerald-200 pb-2 mb-4">
                5. User Conduct
              </h2>
              <p className="text-gray-700">You agree NOT to:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Use the service for illegal activities</li>
                <li>Misrepresent your identity</li>
                <li>Share account credentials</li>
                <li>Attempt to breach our security systems</li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold text-emerald-700 border-b-2 border-emerald-200 pb-2 mb-4">
                6. Privacy and Data Protection
              </h2>
              <p className="text-gray-700">
                We collect and process your personal information in accordance with our Privacy Policy.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold text-emerald-700 border-b-2 border-emerald-200 pb-2 mb-4">
                7. Financial Transactions
              </h2>
              <p className="text-gray-700">You acknowledge that:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Transactions are subject to available balance</li>
                <li>We are not liable for transactions to incorrect recipients</li>
                <li>Fees may apply to certain transactions</li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold text-emerald-700 border-b-2 border-emerald-200 pb-2 mb-4">
                8. Intellectual Property
              </h2>
              <p className="text-gray-700">
                All content on PaymentBuddy is our intellectual property.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold text-emerald-700 border-b-2 border-emerald-200 pb-2 mb-4">
                9. Limitation of Liability
              </h2>
              <p className="text-gray-700">PaymentBuddy is not responsible for:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Indirect or consequential damages</li>
                <li>Financial losses from transactions</li>
                <li>External system failures</li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold text-emerald-700 border-b-2 border-emerald-200 pb-2 mb-4">
                10. Termination
              </h2>
              <p className="text-gray-700">We may terminate your account for:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Violation of these Terms</li>
                <li>Suspicious activity</li>
                <li>Inactivity</li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold text-emerald-700 border-b-2 border-emerald-200 pb-2 mb-4">
                11. Governing Law
              </h2>
              <p className="text-gray-700">
                These Terms are governed by the laws of India.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold text-emerald-700 border-b-2 border-emerald-200 pb-2 mb-4">
                12. Changes to Terms
              </h2>
              <p className="text-gray-700">
                We may update these Terms. Continued use constitutes acceptance.
              </p>
            </section>

            <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 mt-8">
              <p className="text-emerald-700 italic">
                By checking the box during registration, you acknowledge that you have read, understood, and agree to these Terms and Conditions.
              </p>
            </div>

            <div className="text-center text-gray-500 mt-6">
              <p>Last Updated: March 2025</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TermsAndConditions