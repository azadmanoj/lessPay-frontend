import React from 'react'

const Footer = () => {
  return (
    <footer className="fixed mt-8 bottom-0 left-0 right-0 z-50 bg-gray-900/30 border-b border-gray-800/50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <p className="text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} LessPay. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer