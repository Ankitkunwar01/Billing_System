// src/components/common/Button.tsx
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "soft" | "default";
  children: React.ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ children, onClick, variant = "default", className = "", type = "button" }) => (
  <button
    type={type}
    onClick={onClick}
    className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${
      variant === "primary"
        ? "bg-black text-white hover:bg-gray-900"
        : variant === "outline"
        ? "border bg-white text-gray-800 hover:bg-gray-50"
        : variant === "soft"
        ? "bg-gray-100 text-gray-800 hover:bg-gray-200"
        : "bg-white text-gray-800 hover:bg-gray-50 border"
    } ${className}`}
  >
    {children}
  </button>
);

export default Button;