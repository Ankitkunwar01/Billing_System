import React from "react";

const Badge = ({ children, tone = "gray" }) => (
  <span
    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
      tone === "green"
        ? "bg-green-100 text-green-700"
        : tone === "red"
        ? "bg-red-100 text-red-700"
        : tone === "blue"
        ? "bg-blue-100 text-blue-700"
        : "bg-gray-100 text-gray-700"
    }`}
  >
    {children}
  </span>
);

export default Badge;