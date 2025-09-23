// src/components/common/Input.tsx
import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input: React.FC<InputProps> = ({ label, ...props }) => {
  return (
    <div className="flex flex-col">
      {label && <label className="text-sm text-gray-600 mb-1">{label}</label>}
      <input
        {...props}
        className="rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
      />
    </div>
  );
};

export default Input;
