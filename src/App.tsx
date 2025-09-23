// src/App.tsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import POS from "./components/POS/POS"; // Add .tsx if needed
import Receipts from "./components/Receipts/Receipts";
import Inventory from "./components/Inventory/Inventory";
import Stock from "./components/Stock/Stock";
import Reports from "./components/Reports/Reports";
import Settings from "./components/Settings/Settings";
import Orders from "./components/Orders/Orders";
import Tab from "./components/common/Tab";
import { TABS } from "./constants/tabs";
import INITIAL_STOCK from "./constants/initialStock";
import { Receipt, StockItem, Expense } from "./types/index";

// Type for tab key
type TabKey = typeof TABS[number]["key"];

// Interface for movement
interface Movement {
  id: string;
  date: string;
  sku: string;
  item: string;
  qty: number;
  reason: string;
}

const App: React.FC = () => {
  const [tab, setTab] = useState<TabKey>(TABS[0].key);
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [stock, setStock] = useState<StockItem[]>(INITIAL_STOCK);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [defaultTax, setDefaultTax] = useState<number>(13);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const onCompleteOrder = (receipt: Receipt) => {
    setReceipts((prev) => [receipt, ...prev]);
    setStock((prev) =>
      prev.map((p) => {
        const used = receipt.lines.find((l) => l.sku === p.sku);
        if (!used) return p;
        return { ...p, onHand: Math.max(0, p.onHand - used.qty) };
      })
    );
    setMovements((prev) => [
      ...receipt.lines.map((l) => ({ 
        id: crypto.randomUUID?.() || Date.now().toString(), // Fallback for older browsers
        date: new Date().toISOString(), 
        sku: l.sku, 
        item: l.name, 
        qty: -l.qty, 
        reason: "Sale" 
      })),
      ...prev,
    ]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-7xl">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-black text-white">☕</div>
            <div>
              <div className="text-xl font-bold">Cafe Billing Management</div>
              <div className="text-xs text-gray-500">All-in-one POS • Receipts • Inventory • Reports</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {TABS.map((t) => (
              <Tab 
                key={t.key} 
                label={t.label} 
                active={tab === t.key} 
                onClick={() => setTab(t.key)} 
                icon={<span>{t.emoji}</span>} 
              />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={tab} 
            initial={{ opacity: 0, y: 8 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {tab === "pos" && <POS onCompleteOrder={onCompleteOrder} />}
            {tab === "orders" && <Orders receipts={receipts} />}
            {tab === "receipts" && <Receipts receipts={receipts} />}
            {tab === "inventory" && <Inventory stock={stock} setStock={setStock} />}
            {tab === "stock" && <Stock stock={stock} movements={movements} setMovements={setMovements} />}
            {tab === "reports" && <Reports receipts={receipts} stock={stock} expenses={expenses} setExpenses={setExpenses} />}
            {tab === "settings" && <Settings defaultTax={defaultTax} setDefaultTax={setDefaultTax} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default App;