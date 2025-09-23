// src/constants/tabs.ts
export const TABS = [
  { key: "pos" as const, label: "POS", emoji: "🧾" },
  { key: "orders" as const, label: "Orders", emoji: "📦" },
  { key: "receipts" as const, label: "Receipts", emoji: "🧾" },
  { key: "inventory" as const, label: "Inventory", emoji: "📦" },
  { key: "stock" as const, label: "Stock", emoji: "📈" },
  { key: "reports" as const, label: "Reports", emoji: "📊" },
  { key: "settings" as const, label: "Settings", emoji: "⚙️" },
] as const;