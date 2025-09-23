import React, { useState } from "react";
import Card from "../common/Card";
import Select from "../common/Select";
import Badge from "../common/Badge";

function Orders({ receipts }) {
  const [statusFilter, setStatusFilter] = useState("All");
  const rows = receipts.map((r) => ({ ...r, status: "Completed" }));
  const filtered = rows.filter((r) => statusFilter === "All" || r.status === statusFilter);

  return (
    <div className="grid grid-cols-12 gap-4">
      <Card className="col-span-12" title="Orders" action={<Select value={statusFilter} onChange={(e)=>setStatusFilter(e.target.value)}>
        <option>All</option>
        <option>Pending</option>
        <option>In-Progress</option>
        <option>Completed</option>
      </Select>}>
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-gray-600">
                <th className="p-2">Order #</th>
                <th className="p-2">Date</th>
                <th className="p-2">Customer</th>
                <th className="p-2">Items</th>
                <th className="p-2">Total</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-b">
                  <td className="p-2 font-medium">{r.id}</td>
                  <td className="p-2">{new Date(r.date).toLocaleString()}</td>
                  <td className="p-2">{r.customer}</td>
                  <td className="p-2">{r.lines.map((l) => l.name).join(", ")}</td>
                  <td className="p-2">${r.totals.total.toFixed(2)}</td>
                  <td className="p-2"><Badge tone="blue">Request</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export default Orders;