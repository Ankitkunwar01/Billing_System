// src/components/Reports/Reports.tsx
import React, { useMemo, useState } from "react";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import Card from "../common/Card";
import Input from "../common/Input";
import Select from "../common/Select";
import Button from "../common/Button";
import { currency } from "../../utils/currency";
import EXPENSE_CATEGORIES from "../../constants/expenseCategories";
import Pill from "../common/Pill";

interface Receipt {
  id: string;
  date: string;
  totals: { total: number; sub: number };
}

interface Expense {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
}

interface ReportsProps {
  receipts: Receipt[];
  expenses: Expense[];
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
}

function Reports({ receipts, expenses, setExpenses }: ReportsProps) {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [expForm, setExpForm] = useState({ category: "Rent", description: "", amount: 0 });

  const filteredReceipts = useMemo(() => {
    const sDate = start ? new Date(start) : null;
    const eDate = end ? new Date(end) : null;
    return receipts.filter((r) => {
      const d = new Date(r.date);
      return (!sDate || d >= sDate) && (!eDate || d <= eDate);
    });
  }, [receipts, start, end]);

  const revenue = filteredReceipts.reduce((s, r) => s + r.totals.total, 0);
  const cogs = filteredReceipts.reduce((s, r) => s + r.totals.sub * 0.35, 0);
  const grossProfit = revenue - cogs;
  const operatingExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const netProfit = grossProfit - operatingExpenses;

  const chartData = filteredReceipts.map((r) => ({
    date: new Date(r.date).toLocaleDateString(),
    sales: r.totals.total,
    pretax: r.totals.sub,
  }));

  const addExpense = () => {
    setExpenses((prev) => [
      { id: crypto.randomUUID(), date: new Date().toISOString(), ...expForm, amount: +expForm.amount },
      ...prev,
    ]);
    setExpForm({ category: "Rent", description: "", amount: 0 });
  };

  return (
    <div className="grid grid-cols-12 gap-4">
      <Card className="col-span-12" title="Filters">
        <div className="grid grid-cols-6 gap-3">
          <Input label="Start Date" type="date" value={start} onChange={(e) => setStart(e.target.value)} />
          <Input label="End Date" type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
          <div className="flex items-end">
            <Pill>{filteredReceipts.length} receipts</Pill>
          </div>
        </div>
      </Card>

      <div className="col-span-12 grid grid-cols-4 gap-4">
        <Card title="Revenue">
          <div className="text-2xl font-bold">{currency(revenue)}</div>
        </Card>
        <Card title="COGS (est.)">
          <div className="text-2xl font-bold">{currency(cogs)}</div>
        </Card>
        <Card title="Gross Profit">
          <div className="text-2xl font-bold">{currency(grossProfit)}</div>
        </Card>
        <Card title="Net Profit">
          <div className="text-2xl font-bold">{currency(netProfit)}</div>
        </Card>
      </div>

      <Card className="col-span-7" title="Sales Over Time">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sales" name="Sales" stroke="#8884d8" strokeWidth={2} />
              <Line type="monotone" dataKey="pretax" name="Pre-tax" stroke="#82ca9d" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <Card className="col-span-5" title="Add Operating Expense">
        <div className="grid gap-2">
          <Select
            label="Category"
            value={expForm.category}
            onChange={(e) => setExpForm({ ...expForm, category: e.target.value })}
          >
            {EXPENSE_CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </Select>
          <Input
            label="Description"
            value={expForm.description}
            onChange={(e) => setExpForm({ ...expForm, description: e.target.value })}
          />
          <Input
            label="Amount"
            type="number"
            step="0.01"
            value={expForm.amount}
            onChange={(e) => setExpForm({ ...expForm, amount: Number(e.target.value) })}
          />
          <div className="flex justify-end">
            <Button variant="primary" onClick={addExpense}>
              Add Expense
            </Button>
          </div>
        </div>
      </Card>

      <Card className="col-span-12" title="Expense Ledger">
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-gray-600">
                <th className="p-2">Date</th>
                <th className="p-2">Category</th>
                <th className="p-2">Description</th>
                <th className="p-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((e) => (
                <tr key={e.id} className="border-b">
                  <td className="p-2">{new Date(e.date).toLocaleString()}</td>
                  <td className="p-2">{e.category}</td>
                  <td className="p-2">{e.description}</td>
                  <td className="p-2">{currency(e.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export default Reports;