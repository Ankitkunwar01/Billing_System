import React from "react";

const Select = ({ label, children, ...props }) => (
  <label className="grid gap-1 text-sm">
    {label && <span className="text-gray-600">{label}</span>}
    <select {...props} className="rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black">{children}</select>
  </label>
);

export default Select;