import React, { forwardRef, ReactNode } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  success?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, success, leftIcon, rightIcon, className = "", ...props }, ref) => {
    const baseClass = "w-full px-4 py-3 rounded-lg border text-gray-900 placeholder-gray-500 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200";
    const statusClass = error 
      ? "border-red-300 focus:ring-red-500"
      : success
      ? "border-green-300 focus:ring-green-500"
      : "border-gray-300";

    return (
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-3.5 text-gray-400">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          className={`${baseClass} ${statusClass} ${leftIcon ? 'pl-10' : ''} ${rightIcon ? 'pr-10' : ''} ${className}`}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-3.5">
            {rightIcon}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
