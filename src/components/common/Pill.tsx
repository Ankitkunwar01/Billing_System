// src/components/common/Pill.tsx
import React from "react";

interface PillProps {
  children: React.ReactNode;
}

const Pill: React.FC<PillProps> = ({ children }) => (
  <span className="inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs">{children}</span>
);

export default Pill;