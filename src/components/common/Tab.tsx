// src/components/common/Tab.tsx
import React from "react";

interface TabProps {
  label: string;
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
}

const Tab: React.FC<TabProps> = ({ label, active, onClick, icon }) => (
  <button
    className="tab"
    active={active.toString()}
    onClick={onClick}
  >
    {icon}
    {label}
  </button>
);

export default Tab;