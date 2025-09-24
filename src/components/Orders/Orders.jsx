import React, { useState, useMemo } from "react";
import Card from "../common/Card";
import Input from "../common/Input";
import Select from "../common/Select";
import Button from "../common/Button";
import Badge from "../common/Badge";
import Pill from "../common/Pill";

function Orders({ receipts }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const rows = receipts.map((r) => ({ ...r, status: "Completed" }));

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      // Status filter
      if (statusFilter !== "All" && r.status !== statusFilter) return false;

      // Payment method filter
      if (paymentFilter !== "All" && r.paymentMethod !== paymentFilter) return false;

      // Date range filter
      const orderDate = new Date(r.date);
      if (dateFrom && orderDate < new Date(dateFrom)) return false;
      if (dateTo && orderDate > new Date(dateTo + "T23:59:59")) return false;

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const searchFields = [
          r.id.toLowerCase(),
          r.customer.toLowerCase(),
          r.paymentMethod?.toLowerCase() || "",
          r.lines.map((l) => l.name.toLowerCase()).join(" "),
          r.lines.map((l) => l.sku?.toLowerCase() || "").join(" "),
          r.totals.total.toFixed(2)
        ];
        if (!searchFields.some((field) => field.includes(query))) return false;
      }

      return true;
    });
  }, [rows, statusFilter, searchQuery, dateFrom, dateTo, paymentFilter]);

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("All");
    setPaymentFilter("All");
    setDateFrom("");
    setDateTo("");
  };

  const hasActiveFilters =
    searchQuery || statusFilter !== "All" || paymentFilter !== "All" || dateFrom || dateTo;

  return (
    <div className="grid grid-cols-12 gap-4">
      {/* Search & Filters */}
      <Card className="col-span-12" title="Search & Filters">
        <div className="grid grid-cols-6 gap-3">
          <Input
            label="Search Orders"
            placeholder="Search by order #, customer, items, SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Status">
            <option>All</option>
            <option>Pending</option>
            <option>In-Progress</option>
            <option>Completed</option>
          </Select>
          <Select value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)} label="Payment Method">
            <option>All</option>
            <option>Cash</option>
            <option>Card</option>
            <option>QR / Wallet</option>
            <option>Gift Card</option>
          </Select>
          <Input type="date" label="Date From" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
          <Input type="date" label="Date To" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
          <div className="flex items-end gap-2">
            <Button variant="outline" onClick={clearFilters} disabled={!hasActiveFilters}>
              Clear Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Orders Table */}
      <Card
        className="col-span-12"
        title="Orders"
        action={
          <div className="flex items-center gap-2">
            <Pill>
              {filtered.length} of {rows.length} orders
            </Pill>
            {hasActiveFilters && <Badge tone="blue">Filtered</Badge>}
          </div>
        }
      >
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
              {filtered.length > 0 ? (
                filtered.map((r) => (
                  <tr key={r.id} className="border-b">
                    <td className="p-2 font-medium">{r.id}</td>
                    <td className="p-2">{new Date(r.date).toLocaleString()}</td>
                    <td className="p-2">{r.customer}</td>
                    <td className="p-2">{r.lines.map((l) => l.name).join(", ")}</td>
                    <td className="p-2">${r.totals.total.toFixed(2)}</td>
                    <td className="p-2">
                      <Badge tone="blue">{r.status}</Badge>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    {hasActiveFilters
                      ? "No orders match the current filters"
                      : "No orders found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export default Orders;
