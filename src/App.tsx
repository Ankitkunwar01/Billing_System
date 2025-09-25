// src/App.tsx
import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import POS from "./components/POS/POS";
import Receipts from "./components/Receipts/Receipts";
import Inventory from "./components/Inventory/Inventory";
import Stock from "./components/Stock/Stock";
import Reports from "./components/Reports/Reports";
import Settings from "./components/Settings/Settings";
import Orders from "./components/Orders/Orders";
import Login from "./components/Auth/Login";
import SignUp from "./components/Auth/SignUp";
import Tab from "./components/common/Tab";

import { TABS } from "./constants/tabs";
import INITIAL_STOCK from "./constants/initialStock";
import { Receipt, StockItem, Expense } from "./types";

// Type for tab keys
type TabKey = (typeof TABS)[number]["key"];

interface Movement {
  id: string;
  date: string;
  sku: string;
  item: string;
  qty: number;
  reason: string;
}

const App: React.FC = () => {
  const [tab, setTab] = useState<TabKey>("login");
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [stock, setStock] = useState<StockItem[]>([...INITIAL_STOCK]);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [defaultTax, setDefaultTax] = useState<number>(13);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [authed, setAuthed] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<{ username: string; name?: string } | null>(null);

  // Handle order completion
  const handleCompleteOrder = (receipt: Receipt) => {
    setReceipts((prev) => [receipt, ...prev]);

    setStock((prev) =>
      prev.map((item) => {
        const used = receipt.lines.find((line) => line.sku === item.sku);
        if (!used) return item;
        return { ...item, onHand: Math.max(0, item.onHand - used.qty) };
      })
    );

    const newMovements: Movement[] = receipt.lines.map((line) => ({
      id: crypto.randomUUID?.() || Date.now().toString(),
      date: new Date().toISOString(),
      sku: line.sku,
      item: line.name,
      qty: -line.qty,
      reason: "Sale",
    }));

    setMovements((prev) => [...newMovements, ...prev]);
  };

  const handleLogin = (p?: { username?: string; password?: string }) => {
    const username = (p?.username || "").trim();
    const password = (p?.password || "").trim();

    if (!username || !password) {
      window.alert("Incorrect username or password. Please try again.");
      return;
    }

    const raw = localStorage.getItem("users");
    const users: Record<string, { username: string; name?: string; email?: string; password: string }> = raw ? JSON.parse(raw) : {};
    const user = users[username];

    if (!user || user.password !== password) {
      window.alert("Incorrect username or password. Please try again.");
      return;
    }

    setAuthed(true);
    setCurrentUser({ username: user.username, name: user.name });
    document.cookie = `session_id=${crypto.randomUUID?.() || Date.now().toString()}; path=/;`;
    document.cookie = `user_id=${encodeURIComponent(username)}; path=/;`;
    setTab("pos");
    window.alert("Login successful");
  };

  const handleSignUp = (p?: { username?: string; name?: string; email?: string; password?: string }) => {
    const username = (p?.username || "").trim();
    const name = (p?.name || "").trim();
    const email = (p?.email || "").trim();
    const password = (p?.password || "").trim();

    if (!username || !password) {
      window.alert("Please provide a username and password.");
      return;
    }

    const raw = localStorage.getItem("users");
    const users: Record<string, { username: string; name?: string; email?: string; password: string }> = raw ? JSON.parse(raw) : {};

    if (users[username]) {
      window.alert("Username already exists. Please choose another.");
      return;
    }

    users[username] = { username, name, email, password };
    localStorage.setItem("users", JSON.stringify(users));

    // After signup, redirect to login (do not auto-login)
    setAuthed(false);
    setCurrentUser(null);
    setTab("login");
    window.alert("Account Created Successfully!");
  };

  const handleLogout = () => {
    setAuthed(false);
    setCurrentUser(null);
    setTab("login");
    // Expire cookies
    document.cookie = "session_id=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;";
    document.cookie = "user_id=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;";
  };

  const visibleTabs = useMemo(() => {
    if (!authed) return TABS.filter((t) => t.key === "login" || t.key === "signup");
    return TABS.filter((t) => t.key !== "login" && t.key !== "signup");
  }, [authed]);

  return (
    <div style={{ padding: "16px", fontFamily: "Arial, sans-serif" }}>
      {/* Header */}
      <header
        style={{
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              display: "grid",
              placeItems: "center",
              borderRadius: "12px",
              backgroundColor: "black",
              color: "white",
              fontSize: "18px",
            }}
          >
            ☕
          </div>
          <div>
            <h1 style={{ fontSize: "20px", fontWeight: "bold", margin: 0 }}>
              Cafe Billing Management
            </h1>
            {authed && currentUser?.username && (
              <p style={{ fontSize: "12px", color: "gray", margin: 0 }}>
                {currentUser.username}
              </p>
            )}
          </div>
        </div>

        {/* Tabs */}
        <nav style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {visibleTabs.map((t) => (
            <Tab
              key={t.key}
              label={t.label}
              active={tab === t.key}
              onClick={() => setTab(t.key)}
              icon={<span>{t.emoji}</span>}
            />
          ))}
          {authed && (
            <button className="tab" data-active="false" onClick={handleLogout}>
              ⚙️ Logout
            </button>
          )}
        </nav>
      </header>

      {/* Page Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {!authed && tab === "login" && (
            <Login onSubmit={(p) => handleLogin(p)} />
          )}
          {!authed && tab === "signup" && (
            <SignUp onSubmit={(p) => handleSignUp(p)} />
          )}

          {authed && tab === "pos" && <POS onCompleteOrder={handleCompleteOrder} />}
          {authed && tab === "orders" && <Orders receipts={receipts} />}
          {authed && tab === "receipts" && <Receipts receipts={receipts} />}
          {authed && tab === "inventory" && <Inventory stock={stock} setStock={setStock} />}
          {authed && tab === "stock" && (
            <Stock
              stock={stock}
              movements={movements}
              setMovements={setMovements}
            />
          )}
          {authed && tab === "reports" && (
            <Reports
              receipts={receipts}
              expenses={expenses}
              setExpenses={setExpenses}
            />
          )}
          {authed && tab === "settings" && (
            <Settings defaultTax={defaultTax} setDefaultTax={setDefaultTax} currentUser={currentUser} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default App;
