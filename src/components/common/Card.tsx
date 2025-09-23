// src/components/common/Card.tsx
import React from "react";

interface CardProps {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, action, children, className = "" }) => (
  <div className={`rounded-2xl border bg-white p-4 shadow-sm ${className}`}>
    <div className="mb-3 flex items-center justify-between">
      <h3 className="text-base font-semibold">{title}</h3>
      {action}
    </div>
    {children}
  </div>
);

export default Card;